# DumpAI — guia do Claude Code

> **Esta sessão é a continuação de um trabalho iniciado no projeto `medsaas` (Nous
> Clinical).** Lá definimos o escopo e transportamos as convenções que aprendemos.
> Use este arquivo como fonte da verdade do projeto. A especificação completa do MVP
> está em [`docs/SPEC.md`](docs/SPEC.md).

## O que é o projeto
**DumpAI** — web app **mobile-first** que ajuda o usuário a escolher as melhores fotos
para um *photo dump* do Instagram. O usuário sobe até 30 fotos, a IA multimodal analisa
e seleciona estritamente as 10 melhores (nítidas, gente sorrindo, momentos espontâneos,
sem repetições) e devolve os índices + uma frase curta justificando o "match".

**Tela única:** upload (multi-select, até 30) → botão "Gerar Dump com IA" → grid estilo
carrossel do Instagram com as 10 escolhidas.

## Stack
- **Next.js (App Router) + TypeScript + Tailwind CSS** — `npx create-next-app`.
- **API Route** do Next recebe imagens em Base64 e chama o **SDK da Anthropic** (`@anthropic-ai/sdk`).
- **Modelo:** usar o Claude multimodal mais atual e capaz disponível (consulte a skill
  `/claude-api` para o model id correto — **não** chute id de modelo nem copie de
  tutoriais antigos; o tutorial-base citava "Claude 3.5 Sonnet" mas devemos usar o atual).
- Sem banco no MVP. Estado só no cliente. Deploy futuro: Vercel.

## Status atual
- [ ] Passo 1 — scaffold Next.js + Tailwind + TS (ainda **não** rodado; é o 1º comando aqui)
- [ ] Passo 2 — UI de upload + grid de resultado
- [ ] Passo 3 — API Route + integração Anthropic multimodal
- [ ] Passo 4 — rodar local (`npm run dev`) + testar no celular via `ngrok http 3000`
- Dia 2 (pós-MVP): edição (Cloudinary/Imgix), paywall (Stripe/Pix R$19,90) ou ads.

## Como rodar (depois do scaffold)
- Dev: `npm run dev` (porta 3000)
- Teste no celular: `ngrok http 3000` → manda o link público pro celular
- Chave da IA: **nunca** no client nem no git. `ANTHROPIC_API_KEY` em `.env.local`
  (já no `.gitignore`), lida só na API Route (server-side). Veja `.env.local.example`.

## Padrões invioláveis (transportados do medsaas/Nous — valem aqui também)
- **NUNCA commitar segredos.** A `ANTHROPIC_API_KEY` vive em `.env.local` (gitignored);
  só `.env.local.example` é versionado. A chamada à IA é **sempre server-side** (API
  Route) — a imagem vai do browser pro nosso route, e do route pra Anthropic. A chave
  jamais chega ao bundle do cliente.
- **Validação de entrada na borda:** limite real de nº de arquivos (≤30), tipos de
  imagem aceitos, e tamanho máximo do payload Base64 (Base64 infla ~33%; defina limite
  de body na route pra não estourar memória/timeout). Trate erro da IA com mensagem
  amigável, não stack trace.
- **Pense no custo/abuso:** cada request manda N imagens pro modelo (caro). No MVP tudo
  bem, mas registre no SPEC que rate-limit/paywall é pré-requisito de produção.
- **TypeScript honesto:** tipe a resposta da IA (índices + justificativa) e **valide** o
  shape do JSON que ela retorna antes de usar — modelo pode devolver fora do formato.
- **Mobile-first de verdade:** projetar pro toque/tela pequena primeiro; o grid imita o
  carrossel do Instagram. Acessibilidade básica (alt, foco, contraste).
- **Commits granulares:** `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
  Trabalhe em branch, não direto na principal.
- **Sem `style`/handlers inline desnecessários** quando der pra usar classe Tailwind /
  handler React — herança da disciplina CSP do projeto anterior (boa higiene, menos
  relevante em Next, mas mantenha o código limpo).

## Skills úteis (já disponíveis globalmente — não precisa instalar)
- **`/claude-api`** — referência do SDK Anthropic: model ids atuais, multimodal (imagens
  em Base64), tool use, params. **Consulte antes** de escrever a API Route do Passo 3.
- **`frontend-design`** — para a UI bonita/minimalista do Passo 2 (design não-genérico).
- **`/code-review`**, **`/verify`**, **`/run`** — revisão, verificação e execução do app.

## Durante a implementação
1. Mexeu na UI? → mobile-first, Tailwind, reuse componentes; rode o app pra ver.
2. Mexeu na API Route? → chave só server-side, valide entrada e a resposta da IA,
   trate erros e timeouts, pense em payload grande (Base64).
3. Terminou um passo? → marque o checklist acima e faça commit granular.
