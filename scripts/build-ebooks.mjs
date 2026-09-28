// Compila os ebooks (markdown -> HTML estilizado pronto pra virar PDF).
// Uso: node scripts/build-ebooks.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

const ROOT = path.resolve("docs/ebooks");
marked.setOptions({ gfm: true });

const books = [
  { slug: "sportsbook", title: "Sportsbook com Método",
    parts: ["00-intro-fundamentos", "01-value-betting", "02-bonus-matched", "03-gestao-banca-operacao"] },
  { slug: "cassino", title: "Cassino com Consciência",
    parts: ["00-intro-verdade", "01-rtp-selecao", "02-bonus-cashback", "03-banca-jogo-responsavel"] },
  { slug: "bolao", title: "Bolão da Copa com Estratégia",
    parts: ["00-intro", "01-previsao", "02-estrategia-ev", "03-operacao"] },
];

const css = `
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
  @page { size: A4; margin: 20mm 18mm; }
  html, body { margin: 0; padding: 0; }
  body { font-family: Georgia, "Times New Roman", serif; color: #1c1c1c; line-height: 1.62; font-size: 11.6pt; }
  .cover { text-align: center; page-break-after: always; }
  .cover svg { width: 100%; height: auto; }
  .chapter { page-break-before: always; }
  h1 { font-family: Arial, Helvetica, sans-serif; font-size: 25pt; color: #0c2a2b; line-height: 1.2;
       border-bottom: 4px solid #19b98a; padding-bottom: 10px; margin: 0 0 22px; }
  h2 { font-family: Arial, Helvetica, sans-serif; font-size: 16.5pt; color: #11403d; margin: 26px 0 8px; }
  h3 { font-family: Arial, Helvetica, sans-serif; font-size: 13pt; color: #1a6359; margin: 18px 0 6px; }
  p { margin: 0 0 11px; }
  ul, ol { margin: 0 0 12px; padding-left: 22px; }
  li { margin: 3px 0; }
  strong { color: #0c2a2b; }
  a { color: #117a5c; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 10.4pt;
          font-family: Arial, Helvetica, sans-serif; page-break-inside: avoid; }
  th, td { border: 1px solid #c9d6d2; padding: 7px 9px; text-align: left; vertical-align: top; }
  thead th { background: #11403d; color: #fff; }
  tbody tr:nth-child(even) { background: #f1f6f4; }
  blockquote { margin: 14px 0; padding: 10px 16px; background: #f3f8f6;
               border-left: 5px solid #19b98a; color: #2a3a36; font-style: italic; }
  code { background: #eef3f1; padding: 1px 5px; border-radius: 4px; font-size: 10pt; }
  hr { border: 0; border-top: 1px solid #d7e0dd; margin: 22px 0; }
`;

for (const b of books) {
  const dir = path.join(ROOT, b.slug);
  const cover = readFileSync(path.join(dir, "capa.svg"), "utf8");
  let body = `<section class="cover">${cover}</section>`;
  for (const p of b.parts) {
    const md = readFileSync(path.join(dir, `${p}.md`), "utf8");
    body += `<section class="chapter">${marked.parse(md)}</section>`;
  }
  const html = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">`
    + `<title>${b.title}</title><style>${css}</style></head><body>${body}</body></html>`;
  writeFileSync(path.join(dir, `${b.slug}.html`), html, "utf8");
  console.log("OK:", `${b.slug}.html`);
}
console.log("Build concluído.");
