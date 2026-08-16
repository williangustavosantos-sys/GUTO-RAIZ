# GUTO Online (Sessão Assistida em Tempo Real) — Roteiro Detalhado de Engenharia

> **Documento canônico** da Máquina de Estados, Interface Touch-First, Protocolos de Dor e Resiliência de Retomada do GUTO Online (a sessão guiada em tempo real).
>
> **Natureza:** descreve o **GUTO atual + alvo de produto**. O GUTO Online **usa o plano oficial persistido** (`lastWorkoutPlan`) e respeita `lockedByCoach`; ele **termina na Validação** com selfie obrigatória. Onde o código atual diverge, ver **[Pontos de Atenção](#pontos-de-atenção-doc--código-atual)** no fim.
>
> **Documentos relacionados:** `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 11) · `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` (plano oficial) · `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` (validação → XP/streak) · `GUTO_CHAT_E_CEREBRO_DETALHADA.md` (Quick Talk).

---

## O Que É O GUTO Online

O GUTO Online é o portal de presença física e temporal do GUTO na vida do aluno. Ele representa o momento em que o companheiro digital deixa as conversas do chat e vai para o "campo de batalha" treinar junto com o usuário em tempo real.

**O GUTO Online NÃO é:**
- Um cronômetro ou temporizador de repouso comum.
- Uma videoaula gravada ou animação passiva.
- Uma lista estática de exercícios para o usuário ler sozinho.
- Um chatbot aberto que distrai o aluno durante o esforço físico.

**O GUTO Online É:**
Uma sessão guiada interativamente por uma **máquina de estados interna**, que dita instruções por voz curta, acompanha o progresso série por série, monitora queixas de dores articulares e executa substituições biomecânicas instantâneas de aparelhos. O usuário sente:
> *"O GUTO está treinando comigo aqui do meu lado agora."*

---

## Objetivo do GUTO Online: Combate ao Abandono

A maior taxa de desistência de atividade física ocorre durante a execução do treino. O aluno inicia motivado, mas abandona no meio da sessão devido a:
- Falta de orientação sobre ordem e postura.
- Intervalos excessivamente longos que resfriam o corpo.
- Aparelhos ocupados na academia que travam o fluxo.
- Dores musculares ou articulares que causam medo e insegurança.

O GUTO Online assume a condução desse momento crítico, transformando uma planilha estática em uma experiência guiada, segura e compacta.

---

## Requisitos de Inicialização

O GUTO Online nasce a partir da aba **Missão**. Ele exige que a conta do aluno preencha rigidamente os seguintes requisitos de autenticação e consistência antes de permitir a abertura do overlay:

```json
{
  "isAuthenticated": true,
  "hasActiveWorkoutPlan": true,
  "lastWorkoutPlanId": "valido",
  "hasLocalVideoAssets": true,
  "languageSelected": "confirmado",
  "preferredLocationDefined": true
}
```
Se o plano estiver vazio, o botão "Iniciar Treino" permanece bloqueado, forçando o fluxo de geração adaptativo no Chat do GUTO.

O plano usado na sessão é sempre o plano oficial persistido no backend. Se o coach travou o treino com `lockedByCoach: true`, o GUTO Online guia a execução desse plano, mas não troca a estrutura automaticamente.

---

## Interface Touch-First (Mobile-First de Esforço)

Durante a sessão física, o usuário está suado, fadigado, com pressa e operando o celular com apenas uma das mãos. Por isso, a interface do GUTO Online adota regras estritas de usabilidade física:
- **Botões Grandes e Espaçados:** Áreas de clique (CTAs) de no mínimo `64px` de altura, facilitando o toque rápido sem precisão fina.
- **Hierarquia Visual Direta:** Exibe em fonte gigante o Exercício Atual, a Série Ativa, e o Cronômetro de Descanso em contagem regressiva iluminada.
- **Teclado Ocultado:** Sem digitação de texto livre. Todas as interações ocorrem por botões rápidos de opção.

---

## Fases e Máquina de Estados do GUTO Online

A sessão transita de forma síncrona pelas fases controladas pelo motor lógico (`guto-online-engine`):

```txt
  [ BRIEFING ] ──➔ [ WARMUP ] ──➔ [ EXECUTING SET ] ──➔ [ RESTING ] ──➔ [ BETWEEN EXERCISES ]
                                         ▲                │
                                         │  (Série Feita)  │
                                         └────────────────┘
```

### 1. Briefing (O Alinhamento)
- **O que exibe:** Foco da missão, estimativa de tempo e primeiro bloco muscular.
- **Ação do GUTO:** Dá as boas-vindas curtas usando o nome e limitações calibradas.
- **Voz do GUTO:** *"Will, hoje o foco é força total (`muscle_gain`). Joelho direito protegido, execução sem pressa. Vamos começar pelo aquecimento."*

### 2. Warmup (O Aquecimento)
- **O que exibe:** Exercício de mobilidade ou cárdio leve sugerido.
- **Interface:** Botão grande **"AQUECIMENTO CONCLUÍDO"**.
- **Ação do GUTO:** *"Aquece limpo, sem gastar energia antes da batalha de carga."*

### 3. Executing Set (Série Ativa)
- **O que exibe:** Nome do exercício, série atual (ex: 2 de 4), faixa de repetições (ex: 8-10), carga sugerida e vídeo local de execução de até 15s em loop infinito silencioso.
- **Interface:** Botão soberano de toque rápido **"SÉRIE CONCLUÍDA"**.
- **Voz do GUTO:** *"Segunda série. Desce com controle, explode na subida."*

### 4. Resting (Descanso Ativo)
- **O que exibe:** Temporizador decrescente de repouso (ex: 75 segundos).
- **Interface:** Botão **"PULAR DESCANSO"** e botão **"PAUSAR"**.
- **Ação do GUTO:** Dá um conselho postural curto no início do timer e permanece em silêncio. No término do timer, emite um sinal haptic (vibração) e sonoro de início da próxima série.

### 5. Between Exercises (Transição de Aparelhos)
- **O que exibe:** Nome do exercício finalizado e o card do próximo movimento.
- **Interface:** Temporizador curto de transição para caminhada até a máquina e preparação de carga.

### 6. Quick Talk (Ajuste Situacional)
- **O que é:** Interface de diálogo ágil sem perder a memória do treino.
- **Ação:** O usuário clica em "Falar com GUTO" para reportar problemas como *"Aparelho ocupado"*. O GUTO Online responde e volta exatamente para a série e exercício onde parou.

### 7. Pain Check (Protocolo de Dor Articular)
Se o usuário relata dor a qualquer momento da sessão:
- O cronômetro e o treino são **pausados imediatamente**.
- A interface exibe botões de nível de dor: **Leve / Moderada / Forte**.
- **Tratamento de Dor Forte:** O GUTO diz *"Parou. Dor articular aguda não se negocia. Não insista."* e encerra ou suspende o bloco por segurança.
- **Tratamento de Dor Leve:** O GUTO pode oferecer alternativa biomecânica de menor impacto somente se o plano não estiver bloqueado pelo coach.
- **Se `lockedByCoach: true`:** o GUTO não remove nem troca exercício automaticamente. Ele pausa, registra a dor, orienta segurança e marca revisão para o coach.

### 8. Substitution (Troca de Exercício)
Acionado por dores, falta de aparelho ou falha local quando o plano permite adaptação. O backend escolhe uma alternativa direta do catálogo oficial de exercícios que tenha o mesmo grupo muscular alvo e possua vídeo de execução validado. A troca altera a Missão em tempo real.

Se o plano estiver bloqueado pelo coach, a substituição vira pendência de revisão. O GUTO pode sugerir pausar, encerrar, reduzir intensidade segura ou falar com o coach, mas não altera o plano oficial sozinho.

### 9. Fatigue Adjustment (Ajuste de Fadiga)
Se o aluno relatar cansaço extremo (energia baixa), o GUTO Online ajusta as variáveis em execução: reduz o volume de séries (ex: de 4 para 3), aumenta o tempo de descanso entre os exercícios ou elimina o circuito finalizador.
> *"Cansado, mas presente. Reduzi o volume de séries para você fechar a missão limpo. O que vale hoje é o comparecimento."*

Se o treino estiver bloqueado pelo coach, ajustes de fadiga não podem mudar o plano salvo. O GUTO pode conduzir a sessão com pausas seguras, sugerir encerramento responsável e gerar sinal para revisão.

### 10. Paused (Pausa Segura)
A sessão entra em suspensão física. O tempo total decorrido é pausado, aguardando clique em "Continuar" ou "Encerrar Treino".

### 11. Finished (Conclusão e Direcionamento)
- **O que exibe:** Resumo total de séries feitas, tempo decorrido e exercícios cumpridos.
- **CTA Principal:** Botão iluminado **"VALIDAR TREINO"** (leva o usuário para a etapa final de provas de presença da Página 12).
- **Voz do GUTO:** *"Missão física cumprida, Will. Agora valida comigo na tela de fotos para carregar teu streak de hoje de forma oficial."*

---

## Resiliência e Persistência de Crash (Retomada Inteligente)

Se o aplicativo fechar por falta de bateria, recebimento de ligação telefônica ou saída acidental da tela, o estado de execução da sessão é persistido no backend (`guto-online-storage`) e obedece à regra temporal de retomada:

| Tempo de Fechamento | Comportamento de Retomada do Sistema |
| :--- | :--- |
| **0 a 15 minutos** | Retorna de forma automática ao GUTO Online, exatamente no mesmo exercício, série e segundo do cronômetro onde ocorreu a interrupção. |
| **15 minutos a 12 horas** | Exibe popup acolhedor perguntando: *"Will, vi que teu treino foi interrompido no meio. Quer continuar exatamente de onde parou ou prefere reiniciar a sessão?"* |
| **Mais de 12 horas** | A sessão antiga é expirada e apagada para evitar o acúmulo de dados obsoletos. O dia retorna para a aba Missão normal. |

---

## Log de Eventos de Ciclo de Vida da Sessão

Cada transição de estado gera um evento estruturado disparado ao backend para monitoramento técnico de bugs e auditorias:
- `session_started`
- `warmup_completed`
- `set_completed`
- `rest_started`
- `pain_reported`
- `substitution_applied`
- `session_paused`
- `session_finished`

---

## Diretrizes Rigorosas de Voz e Antirrepetição

- **Comandos de Voz Seguros:** O GUTO Online suporta leitura de voz, mas comandos de alta sensibilidade (ex: pular exercício, encerrar sessão precocemente, aumentar carga sugerida) **nunca** executam ações de forma autônoma sem confirmação física do toque no botão na tela. Isso protege a integridade do treino contra falhas de captação e barulhos da academia.
- **Frequência Controlada:** O GUTO não deve falar em todas as repetições para não se tornar um locutor irritante. Ele fala no briefing de entrada, no início de novos exercícios, na chamada de término de descanso e em queixas físicas.
- **Antirrepetição de Incentivo:** O sistema possui um cache das últimas 5 frases de incentivo utilizadas, impedindo a repetição mecânica de termos como *"Boa. Boa. Boa."* seguidamente.
- **Fallback Estrito:** Se a voz de conversão TTS apresentar falhas robóticas ou instabilidades de rede, o GUTO Online desabilita o áudio imediatamente e guia o aluno apenas por vibrações haptics associadas a textos gigantes na interface.

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **Iniciar no Limbo:** Permitir a inicialização do GUTO Online sem que um plano oficial (`lastWorkoutPlan`) esteja ativo na memória do usuário.
- **Esquecer o Progresso:** O app fechar por receber uma chamada de voz e, ao reabrir 30 segundos depois, resetar o treino para o início do aquecimento, forçando o aluno a refazer tudo.
- **Permitir Treino com Dor Aguda:** Continuar cobrando execuções se o usuário relatar dor de nível forte na checagem.
- **Falsificação de Validação:** Encerrar o GUTO Online e marcar de forma silenciosa o treino como concluído na Arena ou Percurso sem passar pelo portão de prova fotográfica da Validação (Página 12).
- **Falar Idioma Incompatível:** Ignorar o idioma escolhido pelo usuário (`selectedLanguage`) durante os alertas de voz e áudios de transição de séries do GUTO Online.
- **Sincronia Quebrada de Trocas:** Trocar um exercício por outro no GUTO Online e não sincronizar essa alteração na visualização estática da aba Missão. O plano de treino é um recurso unificado.
- **Desrespeitar Plano Travado:** Alterar exercício, volume ou estrutura de treino bloqueado pelo coach sem revisão/autorização.

---

## Pontos de Atenção (doc × código atual)

> Sinalização doc × `guto-app-v0`/`guto-backend`. O GUTO Online é elo maduro: state machine e retomada por janela de tempo validadas (`guto-online-engine`, `decideResume`).

| # | Tema | Doc (alvo / GUTO finalizado) | Código atual | Tipo |
|---|---|---|---|---|
| O-1 | Usa plano oficial do backend; não cria sessão falsa | Sessão nasce de `lastWorkoutPlan` | Engine consome `GutoWorkoutPlan` oficial | ✅ alinhado |
| O-2 | Máquina de estados (briefing/warmup/série/descanso/transição/fim) | Fases controladas | `guto-online-types` + `guto-online-engine` | ✅ alinhado |
| O-3 | Dor pausa e protege; fadiga ajusta volume | Pain Check / Fatigue Adjustment | Botão de dor + `POST /guto/online/exception` | ✅ alinhado |
| O-4 | Ações críticas exigem toque (voz não dispara sozinha) | Touch-first; voz só auxiliar | Honrado na UI | ✅ alinhado |
| O-5 | Retomada por janela (<15min auto / 15min–12h pergunta / >12h expira) | Regra temporal exata | `guto-online-storage.decideResume` | ✅ alinhado |
| O-6 | Respeita `lockedByCoach` (não troca/altera plano travado) | Pausa, registra, marca revisão | Respeitado | ✅ alinhado |
| O-7 | Termina na Validação (selfie obrigatória) | Sem prova não conta | Backend retorna `SELFIE_REQUIRED` sem `imageBase64`; XP/Arena só entram com evidência | ✅ alinhado |
| O-8 | Risco: sessão não inicia sem `userId` no storage | Botão bloqueado sem identidade | Requisito de inicialização presente | ✅ alinhado |

> A finalização leva à Validação (Pág. 12) → XP/streak: detalhe em `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md`.
