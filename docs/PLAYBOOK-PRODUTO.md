# Playbook — lançar um produto web monetizado (IA + Kiwify) em horas

Destila o que foi construído no **DumpAI**. A parte difícil (paywall real + Kiwify +
rate limit) já está resolvida e é **genérica** — clone e troque só a "feature de IA".

## Stack (tudo grátis no começo)
- **Next.js (App Router) + TS + Tailwind** → deploy na **Vercel** (Hobby grátis).
- **Upstash Redis (KV)** via Vercel Storage → rate limit + prova de pagamento.
- **Kiwify** → checkout (Pix) + webhook de pagamento.
- **Anthropic (Claude)** → a feature de IA (modelo via env, default barato).

## Arquivos reutilizáveis (copiar quase direto)
| Arquivo | O que faz | Genérico? |
|---|---|---|
| `src/lib/ratelimit.ts` | Rate limit por IP (Upstash) com fail-open | ✅ 100% |
| `src/lib/acesso.ts` | Cookie de acesso assinado (HMAC) + registro de pagamento + limite de usos no KV | ✅ 95% (trocar nomes) |
| `src/app/api/kiwify/webhook/route.ts` | Recebe pagamento, valida assinatura (timing-safe), grava/revoga no KV | ✅ 95% |
| `src/app/api/claim/route.ts` | Confirma e-mail da compra → entrega cookie | ✅ 95% |
| `src/lib/images.ts` | Compressão de imagem no client em lotes | ✅ se for produto de imagem |
| `src/lib/curate.ts` | Chamada à Anthropic (multimodal + structured output + erro tratado) | ⚠️ é a "feature" — adapte |

## Passo a passo de lançamento
1. **Scaffold:** `npx create-next-app` (TS + Tailwind). Copie os arquivos genéricos acima.
2. **A feature:** implemente o `curate.ts` equivalente (o que sua IA faz). Veja a skill `/claude-api`.
3. **Vercel:** `git push` → importar no Vercel → deploy. Domínio grátis `*.vercel.app`.
4. **KV:** Vercel → Storage → Upstash for Redis (Free) → conectar ao projeto (injeta `KV_*`).
   ⚠️ Conectar **antes** do deploy que usa o KV (senão a build não vê as vars).
5. **Kiwify:** criar produto (Pix), pegar **link de checkout** → `NEXT_PUBLIC_PAYMENT_LINK`.
   - Webhook: Apps → Webhook → URL `…/api/kiwify/webhook`, eventos "Compra aprovada" + "Reembolso" + "Chargeback" → copiar o **Token**.
6. **Env vars na Vercel:** `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `KIWIFY_WEBHOOK_TOKEN`,
   `DUMPAI_COOKIE_SECRET` (gerar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`),
   e `PAYWALL_ATIVO=true` (ligar só após testar o webhook).
7. **Testar ponta a ponta:** webhook assinado (script) → claim → cookie → gate 401/200. Compra real cheia (cupom barato).

## Armadilhas que já pagamos (não repetir)
- **`git add src` esquece `package.json`** → build da Vercel quebra silenciosamente. Commitar deps.
- **Redirect pós-Pix não é confiável** (pagador sai pro app do banco). Sempre ter caminho
  "Já comprei? Entrar" + e-mail de acesso. Não dependa só do redirect.
- **Transcrever token de print dá typo.** Em produção use as vars que o Vercel/Upstash injeta.
- **Rate limit em memória não funciona em serverless** (cada invocação é um processo). Use KV.
- **Cookie válido ≠ pagamento ativo:** revalidar no KV a cada ação cara (reembolso/chargeback).
- **Limite de uso:** consumir só APÓS sucesso da IA (falha não cobra). `PAYWALL_ATIVO` desligado no local pra testar à vontade.

## Squad de agentes (em `~/.claude/agents/`, valem em todo projeto)
`security`, `code-quality`, `ux-review`, `product-manager`, `llm-api-dev`, `tester`.
Acione antes de divulgar (segurança/custo) e pra revisar UX/conversão.
