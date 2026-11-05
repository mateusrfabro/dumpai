# Guia: criar o produto na Kiwify + colocar a landing do CV no ar

Dois passos pra transformar a landing pronta (`landing/index.html`) num destino de tráfego de verdade.
(Os nomes exatos de botão na Kiwify podem variar um pouco — a lógica é a mesma.)

---

## PARTE A — Criar o produto de CV na Kiwify (gera o link de checkout)

Vamos criar **2 produtos** (os 2 pacotes da landing), cada um com seu link.

### Produto 1 — "CV Aprovado — Currículo ATS" (R$79)
1. Kiwify → **Produtos → Criar produto → Produto digital**.
2. **Nome:** `CV Aprovado — Currículo otimizado pra ATS`.
3. **Tipo de pagamento:** Pagamento único. **Preço:** R$79.
4. **Descrição** (honesta — sem "garante emprego"):
   > Otimização do seu currículo para passar nos filtros ATS, entrega em 24h. Reescrevo e
   > alinho o que você já tem às palavras-chave da vaga (não invento experiência) e te
   > explico o que mudei. Não garante entrevista — melhora sua legibilidade e força no filtro.
5. **Entrega / conteúdo:** este é um **serviço** (entrega manual), não um arquivo pra baixar. Então configure a entrega como **instrução pós-compra** (página de obrigado + e-mail):
   > ✅ Pagamento confirmado! Para eu começar, me envie 2 coisas no WhatsApp **[WA.ME]**:
   > 1) seu currículo atual (PDF/Word/foto) e 2) o link ou print da vaga-alvo.
   > Entrego seu currículo otimizado em até 24h + um resumo do que mudei.
   - Na Kiwify isso vai em "Página de obrigado" / "conteúdo de entrega" / e-mail de pós-venda.
6. **Pagamento:** ative **Pix** (e cartão, se quiser).
7. **Order bump** (opcional, recomendado): adicione um bump **"Entrega Express 6h — +R$30"** (crie como um produtinho de R$30 e marque como bump deste produto).
8. **Reembolso:** mantenha a garantia padrão (7 dias) — honesto e reduz fricção.
9. **Salvar e publicar** → copie o **link de checkout** (algo como `pay.kiwify.com.br/xxxx`).

### Produto 2 — "CV Aprovado — Currículo + LinkedIn" (R$149)
- Repita os passos, **Preço R$149**, nome `CV Aprovado — Currículo + LinkedIn (ATS)`.
- Descrição: tudo do Produto 1 **+ otimização do LinkedIn** (headline, sobre, experiência).
- Mesmo order bump Express 6h. Copie o **2º link de checkout**.

> Resultado: você terá **2 links** (R$79 e R$149) pra colar na landing.

---

## PARTE B — Colocar a landing no ar

A landing é um arquivo HTML único (`docs/servico-cv/landing/index.html`). Antes de publicar, preencha os placeholders (estão listados no topo do arquivo):

1. **Trocar `[LINK_CHECKOUT_KIWIFY]`** (7 lugares) — use os 2 links da Parte A: o do R$79 nos botões do pacote básico, o do R$149 nos botões do completo. (Ctrl+H pra substituir.)
2. **Trocar `[WA_ME_LINK]`** (4 lugares) — seu `https://wa.me/55DDDNUMERO`.
3. **Nome** (`CV Aprovado`) — troque se quiser outro (marcado com `BRAND-NAME`).
4. **Pixel:** o gestor te passa o `<script>` do pixel Meta → cole onde está `<!-- PIXEL META -->` no `<head>` e re-publique. (Ou dê acesso de edição a ele.)

### Onde hospedar (grátis, no ar em minutos)
Opção mais rápida — **Netlify Drop:**
1. Acesse **app.netlify.com/drop**.
2. Arraste a **pasta `landing`** (ou o `index.html`) pra janela.
3. Pronto — você ganha uma URL no ar (ex.: `nome-aleatorio.netlify.app`). **Grátis.**
- Alternativas iguais de boas: **Cloudflare Pages** ou **Vercel** (arrasta/conecta e publica).

Essa URL grátis **já serve pra começar os anúncios** — não precisa de domínio pago pra testar.

---

## Sobre o domínio (sua pergunta)

- **Não use o `apostaboa.net.br`** pra o CV. Ele é a marca de **aposta** — num serviço de currículo, fica incoerente, passa menos credibilidade e ainda pode confundir a revisão do Meta. Mantenha os dois mundos separados.
- **Se você tem outro domínio neutro** (não-aposta), dá pra usar um **subdomínio** tipo `cv.seudominio.com` apontando pra Netlify/Cloudflare. Me diz qual domínio é que eu te guio a apontar.
- **Se não tem**, comece com a **URL grátis da Netlify** (acima). Compra um domínio dedicado pro CV (~R$40/ano no Registro.br, ex.: `cvaprovado.com.br`) só **depois** que validar a venda. Não gaste em domínio antes de provar que converte.

---

## Resumo do que falta (suas mãos)
1. Criar os 2 produtos na Kiwify (Parte A) → pegar os 2 links.
2. Preencher os placeholders na landing (links + wa.me).
3. Publicar grátis na Netlify (Parte B) → URL no ar.
4. Passar a URL + pedir o pixel ao gestor.
