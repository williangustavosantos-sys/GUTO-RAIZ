# GUTO — Arquitetura de Decisão (o Cérebro Soberano)

> **O documento mais importante do projeto.** Explica como o cérebro do GUTO **deveria pensar**, por que o estado atual gera regressões infinitas, e como sair disso. Sem código — só arquitetura. Pré-requisito: `GUTO_AI_ONBOARDING.md`, `README.md`.

---

## 1. O diagnóstico que originou este documento

O GUTO entrou num ciclo de regressão aparentemente infinito: a IA implementa, os testes passam, ela diz que resolveu, o usuário abre o app, conversa dois minutos e tudo quebra — em outro lugar.

A causa **não** é falta de trabalho, nem excesso de features, nem conceito ruim. A causa é arquitetural e tem nome:

> **O GUTO foi construído como um "parlamento de pequenos cérebros" em vez de um cérebro soberano.**

A cada bug, alguém adicionou mais um *gate* determinístico (regex / `if` / classificador) para tapar aquele caso específico. Hoje, vários módulos decidem o turno em paralelo e **brigam entre si**, e cada um roda **na frente do modelo**, por cima do entendimento de contexto. Isso é exatamente o que os documentos de produto proíbem ("o GUTO não é uma árvore de se-X-então-Y").

## 2. Por que o parlamento de cérebros gera regressão infinita (o mecanismo)

```txt
Bug aparece
 → IA adiciona/move um gate determinístico para tapar o caso
 → o gate redefine implicitamente o comportamento de caminhos não testados
 → teste daquele caso fica verde (e é mockado — nem vê o modelo)
 → próximo uso real cai num caminho onde dois gates discordam,
   ou onde o gate errado agarra o turno
 → nasce o "bug novo"
 → repete
```

Consequências diretas, todas observadas:

- **Testes verdes, app quebrado:** os testes exercitam os gates (determinísticos), com o **modelo mockado**. A "alma" do GUTO — a interpretação do modelo em linguagem livre — nunca é testada. O verde mede a parte que não falha.
- **Cada correção desestabiliza outra coisa:** mais gates = mais colisões = mais superfície imprevista.
- **O produto vira software comum:** quando um gate de palavra-chave decide o turno, o usuário sente o robô. A régua "alguém pensa por mim" falha.

> **Sobre os exemplos deste documento:** quando aparecer "viagem", entenda como **uma instância** da classe *Evento Temporário da Vida do Usuário* (ver `GUTO_SYSTEM_ARCHITECTURE.md` §6). Viagem foi só o **primeiro caso** onde a falha apareceu; **não é o foco** e o cérebro nunca deve ser desenhado em torno dela.

**Sintoma típico:** um evento temporário é compartilhado ("viajo na quarta", "tenho cirurgia sexta", "plantão no sábado") → um gate de cobrança agarra o turno → cobra treino. Remove-se o gate → modelo responde solto → "então é descanso". Adiciona-se um gate de continuidade → colide com o próximo caso. Três correções, mesmo problema, nenhuma estável. **Isto é a assinatura de um sistema sem centro.**

## 3. O princípio: Um Cérebro Soberano + mãos burras

> Existe **um** lugar, e só um, onde "o que o GUTO faz neste turno" é decidido.

Todo o resto se reorganiza em quatro papéis, e **apenas o cérebro decide**:

```txt
              ┌─────────────────────────────┐
  FORNECEDORES│  contexto (memória, proativi-│
  DE CONTEXTO │  dade, catálogo, histórico,  │──┐
  (informam)  │  país/idioma, clima)         │  │ injetam contexto
              └─────────────────────────────┘  │
                                                ▼
  SEGURANÇA  ┌──────────────┐         ┌────────────────────┐
  (veta)     │ risk-class.  │────────▶│  CÉREBRO SOBERANO  │
             │ (falha-aberta)│  veto   │  decide 1 contrato │
             └──────────────┘         └─────────┬──────────┘
                                                 │ 1 contrato de turno
                                                 ▼
              ┌─────────────────────────────────────────────┐
  EXECUTORES  │ treino, dieta, missão, online, XP, arena,   │
  (mãos)      │ avatar, percurso, UI — apenas EXECUTAM      │
              └─────────────────────────────────────────────┘
```

Isto é **mais fiel à visão**, não menos: o README já diz "se qualquer parte decide sozinha, o produto quebra". Hoje as partes decidem sozinhas. Consolidar num cérebro é **cumprir a spec** — e **não remove nenhum módulo do organismo**. A identidade (Arena, Avatar, XP, Percurso, Coach, GUTO Online, Dieta, Proatividade, B2B, três idiomas) permanece inteira; o que muda é **quem decide**.

E é **mais fácil de manter sozinho**: o raio de explosão de cada mudança colapsa de "o organismo inteiro" para "um cérebro com um contrato".

## 4. Os quatro papéis (definição rigorosa)

### a) O Cérebro Soberano — **decide**
- Recebe: `{ mensagem, GutoMemory, fase do fluxo, contexto da aba, memória proativa, opções já oferecidas no turno, idioma, país }`.
- Produz: **um** contrato de turno (`fala`, `acao`, `expectedResponse`, `avatarEmotion`, `memoryPatch`, `workoutPlan`, `next_step`).
- É **uma porta de entrada e uma porta de saída**. Nada mais decide comportamento.
- Interpreta intenção + contexto + memória + certeza. Se não tem certeza, **pergunta** (curto). Se tem caminho seguro, **decide** (não terceiriza com "qual prefere?").
- Raciocina sobre **classes/conceitos**, não sobre instâncias (ver §6).
- Emite a fala **já no idioma do usuário**.

### b) Fornecedores de Contexto — **informam, nunca decidem**
- Memória/calibragem, proatividade, catálogos, histórico, clima/feriado, país/idioma.
- Eles **montam contexto** que entra no prompt/estado do cérebro. Eles **não** escolhem a resposta, não cobram, não adaptam por conta própria.
- A proatividade **propõe** continuidade como contexto ("posso adaptar pra hotel/quarto/missão curta") — mas a decisão final é do cérebro.

### c) Segurança — **veta, por exceção, falha-aberta**
- O `risk-classifier` é o **único** módulo com poder de interromper a persona — e só para risco real (autolesão, transtorno alimentar, cardio/neuro agudo, trauma).
- Falha-aberta: qualquer erro/incerteza → não veta → comportamento normal.
- É **piso de segurança**, não motor. Nunca decide o conteúdo normal do turno.

### d) Executores / Mãos — **fazem, nunca decidem**
- Treino, dieta, missão, GUTO Online, validação, XP, arena, avatar, percurso, UI.
- Recebem o contrato e **materializam**: persistem, renderizam, propagam estado. Respeitam trilhos (catálogo/vídeo) e `lockedByCoach`.
- Se um executor precisa "decidir" algo, é sinal de cérebro vazando para a mão — **pare e mova a decisão para o cérebro.**

## 5. Como distinguir os papéis na prática (teste de cheiro)

Pergunte de cada pedaço de código:

| Pergunta | Se sim, é… |
|---|---|
| "Isto escolhe **o que** o GUTO responde/faz?" | Cérebro — deve ser **o único** |
| "Isto só monta dados para o cérebro ler?" | Fornecedor de contexto |
| "Isto só impede dano em risco real?" | Segurança (veto, falha-aberta) |
| "Isto só aplica/mostra/persiste uma decisão já tomada?" | Executor |

Se **dois pedaços diferentes** respondem "sim" à primeira pergunta para o mesmo turno, você encontrou um parlamento. **Consolidar é a tarefa.**

## 6. Generalize o conceito, nunca o caso (anti-especialização)

Existe uma forma disfarçada do parlamento de cérebros: **especializar o cérebro por instância.** Criar um "fluxo de viagem", depois um "fluxo de cirurgia", depois um "fluxo de casamento" é o **mesmo erro** de criar um gate por palavra-chave — só que maior.

> O cérebro raciocina sobre **classes**: *Evento Temporário da Vida do Usuário*, *limitação física*, *restrição alimentar*, *janela de tempo*, *indisponibilidade*. Viagem, aniversário, plantão, prova, cirurgia, casamento são **instâncias** da mesma classe, tratadas pelo **mesmo** raciocínio e pelo **mesmo** ciclo (`detecção → entendimento → confirmação → enriquecimento → uso → validação → descarte`).

Sinal de alerta: se o código (ou o prompt) tem ramos nomeados por exemplo (`travelDetected`, `isWedding`, `surgeryBranch`…) decidindo comportamento, isso é especialização por caso — **regressão arquitetural**. O certo é um único raciocínio de evento que recebe o tipo como **dado de contexto**, não como **ramo de decisão**.

## 7. Os trilhos fechados (criatividade controlada, não regra burra)

Um cérebro soberano **não** significa um modelo solto. Significa **um** decisor operando dentro de trilhos:

- **Catálogo de exercícios** com vídeo validado: a IA cria/adapta treino livremente, mas só com exercícios aprovados.
- **Restrições alimentares (`NÃO COMO`), país, idioma:** trilhos da dieta.
- **Contrato de turno validado:** turno malformado → fallback honesto.
- **`lockedByCoach`:** o plano do coach é soberano; o cérebro cria sinal de revisão, não sobrescreve.

A diferença entre trilho e gate-cérebro: **o trilho restringe o espaço de ações seguras; o gate-cérebro escolhe a ação.** Trilho é bom. Gate (ou ramo por caso) escolhendo a resposta é o parlamento.

## 8. Como eliminar o parlamento (estratégia, sem código)

1. **Crie um único ponto de decisão** ("decide-turn"): uma entrada, uma saída (o contrato já existe).
2. **Reclassifique cada gate atual** em um dos quatro papéis. A maioria vira **fornecedor de contexto** (entra no prompt) ou **executor** (aplica o contrato). Pouquíssimos são segurança. **Nenhum** continua decidindo o turno.
3. **Colapse ramos por caso em raciocínio por classe** (ver §6): `travelDetected` e similares deixam de ser ramos de decisão e viram, no máximo, um campo de contexto "tipo de evento".
4. **Migre um fluxo por vez**, sempre com uma transcrição dourada (modelo real) cobrindo o **comportamento** antes de mexer.
5. **Invariante de produto:** todo turno volta com `next_step` não-vazio; se o cérebro não produzir, o sistema preenche um seguro.
6. **Separe canal de controle do canal de fala** para sempre (marcador interno nunca vira texto do usuário).
7. **Proibição permanente:** corrigir bug adicionando gate que decide, ou ramo especializado por caso. A correção certa é levar a decisão ao cérebro e dar a ele o contexto que faltava.

## 9. O que NÃO fazer (resumo afiado)

- ❌ Adicionar `if/regex/classificador` que escolhe a resposta.
- ❌ Especializar o cérebro/fluxo por instância (um "motor de viagem"). Raciocine sobre a classe.
- ❌ Deixar `decision-engine`, `injector`, "escada de cobrança" ou classificadores decidirem em paralelo ao modelo.
- ❌ Múltiplas fontes de verdade do estado.
- ❌ Tratar idioma como tradução pós-decisão.
- ❌ Reduzir o produto/identidade para "simplificar". Simplifique a arquitetura de decisão, não o organismo.
- ❌ Big-bang rewrite do backend (suicídio técnico — ver `GUTO_ENGINEERING_GUIDE.md`).
- ✅ Um cérebro, um contrato, contexto rico, raciocínio por classe, mãos burras, trilhos fechados, segurança por exceção.

## 10. A pergunta de validação

Para qualquer decisão de arquitetura de decisão, volte à régua:

> "Esta mudança faz o turno ser decidido em **um** lugar que enxerga o organismo inteiro e raciocina por **conceito** — e isso faz o usuário sentir que alguém pensa por ele?"

Se a decisão se fragmenta em mais lugares, ou se especializa por caso, é regressão arquitetural, mesmo que o código esteja correto e os testes verdes.
