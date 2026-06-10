import { NextResponse } from "next/server";
import { curarFotos } from "@/lib/curate";
import {
  MAX_FOTOS,
  MIN_FOTOS,
  type ApiError,
  type CuratePayload,
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

  try {
    const resultado = await curarFotos(images);
    return NextResponse.json<ResultadoCuradoria>(resultado);
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Erro inesperado. Tente novamente.";
    return erro(msg, 502);
  }
}
