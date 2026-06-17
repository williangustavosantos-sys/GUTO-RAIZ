# GUTO — Estrutura e Fluxo Detalhado do App (Página por Página)

> **Documento canônico de arquitetura de fluxo do GUTO.** É a espinha que mapeia cada tela, botão, campo e o impacto sistêmico que cada informação gera de ponta a ponta na experiência da dupla.
>
> **Natureza deste documento:** descreve o **GUTO atual + referência-alvo** para o fluxo funcionar 100%. O que já está confirmado no código fica marcado como atual/alinhado; o que ainda não existe fica como **FUTURO** ou **[implementar]**. Onde o código atual diverge, o ponto está em **[⚠️ Pontos de Atenção](#pontos-de-atenção-doc--código-atual)** no fim do arquivo.

---

## Como Usar Este Documento

Este arquivo é o **mapa geral página por página** e a porta de entrada depois do `README.md`. Antes de qualquer agente alterar código, ele deve:

1. Ler o `README.md` da raiz.
2. Ler **este documento** para entender o fluxo completo de ponta a ponta.
3. Abrir o **documento canônico da área** afetada (tabela abaixo) para o detalhe profundo.
4. Comparar documentação com o código atual e entregar relatório antes de editar.

Este documento **não substitui** os documentos especializados. Em detalhes de calibragem, treino, dieta, chat, arena, XP/evolução, login, GUTO Online, proatividade ou painel, **a fonte específica da área prevalece**.

### Mapa de documentos canônicos por área

| Área (página deste mapa) | Documento canônico (fonte da verdade) |
|---|---|
| Abertura · Idioma · Login · Convite (Pág. 1–3) | `GUTO_PAGINA_DE_LOGIN_DETALHADA.md` |
| Consentimento · Nome · Calibragem · Pacto (Pág. 4–7) | `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` |
| Chat / Cérebro do GUTO (Pág. 8) | `GUTO_CHAT_E_CEREBRO_DETALHADA.md` |
| Missão / Treino do dia (Pág. 9) | `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` |
| Dieta (Pág. 10) | `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` |
| GUTO Online (Pág. 11) | `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` |
| Validação · XP · Streak (Pág. 12) | `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` |
| Arena (Pág. 13) | `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` |
| Evoluir / Avatar / Morte (Pág. 14) | `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` |
| Percurso (Pág. 15) | `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` + `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` |
| Painel Admin/Empresa/Coach (Pág. 16) | `GUTO_PAINEL_ADMIN_CANONICO_V1.md` |
| Proatividade (transversal) | `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` |

> A série `PARTE_1..5` é **leitura narrativa** e aponta para estes documentos profundos; não decide nada sozinha.

---

## Índice de Fluxo

- [Página 1: Vídeo de Abertura / Intro](#página-1-vídeo-de-abertura--intro)
- [Página 2: Seleção de Idioma](#página-2-seleção-de-idioma)
- [Página 3: Login ou Claim de Convite](#página-3-login-ou-claim-de-convite)
- [Página 4: Consentimento Legal e de Saúde](#página-4-consentimento-legal-e-de-saúde)
- [Página 5: Nome da Dupla (Naming)](#página-5-nome-da-dupla-naming)
- [Página 6: Calibragem Inicial (Corpo, Treino, Alergias e Localização)](#página-6-calibragem-inicial-corpo-treino-alergias-e-localização)
- [Página 7: O Pacto (Assinatura do Compromisso)](#página-7-o-pacto-assinatura-do-compromisso)
- [Página 8: Aba GUTO / Chat (A Central de Relação)](#página-8-aba-guto--chat-a-central-de-relação)
- [Página 9: Aba Missão (Treino do Dia)](#página-9-aba-missão-treino-do-dia)
- [Página 10: Aba Dieta (Menu Semanal)](#página-10-aba-dieta-menu-semanal)
- [Página 11: GUTO Online (Sessão Assistida em Tempo Real)](#página-11-guto-online-sessão-assistida-em-tempo-real)
- [Página 12: Validação de Treino (Provas, XP e Streak)](#página-12-validação-de-treino-provas-xp-e-streak)
- [Página 13: Aba Arena (Ranking de Presença)](#página-13-aba-arena-ranking-de-presença)
- [Página 14: Aba Evoluir (Avatar e Engajamento)](#página-14-aba-evoluir-avatar-e-engajamento)
- [Página 15: Aba Percurso (Visual de Consistência)](#página-15-aba-percurso-visual-de-consistência)
- [Página 16: Painel Admin e Coach (A Retaguarda B2B2C)](#página-16-painel-admin-e-coach-a-retaguarda-b2b2c)

---

## Página 1: Vídeo de Abertura / Intro

O app inicia com uma experiência cinemática imersiva. O objetivo é a transição psicológica do usuário para o ecossistema GUTO.

### Botões e Interações
1. **Botão central "Iniciar GUTO" (ou "Start GUTO" / "Avvia GUTO")**
   - **O que faz:** Ao ser tocado, executa o autoplay do vídeo de abertura com áudio (`abertura-guto.mp4`). Esse clique físico é obrigatório para transpor as restrições de reprodução de mídia do iOS Safari.
   - **Destino da informação:** Dispara o timer fixo de `4000ms` (tempo de duração do vídeo). Ao concluir ou se falhar, altera o estado do frontend `stage` de `"intro"` para `"language"`.
   - **Efeito cascata posterior:** O ritual prepara a mente do usuário para a sensação de estar lidando com um companheiro premium e vivo, não um site fitness padrão.

---

## Página 2: Seleção de Idioma

Permite ao usuário definir a lei de idioma de toda a aplicação.

### Botões e Interações
1. **Cápsula "Português 🇧🇷"**
2. **Cápsula "English 🇺🇸"**
3. **Cápsula "Italiano 🇮🇹"**
   - **O que faz:** O usuário toca em um dos idiomas. A interface ganha um brilho (glow) e emite um som de confirmação (`select`).
   - **Onde chega a informação:** 
     - Grava no `localStorage` sob as chaves `guto-onboarding-language` e `guto-selected-language` no formato ISO correspondente (`pt-BR`, `en-US` ou `it-IT`).
     - Direciona a rota para `/login?lang={idioma}` (ou inicia o stage de claim se houver convite pendente).
   - **Efeito cascata posterior:** 
     - **Telas e Botões:** Todo o vocabulário, botões, títulos de abas e mensagens de erro do app se convertem para o idioma selecionado.
     - **Chat do GUTO:** As instruções do sistema (System Prompts) informam o LLM sobre o idioma ativo do usuário. O GUTO falará de forma fluente e natural somente nesse idioma.
     - **Dieta e Configurações:** Traduz ingredientes, nomes de refeições e menus.
     - **Diferença País/Idioma:** Se o usuário escolher Português, mas na calibragem declarar que reside na Itália (`country: "IT"`), o GUTO falará em português brasileiro mas usará referências de alimentação e rotina locais da Itália na aba Dieta.

---

## Página 3: Login ou Claim de Convite

Assegura o controle de identidade e herança segura de dados.

### Campos e Inputs
1. **Campo "E-mail ou Usuário" (Input de Texto)**
   - Recebe as credenciais de identificação do aluno.
2. **Campo "Senha" (Input de Senha Oculta)**
   - Recebe a senha definida pelo usuário para descriptografia de token via bcrypt.

### Botões e Interações
1. **Botão "ENTRAR" (CTA de Envio)**
   - **O que faz:** Realiza um POST para `/auth/user/login` passando `{ emailOrId, password }`.
   - **Destino da informação:** O backend autentica as credenciais, verifica as permissões e responde com o JWT, que é gravado no `localStorage["guto-auth-token"]`.
   - **Efeito cascata posterior:** O backend associa a sessão do usuário à sua respectiva memória e time. Se o aluno pertencer ao Time Alfa, o Coach Beta do painel web não terá acesso técnico ou visual aos dados deste aluno. Se a conta estiver bloqueada ou pausada, o interceptor do frontend detecta o status no login e redireciona imediatamente para a tela `/acesso-pausado`.

2. **Claim de Convite (`/convite/[token]`)**
   - **O que faz:** Captura o token de convite, permite criação de senha e chama `/auth/invite/:token/claim`.
   - **Destino da informação:** O usuário recebe sessão própria, mas o nome vindo do convite continua sendo apenas sugestão.
   - **Efeito cascata posterior:** O app segue para consentimento, nome soberano, calibragem, pacto e sistema. O convite nunca oficializa o nome da dupla.

---

## Página 4: Consentimento Legal e de Saúde

Etapa obrigatória para autorização jurídica e segurança médica sobre o uso de dados de saúde.

### Botões e Interações
1. **Checkbox "Aceite dos Termos Gerais de Uso e Políticas"**
2. **Checkbox "Autorização de Processamento de Dados de Saúde"**
   - **O que faz:** O usuário marca individualmente cada checkbox. O botão "Continuar" permanece desabilitado até que ambos estejam marcados como `true`.
3. **Botão "Continuar"**
   - **O que faz:** Altera o estado do frontend gravando o consentimento como ativo e avança o onboarding para `/naming` (Nome da Dupla).
   - **Efeito cascata posterior:** Autoriza o GUTO a solicitar e armazenar dados corporais sensíveis do usuário. Se o usuário revogar o consentimento futuramente nas configurações, um POST é enviado a `/guto/consent/revoke`, limpando todos os registros sensíveis do banco de dados (peso, altura, limitações) e bloqueando o uso do app principal.

---

## Página 5: Nome da Dupla (Naming)

Define a marca central da relação do usuário com seu companheiro digital.

### Campos e Inputs
1. **Campo "Seu Nome" (Input de Texto)**
   - Recebe o nome de batismo do aluno.

### Botões e Interações
1. **Botão "Confirmar Nome" (CTA de Envio)**
   - **O que faz:** Valida que o campo não está vazio, monta a identidade da dupla e envia ao backend.
   - **Destino da informação:** O nome é persistido como a verdade soberana de identidade da dupla.
   - **Efeito cascata posterior:** 
     - **Arena:** O ranking passa a exibir o nome da dupla (`GUTO & Will`, `GUTO & Amanda`).
     - **Chat:** O GUTO passa a chamar o usuário pelo nome em todas as mensagens ("E aí, Will, pronto para aparecer hoje?").
     - **Painel do Coach:** O nome soberano é exibido nos relatórios de progresso do treinador. Sobrescreve e impede que e-mails de cadastro ou sugestões automáticas do convite roubem a identidade escolhida pelo aluno.

---

## Página 6: Calibragem Inicial (Corpo, Treino, NÃO COMO e Localização)

A calibragem é a principal fundação de dados que molda o comportamento lógico, físico e dietético do ecossistema.

```txt
   [ Entrada da Calibragem ]
   ├── Sexo biológico, Idade, Peso, Altura ─> Dieta (Cálculo de calorias e macros)
   ├── Nível de Treino & Objetivo ─────────> Missão (Geração de intensidade e volume do treino)
   ├── Local de Treino ───────────────────> Missão & GUTO Online (Estrutura de aparelhos ou peso livre)
   ├── Dores e Limitações Físicas ────────> Missão & GUTO Online (Gera banimento de exercícios de alto impacto)
   ├── Restrições Alimentares ────────────> Dieta (Filtro e exclusão absoluta de alimentos intolerados)
   └── País e Cidade ─────────────────────> Dieta e Proatividade (Contexto alimentar regional e clima)
```

### Campos e Inputs
1. **Campo "Sexo Biológico"** (Feminino, Masculino)
2. **Campo "Idade"** (Número)
3. **Campos "Peso" e "Altura"** (Números decimais)
   - **Efeito cascata posterior:** O backend recebe esses dados e calcula a meta calórica e a proporção de macronutrientes do aluno. Se o peso é alterado futuramente nas configurações, a aba **Dieta** recalcula instantaneamente o plano de refeições correspondente.
4. **Campo "Nível de Treino"** (`beginner`, `returning`, `consistent`, `advanced`)
5. **Campo "Objetivo"** (consistência, hipertrofia, emagrecimento, etc.)
   - **Efeito cascata posterior:** Altera o volume de séries, repetições e a seleção de exercícios que aparecerão na aba **Missão**.
6. **Campo "Local Preferido de Treino"** (`gym`, `home`, `park`, `mixed`)
   - **Efeito cascata posterior:** Altera a biblioteca de movimentos. Se "home" for o escolhido, exercícios com halteres e máquinas são excluídos da aba **Missão** e substituídos por exercícios de peso corporal.
7. **Campo "Dores, Patologias ou Limitações"** (Input de texto livre ou tags)
   - **Efeito cascata posterior:** Se o usuário declara "dor no joelho", o backend ativa uma tag de segurança na conta. Exercícios de alto estresse patelar (como agachamento profundo sem suporte ou saltos) são removidos do catálogo de treinos gerados para a aba **Missão**. O GUTO Online herda esse estado e monitora queixas de dor articular em tempo real.
8. **Campo Único "NÃO COMO"** (Input de texto para restrições, intolerâncias, alergias e escolhas alimentares)
   - **Efeito cascata posterior:** Se o usuário seleciona ou escreve "intolerância a lactose", qualquer alimento derivado de leite com lactose é eliminado do plano calórico da aba **Dieta**. Se o usuário escrever frases livres que indiquem ausência de dor como "nessun dolore" (em italiano), o interpretador semântico do backend sabe ignorar isso, evitando registrar diagnósticos errados sobre a nutrição.
9. **Campos "País" e "Cidade"** (Dropdowns ou texto)
   - **Efeito cascata posterior:** Define a nacionalidade física do plano. Se o aluno mora na Itália (`country: "IT"`), mesmo usando o app em português, as sugestões nutricionais da aba **Dieta** usarão itens típicos do comércio italiano, e a **Proatividade** usará clima e eventos de Roma ou Milão.

### O Que Não É Campo Da Calibragem

- Idioma: escolhido antes do login/onboarding e alterável depois nas configurações.
- Nome da dupla: confirmado na tela de Naming.
- Telefone: proibido em `GutoMemory`, calibragem, settings do aluno e chat. Telefone pertence apenas a cadastro comercial/admin quando necessário.
- Histórico recente: nasce do uso real do app.
- Intolerância separada: não existe campo separado; tudo entra no campo único **NÃO COMO** (`foodRestrictions`).

### Botões e Interações
1. **Botão "Salvar Calibragem"**
   - **O que faz:** Consolida os dados controlados e persiste no backend como memória real do aluno.
   - **Destino da informação:** No app atual, a gravação acontece via `/guto/memory`. Qualquer endpoint futuro dedicado à calibragem precisa manter validação rígida por campo e nunca aceitar JSON cru.
   - **Efeito cascata posterior:** Chat, treino, dieta, GUTO Online, proatividade, arena e painel passam a ler a mesma memória.

---

## Página 7: O Pacto (Assinatura do Compromisso)

Ritualização da parceria e entrada oficial no app.

### Botões e Interações
1. **Botão de Toque Contínuo "Segurar para Assinar o Pacto" (Hold Button - 2 segundos)**
   - **O que faz:** O usuário deve pressionar e segurar o botão por 2s. Ao completar, a assinatura é registrada.
   - **Destino da informação:** O backend atualiza o estado operacional do aluno de `"pact"` para `"system"` (liberando as abas principais) e concede o **XP Inicial de Boas-Vindas**.
   - **Efeito cascata posterior:** 
     - **Buffer Emocional:** O XP inicial aparece acumulado na barra do avatar, no Percurso como XP do dia e nos rankings semanal/mensal/individual. No entanto, por ser simbólico, ele **não** conta como treino executado, não incrementa `validatedWorkouts` e não ativa dias consecutivos (streak).

---

## Página 8: Aba GUTO / Chat (A Central de Relação)

Interface ativa onde o usuário conversa, adapta treinos e tira dúvidas sob um contrato estruturado de turnos. No código atual, a aba é conversa real: histórico/contexto/input são a camada principal, e o avatar fica compacto como presença, não como vitrine grande.

### Campos e Inputs
1. **Campo "Escreva aqui..." (Input de Texto)**
   - Recebe a mensagem em linguagem natural do aluno.

### Botões e Interações
1. **Botão "Enviar" (Icone de seta)**
   - **O que faz:** Envia a mensagem em um POST para `/guto`.
   - **Destino da informação:** O backend analisa a mensagem cruzando com memória, histórico recente e contexto ativo da aba; devolve o contrato JSON estruturado contendo a fala (`speech`/`fala`), emoção do avatar (`avatarEmotion`), correções de memória (`memoryPatch`), planos de exercícios (`workoutPlan`) e botões sugeridos (`expectedResponse`).
   - **Efeito cascata posterior:** 
     - Se o usuário avisar: "Viajo amanhã", o GUTO inicia o ciclo de **Proatividade**, monta a pergunta/cartão de confirmação no chat e, após o aceite ou ajuste, altera o comportamento do treino dos próximos dias. Enquanto estiver incerto, a decisão fica pendente; impacto definitivo só nasce com dado crítico suficiente.
     - Se o usuário relatar: "Senti uma fisgada no ombro", o backend altera o `lastWorkoutPlan`, removendo exercícios de ombro da aba **Missão** nas próximas 48 horas.
2. **Botões Rápidos de Resposta (Sugeridos na bolha)**
   - **O que faz:** Toques diretos em opções de texto geradas pelo contrato de turno (ex: "Mudar treino para academia", "Sim, confirmo"). Economizam digitação do usuário e guiam o modelo de IA com exatidão semântica.

---

## Página 9: Aba Missão (Treino do Dia)

Exibe o painel de treino gerado pelo backend e permite o acesso ao GUTO Online ou a consultas de dúvidas.

### Botões e Interações
1. **Botão "?" (Ajuda do Exercício)**
   - **O que faz:** Ao tocar no ponto de interrogação de qualquer card de exercício, a interface muda de forma automática para a aba Chat.
   - **Onde chega a informação:** Envia um evento com o ID do exercício ao Chat. O Chat já abre com o contexto "Explicar execução do Exercício X" engajado. O GUTO responde imediatamente detalhando técnicas e posturas daquele movimento específico, evitando saudações genéricas repetitivas.
2. **Botão "Iniciar Treino com o GUTO" (CTA Inferior)**
   - **O que faz:** Dispara a abertura em overlay em tela cheia da sessão em tempo real do **GUTO Online**.

---

## Página 10: Aba Dieta (Menu Semanal)

Visualização das refeições prescritas, balanceamento e orientações.

### Botões e Interações
1. **Botão "Opções de Substituição"**
   - **O que faz:** Permite que o usuário peça alternativas saudáveis para um prato específico do cardápio.
   - **Destino da informação:** Consulta o motor de dieta do backend respeitando as intolerâncias e restrições calibradas do usuário. Alimentos proibidos pela calibragem inicial estão fisicamente travados contra substituições.
   - **Regra de país/idioma:** O idioma define o texto; país e cidade definem alimento. Um usuário morando na Itália com app em português deve ver instruções em português, mas alimentos coerentes com o mercado italiano.
   - **Regra matemática:** As refeições precisam bater com os macros e calorias definidos pelo backend. Se a soma do cardápio não fecha, a dieta não pode ser marcada como pronta.
   - **Persistência:** O frontend não inventa dieta. Ele lê plano persistido pelo backend ou informa que a dieta precisa ser gerada/revisada.

---

## Página 11: GUTO Online (Sessão Assistida em Tempo Real)

A tela onde o GUTO se torna uma presença viva ao lado do usuário durante o esforço físico.

### Botões e Interações
1. **Botão de Pausa (Visual na Interface)**
   - **O que faz:** Interrompe a contagem do temporizador de descanso ou execução da série.
2. **Botão "Estou com Dor articular" (Alerta de Segurança)**
   - **O que faz:** Pausa imediatamente o fluxo, ativa uma interrupção segura e faz o GUTO Online perguntar qual articulação dói. 
   - **Efeito cascata posterior:** O sistema se recusa a continuar o exercício doloroso, adaptando o movimento no mesmo instante ou recomendando encerrar a sessão física se houver risco à saúde.
3. **Botões de Comando Touch-First (Próximo, Anterior, Concluir Série)**
   - **O que faz:** Avançam as séries e fases da máquina de estados do treino (Briefing -> Warmup -> Exercícios -> Descanso -> Conclusão).
   - **Efeito cascata posterior:** Impedem que erros comuns de microfone, ruídos de fundo ou falhas de captação de voz encerrem ou saltem etapas do treino do aluno sem a confirmação de segurança pela tela.
4. **Logica de Resiliência de Fechamento (Retomada)**
   - Se o usuário fecha o app ou atende uma chamada:
     - **Fechou há < 15 min:** Abre diretamente no GUTO Online, na mesma fase de série e exercício que parou.
     - **Fechou de 15 min a 12 horas:** Exibe popup de escolha: "Retomar treino de onde parou ou Reiniciar?".
     - **Fechou há > 12 horas:** Descarta a sessão incompleta e limpa o dia para novos treinos.

---

## Página 12: Validação de Treino (Provas, XP e Streak)

O portão de prestação de contas que consolida os resultados da sessão.

### Campos e Inputs
1. **Câmera/Foto de Validação (Upload de Mídia)**
   - Recebe a captura fotográfica do usuário comprovando que esteve no local de treino. **A prova por foto/selfie é parte do contrato de presença** — no backend atual, sem prova a rota retorna `SELFIE_REQUIRED` e não credita XP/Arena.
2. **Campo "Frase de Confirmação" (Input de Texto)**
   - Recebe a confirmação de presença.

### Botões e Interações
1. **Botão "VALIDAR TREINO"**
   - **O que faz:** Envia a foto e os metadados da sessão concluída ao backend.
   - **Destino da informação:** O backend valida a existência da missão correspondente ao dia atual no `lastWorkoutPlan`. Confirmado o treino, atualiza o histórico físico do usuário.
   - **Efeito cascata posterior:** 
     - **XP creditado:** Concede a pontuação exata de consistência do dia.
     - **Streak incrementado:** Soma mais um dia seguido de treino na sequência do aluno.
     - **Sincronia Total:** Distribui a pontuação idêntica para a **Arena** (atualizando o ranking), para o **Percurso** (inserindo uma marca na linha do tempo) e para o **Evoluir** (calculando o progresso de evolução do avatar entre Baby, Teen, Adult ou Elite).

---

## Página 13: Aba Arena (Ranking de Presença)

Exibe a posição de consistência da dupla perante as demais duplas ativas do ecossistema.

### Botões e Interações
1. **Filtros de Período (Semanal, Mensal, Global)**
   - **O que faz:** Altera o agrupamento e visualização das pontuações acumuladas das duplas.
   - **Efeito cascata posterior:** Utiliza os dados de XP do backend. Todo XP ganho entra em Semanal, Mensal e Global/Individual; o que não for treino real, como o pacto, não vira `validatedWorkouts` nem streak. A identidade exibida no ranking é sempre a dupla (`GUTO & Nome do Aluno`). Impedido de exibir dados inconsistentes em relação ao XP individual do aluno.
   - **Arena Semanal e Mensal:** Escopadas por empresa/time (`teamId`). O aluno vê a Arena da própria empresa; o coach também vê a Arena da empresa, não uma arena só dos seus alunos.
   - **Arena Geral:** Global, com todas as duplas do app. Ao lado da dupla, precisa aparecer o nome da empresa/time para contextualizar a origem.
   - **Super Admin:** Pode visualizar todas as Arenas e auditar recortes por empresa.

---

## Página 14: Aba Evoluir (Avatar e Engajamento)

Exibe o progresso estético e biológico do companheiro digital. No código atual, esta aba é a **Casa do GUTO**: avatar grande oficial renderizado por código, estágio atual, XP acumulado, progresso até a próxima evolução e vínculo emocional da dupla.

### Botões e Interações
1. **Visores de Atributos e XP do Avatar**
   - **O que faz:** Demonstra o estágio atual do GUTO (`Baby`, `Teen`, `Adult`, `Elite`) e o percentual para atingir o próximo nível. Os thresholds atuais são `0`, `1500`, `5000` e `12000` XP.
   - **Efeito cascata posterior:** Se o aluno valida treinos, o avatar ganha animações e força visual. Se o aluno some por muitos dias consecutivos, o avatar perde brilho e expressa enfraquecimento da relação, gerando um gatilho emocional saudável focado em retenção.

---

## Página 15: Aba Percurso (Visual de Consistência)

O diário histórico visual que preserva os registros da jornada. No código atual, é um calendário mensal vivo com eventos do dia, não apenas uma lista de fotos antigas.

### Botões e Interações
1. **Calendário Mensal / Dia Selecionado**
   - **O que faz:** Exibe mês, status diário e eventos como treino concluído, treino adaptado, dia protegido, viagem, dor, compromisso, decisão pendente e XP.
   - **Destino da informação:** Carrega validações, `completedWorkoutDates`, missões adaptadas/perdidas, memórias proativas, impactos proativos e `xpEvents`. Fornece ao usuário a sensação visual e palpável de "Eu apareci e construí uma história junto com o GUTO".

---

## Página 16: Painel Admin e Coach (A Retaguarda B2B2C)

A central desktop voltada para o gerenciamento de alunos, times e planejamento de treinos/dietas.

Hierarquia obrigatória:

```txt
Super Admin
└── Empresas / Teams
    └── Coaches
        └── Alunos
```

Empresa/time é a unidade comercial principal. Toda empresa possui plano, limites de coaches, limites de alunos, responsáveis comerciais e status de acesso. Todo coach pertence a uma empresa. Todo aluno pertence a uma empresa e a um coach. Alunos vendidos direto pela internet entram em uma Team interna do GUTO, com nome a definir.

### Campos e Inputs
1. **Campos de Cadastro de Empresa** (nome, plano, responsável, e-mail do responsável, telefone do responsável, país, cidade e limites customizados quando aplicável)
   - Telefone aqui é permitido por ser dado comercial/admin, não memória do aluno.
2. **Campos de Cadastro de Coach** (nome, e-mail, empresa/time, status)
3. **Campos de Cadastro de Aluno** (nome, e-mail, empresa/time, coach, status de convite/acesso)
   - Aluno não pode existir sem `teamId` e `coachId`.
4. **Painel de Prescrição Nutricional** (Editores de Calorias, Proteínas, Carboidratos, Gorduras e Cardápio)
5. **Painel de Planejamento de Exercícios** (Prescritor de séries, cargas, repetições, restrição de aparelhos)

### Botões e Interações
1. **Botão "Gerar Link de Convite"**
   - **O que faz:** Cria um token temporário e gera a rota de onboarding para o aluno (`/convite/[token]`).
2. **Botão "Bloquear Treino Manual (Override)"**
   - **O que faz:** Sobrescreve a inteligência geradora padrão de treinos do GUTO, travando o treino selecionado pelo Coach como a missão do dia oficial. Altera o `lastWorkoutPlan` no celular do aluno na mesma hora.
3. **Botão "Bloquear Dieta Manual (Override)"**
   - **O que faz:** Trava a dieta desenhada pelo Coach com `lockedByCoach: true`. O GUTO não pode sobrescrever automaticamente, apenas sinalizar mudanças de calibragem que exigem revisão.
4. **Botão "Pausar/Arquivar Aluno"**
   - **O que faz:** Atualiza o status de acesso do aluno no banco de dados para `paused` ou `expired`.
   - **Efeito cascata posterior:** Se o aluno tentar abrir o aplicativo ou estiver com ele aberto, o interceptor de requisições detecta o bloqueio e trava a interface na tela `/acesso-pausado` no idioma escolhido pelo aluno.
5. **Indicador Visual de Risco de Abandono (Alerta de Inatividade)**
   - **O que faz:** Destaca alunos com longos períodos sem validação de treinos ou sem conversar no Chat. Fornece ao Coach a métrica ativa para suporte direto de retenção de clientes.
6. **Travamento de Segurança (XP e Streak)**
   - **Não editável:** O painel do Coach não possui botões ou campos para editar manualmente o XP, Streak ou nível do avatar do aluno. Isso preserva o mérito real e a integridade da progressão esportiva no ecossistema do GUTO.

### Travas Soberanas Do Painel

- Não criar empresa sem plano/limite.
- Não criar coach fora de empresa.
- Não criar aluno sem empresa e coach.
- Não editar `GutoMemory` como JSON cru.
- Não gravar dieta com alimento proibido pelo campo **NÃO COMO**.
- Não sobrescrever treino/dieta travados por coach sem liberação.
- Não editar XP, streak ou avatar manualmente.
- Não carregar todos os alunos no frontend para calcular métrica global; o backend deve entregar agregados e listas paginadas.

---

## Pontos de Atenção (doc × código atual)

> Esta seção lista onde a **referência-alvo descrita acima** ainda diverge do **código atual** (`guto-app-v0` + `guto-backend`). É sinalização, não correção de código. A intenção dos documentos é separar estado operacional, parcial e futuro com clareza.
>
> Itens marcados **[decisão]** dependem de confirmação do fundador sobre "o que é o certo". Itens **[implementar]** já têm o alvo claro no doc — falta o código alcançar.

| # | Tema | Doc (alvo) | Código atual | Tipo |
|---|---|---|---|---|
| A-1 | **Foto/selfie na validação** (Pág. 12) | **Obrigatória sempre** — sem foto não valida e não dá XP/streak (decisão do fundador) | Backend exige `imageBase64`; sem foto retorna `SELFIE_REQUIRED` | ✅ alinhado |
| A-2 | **FUTURO - Morte do GUTO** (Pág. 14) | Estado terminal `gutoLifeStatus:"dead"`, `accessLocked`, guard 403, blackout | Backend não emite `GUTO_DECEASED` nem trava rotas por morte; não é comportamento operacional atual | **FUTURO** |
| A-3 | **Códigos de acesso** (Pág. 3/16) | `ACCESS_PAUSED`, `SUBSCRIPTION_EXPIRED`, `GUTO_DECEASED` distintos | Backend emite só `ACCESS_PAUSED`/`SUBSCRIPTION_EXPIRED`; `GUTO_DECEASED` pertence ao módulo futuro de morte | **FUTURO** |
| A-4 | **Painel = rota única** (Pág. 16) | Painel operacional em `/coach` (role-aware); `/admin` e `/empresa` redirecionam | Já implementado assim no código | ✅ alinhado |
| A-5 | **Risco de abandono** (Pág. 16) | **Verde ≤48h · Atenção 3–5d · Crítico ≥6d** (decisão do fundador) | Código usa Atenção 3–5d / Crítico ≥6d | ✅ alinhado |
| A-6 | **Vídeo de exercício** (Pág. 9) | **Catálogo oficial ≤15s; custom do coach ≤30s** (ambos sem áudio, caminho interno) | Catálogo ok; validação custom aceita ≤30s | ✅ alinhado (dois limites oficiais) |

> **Decisões já fechadas com o fundador** (propagadas para `TREINO`, `EVOLUCAO_XP`, `PAINEL_CANONICO`): selfie **obrigatória** na validação; risco **Atenção 3–5d / Crítico ≥6d**; vídeo **catálogo ≤15s / custom ≤30s**.
