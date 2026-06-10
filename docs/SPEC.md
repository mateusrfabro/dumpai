# DumpAI — Especificação do MVP (Dia 1)

App web mobile-first que escolhe as melhores fotos para um *photo dump* do Instagram.

## Passo 1 — Inicializar o projeto
Criar projeto **Next.js (App Router) + Tailwind CSS + TypeScript**. Web app mobile-first
chamado **DumpAI**. Objetivo: ajudar o usuário a escolher as melhores fotos para um photo dump.

## Passo 2 — Interface de upload e resultado (tela única)
Interface linda e minimalista para mobile:
- Área de **upload multi-select** (`<input type="file" multiple accept="image/*">`) — até **30 fotos**.
- Botão **"Gerar Dump com IA"**.
- Estado de loading enquanto processa.
- Ao terminar: as **10 fotos selecionadas** em **grid estilo carrossel do Instagram**,
  cada uma com a frase de justificativa da IA.

## Passo 3 — API de IA multimodal
- **API Route** do Next que recebe as imagens em **Base64**.
- Usa o **SDK da Anthropic** (`@anthropic-ai/sdk`) com o modelo Claude multimodal
  **mais atual** (consultar `/claude-api` para o model id — não usar id de tutorial antigo).
- Prompt da IA (base, refinar conforme testes):
  > "Você é um especialista em redes sociais e curador de fotos. Analise estas imagens e
  > selecione estritamente as 10 melhores para um photo dump de amigos no Instagram.
  > Priorize fotos nítidas, com pessoas sorrindo, momentos espontâneos e evite fotos muito
  > parecidas ou repetidas. Retorne **apenas** um JSON com o array dos índices das fotos
  > escolhidas e uma frase curta justificando cada match."
- **Validar** a resposta da IA (shape do JSON) antes de usar; tratar erro/timeout.

## Passo 4 — Rodar e testar no celular
- `npm run dev` (porta 3000).
- `ngrok http 3000` → link público temporário.
- Abrir o link no celular e testar com fotos reais.
- **Critério de sucesso do dia:** "funcionou e escolheu as fotos direitinho".

## Dia 2 — Próximos passos (pós-MVP, ignorar hoje)
- **Edição/Templates:** filtros automáticos via Cloudinary ou Imgix.
- **Monetização:** paywall (Stripe ou Pix, ~R$19,90) **ou** Google AdSense/AdMob.
- **Pré-requisitos de produção** (anotados, não opcionais quando monetizar):
  rate-limiting/abuse protection na API Route (cada request manda N imagens = caro),
  limites de upload reforçados, e tratamento de custo por chamada.

## Notas de engenharia (decididas)
- Chave da IA **só server-side** (`ANTHROPIC_API_KEY` em `.env.local`, gitignored).
- Base64 infla o payload ~33% — definir limite de body na API Route.
- Tipar e validar o JSON da IA; degradar com mensagem amigável em caso de falha.
