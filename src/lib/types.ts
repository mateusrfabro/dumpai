// Tipos compartilhados entre client e API Route.

/** Quantas fotos a IA deve selecionar para o photo dump. */
export const ALVO_SELECAO = 10;

/** Limite de fotos que o usuário pode enviar de uma vez. */
export const MAX_FOTOS = Number(process.env.MAX_FOTOS) || 30;

/** Mínimo para a curadoria fazer sentido. */
export const MIN_FOTOS = 2;

/**
 * Resposta validada da curadoria.
 * `indices` são 0-based e apontam para a ordem em que as fotos foram enviadas.
 */
export interface ResultadoCuradoria {
  indices: number[];
  justificativa: string;
  /** Gerações restantes nesta compra (preenchido pela API quando o paywall está ativo). */
  restantes?: number;
}

/** Objetivo de engajamento que o usuário escolhe — ajusta o critério da IA. */
export type ObjetivoId = "curtidas" | "comentarios" | "compartilhamentos";

export interface ObjetivoOpcao {
  id: ObjetivoId;
  emoji: string;
  titulo: string;
  /** Rótulo curto pro chip (cabe na box do mobile); o `titulo` completo fica no resultado. */
  chip: string;
  /** Dica injetada no prompt da IA para priorizar as fotos certas. */
  hintIA: string;
}

export const OBJETIVOS: ObjetivoOpcao[] = [
  {
    id: "curtidas",
    emoji: "❤️",
    titulo: "+ Curtidas",
    chip: "+ Curtidas",
    hintIA:
      "fotos esteticamente fortes e 'instagramáveis' — boa luz, enquadramento, cores e pessoas bonitas/carismáticas na imagem",
  },
  {
    id: "comentarios",
    emoji: "💬",
    titulo: "+ Comentários",
    chip: "+ Comentários",
    hintIA:
      "fotos que provocam conversa — expressões marcantes, situações engraçadas ou inusitadas, gente interagindo e reações espontâneas",
  },
  {
    id: "compartilhamentos",
    emoji: "🔁",
    titulo: "+ Compartilhamentos",
    chip: "+ Compartilhar",
    hintIA:
      "fotos marcantes e relacionáveis — momentos icônicos, emoção ou humor que dão vontade de mostrar pros amigos e repostar",
  },
];

export const OBJETIVO_PADRAO: ObjetivoId = "curtidas";

/** Chave do localStorage onde guardamos o objetivo escolhido. */
export const OBJETIVO_KEY = "dumpai_objetivo";

/** Payload que o client envia para /api/curate. */
export interface CuratePayload {
  /** Data URLs (data:image/jpeg;base64,...) já comprimidas no navegador. */
  images: string[];
  /** Objetivo de engajamento (opcional; default = curtidas). */
  objetivo?: ObjetivoId;
}

/** Resposta de erro padronizada da API Route. */
export interface ApiError {
  error: string;
}
