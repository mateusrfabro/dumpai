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
}

/** Payload que o client envia para /api/curate. */
export interface CuratePayload {
  /** Data URLs (data:image/jpeg;base64,...) já comprimidas no navegador. */
  images: string[];
}

/** Resposta de erro padronizada da API Route. */
export interface ApiError {
  error: string;
}
