# Links de checkout — Kiwify (coleção de ebooks)

| Produto | Preço | Link de checkout | Status |
|---|---|---|---|
| Sportsbook com Método | R$ 49,90 | https://pay.kiwify.com.br/ShYjgjy | ✅ no ar |
| Bolão da Copa com Estratégia | R$ 49,90 | https://pay.kiwify.com.br/6UQRi4o | ✅ no ar |
| Cassino com Consciência | R$ 49,90 | — | 🚫 barrado na Kiwify → vender no x1/manual |
| Combo (Sportsbook + Bolão) | R$ 79,00 | https://pay.kiwify.com.br/jlz4BpA | ✅ no ar |

> Cassino: Kiwify bane jogo de azar. Vender direto (x1) ou em outra plataforma que aceite.
> O combo na Kiwify inclui só os 2 permitidos (Sportsbook + Bolão). Links servem pra x1, e-mail e página de vendas.

## Páginas de venda (Netlify) — deploy via CLI

Site Netlify: `apostaboa` (ID 9bfc251a-68d3-4b3c-9d6f-e56b5128b747). Deploy: `npx netlify-cli deploy --prod --dir=docs/ebooks/_site --site=<id> --no-build` (gera `_site` antes via cópia do hub + vendas/).

| Página | URL | Liga no checkout |
|---|---|---|
| Hub | https://apostaboa.netlify.app/ | (lista os 3) |
| Sportsbook | https://apostaboa.netlify.app/sportsbook/ | ShYjgjy |
| Bolão | https://apostaboa.netlify.app/bolao/ | 6UQRi4o |
| Combo | https://apostaboa.netlify.app/combo/ | jlz4BpA |

> Auditoria aplicada (UX/a11y/compliance): foco de teclado, alvo de toque ≥44px, contraste do texto legal, chevron no FAQ, reduced-motion; rodapé do Bolão com Jogadores Anônimos/CVV 188; "Risco zero"→"Compra sem risco"; preços padronizados "R$ 79,00".
> TODO: colar cada URL no campo "Página de vendas" do produto na Kiwify (no lugar do aggron.com.br provisório).
