# Proatividade e Ciclo Semanal do GUTO — Roteiro Detalhado de Engenharia

> Documento canônico de especificação da Máquina de Estados de Proatividade, Ciclos de Contexto Semanal e Inteligência de Presença do GUTO.

---

## O Que É A Proatividade Do GUTO

A proatividade do GUTO é a chave de virada sensorial do produto. Ela é o mecanismo técnico e comportamental que faz o usuário sentir que seu companheiro ativo digital não é um robô de respostas passivas, mas uma presença real que o acompanha na jornada diária.

**Proatividade NÃO é:**
- Disparar notificações push genéricas com frases motivacionais aleatórias.
- Mandar mensagens automáticas e frias dizendo: *"Hora de treinar!"*.
- Enviar alertas irritantes de calendário sem qualquer relação com o estado físico do aluno.

**Proatividade É:**
Um ciclo integrado e fechado onde o GUTO **pergunta, entende, confirma, salva, enriquece, usa e valida** eventos e contextos pessoais da vida do usuário que afetam de forma direta a sua capacidade de cumprir a Missão.

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
