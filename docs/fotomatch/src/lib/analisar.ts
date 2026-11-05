// Lógica server-side da análise. Roda APENAS na API Route — nunca no client.
// A ANTHROPIC_API_KEY é lida aqui e jamais chega ao bundle do navegador.
//
// Adaptação fiel do curate.ts do DumpAI. Diferenças:
//  - A IA ESCOLHE a melhor foto de perfil (não monta um dump de 10).
//  - Saída: ranking (top 3, melhor primeiro) + justificativa da vencedora.
//  - Dois modos: "match" (apps de namoro) e "pro" (LinkedIn) — trocam o critério.
//
// A IA ANALISA as imagens; ela NÃO gera nem edita imagem. O stack não produz
// imagem nova — só seleciona entre as que o usuário enviou.

import Anthropic from "@anthropic-ai/sdk";
import {
  ALVO_SELECAO,
  MODOS,
  MODO_PADRAO,
  type ModoId,
  type ResultadoAnalise,
} from "./types";

/** Erro com mensagem segura de mostrar ao usuário (a route repassa só estes). */
export class ErroIA extends Error {}

/** Default barato p/ analisar; troque via env ANTHROPIC_MODEL (ver .env.local.example).
 *  Confirmado atual: claude-haiku-4-5 (200K ctx, $1/$5 por MTok). ~US$0,015/análise (10 fotos). */
const MODELO_PADRAO = "claude-haiku-4-5";

const MEDIA_TYPES_OK = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type FonteImagem = {
  media_type: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  data: string;
};

/** Quebra uma Data URL em media_type + base64 puro, validando o tipo. */
function parseDataUrl(dataUrl: string): FonteImagem | null {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  const media_type = m[1].toLowerCase();
  if (!MEDIA_TYPES_OK.has(media_type)) return null;
  return { media_type: media_type as FonteImagem["media_type"], data: m[2] };
}

const SYSTEM_PROMPT =
  "Você é um especialista em fotografia de perfil e primeira impressão. " +
  "Analise as fotos enviadas de UMA mesma pessoa e escolha a MELHOR foto de " +
  "perfil para o objetivo informado, mais duas alternativas fortes. Baseie a " +
  "decisão na própria imagem: nitidez, luz, enquadramento, expressão e adequação " +
  "ao contexto. Você apenas seleciona entre as fotos recebidas — não gera nem " +
  "edita imagens.";

/**
 * Schema da saída estruturada. Garante JSON válido no formato esperado.
 * (Restrições numéricas de array não são suportadas — validamos no código.)
 */
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    ranking: {
      type: "array",
      items: { type: "integer" },
      description:
        "Índices 0-based das melhores fotos, da MELHOR para a pior (ex: [3, 0, 7]). " +
        "O primeiro é a foto de perfil recomendada. No máximo 3 itens.",
    },
    justificativa: {
      type: "string",
      description:
        "UMA frase curta (máx. 1 linha) dizendo por que a primeira foto é a melhor escolha.",
    },
  },
  required: ["ranking", "justificativa"],
  additionalProperties: false,
};

/** Extrai e concatena o texto da resposta da IA. */
function textoDaResposta(content: Anthropic.Messages.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

/** Normaliza/valida os índices vindos da IA: inteiros únicos no range, no máx. ALVO_SELECAO. */
function sanitizarRanking(brutos: unknown, totalFotos: number): number[] {
  if (!Array.isArray(brutos)) return [];
  const vistos = new Set<number>();
  const ok: number[] = [];
  for (const v of brutos) {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isInteger(n) || n < 0 || n >= totalFotos) continue;
    if (vistos.has(n)) continue;
    vistos.add(n);
    ok.push(n);
    if (ok.length >= ALVO_SELECAO) break;
  }
  return ok;
}

/**
 * Chama o modelo multimodal e devolve a análise validada.
 * Lança ErroIA com mensagem amigável em caso de problema (sem stack trace pro usuário).
 */
export async function analisarFotos(
  dataUrls: string[],
  modo: ModoId = MODO_PADRAO,
): Promise<ResultadoAnalise> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ErroIA(
      "Configuração ausente: defina ANTHROPIC_API_KEY no .env.local.",
    );
  }

  const fontes: FonteImagem[] = [];
  for (const url of dataUrls) {
    const f = parseDataUrl(url);
    if (!f) throw new ErroIA("Uma das imagens está em formato não suportado.");
    fontes.push(f);
  }

  const client = new Anthropic({ apiKey });
  const modelo = process.env.ANTHROPIC_MODEL || MODELO_PADRAO;

  // Intercala um rótulo de índice antes de cada imagem, para a IA referenciá-las.
  const conteudo: Anthropic.Messages.ContentBlockParam[] = [];
  fontes.forEach((src, i) => {
    conteudo.push({ type: "text", text: `Foto índice ${i}:` });
    conteudo.push({ type: "image", source: { type: "base64", ...src } });
  });

  const opcao = MODOS.find((o) => o.id === modo) ?? MODOS[0];
  conteudo.push({
    type: "text",
    text:
      `Objetivo: escolher a melhor ${opcao.hintIA}. ` +
      `Todas as fotos são da mesma pessoa. Escolha a MELHOR foto de perfil ` +
      `para esse objetivo e mais duas alternativas, e retorne os índices 0-based ` +
      `em "ranking" (a melhor primeiro, no máximo 3), e uma frase curta em ` +
      `"justificativa" explicando por que a primeira é a melhor escolha.`,
  });

  let resposta: Anthropic.Messages.Message;
  try {
    resposta = await client.messages.create({
      model: modelo,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: conteudo }],
      output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw new ErroIA("Chave da IA inválida. Verifique ANTHROPIC_API_KEY.");
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new ErroIA("Muitas requisições agora. Tente de novo em instantes.");
    }
    // Loga o erro REAL no servidor (sem as imagens) e devolve mensagem genérica.
    console.error("[analisar] erro da Anthropic:", err);
    throw new ErroIA("A IA está indisponível no momento. Tente novamente.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(textoDaResposta(resposta.content));
  } catch {
    throw new ErroIA("A IA respondeu fora do formato esperado. Tente de novo.");
  }

  const obj = parsed as Record<string, unknown>;
  const ranking = sanitizarRanking(obj?.ranking, fontes.length);
  const justificativa =
    typeof obj?.justificativa === "string" && obj.justificativa.trim()
      ? obj.justificativa.trim()
      : "Essa é a foto com melhor luz, nitidez e expressão pro seu objetivo. ✨";

  if (ranking.length === 0) {
    throw new ErroIA("A IA não conseguiu escolher a foto. Tente outras imagens.");
  }

  return { ranking, vencedora: ranking[0], justificativa };
}
