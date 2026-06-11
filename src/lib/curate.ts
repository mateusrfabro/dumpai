// Lógica server-side da curadoria. Roda APENAS na API Route — nunca no client.
// A ANTHROPIC_API_KEY é lida aqui e jamais chega ao bundle do navegador.

import Anthropic from "@anthropic-ai/sdk";
import {
  ALVO_SELECAO,
  OBJETIVOS,
  OBJETIVO_PADRAO,
  type ObjetivoId,
  type ResultadoCuradoria,
} from "./types";

/** Default barato p/ testar; troque via env ANTHROPIC_MODEL (ver .env.local.example). */
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
  "Você é um especialista em estética do Instagram e curador de imagem. " +
  "Analise as fotos enviadas e selecione estritamente as melhores para compor " +
  "um carrossel (photo dump) perfeito de amigos. Priorize fotos nítidas, com " +
  "pessoas sorrindo, momentos espontâneos e evite fotos repetidas ou de ângulos " +
  "quase iguais.";

/**
 * Schema da saída estruturada. Garante JSON válido no formato esperado.
 * (Restrições numéricas de array não são suportadas — validamos no código.)
 */
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    indices: {
      type: "array",
      items: { type: "integer" },
      description:
        "Índices 0-based das fotos escolhidas, na ordem em que foram enviadas (ex: [0, 3, 7]).",
    },
    justificativa: {
      type: "string",
      description:
        "Frase curta de até duas linhas justificando a combinação escolhida.",
    },
  },
  required: ["indices", "justificativa"],
  additionalProperties: false,
};

/** Extrai e concatena o texto da resposta da IA. */
function textoDaResposta(content: Anthropic.Messages.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

/** Normaliza/valida os índices vindos da IA: inteiros únicos dentro do range, no máx. ALVO_SELECAO. */
function sanitizarIndices(brutos: unknown, totalFotos: number): number[] {
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
 * Chama o modelo multimodal e devolve a seleção validada.
 * Lança Error com mensagem amigável em caso de problema (sem stack trace pro usuário).
 */
export async function curarFotos(
  dataUrls: string[],
  objetivo: ObjetivoId = OBJETIVO_PADRAO,
): Promise<ResultadoCuradoria> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Configuração ausente: defina ANTHROPIC_API_KEY no .env.local.",
    );
  }

  const fontes: FonteImagem[] = [];
  for (const url of dataUrls) {
    const f = parseDataUrl(url);
    if (!f) throw new Error("Uma das imagens está em formato não suportado.");
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
  const opcao = OBJETIVOS.find((o) => o.id === objetivo) ?? OBJETIVOS[0];
  conteudo.push({
    type: "text",
    text:
      `O objetivo do usuário é conseguir ${opcao.titulo.toLowerCase()} no Instagram. ` +
      `Dê preferência a ${opcao.hintIA}. ` +
      `Selecione as ${ALVO_SELECAO} melhores fotos (ou menos, se houver poucas) ` +
      `para o photo dump. Retorne os índices 0-based das escolhidas e uma frase ` +
      `curta justificando a combinação, conectando-a a esse objetivo.`,
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
      throw new Error("Chave da IA inválida. Verifique ANTHROPIC_API_KEY.");
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new Error("Muitas requisições agora. Tente de novo em instantes.");
    }
    throw new Error("A IA está indisponível no momento. Tente novamente.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(textoDaResposta(resposta.content));
  } catch {
    throw new Error("A IA respondeu fora do formato esperado. Tente de novo.");
  }

  const obj = parsed as Record<string, unknown>;
  const indices = sanitizarIndices(obj?.indices, fontes.length);
  const justificativa =
    typeof obj?.justificativa === "string" && obj.justificativa.trim()
      ? obj.justificativa.trim()
      : "Essas fotos têm a melhor energia e variedade pro seu dump. ✨";

  if (indices.length === 0) {
    throw new Error("A IA não conseguiu escolher as fotos. Tente outras imagens.");
  }

  return { indices, justificativa };
}
