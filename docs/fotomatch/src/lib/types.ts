// Tipos compartilhados entre client e API Route. (FotoMatch)
// Baseado no types.ts do DumpAI — mesma estrutura, adaptada pra "melhor foto de perfil".

/** Quantas fotos a IA retorna no ranking (1 vencedora + alternativas = top 3). */
export const ALVO_SELECAO = 3;

/** Limite de fotos que o usuário pode enviar de uma vez. */
export const MAX_FOTOS = Number(process.env.MAX_FOTOS) || 15;

/** Mínimo para a IA ter de onde escolher. */
export const MIN_FOTOS = 6;

/**
 * Resposta validada da análise.
 * `ranking` são índices 0-based (na ordem enviada), do melhor pro pior, no máx. ALVO_SELECAO.
 * `vencedora` é o 1º do ranking (atalho conveniente).
 */
export interface ResultadoAnalise {
  /** Índices 0-based ordenados (melhor primeiro). ranking[0] === vencedora. */
  ranking: number[];
  /** Atalho: índice da melhor foto (== ranking[0]). */
  vencedora: number;
  /** Frase curta (1 linha) justificando por que a vencedora é a melhor. */
  justificativa: string;
  /** Gerações restantes nesta compra (preenchido pela API quando o paywall está ativo). */
  restantes?: number;
}

/** Modo de uso — ajusta totalmente o critério da IA. */
export type ModoId = "match" | "pro";

export interface ModoOpcao {
  id: ModoId;
  emoji: string;
  titulo: string;
  /** Rótulo curto pro chip (cabe na box do mobile); o `titulo` completo fica no resultado. */
  chip: string;
  /** Contexto injetado no prompt da IA para guiar a escolha. */
  hintIA: string;
}

export const MODOS: ModoOpcao[] = [
  {
    id: "match",
    emoji: "🔥",
    titulo: "Match",
    chip: "🔥 Match",
    hintIA:
      "foto de perfil para apps de namoro (Tinder, Bumble, Hinge). Priorize: " +
      "sorriso genuíno e olhar pra câmera, rosto claramente visível e nítido, " +
      "boa luz natural, expressão simpática/aproximável, enquadramento que mostra " +
      "a pessoa sozinha e em destaque. Evite: óculos escuros cobrindo o rosto, " +
      "fotos em grupo onde não dá pra saber quem é, imagens escuras/borradas ou " +
      "selfies de ângulo ruim",
  },
  {
    id: "pro",
    emoji: "💼",
    titulo: "Pro",
    chip: "💼 Pro (LinkedIn)",
    hintIA:
      "foto de perfil profissional para LinkedIn e currículo. Priorize: " +
      "aparência confiável e competente, postura e expressão sóbrias mas acessíveis, " +
      "fundo limpo/neutro, boa iluminação, vestimenta adequada ao trabalho, " +
      "rosto nítido e bem enquadrado (busto/ombros). Evite: fotos de balada/praia, " +
      "óculos escuros, contexto informal demais, recortes que pareçam selfie casual",
  },
];

export const MODO_PADRAO: ModoId = "match";

/** Chave do localStorage onde guardamos o modo escolhido. */
export const MODO_KEY = "fotomatch_modo";

/** Payload que o client envia para /api/analisar. */
export interface AnalisePayload {
  /** Data URLs (data:image/jpeg;base64,...) já comprimidas no navegador. */
  images: string[];
  /** Modo de uso (opcional; default = match). */
  modo?: ModoId;
}

/** Resposta de erro padronizada da API Route. */
export interface ApiError {
  error: string;
}
