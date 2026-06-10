// Flag de acesso liberado, guardada no localStorage do navegador.
// MVP: controle só no client (sem banco). Em produção, validar o pagamento
// no servidor (webhook da Kiwify) antes de liberar de verdade.
export const UNLOCK_KEY = "dumpai_unlocked";

export function estaLiberado(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "true";
  } catch {
    return false;
  }
}
