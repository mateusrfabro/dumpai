# Resumo completo — Projeto "Aposta Boa" (estrutura reaproveitável)

> Inventário de tudo que foi criado: produtos, domínio, infra, e-mail, LPs, Kiwify, scripts, agentes e aprendizados.
> Serve de base pra clonar o stack em novos projetos.

## 1. PRODUTOS (infoprodutos digitais — Kiwify)
| Produto | O que é | Preço | Checkout |
|---|---|---|---|
| **Sportsbook com Método** | ebook + 2 planilhas (registro ROI/CLV + matched) | R$ 49,90 | pay.kiwify.com.br/ShYjgjy |
| **Bolão da Copa com Estratégia** | ebook + planilha de pontuação automática | R$ 49,90 | pay.kiwify.com.br/6UQRi4o |
| **Combo (os 2 + 2 planilhas)** | oferta principal | R$ 79,00 | pay.kiwify.com.br/jlz4BpA |
| Cassino | feito, mas **BLOQUEADO na Kiwify** (não permitido) — só venda manual/x1 | — | — |
- Posicionamento: **HONESTO, sem promessa de lucro.** +18 · jogo responsável · CVV 188.

## 2. DOMÍNIO & HOSPEDAGEM
- **Domínio:** `apostaboa.net.br` — registrado no **registro.br** (CNPJ MEI, expira 25/06/2027). DNS gerido no próprio registro.br (MODO AVANÇADO / editor de zona).
- **Hospedagem:** **Netlify** (estático, grátis). Site: `apostaboa.netlify.app` + domínio custom `apostaboa.net.br`. **Site ID:** `9bfc251a-68d3-4b3c-9d6f-e56b5128b747`.
- **Registros DNS:**
  - `A` raiz → `75.2.60.5` (site Netlify)
  - `CNAME` www → `apostaboa.netlify.app`
  - `TXT` raiz → `brevo-code:92c158512e7740d64bde2635a4bcfe0f` (e-mail)
  - `TXT` _dmarc → `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`
  - `CNAME` brevo1._domainkey → `b1.apostaboa-net-br.dkim.brevo.com`
  - `CNAME` brevo2._domainkey → `b2.apostaboa-net-br.dkim.brevo.com`
- **Comando de deploy:** `npx netlify-cli@latest deploy --prod --dir docs/ebooks/_site --site 9bfc251a-... --no-build`

## 3. LANDING PAGES
- **Tech:** HTML/CSS estático, **mobile-first**, tema escuro petróleo/verde, fontes **Bricolage Grotesque + Manrope** (Google Fonts).
- **Páginas:** `/combo/`, `/sportsbook/`, `/bolao/`, hub (raiz `/`).
- **Source:** `docs/ebooks/{combo,sportsbook,bolao}/vendas/index.html` + `docs/ebooks/hub-index.html`.
- **Publish dir:** `docs/ebooks/_site/` (cópia do source — sem build automático; copiar manual antes do deploy).
- **Blocos de conversão:** hero de transformação, "isso é pra você se…", quebra de objeção ("não é golpe/grupo de tip"), **bloco de autoridade**, **depoimentos estilo WhatsApp**, value stack, **garantia incondicional 7 dias**, FAQ, **botão WhatsApp flutuante** (inbound), sticky CTA, disclaimers +18.

## 4. E-MAIL (Brevo)
- Conta Brevo. **Remetente:** `Aposta Boa <contato@apostaboa.net.br>`, **reply-to = e-mail pessoal**.
- **Domínio autenticado** (DKIM + DMARC verdes; sem caixa hospedada — só envio).
- **Plano grátis:** 300 e-mails/dia (vira aquecimento).
- **Lista:** 10k leads opt-in, limpa via script (`lista_leads_10000-limpa.csv`, fica **fora do projeto**, em Downloads — privacidade/LGPD).
- **Resultado real:** ~14% abertura (inflada por Apple/bots), **0 clique, 0 venda** → e-mail frio NÃO funcionou.
- Materiais: `docs/ebooks/EMAIL-COMBO.md`, `EMAIL-SETUP-APOSTABOA.md`.

## 5. WHATSAPP
- **Número de vendas:** +55 43 99194-6703 (link `wa.me/5543991946703`).
- **Estratégia:** **INBOUND** (botão na LP, lead inicia a conversa). Outbound frio = **conta limitada/ban** (aprendido na prática).

## 6. KIWIFY
- **Conta:** CNPJ **MEI** (razão social = nome pessoal → aparece no comprovante do comprador; LP mostra só "Aposta Boa").
- **Programa de afiliados ATIVO** (no Combo): **50% comissão**, último clique, cookie 30 dias.
- **Link de convite de afiliado:** `dashboard.kiwify.com/join/affiliate/e6vKYGoq`.

## 7. SCRIPTS (Node .mjs)
- `scripts/limpar-lista.mjs` — limpa CSV de leads (corrige typos de domínio + valida sintaxe + checa MX por DNS). Grátis.
- split de lotes — divide CSV em lotes diários de aquecimento (saída em Downloads).
- `scripts/build-ebooks.mjs`, `scripts/build-planilhas.mjs` — geradores de ebook/planilha.

## 8. AGENTES (user-level, `~/.claude/agents/`, PT-BR)
copywriter · estrategista-oferta · infoproduto-kiwify · outbound-base · trafego-pago · growth-analytics · ebook-writer · revisor-conteudo.

## 9. DOCUMENTOS (`docs/ebooks/`)
DEPOIMENTOS-PLAYERS.md · EMAIL-COMBO.md · EMAIL-SETUP-APOSTABOA.md · OFERTA-E-ESTEIRA.md · VENDA-X1.md · LINKS-KIWIFY.md · PLAYBOOK-PRODUTO.md (playbook de clonar o stack).

## 10. APRENDIZADOS (o que funcionou / não)
- ❌ **E-mail frio** pra lista de 10k → 0 venda. ❌ **WhatsApp outbound frio** → ban.
- ✅ **Produto validado** (4 depoimentos reais de players). ✅ **Página forte** (CRO + mobile auditados).
- 🔜 **Pivô:** afiliados Kiwify (50%) + shoutout em canais/tipsters de aposta + audiência quente própria + comunidade (bolão grátis).
- ⚖️ **Legais:** sorteio com compra exige autorização **SECAP**; depoimento **só real** (fake = Procon/chargeback); MEI tem **teto R$81k/ano + CNAE** a validar com contador.

## 11. STACK REAPROVEITÁVEL (pra clonar em novo produto)
**registro.br** (domínio ~R$40/ano) → **Netlify** (host estático grátis) → **Brevo** (e-mail grátis 300/dia) → **Kiwify** (checkout + área de membros + afiliados) → **LP HTML mobile-first** → **agentes de venda**.

**Processo:** registrar domínio → autenticar e-mail (colar 4 registros DNS no registro.br) → escrever LP estática → deploy Netlify → criar produto+checkout na Kiwify → ativar afiliados. Tudo de **custo quase zero** até começar a vender.
