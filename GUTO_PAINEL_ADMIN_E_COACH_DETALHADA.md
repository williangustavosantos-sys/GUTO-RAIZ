# Painel Admin e Coach do GUTO — Roteiro Detalhado de Engenharia

> Documento canônico de especificação do Painel B2B2C Web, Gestão de Alunos, Isolamento de Equipes (Team Isolation) e Segurança Operacional.

---

## O Que É O Painel Admin do GUTO

O Painel Admin e Coach do GUTO é o cérebro empresarial e operacional da plataforma. Ele é um portal web de navegador, com prioridade para desktop, mas precisa funcionar com leitura e ação segura também em iPad/tablet e celular quando o operador estiver fora da mesa.

Enquanto o aplicativo móvel do aluno é o templo da experiência emocional, o painel web é a **central de governança comercial**.

O painel não concorre ou substitui o GUTO. Ele o alimenta. 
- O profissional de educação física define as diretrizes, edita os treinos, prescreve as dietas e acompanha as métricas.
- O GUTO absorve essas mudanças no backend e as conduz na ponta de forma amigável, direta e viva para o aluno no celular.

---

## O Problema Comercial da Escala B2B2C

O grande gargalo de treinadores físicos e academias corporativas é a capacidade de entrega individualizada. Um personal trainer tradicional consegue atender com atenção no máximo 10 a 15 alunos de forma manual. Ao tentar escalar, a qualidade da entrega decai por falta de tempo.

O Painel do GUTO resolve a escala: o Coach planeja e opera a retaguarda, enquanto o GUTO automatiza a presença, a cobrança, o GUTO Online e a motivação diária série por série na ponta.

---

## Estado Atual da Implementação e Ponto de Pausa

Este documento continua sendo a fonte de verdade do painel, mas a implementação do painel foi pausada temporariamente para priorizar a correção do aplicativo do aluno, começando por calibragem, memória, chat, treino e dieta.

Enquanto essa frente do app não estiver alinhada com `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`, nenhum agente deve avançar novas fases do painel.

### O Que Já Foi Implementado no Frontend

Na pausa atual, o frontend do painel já possui:

- Login administrativo redesenhado em `/admin/login`, com escolha visual de papel e seletor de idioma PT/IT/EN.
- Shell responsivo compartilhado do painel, com sidebar, header, idioma, badge de dados mock e comportamento para desktop, iPad/tablet e celular.
- Rota `/admin` com Home do Super Admin.
- Home do Super Admin estruturada por empresas, não por lista global de alunos.
- KPIs da Home: empresas cadastradas, empresas ativas, coaches ativos, alunos ativos, alunos em atenção, alunos críticos e pendências.
- Tabela principal de empresas com status, plano, coaches usados/limite, alunos usados/limite, atenção, críticos, pendências e última atividade.
- Setup Wizard visual para estado vazio.
- Rota `/admin/teams/:teamId` com Detalhe da Empresa em modo somente leitura.
- Detalhe da Empresa com resumo, plano, limites, risco operacional, coaches, alunos, pendências, Arena Semanal, Arena Mensal e logs.
- Modal informativo read-only do botão `+ Nova empresa`, mostrando os campos e regras futuras de cadastro sem criar nada no backend.
- Rota `/empresa` criada como stub visual.
- `/coach` antigo preservado, ainda não migrado para o novo shell definitivo.

### O Que Está Congelado Por Enquanto

Não continuar, por enquanto:

- Detalhe do Coach (`/admin/teams/:teamId/coaches/:coachId`).
- Detalhe do Aluno (`/admin/students/:userId`).
- Abas reais do aluno no painel.
- Criação real de empresa, coach ou aluno.
- Endpoints novos no backend do painel.
- Troca de mocks por dados reais.
- Edição real de calibragem via painel.
- Ações de pausar, reativar, renovar, resetar senha, arquivar ou reviver aluno.
- Refator do Coach Portal.
- Empresa Portal completo.

### Motivo da Pausa

O painel depende da verdade operacional do app. Antes de avançar o painel, é necessário garantir que:

- Calibragem e `GutoMemory` sejam fonte única de verdade.
- Configurações do app, Chat e futuro Painel Admin/Coach alterem a mesma memória.
- Treino e dieta consumam corretamente os dados da calibragem.
- O Chat não prometa alterações que não foram persistidas.
- O backend tenha caminho seguro para auditoria de alterações sensíveis.

### Próximos Passos Quando O Painel For Retomado

Quando a frente do app voltar para um estado confiável, retomar o painel nesta ordem:

1. **Revalidar o estado atual**
   - Abrir `/admin/login`, `/admin`, `/admin/teams/:teamId`, `/empresa`, `/coach` e `/login`.
   - Confirmar que o app do aluno continua intacto.
   - Confirmar responsividade em desktop, iPad/tablet e celular.

2. **Fase 2c.3 — Detalhe do Coach, somente leitura**
   - Criar `/admin/teams/:teamId/coaches/:coachId`.
   - Mostrar dados do coach, carteira agregada, alunos do coach, fila de treino, fila de dieta e logs.
   - Não criar Arena própria do coach. O coach vê Arena Semanal/Mensal da empresa.

3. **Fase 2c.4 — Detalhe do Aluno, somente leitura**
   - Criar `/admin/students/:userId`.
   - Mostrar abas: Resumo, Calibragem, Treino, Dieta, Arena, Histórico e Acesso.
   - Calibragem em modo leitura por campos legíveis.
   - Treino e dieta em modo leitura.
   - Botões sensíveis desabilitados até backend validado.

4. **Especificar criação real de Empresa**
   - O botão `+ Nova empresa` deve sair do modal informativo e virar criação real apenas quando houver backend pronto.
   - Campos mínimos futuros: nome da empresa, status inicial, plano, responsável, e-mail do responsável, telefone do responsável, país, cidade e limites customizados quando o plano for Custom.
   - Telefone é essencial para empresa/responsável, mas continua proibido na calibragem e memória do aluno.

5. **Backend agregado do painel**
   - Criar endpoints agregados `/admin/panel/*`.
   - Aplicar escopo por `teamId` e `coachId` no backend, nunca confiar apenas no frontend.
   - Implementar paginação cursor-based.
   - Implementar auditoria com `teamId`, `operatorId`, `before`, `after` e `fieldsChanged`.
   - Implementar endpoint validado para calibragem do aluno, sem JSON cru.

6. **Trocar mocks por dados reais**
   - `lib/panel/data-source.ts` deve deixar de retornar mocks e passar a buscar os endpoints reais.
   - `NEXT_PUBLIC_USE_MOCKS=false` não pode deixar nenhum mock vazar para operação.

7. **Completar Empresa Portal e Coach Portal**
   - `/empresa` usa o mesmo shell e dados escopados ao `teamId`.
   - `/coach` usa o mesmo shell e escopo do coach, sem Arena própria por coach.

### Regras Para Qualquer Agente Que Retomar O Painel

- Não mexer no app do aluno ao retomar painel, salvo se a tarefa for explicitamente de integração validada.
- Não criar aluno sem `teamId` e `coachId`.
- Não criar coach fora de uma empresa.
- Não carregar todos os alunos no frontend para calcular KPI.
- Não editar XP, streak ou estágio do avatar manualmente.
- Não editar calibragem como JSON cru.
- Não prescrever alimento bloqueado pelo campo **NÃO COMO**.
- Não avançar backend real antes de ter contrato de endpoint e validação claros.
- Não remover o badge/controle de mocks enquanto os dados ainda forem sintéticos.

---

## Modelo Comercial e Operacional: Uma Plataforma, Várias Empresas

O GUTO é sempre o mesmo sistema. Não existe uma cópia separada do app, do backend ou da personalidade do GUTO para cada cliente.

O que existe é uma **instância lógica operacional por empresa/time**, isolada por `teamId`.

```txt
GUTO Plataforma
  ├── Empresa / Team: Action Fit
  │     ├── Coaches da Action Fit
  │     ├── Alunos da Action Fit
  │     ├── Treinos, dietas, métricas e logs da Action Fit
  │     ├── Arena Semanal da Action Fit
  │     └── Arena Mensal da Action Fit
  │
  ├── Empresa / Team: Studio Vértice
  │     ├── Coaches do Studio Vértice
  │     ├── Alunos do Studio Vértice
  │     ├── Treinos, dietas, métricas e logs do Studio Vértice
  │     ├── Arena Semanal do Studio Vértice
  │     └── Arena Mensal do Studio Vértice
  │
  └── Arena Geral do GUTO
        └── Ranking global com dupla + nome da empresa/time
```

A empresa compra o acesso operacional ao GUTO para sua estrutura. Na prática, isso significa:

- A empresa é a unidade comercial principal.
- O plano vendido para a empresa define limites de coaches e alunos.
- Coaches só existem dentro de uma empresa/time.
- Alunos só existem dentro de um coach.
- Todo aluno precisa ter `teamId` e `coachId`.
- Treinos, dietas, calibragem, logs, métricas, pendências e rankings semanais/mensais pertencem ao `teamId`.
- A única parte universal entre todas as empresas é a **Arena Geral**.

### Alunos Avulsos / Venda Direta Pela Internet

Alunos que comprarem o GUTO diretamente pela internet não devem virar exceção técnica.

Eles também entram na mesma hierarquia:

```txt
Team interna do GUTO (nome a definir depois)
  └── Coach/Admin padrão do GUTO
        └── Alunos diretos da internet
```

O nome comercial dessa Team interna será decidido depois. Até lá, qualquer documentação ou implementação deve tratar esse grupo como:

```txt
Team interna do GUTO para alunos diretos
```

Regras obrigatórias:

- Não existe aluno sem `teamId`.
- Não existe aluno sem `coachId`.
- Venda direta B2C usa a mesma arquitetura de empresa/time.
- A Team interna tem plano, limites, coaches/admins internos, alunos, Arena Semanal, Arena Mensal e presença na Arena Geral.
- Na Arena Geral, esses alunos aparecem com o `teamName` da Team interna, depois que o nome for definido.

---

## Hierarquia Estrita de Papéis (Roles)

O sistema possui uma segregação de permissões rígida baseada em claims no token JWT:

```txt
  [ Super Admin ]  ➔ Visão global de todas as empresas, faturamento e auditoria total.
         │
         ▼
  [ Admin de Time ]➔ Gerencia a academia/unidade, seus coaches e seus alunos.
         │
         ▼
  [ Coach/Personal]➔ Edita treinos, dietas, analisa riscos e acompanha alunos vinculados.
         │
         ▼
  [ Aluno (Student) ]➔ Usa apenas o app celular. Bloqueado contra acessos ao painel.
```

- **Super Admin:** O nível supremo. Modula as regras comerciais de limites de licenças, cria novas empresas e possui acesso a logs de auditoria global.
- **Admin de Time/Empresa:** Escopado para a sua própria organização (academia ou unidade). Gerencia sua equipe de treinadores, fatura planos corporativos e visualiza os rankings internos de sua unidade.
- **Coach / Treinador:** Nível operacional de atendimento diário. Insere treinos, bloqueia dietas, edita dados de calibragem física e acompanha relatórios de desistência dos alunos amarrados diretamente a ele ou ao seu time.
- **Aluno (Student):** Totalmente isolado do painel. Qualquer requisição vinda de contas estudantis às rotas `/admin` ou `/coach` é interceptada no backend com negação `403 Forbidden` e redirecionamento de segurança.

---

## A Regra de Ouro: Isolamento de Dados (Team Isolation)

Toda e qualquer tabela de dados sensíveis de usuários (peso, altura, limitações, fotos de validação, e-mails de cadastro) herda obrigatoriamente a tag `teamId`.

O `teamId` é a fronteira comercial, operacional e de privacidade do GUTO.

```txt
Empresa / Academia / Time = teamId
Coach pertence a um teamId
Aluno pertence a um coachId e a um teamId
```

O painel Super Admin começa por empresas, porque empresas são a unidade pagante. O fluxo correto de leitura e ação é:

```txt
Super Admin
  └── Empresas
        └── Coaches
              └── Alunos
```

O painel não deve começar por uma lista global de alunos misturados. Quando o Super Admin precisar encontrar um aluno específico, ele pode usar busca global, mas o resultado sempre deve exibir o contexto:

```txt
Aluno: Will
Empresa: Action Fit
Coach: Bruno
```

### Bloqueio Técnico Estrito
- Um Coach do Time Alfa está fisicamente e tecnicamente impedido de ler ou alterar registros de alunos do Time Beta.
- Se o Coach do Time Alfa tentar injetar IDs de alunos do Time Beta via requisições diretas de API ou URLs adulteradas, o backend intercepta o `teamId` contido no token JWT do Coach e nega a operação retornando `403 Forbidden`.
- Os testes automáticos (`guto-backend/tests/guto-team-isolation.test.ts`) rodam de forma contínua no pipeline para certificar que nenhum vazamento acidental ocorra. Vazamento de dados pessoais entre empresas parceiras é considerado falha técnica crítica gravíssima de compliance (GDPR/LGPD).

---

## Home do Super Admin: Empresas Primeiro

A tela inicial `/admin` deve ser uma visão comercial e operacional por empresa/time. O dado principal do Super Admin é a quantidade e o estado das empresas pagantes.

### KPIs Globais

A Home do Super Admin deve mostrar:

- Empresas cadastradas.
- Empresas ativas.
- Coaches ativos.
- Alunos ativos.
- Alunos em atenção.
- Alunos críticos.
- Pendências operacionais.

O card "Treinos hoje" não pertence à visão global do Super Admin. Treino é ação dentro do perfil do aluno, da carteira do coach ou da operação da empresa.

### Tabela Principal: Empresas

A tabela principal da Home deve ser `Empresas/Teams`, com:

- Nome da empresa.
- Status.
- Plano.
- Coaches usados / limite.
- Alunos usados / limite.
- Alunos em atenção.
- Alunos críticos.
- Pendências.
- Última atividade.
- Ação para abrir detalhe da empresa.

### Busca Global

A busca global pode localizar empresas, coaches e alunos, mas nunca deve remover a hierarquia.

Exemplo de resultado:

```txt
Will Santos
Aluno · Action Fit · Coach Bruno
```

Ao abrir um aluno encontrado pela busca, o cabeçalho do detalhe precisa mostrar:

```txt
Empresa: Action Fit
Coach: Bruno
Aluno: Will Santos
```

---

## Detalhe da Empresa

Ao clicar em uma empresa, o painel entra no GUTO operacional daquela empresa.

A tela da empresa deve mostrar:

- Resumo da empresa.
- Plano contratado.
- Limites de coaches e alunos.
- Uso atual de coaches e alunos.
- Coaches da empresa.
- Alunos da empresa, preferencialmente agrupados ou filtráveis por coach.
- Alunos em atenção.
- Alunos críticos.
- Alunos sem primeiro acesso.
- Pendências operacionais.
- Arena Semanal da empresa.
- Arena Mensal da empresa.
- Logs da empresa.

O Admin da Empresa vê apenas essa tela para seu próprio `teamId`. O Super Admin pode abrir qualquer empresa.

---

## Detalhe do Coach

Todo coach pertence a uma empresa. Não existe coach sem `teamId`.

A tela de detalhe do coach deve mostrar:

- Nome e e-mail do coach.
- Empresa/time ao qual pertence.
- Quantidade de alunos vinculados.
- Alunos ativos.
- Alunos em atenção.
- Alunos críticos.
- Alunos sem primeiro acesso.
- Fila de treino.
- Fila de dieta.
- Logs de ação do coach.

O coach pode operar sua carteira de alunos, mas não define o escopo da Arena. A Arena Semanal e Mensal continuam sendo da empresa (`teamId`), não do `coachId`.

---

## O Fluxo de Onboarding via Convite

O cadastro de novos alunos no painel estabelece uma ponte automatizada com o aplicativo celular:

```txt
1. Coach/Admin preenche e-mail e nome sugerido no Painel Web
2. Backend cria o perfil estudantil com status "invited" e teamId/coachId amarrados
3. Backend gera um token exclusivo de convite
4. O link de onboarding é enviado (/convite/[token])
5. O Aluno abre o link no celular
6. O sistema executa o fluxo (idioma ➔ senha ➔ termos ➔ nome ➔ calibragem ➔ pacto)
7. Aluno ativa a conta no celular
8. Painel Web atualiza o status do aluno para "active" em tempo real
```

- *Aviso de Soberania:* O nome digitado e confirmado pelo aluno na etapa de nome soberano é lei. Ele sobrescreve na hora o nome provisório (presetName) registrado pelo Coach/Admin no convite inicial.

Regra estrutural:

```txt
Aluno só pode ser criado se existir empresa/team.
Aluno só pode ser criado se existir coach dentro daquela empresa/team.
```

Se o limite de alunos do plano da empresa estiver cheio, o backend deve bloquear a criação do aluno ou o envio de novo convite.

---

## Visão Geral das Abas do Perfil do Aluno no Painel

Ao clicar no registro de um aluno na lista consolidada, o treinador abre a ficha clínica e esportiva do aluno, dividida em abas:

### A. Aba Resumo (Métricas de Engajamento)
Exibe gráficos rápidos de consistência, o estágio do avatar (`Baby`, `Teen`, `Adult`, `Elite`), dias de streak ativo, total de XP, data do último treino validado e o sinalizador gráfico de **Risco de Abandono**:
- **Verde (Risco Baixo):** Treinou e interagiu nas últimas 48 horas.
- **Amarelo (Atenção):** Sem validações ou chat de 3 a 5 dias.
- **Vermelho (Risco Alto):** 6 ou mais dias sem validação/chat/sinal. Alerta o treinador para intervenção manual rápida.

### B. Aba Calibragem (Ficha Biológica)
Exibe as variáveis preenchidas no onboarding: idade, sexo homem/mulher, nível, objetivo, local de treino, dor/patologia/limitação, altura, peso, país, cidade e campo único **NÃO COMO** (`foodRestrictions`).

O painel nunca deve editar `GutoMemory` como JSON cru. Qualquer alteração precisa acontecer por campos controlados e validados. O campo "NÃO COMO" continua sendo um campo único de restrição alimentar; não criar campo separado de intolerância.

### C. Aba Treino (Editor de Exercícios)
O Coach visualiza o treino em execução e possui a ferramenta de montagem de treinos manuais, escolhendo exercícios do catálogo oficial e alterando séries, repetições, tempos de descanso e cargas sugeridas.
- **Regra do Coach Lock:** Ao travar um treino manual para o aluno, o backend marca `lockedByCoach = true`. O GUTO está impedido de reescrever este plano automaticamente. O GUTO Online no celular usará este treino, agindo sob rédeas seguras impostas pelo treinador.

### D. Aba Dieta (Menu Nutricional)
Permite a visualização e edição das porções diárias de refeições e do balanço calórico. A aba Dieta deve seguir o mesmo padrão operacional da aba Treino:

- Ver dieta atual.
- Ver dieta semanal.
- Gerar dieta com GUTO.
- Editar manualmente refeições, porções e observações.
- Bloquear dieta com `lockedByCoach`.
- Desbloquear para o GUTO voltar a adaptar.
- Validar contra o campo **NÃO COMO**.
- Registrar log quando coach/admin alterar.

O editor deve barrar a gravação de planos com alimentos proibidos no campo "NÃO COMO".

### E. Aba Arena (Resumo Individual)
Mostra a posição do aluno sem substituir a tela Arena principal:

- Posição semanal dentro da empresa.
- Posição mensal dentro da empresa.
- Posição geral global.
- XP semanal.
- XP mensal.
- XP total.
- Streak.
- Estágio do avatar.

Na Arena Geral, o aluno aparece com a dupla e a empresa/time ao lado.

### F. Aba Histórico (Linha do Tempo)
Diário operacional de auditoria do aluno. Exibe todas as fotos de validações físicas enviadas pela câmera, as notas pós-treino ("Foi fácil", "Senti dor"), as queixas de dores articulares relatadas e os registros de XP recebidos.

### G. Aba Acesso (Controle de Status)
- **Ativo:** Acesso liberado ao app principal.
- **Pausado / Expirado / Arquivado:** Altera a conta no banco de dados. Na mesma hora, o interceptor de requisições do celular do aluno detecta o status bloqueado e redireciona a interface móvel para a tela `/acesso-pausado` no idioma correto.

Se o GUTO do aluno estiver morto por XP zerado, isso é status de acesso/comercial, não risco operacional comum. O painel não deve criar treino novo nem forçar retorno desse aluno sem reativação administrativa/comercial.

---

## O Mecanismo de Logs de Auditoria do Painel

Toda ação executada por profissionais que afete dados, faturamento ou status de acessos de alunos gera um log imutável no banco de dados, contendo metadados de segurança:
- `timestamp`: Data e hora exatas da ação.
- `operatorId`: ID do profissional (Admin ou Coach) que realizou o comando.
- `operatorRole`: Papel hierárquico do operador.
- `targetUserId`: Aluno que recebeu a alteração.
- `actionType`: Tipo da ação (`workout_locked`, `diet_modified`, `access_paused`, `invite_generated`).
- `metadata`: JSON contendo o valor antigo e o valor novo para auditoria B2B de segurança.

---

## Planos Comerciais B2B e Limites de Licenças

O sistema gerencia limites técnicos de volumetria de acordo com a categoria de plano faturada e integrada ao Stripe:
- **Plano Start:** Permite até 2 Coaches e 20 alunos ativos simultaneamente.
- **Plano Pro:** Permite até 4 Coaches e 50 alunos ativos simultaneamente.
- **Plano Elite:** Permite até 6 Coaches e 70 alunos ativos simultaneamente.
- **Plano Custom:** Volumetria configurável de treinadores e alunos sob demanda corporativa.

O backend bloqueia a criação de novos convites de alunos caso os limites técnicos contratados pelo `teamId` tenham sido atingidos, alertando o Administrador da Empresa para realizar o upgrade de plano.

### Como Isso Deve Aparecer No Painel

Na tabela de empresas e no detalhe da empresa, o painel deve mostrar:

- Plano contratado.
- Coaches usados / limite.
- Alunos usados / limite.
- Vagas restantes de coaches.
- Vagas restantes de alunos.
- Aviso de limite próximo.
- Aviso de limite atingido.

Exemplo:

```txt
Action Fit    Pro      Coaches 3 / 4      Alunos 42 / 50      Ativa
Studio X      Start    Coaches 2 / 2      Alunos 20 / 20      Limite cheio
```

### Bloqueios Obrigatórios

Se a empresa atingiu o limite de coaches:

- O botão "Adicionar coach" deve ficar bloqueado.
- O backend deve recusar a criação de novo coach.
- O painel deve explicar que o limite do plano foi atingido.

Se a empresa atingiu o limite de alunos:

- O botão "Adicionar aluno" deve ficar bloqueado.
- O envio de novo convite deve ser bloqueado.
- O backend deve recusar a criação de novo aluno.
- O painel deve orientar upgrade de plano.

No Plano Custom, o Super Admin define manualmente `maxCoaches` e `maxStudents`.

---

## Arena No Painel

A Arena respeita a decisão central definida em `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md`:

```txt
Arena Semanal = empresa/time (teamId)
Arena Mensal  = empresa/time (teamId)
Arena Geral   = global do app GUTO
```

### Regras Por Papel

- Super Admin vê todas as Arenas Semanais/Mensais por empresa e a Arena Geral global.
- Admin da Empresa vê Semanal/Mensal da própria empresa e a Arena Geral global.
- Coach vê Semanal/Mensal da empresa onde trabalha e a Arena Geral global.
- Aluno vê Semanal/Mensal da própria empresa no app e a Arena Geral global.

O coach não vê uma Arena limitada aos próprios alunos. Ele vê a Arena da empresa, porque alunos competem dentro do `teamId`, não dentro do `coachId`.

Na Arena Geral, cada linha deve mostrar:

```txt
GUTO & Nome — Empresa/Time
```

Campos proibidos na Arena: peso, altura, idade, patologia, restrição alimentar, foto privada, telefone, e-mail e qualquer dado clínico.

---

## A Camada Emocional: "O Que o Usuário Não Vê"

Embora o painel web seja uma interface operacional de tabelas corporativas, o GUTO atua como um tradutor de tom emocional na ponta móvel.
- Quando o Coach edita o supino reto para 4 séries de 10 reps e adiciona uma observação no painel, o aplicativo móvel **não** exibe uma mensagem estéril de sistema como: *"Seu administrador atualizou seu registro de treino."*
- A aba Missão é atualizada silenciosamente e, na próxima interação no Chat, o GUTO assume a fala de melhor amigo de forma natural:
  > *"Will, teu treinador deu uma mexida na nossa missão de supino para hoje. Ele quer consistência e postura, então reduzi a carga sugerida e coloquei 4 séries limpas de 10. Eu te guio, vamos fazer bem feito."*

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **Vazamento de Dados (Leak de Equipes):** Coaches ou admins de um time visualizarem, buscarem ou realizarem mutações em dados pertencentes a alunos de outras equipes. **P0 Crítico de Compliance**.
- **Quebrar a Soberania do Nome:** O painel sobrescrever o Nome Soberano do aluno confirmado na etapa de nome soberano pelo nome registrado no cadastro inicial do convite.
- **Burla de Contas Mortas:** O painel permitir que o Coach crie treinos e force a volta ao sistema de alunos que estão marcados com o status de `dead` (GUTO morto), sem passar pela liberação financeira e reativação comercial formal do faturamento.
- **Edição Direta de XP e Streak:** Disponibilizar botões ou campos de inputs para o Coach alterar manualmente o saldo de XP, streak ou nível de evolução do avatar do aluno. Essas métricas são frutos de mérito real e consistência física documentada no Percurso.
- **Bypass de Termos:** Gerar convites que iniciem o aluno no aplicativo de forma direta no Sistema Principal, pulando as etapas obrigatórias de consentimento legal/saúde e a calibragem inicial no celular.
- **Prescrever Alimentos Proibidos:** O painel permitir a gravação de planos dietéticos contendo ingredientes explicitamente marcados como alergias graves do aluno no campo "NÃO COMO" de calibragem.
- **Acesso de Alunos:** Alunos conseguirem de alguma forma ignorar as travas do router e logarem nos portais administrativos de retaguarda.
