// Rate limiting do /api/curate — protege o crédito da Anthropic contra abuso.
// Usa Upstash Redis (KV) porque memória de processo NÃO persiste no serverless
// da Vercel. Se as vars do KV não existirem (ex: ambiente local sem config),
// faz "fail-open" (não bloqueia) pra não quebrar o dev — em produção elas existem.

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

let burst: Ratelimit | null = null;
let diario: Ratelimit | null = null;

if (url && token) {
  const redis = new Redis({ url, token });
  // Anti-loop imediato: no máx. 6 chamadas por minuto por IP.
  burst = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(6, "60 s"),
    prefix: "rl:burst",
  });
  // Teto diário: no máx. 25 chamadas por dia por IP (anti-drenagem lenta).
  diario = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(25, "24 h"),
    prefix: "rl:dia",
  });
}

export const rateLimitAtivo = Boolean(burst && diario);

/**
 * Retorna { ok: false } se o identificador (ex: IP) estourou algum limite.
 * Sem KV configurado, sempre { ok: true } (fail-open p/ dev).
 */
export async function checarRateLimit(
  id: string,
): Promise<{ ok: boolean; motivo?: string }> {
  if (!burst || !diario) return { ok: true };

  try {
    const b = await burst.limit(id);
    if (!b.success) {
      return { ok: false, motivo: "Muitas gerações em pouco tempo." };
    }
    const d = await diario.limit(id);
    if (!d.success) {
      return { ok: false, motivo: "Limite diário atingido." };
    }
    return { ok: true };
  } catch (e) {
    // KV indisponível/mal configurado: NÃO derruba a API. Libera e loga.
    console.error("[ratelimit] erro no KV — liberando (fail-open):", e);
    return { ok: true };
  }
}
