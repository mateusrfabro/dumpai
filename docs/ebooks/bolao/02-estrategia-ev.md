# Parte 2 — Estratégia de EV e Jogo Contrarian

> **Aviso honesto antes de começar.** Nada aqui garante que você vai ganhar. Um torneio de seleções é um evento *único*: a Copa acontece uma vez, com sete partidas no mata-mata, e a sorte (variância) domina qualquer mês de jogo. O que esta parte faz é mais modesto e mais útil: ajudar você a **não desperdiçar valor**. Dado que você vai jogar de qualquer jeito, dá para escolher palpites que rendem *mais* quando dão certo. Isso é otimização de valor esperado relativo — não é uma máquina de imprimir dinheiro. Todos os números abaixo são **exemplos ilustrativos**, inventados para deixar o raciocínio concreto. Não são estatísticas reais de nenhuma Copa.

---

## 2.1 A pergunta certa: "como eu fico em primeiro?", não "quantos pontos eu faço?"

Aqui está a virada de chave que separa quem joga bolão por instinto de quem joga com estratégia.

Na maioria dos bolões de amigos e de empresa o prêmio é **winner-takes-all** (ou quase): o primeiro lugar leva o pote, ou leva a parte de leão dele. Quando é assim, a sua nota absoluta **não importa**. Fazer 180 pontos não vale nada se outra pessoa fez 181. O que importa é uma coisa só:

> **Você quer maximizar a probabilidade de terminar como campeão único do bolão — não a sua média esperada de pontos.**

Parecem a mesma coisa, mas não são. Maximizar pontos esperados te empurra para os palpites mais prováveis (o favorito, o resultado óbvio). Maximizar a chance de ser o número 1 às vezes te empurra para o lado oposto: para um palpite *menos* provável que a manada ignorou — porque, no raro mundo em que ele acontece, você fica sozinho no topo em vez de dividir o pódio com quinze pessoas.

Essa é a essência do **jogo contrarian**: num bolão você não joga contra a casa (não existe casa), você joga **contra as outras pessoas**. E o jeito de vencer pessoas não é só acertar — é acertar **aquilo que elas erraram**.

### Por que "winner-takes-all" muda tudo

Imagine dois prêmios diferentes para o mesmo bolão:

- **Prêmio A — proporcional:** cada participante recebe um valor proporcional à sua nota. Aqui faz sentido maximizar pontos. Jogue no favorito, jogue no provável, acumule acertos.
- **Prêmio B — winner-takes-all:** só o primeiro lugar leva. Aqui maximizar pontos é um erro sutil, porque empatar tecnicamente com a manada não te dá o prêmio — te dá uma divisão do prêmio, ou nada.

A imensa maioria dos bolões é do tipo B. Por isso a estratégia de bolão é diferente da estratégia de "tentar prever a Copa o mais certo possível". A previsão (Parte 1) é a matéria-prima; a estratégia é o que você faz com ela.

---

## 2.2 O trade-off central: probabilidade de acerto × diferenciação

Todo palpite tem dois eixos:

1. **Probabilidade de acerto** — qual a chance de ele se concretizar.
2. **Diferenciação (ou "popularidade invertida")** — quantas *outras* pessoas no bolão apostaram a mesma coisa. Quanto menos gente, mais diferenciado.

O favorito tem alta probabilidade e **baixíssima** diferenciação (todo mundo põe). O azarão improvável tem alta diferenciação e baixa probabilidade. O ponto ótimo quase nunca está num extremo — está num **azarão plausível** que combina probabilidade decente com pouca gente em cima.

Vamos colocar números. **Exemplo ilustrativo** (valores inventados):

> **Cenário:** bolão de 100 pessoas, R$ 50 por entrada → pote de **R$ 5.000**, winner-takes-all. A pergunta de desempate principal é "quem é o campeão da Copa".
>
> - **Seleção A (o favorito):** chance estimada de ser campeã = **30%**. **70 das 100 pessoas** apostaram nela.
> - **Seleção B (azarão plausível):** chance estimada = **12%**. Só **5 pessoas** apostaram nela.
>
> Suponha (simplificação) que, se você acerta o campeão e empata em tudo o mais, o pote é dividido igualmente entre quem acertou o campeão.

Valor esperado de apostar no **favorito A**:

> EV(A) = 30% de chance × (R$ 5.000 ÷ 70 pessoas que acertaram) = 0,30 × R$ 71,40 ≈ **R$ 21,40**

Valor esperado de apostar no **azarão B**:

> EV(B) = 12% de chance × (R$ 5.000 ÷ 5 pessoas que acertaram) = 0,12 × R$ 1.000 ≈ **R$ 120,00**

O azarão tem **menos da metade** da probabilidade de acertar — mas um valor esperado quase **6× maior**, porque no mundo em que ele acontece você divide o pote com pouquíssima gente. Esse é o coração do jogo contrarian.

### O contrapeso honesto

Não saia apostando em zebra por causa desse número. Repare em duas coisas:

- **A maior parte do tempo você perde.** Em 88% dos universos o azarão B não é campeão e você fica com nada. O EV é maior, mas a **chance de levar** é menor. Se o seu objetivo é "ter alguma chance real", concentrar tudo num palpite de 12% é desconfortável.
- **Os números de "quanta gente apostou" raramente são conhecidos** de antemão. Você está estimando a manada. Se você superestimar quão contrarian seu palpite é (ex.: "ninguém vai pegar essa zebra" e na verdade meio bolão pegou), o cálculo desaba.

A lição não é "aposte na zebra". É: **um palpite só vale o quanto rende descontada a multidão que apostou junto com você.** Acertar o que todo mundo acertou vale pouco.

---

## 2.3 O tamanho do bolão muda TUDO

Esta é provavelmente a regra prática mais importante do livro inteiro.

> **Bolão pequeno → jogue correto. Bolão grande → jogue diferente.**

A intuição: diferenciação só te paga quando há multidão para se diferenciar *de*. Num bolão de 6 pessoas não existe "manada" — existem 5 indivíduos. Você não ganha nada sendo exótico; ganha sendo mais certo que eles.

### Bolão pequeno (≈ 5–10 pessoas)

- Pouca gente significa pouca sobreposição de palpites. Você provavelmente já vai estar "sozinho" em vários resultados sem nem tentar.
- O favorito sendo campeão é o cenário mais provável, e dividir com 1–2 pessoas não destrói seu prêmio.
- **Estratégia:** maximize acertos. Vá no mais provável. Sua vantagem vem de prever melhor, não de adivinhar o que os outros vão fazer. Aposte no favorito sem culpa.

### Bolão grande (centenas ou milhares)

- Aqui o favorito é apostado por uma fração enorme dos participantes. Se ele for campeão, você divide o pote com **dezenas ou centenas** de pessoas — ou, mais provável, o desempate (placares, fases) decide tudo e você precisa ter se destacado em algum lugar.
- **Estratégia:** introduza diferenciação deliberada. Não em tudo — em alguns pontos-chave de alto valor (campeão, vice, uma semifinal surpresa). Você precisa de um cenário em que *você* brilha e a manada não.

> **Exemplo ilustrativo de escala:** num bolão de 8 pessoas, apostar no favorito campeão e dividir com mais 1 pessoa = metade de um pote pequeno, ainda ótimo. Num bolão de 2.000 pessoas, apostar no favorito e dividir com 600 = praticamente nada, mesmo acertando. O mesmo palpite "certo" tem valor radicalmente diferente conforme a escala.

### Regra de bolso

| Tamanho do bolão | Postura | Onde diferenciar |
|---|---|---|
| 5–10 | Correto / favorito | Quase nada — preveja bem |
| ~10–50 | Misto | 1–2 palpites contrarian de alto impacto |
| 100+ | Contrarian deliberado | Campeão/vice + alguma surpresa de mata-mata |

(Os limites são aproximados e ilustrativos — use o bom senso, não a tabela como lei.)

---

## 2.4 O formato de pontuação muda onde vale a pena arriscar

Nem todo bolão pontua igual, e o sistema de pontos decide **onde** o risco rende mais ponto por unidade de risco. Três formatos comuns:

**1. Acerto de vencedor (1 ponto por jogo que você acertou quem ganha).**
Pontuação rasa e previsível. Aqui é difícil se diferenciar nos jogos de fase de grupos (quase todo mundo acerta os óbvios), então a diferenciação migra para **os jogos de mata-mata** e para o **palpite de campeão**, que normalmente valem desempate. Arriscar num jogo de grupo equilibrado rende pouco; arriscar numa fase eliminatória rende muito.

**2. Placar exato (pontos extras por cravar o resultado, ex.: 3 pontos placar exato, 1 ponto só o vencedor).**
Aqui mora ouro contrarian. Placar exato é raro — quase ninguém crava — então **um único placar exato pode te catapultar** acima de toda a manada que só acertou o vencedor. O risco de "chutar 2×1 em vez de 1×0" é baixo (você ainda leva o ponto de vencedor se errar o placar mas acertar quem ganhou), e o upside é alto. **Em formato de placar exato, ousar no placar é barato e potente.**

> **Exemplo ilustrativo:** regra de "3 pts placar exato, 1 pt vencedor". Você e mais 40 pessoas acertam que a Seleção X ganha. As 40 puseram 1×0 (o placar "seguro"); você pôs 2×1. Se sair 2×1, você faz 3 e elas fazem 1 — você abre 2 pontos sobre 40 pessoas de uma vez. Se sair 1×0, você faz 1 igual a elas: não perdeu nada. Risco assimétrico a seu favor.

**3. Pontuação progressiva no mata-mata (jogos das fases finais valem mais).**
Quando a semifinal vale 8 e o jogo de grupo vale 2, o **peso da estratégia se concentra no fim**. Acertar muitos jogos de grupo é "ruído" — todos fazem isso. A briga é decidida em 3–4 partidas de alto valor lá no final. Implicação: **erre barato nos grupos, acerte (e ouse) caro no mata-mata.** Gastar energia tentando cravar placares de fase de grupos quando eles valem 2 pontos é mau uso do seu risco.

### Princípio geral dos formatos

> Procure onde a pontuação cria **assimetria**: situações em que ousar custa pouco quando dá errado e rende muito quando dá certo. Placar exato e jogos de mata-mata de alto peso são os lugares clássicos. Fuja de arriscar onde o erro é caro e o acerto é comum.

---

## 2.5 Múltiplas entradas: cobrir cenários sem trapacear

Alguns bolões permitem que a mesma pessoa compre **mais de uma cartela** (cada entrada paga sua taxa). Quando é permitido e você topa o custo, múltiplas entradas são uma ferramenta poderosa — porque deixam você **cobrir cenários diferentes** em vez de apostar tudo num só futuro.

### A lógica

Com uma entrada só, você é obrigado a escolher *um* campeão, *um* conjunto de placares. Com três entradas, você pode montar três "apostas-mãe" distintas:

> **Exemplo ilustrativo — 3 entradas num bolão grande:**
> - **Entrada 1:** favorito campeão (cobre o cenário mais provável — você não quer ficar de fora se o óbvio acontecer).
> - **Entrada 2:** segundo favorito campeão, com placares um pouco mais ousados.
> - **Entrada 3:** azarão plausível campeão + surpresa numa semifinal (o bilhete contrarian, alto upside).
>
> Você não dilui — você **paga três vezes** para ter três tiros descorrelacionados. Se a Copa for "normal", a Entrada 1 te segura. Se der zebra, a Entrada 3 pode te fazer campeão sozinho.

A chave é que as entradas sejam **diferentes entre si**. Comprar três cartelas quase idênticas é jogar dinheiro fora — você só multiplicou a taxa sem cobrir cenário novo. O valor está na **descorrelação**: cada entrada deve brilhar num futuro em que as outras falham.

### Limites práticos e o "ponto de saturação"

Mais entradas não é sempre melhor. Cada cartela custa a taxa cheia, e os cenários *plausíveis* são finitos. Lá pela quarta ou quinta entrada você começa a apostar em futuros tão improváveis que o custo não compensa. Pague por diversificação real, não por preencher cartelas.

### Ética e regras — leia antes de comprar a segunda cartela

Múltiplas entradas são legítimas **se o bolão permite explicitamente**. Mas há linhas que não se cruzam:

- **Transparência:** se você é participante, jogue dentro da regra publicada. Se a regra é "uma por pessoa", comprar cartelas em nome de parentes para burlar o limite é trapaça, não estratégia.
- **Organizador não joga com vantagem:** se você **organiza** o bolão e também participa, qualquer entrada múltipla sua precisa ser pública e dentro das mesmas regras de todos. Acesso a informação (saber o que os outros apostaram antes de fechar a sua) é vantagem indevida — veremos isso na Parte 3.
- **Combine o teto antes:** um bom organizador define no regulamento se múltiplas entradas são permitidas e quantas no máximo, **antes** de o bolão abrir. Mudar isso depois gera briga.

Estratégia honesta opera dentro das regras combinadas. O objetivo é jogar melhor que as pessoas, não passar por cima delas.

---

## 2.6 O fechamento honesto: variância ainda manda

Você chegou até aqui aprendendo a extrair valor esperado relativo dos seus palpites. Vale repetir, sem rodeios, o que isso **não** é:

- **Não é previsão garantida.** Aumentar o EV de um bilhete contrarian não o torna provável — torna-o mais *valioso quando acontece*. Na maioria das vezes ele não acontece.
- **Não anula a sorte.** Uma Copa tem ~7 jogos de mata-mata. Pênaltis, um gol no fim, um árbitro, uma lesão — qualquer um desses vira o torneio. Sete partidas é uma amostra pequena demais para a habilidade dominar a sorte. Num único torneio, a **variância manda**.
- **É uma vantagem de longo prazo aplicada a um evento curto.** As ideias daqui te dariam lucro consistente se você jogasse mil Copas. Você vai jogar uma. Então pense nelas como "parar de desperdiçar valor", não como "garantir o prêmio".

O que a estratégia faz, de forma realista: ela melhora a sua **distribuição de resultados**. Você troca um monte de finais medianos (acertou o óbvio, dividiu o pote, levou trocados) por uma cauda mais gorda de **vitórias solitárias** — ao custo de mais vezes terminar com nada. Para um bolão winner-takes-all, essa é a troca certa: você não quer ficar em quinto, você quer ter chance real de ficar em primeiro.

### Resumo da Parte 2

- Em **winner-takes-all**, maximize a chance de ser **campeão único**, não a sua média de pontos.
- Todo palpite se mede por **probabilidade × diferenciação**. Acertar o que a manada acertou vale pouco.
- **Bolão pequeno → jogue correto.** **Bolão grande → jogue diferente.**
- O **formato de pontuação** decide onde arriscar: placar exato e mata-mata de alto peso oferecem risco assimétrico a seu favor.
- **Múltiplas entradas** (quando permitidas) cobrem cenários descorrelacionados — diversifique de verdade, e jogue dentro das regras.
- E nunca esqueça: **a sorte ainda domina um torneio único.** Você está otimizando valor, não comprando certeza.

Na **Parte 3** saímos da teoria do palpite e entramos na prática: como montar, precificar, divulgar e operar um bolão — incluindo o regulamento, o desempate e os cuidados de organizador que a ética desta parte exige.
