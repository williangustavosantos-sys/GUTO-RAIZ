> # ⚠️ DOCUMENTO DE APOIO (TELAS/FLUXO) — CANÔNICO É O V1
> A **fonte canônica única** do painel é **`GUTO_PAINEL_ADMIN_CANONICO_V1.md`**. Este arquivo permanece como **referência de telas/fluxo** (visão alvo detalhada por tela). Onde divergir do V1, **o V1 vence**.

# GUTO — Painel ADM & Coach (Referência de Telas/Fluxo — apoio)

> **Status:** Documento de **apoio** — especificação de telas e fluxo do painel. **Canônico = `GUTO_PAINEL_ADMIN_CANONICO_V1.md`.**  
> **Versão:** 1.0 (Consolidação Detalhada do Painel)  
> **Data:** 2026-05-27  
> **Objetivo:** Estabelecer o fluxo de telas, permissões, campos, regras de negócio e integrações técnicas do Painel Administrativo do GUTO para permitir a implementação impecável e o teste ponta a ponta (end-to-end) do ecossistema.

---

## 1. Princípios Fundamentais e Arquitetura de Integração

O Painel Administrativo do GUTO não é apenas uma tela de suporte; ele é o **Sistema Operacional B2B** da plataforma. Ele permite que academias, empresas parceiras e treinadores gerenciem o ciclo de vida dos alunos enquanto o aplicativo móvel atua como o templo emocional.

### 1.1 O Princípio da Tradução Emocional (Guto Talk)
O painel **nunca** transforma o GUTO em um chatbot genérico ou um robô administrativo. 
- Quando o Coach realiza uma alteração de treino ou dieta no painel, o aplicativo móvel **não** mostra avisos frios como *"Seu administrador atualizou seu registro de treino"*.
- O GUTO absorve as alterações no backend e as apresenta no Chat do celular com a sua própria personalidade de "companheiro ativo digital", baseado na `GutoMemory` do aluno:
  > *"E aí, [Nome]! O teu treinador deu uma mexida na nossa estrutura de treino para hoje para focar na consistência. Ajustei os pesos e coloquei 4 séries limpas de 10 reps no supino. Eu te guio, vamos fazer bem feito hoje!"*

### 1.2 Regra de Ouro: Isolamento de Dados (Team Isolation)
A segurança de dados B2B2C é absoluta e garantida em tempo de execução no backend.
- Cada tabela e registro sensível (peso, fotos, e-mails, limitações clínicas) herda a tag `teamId` (Empresa) e, quando aplicável, `coachId` (Coach).
- Um Coach do Time Alfa está tecnicamente impedido de ler ou alterar registros de alunos do Time Beta. Qualquer requisição adulterada retorna erro **403 Forbidden** (`TEAM_ACCESS_FORBIDDEN` ou `COACH_STUDENT_ACCESS_FORBIDDEN`).
- O isolamento é coberto por testes contínuos automatizados no backend (`guto-backend/tests/guto-team-isolation.test.ts`).

---

## 2. Página de Login Única e Unificada (A Porta de Entrada)

A página de login do painel administrativo (`/admin/login`) é o ponto crítico onde a identidade e o escopo de navegação do usuário são determinados.

### 2.1 O Seletor de 3 Idiomas
- **Opções disponíveis:** Português (PT), Inglês (EN) e Italiano (IT).
- **Comportamento:** O seletor de idiomas fica posicionado de forma fixa e visível no canto superior direito da tela de login.
- **Persistência:** Ao selecionar o idioma, ele é gravado imediatamente em `localStorage["guto-selected-language"]`. Toda a interface de login, campos, placeholders e mensagens de erro ("E-mail ou senha inválidos", "Acesso restrito", etc.) são traduzidos instantaneamente na UI, sem recarregar a página.

### 2.2 Escolha Visual do Papel (Role Selector)
Antes de digitar as credenciais, a tela de login exibe três cápsulas visuais interativas e iluminadas (cards de seleção rápida) correspondentes aos papéis permitidos no painel:
1. **Super Admin** (Controle Global da Plataforma)
2. **Empresa** (Administrador do Time/Academia)
3. **Coach / Personal** (Treinador Operacional)

*Nota de Segurança:* Alunos (`student`) estão fisicamente bloqueados contra login no painel. Se uma conta estudantil tentar fazer login em qualquer um dos papéis administrativos, o backend retorna **403 Forbidden** (`ADMIN_ACCESS_FORBIDDEN`) e o login é negado.

### 2.3 Fluxo de Autenticação Técnica
1. O usuário seleciona o idioma, escolhe o papel visual, insere E-mail (ou ID) e Senha, e clica em **"ENTRAR"**.
2. O frontend faz um POST para `/auth/admin/login` ou `/auth/coach/login`.
3. O backend valida a hash da senha usando `bcrypt` (salt mínimo 10) e verifica se o papel selecionado corresponde ao papel salvo na tabela `UserAccess`.
4. Em caso de sucesso, o backend retorna um token JWT assinado contendo:
   - `userId`, `role`, `teamId`, `coachId`, `name`, `email`.
5. O frontend salva o token em `localStorage["guto-auth-token"]` e o redireciona automaticamente para o painel correspondente ao seu nível:
   - `super_admin` $\rightarrow$ Redireciona para `/admin` (Sala de Controle do Super Admin)
   - `admin` $\rightarrow$ Redireciona para `/empresa` (Dashboard da Empresa/Time)
   - `coach` $\rightarrow$ Redireciona para `/coach` (Cockpit do Coach)

---

## 3. Fluxo e Telas do Super Admin (`super_admin`)

O Super Admin possui controle total e global da plataforma. Ele monitora a saúde financeira e operacional de todas as empresas e gerencia os limites de uso.

### 3.1 Tela Principal (Sala de Controle do Super Admin)
A tela principal do Super Admin é orientada a **Empresas/Teams Primeiro**, em vez de exibir uma lista gigante e confusa de alunos de todas as marcas.

#### A. Cabeçalho e Barra Superior
- Seletor rápido de Idioma de interface (PT/EN/IT).
- Informações do perfil logado com botão de logout.
- **Barra de Busca Global:** Input com inteligência server-side que localiza empresas, coaches ou alunos em qualquer lugar do banco de dados, sem remover o contexto.
  - Exemplo de resultado da busca por aluno: `Will Santos | Aluno · Academia Action Fit · Coach Bruno`
  - Ao clicar no aluno, ele abre o detalhe daquele aluno dentro da hierarquia da sua empresa correspondente.

#### B. KPIs Globais de Telemetria (Cards Superiores)
1. **Total de Empresas:** Contagem de todas as `Teams` cadastradas.
2. **Empresas Ativas:** Quantidade de empresas com status comercial regularizado.
3. **Coaches Ativos:** Contagem acumulada de todos os coaches de todas as empresas.
4. **Alunos Ativos:** Contagem total de alunos ativos no app móvel.
5. **Alunos em Atenção:** Alunos sem validação física ou interação no chat de **3 a 5 dias** (risco inicial de evasão).
6. **Alunos Críticos:** Alunos sem sinal de vida há **6 ou mais dias** (alto risco de abandono).
7. **Pendências Operacionais:** Solicitações de exercícios customizados aguardando aprovação ou revisões urgentes.

#### C. Tabela Principal: Gestão de Empresas (Teams)
Exibe a lista paginada de todas as empresas clientes do GUTO, contendo as colunas:
- **Nome da Empresa / Team:** Exibe a marca comercial (ex: *Action Fit*, *Studio Vértice*).
- **Status Comercial:** `Ativa`, `Pausada`, `Inadimplente`, `Limite Cheio`.
- **Plano Contratado:** `Start`, `Pro`, `Elite` ou `Custom`.
- **Coaches (Uso / Limite):** Exemplo: `3 / 4` (mostra alerta visual em amarelo se estiver perto do limite, ou vermelho se atingiu).
- **Alunos (Uso / Limite):** Exemplo: `42 / 50`.
- **Risco Operacional:** Quantidade de alunos em estado de *Atenção* ou *Crítico* (ex: `5 Atenção / 2 Críticos`).
- **Última Atividade:** Timestamp da última ação de qualquer usuário do time.
- **Ações:** Botão para abrir o **Detalhe da Empresa** ou **Editar Plano/Limites**.

#### D. Ação: Criar Nova Empresa (`+ Nova Empresa`)
Um botão no topo da tabela abre o formulário de cadastro real (que faz um POST para `/admin/teams`), exigindo os seguintes campos:
- Nome Comercial da Empresa (Team Name)
- Identificador Único (`teamId` - slug gerado automaticamente para rotas, ex: `action-fit`)
- Responsável Comercial (Nome Completo)
- E-mail do Responsável (para faturamento e primeiro acesso de `admin`)
- Telefone de Contato Comercial (Nota: este telefone é para contato B2B e **nunca** entra na memória e-onboarding do aluno)
- Seleção de Plano: `Start`, `Pro`, `Elite` ou `Custom`
- Se o plano for `Custom`, o Super Admin deve definir manualmente as capacidades:
  - Limite Máximo de Coaches (`maxCoaches`)
  - Limite Máximo de Alunos (`maxStudents`)
- Idioma Inicial de faturamento (PT/EN/IT)

---

### 3.2 Detalhe da Empresa (Team Detail)
Ao clicar em uma empresa na tabela, o Super Admin (ou o Admin da própria empresa) abre a visualização exclusiva de governança daquela organização.

#### A. Visão Geral e Faturamento
- Resumo de dados de contato do responsável, plano ativo e status de faturamento.
- Visualização de uso de limites comerciais. Exemplo:
  - *Coaches:* [||||||||||      ] 3 de 5 vagas preenchidas.
  - *Alunos:*  [||||||||||||||||] 50 de 50 vagas preenchidas (Bloqueado para novas adições).
- Botão rápido para **Upgrade de Plano** ou liberação manual de cota customizada.

#### B. Aba: Coaches do Time
Exibe a lista de todos os profissionais de educação física cadastrados naquela empresa.
- **Colunas:** Nome, E-mail, Quantidade de Alunos Vinculados, Último Login e Logs de Alterações feitos por ele.
- **Ações:** 
  - Botão `+ Adicionar Coach`: Cadastra um novo coach na empresa (POST `/admin/coaches`). Bloqueado se a empresa atingir o limite de coaches do plano.
  - Desvincular Coach ou Desativar Acesso.

#### C. Aba: Alunos do Time
Lista paginada de todos os alunos pertencentes àquela empresa, podendo ser filtrada ou agrupada por Coach responsável.
- **Colunas:** Nome do Aluno, E-mail, Telefone de Contato, Coach Vinculado, Status de Onboarding, Risco de Abandono (Verde/Amarelo/Vermelho), Streak atual e XP total.
- **Ações:**
  - Botão `+ Adicionar Aluno`: Cadastra um novo aluno (POST `/admin/students`). Bloqueado se a empresa atingir o limite de alunos do plano.
  - Transferir Aluno de Coach (troca o `coachId` do aluno para outro treinador cadastrado no mesmo `teamId`).

#### D. Aba: Arena da Empresa
Mostra os rankings internos de competição daquela empresa específica:
- **Arena Semanal da Empresa:** Placar de XP dos alunos da empresa acumulado na semana atual.
- **Arena Mensal da Empresa:** Placar de XP acumulado no mês atual.
- *Nota:* O Super Admin e o Admin da Empresa conseguem ver esse placar para fins de motivação comercial e relatórios de engajamento.

#### E. Aba: Logs de Auditoria do Time
Exibe o histórico de todas as ações executadas dentro daquela empresa para fins de conformidade e segurança:
- Exemplo: *“Coach Bruno atualizou o treino do Aluno Will Santos às 14h30 (Log: `workout_edited`).”*

---

### 3.3 Detalhe do Coach (Coach Profile)
Ao clicar em um coach, a interface exibe a carteira operacional daquele treinador físico.

- **KPIs da Carteira do Coach:**
  - Total de Alunos Vinculados.
  - Alunos em Risco (Atividade em Amarelo/Vermelho na carteira dele).
  - Quantidade de Treinos Bloqueados (`lockedByCoach`).
- **Lista de Alunos Vinculados:** Tabela compacta com as informações biológicas rápidas de cada aluno de sua carteira, para acompanhamento direto.
- **Fila de Dieta / Fila de Treino:** Lista de alunos que estão completando ciclos de treino/dieta adaptativa do GUTO e que necessitam de revisão manual ou ajuste de planejamento.

---

### 3.4 Detalhe do Aluno (Student Full File - O Dossiê)
Esta é a tela de controle individual mais importante da plataforma. Ela é acessada ao clicar em qualquer aluno na lista. Ela é estruturada de forma rígida em **7 Abas Operacionais**, garantindo que nenhum dado sensível seja exposto de forma incorreta ou alterado sem as devidas validações.

```
+-----------------------------------------------------------------------------------------+
| Aluno: Will Santos | Empresa: Action Fit | Coach: Bruno                                 |
+-----------------------------------------------------------------------------------------+
| [A. Resumo]  [B. Calibragem]  [C. Treino]  [D. Dieta]  [E. Arena]  [F. Histórico]  [G. Acesso] |
+-----------------------------------------------------------------------------------------+
```

#### A. Aba Resumo (Métricas de Engajamento)
Esta aba dá ao treinador um diagnóstico rápido da constância e do engajamento do aluno com o GUTO.
- **Estágio do Avatar:** `Baby`, `Teen`, `Adult` ou `Elite` (calculado dinamicamente com base no total de XP via `getAvatarStage(totalXp)`).
- **Streak Atual:** Quantidade de dias consecutivos que o aluno cumpriu suas metas físicas ( Streak é imutável manualmente!).
- **Total de XP:** Saldo acumulado do aluno no jogo físico ( XP é imutável manualmente!).
- **Data do Último Treino Validado:** Timestamp de quando o aluno enviou a última foto/prova de treino no app.
- **Sinalizador de Risco de Abandono (Risk Classifier):**
  - **Verde (Risco Baixo):** Treinou ou mandou mensagem no chat nas últimas 48 horas.
  - **Amarelo (Atenção):** Sem validações físicas ou interação no chat de **3 a 5 dias**. Requer acompanhamento rápido do coach.
  - **Vermelho (Crítico):** **6 ou mais dias** sem sinal de vida. O sistema gera um alerta visual destacado para que o treinador faça contato direto e evite o cancelamento da assinatura.

#### B. Aba Calibragem (Ficha Biológica e Onboarding)
Exibe a ficha completa do aluno preenchida por ele na calibragem inicial do app móvel.

- **Visualização de Status de Onboarding (Derivado da GutoMemory):**
  - Mostra o progresso de configuração do aluno em formato de Badges claros:
    - `Convite Pendente` (Criado no painel, mas não fez o primeiro acesso no celular).
    - `Sem Consentimento` (Falta aceitar os termos de uso e consentimento de saúde).
    - `Calibragem Pendente` (Aceitou termos, mas não concluiu o questionário físico).
    - `Pacto Pendente` (Falta assinar o pacto de consistência mútua no app).
    - `Ativo Completo` (Pronto para operar no app principal).
- **Campos Biológicos e Clínicos Exibidos:**
  - Idade (userAge) / Tempo de Treino (trainingAge)
  - Sexo Biológico (biologicalSex)
  - Altura em cm (heightCm) e Peso em kg (weightKg)
  - Objetivo de Treino (trainingGoal - ex: *Hipertrofia*, *Emagrecimento*)
  - Nível de Treino Atual (trainingLevel / trainingStatus - ex: *Iniciante*, *Avançado*)
  - Local Preferido de Treino (preferredTrainingLocation - ex: *Academia*, *Casa*)
  - País (country) e Cidade (city)
  - Patologias, dores ou limitações (trainingPathology / trainingLimitations - ex: *Condromalácia Patelar*, *Hérnia de Disco*)
  - Campo Soberano Nutricional **"NÃO COMO"** (foodRestrictions - restrições alimentares graves do aluno).
- **Regras de Edição da Calibragem:**
  - O painel **nunca** edita a calibragem como JSON cru. A edição flui por campos controlados através de uma requisição estruturada `PATCH /admin/students/:userId` enviando o objeto `calibration`.
  - Mudar dados sensíveis da calibragem gera invalidação em cascata:
    - Se mudar peso, altura, sexo ou objetivo $\rightarrow$ **Invalida a Dieta** atual (sistema exige recálculo automático de calorias e macros).
    - Se mudar nível, objetivo, local ou patologias $\rightarrow$ **Invalida o Treino** atual (sistema exige geração de novas séries adaptativas).
  - O Nome Soberano do Aluno (confirmado por ele na etapa de Naming do app) é **soberano** e não pode ser alterado ou sobrescrito pelo painel administrativo para preservar a integridade emocional do app.

#### C. Aba Treino (Editor de Exercícios)
Mostra o treino ativo do aluno e fornece ferramentas de controle manual.
- **Visualização do Planejamento:** Exibe a grade de treinos semanais gerados pelo GUTO com base na calibragem.
- **Geração por IA:** Botão `Gerar com GUTO` reconstrói o treino usando as inteligências adaptativas de `workout-curator.ts`.
- **Edição Manual (Manual Override):** O Coach pode clicar em qualquer exercício, substituí-lo, alterar o número de séries, repetições, carga sugerida ou tempo de descanso.
- **Mecanismo Coach Lock (`lockedByCoach`):**
  - Ao salvar uma alteração manual do coach, o backend marca `lockedByCoach = true` para aquele plano de treino.
  - Quando esta flag está ativa, o GUTO móvel no celular passará a exibir e guiar estritamente este treino manual editado pelo treinador, e a IA do GUTO fica **impedida** de sobrescrever o treino automaticamente de forma adaptativa.
- **Validação de Vídeos de Exercícios:** O painel impede que o Coach cadastre um exercício customizado ou altere o treino para algo que não possua um endereço de vídeo explicativo válido (`videoUrl`). Um exercício sem vídeo não pode chegar ao app do aluno para evitar que ele treine de forma incorreta e se lesione.

#### D. Aba Dieta (Menu Nutricional)
Permite ao treinador físico ou nutricionista do time prescrever e acompanhar a alimentação diária do aluno.
- **Visualização Nutricional:** Exibe a contagem diária de calorias sugerida, as porções e a divisão de macronutrientes (Proteínas, Carboidratos e Gorduras) calculada em `nutrition.ts`.
- **Validação Contra o Campo Soberano "NÃO COMO":**
  - O editor de dietas do painel **barra automaticamente** qualquer tentativa de o Coach inserir ou salvar alimentos que contenham ingredientes presentes no campo `foodRestrictions` (NÃO COMO) preenchido pelo aluno.
  - Exemplo: Se o aluno inseriu *"Alergia grave a amendoim"* na calibragem do celular, o painel exibe um alerta de bloqueio e não permite que o Coach adicione receitas com amendoim no planejamento semanal dele.
- **Coach Lock de Dieta:** Assim como no treino, salvar alterações de dieta ativa a trava `lockedByCoach = true`, impedindo a IA do GUTO de adaptar a nutrição sem autorização do profissional.

#### E. Aba Arena (Resumo Individual)
Mostra o desempenho competitivo do aluno dentro do jogo do GUTO.
- Posição e pontuação do aluno no ranking semanal e mensal interno de sua empresa.
- Posição dele no ranking geral global (Arena Geral), mostrando sua dupla ao lado do nome de sua empresa correspondente.
- Histórico de XP acumulado por ciclo de premiação.

#### F. Aba Histórico (Linha do Tempo de Evidências)
É o diário de bordo do esforço físico do aluno. Esta aba é usada para o Coach validar se o aluno realmente está cumprindo o planejado.
- **Fotos de Validação:** Galeria das fotos tiradas pelo aluno com a câmera do app para comprovar a execução do treino.
- **Notas Pós-Treino:** Relatórios de sensação de esforço enviados pelo aluno (ex: *"Foi fácil"*, *"Senti dores no joelho direito durante o agachamento"*).
- **Feed de Mensagens e Registro de Atividades:** Lista cronológica de interações e recebimento de XP de mérito.

#### G. Aba Acesso (Controle de Status e Assinatura)
Gerenciamento de segurança, identidade e faturamento do aluno.
- **Ações Administrativas Disponíveis (Exclusivas de `admin` e `super_admin`):**
  - **Pausar Aluno:** Faz um POST para `/admin/students/:userId/pause`. Altera o status comercial para `paused`. Na mesma hora, o interceptor de requisições de API no celular do aluno detecta o status bloqueado e redireciona a interface móvel para a tela `/acesso-pausado` no idioma correto (PT/EN/IT).
  - **Reativar Acesso:** POST para `/admin/students/:userId/reactivate`. Libera o acesso instantâneo ao aplicativo.
  - **Renovar Acesso:** POST para `/admin/students/:userId/renew`. Adiciona duração de acesso (padrão de +30 dias de ciclo de presença).
  - **Resetar Senha:** POST para `/admin/students/:userId/reset-password`. Permite gerar uma nova credencial provisória caso o aluno perca o acesso.
  - **Resetar Dados (Progresso):** POST para `/admin/students/:userId/reset` (com escopos: `weekly`, `monthly`, `individual`, `validationHistory` ou `all`). Reseta o percurso do aluno para recomeço de treino.
  - **Remover Aluno:** Faz um DELETE para `/admin/students/:userId`. Executa o soft-delete (arquivamento). O hard-delete físico de remoção de dados de todo o sistema é exclusivo do Super Admin via rota dedicada de segurança para conformidade da LGPD.

---

## 4. Fluxo e Telas da Empresa (`admin` / Empresa Portal)

O papel `admin` é atribuído ao gerente comercial, dono da academia ou líder corporativo que contratou o GUTO para sua equipe. Ele opera com as mesmas telas do Super Admin, porém com **restrição rígida ao seu próprio `teamId`**.

### 4.1 Login e Entrada da Empresa
1. O administrador da empresa acessa a URL de login.
2. Seleciona o idioma de preferência.
3. Escolhe o papel **Empresa**.
4. Insere suas credenciais de acesso B2B.
5. O backend autentica e redireciona imediatamente para a rota `/empresa`.

### 4.2 Dashboard Exclusivo da Empresa (`/empresa`)
Diferente do Super Admin, o Administrador de Empresa não vê a lista de outras empresas parceiras. Sua Home exibe apenas as informações operacionais da sua própria unidade:

#### A. KPIs da Empresa
- **Coaches Ativos na Unidade:** Contagem de profissionais contratados.
- **Alunos Ativos:** Alunos que estão treinando na sua unidade.
- **Risco de Abandono da Academia:** Quantidade de alunos da sua academia que estão com sinalizador em amarelo (Atenção) ou vermelho (Crítico).
- **Utilização de Vagas do Plano:** Exibição clara do limite contratado. Exemplo: *"Plano Pro Contratado: 3 de 4 coaches ativos / 45 de 50 alunos ativos."*

#### B. Gestão de Pessoal da Empresa
A interface exibe duas tabelas centrais:
1. **Tabela de Treinadores (Coaches):** Permite adicionar, editar informações e desvincular coaches pertencentes à sua academia.
2. **Tabela de Alunos (Students):** Permite o cadastro de novos alunos e atribuição/transferência de coaches da sua unidade de forma facilitada.

---

### 4.3 O Bloqueio Técnico de Criação por Limite de Plano
- Se a empresa possui o **Plano Start** (limite de 2 Coaches e 20 Alunos) e tenta cadastrar o 3º coach ou o 21º aluno:
  - O botão de `+ Adicionar` correspondente é desabilitado visualmente com uma mensagem clara na tela: *"Limite do Plano Start Atingido. Faça o upgrade para cadastrar novos membros."*
  - Caso o frontend seja violado e uma requisição direta de API seja feita para o backend, o validador `ensureTeamPlanCapacity` intercepta a chamada, bloqueia a inserção de dados e retorna o erro **403 Forbidden** com explicação comercial detalhada, impedindo cadastros fantasmas ou fraudes.

---

## 5. Fluxo e Telas do Coach (`coach` / Cockpit do Coach)

O papel de `coach` é de operação diária direta com os alunos. O treinador passa a maior parte do seu tempo no **Cockpit do Coach** (`/coach`), que é o painel funcional real já conectado à API de produção do backend.

### 5.1 Dashboard Operacional do Coach (`/coach`)
O Coach acessa o painel de navegador (idealizado para desktop e iPad/tablet) e visualiza uma central de controle focada em monitoramento físico e ações rápidas.

#### A. Central de Alunos em Risco (Ação Proativa)
O painel coloca em destaque no topo da página os alunos que necessitam de intervenção urgente (Risco de Abandono - Atenção/Crítico):
- Alunos que não registram atividade há mais de 3 dias são destacados.
- O Coach pode, com um clique, visualizar o último treino executado pelo aluno ou copiar o contato dele para realizar uma abordagem externa proativa.

#### B. Gestão da Carteira do Coach
Tabela dinâmica contendo todos os alunos vinculados ao seu ID de usuário (`coachId === actor.userId`):
- O Coach pode clicar em `Criar Aluno` para cadastrar um novo aluno sob sua tutela (o backend força automaticamente o vínculo do `coachId` ao dele e do `teamId` ao da empresa que ele trabalha).
- Permite abrir a ficha clínica detalhada do aluno (Dossiê) nas 7 abas para ajustar treinos, verificar fotos de validação física e prescrever dietas controladas.

#### C. Visualização de Exercícios Customizados
O Coach pode solicitar ao Administrador da Empresa o cadastro de exercícios específicos que não estejam catalogados no banco padrão do GUTO, enviando o nome do exercício e a URL correspondente do vídeo explicativo obrigatório para validação física.

---

## 6. O Caminho do Dado e a Conexão Ponta a Ponta com o App

Para que o GUTO dê certo, o ecossistema de dados precisa rodar em sincronia e harmonia entre o Painel Web e o Aplicativo Móvel do celular do aluno.

```
+-----------------------------------------------------------------------------+
|                            CAMINHO DO DADO (E2E)                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ PAINEL WEB ]                                                             |
|        │                                                                    |
|        ▼ (POST /admin/students - Criação de Aluno)                          |
|  [ BACKEND / BANCO ] (Gera UserAccess com status "invited" + Token Invite)  |
|        │                                                                    |
|        ▼ (Link de Onboarding enviado ao Aluno: /convite/[token])            |
|  [ CELULAR DO ALUNO ]                                                       |
|        │                                                                    |
|        ├─► [Idioma] ──► [Criar Senha] ──► [Consentimento de Termos]          |
|        │                                                                    |
|        └─► [Naming Soberano] ──► [Calibragem Física] ──► [Pacto Mútuo]      |
|                                                                             |
|  [ MEMÓRIA DO GUTO (GutoMemory) ATUALIZADA NO REDIS/BANCO ]                 |
|        │                                                                    |
|        ├─► Atualiza status para "active" no painel em tempo real            |
|        │                                                                    |
|        └─► IA do GUTO gera automaticamente Treino & Dieta Iniciais          |
|                                                                             |
|  [ OPERAÇÃO DO COACH NO PAINEL WEB ]                                        |
|        │                                                                    |
|        ├─► Edita Exercícios, Calorias ou Alimentos do Aluno                 |
|        │                                                                    |
|        └─► Ativa o "Coach Lock" (lockedByCoach = true)                      |
|                                                                             |
|  [ COMPORTAMENTO NO APP CELULAR DO ALUNO ]                                  |
|        │                                                                    |
|        └─► GUTO absorve o Treino/Dieta manual com "Guto Talk"               |
|            (Traduz dados frios em incentivo emocional com voz/personalidade)|
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 6.1 Detalhamento Técnico das Etapas do Fluxo
1. **Criação e Envio:** O Coach insere o nome, sobrenome, e-mail e telefone do aluno no Painel Web. O backend cria um registro com status de acesso `invited` e gera um link exclusivo contendo o token de segurança de onboarding válido por **7 dias** (`/convite/[token]`).
2. **Reivindicação do Convite (Claim):** O aluno abre o link no seu celular. O sistema lê o token e solicita que o aluno selecione o idioma e crie sua senha de acesso. O backend executa o POST de claim, ativa a conta, gera um ciclo inicial de faturamento de 30 dias e autentica o usuário gerando o token JWT de sessão.
3. **Onboarding Sequencial Inviolável:** O Stage Router do app bloqueia o avanço do aluno se ele tentar burlar as etapas. Ele deve cumprir a ordem:
   - *Aceitação de Termos e Consentimento de Saúde/Fitness* (Consentimento).
   - *Nome do GUTO e Confirmação de Identidade da Dupla* (Naming Soberano).
   - *Questionário de Variáveis Biológicas e Hábitos* (Calibragem Física).
   - *Assinatura do Pacto de Frequência e Esforço* (Pacto Mútuo de Consistência).
4. **Alimentação do Painel:** Uma vez completado o pacto, os dados reais preenchidos na calibragem alimentam a `GutoMemory` no Redis e são persistidos no banco. O painel web do Coach passa a exibir o status do aluno como `Ativo` e renderiza todas as variáveis clínicas e biológicas correspondentes.
5. **Geração do Planejamento Físico:** A IA do GUTO gera imediatamente as sugestões de treinos diários e planejamentos nutricionais baseados na calibragem realizada pelo aluno, respeitando dores patológicas (para treinos) e restrições alimentares (para dietas).
6. **Controle Sob rédeas Curtas (Manual Override):** Caso o Coach discorde do planejamento gerado pela IA ou queira customizar a rotina do aluno, ele realiza as alterações manuais no painel e ativa o **Coach Lock** (`lockedByCoach = true`).
7. **Consumo no Aplicativo:** Quando o aluno abre a aba Chat ou Treino no celular, o app faz uma requisição ao backend. O backend detecta que o treino/dieta está travado pelo treinador e carrega estritamente a prescrição manual do painel, impedindo que as IAs adaptativas reescrevam as séries ou os alimentos automaticamente. O GUTO faz a tradução emocional (Guto Talk) do treino/dieta travado para motivar o aluno.

---

## 7. Regras e Restrições Críticas de Segurança do Negócio

Para que o GUTO não quebre comercialmente e nem perca sua credibilidade como jogo de saúde, estas restrições são técnicas e não-negociáveis em todo o ecossistema:

1. **XP e Streak são Méritos Reais:** Nenhuma tela administrativa do painel possui campos de input ou botões para que o Coach, Empresa ou Super Admin edite manualmente a pontuação de XP, a sequência de dias consecutivos (streak) ou o estágio de evolução do avatar do aluno. Essas métricas representam o esforço físico comprovado do aluno no percurso e a consistência real dele. Burlar essas métricas destrói a confiança na gamificação do app.
2. **Soberania do Nome Soberano:** O nome oficial da dupla de treino é definido exclusivamente pelo aluno no onboarding do app e é soberano. O painel web não possui permissão para sobrescrever este nome.
3. **Bloqueio Técnico Contra Contas Mortas:** Se o GUTO de um aluno morreu por inatividade física prolongada (conforme regras em `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md`), este aluno herda o status comercial de `dead` (GUTO morto). O Coach está bloqueado no painel contra a geração de novos treinos ou ativação automática do sistema sem antes passar pela reativação comercial, liberação financeira do faturamento e um novo pacto emocional.
4. **Alunos Avulsos Sem Exceção:** Alunos B2C avulsos que adquirem o GUTO diretamente pela internet não entram no banco como "alunos sem time". Eles são atribuídos automaticamente a uma **Team interna do GUTO para alunos diretos**, que possui seu próprio plano de volumetria, coaches virtuais ou internos do GUTO, Arena Semanal e Mensal própria, e presença regular na Arena Geral global ao lado da marca do time virtual.
5. **RGPD & LGPD Rigorosas:** O aluno tem direito de revogar o consentimento de dados a qualquer momento pelo app. Se o consentimento for revogado, o painel do Coach bloqueia instantaneamente a exibição de suas fotos de validação física e dados biológicos, gerando logs de conformidade legal de privacidade (`consent_revoked`).
