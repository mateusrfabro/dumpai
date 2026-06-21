import { NextResponse } from "next/server";
import { ErroIA, curarFotos } from "@/lib/curate";
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
  const tokenAcesso = lerCookieAcesso(req);
  if (paywallAtivo && !verificarAcesso(tokenAcesso)) {
    return erro(
      "Acesso não liberado. Entre com o e-mail da sua compra para liberar a IA.",
      401,
    );
  }
  const emailAcesso = paywallAtivo ? emailDoCookie(tokenAcesso) : null;

  // Revalida o pagamento a cada geração: reembolso/chargeback (webhook apaga o
  // registro no KV) bloqueia o acesso mesmo se o cookie ainda for válido.
  if (emailAcesso && !(await confirmarPagamentoAtivo(emailAcesso))) {
    return erro(
      "Seu acesso não está mais ativo. Em caso de dúvida, fale com o suporte.",
      401,
    );
  }

  // Lê o corpo com TETO REAL de bytes (não confia no header content-length, que
  // pode vir ausente/mentido). Base64 infla ~33%, então cortamos pelo tamanho real.
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

  let body: CuratePayload;
  try {
    body = JSON.parse(raw) as CuratePayload;
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

  // Limite por compra: checa ANTES (sem consumir) e só consome no SUCESSO da IA —
  // assim uma falha de infra nunca cobra uma geração que o cliente não recebeu.
  if (emailAcesso && (await contarUsos(emailAcesso)) >= MAX_USOS) {
    return erro(
      `Você já usou suas ${MAX_USOS} gerações desta compra. 💛 Para gerar mais dumps, é só liberar de novo.`,
      403,
    );
  }

  try {
    const resultado = await curarFotos(images, objetivo);
    const restantes = emailAcesso ? await consumirUso(emailAcesso) : MAX_USOS;
    return NextResponse.json<ResultadoCuradoria>({ ...resultado, restantes });
  } catch (err) {
    // Só repassa mensagens seguras (ErroIA); o resto vira genérico + log no server.
    if (err instanceof ErroIA) return erro(err.message, 502);
    console.error("[curate] erro inesperado:", err);
    return erro("Erro inesperado. Tente novamente.", 500);
  }
}
