// Gera as planilhas-bônus (.xlsx com fórmulas) de cada ebook.
// Uso: node scripts/build-planilhas.mjs
import ExcelJS from "exceljs";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("docs/ebooks");
const ACC = "FF11403D"; // header
const head = (ws, row = 1) => {
  const r = ws.getRow(row);
  r.font = { bold: true, color: { argb: "FFFFFFFF" } };
  r.eachCell((c) => (c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACC } }));
};
const out = (slug, file) => {
  const dir = path.join(ROOT, slug, "bonus");
  mkdirSync(dir, { recursive: true });
  return path.join(dir, file);
};

/* ---------- 1) SPORTSBOOK: registro + matched betting ---------- */
async function sportsbook() {
  const wb = new ExcelJS.Workbook();
  wb.calcProperties.fullCalcOnLoad = true;

  const cfg = wb.addWorksheet("Config");
  cfg.columns = [{ width: 28 }, { width: 16 }];
  cfg.addRow(["Banca inicial (R$)", 1000]);
  cfg.addRow(["Unidade (% da banca)", 0.02]);
  cfg.addRow(["Valor da unidade (R$)", { formula: "Config!B1*Config!B2" }]);
  cfg.getColumn(2).numFmt = '#,##0.00';
  cfg.getCell("B2").numFmt = "0.0%";

  const ws = wb.addWorksheet("Registro");
  ws.columns = [
    { header: "Data", key: "d", width: 12 },
    { header: "Esporte", key: "e", width: 14 },
    { header: "Evento", key: "ev", width: 26 },
    { header: "Mercado", key: "m", width: 20 },
    { header: "Odd", key: "o", width: 8 },
    { header: "Stake (R$)", key: "s", width: 11 },
    { header: "Resultado", key: "r", width: 12 },
    { header: "Odd fech.", key: "of", width: 10 },
    { header: "Lucro/Prej. (R$)", key: "l", width: 16 },
    { header: "CLV %", key: "clv", width: 10 },
  ];
  head(ws);
  ws.addRow(["2026-06-20", "Futebol", "Time A x Time B", "Vitória A", 1.9, 50, "Green", 1.8, null, null]);
  ws.addRow(["2026-06-21", "Basquete", "Time C x Time D", "Over 210.5", 2.0, 50, "Red", 2.1, null, null]);
  for (let i = 0; i < 28; i++) ws.addRow([]);
  for (let r = 2; r <= 31; r++) {
    ws.getCell(`I${r}`).value = { formula:
      `IF($G${r}="Green",$F${r}*($E${r}-1),IF($G${r}="Red",-$F${r},0))` };
    ws.getCell(`J${r}`).value = { formula:
      `IF(AND($E${r}>0,$H${r}>0),($E${r}/$H${r}-1),"")` };
    ws.getCell(`I${r}`).numFmt = "#,##0.00";
    ws.getCell(`J${r}`).numFmt = "0.0%";
  }
  ws.getCell("L1").value = "RESUMO";
  ws.getCell("L1").font = { bold: true };
  const sum = [
    ["Total apostado", "=SUM(F2:F31)", "#,##0.00"],
    ["Lucro/Prejuízo total", "=SUM(I2:I31)", "#,##0.00"],
    ["ROI / Yield", "=IF(SUM(F2:F31)=0,0,SUM(I2:I31)/SUM(F2:F31))", "0.0%"],
    ["Nº de apostas", '=COUNTA(G2:G31)', "0"],
    ["Taxa de Green", '=IF(COUNTA(G2:G31)=0,0,COUNTIF(G2:G31,"Green")/COUNTA(G2:G31))', "0.0%"],
    ["CLV médio", '=IFERROR(AVERAGE(J2:J31),0)', "0.0%"],
  ];
  sum.forEach((s, i) => {
    ws.getCell(`L${i + 2}`).value = s[0];
    ws.getCell(`M${i + 2}`).value = { formula: s[1].slice(1) };
    ws.getCell(`M${i + 2}`).numFmt = s[2];
  });
  ws.getColumn(13).width = 14;

  const mb = wb.addWorksheet("Matched Betting");
  mb.columns = [{ width: 30 }, { width: 14 }];
  mb.addRow(["CALCULADORA MATCHED BETTING", ""]);
  mb.getRow(1).font = { bold: true };
  mb.addRow(["Odd Back (casa)", 2.0]);
  mb.addRow(["Stake Back (R$)", 100]);
  mb.addRow(["Odd Lay (exchange)", 2.05]);
  mb.addRow(["Comissão exchange", 0.05]);
  mb.getCell("B5").numFmt = "0.0%";
  mb.addRow(["Stake Lay (R$)", { formula: "(B2*B3)/(B4-B5)" }]);
  mb.addRow(["Responsabilidade (R$)", { formula: "B6*(B4-1)" }]);
  mb.addRow(["Lucro se Back ganha (R$)", { formula: "B3*(B2-1)-B7" }]);
  mb.addRow(["Lucro se Lay ganha (R$)", { formula: "B6*(1-B5)-B3" }]);
  mb.addRow(["Nota", "Aposta qualificadora: prejuízo pequeno é normal; o lucro real vem da FREEBET."]);
  ["B6", "B7", "B8", "B9"].forEach((c) => (mb.getCell(c).numFmt = "#,##0.00"));

  await wb.xlsx.writeFile(out("sportsbook", "planilha-registro-e-matched.xlsx"));
  console.log("OK sportsbook/bonus/planilha-registro-e-matched.xlsx");
}

/* ---------- 2) BOLÃO: pontuação automática ---------- */
async function bolao() {
  const wb = new ExcelJS.Workbook();
  wb.calcProperties.fullCalcOnLoad = true;

  const cfg = wb.addWorksheet("Config");
  cfg.columns = [{ width: 32 }, { width: 12 }];
  cfg.addRow(["Pontos por acertar o vencedor/empate", 3]);
  cfg.addRow(["Pontos por acertar o placar exato", 5]);
  cfg.addRow(["(placar exato substitui o de vencedor)", ""]);

  const ws = wb.addWorksheet("Jogos");
  ws.columns = [
    { header: "Jogo", width: 22 }, { header: "Palpite Casa", width: 13 },
    { header: "Palpite Fora", width: 13 }, { header: "Real Casa", width: 11 },
    { header: "Real Fora", width: 11 }, { header: "Pontos", width: 10 },
  ];
  head(ws);
  ws.addRow(["Brasil x Sérvia", 2, 0, 2, 0]);
  ws.addRow(["Argentina x México", 2, 0, 2, 1]);
  for (let i = 0; i < 28; i++) ws.addRow([]);
  for (let r = 2; r <= 31; r++) {
    ws.getCell(`F${r}`).value = { formula:
      `IF(OR($D${r}="",$B${r}=""),"",` +
      `IF(AND($B${r}=$D${r},$C${r}=$E${r}),Config!$B$2,` +
      `IF(SIGN($B${r}-$C${r})=SIGN($D${r}-$E${r}),Config!$B$1,0)))` };
  }
  ws.getCell("H1").value = "TOTAL DE PONTOS";
  ws.getCell("H1").font = { bold: true };
  ws.getCell("H2").value = { formula: "SUM(F2:F31)" };
  ws.getCell("H2").font = { bold: true, size: 14 };
  ws.getColumn(8).width = 16;

  await wb.xlsx.writeFile(out("bolao", "planilha-bolao-pontuacao.xlsx"));
  console.log("OK bolao/bonus/planilha-bolao-pontuacao.xlsx");
}

/* ---------- 3) CASSINO: orçamento & limites ---------- */
async function cassino() {
  const wb = new ExcelJS.Workbook();
  wb.calcProperties.fullCalcOnLoad = true;

  const lim = wb.addWorksheet("Limites");
  lim.columns = [{ width: 34 }, { width: 14 }];
  lim.addRow(["Banca de lazer do mês (R$)", 300]);
  lim.addRow(["Limite por sessão (R$)", 50]);
  lim.addRow(["Stop loss por sessão (R$)", 50]);
  lim.addRow(["Stop win por sessão (R$)", 75]);
  lim.getColumn(2).numFmt = "#,##0.00";

  const ws = wb.addWorksheet("Sessoes");
  ws.columns = [
    { header: "Data", width: 12 }, { header: "Jogo", width: 18 },
    { header: "Entrei com (R$)", width: 15 }, { header: "Saí com (R$)", width: 13 },
    { header: "Resultado (R$)", width: 15 }, { header: "Dentro do limite?", width: 17 },
  ];
  head(ws);
  ws.addRow(["2026-06-20", "Slots", 50, 0]);
  ws.addRow(["2026-06-21", "Blackjack", 50, 80]);
  for (let i = 0; i < 28; i++) ws.addRow([]);
  for (let r = 2; r <= 31; r++) {
    ws.getCell(`E${r}`).value = { formula: `IF($C${r}="","",$D${r}-$C${r})` };
    ws.getCell(`F${r}`).value = { formula: `IF($C${r}="","",IF($C${r}<=Limites!$B$2,"OK","ACIMA DO LIMITE"))` };
    ws.getCell(`E${r}`).numFmt = "#,##0.00";
  }
  ws.getCell("H1").value = "RESUMO DO MÊS";
  ws.getCell("H1").font = { bold: true };
  const rows = [
    ["Total levado às sessões", "=SUM(C2:C31)", "#,##0.00"],
    ["Saldo do mês (R$)", "=SUM(E2:E31)", "#,##0.00"],
    ["% da banca de lazer usada", "=IF(Limites!B1=0,0,SUM(C2:C31)/Limites!B1)", "0%"],
    ["Status do orçamento", '=IF(SUM(C2:C31)>Limites!B1,"ESTOUROU O ORÇAMENTO","Dentro do orçamento")', "@"],
  ];
  rows.forEach((s, i) => {
    ws.getCell(`H${i + 2}`).value = s[0];
    ws.getCell(`I${i + 2}`).value = { formula: s[1].slice(1) };
    ws.getCell(`I${i + 2}`).numFmt = s[2];
  });
  ws.getColumn(8).width = 26; ws.getColumn(9).width = 20;

  await wb.xlsx.writeFile(out("cassino", "planilha-orcamento-limites.xlsx"));
  console.log("OK cassino/bonus/planilha-orcamento-limites.xlsx");
}

await sportsbook();
await bolao();
await cassino();
console.log("Planilhas geradas.");
