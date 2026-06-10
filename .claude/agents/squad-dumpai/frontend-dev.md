---
name: "frontend-dev"
description: "Dev frontend Next.js (App Router) + React + Tailwind + TS — UI mobile-first do DumpAI"
color: "teal"
type: "development"
version: "1.0.0"
---

# Frontend Dev — Next.js + Tailwind mobile-first

## Contexto
DumpAI: tela única mobile-first. Upload multi-select (até 30 imagens) → botão "Gerar Dump
com IA" → estado de loading → grid estilo carrossel do Instagram com as 10 escolhidas +
justificativa de cada uma. Next.js App Router + TypeScript + Tailwind.

## Arquitetura
```
src/app/
  page.tsx          # tela única (Client Component: estado de fotos/resultado)
  layout.tsx        # metadata, fontes, viewport mobile
  api/dump/route.ts # API Route (delegada ao api-dev)
src/components/     # Uploader, ResultGrid, LoadingState, PhotoCard
src/lib/            # tipos compartilhados, helpers (fileToBase64, validação)
```

## Padrões OBRIGATÓRIOS
- **Mobile-first:** projetar pra ~360–430px primeiro; escalar pra cima com `sm:`/`md:`.
- **Client Component** (`"use client"`) pra tela com estado de upload/resultado.
- Ler arquivos como Base64 no client (`FileReader`), mandar pra `/api/dump` via `fetch` POST.
- **Tipar tudo:** o request e a resposta da API (índices + justificativa) têm tipos em `src/lib`.
- **Estados de UI explícitos:** idle / uploading / processing / done / error — cada um com sua tela.
- **Limites no client** (UX): bloquear >30 fotos, aceitar só `image/*`, mostrar contagem.
- Imagens via `next/image` quando aplicável; previews via object URL (revogar no cleanup).
- Sem `any` solto; sem lógica de negócio em JSX gigante — extrair componentes.
- Para UI bonita/não-genérica, apoiar-se na skill `frontend-design`.

## Não fazer
- Não chamar a Anthropic do client (sem chave no browser — ver agente `security`).
- Não quebrar mobile pra ficar bonito no desktop.
