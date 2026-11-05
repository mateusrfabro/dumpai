// Rota de análise do FotoMatch. Equivale ao /api/curate do DumpAI.
// Mesma blindagem: rate limit por IP → paywall (cookie HMAC) → revalida pagamento
// no KV → teto real de bytes → valida entrada → limite de usos por compra →
// só consome 1 uso APÓS o sucesso da IA.
//
// REUTILIZA sem mudança: checarRateLimit, todo o módulo acesso.ts (só os NOMES de
// env/cookie mudam dentro do próprio acesso.ts — ver inventário).

import { NextResponse } from "next/server";
import { ErroIA, analisarFotos } from "@/lib/analisar";
import { checarRateLimit } from "@/lib/ratelimit";
import {
  MAX_USOS,
  confirmarPagamentoAtivo,
  consumirUso,
  contarUsos,
  emailDoCookie,
  lerCookieAcesso,
  paywallAtivo,
  verificarAcesso,
} from "@/lib/acesso";
import {
  MAX_FOTOS,
  MIN_FOTOS,
  MODOS,
  MODO_PADRAO,
  type AnalisePayload,
  type ApiError,
  type ModoId,
  type ResultadoAnalise,
} from "@/lib/types";

// Vision precisa do runtime Node (SDK da Anthropic). maxDuration dá folga p/ análises grandes.
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PAYLOAD_MB = Number(process.env.MAX_PAYLOAD_MB) || 25;
const MAX_PAYLOAD_BYTES = MAX_PAYLOAD_MB * 1024 * 1024;

function erro(mensagem: string, status: number) {
  return NextResponse.json<ApiError>({ error: mensagem }, { status });
}

export async function POST(req: Request) {
  // Rate limit por IP — protege o crédito da Anthropic. Rejeita antes de parsear o body.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const limite = await checarRateLimit(ip);
  if (!limite.ok) {
    return erro(
      "Você fez muitas análises em pouco tempo. Tente de novo daqui a pouco. ⏳",
      429,
    );
  }

  // Paywall real: exige o cookie de acesso (só quando PAYWALL_ATIVO=true).
  const tokenAcesso = lerCookieAcesso(req);
  if (paywallAtivo && !verificarAcesso(tokenAcesso)) {
    return erro(
      "Acesso não liberado. Entre com o e-mail da sua compra para liberar a IA.",
      401,
    );
  }
  const emailAcesso = paywallAtivo ? emailDoCookie(tokenAcesso) : null;

  // Revalida o pagamento a cada análise (reembolso/chargeback bloqueia mesmo com cookie válido).
  if (emailAcesso && !(await confirmarPagamentoAtivo(emailAcesso))) {
    return erro(
      "Seu acesso não está mais ativo. Em caso de dúvida, fale com o suporte.",
      401,
    );
  }

  // Teto REAL de bytes (não confia no content-length). Base64 infla ~33%.
  let raw: string;
  try {
    const buf = await req.arrayBuffer();
    if (buf.byteLength > MAX_PAYLOAD_BYTES) {
      return erro(
        `Envio muito grande (limite ${MAX_PAYLOAD_MB}MB). Envie menos fotos.`,
        413,
      );
    }
    raw = Buffer.from(buf).toString("utf8");
  } catch {
    return erro("Requisição inválida.", 400);
  }

  let body: AnalisePayload;
  try {
    body = JSON.parse(raw) as AnalisePayload;
  } catch {
    return erro("Requisição inválida.", 400);
  }

  const images = body?.images;
  if (!Array.isArray(images) || images.some((i) => typeof i !== "string")) {
    return erro("Formato de imagens inválido.", 400);
  }
  // FotoMatch: 6 a 15 fotos (em vez de 2..30 do DumpAI).
  if (images.length < MIN_FOTOS) {
    return erro(`Envie pelo menos ${MIN_FOTOS} fotos suas.`, 400);
  }
  if (images.length > MAX_FOTOS) {
    return erro(`Máximo de ${MAX_FOTOS} fotos por vez.`, 400);
  }

  // Modo é opcional; valida contra a lista conhecida (fallback no padrão).
  const modo: ModoId = MODOS.some((o) => o.id === body?.modo)
    ? (body.modo as ModoId)
    : MODO_PADRAO;

  // Limite por compra: checa ANTES (sem consumir) e só consome no SUCESSO da IA.
  if (emailAcesso && (await contarUsos(emailAcesso)) >= MAX_USOS) {
    return erro(
      `Você já usou suas ${MAX_USOS} análises desta compra. 💛 Para analisar mais fotos, é só liberar de novo.`,
      403,
    );
  }

  try {
    const resultado = await analisarFotos(images, modo);
    const restantes = emailAcesso ? await consumirUso(emailAcesso) : MAX_USOS;
    return NextResponse.json<ResultadoAnalise>({ ...resultado, restantes });
  } catch (err) {
    if (err instanceof ErroIA) return erro(err.message, 502);
    console.error("[analisar] erro inesperado:", err);
    return erro("Erro inesperado. Tente novamente.", 500);
  }
}
