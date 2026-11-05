# Template de entrega (CV ATS-safe) + Checklist de revisão

## Template do CV (Markdown → PDF)

Exporte por Pandoc, ou cole no Google Docs/Word e "Salvar como PDF". **Fixo** = estrutura/títulos; `{{...}}` = vem do JSON da IA. **Uma coluna só, sem tabela, sem foto** — é isso que passa no parser da Gupy.

```markdown
# {{nome}}

{{cargo-alvo / headline curta}}
{{email}} • {{telefone}} • {{cidade, estado}} • {{linkedin}}

---

## Resumo Profissional

{{resumo_profissional}}

---

## Experiência Profissional

### {{cargo}} — {{empresa}}
{{MM/AAAA}} – {{MM/AAAA}}

- {{bullet 1: verbo de ação + feito + resultado}}
- {{bullet 2}}
- {{bullet 3}}

### {{cargo anterior}} — {{empresa}}
{{MM/AAAA}} – {{MM/AAAA}}

- {{bullet}}

---

## Formação Acadêmica

- {{curso}} — {{instituição}} — {{MM/AAAA}} ({{status}})

---

## Habilidades

{{habilidade}} • {{habilidade}} • {{habilidade}} • {{habilidade}}

---

## Idiomas

- {{idioma}} — {{nível}}

---

## Certificações
*(remover se vazia)*

- {{certificação}}
```

**Regras fixas (não negociáveis pra ATS):** 1 coluna; sem tabela/coluna/caixa de texto/imagem/ícone; fonte comum (Arial/Calibri/Georgia), preto no branco; títulos de seção exatamente como acima; 1–2 páginas (júnior/pleno: 1; sênior: até 2); datas MM/AAAA; **sem foto**.

**Entregue separado** (não vão no PDF do CV — é um 2º arquivo "Extras LinkedIn + Carta"): `headline_linkedin`, `resumo_profissional` (versão LinkedIn) e `carta_apresentacao`.

---

## Checklist de revisão humana (~15 min, antes de entregar)

1. **Honestidade — keywords:** toda keyword da vaga que entrou tem lastro real? Nada forçado? (cheque `alertas_honestidade` e `keywords_da_vaga`).
2. **`[PREENCHER]` zerado:** nenhum sobrou no documento final. Faltou dado? Cobre do cliente (use `campos_a_preencher`).
3. **Números reais:** toda métrica existia no material do cliente. Nada inventado.
4. **Datas:** MM/AAAA, sem buraco inexplicado, ordem cronológica decrescente.
5. **Verbos de ação:** bullets começam com verbo no passado, não gerúndio fraco nem "Responsável por".
6. **ATS-safe de verdade:** zero tabela/coluna/caixa/imagem/ícone. Uma coluna. (Template bonito de Canva geralmente quebra — não use.)
7. **Seções padrão:** títulos exatos; contato em texto (não em cabeçalho/rodapé que o parser ignora).
8. **Tamanho:** 1–2 páginas conforme senioridade.
9. **Cara de robô:** leia em voz alta o resumo e 2-3 bullets. Soa humano e específico? Corte clichê.
10. **Coerência com a vaga:** resumo e 3 primeiros bullets respondem ao que ESTA vaga pede? Habilidades da vaga no topo.
11. **Português:** ortografia, crase, concordância; grafia de nomes de empresa/curso.
12. **Contato funcional:** e-mail profissional, telefone com DDD, URL do LinkedIn certa.
13. **Carta + LinkedIn:** carta não promete o que o CV não sustenta; headline e "Sobre" batem com o CV.
14. **Teste do PDF:** abra o PDF, Ctrl+A / Ctrl+C, cole no bloco de notas — saiu texto limpo e na ordem? (Se embaralhar, o ATS também lê embaralhado.)
15. **Sem garantia:** nenhuma comunicação promete entrevista/vaga.

> A revisão humana **não é opcional** — é o que separa seu serviço de "rodei num GPT" e onde você pega a alucinação que o prompt anti-invenção não pegou. No Brasil (Gupy domina), o que mais reprova é **formatação** (itens 6 e 14), mais que conteúdo.
