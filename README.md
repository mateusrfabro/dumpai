# DumpAI 📸

Web app **mobile-first** que escolhe as **10 melhores fotos** do seu rolê para um
*photo dump* perfeito no Instagram — usando IA multimodal (Claude). Já nasce
**monetizado**: o usuário paga (Pix via Kiwify) para liberar a ferramenta.

## Estado (05/11/2026)

No ar em https://dumpai-omega.vercel.app. Vendas perto de zero; sem desenvolvimento desde 22/06/2026.

## Fluxo

```
/          → Landing / paywall  → botão leva ao checkout (NEXT_PUBLIC_PAYMENT_LINK)
/success   → Kiwify redireciona pra cá após o Pix → grava acesso → /app
/app       → Upload (até 30 fotos) → "Gerar Meu Dump Perfeito" → carrossel das 10 melhores
/api/curate→ Recebe as imagens (Base64), chama a Anthropic, devolve índices + justificativa
```

---

## 1. Rodar local (hoje)

```bash
# 1. Variáveis de ambiente
cp .env.local.example .env.local
#   edite .env.local e preencha ANTHROPIC_API_KEY (ver passo 2)

# 2. Rodar
npm install        # (se ainda não rodou)
npm run dev        # http://localhost:3000
```

> **Pular o paywall para testar:** o `/app` exige a flag de acesso. Abra
> **http://localhost:3000/success** uma vez — ele grava o acesso e te joga no `/app`.

---

## 2. Chave da IA (Anthropic)

1. Crie conta em **https://console.anthropic.com** e adicione créditos (ex: US$5).
   É **pré-pago** e **separado** da assinatura do Claude.ai — cada análise consome
   centavos de dólar dos seus créditos.
2. **Settings → API Keys → Create Key**, copie e cole em `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. **Custo x qualidade** (troque 1 linha no `.env.local`):
   | `ANTHROPIC_MODEL`   | Custo/análise | Quando usar            |
   |---------------------|---------------|------------------------|
   | `claude-haiku-4-5`  | ~US$ 0,05     | **default** — testar   |
   | `claude-sonnet-4-6` | ~US$ 0,15     | equilíbrio             |
   | `claude-opus-4-8`   | ~US$ 0,25–0,70| melhor curadoria       |

A chave é lida **só no servidor** (`/api/curate`) — nunca vai pro navegador.

---

## 3. Pagamento (Kiwify)

1. Crie conta na **Kiwify** e um **produto** de R$ 19,90 (pagamento único, Pix ativo).
2. Pegue o **link de checkout** do produto e cole no `.env.local`:
   ```
   NEXT_PUBLIC_PAYMENT_LINK=https://pay.kiwify.com.br/SEU-LINK
   ```
3. Na Kiwify, configure a **URL de redirecionamento pós-compra** para:
   - Local (ngrok): `https://SEU-NGROK.ngrok.app/success`
   - Produção: `https://SEU-DOMINIO/success`

   É essa página `/success` que **libera o acesso** ao app.

---

## 4. Testar no celular

```bash
npm run dev
npx ngrok http 3000     # gera um link público https://...ngrok...
```

Abra o link do ngrok no celular. Para testar o fluxo completo de pagamento, use
o link do ngrok também na URL de redirecionamento da Kiwify (passo 3).

---

## ⚠️ Antes de escalar (pós-MVP)

O acesso hoje é controlado **só no navegador** (`localStorage`). Isso é suficiente
para validar o produto, mas é **burlável**. Antes de divulgar de verdade:

- **Validar o pagamento no servidor** via *webhook* da Kiwify (liberar acesso real).
- **Rate-limit / proteção de abuso** no `/api/curate` (cada chamada manda N imagens = caro).
- Reforçar limite de upload e tamanho de payload (já há um guarda básico na route).

Detalhes do escopo em [`docs/SPEC.md`](docs/SPEC.md) e convenções em [`CLAUDE.md`](CLAUDE.md).

---

## Deploy (Vercel)

`vercel` → adicione as 3 variáveis de ambiente no painel (`ANTHROPIC_API_KEY`,
`ANTHROPIC_MODEL`, `NEXT_PUBLIC_PAYMENT_LINK`). Atenção: funções serverless da
Vercel têm limite de ~4,5MB de body — as imagens já são **comprimidas no navegador**
antes do envio para caber.
