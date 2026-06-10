# Squad DumpAI

Agentes especializados pro DumpAI (Next.js + TS + Tailwind + Anthropic SDK).
Adaptados da squad do Aggron (que era Flask) — reescritos pra esta stack.

## Quem é quem

| Agente | Uso típico |
|---|---|
| **product-manager** | Destila feedback bruto (do Mateus/usuário) em spec acionável |
| **frontend-dev** | Implementa UI Next/React/Tailwind mobile-first (upload, grid, loading) |
| **api-dev** | API Route do Next + integração Anthropic multimodal (Base64), validação |
| **security** | Segredos server-side, validação de upload, limite de payload, abuso/rate-limit |
| **code-quality** | Qualidade TS/React: tipagem honesta, tratamento de erro, estrutura |
| **ux-review** | Revisão mobile-first, a11y, fidelidade ao "carrossel do Instagram" |

## Como invocar
`Task(subagent_type="frontend-dev", prompt="...")` etc.

## Fluxo típico
1. **product-manager** destila a spec do passo.
2. **frontend-dev** / **api-dev** implementam.
3. **security** + **code-quality** + **ux-review** revisam (proporcional ao tamanho da mudança).
4. Commit granular + testar no celular (ngrok).

## Regras invioláveis
- Chave da IA **só server-side**, nunca no client/bundle/git.
- Mobile-first sempre.
- Não trocar a stack (Next.js App Router + TS + Tailwind).
- Validar a resposta da IA antes de usar.
- Sem deploy/force sem pedido explícito.
