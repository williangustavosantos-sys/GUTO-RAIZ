---
name: guto-admin-flow
description: "Especialista no fluxo completo do painel administrativo do GUTO: hierarquia de permissões (super_admin > admin > coach), CRUD de alunos/coaches/times, geração e edição de treinos e dietas, aprovação de exercícios customizados, convites, como alterações do painel chegam ao app do aluno. Use quando o usuário reportar bugs no painel admin, pedir para criar/editar/corrigir qualquer parte do coach panel, quiser entender como uma mudança do coach chega no app, ou precisar implementar qualquer feature administrativa."
---

# Admin Flow — Fluxo Completo do Painel GUTO

Guia especialista da arquitetura administrativa completa do GUTO.

---

## Arquitetura dos Sistemas

```
guto-app-v0/          ← Next.js (Coach Panel web + proxy)
  app/coach/          ← Interface do painel admin
  app/admin/          ← Login admin
  lib/api/admin.ts    ← Métodos de API do painel (500+ linhas)
  lib/api/client.ts   ← HTTP client base (JWT, errors, timeout)

guto-backend/         ← Express.js (API)
  src/admin-router.ts ← Endpoints admin (85KB — rotas principais)
  src/coach-router.ts ← Endpoints coach (listagem, mutações)
  src/user-access-store.ts ← Persistência de usuários e roles
  src/team-store.ts   ← Persistência de times/empresas
  src/diet-store.ts   ← Persistência de dietas (Redis → filesystem → memory)
  src/custom-exercise-store.ts ← Exercícios customizados
  src/workout-curator.ts ← Lógica de geração de treinos
  src/nutrition.ts    ← Lógica de cálculo de macros
  src/exercise-catalog.ts ← Catálogo base (70KB)
```

---

## Hierarquia de Permissões

```
super_admin
  └── Tudo: deletar alunos permanentemente, gerenciar todos os times,
            ver todos os coaches e alunos de qualquer time
      Hook: use-admin-permissions.ts

admin
  └── CRUD de alunos do seu time, coaches do seu time,
      editar treinos/dietas, aprovar exercícios
      Não pode: hard delete, ver outros times

coach
  └── Ver e editar alunos atribuídos a ele
      CRUD de treinos e dietas dos seus alunos
      Solicitar exercícios customizados (não aprovar)
      Não pode: criar coaches, gerenciar times
```

**Arquivo de permissões:**
`guto-app-v0/app/coach/_hooks/use-admin-permissions.ts`

---

## Como Alterações do Painel Chegam ao App

**Padrão: Request → Redis → Fetch**

```
Coach edita treino no painel
  ↓
PUT /admin/students/:userId/workout
  ↓
admin-router.ts atualiza memory-store
  ↓
memory-store persiste no Redis (Upstash)
  ↓
Aluno abre o app → GET /workout
  ↓
App busca do Redis → exibe dados atualizados
```

**Não existe websocket ou push para sincronização de dados de treino/dieta.**
A atualização chega no app na próxima abertura da tela.

**Exceção — Presence (Supabase):** rastreia usuários ativos em tempo real,
mas só para presença, não para dados de treino/dieta.

---

## Fluxo Completo: Gerenciar Alunos

### Criar aluno
```
POST /admin/students
Body: { name, email, password, teamId, coachId? }
→ Cria conta + gera convite
→ admin.ts: createAdminStudent()
→ user-access-store.ts: salva role='student'
```

### Convidar aluno existente
```
GET /admin/students/:userId/invite    → retorna link de convite
POST /admin/students/:userId/invite/regenerate → novo link
→ admin.ts: getAdminStudentInvite(), regenerateAdminStudentInvite()
```

### Editar aluno
```
PATCH /admin/students/:userId
Body: { name?, email?, teamId?, coachId? }
→ admin.ts: updateAdminStudent()
```

### Pausar / Reativar / Renovar
```
POST /admin/students/:userId/pause          → pausa acesso
POST /admin/students/:userId/reactivate     → reativa
POST /admin/students/:userId/renew          → renova subscription
→ admin.ts: pauseAdminStudent/reactivateAdminStudent/renewAdminStudent()
```

### Resetar dados do aluno
```
POST /admin/students/:userId/reset
Body: { scope: 'weekly' | 'monthly' | 'individual' | 'validationHistory' | 'all' }
→ admin.ts: resetAdminStudent()
→ Limpa dados conforme escopo
```

### Deletar aluno
```
DELETE /admin/students/:userId            → soft delete (admin)
POST /admin/students/:userId/hard-delete  → permanente (super_admin only)
→ admin.ts: deleteAdminStudent()
→ coach-router.ts: hardDeleteStudent()
```

**Componentes do painel:**
- Lista: `guto-app-v0/app/coach/_components/screens/students-screen.tsx`
- Detalhe: tabs `tab-resumo`, `tab-treino`, `tab-dieta`, `tab-acesso`, `tab-calibragem`, `tab-historico`
- Dialogs: `create-dialogs.tsx`

---

## Fluxo Completo: Treinos

### GET treino do aluno
```
GET /admin/students/:userId/workout
→ admin.ts: getAdminStudentWorkout()
→ Retorna: exercícios com name, group, sets, reps, load, rest, cue, videoUrl
→ IMPORTANTE: nenhum exercício sem videoUrl deve aparecer no app
```

### Editar treino manualmente
```
PUT /admin/students/:userId/workout
Body: { exercises: [...], notes?: string }
→ admin.ts: updateAdminStudentWorkout()
→ Salvo no memory-store → Redis
→ Aluno vê na próxima abertura do app
```

### Gerar treino via IA
```
POST /admin/students/:userId/workout/generate
→ admin.ts: generateAdminStudentWorkout()
→ workout-curator.ts: lê calibragem do aluno → gera plano
→ Retorna novo treino (não salvo automaticamente — coach confirma)
```

### Bloquear / Desbloquear treino
```
POST /admin/students/:userId/workout/lock    → coach não pode mais editar
POST /admin/students/:userId/workout/unlock  → libera para edição
→ admin.ts: lockAdminStudentWorkout/unlockAdminStudentWorkout()
```

### Resetar treino
```
POST /admin/students/:userId/workout/reset
→ Remove treino personalizado, volta ao gerado por padrão
→ admin.ts: resetAdminStudentWorkout()
```

### Plano semanal de treinos
```
GET /admin/students/:userId/workout/week   → retorna 7 dias
PUT /admin/students/:userId/workout/week   → salva plano semanal
→ admin.ts: getAdminStudentWeeklyWorkout/updateAdminStudentWeeklyWorkout()
```

**Componente do painel:** `guto-app-v0/app/coach/_components/tabs/tab-treino.tsx`

---

## Fluxo Completo: Dietas

### GET dieta do aluno
```
GET /admin/students/:userId/diet
→ admin.ts: getAdminStudentDiet()
→ diet-store.ts: lê do Redis
→ Retorna: refeições por dia, alimentos, porções, calorias, macros
```

### Editar dieta manualmente
```
PUT /admin/students/:userId/diet
Body: { meals: [...], macros?: {...} }
→ admin.ts: updateAdminStudentDiet()
→ diet-store.ts: persiste no Redis
```

### Gerar dieta via IA
```
POST /admin/students/:userId/diet/generate
→ admin.ts: generateAdminStudentDiet()
→ nutrition.ts: calcula macros baseado na calibragem
→ food-catalog.ts + food-availability.ts: seleciona alimentos
```

### Bloquear / Desbloquear / Resetar dieta
```
POST /admin/students/:userId/diet/lock
POST /admin/students/:userId/diet/unlock
POST /admin/students/:userId/diet/reset
→ Mesmo padrão dos treinos
```

### Plano semanal de dieta
```
GET /admin/students/:userId/diet/week   → 7 dias de dieta
PUT /admin/students/:userId/diet/week   → salva plano semanal
→ admin.ts: getStudentWeeklyDiet/saveStudentWeeklyDiet()
```

**Componente do painel:** `guto-app-v0/app/coach/_components/tabs/tab-dieta.tsx`

---

## Fluxo Completo: Coaches

### Criar coach
```
POST /admin/coaches
Body: { name, email, password, teamId }
→ admin.ts: createAdminCoach()
→ user-access-store.ts: salva role='coach'
```

### Editar coach
```
PATCH /admin/coaches/:coachId
→ admin.ts: updateAdminCoach()
```

### Deletar coach
```
DELETE /admin/coaches/:coachId
→ admin.ts: deleteAdminCoach()
→ Alunos atribuídos ficam sem coach (não são deletados)
```

### Atribuir aluno a coach
```
POST /admin/coaches/:coachId/students/:studentId
→ admin.ts: assignStudentToCoach()
```

### Remover aluno de coach
```
DELETE /admin/coaches/:coachId/students/:studentId
→ admin.ts: unassignStudentFromCoach()
```

**Componente do painel:** `guto-app-v0/app/coach/_components/screens/coaches-screen.tsx`

---

## Fluxo Completo: Times / Empresas

### Criar time
```
POST /admin/teams
Body: { name, maxStudents?, maxCoaches? }
→ team-store.ts: salva time com limites
```

### Editar time
```
PATCH /admin/teams/:teamId
```

### Ver resumo do time
```
GET /admin/team/summary?teamId=...
→ Retorna: coaches, alunos, uso de capacidade
```

**Componente do painel:** `guto-app-v0/app/coach/_components/screens/empresas-screen.tsx`

---

## Fluxo Completo: Exercícios Customizados

### Aluno solicita exercício customizado no app
```
POST /admin/exercises/custom
Body: { name, description, videoUrl?, muscleGroup }
→ custom-exercise-store.ts: salva como 'pending'
```

### Coach/admin aprova
```
POST /admin/exercises/custom/:exerciseId/approve
→ Exercício entra no catálogo do time
→ admin.ts: approveAdminCustomExercise()
```

### Coach/admin rejeita
```
POST /admin/exercises/custom/:exerciseId/reject
Body: { reason }
→ admin.ts: rejectAdminCustomExercise()
```

### Ver fila de aprovações pendentes
```
GET /admin/exercises/custom
→ Lista exercícios com status pending/approved/rejected
```

### Ver catálogo base
```
GET /admin/exercises/catalog
→ exercise-catalog.ts: retorna todos os exercícios base (70KB de dados)
```

**Componente do painel:** `guto-app-v0/app/coach/_components/screens/aprovacoes-screen.tsx`
**Banco de exercícios:** `guto-app-v0/app/coach/_components/screens/banco-screen.tsx`

---

## Diagnóstico de Bugs no Admin Flow

### "Alteração do coach não aparece no app do aluno"
1. Checar se o PUT retornou 200 (network tab)
2. Checar se o aluno está usando cache — orientar fechar e reabrir o app
3. Verificar Redis: o dado foi persistido? (checar `diet-store.ts` ou `memory-store.ts`)
4. Verificar se o endpoint correto está sendo chamado (workout vs weekly-workout)

### "Coach não consegue ver aluno"
1. Verificar se o aluno está atribuído ao coach (`coachId` no perfil)
2. Verificar se o aluno está no mesmo `teamId` do coach
3. Checar `use-admin-permissions.ts` — role está correta?

### "Exercício não aparece no treino do aluno"
1. Verificar se `videoUrl` está preenchido — treino sem vídeo não aparece no app
2. Verificar se exercício customizado foi aprovado (status = 'approved')
3. Checar `workout-catalog-validation.ts` — validação pode estar rejeitando

### "Dieta mostra macros errados"
1. Verificar calibragem do aluno: peso, altura, objetivo
2. `nutrition.ts` recalcula baseado nesses dados
3. Coach pode override manual via PUT `/diet`

### "Novo admin/coach não consegue logar"
1. Verificar se `role` foi salvo corretamente em `user-access-store.ts`
2. Verificar se `teamId` está associado
3. JWT_SECRET deve ser o mesmo no momento de criação e de validação

### "Limite de alunos/coaches do time sendo ultrapassado"
1. `team-store.ts` tem `maxStudents` e `maxCoaches`
2. `guto-team-limits.test.ts` cobre esses casos
3. Endpoint retorna 403 quando limite atingido

---

## Checklist de Qualidade do Admin Flow

Antes de entregar qualquer feature do painel admin:

- [ ] Hierarquia de permissões respeitada (super_admin/admin/coach não veem o que não deveriam)
- [ ] Alteração persiste no Redis (não só in-memory)
- [ ] Aluno vê a mudança na próxima abertura do app
- [ ] Treinos têm `videoUrl` em todos os exercícios
- [ ] Dietas têm macros calculados corretamente
- [ ] Nenhum aluno aparece em coach errado
- [ ] Convites geram link funcional
- [ ] Hard delete só acessível para super_admin
- [ ] Exercícios customizados passam pelo fluxo de aprovação
- [ ] TypeScript compila sem erros nos arquivos do admin
