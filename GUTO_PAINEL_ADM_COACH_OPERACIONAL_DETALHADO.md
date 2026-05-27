# GUTO — Painel ADM/Coach Operacional (Documento Canônico de Engenharia)

> **Status:** Documento canônico **operacional/de engenharia** do Painel ADM/Coach.
> **Data da consolidação:** 2026-05-27.
> **Escopo desta consolidação:** documentação estratégica + técnica baseada em auditoria do código real. **Nenhum código foi alterado.** Esta é a referência que deve guiar a próxima tarefa de implementação ("Fase Painel P0").

---

## Autoridade deste documento (qual doc é canônico para quê)

Existem hoje três documentos sobre o painel. Para acabar com a confusão, fica declarada a hierarquia:

| Documento | Papel | Autoridade |
|---|---|---|
| **`GUTO_PAINEL_ADM_COACH_OPERACIONAL_DETALHADO.md`** (este) | **Canônico operacional / de engenharia.** Caminho canônico do código, contratos reais de API, fluxo de cadastro, P0/P1/P2, mapa do código, próxima tarefa. | **Prevalece para implementação.** Onde houver conflito com o "Estado Atual" de outros docs, **este vence** porque reflete o código auditado. |
| `GUTO_PAINEL_ADMIN_E_COACH_DETALHADA.md` | **Canônico estratégico / de produto.** Visão B2B2C, identidade, isolamento de times, regras de ouro, planos comerciais, camada emocional. | Preservado e válido para **visão e regras**. Sua seção "Estado Atual da Implementação" está **desatualizada** (ver §6 e §21) e foi corrigida aqui. |
| `PARTE_5_PAINEL_COACH_E_ADMIN.md` | **Resumo executivo.** | Defere aos dois acima. Não decide nada sozinho. |

Regra para qualquer agente (humano ou IA): leia o `README.md` da raiz, depois `GUTO_PAINEL_ADMIN_E_COACH_DETALHADA.md` (visão), depois **este documento** (verdade de engenharia) antes de tocar qualquer código do painel.

---

## 1. Visão do Painel ADM/Coach

O Painel ADM/Coach **não é uma tela administrativa**. Ele é o **sistema operacional B2B do GUTO** — a retaguarda que permite que uma academia, empresa, coach ou personal:

- cadastre e convide alunos reais;
- controle acesso, assinatura e bloqueios;
- visualize a memória (`GutoMemory`) do aluno;
- veja, gere, edite e trave treino e dieta;
- acompanhe risco de abandono, arena e percurso;
- valide a operação ponta a ponta antes do beta.

Sem painel operacional não é possível testar o GUTO inteiro: **cadastro → convite/login → consentimento → calibragem → treino → dieta → arena/percurso → acompanhamento pelo coach/admin.** O painel é o que torna o GUTO vendável para academias, empresas e personals, e é o que destrava o teste end-to-end do produto.

O app móvel do aluno é o templo emocional. O painel é a central de governança. O painel **alimenta** o GUTO; não o substitui.

---

## 2. Princípio soberano

**O painel não pode transformar o GUTO em chatbot.**

O painel controla **dados, acessos e planos**. Quem decide, adapta, cobra e conduz o aluno continua sendo o **GUTO** — o companheiro ativo digital, com base na `GutoMemory` do aluno (ver `README.md` e `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`).

Consequências práticas, não-negociáveis:

- Coach edita treino/dieta no painel → o GUTO traduz isso para o aluno **na personalidade dele**, não como mensagem de sistema ("seu administrador atualizou o registro").
- O painel **nunca** vira uma interface de "conversa genérica". Ele é tabela, ficha, contrato e ação estruturada.
- O painel **não inventa** dado do aluno. A fonte de verdade é a `GutoMemory`, preenchida pelo onboarding do aluno no app.
- XP, streak e estágio do avatar são **mérito real** — o painel **lê**, nunca edita à mão.

---

## 3. Papéis e permissões

Quatro papéis, exatamente como no código (`guto-backend/src/auth-middleware.ts`, `guto-backend/src/admin-router.ts`):

```
super_admin  →  admin (de time/empresa)  →  coach/personal  →  student (aluno)
```

Helpers reais no backend:
- `isAdminRole(role)` ⇒ `admin` **ou** `super_admin`.
- `isCoachRole(role)` ⇒ `coach`.
- `requireAdmin` ⇒ libera `admin` e `super_admin`.
- `requireSuperAdmin` ⇒ libera **só** `super_admin`.
- `requireActiveUser` ⇒ bloqueia acesso pausado/expirado (app do aluno).

### Super Admin
- **Vê:** todas as empresas/times, todos os coaches e alunos de qualquer time, logs globais, telemetria, arena geral e por time.
- **Cria:** empresas/times (`POST /admin/teams` — exclusivo dele), coaches, alunos (precisa informar `teamId`).
- **Edita:** qualquer entidade; planos e limites (incl. `maxCoaches`/`maxStudents` no plano Custom via `PATCH /admin/teams/:teamId`).
- **Bloqueia/pausa:** qualquer aluno; hard-delete (apagar de tudo).
- **Nunca pode:** editar XP/streak/estágio do avatar manualmente; sobrescrever Nome Soberano do aluno; reviver GUTO morto sem liberação comercial.

### Admin da empresa/time
- **Vê:** apenas o **próprio** `teamId` — seus coaches, seus alunos, seus limites de plano, suas pendências, sua arena de empresa.
- **Cria:** coaches do próprio time, alunos do próprio time (pode atribuir um `coachId` do próprio time).
- **Edita:** alunos/coaches/treinos/dietas do próprio time; aprova/rejeita exercícios customizados (`requireAdmin`).
- **Bloqueia/pausa:** alunos do próprio time; soft-delete.
- **Nunca pode:** ver/alterar outro time (`403 TEAM_ACCESS_FORBIDDEN`); criar empresa/time; hard-delete (super_admin); editar XP/streak.

### Coach / Personal
- **Vê:** os alunos vinculados a ele (`coachId === actor.userId`) dentro do seu time; a arena **da empresa** (não uma arena só dele).
- **Cria:** alunos **para si mesmo** (o backend força `coachId = actor.userId`); convites desses alunos; solicita exercício customizado.
- **Edita:** calibragem (campos validados), treino e dieta dos seus alunos; trava/destrava treino/dieta.
- **Bloqueia/pausa:** depende de `requireAdmin` em algumas rotas sensíveis (ex.: `pause`, `reactivate`, `renew`, `reset-password`, `reset` são `requireAdmin`). **Decisão a confirmar na implementação:** hoje várias ações de acesso exigem admin; o coach não as executa sozinho.
- **Nunca pode:** ver/criar aluno de outro coach (`COACH_STUDENT_ACCESS_FORBIDDEN`) ou de outro time; aprovar exercício customizado; criar coaches; gerenciar times; editar XP/streak.

### Aluno (student)
- **Vê:** só o app móvel.
- **Nunca pode acessar o painel.** Qualquer chamada de conta `student` às rotas administrativas é negada (`403`, `ADMIN_ACCESS_FORBIDDEN`). `getScopedUserAccessList` retorna `[]` para `student`.

### Regra obrigatória (reforço)
- **Coach só vê alunos do próprio escopo** (`coachId`), dentro do próprio `teamId`.
- **Aluno não acessa painel.**
- Isolamento de time é validado em runtime (não confiar no frontend) e coberto por `guto-backend/tests/guto-team-isolation.test.ts` e `guto-access-blocking.test.ts`.

---

## 4. Modelo de negócio e planos

Limites **reais** definidos em `guto-backend/src/team-plans.ts` (`GUTO_TEAM_PLAN_LIMITS`):

| Plano | Label | maxCoaches | maxStudents | Quando bloqueia |
|---|---|---|---|---|
| **Start** | GUTO Time Start | 2 | 20 | Ao tentar criar 3º coach ou 21º aluno ativo |
| **Pro** | GUTO Time Pro | 4 | 50 | Ao tentar criar 5º coach ou 51º aluno |
| **Elite** | GUTO Time Elite | 6 | 70 | Ao tentar criar 7º coach ou 71º aluno |
| **Custom** | GUTO Time Custom | `null` (sem limite) | `null` (sem limite) | Limites definidos manualmente pelo super_admin em `PATCH /admin/teams/:teamId` |

- **Permissões por plano:** os planos hoje governam **volumetria** (coaches/alunos). Recursos premium por plano são P2 e ainda não estão no código.
- **Quando bloqueia criação:** o backend chama `ensureTeamPlanCapacity(res, teamId, "student"|"coach", userId)` antes de criar. Se estourou, recusa a criação/convite. Coberto por `guto-team-limits.test.ts` e `guto-team-plans.test.ts`.
- **Como aparece o erro no painel:** o backend retorna erro de capacidade; o painel **deve** mostrar mensagem clara ("Limite do plano atingido — faça upgrade") e desabilitar o botão de criar. Hoje o `app/coach` desabilita o botão quando `studentLimitReached`/`coachLimitReached` é detectado (ver `create-dialogs.tsx`).

---

## 5. Entidades principais

| Entidade | Onde mora (código) | O que é |
|---|---|---|
| **Company / Empresa (Team)** | `guto-backend/src/team-store.ts` | Unidade comercial pagante. Tem plano, limites, `teamId`. `GUTO_CORE_TEAM_ID` é o time interno do GUTO para alunos diretos/B2C. |
| **Coach** | `user-access-store.ts` (`role: "coach"`) | Pertence a **um** time. Opera a carteira de alunos vinculados. |
| **Student / Aluno** | `user-access-store.ts` (`role: "student"`) | Pertence a **um** time e **um** coach. Usa só o app. |
| **Invite / Convite** | `invite-store.ts` | Token de onboarding. Hash SHA-256 no storage, `rawToken` para o link. Expira em **7 dias** (default). Status: `pending_claim → active → expired → revoked`. |
| **UserAccess** | `user-access-store.ts` | Registro de acesso/identidade: `role`, `teamId`, `coachId`, `active`, `subscriptionStatus`, `paymentStatus`, `subscriptionEndsAt`, `passwordHash`, contato (nome, email, phone). |
| **GutoMemory** | `server.ts` (interface) + `memory-store.ts` (persistência Redis→fs→memória) | **Fonte de verdade** do aluno: consentimento, calibragem, planos, XP, streak, histórico, `resolvedFields`, `memoryAudit`. |
| **WorkoutPlan** | `memory.lastWorkoutPlan` / `weeklyWorkoutPlan`; `workout-curator.ts` gera | Treino oficial atual + semanal. Pode estar `lockedByCoach`. |
| **DietPlan** | `diet-store.ts` + `memory.weeklyDietPlan`; `nutrition.ts` calcula macros | Dieta atual + semanal. Pode estar `lockedByCoach`. |
| **Arena / Percurso** | `arena-store.ts`, `arena.ts`; `coachRankingsRouter` | Ranking semanal/mensal (por time) e geral (global). XP/streak/estágio derivam daqui. |
| **AuditLog** | `log-store.ts` (`addLog`) + `memory.memoryAudit` (`appendMemoryAudit`) | Log imutável de ações do painel + auditoria de alteração de memória. `GET /admin/logs`. |

**Relações:**
```
Team (teamId)
  └── Coach (coachId, teamId)
        └── Student (userId, coachId, teamId)
              ├── UserAccess (acesso/assinatura)
              ├── GutoMemory (calibragem, planos, XP) ← fonte de verdade
              ├── WorkoutPlan / DietPlan
              ├── Invite (1 ativo por aluno)
              └── posição na Arena (semanal/mensal do time, geral global)
```
Sem `teamId` e `coachId`, **não existe aluno operacional**.

---

## 6. Caminho canônico do painel (DECISÃO)

Esta é a seção mais importante para acabar com o "parece ter mais de um caminho". Auditoria do código real:

### Backend — DECIDIDO no código
- **CANÔNICO:** `/admin/*` → `guto-backend/src/admin-router.ts` (2063 linhas, real, testado). É a API de todo o painel: students, coaches, teams, workout, diet, invite, logs, exercises.
- **LEGADO/DESATIVADO:** `/guto/coach/*` → `guto-backend/src/coach-router.ts`. Montado **só** se `GUTO_ENABLE_LEGACY_COACH_ROUTES === "true"` (default **false**). Desligado, retorna `410 LEGACY_COACH_ROUTES_DISABLED` com a mensagem *"Rotas legadas de coach foram desativadas. Use /admin."* Coberto por `guto.legacy-coach-routes.test.ts`.
- **EXCEÇÃO mantida:** `coachRankingsRouter` (`/guto/coach/rankings`) continua ativo só para rankings da arena.
- **Auth:** `/auth/admin/login`, `/auth/coach/login`, `/auth/user/login` (`auth-router.ts`).

### Frontend — onde está a confusão
| Rota | Arquivo de entrada | Fonte de dados | Estado real |
|---|---|---|---|
| **`/coach`** | `app/coach/page.tsx` → cockpit (`use-coach-data.ts`) | **API REAL** (`lib/api/admin.ts` → `/admin/*`) | **Painel funcional de hoje.** Telas, abas, hooks, CRUD reais contra o backend. |
| **`/admin`** | `app/admin/page.tsx` → `SalaApp` | **MOCK** (`lib/panel/data-source.ts` → `lib/panel/mocks.ts`) | Sala do Super Admin, "empresas primeiro". **Visual/mock por padrão.** Read-only, criação atrás de modal informativo. |
| **`/empresa`** | `app/empresa/page.tsx` | **MOCK** (mesma camada) | **Stub** do portal do Admin de empresa. |

`IS_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"` → **mock é o default** (a flag não está setada). `mockGuard()` **lança erro** se um acessor mock for chamado com a flag desligada — ou seja, `/admin` e `/empresa` **quebram** se você desligar o mock hoje, porque ainda não têm fonte real.

> Isto confirma e corrige o "Estado Atual" do `GUTO_PAINEL_ADMIN_E_COACH_DETALHADA.md`, que descreve `/admin` como o novo shell e `/coach` como "antigo preservado". **A realidade é o inverso para fins operacionais:** `/coach` é o que funciona contra o backend real; `/admin` e `/empresa` são a casa futura, ainda mock. (Corroborado por `guto-app-v0/docs/GUTO_INVENTARIO_COMPLETO_ESTADO_ATUAL.md`, itens 179–180.)

### A causa raiz do "mais de um caminho"
O login (`app/admin/login/page.tsx`) redireciona por papel:
- `super_admin` → **`/admin`** (mock)
- `admin` → **`/empresa`** (mock/stub)
- `coach` → **`/coach`** (real)

Resultado: o super_admin/admin caem numa tela mock e o coach cai na tela real. **É exatamente isso que faz parecer que há painéis paralelos.**

### Decisão canônica
1. **API canônica:** `/admin/*`. Toda chamada de painel passa por aqui. Nada de ressuscitar `/guto/coach/*` (legado, 410).
2. **Frontend canônico para o P0:** **`app/coach`** (o cockpit já ligado à API real). É onde a Fase Painel P0 deve ser corrigida — não criar tela nova no escuro.
3. **`app/admin` + `app/empresa`:** continuam sendo a **casa estratégica futura** ("empresas primeiro", per doc estratégico), mas **hoje são mock** e **não devem ser tratados como o painel operacional**. Decisão de produto a tomar na implementação: **(a)** ligar `/admin` e `/empresa` ao `/admin/*` real e migrar o cockpit para lá, **ou (b)** congelar `/admin`+`/empresa` e consolidar tudo em `/coach` renomeado. **Não dividir trabalho entre os dois caminhos antes dessa decisão.**
4. **Legado a ignorar/remover:** `adm/project/coach-panel/*.jsx`, `adm/project/coach-panel/Coach Panel.html` e `design_handoff_guto_coach_panel/` são **protótipos de design** (origem dos mocks). Não são runtime. Não ligar em produção; servem só como referência visual.
5. **Risco de vazamento de mock:** enquanto `/admin`/`/empresa` forem mock, manter o badge "DADOS MOCK · FASE VISUAL" e garantir que `NEXT_PUBLIC_USE_MOCKS` nunca caia em produção sem fonte real.

---

## 7. Fluxo correto de criação de aluno

Auditado em `guto-backend/src/admin-router.ts` (`POST /admin/students` ou `/users`, linha ~986) e `invite-store.ts`.

```
A) Admin/Coach abre o cockpit (/coach) e clica "Criar aluno"
B) Preenche: nome, sobrenome, email, telefone, (teamId se super_admin), (coachId se admin)
C) POST /admin/students
   → valida nome+sobrenome (400 se faltar)
   → valida email (400 se inválido), normaliza p/ minúsculas
   → valida telefone (400 se inválido)   ← ver tensão em §21
   → role precisa ser "student" (403 caso contrário)
   → super_admin: teamId obrigatório (400 GUTO_TEAM_REQUIRED)
   → admin/coach: teamId derivado do próprio token; pedir outro time = 403 TEAM_ACCESS_FORBIDDEN
   → coach: coachId forçado para o próprio (403 COACH_STUDENT_ACCESS_FORBIDDEN se tentar outro)
   → admin com coachId: valida coach existe, é coach e é do mesmo time
D) Sistema valida limite do plano: ensureTeamPlanCapacity(...) → bloqueia se cheio
E) Sistema cria UserAccess role="student" (upsertUserAccessAsync)
F) Sistema vincula teamId + coachId
G) Sistema cria seed de GutoMemory (updateMemoryFromStudentPatch — nome/email/phone)
H) Convite OU senha:
     - SEM senha (e não active) → createInvite() gera token (expira 7 dias) + inviteLink
     - COM senha (ou active=true) → temporaryPassword "GUTO-xxxx" e acesso direto
I) Aluno abre o link /convite/[token] (ou loga com senha temporária)
J) Aluno aceita consentimento (saúde/fitness + termos)
K) Aluno faz nome soberano / calibragem / pacto no app
L) GutoMemory vira a fonte de verdade (consent, calibragem, planos, XP)
M) Painel passa a refletir os dados reais (GET /admin/students/:userId retorna user + memory)
```

### Decisões escritas (respostas às perguntas em aberto)
- **Aluno entra por convite ou senha?** **Os dois caminhos existem.** Sem senha → gera **convite** (link com token). Com senha (ou `active=true`) → senha temporária e acesso direto. **Recomendação P0:** padronizar no **convite** (mais seguro, força onboarding completo); senha direta fica para casos administrativos.
- **Token expira?** **Sim, 7 dias** (`expiresInDays ?? 7`). Ao expirar, status vira `expired`; é preciso **regenerar**.
- **Quem pode regenerar?** Qualquer operador que **gerencia** aquele aluno (admin/coach no escopo) via `POST /admin/students/:userId/invite/regenerate`. Gera log `invite_regenerated`.
- **Aluno criado já fica active ou pending?** **Pending por padrão.** `active = body.active ?? Boolean(passwordHash)` → se não houver senha e `active` não for `true`, o aluno fica inativo, `subscriptionStatus = "pending_payment"`, até reivindicar o convite (claim → +30 dias) ou ativação administrativa.
- **Precisa de coachId?** Coach → forçado para si. Admin → opcional (validado no mesmo time). Super_admin → opcional, mas **teamId é obrigatório**.
- **Precisa de teamId?** Super_admin **deve** informar. Admin/coach → derivado do token. **Nunca há aluno sem teamId** (cai no `GUTO_CORE_TEAM_ID` só em contexto interno/B2C).
- **Quando GutoMemory nasce?** Um **seed** nasce na criação (`updateMemoryFromStudentPatch`). A memória **real** (consentimento, calibragem, pacto) só existe depois que o aluno completa o onboarding no app.

---

## 8. Contrato de cadastro/convite

### Payload de criação — `POST /admin/students`
```jsonc
{
  "firstName": "Will",            // obrigatório
  "lastName": "Santos",           // obrigatório
  "email": "will@exemplo.com",    // obrigatório, válido, normalizado p/ lowercase
  "phone": "+55 11 99999-0001",   // obrigatório no backend hoje (ver tensão §21)
  "teamId": "action-fit",         // obrigatório p/ super_admin; ignorado/forçado p/ admin/coach
  "coachId": "c001",              // opcional p/ admin (validado); forçado ao próprio p/ coach
  "language": "pt",               // opcional (idioma inicial; aluno confirma no app)
  "active": false,                // opcional; default = (tem senha)
  "password": null,               // opcional; se ausente e !active → gera convite
  "visibleInArena": true,         // opcional, default true
  "accessDurationDays": 30,       // opcional, default 30
  "notes": "..."                  // observações opcionais
}
```
> `accessStatus`/`plan` do aluno não são campos de entrada: derivam de `active` (`subscriptionStatus`/`paymentStatus = active | pending_payment`) e do plano **do time**, não do aluno.

### Resposta de sucesso — `201 Created`
```jsonc
{
  "user": { /* UserAccess completo */ },
  "student": { /* visão de painel: risco, XP, streak, avatarStage... */ },
  "inviteLink": "https://.../convite/<rawToken>",  // só quando NÃO há senha
  "temporaryPassword": "GUTO-ab12cd34"             // só quando senha temporária foi gerada
}
```

### Respostas de erro esperadas (contrato)
| Situação | HTTP | code / mensagem |
|---|---|---|
| Email/nome/telefone inválido | `400` | mensagem de campo obrigatório |
| Super_admin sem teamId | `400` | `GUTO_TEAM_REQUIRED` |
| Email duplicado | `409`/`400` | **GAP:** ver §21 — confirmar tratamento explícito de duplicado |
| Plano cheio | `403`/`409` | erro de `ensureTeamPlanCapacity` (limite atingido) |
| Admin/coach tentando outro time | `403` | `TEAM_ACCESS_FORBIDDEN` |
| Coach criando p/ outro coach | `403` | `COACH_STUDENT_ACCESS_FORBIDDEN` |
| Coach inexistente / de outro time | `404`/`403` | "Coach não encontrado" / `TEAM_ACCESS_FORBIDDEN` |
| Conta student tentando criar | `403` | `ADMIN_ACCESS_FORBIDDEN` |
| Token inválido/expirado (claim) | `404`/`410` | convite `expired`/`revoked` → orientar regenerar |
| Acesso pausado/expirado (app) | `403` | `ACCESS_PAUSED` / `SUBSCRIPTION_EXPIRED` |

### Convite — endpoints
- `GET /admin/students/:userId/invite` → invite atual + `inviteLink` (só se `pending_claim` e com `rawToken`); mensagens para `active`/`expired`.
- `POST /admin/students/:userId/invite/regenerate` → novo token + link; log `invite_regenerated`.
- App: `GET /auth/invite/:token` (preview), `POST /auth/invite/:token/claim` (define senha, ativa, +30 dias).

---

## 9. Relação com onboarding do aluno

O painel **precisa mostrar o status de onboarding** do aluno. Hoje esse status é **derivado** da `GutoMemory` (retornada em `GET /admin/students/:userId`), pois **não há um campo único `onboardingStage`** no backend (ver GAP em §21). Estados a exibir, derivados destes campos reais:

| Estado | Como derivar (campos reais) |
|---|---|
| Convite pendente / sem primeiro acesso | `UserAccess.active === false` e invite `pending_claim` |
| Sem consentimento | `memory.consentHealthFitness` e `memory.acceptedTerms` ausentes/false |
| Consentimento aceito | `memory.consentAcceptedAt` presente (`consentHealthFitness && acceptedTerms`) |
| Nome confirmado | `UserAccess.name` confirmado pelo aluno (Nome Soberano — sobrescreve o `presetName` do convite) |
| Calibragem incompleta | faltam campos: `biologicalSex`, `trainingLevel`, `trainingGoal`, `heightCm`, `weightKg`, etc. |
| Calibragem completa | campos de calibragem preenchidos + `resolvedFields` para os 3 campos livres |
| Pacto aceito | `memory.initialXpGranted === true` (XP-buffer do pacto concedido) |
| Sistema ativo | consentimento + calibragem + pacto + `active` |

**Recomendação P0:** o painel deve transformar isso num badge claro de onboarding ("Convite pendente / Consentimento / Calibragem X% / Ativo"). **Recomendação P1 backend:** expor um `onboardingStage` derivado em `buildStudentView` para o painel não recalcular regra de negócio no frontend.

---

## 10. Calibragem no painel

Campos reais da calibragem na `GutoMemory` (`server.ts`):

| Campo (painel) | Campo (código) |
|---|---|
| nome | `UserAccess.name` (Nome Soberano) |
| idioma | idioma do app (lei; PT/EN/IT) |
| sexo biológico | `biologicalSex` |
| idade | `userAge` / `trainingAge` |
| peso | `weightKg` |
| altura | `heightCm` |
| objetivo | `trainingGoal` |
| nível de treino | `trainingLevel` / `trainingStatus` |
| local de treino | `preferredTrainingLocation` / `trainingLocation` |
| país | `country` / `countryCode` |
| cidade | `city` |
| restrições alimentares (NÃO COMO) | `foodRestrictions` (campo **único**) |
| patologia/dor/limitação | `trainingPathology` / `trainingLimitations` |
| `resolvedFields` | resultado do `dirty-data-resolver` para os 3 campos livres (country / pathology / foodRestrictions) |
| consentimento | `consentHealthFitness`, `acceptedTerms`, `consentAcceptedAt`, `consentRevokedAt` |

### Regras de edição
- **Nunca editar `GutoMemory` como JSON cru.** A edição flui por `PATCH /admin/students/:userId` com um objeto `calibration` controlado (`updateAdminStudent`). **GAP:** ainda **não existe** um endpoint dedicado de calibragem com validação por campo (o doc estratégico pede isso). Ver §21.
- **Coach pode editar:** calibragem física padrão dos seus alunos (peso, altura, nível, objetivo, local, dor/limitação).
- **Só admin/super_admin:** mudanças sensíveis de acesso/assinatura, troca de coach, troca de time.
- **Exige confirmação:** qualquer alteração que **invalida** treino ou dieta.
- **Invalida dieta:** mudar `weightKg`, `heightCm`, `biologicalSex`, `trainingGoal`, `country`/`city`, `foodRestrictions` (NÃO COMO). O campo NÃO COMO é **soberano** para dieta.
- **Invalida treino:** mudar `trainingLevel`, `trainingGoal`, `preferredTrainingLocation`, `trainingPathology`/`trainingLimitations`.
- **Nunca sobrescrever automaticamente:** Nome Soberano; consentimento; XP/streak; e qualquer campo se o plano correspondente estiver `lockedByCoach`.
- **Patologia ≠ restrição alimentar.** Patologia entra em treino (cuidado/limitação), **não** em dieta. Restrição alimentar real vive só no campo NÃO COMO (`foodRestrictions`). (Ver `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` e `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md`.)

---

## 11. Treino no painel

Endpoints reais (`/admin/students/:userId/workout*`):
- `GET .../workout` (atual), `GET .../workout/today`, `GET .../workout/week`, `GET .../workout/history`
- `PUT .../workout` (edição manual), `PATCH .../workout`, `PUT .../workout/week`
- `POST .../workout/generate` (GUTO gera via `workout-curator.ts`), `.../lock`, `.../unlock`, `.../reset`

Regras:
- **GUTO gera treino** com base na memória (calibragem, objetivo, local, nível, histórico, dor). Coach **visualiza** e **edita**.
- **Coach pode travar** (`lock` → `lockedByCoach = true`). Com `lockedByCoach`, **o GUTO não sobrescreve** automaticamente (confirmado em `admin-router.ts` e no app; teste de não-override existe).
- **Toda edição gera audit log:** `workout_edited`, `workout_generated`, `workout_locked`, `workout_unlocked`, `workout_reset`, `workout_weekly_saved`.
- **Patologia/cuidados precisam aparecer** ao montar treino (vêm de `trainingPathology`/`trainingLimitations`).
- **Vídeos locais precisam permanecer válidos:** exercício **sem `videoUrl`** não pode aparecer no app (validação em `workout-catalog-validation.ts` / `exercise-video-validation.ts`). O painel não pode gravar exercício sem vídeo válido.
- **Respeitar nível:** iniciante/consistente/avançado (`workout-level.ts`, `workout-progression.ts`).
- **Chega ao app:** padrão Request → Redis → Fetch. O aluno vê na **próxima abertura** da tela (não há websocket para treino/dieta).

---

## 12. Dieta no painel

Endpoints reais (`/admin/students/:userId/diet*`), mesmo padrão do treino: `GET` (atual/today/week/history), `PUT`/`PATCH`, `POST .../generate|lock|unlock|reset`. Persistência em `diet-store.ts` (Redis→fs→memória); macros em `nutrition.ts`; alimentos em `food-catalog.ts` + `food-availability.ts`.

Regras:
- **GUTO gera dieta** com base na memória nutricional (peso, altura, sexo biológico, objetivo, país/cidade, NÃO COMO).
- **Dieta NÃO usa patologia como restrição alimentar.** Só o campo **NÃO COMO** (`foodRestrictions`) é restrição alimentar, e ele é **soberano**.
- **País/cidade influenciam** a disponibilidade de alimentos.
- **Coach/admin pode editar e travar** (`lock` → `lockedByCoach`). Com `lockedByCoach`, **o GUTO não sobrescreve** (evidência: dieta bloqueada é preservada; teste `guto-diet-invalidation.test.ts`).
- **Toda edição gera audit log:** `diet_edited`, `diet_generated`, `diet_locked`, `diet_unlocked`, `diet_reset`, `diet_weekly_saved`.
- **O editor barra alimento proibido pelo NÃO COMO.**
- **Chega ao app** na próxima abertura (Request → Redis → Fetch).

---

## 13. Arena, percurso, XP e evolução no painel

O painel **lê** (não escreve) gamificação. O que deve mostrar:

- **XP** (semanal/mensal/total), **streak**, **estágio do GUTO** (`getAvatarStage(totalXp)`: Baby/Teen/Adult/Elite).
- **Status vital** do GUTO (vivo/risco/morto — leitura; ver §14).
- **Histórico de validações** (`validationHistory`; `GET .../workout/history`).
- **Percurso** e **posição na arena** (semanal/mensal do time; geral global) via `arena-store.ts`/`coachRankingsRouter`.
- **Logs de treino/dieta** e **sinais de risco/inatividade** (`risk-classifier.ts`): Verde (≤48h), Atenção (3–5 dias), Crítico (≥6 dias).

> **NÃO implementar morte/XP/evolução nesta linha de trabalho.** Só **documentar a dependência e a leitura**. O painel **nunca** edita XP/streak/estágio à mão — é mérito real. Detalhes em `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` e `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md`.

---

## 14. Acesso, assinatura e bloqueios

Lógica em `auth-middleware.ts` (`requireActiveUser`, `resolveBlockedAccessCode`) e endpoints `/admin/students/:userId/*`:

| Estado | Código / endpoint |
|---|---|
| **ACCESS_PAUSED** | retornado pelo app quando inativo/pausado/arquivado/pendente |
| **SUBSCRIPTION_EXPIRED** | quando assinatura expirada/cancelada ou `subscriptionEndsAt` no passado |
| **GUTO_DECEASED** | **dependência futura** — `resolveBlockedAccessCode` **NÃO trata morte** hoje; morte é status comercial, não bloqueio de middleware. Não implementar agora. |

Ações do painel (todas geram log):
- **Pausar aluno:** `POST /admin/students/:userId/pause` (`requireAdmin`) → app redireciona para `/acesso-pausado`.
- **Reativar:** `POST .../reactivate` (`requireAdmin`).
- **Renovar acesso:** `POST .../renew` (`requireAdmin`).
- **Resetar senha:** `POST .../reset-password` (`requireAdmin`).
- **Resetar progresso/dados:** `POST .../reset` (`requireAdmin`; escopos `weekly|monthly|individual|validationHistory|all`).
- **Remover aluno:** `DELETE /admin/students/:userId` (soft delete); hard-delete é exclusivo do super_admin (rota legada `POST .../hard-delete` em `coach-router.ts`, ou `deleteStudentEverywhere`).
- **LGPD/consentimento:** revogação de consentimento existe (`consent_revoked`, `deleteOwnAccount`, `revokeConsent`). O painel **respeita** consentimento; não pode burlar termos nem reviver GUTO morto sem liberação comercial.

---

## 15. Auditoria e logs

`addLog` (`log-store.ts`, `GET /admin/logs`) + `appendMemoryAudit` (`memory.memoryAudit`). Tipos de ação **reais** já emitidos pelo `admin-router.ts`:

```
user_created, user_updated, user_deleted
access_reactivated, access_paused, access_renewed, password_reset, arena_reset
coach_created, coach_updated, coach_deleted, coach_assigned, coach_unassigned
workout_edited, workout_generated, workout_locked, workout_unlocked, workout_reset, workout_weekly_saved
diet_edited, diet_generated, diet_locked, diet_unlocked, diet_reset, diet_weekly_saved
team_created, team_updated
invite_regenerated
custom_exercise_requested, custom_exercise_approved   (+ reject)
consent_accepted, consent_revoked
```

Cada log carrega: `timestamp`, `actorUserId`, `actorRole`, `targetUserId`, `action`, `metadata` (antes/depois quando aplicável). Cobertura da matriz exigida pela tarefa: **quase toda já existe**. **GAP:** confirmar log explícito em `invite_generated` na **criação** (hoje há `invite_regenerated`; a criação emite `user_created` com `inviteLink` no retorno). Ver §21.

---

## 16. Erros e mensagens

O painel **não pode falhar silenciosamente**. Mensagens mínimas (a maioria já tem code no backend):

| Cenário | code / comportamento esperado no painel |
|---|---|
| Email duplicado | mensagem clara "email já cadastrado" — **GAP de code explícito (§21)** |
| Limite de plano | "Limite do plano atingido — faça upgrade"; botão desabilitado |
| Falta de teamId | `GUTO_TEAM_REQUIRED` → pedir seleção de empresa |
| Falta de coachId | pedir coach (quando exigido) |
| Token inválido/expirado | orientar **regenerar convite** |
| Aluno sem acesso | `ACCESS_PAUSED` / `SUBSCRIPTION_EXPIRED` → mostrar status e ação |
| Backend offline | toast de erro de rede (não fingir sucesso) |
| Permissão negada | `403` (`TEAM_ACCESS_FORBIDDEN`, `COACH_STUDENT_ACCESS_FORBIDDEN`, `ADMIN_ACCESS_FORBIDDEN`) → mensagem específica |
| Dados incompletos | `400` por campo |
| Acessar aluno de outro time | `403 TEAM_ACCESS_FORBIDDEN` — **nunca** revelar dados |

Hoje o cockpit usa `adminErrorMessage`/`toast` (`sonner`) para superficializar erros — a implementação P0 deve garantir cobertura de **todos** os códigos acima.

---

## 17. Mobile / tablet / desktop

- **Desktop primeiro** — operação real do coach/admin/super_admin é em desktop.
- **iPad/tablet aceitável** — leitura e ações seguras fora da mesa.
- **Mobile apenas consulta emergencial** — ver status, risco, último treino; não é a interface principal de edição.

O shell compartilhado (`components/panel/shell.tsx`, `sidebar.tsx`, `header.tsx`) já foi pensado responsivo. O app do aluno (React Native/Expo) é coisa **separada** e não se confunde com o painel web (Next.js).

---

## 18. O que é P0 do painel

Mínimo para destravar o teste end-to-end e o beta:

1. **Login admin/coach** funcionando (já existe: `/auth/admin/login`, `/auth/coach/login`).
2. **Criar/convidar aluno** pelo caminho canônico (`/coach` → `POST /admin/students`), com convite válido.
3. **Aluno consegue entrar no app** (claim do convite ou senha temporária).
4. **Painel lista aluno** (`GET /admin/students`).
5. **Painel abre detalhe do aluno** (`GET /admin/students/:userId` → user + memory).
6. **Painel mostra status de onboarding** (derivado da memória — §9).
7. **Painel mostra calibragem** (read + edição controlada — §10).
8. **Painel gera/vê treino** (`GET`/`POST .../workout` — §11).
9. **Painel gera/vê dieta** (`GET`/`POST .../diet` — §12).
10. **Permissões de time/coach corretas** (isolamento §3, testes de isolamento verdes).

---

## 19. O que é P1 / P2

**P1:**
- Edição e trava de treino/dieta (`lock`/`unlock` — já há endpoint; garantir UX).
- Reset de senha; pausar/reativar/renovar acesso.
- Logs básicos visíveis (`GET /admin/logs`).
- Erro claro para todos os códigos (§16).
- `onboardingStage` derivado no backend (§9).
- Decisão e execução sobre `/admin`+`/empresa` (ligar à API real **ou** consolidar em `/coach`).

**P2:**
- Dashboards premium, gráficos, analytics avançado.
- Exportação (CSV/PDF).
- Melhorias visuais, fila de pendências de "treino bloqueado virou revisão".
- Recursos premium por plano.

---

## 20. Critérios de pronto da implementação futura

A Fase Painel só está pronta quando **todos** forem verdade:

- [ ] admin cria aluno real;
- [ ] coach cria aluno real (quando permitido);
- [ ] aluno recebe convite/login válido;
- [ ] aluno entra no app;
- [ ] aluno completa consentimento/calibragem/pacto;
- [ ] painel vê essa memória;
- [ ] painel gera ou vê treino;
- [ ] painel gera ou vê dieta;
- [ ] coach **não** vê aluno de outro time;
- [ ] erro de email duplicado aparece;
- [ ] limite de plano é respeitado;
- [ ] `tsc` passa (frontend e backend);
- [ ] backend tests passam (incl. `guto-team-isolation`, `guto-team-limits`, `guto-team-plans`, `guto-access-blocking`, `guto.legacy-coach-routes`);
- [ ] frontend build passa;
- [ ] Playwright focado passa **ou** a falha está documentada como infraestrutura.

---

## 21. Mapa do código atual

### Frontend do painel — arquivos reais (`guto-app-v0/`)
**Canônico funcional (`/coach`, API real):**
- `app/coach/page.tsx`
- `app/coach/_components/cockpit-layout.tsx`, `cockpit-context.tsx`, `controls.tsx`, `ui.tsx`, `create-dialogs.tsx`, `student-drawer.tsx`, `coach-drawer.tsx`, `empresa-drawer.tsx`, `qa-demo-banner.tsx`
- `app/coach/_components/screens/`: `hoje`, `empresas`, `students`, `coaches`, `treinos`, `dietas`, `aprovacoes`, `banco`, `arena`, `logs`
- `app/coach/_components/tabs/`: `tab-resumo`, `tab-calibragem`, `tab-treino`, `tab-dieta`, `tab-acesso`, `tab-historico`
- `app/coach/_hooks/`: `use-coach-data`, `use-admin-permissions`, `use-student-actions`, `use-student-detail`, `use-coach-detail`, `use-empresa-detail`, `use-aprovacoes`, `use-coach-filters`
- `lib/api/admin.ts` (cliente da API real `/admin/*`), `lib/api/auth.ts`, `lib/api/client.ts`

**Mock / casa futura (`/admin`, `/empresa`):**
- `app/admin/page.tsx`, `app/admin/_components/sala-app.tsx`, `screens/visao-geral-screen.tsx`, `screens/setup-wizard-screen.tsx`, `modals/*`
- `app/admin/login/page.tsx` (login real, redireciona por papel)
- `app/admin/teams/[teamId]/*` (detalhe de empresa, read-only)
- `app/empresa/page.tsx`, `app/empresa/_components/*` (stub)
- `components/panel/*` (shell compartilhado), `lib/panel/*` (`data-source.ts`, `mocks.ts`, `types.ts`, `i18n.ts`, `tokens.ts`, `helpers.ts`)

**Legado / protótipo de design (não-runtime):**
- `adm/project/coach-panel/*.jsx`, `adm/project/coach-panel/Coach Panel.html`
- `design_handoff_guto_coach_panel/`

### Backend do painel — arquivos reais (`guto-backend/`)
- `src/admin-router.ts` (**canônico**, 2063 linhas), `src/auth-router.ts`, `src/auth-middleware.ts`
- `src/coach-router.ts` (**legado**, 410 por padrão; só `coachRankingsRouter` ativo)
- Stores: `user-access-store.ts`, `team-store.ts`, `team-plans.ts`, `invite-store.ts`, `log-store.ts`, `memory-store.ts`, `diet-store.ts`, `custom-exercise-store.ts`, `arena-store.ts`, `push-store.ts`
- Lógica: `workout-curator.ts`, `workout-level.ts`, `workout-progression.ts`, `workout-catalog-validation.ts`, `exercise-video-validation.ts`, `nutrition.ts`, `food-catalog.ts`, `food-availability.ts`, `risk-classifier.ts`, `dirty-data-resolver.ts`, `arena.ts`, `guto-evolution.ts`
- `server.ts` (monta routers; define `GutoMemory`; memória/treino/dieta/arena)
- Tests: `guto-team-isolation`, `guto-team-limits`, `guto-team-plans`, `guto-access-blocking`, `guto.legacy-coach-routes`

### Endpoints encontrados (`/admin/*`)
- Students: `GET|POST /students` (=/users), `GET|PATCH|DELETE /students/:id`, `POST /students/:id/{reactivate,pause,renew,reset-password,reset}`
- Convite: `GET /students/:id/invite`, `POST /students/:id/invite/regenerate`
- Workout: `GET|PUT|PATCH /students/:id/workout`, `GET .../workout/{today,week,history}`, `PUT .../workout/week`, `POST .../workout/{generate,lock,unlock,reset}`
- Diet: `GET|PUT|PATCH /students/:id/diet`, `GET .../diet/{today,week,history}`, `PUT .../diet/week`, `POST .../diet/{generate,lock,unlock,reset}`
- Coaches: `GET|POST /coaches`, `PATCH|DELETE /coaches/:id`, `POST|DELETE /coaches/:id/students/:studentId`
- Teams: `GET /teams`, `POST /teams` (super), `PATCH /teams/:id` (super), `GET /team/summary`
- Exercises: `GET /exercises/catalog`, `GET|POST /exercises/custom`, `POST /exercises/custom/:id/{approve,reject}`
- Logs: `GET /logs`; Maintenance: `POST /maintenance/backfill-arena-initial-xp`
- Auth: `POST /auth/{admin,coach,user}/login`, `GET /auth/me`, `GET /auth/invite/:token`, `POST /auth/invite/:token/claim`, `POST /auth/logout`

### Endpoints faltantes / GAPs
- **Status de onboarding dedicado:** não há `onboardingStage` no `buildStudentView`; o painel deriva da memória. (P1)
- **Endpoint validado de calibragem por campo:** não existe; calibragem entra via `PATCH /students/:id` com `calibration` (o doc estratégico pede rota validada). (P1)
- **Email duplicado:** confirmar `code`/HTTP explícito na criação (não verificado na auditoria). (P0/P1)
- **`invite_generated` na criação:** hoje a criação emite `user_created` com `inviteLink`; o log explícito de `invite_generated` só aparece no regenerate. (P2)
- **Agregados `/admin/panel/*`:** previstos no doc estratégico, **não existem**; agregação hoje via `/admin/team/summary` + cliente.

### Mocks encontrados
- `lib/panel/data-source.ts` + `lib/panel/mocks.ts` → alimentam `/admin` e `/empresa`. `IS_MOCK_DATA` default **true** (flag `NEXT_PUBLIC_USE_MOCKS` ausente). `mockGuard()` quebra se desligar mock sem fonte real.

### Caminhos legados
- Backend: `/guto/coach/*` (410, `GUTO_ENABLE_LEGACY_COACH_ROUTES` default false).
- Frontend: `adm/project/coach-panel/*`, `design_handoff_guto_coach_panel/`.

### Riscos
1. **Dois caminhos visíveis ao usuário** (super/admin → mock; coach → real) por causa do redirect de login. **Causa raiz da confusão.** Decisão em §6.
2. **Vazamento de mock** se `NEXT_PUBLIC_USE_MOCKS` não for `false` em produção e `/admin`/`/empresa` forem usados.
3. **Telefone obrigatório no cadastro** (`POST /admin/students` exige `phone` válido) **conflita** com a regra de privacidade do GUTO ("telefone não pertence à calibragem/memória do aluno"). Telefone aqui é contato de `UserAccess`, **não** entra em `GutoMemory` — mas a obrigatoriedade precisa de **decisão de produto**: manter obrigatório (contato comercial) ou tornar opcional para aluno B2C.
4. **Calibragem editável sem rota validada por campo** — risco de gravar dado inconsistente; mitigar antes de liberar edição ampla.
5. **`/empresa` é stub** — o papel `admin` cai numa tela incompleta hoje.

---

## 22. Próxima tarefa recomendada

> **Fase Painel P0 — corrigir o fluxo mínimo: criar aluno → convite/login → onboarding → painel lê memória → treino/dieta.**
>
> **Caminho canônico obrigatório:** trabalhar em **`app/coach`** (frontend) contra **`/admin/*`** (backend). **Não** usar `/guto/coach/*` (legado, 410). **Não** criar tela nova fora do cockpit. **Não** ligar `/admin`/`/empresa` mock no P0 sem decisão de §6.
>
> **Escopo do P0:**
> 1. Garantir `POST /admin/students` end-to-end pelo cockpit, com mensagens claras (email duplicado, plano cheio, time/coach faltando) — §8/§16.
> 2. Garantir convite válido (`GET`/`regenerate`) e claim no app (`/auth/invite/:token/claim`) — §7.
> 3. Detalhe do aluno (`GET /admin/students/:userId`) mostrando **status de onboarding** derivado da memória — §9.
> 4. Calibragem read + edição controlada (via `PATCH` com `calibration`) — §10.
> 5. Ver/gerar treino e dieta (`GET`/`POST .../workout|diet`), respeitando `lockedByCoach` — §11/§12.
> 6. Isolamento de time/coach validado (testes verdes) — §3.
>
> **Decisões de produto a fechar antes/junto:** (a) convite vs senha como padrão; (b) telefone obrigatório vs opcional; (c) destino de `/admin`+`/empresa` (ligar à API real ou consolidar em `/coach`).
>
> **Critérios de pronto:** §20.

---

### Apêndice — confirmações desta consolidação
- **Nenhum código, teste ou configuração foi alterado.** Esta tarefa é documentação.
- **Proatividade / Fase 4 não foi tocada** — citada apenas como dependência de leitura (§13), conforme `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md`.
- Auditoria baseada em: `guto-backend/src/{admin-router,coach-router,auth-router,auth-middleware,team-plans,invite-store,user-access-store,log-store,memory-store}.ts`, `guto-backend/server.ts`, e `guto-app-v0/{app/admin,app/coach,app/empresa,components/panel,lib/panel,lib/api}/**`, cruzada com `guto-app-v0/docs/GUTO_INVENTARIO_COMPLETO_ESTADO_ATUAL.md`.
