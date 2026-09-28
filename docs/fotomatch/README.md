# KIT DE BUILD — FotoMatch (clone do DumpAI)

> Como aplicar este kit pra subir o **FotoMatch** reaproveitando o máximo do DumpAI.
> **Nada aqui altera o DumpAI em produção** — os arquivos deste kit ficam em
> `docs/fotomatch/` e você os copia para um **repo/diretório NOVO**.
>
> Produto: usuário sobe **6 a 15 fotos suas**, a IA (multimodal — **analisa** imagem,
> **não gera**) escolhe a **melhor foto de perfil** e explica em 1 frase. Dois modos:
> **Match** (Tinder/apps) e **Pro** (LinkedIn). Preço **R$ 19,90**, pagamento único,
> paywall Kiwify (mesmo esquema do DumpAI).
>
> **Modelo:** `claude-haiku-4-5` (confirmado atual; default do projeto, via env
> `ANTHROPIC_MODEL`). **Custo:** ~US$0,015/análise de 10 fotos comprimidas a ~1024px
> (≈14,5K tokens de imagem × \$1/MTok input + ~300 tokens output × \$5/MTok ≈ \$0,016).
> Ordem de grandeza confirmada. Latência de vision com 10 imagens é a parte lenta —
> a compressão no client (images.ts) já reduz isso; ainda assim espere alguns segundos.

---

## 1) INVENTÁRIO — o que REUSA sem mudar (copiar 1:1)

Confirmado lendo o código real do DumpAI. Copie estes arquivos **sem alterar lógica**:

| Arquivo do DumpAI | O que faz | Muda algo? |
|---|---|---|
| `src/lib/ratelimit.ts` | Rate limit por IP (Upstash) com fail-open | ❌ Nada. Copiar 1:1. |
| `src/lib/images.ts` | Compressão de imagem no client em lotes (MAX_LADO 1024, qualidade 0.72) | ❌ Nada. Copiar 1:1. |
| `src/lib/unlock.ts` | Flag `*_unlocked` no localStorage (gate client) | ⚠️ Só a **string** da chave (ver §2). |
| `src/app/api/kiwify/webhook/route.ts` | Recebe pagamento Kiwify, valida assinatura (sha1/sha256 timing-safe), grava/revoga no KV | ❌ Nada. Copiar 1:1 (usa `KIWIFY_WEBHOOK_TOKEN` + funções do acesso.ts). |
| `src/app/api/claim/route.ts` | Confirma e-mail da compra → entrega cookie de acesso HttpOnly | ❌ Nada. Copiar 1:1. |
| `src/app/success/page.tsx` | Pós-compra: auto-claim por order_id/email ou pede e-mail → seta unlock → vai pro /app | ⚠️ Só a **string** da chave de unlock (ela importa `UNLOCK_KEY` do unlock.ts, então some que você ajuste lá). |
| `src/components/LoadingDump.tsx` | Tela de loading | ❌ Nada (opcional: trocar textos). |
| `src/lib/acesso.ts` | Cookie HMAC assinado + prova de pagamento no KV + limite de usos | ⚠️ Só **2 strings** (ver §2). |
| layout/estilos (`globals.css`, `tailwind`, `layout.tsx`, fontes, animações `animate-pop/animate-fade-up`, cores `coral/paper/ink/line/muted`) | Sistema de design | ❌ Nada. Copiar 1:1 — os componentes novos já usam essas classes. |

**Resumo:** todo o "esqueleto difícil" (paywall real, rate limit, webhook, claim, success,
compressão) é genérico e vem **direto**. Só trocam nomes de string. Isso é exatamente o
que o `docs/PLAYBOOK-PRODUTO.md` promete.

### Trocas que são SÓ string (nada de lógica)

Em `src/lib/acesso.ts`, troque **duas** linhas:

```diff
- export const COOKIE_NAME = "dumpai_acesso";
+ export const COOKIE_NAME = "fotomatch_acesso";

- const COOKIE_SECRET = process.env.DUMPAI_COOKIE_SECRET || "";
+ const COOKIE_SECRET = process.env.FOTOMATCH_COOKIE_SECRET || "";
```

Em `src/lib/unlock.ts`, troque a chave do localStorage:

```diff
- export const UNLOCK_KEY = "dumpai_unlocked";
+ export const UNLOCK_KEY = "fotomatch_unlocked";
```

> Por que trocar: se você reusar o mesmo `dumpai_*`, um cookie/flag do DumpAI no mesmo
> navegador poderia colidir. Nomes próprios isolam os dois produtos.

Tudo o mais em `acesso.ts`/`unlock.ts` fica **idêntico** — `USOS_POR_COMPRA`,
`PAYWALL_ATIVO`, `KV_REST_API_URL/TOKEN`, `KIWIFY_WEBHOOK_TOKEN` são os mesmos nomes de env.

---

## 2) CÓDIGO NOVO / ALTERADO (já escrito neste kit, pronto pra colar)

Estão em `docs/fotomatch/src/...` — copie para os caminhos correspondentes do projeto novo:

| Arquivo do kit | Vai para | Substitui o equivalente do DumpAI |
|---|---|---|
| `src/lib/types.ts` | `src/lib/types.ts` | `types.ts` (ObjetivoId→ModoId, ALVO_SELECAO 10→3, MIN/MAX 2..30→6..15) |
| `src/lib/analisar.ts` | `src/lib/analisar.ts` | **é o novo "miolo"** (equivale ao `curate.ts`) |
| `src/app/api/analisar/route.ts` | `src/app/api/analisar/route.ts` | equivale ao `api/curate/route.ts` (valida 6..15) |
| `src/components/QuizModo.tsx` | `src/components/QuizModo.tsx` | equivale ao `QuizObjetivo.tsx` |
| `src/components/ResultadoMatch.tsx` | `src/components/ResultadoMatch.tsx` | equivale ao `ResultadoDump.tsx` |
| `src/app/app/page.tsx` | `src/app/app/page.tsx` | a tela única (chama `/api/analisar`) |
| `src/app/page.tsx` | `src/app/page.tsx` | a **landing** (estrutura + placeholders de copy) |
| `.env.local.example` | `.env.local.example` | envs do FotoMatch |

### Destaques de fidelidade ao código existente

- **`analisar.ts`** mantém **exatamente** o padrão do `curate.ts`:
  - mesmo `parseDataUrl` + `MEDIA_TYPES_OK`, mesma intercalação `"Foto índice i:"` + imagem,
  - mesmo `output_config: { format: { type: "json_schema", schema } }`,
  - mesmo tratamento `Anthropic.AuthenticationError` / `RateLimitError` / genérico + `console.error`,
  - mesma classe `ErroIA` (a route só repassa mensagens dessas — segurança),
  - mesma sanitização de índices (inteiros únicos no range, teto = ALVO_SELECAO).
  - **Diferença:** saída `{ ranking, vencedora, justificativa }` (top 3, melhor primeiro)
    em vez de `{ indices, justificativa }` (10). Validada igual antes de usar.
- **`route.ts`** é o `curate/route.ts` **palavra por palavra** na blindagem (rate limit →
  paywall → revalida pagamento → teto de bytes → valida → limite por compra → consome só
  no sucesso). Só muda: nomes de tipo, `MIN_FOTOS=6`/`MAX_FOTOS=15`, e `objetivo`→`modo`.
- **`ResultadoMatch.tsx`** reaproveita o **mesmo Web Share / download** do `ResultadoDump`
  (mesmo `navigator.canShare`/`navigator.share`, mesmo fallback `baixar`) — só troca o
  carrossel de 10 por **1 foto grande (vencedora) + 2 alternativas**.
- **`QuizModo.tsx`** é o `QuizObjetivo` com `MODOS` (2 itens) e grid 2 colunas.
- A **landing** mantém a mesma estrutura/seções; a **copy** entra nos pontos
  `{/* COPY: ... */}` — você já tem a copy pronta do copywriter, é só colar.

> **Honestidade do produto (deixar claro na copy):** o stack **analisa** e **escolhe**
> entre as fotos enviadas; **não gera nem edita** foto nova. A landing já foi escrita
> nesse tom — não prometa "foto gerada por IA".

---

## 3) PASSO A PASSO DE DEPLOY (curto)

> Reaproveita 100% o fluxo do `docs/PLAYBOOK-PRODUTO.md`. Aqui só o que é específico do
> FotoMatch + as armadilhas que o playbook já documenta (não repetir, **respeitar**).

1. **Criar o projeto novo** (a partir do clone do DumpAI):
   - Opção A (mais simples): `git clone` do repo do DumpAI para uma pasta nova, novo repo no GitHub.
   - Aplique as trocas de string da §2 (`acesso.ts`, `unlock.ts`).
   - Copie os arquivos do kit (§2) por cima dos equivalentes; **apague** os antigos do DumpAI
     que foram substituídos: `src/lib/curate.ts`, `src/app/api/curate/`, `src/components/ResultadoDump.tsx`,
     `src/components/QuizObjetivo.tsx`. Renomeie o app para "FotoMatch" no `layout.tsx`/metadata.
   - **Commit deps junto** (`package.json`/lockfile) — ⚠️ armadilha do playbook: *"`git add src`
     esquece `package.json` → build da Vercel quebra silenciosamente."* As deps são as mesmas
     (`@anthropic-ai/sdk`, `@upstash/ratelimit`, `@upstash/redis`, `next`, `react`).

2. **Envs** (`.env.local` em dev; depois na Vercel — ver `.env.local.example`):
   `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL=claude-haiku-4-5`, `NEXT_PUBLIC_PAYMENT_LINK`,
   `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `FOTOMATCH_COOKIE_SECRET`
   (gerar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`),
   `KIWIFY_WEBHOOK_TOKEN`, `PAYWALL_ATIVO` (ligar **só após** testar o webhook),
   `USOS_POR_COMPRA` (opcional, default 3).

3. **Kiwify** (produto novo):
   - Criar produto **R$ 19,90**, Pix, pagamento único → pegar o **link de checkout** → `NEXT_PUBLIC_PAYMENT_LINK`.
   - Redirecionamento pós-compra: `https://SEU-DOMINIO/success`.
   - Webhook: Apps → Webhook → URL `…/api/kiwify/webhook`, eventos **Compra aprovada** +
     **Reembolso** + **Chargeback** → copiar o **Token** → `KIWIFY_WEBHOOK_TOKEN`.
     ⚠️ Armadilha do playbook: *"transcrever token de print dá typo"* — copie/cole, não digite.

4. **Upstash KV (Vercel Storage):**
   - Vercel → Storage → Upstash for Redis (Free) → **conectar ao projeto** (injeta `KV_*`).
   - ⚠️ Armadilha: *"conectar **antes** do deploy que usa o KV"* (senão a build não vê as vars).
   - ⚠️ *"rate limit em memória não funciona em serverless"* — por isso usamos KV. Não mexer.

5. **Vercel:** `git push` → importar no Vercel → deploy. Domínio grátis `*.vercel.app`.

6. **Testar ponta a ponta** (com `PAYWALL_ATIVO` ainda desligado no local):
   - webhook assinado (script de teste) → claim → cookie → gate 401/200 no `/api/analisar`.
   - ⚠️ *"redirect pós-Pix não é confiável"* — o caminho **"Já comprei? Entrar" → /success**
     (já existe, reaproveitado) é a rede de segurança. Não dependa só do redirect.
   - ⚠️ *"cookie válido ≠ pagamento ativo"* — o `confirmarPagamentoAtivo` revalida no KV a cada
     análise (já no `route.ts` do kit). Reembolso/chargeback bloqueia mesmo com cookie válido.
   - ⚠️ *"consumir uso só APÓS sucesso da IA"* — já é assim no kit (`consumirUso` no try, pós-sucesso).
   - Só então ligar `PAYWALL_ATIVO=true` em produção.

---

## Diferenças de número (resumo rápido)

| | DumpAI | FotoMatch |
|---|---|---|
| Fotos por envio | 2–30 | **6–15** |
| O que a IA devolve | 10 índices (dump) | **top 3** (1 vencedora + 2 alternativas) |
| Personalização | 3 objetivos (curtidas/comentários/compart.) | **2 modos** (Match / Pro) |
| Saída do JSON | `{ indices, justificativa }` | `{ ranking, vencedora, justificativa }` |
| Rota | `/api/curate` | `/api/analisar` |
| Cookie / unlock / secret | `dumpai_*` / `DUMPAI_COOKIE_SECRET` | `fotomatch_*` / `FOTOMATCH_COOKIE_SECRET` |
| Preço / paywall / Kiwify | R$ 19,90, Kiwify, KV | **idêntico** |
