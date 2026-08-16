# GUTO — Arquitetura do Sistema (o Organismo)

> Visão de **alto nível** de como todas as partes do GUTO se conectam. Não contém detalhes de implementação — para isso, ver os `*_DETALHADA` de cada área. Pré-requisito: `GUTO_AI_ONBOARDING.md` (incl. o **Vocabulário canônico**) e `README.md`.

---

## 1. O princípio: o GUTO é um organismo, não uma soma de módulos

Não existem funcionalidades independentes. Tudo influencia o resto. O valor do produto — a sensação de "alguém pensando por mim" — **emerge do ciclo fechado**, não de nenhuma parte isolada.

```txt
Calibragem → Memória → Chat → Treino → Missão → GUTO Online
   → Validação → XP → Arena → Avatar → Percurso → Coach
   → Proatividade → Memória (de novo)
```

**Regra de ouro do organismo:** se qualquer parte decide sozinha ou deixa de atualizar outra parte, o usuário deixa de sentir continuidade e o produto inteiro quebra. Por isso Arena, Avatar, Coach, Percurso, Dieta, Treino e Proatividade **não são opcionais** — eles existem para formar **um único comportamento** e fazem parte da **identidade**, não de uma lista de extras.

## 2. As três camadas físicas

```txt
  CORPOGUTO (frontend / o corpo)
        │  HTTPS
        ▼
  CEREBROGUTO (backend / o cérebro)
        │
        ▼
  MEMÓRIA + estado persistente (fonte única de verdade)
```

- **CORPOGUTO (o corpo):** renderiza, captura entrada, mostra avatar/abas/cards, executa a UI. **Não decide comportamento do GUTO.** Faz rollback otimista quando a persistência falha (para nunca mentir que salvou).
- **CEREBROGUTO (o cérebro):** interpreta a mensagem, carrega a memória, decide o turno, gera treino/dieta dentro dos trilhos, aplica segurança, persiste, controla XP/proatividade.
- **Memória/estado:** a **fonte única de verdade**. Precisa ser durável (sobreviver a redeploy) e consultada por todas as áreas. Se chat, missão e dieta lerem verdades diferentes, é bug crítico.

## 3. O fluxo de um turno (o caminho do dado)

```txt
Usuário escreve / toca botão rápido
→ Frontend: POST /guto/chat  (mensagem + contexto da aba)
→ Backend carrega GutoMemory (fonte de verdade)
→ Piso de segurança: classificador de risco (1 chamada; falha-aberta; preempt, não motor)
→ CÉREBRO SOBERANO: 1 decisão, dentro do CONTRATO DE TURNO + trilhos fechados
→ Ação estruturada validada (treino, memória, proatividade, dieta...)
→ Persistência real (quando aplicável)
→ Contrato de turno volta ao app
→ UI executa: fala, emoção do avatar, botões, cards — já no idioma do usuário
```

A resposta do GUTO **nunca é só texto**. É um **contrato estruturado**. Isso impede que o app vire "um chat bonito que não salva nada".

## 4. O Contrato de Turno (a interface entre cérebro e corpo)

O cérebro devolve **um** objeto estruturado. **O schema exato é propriedade do código** (`CEREBROGUTO/src/guto-turn-contract.ts`) **e de** `GUTO_CHAT_E_CEREBRO_DETALHADA.md`; a tabela abaixo descreve o **papel** de cada campo, não substitui o schema. Campos canônicos:

| Campo | O que é | Quem executa |
|---|---|---|
| `fala` / `speech` | O que o GUTO diz, **já no idioma do usuário** | UI (bolha + voz) |
| `acao` / `action` | Ação estruturada (ex.: `updateWorkout`, gerar dieta, abrir proatividade) | módulo executor |
| `expectedResponse` | Botões rápidos sugeridos | UI |
| `avatarEmotion` | Emoção do avatar no turno | UI (avatar) |
| `memoryPatch` | Adições/correções à memória (campos permitidos, conservador) | memória |
| `workoutPlan` | Plano quando o turno gera/edita treino | aba Missão / `lastWorkoutPlan` |

> **"Próximo passo" é um INVARIANTE, não um campo.** Todo turno deve **conduzir** — isso é concretizado por `expectedResponse` e/ou pela própria `fala`, não por um campo separado. Se algum dia virar um campo explícito do schema, será decidido no código/`*_DETALHADA`, não aqui.

O contrato é **validado** antes de aplicar. Turno malformado cai no **fallback honesto** (mantém a identidade, não inventa treino/dieta, não mente persistência).

## 5. Responsabilidades — onde cada parte começa e termina

### O cérebro (decide)
- **Cérebro soberano:** a única autoridade que decide o que o GUTO faz no turno. Recebe contexto de todos os fornecedores e emite **um** contrato. (Detalhe em `GUTO_DECISION_ARCHITECTURE.md`.)
- **Piso de segurança (`risk-classifier`):** única exceção com poder de **preempt** — em risco real (autolesão, transtorno alimentar, evento cardio/neuro agudo, trauma) suspende a persona por um turno e acolhe/encaminha. **Não decide o conteúdo normal** do turno; é um veto de segurança, não um segundo cérebro. Falha-aberta.

### Fornecedores de contexto (informam, não decidem)
- **Memória / Calibração:** quem é o usuário, restrições, objetivo, idioma, país/cidade, histórico.
- **Proatividade:** **Eventos Temporários da Vida do Usuário** (ver §6 e §7) como contexto a adaptar — **propõe** continuidade, não decide sozinha.
- **Catálogos (exercício/comida):** os trilhos seguros; o que pode ser prescrito.
- **Histórico/risco de abandono, clima/feriado local:** sinais auxiliares.

### Executores / mãos (fazem, não decidem)
- **Treino & Missão:** materializam o `workoutPlan` decidido; respeitam catálogo, vídeo e `lockedByCoach`.
- **Dieta:** materializa o plano respeitando `NÃO COMO`, país e idioma.
- **GUTO Online:** conduz a sessão por estado (briefing, série, descanso, pausa, dor, retomada).
- **Validação → XP → Arena → Avatar → Percurso:** registram presença validada e propagam **o mesmo** estado a todos os lugares.

### Operação humana (por trás)
- **Coach / Empresa / Admin:** acompanham, editam plano, geram convite, veem risco. **Para o aluno, a presença continua sendo o GUTO.** Isolamento forte por time/coach. XP/streak não são editados à mão (são confiança do sistema).
- **Importante:** o operador humano **não é um quinto cérebro**. A edição do coach **vira um trilho** (`lockedByCoach`) que o cérebro **respeita** e nunca sobrescreve por automação — ver `GUTO_DECISION_ARCHITECTURE.md` §4(e).

## 6. As duas camadas de memória (não confundir)

A "fonte única de verdade" (§2) guarda **duas camadas distintas**, e a fronteira entre elas é sagrada:

| Camada | O que é | Como muda |
|---|---|---|
| **Permanente (calibração)** | Quem o usuário é: idade, sexo biológico, nível, objetivo, altura/peso, país/cidade, idioma, patologia/limitação, `NÃO COMO`. | Só com confirmação clara. Nasce na calibração e evolui com o uso real (treinos, feedback). |
| **Temporária (proativa/contextual)** | Eventos com prazo da semana: viagem, plantão, prova, casamento, janela curta, academia fechada… | Nasce da detecção no chat, transita por estados (confirmação→uso→validação→descarte) e **expira**. |

> **Regra de ouro da memória:** o **temporário nunca vira permanente sem confirmação explícita.** Viagem a Roma **não** troca o `country`/`city` da calibração. "Nessun dolore" (it.) significa ausência de dor, **não** restrição alimentar. Promover ruído a calibração é bug crítico (quebra a confiança).

Ambas as camadas são **fornecedores de contexto** para o cérebro — nenhuma delas decide.

## 7. Proatividade: Eventos Temporários da Vida do Usuário (conceito, não casos)

A proatividade **não é sobre viagem.** Viagem foi apenas a primeira instância onde uma falha grave de arquitetura apareceu. O conceito canônico é:

> **Evento Temporário da Vida do Usuário:** qualquer compromisso ou situação futura, com prazo, que altere treino, dieta, descanso, horários ou comportamento.

Instâncias (todas tratadas pelo **mesmo** raciocínio, nunca por fluxos separados): viagem, aniversário, reunião, entrevista, campeonato, jogo, consulta médica, cirurgia, festa, casamento, férias, plantão, evento de trabalho, mudança, show, semana corrida, janela curta de tempo, academia fechada, etc.

O ciclo é sempre o mesmo, **independente da instância**:

```txt
detecção → entendimento semântico → confirmação → enriquecimento
   → uso → validação pós-evento → descarte/arquivamento
```

Princípio soberano da proatividade — **Continuidade Primeiro:** evento é mudança de contexto, **nunca** desculpa automática para parar. O GUTO assume continuidade, propõe adaptação e pergunta **só o dado crítico** que falta; só cria impacto definitivo quando o dado crítico chega. (Detalhe operacional em `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` — esta seção fica no nível de **conceito**.)

**Implicação arquitetural (obrigatória):** o cérebro raciocina sobre a **classe** de evento, não sobre o exemplo. Não pode existir um "motor de viagem", um "motor de cirurgia", um "motor de casamento". Existe **um** raciocínio de Evento Temporário. Especializar por instância é a mesma doença do parlamento de gates (ver `GUTO_DECISION_ARCHITECTURE.md`).

## 8. Idioma na arquitetura (lei, não camada de tradução)

O idioma **não** é uma etapa de tradução no fim do pipeline. O **cérebro pensa e produz a fala já no idioma do usuário** (`pt-BR`, `en-US`, `it-IT`), com a personalidade do GUTO naquele idioma, desde a origem. O idioma é um atributo da **memória permanente** (definido no onboarding) e entra como contexto no cérebro. Os três idiomas existem sempre; não há fase "só um idioma". Todos os módulos apenas exibem.

**País ≠ idioma.** O idioma governa fala/botões/voz. O país/cidade governa contexto (alimentação, clima, disponibilidade, cultura). Os dois entram como contexto no cérebro e saem combinados em uma única resposta. Tratar idioma como tradução posterior é uma regressão arquitetural.

## 9. Invariantes de sistema (se quebrar, é bug crítico)

1. **Uma só verdade:** todas as áreas leem o mesmo estado persistido.
2. **Uma só decisão de conteúdo por turno:** emitida pelo cérebro, no contrato. (A segurança faz *preempt*, não decisão de conteúdo.)
3. **Raciocínio por conceito:** o cérebro trata classes (ex.: Evento Temporário), nunca fluxos especializados por instância.
4. **Duas camadas de memória:** temporário nunca vira permanente sem confirmação.
5. **Persistência honesta:** "salvei" só com gravação confirmada.
6. **Próximo passo sempre:** todo turno conduz (via `expectedResponse`/`fala`).
7. **Trilhos fechados:** prescrição só dentro do catálogo validado.
8. **Idioma correto na origem:** fala nasce no idioma do usuário; país independente.
9. **Plano do coach soberano:** `lockedByCoach` nunca é sobrescrito por automação.
