# Parte 1 — Fundamentos de Previsão

Antes de falar de estratégia de bolão, a gente precisa resolver um problema mais básico: **como estimar a chance de um resultado sem cair no achismo**. Quase todo mundo no seu bolão vai chutar "no feeling". Se você conseguir transformar palpite em estimativa — mesmo que imperfeita —, já largou na frente. Não porque você vai "acertar tudo" (ninguém acerta; futebol tem muita sorte embutida), mas porque você vai errar de um jeito mais inteligente e consistente.

Esta parte é sobre os fundamentos. Nada de fórmula mágica. A ideia é simples: **uma estimativa fundamentada vale mais que um chute**, e ela vem com uma etiqueta honesta de incerteza colada nela.

---

## 1. Como estimar a chance de um resultado sem achismo

Existem quatro fontes de informação que, combinadas, te dão uma estimativa razoável de quem ganha e por quanto. Nenhuma sozinha é suficiente; juntas, formam um quadro.

### Fonte A — Rankings de força (FIFA / Elo)

O **ranking da FIFA** é o mais conhecido, mas ele é lento e politizado (depende de tipo de jogo, calendário). Para previsão, o **rating Elo** costuma ser melhor: ele dá uma "nota de força" a cada seleção e foi feito justamente para estimar probabilidade de confronto. Sites como o *World Football Elo Ratings* publicam esses números de graça.

A grande vantagem do Elo: a **diferença** entre dois ratings se converte direto em probabilidade. Quanto maior a diferença, maior o favoritismo — e a fórmula te diz *por quanto*.

> **Exemplo ilustrativo (números fictícios, só para mostrar o método):**
> Seleção A tem Elo 2000. Seleção B tem Elo 1800. Diferença = 200 pontos.
> Uma aproximação comum de Elo dá ao time mais forte cerca de **76%** de chance num confronto direto (sem contar empate). Se a diferença fosse só 50 pontos, cairia para uns **57%** — quase moeda jogada para o alto.
> *Repare:* os dois são "favoritos", mas o primeiro é um favoritismo sólido e o segundo é quase 50/50. Essa diferença é tudo.

### Fonte B — Odds das casas como "probabilidade do mercado"

Esta é a fonte mais poderosa e a mais ignorada pelos amadores. As casas de aposta empregam gente boa e processam um volume gigante de dinheiro. A **odd** que elas oferecem é, na prática, a opinião do mercado sobre a probabilidade — já com correção de quem aposta com a cabeça.

Para usar, você converte a odd em **probabilidade implícita**:

```
Probabilidade implícita (%) = (1 / odd decimal) × 100
```

> **Exemplo ilustrativo (odds fictícias de um jogo qualquer):**
> - Vitória do Time A: odd **1.80** → 1 / 1.80 = **55,6%**
> - Empate: odd **3.50** → 1 / 3.50 = **28,6%**
> - Vitória do Time B: odd **4.50** → 1 / 4.50 = **22,2%**
>
> Soma: 55,6 + 28,6 + 22,2 = **106,4%**.

Repare que deu **mais que 100%**. Isso não é erro: esses 6,4% a mais são a **margem da casa** (o "overround", o jeito da casa ganhar dinheiro nos dois lados). Para ter a probabilidade "limpa", você **desconta a margem**, dividindo cada percentual pela soma total:

> **Continuando o exemplo:**
> - Time A: 55,6 / 106,4 = **52,3%**
> - Empate: 28,6 / 106,4 = **26,9%**
> - Time B: 22,2 / 106,4 = **20,8%**
>
> Agora soma 100%. Essa é a melhor estimativa "do mercado" para esse jogo.

Guarde essa conta. Ela aparece de novo na Parte 2, porque é a base para achar onde o bolão está *mal precificado*.

### Fonte C — Histórico e confronto direto

Histórico ajuda, mas com parcimônia. "Time X nunca perdeu para o Time Y em Copa" é uma frase bonita e quase sempre **irrelevante** — são amostras minúsculas, de times que nem existem mais com os mesmos jogadores. Use histórico para:

- **Tendência de longo prazo:** seleção que costuma ir longe em Copas (estrutura, base de jogadores) vs. seleção que sempre cai cedo.
- **Padrões de estilo** que se repetem, não placares específicos.

Não use histórico como "lei". Cada Copa é um elenco novo.

### Fonte D — Contexto do momento

Aqui entram as informações que os números frios não pegaram ainda:

- **Lesões e suspensões** de peças-chave (um camisa 9 ou um goleiro de fora muda a conta).
- **Fase / momento** dos jogadores (alguém voltando de contusão, alguém em grande temporada no clube).
- **Mando e logística:** sede, fuso, viagem, altitude, clima. Em Copa não há "casa" clássica, mas o país-sede e a torcida pesam.
- **Motivação:** time já classificado pode poupar; time precisando do resultado se entrega mais.

> **Como juntar tudo, na prática:** comece pela probabilidade do mercado (Fonte B) — ela já é boa. Use Elo (A) para confirmar a ordem de grandeza. Ajuste *levemente* com contexto (D). Histórico (C) é só pano de fundo. Se você só fizer a conta da odd e descontar a margem, **já está 80% do caminho**.

---

## 2. Fase de grupos vs. mata-mata: por que a zebra muda de tamanho

Esse é o ponto que mais separa quem entende de quem chuta. **A probabilidade de uma zebra não é fixa — ela depende do formato do confronto.**

### Jogo único (mata-mata) = mais zebra

Num jogo só, o azar tem espaço de sobra: um pênalti polêmico, um gol no fim, uma expulsão, um goleiro inspirado, uma decisão nos pênaltis (que é praticamente um cara-ou-coroa). Quanto **menor a amostra**, mais o acaso manda.

> **Exemplo ilustrativo (números fictícios):**
> Suponha que o Time A seja "60% favorito" contra o Time B num jogo.
> - Em **um jogo só**, o Time B ganha em ~40% das vezes. Zebra acontece.
> - Se fossem **três jogos** e valesse "melhor de 3", a chance do A passar subiria para algo perto de **65-70%**, porque o azar de um jogo tende a se diluir nos outros.
> *Conclusão:* o mesmo favoritismo "vale menos" no mata-mata de jogo único.

### Fase de grupos = favorito respira

Na fase de grupos, em geral são **três jogos** e o que importa é a soma de pontos, não um resultado isolado. Tropeçar num jogo não elimina ninguém na hora. Isso faz o **time mais forte ter mais chance de avançar do que de vencer um jogo específico** — ele tem mais tentativas de mostrar que é melhor.

Por isso:
- **Para "quem se classifica do grupo":** confie mais no favorito. O formato protege quem é bom.
- **Para "quem ganha o jogo de quarta-feira":** desconfie mais. Jogo único é onde mora a zebra.

### "Quem é favorito" ≠ "por quanto"

Decore esta distinção, porque ela vai te salvar:

- **Favorito** é uma resposta de *sim/não*: quem é mais provável.
- **Por quanto** é a *margem*: 52% a 48% e 85% a 15% têm o **mesmo favorito**, mas são jogos completamente diferentes.

Quem só sabe "quem é o favorito" trata os dois jogos igual e perde. Quem sabe "por quanto" entende que no jogo de 52% vale apostar na zebra de vez em quando, e no de 85% não vale quase nunca. **Essa é a matéria-prima da estratégia da Parte 2.**

---

## 3. Os vieses que estragam o seu palpite

Você pode ter os melhores números do mundo e ainda assim sabotar tudo na hora de palpitar, porque o cérebro humano é uma máquina de torcer. Vamos aos quatro vilões mais comuns — e como se blindar de cada um.

### Viés 1 — Torcer pelo coração

O clássico. Você bota o seu time (ou o queridinho da sua infância) para ir mais longe do que a razão permite. É o erro que mais custa dinheiro e ranking em bolão.

**Como se blindar:**
- Faça o palpite **olhando só os números primeiro**, antes de lembrar de quem você torce.
- Pergunte-se: *"Se esse fosse um time que eu odeio, eu apostaria nele aqui?"* Se a resposta muda, é o coração falando.
- Se for inevitável palpitar com o coração no time que você ama, isole esse palpite e seja frio em todo o resto.

### Viés 2 — Recência (o último jogo pesa demais)

O time goleou na estreia e de repente todo mundo o trata como campeão. Ou levou de virada e foi "rebaixado" no imaginário geral. **Um jogo é uma amostra ridícula.** O desempenho recente informa um pouco, mas não apaga meses de evidência.

**Como se blindar:**
- Dê **mais peso ao acumulado** (ranking, campanha inteira) do que ao último resultado.
- Quando sentir vontade de revisar tudo por causa de um jogo, pergunte: *"isso é informação nova de verdade ou é só o placar mais fresco na minha cabeça?"*

### Viés 3 — Narrativa de mídia

A imprensa precisa de história: "a seleção da virada", "o azarão que vai surpreender", "a maldição do time tal". Narrativa vende, mas **não é probabilidade**. Muitas vezes a mídia já está com 3 jogos de atraso, embalando o que aconteceu como se previsse o futuro.

**Como se blindar:**
- Trate manchete como **entretenimento**, não como dado.
- Se uma narrativa está em toda parte, provavelmente o mercado (as odds) **já a precificou** — ou seja, não tem mais vantagem nenhuma ali. O que "todo mundo sabe" não te dá borda.

### Viés 4 — Ignorar o empate

Talvez o erro mais técnico e mais barato de corrigir. No futebol, o **empate é um resultado de verdade** e muitas vezes provável — em jogos truncados, pode passar de 30%. Quem só pensa "ganha A ou ganha B" está jogando fora quase um terço da realidade.

**Como se blindar:**
- Sempre considere os **três** resultados (1, X, 2) e suas probabilidades.
- Em jogos equilibrados, decisivos ou entre defesas fortes, **suba sua estimativa de empate** conscientemente.
- Em bolão de placar, lembre que **0x0 e 1x1 estão entre os placares mais comuns do futebol** — ignorá-los é deixar ponto na mesa.

> **Regra geral de blindagem:** escreva seu palpite e a **razão** dele antes do jogo. Depois confira se a razão era um número (bom) ou uma emoção/história (perigoso). Com o tempo, você aprende a reconhecer seus próprios vieses pelo padrão.

---

## 4. Ferramentas simples (e expectativas honestas)

Você não precisa de nada caro nem de programação. Ferramentas ajudam a **estimar melhor que o chute** — mas estimativa **não é certeza**. Qualquer um que te prometa "IA que ganha bolão" está vendendo ilusão. O que essas ferramentas entregam é uma probabilidade mais bem calibrada, com a incerteza assumida na cara.

### O kit básico

- **Sites de probabilidade / agregadores de odds:** comparam as odds de várias casas. Você pega a odd, aplica a conta da Seção 1 (Fonte B) e tem a probabilidade do mercado já "limpa". É a ferramenta com melhor custo-benefício de todas.
- **Ratings de Elo (ex.: World Football Elo Ratings):** força atualizada de cada seleção, de graça. Ótimo para confirmar favoritismo e estimar margem.
- **Modelos de probabilidade de torneio:** alguns sites simulam a Copa milhares de vezes e publicam "chance de cada seleção ser campeã / passar de fase". Use como **segunda opinião**, não como verdade.
- **Uma planilha sua (o pulo do gato):** uma aba simples onde você cola a odd de cada jogo, a fórmula `=1/odd` já calcula a probabilidade implícita, e outra coluna desconta a margem. Em 20 minutos você monta uma vez e usa a Copa inteira.

> **Exemplo ilustrativo de planilha (valores fictícios):**
> | Jogo | Odd A | Odd X | Odd B | Prob. A | Prob. X | Prob. B |
> |------|-------|-------|-------|---------|---------|---------|
> | A x B | 1.80 | 3.50 | 4.50 | 52,3% | 26,9% | 20,8% |
> | C x D | 2.40 | 3.20 | 3.00 | 41,1% | 30,8% | 28,1% |
>
> *(As colunas de probabilidade já estão com a margem da casa descontada, como na Seção 1.)*

### Como ler o que a ferramenta te dá (sem se enganar)

- **Probabilidade não é destino.** Se o modelo diz "Time A tem 70% de passar", isso significa que, num mundo com 10 Copas iguais, ele cairia em **3 delas**. Quando ele cair, o modelo **não estava errado** — 30% acontece.
- **Fontes que concordam dão confiança; fontes que discordam dão pistas.** Se Elo, odds e modelo apontam o mesmo favorito com margem parecida, ótimo. Se discordam muito, ali tem **incerteza real** — e, como veremos na Parte 2, é exatamente nesse tipo de jogo que mora a oportunidade ou o perigo.
- **Calibração > acerto pontual.** A meta não é "cravar o campeão". É que, no longo prazo, as coisas que você chamou de "70%" aconteçam perto de 70% das vezes. Isso é uma estimativa boa. Cravar um resultado isolado é, muitas vezes, só sorte.

---

## Fechando a Parte 1

Você agora tem o essencial para sair do achismo:

1. **Estimar a chance** combinando odds (convertidas e sem margem), Elo, histórico e contexto.
2. **Entender que zebra tem tamanho variável** — grande no jogo único, menor na fase de grupos — e que "quem é favorito" é menos importante que "por quanto".
3. **Reconhecer e neutralizar os vieses** que envenenam o palpite: coração, recência, narrativa e o empate esquecido.
4. **Usar ferramentas simples** com expectativa honesta: elas estimam melhor que o chute, mas trazem a incerteza junto — e isso é uma virtude, não um defeito.

Nada disso garante vitória. Futebol é, em boa parte, sorte — e num bolão você ainda depende de erros e acertos dos outros. O que esses fundamentos garantem é que, **na média e no longo prazo, você vai estar melhor posicionado que quem só chuta.** É com essa probabilidade na mão que a Parte 2 vai mostrar onde está o valor de verdade: não em acertar o favorito, mas em jogar contra as pessoas — e não contra a casa.
