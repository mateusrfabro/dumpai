# Setup de envio — apostaboa.net.br (Brevo)

> Domínio `apostaboa.net.br` registrado no registro.br (CNPJ, expira 25/06/2027), DNS no registro.br.
> Brevo: conta "Dump AI" → domínio adicionado em modo **manual** ("autenticar por conta própria").
> Status em 25/06: **domínio em transição (~2h após registro)** — o editor de zona (MODO AVANÇADO)
> só aceita registros depois que a transição completar. Aguardar e voltar.

## Os 4 registros DNS pra colar no registro.br (MODO AVANÇADO → Editar Zona)

| # | Tipo | Nome (host) | Dados / Valor |
|---|------|-------------|---------------|
| 1 | TXT | *(em branco / raiz)* | `brevo-code:92c158512e7740d64bde2635a4bcfe0f` |
| 2 | CNAME | `brevo1._domainkey` | `b1.apostaboa-net-br.dkim.brevo.com` |
| 3 | CNAME | `brevo2._domainkey` | `b2.apostaboa-net-br.dkim.brevo.com` |
| 4 | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

- No registro.br o "Nome" é só o prefixo (ele completa `.apostaboa.net.br`). Registro 1 = raiz → Nome em branco.
- Se CNAME der erro de formato, põe ponto final no valor: `b1.apostaboa-net-br.dkim.brevo.com.`
- **Sem SPF** — o Brevo alinha via DKIM + return-path próprio. Correto.

## Sequência
1. Esperar a transição do domínio (~2h) → abrir registro.br → DNS → **MODO AVANÇADO**.
2. Adicionar os 4 registros → **Salvar alterações**.
3. Voltar ao Brevo → **"Autenticar este domínio de e-mail"** → fica verde (minutos, até 48h).
4. Criar **remetente** `contato@apostaboa.net.br` no Brevo, com **reply-to = e-mail pessoal** (respostas caem na sua caixa; não precisa hospedar a caixa).

## Depois do verde — disparo do Combo
1. Validar a lista (MillionVerifier) → só válidos.
2. Importar no Brevo → segmentar os mais quentes.
3. Criar a campanha com o **e-mail único do Combo** (ver `EMAIL-COMBO.md` → "Versão de 1 e-mail").
4. Disparar em **lotes de 300/dia** (limite grátis = aquecimento), mais quentes primeiro.
5. Reenvio só pra quem não abriu, 3-4 dias depois, trocando o assunto.

## Bônus (opcional, depois)
Apontar `apostaboa.net.br` → site (no editor de zona, registro CNAME/redirect pro `apostaboa.netlify.app`).
