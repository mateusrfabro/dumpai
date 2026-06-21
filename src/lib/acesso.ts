// Paywall real, server-side. Duas peças:
//  1) Registro de pagamento no KV (gravado pelo webhook da Kiwify).
//  2) Cookie de acesso assinado (HMAC) — não falsificável, HttpOnly.
// O gate só é EXIGIDO quando PAYWALL_ATIVO === "true" (rollout seguro).

import crypto from "crypto";
import { Redis } from "@upstash/redis";

export const COOKIE_NAME = "dumpai_acesso";
const TTL_SEG = 180 * 24 * 60 * 60; // 180 dias

/** Quantas gerações cada compra (e-mail) tem direito. */
export const MAX_USOS = Number(process.env.USOS_POR_COMPRA) || 3;

const COOKIE_SECRET = process.env.DUMPAI_COOKIE_SECRET || "";

export const paywallAtivo = process.env.PAYWALL_ATIVO === "true";

function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function normEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ── Registro de pagamento (KV) ──────────────────────────────────────────────

export async function marcarPago(email: string, orderId: string): Promise<void> {
  const r = redis();
  if (!r || !email) return;
  await r.set(`pago:email:${normEmail(email)}`, orderId || "1", { ex: TTL_SEG });
  if (orderId) await r.set(`pago:order:${orderId}`, normEmail(email), { ex: TTL_SEG });
}

export async function revogarPagoPorEmail(email: string): Promise<void> {
  const r = redis();
  if (!r || !email) return;
  await r.del(`pago:email:${normEmail(email)}`);
}

export async function estaPagoEmail(email: string): Promise<boolean> {
  const r = redis();
  if (!r || !email) return false;
  return Boolean(await r.get(`pago:email:${normEmail(email)}`));
}

/**
 * Confirma que o pagamento AINDA está ativo (não reembolsado/chargeback).
 * Usado a cada geração — assim revogar no webhook tem efeito mesmo com cookie válido.
 * Fail-open se o KV cair (não derruba pagante legítimo numa instabilidade).
 */
export async function confirmarPagamentoAtivo(email: string): Promise<boolean> {
  const r = redis();
  if (!r || !email) return true;
  return Boolean(await r.get(`pago:email:${normEmail(email)}`));
}

/** Retorna o e-mail pago associado a um order_id (ou null). */
export async function emailDoPedido(orderId: string): Promise<string | null> {
  const r = redis();
  if (!r || !orderId) return null;
  const v = await r.get<string>(`pago:order:${orderId}`);
  return v || null;
}

// ── Cookie de acesso assinado ───────────────────────────────────────────────

/** Gera o token assinado: `email|exp|hmac`. */
export function assinarAcesso(email: string): string {
  const exp = Date.now() + TTL_SEG * 1000;
  const corpo = `${normEmail(email)}|${exp}`;
  const sig = crypto
    .createHmac("sha256", COOKIE_SECRET)
    .update(corpo)
    .digest("hex");
  return `${corpo}|${sig}`;
}

/** Verifica o token do cookie (assinatura + validade). */
export function verificarAcesso(token: string | undefined): boolean {
  if (!token || !COOKIE_SECRET) return false;
  const partes = token.split("|");
  if (partes.length !== 3) return false;
  const [email, exp, sig] = partes;
  const esperado = crypto
    .createHmac("sha256", COOKIE_SECRET)
    .update(`${email}|${exp}`)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(esperado);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

/** Extrai o e-mail de dentro do token do cookie (sem revalidar — use após verificar). */
export function emailDoCookie(token: string | undefined): string | null {
  if (!token) return null;
  const partes = token.split("|");
  return partes.length === 3 && partes[0] ? partes[0] : null;
}

// ── Limite de gerações por compra (KV) ──────────────────────────────────────

/** Quantas gerações o e-mail já consumiu (0 se nenhuma / sem KV). */
export async function contarUsos(email: string): Promise<number> {
  const r = redis();
  if (!r || !email) return 0;
  const n = await r.get<number>(`usos:email:${normEmail(email)}`);
  return typeof n === "number" ? n : Number(n) || 0;
}

/**
 * Consome 1 geração do e-mail. Chamar SÓ APÓS o sucesso da IA — assim uma falha
 * de infra nunca cobra uma geração que o cliente não recebeu. Retorna as restantes.
 */
export async function consumirUso(email: string): Promise<number> {
  const r = redis();
  if (!r || !email) return MAX_USOS;
  const key = `usos:email:${normEmail(email)}`;
  const n = await r.incr(key);
  if (n === 1) await r.expire(key, TTL_SEG);
  return Math.max(0, MAX_USOS - n);
}

/** Lê o cookie de acesso do header Cookie de uma Request. */
export function lerCookieAcesso(req: Request): string | undefined {
  const raw = req.headers.get("cookie") || "";
  const item = raw
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE_NAME}=`));
  return item ? decodeURIComponent(item.slice(COOKIE_NAME.length + 1)) : undefined;
}
