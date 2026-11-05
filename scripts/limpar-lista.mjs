// Limpeza da lista (grátis): typos de domínio + sintaxe + checagem de MX (DNS).
// MX ausente = domínio não recebe e-mail = bounce garantido -> removido.
// NÃO verifica a caixa específica (isso só com SMTP/ferramenta paga).
// Uso: node scripts/limpar-lista.mjs "C:\\caminho\\lista.csv"
import { readFileSync, writeFileSync } from "node:fs";
import { promises as dns } from "node:dns";
import path from "node:path";

const input = process.argv[2];
if (!input) { console.error("Passe o caminho do CSV."); process.exit(1); }

let raw = readFileSync(input, "utf8");
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const lines = raw.split(/\r?\n/).filter((l) => l.trim().length);
const header = lines.shift();

const fixes = new Map([
  ["gmil.com","gmail.com"],["gmial.com","gmail.com"],["gmai.com","gmail.com"],["gmail.co","gmail.com"],
  ["gmaill.com","gmail.com"],["gamil.com","gmail.com"],["gmail.con","gmail.com"],["gmail.cm","gmail.com"],
  ["gmali.com","gmail.com"],["gmeil.com","gmail.com"],["gmail.comm","gmail.com"],["gmail.om","gmail.com"],
  ["gmail.cpm","gmail.com"],["gemail.com","gmail.com"],["gmaul.com","gmail.com"],["hormail.com","hotmail.com"],
  ["hotmial.com","hotmail.com"],["hotmai.com","hotmail.com"],["hotmail.co","hotmail.com"],["hotmal.com","hotmail.com"],
  ["hotmail.con","hotmail.com"],["hotmail.comm","hotmail.com"],["hotmaill.com","hotmail.com"],["hotmil.com","hotmail.com"],
  ["outlok.com","outlook.com"],["outloo.com","outlook.com"],["outlook.co","outlook.com"],["outllok.com","outlook.com"],
  ["hotmail.om","hotmail.com"],["yaho.com","yahoo.com"],["yahoo.co","yahoo.com"],["yahho.com","yahoo.com"],
  ["icloud.co","icloud.com"],["iclou.com","icloud.com"],["iclod.com","icloud.com"],["ivloud.com","icloud.com"],
  ["gmail.com.br","gmail.com"],["gamail.com","gmail.com"],["hitmail.com","hotmail.com"],
]);
const reEmail = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

// ---- 1) parse + typo + sintaxe ----
const rows = []; // {nome,telefone,email}
const removidos = [];
const corrigidos = [];
const seen = new Set();
for (const line of lines) {
  const i1 = line.indexOf(","), i2 = line.indexOf(",", i1 + 1);
  if (i1 < 0 || i2 < 0) { removidos.push([line, "linha malformada"]); continue; }
  const nome = line.slice(0, i1).trim();
  const telefone = line.slice(i1 + 1, i2).trim();
  let email = line.slice(i2 + 1).trim().toLowerCase().replace(/\s+/g, "");
  if (!email) { removidos.push([line, "sem email"]); continue; }
  const at = email.lastIndexOf("@");
  if (at > 0) { const dom = email.slice(at + 1); if (fixes.has(dom)) { const n = email.slice(0, at) + "@" + fixes.get(dom); corrigidos.push([email, n]); email = n; } }
  if (email.indexOf("@") !== email.lastIndexOf("@")) { removidos.push([`${nome},${telefone},${email}`, "@ duplicado"]); continue; }
  if (!reEmail.test(email) || email.includes("..")) { removidos.push([`${nome},${telefone},${email}`, "email invalido"]); continue; }
  if (seen.has(email)) { removidos.push([`${nome},${telefone},${email}`, "duplicado"]); continue; }
  seen.add(email);
  rows.push({ nome, telefone, email, dom: email.slice(email.lastIndexOf("@") + 1) });
}

// ---- 2) checagem de MX por domínio único ----
const domains = [...new Set(rows.map((r) => r.dom))];
const mx = new Map();
async function checkMx(d) {
  try { const r = await dns.resolveMx(d); return r && r.length > 0; }
  catch (e) { if (e.code === "ENOTFOUND" || e.code === "ENODATA") return false; return true; } // erro transitório => mantém
}
async function pool(items, limit, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; mx.set(items[idx], await fn(items[idx])); }
  }));
}
console.log(`Checando MX de ${domains.length} domínios únicos...`);
await pool(domains, 40, checkMx);

// ---- 3) separa por MX ----
const limpos = [];
for (const r of rows) {
  if (mx.get(r.dom) === false) { removidos.push([`${r.nome},${r.telefone},${r.email}`, "dominio sem MX (bounce certo)"]); continue; }
  limpos.push(`${r.nome},${r.telefone},${r.email}`);
}

const dir = path.dirname(input), base = path.basename(input, path.extname(input));
writeFileSync(path.join(dir, base + "-limpa.csv"), header + "\n" + limpos.join("\n"), "utf8");
writeFileSync(path.join(dir, base + "-removidos.csv"), "linha;motivo\n" + removidos.map((r) => `"${String(r[0]).replace(/"/g, '""')}";${r[1]}`).join("\n"), "utf8");

const motivos = {}; for (const [, m] of removidos) motivos[m] = (motivos[m] || 0) + 1;
const badDoms = domains.filter((d) => mx.get(d) === false);
console.log("=== RESULTADO ===");
console.log("Total:", lines.length, "| VÁLIDOS:", limpos.length, "| Removidos:", removidos.length, "| Typos corrigidos:", corrigidos.length);
console.log("Motivos de remoção:", JSON.stringify(motivos));
console.log("Domínios sem MX (exemplos):", badDoms.slice(0, 15).join(", "));
console.log("Saída:", path.join(dir, base + "-limpa.csv"));
