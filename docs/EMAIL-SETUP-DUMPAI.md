# Setup de envio — e-mail pra base fria (DumpAI)

> Como disparar pra base **sem queimar o domínio** (o mesmo que entrega a compra da Kiwify) e
> **sem violar LGPD**. A sequência de e-mails está em [`EMAILS-DUMPAI.md`](EMAILS-DUMPAI.md).
> Regra-mãe: o "suporte@ blastando base fria" é exatamente o que destrói o ativo. Caminho legítimo abaixo.

## 1. Ferramenta (ESP) — nunca Gmail/Outlook/suporte
Inbox pessoal corta em ~500/dia e vincula a reputação ao seu domínio transacional. Use um ESP:

| ESP | Grátis | Pra quê |
|-----|--------|---------|
| **Brevo** (recomendado pra começar) | 300 e-mails/dia | Interface PT, double opt-in nativo, bom pro BR |
| Mailerlite | 1k contatos / 12k/mês | Editor ótimo; aprovação rígida (rejeita base comprada) |
| Amazon SES | ~US$0,10/1k | Baratíssimo em escala, mas cru — migrar depois |

⚠️ Brevo/Mailerlite **proíbem base comprada/raspada** nos Termos. Base precisa de origem defensável.

## 2. Domínio — proteja o transacional
- Transacional/produto: `dumpai.com.br` · Marketing: **subdomínio separado** `mkt.dumpai.com.br`.
- Se queimar o marketing, o principal (Kiwify/recuperação de senha) sobrevive.
- **`.vercel.app` não serve pra enviar** — precisa de domínio próprio (você controla o DNS).
- Autenticar os 3 registros (o ESP entrega os valores; você cola no DNS e valida "verde"):
  - **SPF** (TXT): autoriza o servidor do ESP. `v=spf1 include:spf.brevo.com -all`
  - **DKIM** (TXT/CNAME): assinatura que prova que o e-mail não foi adulterado.
  - **DMARC** (`_dmarc...`): comece em `p=none` (monitora) → depois `quarantine` → `reject`.
- **Sem os 3 verdes, não envia.**

## 3. Warm-up (domínio novo + base fria) — volume crescente
| Dia | Volume | Pra quem |
|-----|--------|----------|
| 1 | 20-50 | mais quentes |
| 2-3 | 50-200 | quentes |
| 4-7 | 300-1.000 | mornos |
| Sem. 2 | dobra a cada 2-3 dias | base fria restante (só se métricas boas) |

**Pare e investigue se:** bounce > 2-3% · spam > 0,1% (1/1.000) · aberturas despencam.
Comece pelos contatos que mais provavelmente abrem — engajamento positivo ensina os provedores.

## 4. Limpeza da lista — antes de qualquer envio
Bounce alto no 1º envio = punição imediata (lista parece comprada). Então:
1. Valide a lista (**MillionVerifier** — melhor custo · ZeroBounce · NeverBounce).
2. Remova inválidos, descartáveis e **spam-traps** (trap = morte da reputação).
3. Segure os "risco/catch-all" pra depois. Deduplique. Remova quem já deu opt-out.
4. Meta: entrar com **bounce < 2%**. Se a base não passa, não é enviável.

## 5. LGPD — campanha de RE-PERMISSÃO (o que protege você)
- **B2C frio é arriscado:** "legítimo interesse" é frágil pra B2C; a aposta segura é **consentimento**.
- **Saída:** o 1º e-mail **não vende** — se apresenta com transparência, **entrega valor** e **pede permissão**
  ("quer continuar recebendo? confirma aqui"). Quem confirma → opt-in registrado → recebe a oferta.
  Quem não confirma em ~2 envios → sai da lista. (É exatamente a sequência permission-first já escrita.)
- **Sempre:** opt-out funcional em todo e-mail · remetente identificado · **registro de consentimento**
  (quem confirmou, quando, origem) = sua prova se alguém reclamar.
- **Se a base for comprada/raspada sem nenhuma relação → NÃO envie.** Capte opt-in do zero
  (formulário na landing, Instagram, lead magnet). Mais lento, mas é o único que não te queima.

## 6. Checklist go/no-go (todos ✅ antes do 1º disparo)
- [ ] Domínio próprio registrado (não `.vercel.app`)
- [ ] Subdomínio de marketing separado do transacional
- [ ] SPF + DKIM + DMARC verdes (DMARC em `p=none` no início)
- [ ] ESP configurado (Brevo) — não Gmail/suporte
- [ ] Lista validada; inválidos/traps removidos; bounce esperado < 2%
- [ ] Origem da lista **defensável** (se comprada/raspada → NO-GO)
- [ ] 1º e-mail é re-permissão (valor + permissão), não venda
- [ ] Opt-out em todo e-mail + registro de consentimento pronto
- [ ] Warm-up definido (começa 20-50/dia); pausa se bounce > 2-3% ou spam > 0,1%
