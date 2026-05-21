# Parte 4 — GUTO Online, Validação, Progressão e Proatividade

> Documento de fluxo de execução em tempo real, consistência de dados de recompensa e ciclos inteligentes de presença do GUTO. Leia depois da `Parte 3`.

## O Que Essa Parte Representa

Esta parte rege a presença física e temporal do GUTO na vida do usuário. É o momento do treino propriamente dito, da prestação de contas (accountability) e da proatividade que antecipa as necessidades do aluno. Ela sustenta três promessas fundamentais:

1. **Execução Segura em Tempo Real (GUTO Online)**: o GUTO Online não é um temporizador comum nem um vídeo gravado; é um sistema guiado por estados que acompanha o usuário série por série e o protege em caso de dor ou fadiga.
2. **Accountability sem Fraude (Validação e XP)**: o treino só conta como feito após validação estruturada enviada ao backend. A consistência de dados garante que o XP creditado atualiza igualmente todas as abas (Arena, Percurso e Evolução do Avatar) eliminando bugs visuais críticos de descompasso.
3. **Presença Viva Proativa**: o GUTO age e lembra do contexto do usuário sem precisar ser acionado. O ciclo de proatividade garante que dados informados de passagem virem memórias confirmadas e ações úteis de adaptação.

---

## 12) GUTO Online (Treino Assistido)

### O que é
A sessão assistida onde o GUTO executa o treino fisicamente "junto" com o usuário através de uma interface interativa baseada em estados.

### Máquina de Estados do Treino
O fluxo segue fases estritas controladas pelo backend e replicadas visualmente:
1. **Briefing**: explicação curta do foco do treino e alinhamento emocional.
2. **Aquecimento (Warm-up)**: preparação articular obrigatória antes de cargas.
3. **Exercício Atual**: card do exercício ativo com contagem de séries, repetições e carga.
4. **Descanso Activo**: temporizador de descanso entre séries com áudio ou instrução rápida de respiração.
5. **Transição**: instrução para trocar de máquina/localização e preparar o próximo movimento.
6. **Finalização**: alongamento rápido, coleta de feedback físico e encerramento.

### Regras Críticas de Execução e Voz
- **Ações Sensíveis Bloqueadas contra Falhas de Voz**: a voz do usuário pode falhar, captar ruídos ou ser interpretada incorretamente. Ações críticas (pular exercício, finalizar treino antes do tempo, aumentar carga de forma drástica ou trocar de movimento) **nunca** devem ser disparadas exclusivamente por frases por voz sem confirmação visual ou física na tela (botões com estado de segurança).
- **Tratamento de Dor e Fadiga**: se o usuário indicar dor (seja por voz ou por toque no botão de dor):
  - O treino é pausado imediatamente.
  - O sistema pergunta a região e a intensidade.
  - O GUTO se recusa a forçar articulações machucadas, oferecendo adaptação de movimento imediata ou sugerindo encerrar por segurança.
- **Retomada de Sessão Resiliente (Crash/Fechamento)**: se o aplicativo for fechado acidentalmente no meio do treino, a retomada segue a regra de tempo decorrido:
  - **Menos de 15 minutos**: o app abre diretamente no GUTO Online no mesmo exercício e série onde parou.
  - **Entre 15 minutos e 12 horas**: o GUTO exibe um popup perguntando de forma acolhedora se o usuário quer continuar de onde parou ou se deseja reiniciar a sessão.
  - **Mais de 12 horas**: a sessão antiga é descartada por expiração e o dia é resetado para nova missão.

---

## 13) Validação de Treino, XP e Streak

### O que é
A prova física de que o usuário realizou o plano do dia. O GUTO não distribui medalhas por intenção; ele valida a presença.

### O Fluxo de Validação
Após a conclusão do GUTO Online:
- O usuário envia a prova exigida (como foto de câmera, contagem e frase de confirmação de presença).
- O backend intercepta o envio, valida a autenticidade da sessão ativa, confere se bate com o plano oficial atual (`lastWorkoutPlan`) e grava o registro definitivo no histórico de treinos.

### Sistema de Recompensas (XP e Streak)
- **XP de Consistência**: o XP é gerado pela consistência (o ato de aparecer e validar o treino), não pelo ego (peso da carga ou velocidade). 
- **Integridade Visual do XP (Sem Descompasso)**: uma vez validado, o XP precisa atualizar em tempo real e de forma idêntica as seguintes abas:
  - **Arena**: atualização de pontuação no ranking semanal da dupla.
  - **Percurso**: gravação visual e histórica do ponto de presença no diário temporal.
  - **Evoluir (Avatar)**: progresso do avatar entre os 4 estágios da jornada:
    - **Baby** (Iniciante, primeiros passos).
    - **Teen** (Construindo consistência).
    - **Adult** (Rotina consolidada).
    - **Elite** (Estilo de vida ativo, alta retenção).
- *Bug Crítico banido:* o XP ou Streak nunca podem diferir entre uma tela e outra. Se a Arena exibe 120 XP e a tela do Avatar exibe 100 XP, isso é considerado falha técnica grave de sincronização de estado.

---

## 14) Proatividade

### O que é
O mecanismo autônomo do GUTO que faz o usuário sentir que seu companheiro está acordado e prestando atenção na vida dele fora do app.

### O Ciclo de Proatividade
O ciclo opera de forma estruturada para garantir precisão e evitar alucinações de IA:

```txt
1. COLETAR    --> Usuário menciona algo de passagem (ex: "Quinta vou para Roma").
2. ENTENDER   --> Backend interpreta semanticamente a informação e a data.
3. CONFIRMAR  --> O GUTO pergunta na tela ou chat: "Roma de quinta a domingo, correto?".
4. SALVAR     --> Após o "sim" do usuário, o dado é gravado como memória contextual ativa.
5. ENRIQUECER --> Durante a semana, o GUTO cruza essa memória com clima local ou hábitos.
6. USAR       --> Na quinta, o GUTO adapta o treino: "Treino hoje é mais curto por causa da viagem".
7. VALIDAR    --> Na segunda seguinte, ele pergunta: "Como foi a viagem a Roma? Conseguiu se mexer?".
8. DESCARTAR  --> Após a conclusão do ciclo, a memória temporal é arquivada para não acumular lixo.
```

### Regra de Segurança
- **Não Salvar sem Confirmar**: se o usuário diz algo ambíguo no chat, o GUTO **nunca** assume como verdade absoluta nem altera a calibragem de forma silenciosa. Ele sempre passa pela etapa de confirmação do ciclo antes de modificar memórias operacionais sensíveis.
