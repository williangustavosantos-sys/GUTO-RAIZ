# Proatividade e Ciclo Semanal do GUTO — Roteiro Detalhado de Engenharia

> **Documento canônico** da Máquina de Estados de Proatividade, Ciclos de Contexto Semanal e Inteligência de Presença do GUTO.
>
> **Natureza:** descreve o **GUTO atual + alvo de produto**. Proatividade **não** é notificação push genérica nem mensagem pronta ao abrir: é o ciclo fechado **ENTENDER → VALIDAR COM O USUÁRIO → SALVAR → MOSTRAR → USAR DEPOIS**. O código ainda mantém estados internos mais detalhados (`pending_confirmation`, `confirmed`, `enriched`, `surfaced`, `pending_validation`, `validated_happened`, `validated_postponed`, `discarded`). Onde o código atual diverge, ver **[Pontos de Atenção](#pontos-de-atenção-doc--código-atual)** no fim.
>
> **Documentos relacionados:** `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` · `GUTO_CHAT_E_CEREBRO_DETALHADA.md` (a proatividade fala pelo chat) · `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` · `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` · `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` (não vira calibragem permanente sem confirmar).

---

## O Que É A Proatividade Do GUTO

A proatividade do GUTO é a chave de virada sensorial do produto. Ela é o mecanismo técnico e comportamental que faz o usuário sentir que seu companheiro ativo digital não é um robô de respostas passivas, mas uma presença real que o acompanha na jornada diária.

**Proatividade NÃO é:**
- Disparar notificações push genéricas com frases motivacionais aleatórias.
- Mandar mensagens automáticas e frias dizendo: *"Hora de treinar!"*.
- Enviar alertas irritantes de calendário sem qualquer relação com o estado físico do aluno.

**Proatividade É:**
Um ciclo integrado e fechado onde o GUTO **entende, valida com o usuário, salva, mostra e usa depois** eventos e contextos pessoais da vida do usuário que afetam de forma direta a sua capacidade de cumprir a Missão.

Contrato operacional curto:

```txt
ENTENDER → VALIDAR COM O USUÁRIO → SALVAR → MOSTRAR → USAR DEPOIS
```

As informações coletadas não servem apenas para preencher calendário. Elas passam a orientar treino, dieta, cobrança, XP, Arena, Percurso, GUTO Online e conversas futuras. Quando o evento é temporal ou incerto, o GUTO não gera impacto definitivo sem validação/dado crítico suficiente.

Se este ciclo operar com 100% de precisão e integridade, o GUTO atinge sua promessa de valor: o usuário sente que não está sozinho e que o GUTO sabe exatamente o que está acontecendo na semana dele.

---

## A Ideia Principal: O Contexto Operacional

O GUTO monitora e reage a eventos da rotina do usuário que influenciam as variáveis de treino, dieta, segurança articular, cobrança de presença e consistência.

### Eventos Monitorados
- Viagens (lazer ou trabalho).
- Compromissos profissionais ou familiares fora da rotina.
- Alterações temporárias de horários disponíveis.
- Cansaço acumulado ou fadiga prevista.
- Dores ou incômodos musculares.
- Fechamento de academias (feriados locais).
- Semanas atipicamente corridas.

Essas informações são salvas como **Memória Proativa Contextual**, moldando a flexibilidade e a resiliência do sistema.

---

## Princípio Soberano: Continuidade Primeiro (Suficiência de Contexto)

> Esta é a regra que governa **toda** a proatividade. Quando qualquer outra regra desta spec colidir com ela, ela vence.

A proatividade do GUTO **não é cancelar rotina** — é **preservar continuidade apesar da vida real**. Viagem, reunião, chuva, pouco tempo, academia fechada e semana corrida são **mudanças de contexto**, nunca desculpas automáticas para parar.

O erro mais grave que o GUTO pode cometer aqui **não** é esquecer de validar um dado. É **pensar com mentalidade passiva de agenda tradicional**:

| Mentalidade ERRADA (agenda passiva) | Mentalidade CERTA (companheiro ativo) |
|---|---|
| viagem = descanso | viagem = mudança de contexto |
| evento = cancelar treino | evento = adaptar para manter continuidade |
| "compenso com intensidade máxima depois" | "a gente não para, só muda a forma" |
| assume interrupção primeiro | assume continuidade primeiro |

### As 7 leis da continuidade

1. **Proatividade não é cancelar rotina.** Nenhum evento, sozinho, cancela um treino.
2. **Proatividade é preservar continuidade apesar da vida real.** O padrão é manter o usuário ativo.
3. **Mudança de contexto ≠ desculpa.** Viagem, reunião, chuva, pouco tempo, academia fechada, rotina corrida são contexto a adaptar, não motivos para sumir.
4. **O GUTO assume continuidade como padrão.** Nunca assume interrupção primeiro. Sempre busca uma forma de adaptar antes de proteger/bloquear o dia.
5. **O GUTO pergunta só o mínimo crítico** para conseguir adaptar — nunca vira formulário, nunca pergunta 7 coisas.
6. **Só cria impacto operacional definitivo depois de informação suficiente.** Sem o dado crítico, não há `workoutEffect`/`missionEffect`/XP/Arena definitivos.
7. **Informação insuficiente → decisão `ask_critical`, não impacto definitivo.** O impacto definitivo nasce quando - e só quando - o dado crítico chega.

### O fluxo correto (ordem obrigatória)

```txt
COLETAR → ENTENDER → PROPOR CONTINUIDADE → PERGUNTAR APENAS O DADO CRÍTICO
   → CONFIRMAR → SALVAR → ENRIQUECER → USAR → VALIDAR DEPOIS → ATUALIZAR OU DESCARTAR
```

A diferença para o ciclo geral é a etapa **PROPOR CONTINUIDADE antes de perguntar**: o GUTO já chega oferecendo a adaptação ("eu consigo adaptar pra hotel/quarto/academia ou missão curta") e só então pergunta o dado crítico que falta.

### A fala do GUTO é ativa, não burocrática

**Deve soar como:**
- "Eu consigo adaptar."
- "A gente não para."
- "Me diz só se você vai ter tempo/equipamento."

**Nunca pode soar como:**
- formulário ("preencha: dia / horário / local / duração / equipamento…").
- agenda passiva ("viagem é dia de descanso", "vamos compensar com intensidade máxima").
- muitas perguntas de uma vez.

### Suficiência de contexto por tipo de evento

- **Viagem (sem mais nada — ex.: "viajo na quarta"):** contexto **insuficiente**. NÃO cria impacto definitivo. Gera decisão `ask_critical` e **propõe continuidade + pergunta o dado crítico** (vai ter tempo/equipamento pra treinar, ou é impossível mesmo?).
  - **"consigo treinar no hotel" / "tenho academia no hotel" / "dá pra treinar":** agora há contexto. Cria impacto **adaptado** (treino curto/leve no hotel/quarto). Mantém o treino no dia. **Não** marca descanso, não cria dia protegido e **não** compensa com intensidade máxima.
  - **"não vai dar" / "não consigo treinar" / "fico o dia inteiro sem tempo":** agora há contexto. Abre/usa confirmação de dia protegido/indisponível e só depois salva o impacto definitivo no Percurso. Sem intensidade máxima automática, sem XP grátis, sem Arena grátis.
- **Reunião com período já definido (ex.: "reunião quarta à noite"):** pode adaptar o período (já existe período), mas **preserva continuidade** — puxa o treino para antes ou deixa missão curta. Nunca cancela o dia inteiro.
- **Semana corrida ("semana corrida"):** continuidade reduzida — plano mínimo executável. "A semana vai ser executável, não perfeita." Linguagem ativa, não passiva.
- **Pouco tempo ("só tenho 10 minutos"):** **não cancela.** Vira missão curta e direta de 10 minutos.

### Exemplos — Certo × Errado

**Caso: "Viajo na quarta"**

❌ **ERRADO (mentalidade passiva — proibido):**
> "Quarta é dia de descanso ou treino adaptado, vamos ajustar o cronograma. Hoje e amanhã o foco é intensidade máxima pra compensar."
>
> Por quê: assume descanso/adaptação sem saber a condição, fala "intensidade máxima pra compensar", trata viagem como interrupção e já decide por baixo do usuário.

✅ **CERTO (continuidade ativa):**
> "Fechado. Viajar não é desculpa pra sumir. Eu consigo adaptar teu treino pra hotel, quarto, academia do hotel ou até uma missão curta de 15 minutos. A pergunta é: na quarta você vai ter algum tempo pra gente treinar ou vai ser impossível mesmo?"

**Usuário: "Consigo treinar no hotel"**

✅ "Perfeito. Então eu não vou bloquear a quarta. Vou adaptar o treino pra hotel/quarto e manter tua sequência viva. Confirmo assim?"

**Usuário: "Não vai dar"**

✅ "Fechado. Aí sim eu considero quarta indisponível e reorganizo a semana sem inventar intensidade máxima. Confirmo quarta como dia protegido?"

### Card de confirmação de viagem/indisponibilidade

Quando a viagem impede treino, o card é a materialização do ciclo **entender → validar → salvar**:

- O GUTO primeiro tenta adaptar. Se o usuário consegue treinar, não há bloqueio nem dia protegido.
- Se o usuário diz que não consegue treinar, o GUTO mostra confirmação (`confirmar`, `alterar`, `fechar`) antes do impacto definitivo.
- O Percurso pode exibir uma decisão pendente como memória visual, mas o efeito definitivo (`day_protected`, reorganização e ausência de cobrança) só deve nascer após confirmação ou dado crítico suficiente.

**Caso: "Reunião quarta à noite"**

✅ "Fechado. A noite está bloqueada, então eu puxo o treino antes ou deixo missão curta. Você prefere manhã/tarde ou eu decido pelo melhor horário?"

**Caso: "Semana corrida"**

✅ "Então a semana vai ser executável, não perfeita. Eu reduzo o plano e seguro o mínimo que mantém tua evolução."

**Caso: "Só tenho 10 minutos"**

✅ "Então hoje é missão de 10 minutos. Curta, direta e sem desculpa."

### Comportamento proibido (resumo)

- Assumir que viagem significa descanso.
- Assumir treino adaptado **sem saber a condição** (tempo/equipamento).
- Falar "intensidade máxima pra compensar".
- Criar `ProactiveImpact` definitivo **antes** do dado crítico.
- Parecer formulário passivo / perguntar muitas coisas de uma vez.
- Salvar como confirmado sem confirmação operacional.
- Cancelar treino antes de tentar adaptar.

---

## O Ciclo da Semana e o Gatilho Resiliente

O início natural da coleta do contexto semanal ocorre nas primeiras horas da segunda-feira. No entanto, o sistema deve ser resiliente a inatividades.

```txt
               [ Gatilho de Coleta Semanal ]

            Segunda-feira?
             /          \
          (Sim)         (Não)
           /              \
    Usuário abriu?    Primeira abertura real
          │           do usuário na semana?
          ▼                    │
    Perguntar sobre            ▼
    a rotina semanal     Perguntar sobre a rotina
                         e planejar o resto da semana
```

### Regra do Gatilho Resiliente
Se o usuário sumiu e só abriu o aplicativo na quarta-feira, o GUTO detecta que a semana corrente não possui registros de contexto ativo. A primeira interação do GUTO com o aluno deve ser o questionamento acolhedor e focado sobre o restante dos seus dias:
> *"Will, para eu organizar tua missão direito daqui para frente: como está o resto da tua semana? Tem viagem, compromisso ou horário quebrado que eu preciso considerar?"*

---

## O Que a Proatividade Salva vs. O Que Ignora

Para manter o banco de dados limpo e os prompts focados, o extrator semântico do backend aplica um filtro de relevância sobre as conversas.

A proatividade cria contexto operacional temporário. Ela não deve transformar automaticamente uma semana atípica em calibragem permanente.

### Salva na Memória Proativa (Impacto Direto)
- *"Quarta vou viajar para Roma."* (Afeta clima, local de treino e tempo de Missão).
- *"Sexta tenho um compromisso o dia inteiro."* (Gera sugestão de treino matutino mais curto).
- *"Esta semana só consigo treinar às 06h."* (Ajusta os alarmes de cobrança ativa no push).
- *"Sábado tenho o casamento do meu irmão."* (Sinaliza dia de descanso planejado ou dieta prática).

### Ignora (Conversa Casual)
- *"Roma é uma cidade linda."*
- *"Estou assistindo a uma nova série."*
- *"Hoje o café da manhã estava maravilhoso."*

**Regra de Ouro:** Só vira memória proativa o evento que altera treino, dieta, cobrança, rotina, segurança ou consistência de presença.

Mesmo nesses casos, se a ação afetar calibragem, treino ou dieta permanente, o GUTO deve confirmar antes de salvar em memória operacional.

---

## Confirmação Ativa (Sem Suposições)

O GUTO nunca salva informações de rotina como verdades absolutas de forma silenciosa. Ele sempre passa pela etapa de validação com o usuário no chat.

### Cenário de Confirmação Clara
- **Usuário:** *"Quarta vou para Roma e sexta vou para Londres."*
- **GUTO (Entende e propõe confirmação):** *"Ok, Will. Então quarta é Roma e sexta é Londres, certo?"*
- **Usuário:** *"Certo / Isso."*
- **Resultado:** Backend altera o estado da memória para `confirmed`.

### Cenário de Correção Ativa
- **Usuário:** *"Quarta vou para Roma e sexta vou para Londres."*
- **GUTO:** *"Ok, Will. Então quarta é Roma e sexta é Londres, certo?"*
- **Usuário:** *"Não, na verdade Roma é quinta."*
- **GUTO (Corrige antes de salvar):** *"Fechado. Roma fica na quinta e Londres na sexta. Anotado!"*

### Cenário Ambíguo (Anti-Chute)
- **Usuário:** *"Vou viajar essa semana, acho que quarta."*
- **GUTO (Recusa a suposição):** *"Não vou chutar, Will. Roma ainda está de pé para quarta ou o dia ficou incerto?"*

---

## Estados da Memória Proativa

Cada evento contextual transita por estados lógicos rigorosos no backend:

1. `pending_confirmation`: O extrator do backend identificou o evento na fala, mas o usuário ainda não confirmou o sim/não na bolha do chat.
2. `confirmed`: O usuário confirmou a validade do evento.
3. `enriched`: O backend agregou metadados externos (clima, feriado local da cidade de destino, fuso).
4. `surfaced`: O evento foi inserido de forma orgânica e natural em uma conversa de chat, na descrição do treino ou menu da dieta.
5. `pending_validation`: A data do evento passou. O sistema ativa um lembrete para questionar o resultado.
6. `validated_happened`: O usuário confirmou que o evento ocorreu.
7. `validated_postponed`: O usuário informou que o evento foi adiado. O GUTO reprograma para as novas datas de destino.
8. `discarded`: O evento foi cancelado no meio do ciclo ou rejeitado na validação. Deixa de influenciar treinos futuros.

---

## Cancelamentos e Ajustes no Meio do Ciclo

Se os planos do usuário mudarem no meio da semana, o sistema deve reagir imediatamente.

```txt
   [ Fluxo de Cancelamento no Meio do Ciclo ]

   Usuário informa: "Cancelei a viagem a Londres"
   ├── 1. Backend intercepta a intenção semântica
   ├── 2. Localiza a memória proativa correspondente
   ├── 3. Altera o status de "confirmed/enriched" ➔ "discarded"
   ├── 4. Remove filtros de adaptação de treino e clima
   └── 5. GUTO diz: "Entendido. Londres caiu da semana. Missão normalizada!"
```

Ao final do ciclo, a memória marcada como `discarded` está banida de questionamentos. O GUTO **nunca** perguntará ao usuário: *"E aí, Will, como foi Londres?"* caso a viagem tenha sido cancelada no meio do caminho. Perguntar sobre eventos cancelados demonstra desatenção técnica.

---

## Enriquecimento e Uso Contextual

Uma vez confirmada a memória (ex: "Viagem para Roma na quarta"), o backend enriquece o dado e o GUTO o aplica silenciosamente de forma integrada:

- **Na Terça-feira (Dia anterior):**
  > *"Will, amanhã é tua viagem para Roma. Já vi que tem previsão de chuva por lá, então hoje a nossa missão vai ser forte e interna na academia, sem depender de rua. Preparado?"*
- **Na Quarta-feira (No GUTO Online):**
  > *"Will, hoje você viaja, então o treino foi desenhado para ser curto e preciso. Vamos manter a consistência sem ego no final."*
- **Na Quinta-feira (Na Dieta):**
  > *"Como você está em trânsito/Roma, selecionei refeições práticas e fáceis de encontrar em mercados locais de lá para você não perder os macros."*

Regras de aplicação:
- Viagem ou cidade temporária pode adaptar treino/dieta da semana, mas não troca `country`/`city` permanente da calibragem sem confirmação explícita.
- Dieta em viagem respeita o local informado para o evento e o campo **NÃO COMO**.
- Se treino ou dieta estiverem com `lockedByCoach: true`, a proatividade não sobrescreve o plano. Ela cria sinal de revisão ou sugere comportamento seguro.

---

## Validação Pós-Evento (O Fechamento)

No início do ciclo seguinte, o GUTO repassa as memórias pendentes de validação (`pending_validation`) para garantir que o histórico seja limpo e as pendências resolvidas.

### Caso 1: Aconteceu de fato
- **GUTO:** *"Will, a viagem de Roma rolou tudo certo?"*
- **Usuário:** *"Sim, foi ótimo!"*
- **Backend:** Altera para `validated_happened` e arquiva para o histórico de conquistas.

### Caso 2: Adiado (Postponed)
- **GUTO:** *"Will, a viagem de Roma rolou tudo certo?"*
- **Usuário:** *"Não, adiei para a semana que vem."*
- **Backend:** Altera para `validated_postponed`, atualiza o `dateParsed` para a nova semana e mantém o evento ativo para influenciar a nova Missão.
- **GUTO:** *"Fechado. Levo Roma para a semana que vem e ajusto a tua missão de hoje com base nisso."*

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **Sujeira Eterna:** Deixar memórias proativas abertas por semanas sem validação. Eventos passados devem ser liquidados ou reprogramados a cada fechamento de ciclo semanal.
- **Suposição de Dados:** O sistema alterar rotinas do usuário baseado em inferências soltas do chat sem passar pelo estágio `confirmed`.
- **Incoerência com Cancelamentos:** O GUTO perguntar sobre eventos que o usuário cancelou de forma explícita na quarta-feira.
- **Cobrança Cega:** Cobrar presença ou penalizar o streak de um aluno em viagem se ele declarou e confirmou previamente que estaria em trânsito aéreo e sem acesso a aparelhos.
- **Duplicar Memórias em Correções:** Criar um novo evento no banco em vez de atualizar as datas (`dateParsed`, `updatedAt`) do evento existente caso o usuário faça correções de dia de viagem.
- **Alterar Calibragem Sem Pedido Claro:** transformar contexto temporário em país, cidade, local de treino, dor ou restrição permanente sem confirmação.
- **Sobrescrever Plano Do Coach:** mudar treino ou dieta bloqueados pelo coach com base em contexto proativo sem liberação.

---

## Pontos de Atenção (doc × código atual)

> Sinalização doc × `guto-app-v0`/`guto-backend`. A proatividade é elo maduro: ciclo completo confirmar→validar→arquivar nos 3 idiomas, coberto por testes (`proactivity-resolver`, 23 passes).

| # | Tema | Doc (alvo / GUTO finalizado) | Código atual | Tipo |
|---|---|---|---|---|
| P-1 | Ciclo fechado (entender→validar→salvar→mostrar→usar depois) | Estados `pending_confirmation`→`confirmed`→`enriched`→`surfaced`→`pending_validation`→`validated`/`discarded` | `src/proactivity/*` + `proactive-store` (testado) | ✅ alinhado |
| P-2 | Confirma antes de impacto definitivo (anti-chute, Regra Soberana 1) | Pode guardar pendência, mas não deve aplicar treino/dieta/XP/Percurso definitivo sem aceite/dado crítico | `memory-action-resolver` + `decision-engine` usam `ask_critical`, confirm/discard/update | ✅ alinhado |
| P-3 | Não vira calibragem permanente sem confirmação | Viagem/cidade temporária não troca `country`/`city` permanente | `memory-action-resolver` respeita | ✅ alinhado |
| P-4 | Não sobrescreve plano `lockedByCoach` | Vira pendência/revisão | Respeitado | ✅ alinhado |
| P-5 | Arquiva memória após o ciclo (sem sujeira eterna) | `discarded`/expiração + reschedule | `proactive-store` (expira 24h, reschedule +7d; testado) | ✅ alinhado |
| P-6 | Enriquecimento com clima/feriado da cidade | Usa contexto externo (auxiliar; não bloqueia se falhar) | `memory-enricher` usa `wttr.in` e `date.nager.at` quando há cidade/data | ✅ alinhado |
| P-7 | Não cobra presença de quem declarou viagem/indisponibilidade | Penalidade de ausência suspensa no dia confirmado | Regra documentada e respeitada na penalidade | ✅ alinhado |

> A fala da proatividade sai sempre pelo chat com a personalidade do GUTO (curta, humana): ver `GUTO_CHAT_E_CEREBRO_DETALHADA.md`.

> **Correção 2026-05-30 (ver `GUTO_FIX_CONTEXTO_PROATIVIDADE.md`):** P-2 (confirmação ativa) estava ✅ no papel mas **não acontecia no chat** — compartilhar viagem/compromisso era classificado como recusa (`postpone`) e o GUTO **cobrava treino** em vez de acolher e perguntar "é isso?". A viagem era salva em `pending_confirmation` de forma silenciosa (proibido pela spec) e travava ali. **Corrigido:** novo kind `proactive_context` (contexto ≠ recusa) → a escada de cobrança não atropela; e a confirmação no chat virou natural (sem vazar texto interno). Verificado ao vivo: "viajo na quarta" → acolhe/adapta → captura → confirma natural → `trip:confirmed`. Recusa legítima ("não vou treinar") segue na escada.

> **Correção 2026-06-08 (continuidade primeiro — ver `GUTO_FIX_CONTEXTO_PROATIVIDADE.md`):** depois da correção anterior o GUTO parou de cobrar, mas passou a responder com **mentalidade passiva de agenda** — "viajo na quarta" → *"Quarta é dia de descanso ou treino adaptado… intensidade máxima pra compensar."* Isso viola o **[Princípio Soberano: Continuidade Primeiro](#princípio-soberano-continuidade-primeiro-suficiência-de-contexto)**. **Corrigido:** (1) o `decision-engine` deixou de criar impacto definitivo para viagem sem o dado crítico — viagem nua vira `ask_critical` (sem `workoutEffect`/XP/Arena definitivos); só com "consigo treinar" vira impacto adaptado (treino mantido, curto/leve), e só com "não vai dar" vira dia protegido/indisponível (reorganiza a semana, sem XP/Arena grátis, sem intensidade máxima); (2) o chat ganhou fala ativa de continuidade para `proactive_context` (propõe adaptação + pergunta só o dado crítico), nunca "descanso" por padrão nem "intensidade máxima pra compensar"; (3) "só tenho 10 minutos" vira missão curta e "semana corrida" vira plano mínimo, em linguagem ativa.
