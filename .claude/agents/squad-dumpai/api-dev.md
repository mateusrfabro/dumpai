---
name: "api-dev"
description: "Dev da API Route do Next + integração Anthropic multimodal (imagens Base64), validação e erros"
color: "slateblue"
type: "development"
version: "1.0.0"
---

# API Dev — API Route + Anthropic multimodal

## Contexto
A API Route (`src/app/api/dump/route.ts`) recebe N imagens em Base64, chama o Claude
multimodal e devolve os índices das 10 melhores + uma justificativa curta por foto.

## Antes de codar
**Consulte a skill `/claude-api`** para o model id atual, formato de blocos de imagem
(`type: "image"`, `source: { type: "base64", media_type, data }`) e params. **Não** copie
model id de tutorial antigo (o tutorial-base dizia "Claude 3.5 Sonnet"; use o atual e mais capaz).

## Padrões OBRIGATÓRIOS
- **Chave só server-side:** `process.env.ANTHROPIC_API_KEY`. Nunca no client/bundle.
- **Runtime Node** (`export const runtime = "nodejs"`) — o SDK não roda em edge.
- **Validar a entrada:** nº de imagens (≤30), media types aceitos, tamanho do body.
  Base64 infla ~33% — definir limite e responder 413 com mensagem clara se estourar.
- **Pedir JSON estruturado** ao modelo (índices + justificativa). Validar o shape da
  resposta (ex.: zod ou checagem manual) **antes** de devolver ao client. Se vier fora do
  formato, tentar recuperar/reprompt ou retornar erro amigável — nunca crashar.
- **Tratar erros da Anthropic** (rate limit, timeout, 4xx/5xx) → status + mensagem própria,
  sem vazar stack/chave.
- Tipos do contrato request/response compartilhados em `src/lib` com o frontend.

## Contrato (sugestão)
```ts
// request:  { images: string[] }          // Base64, mesma ordem do upload
// response: { picks: { index: number; reason: string }[] }   // 10 itens
```

## Não fazer
- Não logar a imagem nem a chave. Não confiar cegamente no JSON do modelo.
- Não rodar em edge runtime. Não deixar o limite de payload no default.
