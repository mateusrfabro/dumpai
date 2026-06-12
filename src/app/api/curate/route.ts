import { NextResponse } from "next/server";
import { curarFotos } from "@/lib/curate";
import { checarRateLimit } from "@/lib/ratelimit";
import { lerCookieAcesso, paywallAtivo, verificarAcesso } from "@/lib/acesso";
import {
  MAX_FOTOS,
  MIN_FOTOS,
  OBJETIVOS,
  OBJETIVO_PADRAO,
  type ApiError,
  type CuratePayload,
  type ObjetivoId,
  type ResultadoCuradoria,
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
  // Rate limit por IP — protege o crédito da Anthropic. Rejeita antes de parsear
  // o body (barato) e conta toda tentativa, inclusive abuso direto via curl.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const limite = await checarRateLimit(ip);
  if (!limite.ok) {
    return erro(
      "Você fez muitas gerações em pouco tempo. Tente de novo daqui a pouco. ⏳",
      429,
    );
  }

  // Paywall real: exige o cookie de acesso (só quando PAYWALL_ATIVO=true).
  // Sem o cookie válido, não gasta crédito com IA. Abrir /success na mão não basta.
  if (paywallAtivo && !verificarAcesso(lerCookieAcesso(req))) {
    return erro(
      "Acesso não liberado. Entre com o e-mail da sua compra para liberar a IA.",
      401,
    );
  }

  // Guarda de tamanho na borda: Base64 infla ~33%, não dá pra deixar estourar memória/timeout.
  const tamanho = Number(req.headers.get("content-length") || 0);
  if (tamanho > MAX_PAYLOAD_BYTES) {
    return erro(
      `Envio muito grande (limite ${MAX_PAYLOAD_MB}MB). Envie menos fotos.`,
      413,
    );
  }

  let body: CuratePayload;
  try {
    body = (await req.json()) as CuratePayload;
  } catch {
    return erro("Requisição inválida.", 400);
  }

  const images = body?.images;
  if (!Array.isArray(images) || images.some((i) => typeof i !== "string")) {
    return erro("Formato de imagens inválido.", 400);
  }
  if (images.length < MIN_FOTOS) {
    return erro(`Envie pelo menos ${MIN_FOTOS} fotos.`, 400);
  }
  if (images.length > MAX_FOTOS) {
    return erro(`Máximo de ${MAX_FOTOS} fotos por vez.`, 400);
  }

  // Objetivo é opcional; valida contra a lista conhecida (fallback no padrão).
  const objetivo: ObjetivoId = OBJETIVOS.some((o) => o.id === body?.objetivo)
    ? (body.objetivo as ObjetivoId)
    : OBJETIVO_PADRAO;

  try {
    const resultado = await curarFotos(images, objetivo);
    return NextResponse.json<ResultadoCuradoria>(resultado);
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Erro inesperado. Tente novamente.";
    return erro(msg, 502);
  }
}
