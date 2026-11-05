# Parte 1 — RTP, Volatilidade & Seleção de Jogos

> **Antes de tudo:** nada nesta parte ensina a ganhar. Cassino é matematicamente
> desenhado para que a casa lucre no longo prazo. O que você vai aprender aqui é a
> **perder mais devagar** e a **esticar o tempo de diversão** com o mesmo dinheiro.
> Escolher um jogo melhor reduz a sua perda esperada — não cria lucro. Toda aposta
> que veremos tem **valor esperado negativo**: você ainda tende a perder, só perde
> menos. Conteúdo para maiores de 18 anos.

---

## 1. RTP na prática: o que esses 96% realmente significam

**RTP** quer dizer *Return to Player* — "retorno ao jogador". É a fração de todo o
dinheiro apostado num jogo que, no longuíssimo prazo (milhões de rodadas, somando
todos os jogadores), volta em forma de prêmios. O resto fica com a casa.

A conta que importa é o complemento do RTP, chamado **margem da casa** (*house edge*):

```
Margem da casa = 100% − RTP
```

- Slot com **RTP 96%** → margem da casa de **4%**.
- Slot com **RTP 92%** → margem da casa de **8%**.

Parece pouca diferença. Não é. A margem incide sobre **tudo que passa pela aposta**,
e num cassino você não aposta seu dinheiro uma vez só — você o **recicla** rodada
após rodada.

### O conceito-chave: você não perde sobre o depósito, você perde sobre o "volume apostado"

A margem morde cada vez que você aposta. Se você deposita R$ 200 e fica girando,
esses R$ 200 podem virar R$ 2.000 de **volume total apostado** (*turnover*) ao longo
da sessão, porque ganhos parciais voltam a ser apostados. A perda esperada é calculada
sobre esse volume, não sobre o depósito.

> **Exemplo numérico ILUSTRATIVO — perda esperada por volume apostado**
> Suponha R$ 1.000 de volume total apostado numa sessão (somando todas as rodadas):
> - RTP 96% (margem 4%) → perda esperada ≈ **R$ 40**
> - RTP 92% (margem 8%) → perda esperada ≈ **R$ 80**
>
> Mesmo volume, **o dobro de perda** só por causa de 4 pontos de RTP. *Números
> ilustrativos para mostrar a mecânica; o resultado real de uma sessão curta varia
> muito por causa da sorte.*

### Perda esperada por hora: o número que ninguém te mostra

Para sentir o impacto no tempo, juntamos três coisas: **aposta média por rodada**,
**rodadas por hora** e **margem da casa**.

```
Perda esperada por hora = aposta por rodada × rodadas por hora × margem da casa
```

> **Exemplo numérico ILUSTRATIVO — duas slots, mesmo jogador**
> Jogador apostando **R$ 1,00 por rodada**, ritmo de **500 rodadas por hora**
> (ritmo realista numa slot online no automático). Volume apostado por hora = R$ 500.
> - Slot A, RTP 96% (margem 4%) → perde em média **R$ 20/hora**
> - Slot B, RTP 92% (margem 8%) → perde em média **R$ 40/hora**
>
> Em 3 horas de jogo, a diferença esperada é de R$ 60 para R$ 120. *Ilustrativo.*

Repare em duas alavancas além do RTP:
- **Aposta por rodada:** dobrou a aposta, dobrou a perda esperada por hora.
- **Rodadas por hora:** quanto mais rápido você gira (turbo, autoplay), mais volume,
  mais perda esperada no mesmo relógio. **Diminuir o ritmo é diminuir a sangria.**

### Onde achar o RTP do jogo

Não chute. O RTP costuma estar:
- No **menu de informações / regras** dentro do próprio jogo (ícone "i", "?", "ⁱ",
  "Paytable" ou "Regras"). Em slots quase sempre há uma linha "RTP: 96,xx%".
- No **site do provedor** (Pragmatic, NetEnt, Play'n GO etc.) — busque pelo nome do
  jogo + "RTP".
- **Atenção:** alguns jogos têm **RTP configurável**, e o cassino pode rodar uma
  versão de RTP **mais baixo** que o padrão. Vale conferir o número no jogo que está
  no ar, não só o do provedor.
- Desconfie de jogo que **esconde** o RTP. Falta de transparência é, por si só, um
  sinal para escolher outro.

---

## 2. Volatilidade (variância): a "personalidade" do risco

RTP diz **quanto** o jogo devolve no longo prazo. **Volatilidade** diz **como** essa
devolução chega: em muitos prêmios pequenos e frequentes, ou em raros prêmios grandes
com longos períodos secos no meio.

Dois jogos podem ter **o mesmo RTP de 96%** e experiências opostas:

| Característica | Baixa volatilidade | Alta volatilidade |
|---|---|---|
| Frequência de ganho | Alta (ganha pouco, mas toda hora) | Baixa (seca longa, ganho raro) |
| Tamanho do ganho | Pequeno | Grande quando vem |
| Oscilação da banca | Suave | Violenta |
| Risco de quebrar rápido | Menor | Maior |
| Sensação | "Empata-empata", devagar | Montanha-russa |

### O que a volatilidade muda de verdade

A volatilidade **não muda a sua perda esperada** (essa é função do RTP e do volume).
Ela muda **o caminho** até lá e, principalmente, **a chance de você quebrar a banca
rápido**.

> **Exemplo numérico ILUSTRATIVO — mesma banca, mesma aposta, volatilidades opostas**
> Banca de R$ 100, aposta de R$ 1/rodada, ambas com RTP 96%.
> - **Baixa volatilidade:** ganhos pequenos e frequentes amortecem a queda; é comum
>   durar **muitas rodadas** antes de zerar — sessão mais longa e "morna".
> - **Alta volatilidade:** sequências secas podem **derreter os R$ 100 em poucas
>   dezenas de rodadas** se o grande prêmio não aparecer — mas, quando aparece, dá um
>   pico forte.
>
> *Ilustrativo: a alta volatilidade aumenta tanto a chance de quebrar cedo quanto a
> de um pico raro; na média de longo prazo, ambas perdem para a casa.*

### Como escolher a volatilidade conscientemente

- **Quer durar mais com banca pequena e jogar como entretenimento?** Prefira
  **baixa/média volatilidade** e apostas pequenas: estica o tempo de tela.
- **Topa quebrar rápido em troca da chance rara de um pico?** Alta volatilidade — mas
  entre sabendo que o cenário **mais provável** é a banca evaporar antes do prêmio.
- A volatilidade costuma estar descrita na ficha do jogo (às vezes como "variância"
  ou num medidor de 1 a 5).

> **Armadilha mental:** alta volatilidade alimenta a ilusão de "estou perto do grande
> prêmio". Você não está "devendo" um prêmio — cada rodada é **independente**. A
> máquina não tem memória.

---

## 3. Comparando jogos pela margem da casa

Aqui está a parte que mais reduz a sua perda esperada: **trocar jogos de margem alta
por jogos de margem baixa.** As faixas abaixo são **típicas de mercado** e servem de
ordem de grandeza — variam por provedor e por regra específica da mesa.

### Por que slots variam tanto

Slots não têm uma margem única. O RTP é **programado** pelo provedor e pode ir de uns
**~94% a ~98%** (margem de ~2% a ~6%), e há slots piores que isso. Some a alta
volatilidade e o ritmo veloz (centenas de rodadas/hora) e a slot vira a forma **mais
rápida** de reciclar volume — ou seja, de entregar margem para a casa, mesmo quando o
RTP nominal não é terrível.

### Por que certos jogos de mesa têm margem MENOR

Jogos de mesa com regras boas costumam ter margem **bem abaixo** da slot média:

> **Faixas ILUSTRATIVAS de margem da casa (ordem de grandeza típica)**
>
> | Jogo / aposta | Margem da casa aproximada |
> |---|---|
> | **Blackjack** com boas regras + jogo "correto" | **~0,5%** |
> | **Baccarat** — aposta no **Banker** | **~1,06%** |
> | **Baccarat** — aposta no **Player** | ~1,24% |
> | **Roleta europeia** (1 zero) | **~2,70%** |
> | **Roleta americana** (2 zeros) | **~5,26%** |
> | **Slots** (faixa ampla) | **~2% a 10%+** |
> | **Baccarat** — aposta no **Tie/Empate** | **~14% (péssima)** |
>
> *Faixas ilustrativas e arredondadas; o valor real depende das regras exatas da mesa
> e do provedor. Todas, sem exceção, são margens NEGATIVAS para o jogador.*

- **Blackjack:** com boas regras (dealer para no soft 17, blackjack paga 3:2, permite
  dobrar/dividir) e decisões corretas, a margem pode ficar **perto de 0,5%** — das
  menores do cassino. Cuidado: **regras ruins** (blackjack pagando 6:5, por exemplo)
  inflam essa margem rápido. A regra da mesa importa tanto quanto o jogo.
- **Baccarat no Banker:** uma das apostas mais "limpas" do cassino, ~1% mesmo já
  descontando a comissão sobre o ganho do Banker. **Banker > Player > (nunca) Tie.**
- **Roleta:** veja o item abaixo.

### Por que roleta europeia (1 zero) < americana (2 zeros)

Numa roleta, os prêmios são pagos como se **não houvesse zero**. Os zeros são
exatamente a fatia da casa.

- **Europeia:** 37 casas (0–36). Um único zero → margem ≈ **1/37 ≈ 2,70%**.
- **Americana:** 38 casas (0, 00, 1–36). Dois zeros → margem ≈ **2/38 ≈ 5,26%**.

Mesmo jogo, mesma sensação, **quase o dobro de margem** só pela casa extra do "00".

> **Exemplo numérico ILUSTRATIVO — R$ 500 de volume na roleta**
> Apostando R$ 500 no total:
> - Europeia (2,70%) → perda esperada ≈ **R$ 13,50**
> - Americana (5,26%) → perda esperada ≈ **R$ 26,30**
>
> *Ilustrativo.* A lição: **se houver roleta europeia disponível, não há motivo
> racional para jogar a americana.** (Existe a variante "La Partage/En Prison", que
> reduz ainda mais a margem nas apostas de chance simples — quando disponível, é
> melhor ainda.)

---

## 4. Apostas a evitar e o conceito de "tempo de jogo por real"

### As piores apostas (margem alta — fuja)

Estas costumam ter margem **muito acima** da média e queimam banca depressa:

- **Tie/Empate no baccarat** (~14%) — sedutora pelo pagamento alto, terrível na conta.
- **Roleta americana** sempre que existir a europeia ao lado.
- **Apostas "exóticas"/proposições** de tabela (combinações chamativas, "side bets" de
  blackjack/baccarat, alguns specials) — quase sempre embutem margem gorda.
- **Slots com RTP baixo e não divulgado**, ou versões de RTP reduzido do mesmo jogo.
- **Jackpots progressivos** apostando o mínimo: parte do seu dinheiro alimenta um
  prêmio com chance ínfima; a margem efetiva tende a ser pior.
- Qualquer aposta com **pagamento "grande demais"** e baixa frequência divulgada como
  isca — o pagamento alto costuma compensar a casa, não você.

### "Tempo de jogo por real": o jeito honesto de medir valor

Como você **não pode** mirar lucro, a métrica certa de "custo-benefício" no cassino é:
**quanto tempo de entretenimento cada real comprou.** Quanto menor a margem e o ritmo,
mais tempo o mesmo dinheiro dura.

> **Exemplo numérico ILUSTRATIVO — R$ 100 de orçamento, "custo da diversão por hora"**
> Comparando o custo esperado de uma hora de jogo (≈ perda esperada/hora):
> - **Slot RTP 92%**, R$ 1/rodada, 500 rodadas/h → ~**R$ 40/hora**
> - **Slot RTP 96%**, R$ 1/rodada, 500 rodadas/h → ~**R$ 20/hora**
> - **Roleta europeia**, R$ 5/giro, 40 giros/h (ritmo mais lento) → 200 de volume ×
>   2,70% ≈ ~**R$ 5,40/hora**
> - **Blackjack boas regras**, ritmo calmo, margem ~0,5% → custo esperado por hora
>   **bem menor** que o das slots para um volume parecido.
>
> *Ilustrativo.* Com R$ 100 e um custo esperado de ~R$ 20/hora, você compra ~5 horas
> de diversão esperada; a ~R$ 40/hora, ~2,5 horas. **Menor margem + ritmo mais lento =
> mais tempo de tela pelo mesmo dinheiro.**

### O que reduz a perda esperada, na prática

1. **Escolha jogos de menor margem** (blackjack com boas regras, baccarat Banker,
   roleta europeia) em vez de slots de RTP baixo e apostas exóticas.
2. **Confira o RTP antes** e prefira o mais alto disponível; troque de jogo se o número
   for ruim ou estiver escondido.
3. **Diminua o ritmo:** desligue turbo/autoplay, faça pausas. Menos rodadas/hora =
   menos volume = menos perda.
4. **Aposte menos por rodada** para esticar o tempo de tela com a mesma banca.
5. **Fuja das iscas de pagamento alto** (Tie, side bets, 00) — pagam pouco em
   probabilidade e cobram caro em margem.

---

## Resumo da Parte 1

- **RTP alto = margem baixa.** 96% (margem 4%) faz você perder **metade** do que 92%
  (margem 8%) sobre o mesmo volume apostado.
- A perda morde o **volume total apostado**, não o depósito — e o ritmo (rodadas/hora)
  multiplica isso.
- **Volatilidade** não muda quanto você perde no longo prazo, mas muda **quão rápido**
  você pode quebrar a banca. Baixa volatilidade + aposta pequena = sessão mais longa.
- **Margem por jogo (ordem de grandeza):** blackjack boas regras (~0,5%) < baccarat
  Banker (~1%) < roleta europeia (~2,7%) < roleta americana (~5,3%) < slots ruins e
  apostas exóticas (alto). Roleta europeia ganha da americana por ter **um zero a
  menos**.
- **Tempo de jogo por real** é a única métrica honesta de valor: menor margem e ritmo
  mais lento esticam a diversão.

> **Lembrete inviolável:** tudo isso ainda é **margem negativa**. Você **tende a
> perder** — só perde menos e mais devagar. Não existe seleção de jogo que transforme
> o cassino em fonte de renda. Trate o gasto como o preço de um entretenimento, nunca
> como investimento. Na **Parte 2** vamos ver como bônus e cashback funcionam de
> verdade (e onde o "rollover" esconde a pegadinha), e na **Parte 3**, como montar uma
> banca e definir limites para saber a hora de parar.
