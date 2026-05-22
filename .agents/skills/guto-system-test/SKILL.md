---
name: guto-system-test
description: "Testa e valida 100% do sistema GUTO online: backend, API, banco de dados (Redis), autenticação, flows de treino e dieta, geração de XP, arena, câmera, admin panel e integração coach→aluno. Use quando o usuário disser 'testa o sistema', 'verifica se está tudo funcionando', 'o sistema está online?', 'faz um health check completo', ou antes de um deploy/release."
---

# System Test — Verificação Completa do Sistema GUTO

Protocolo de teste end-to-end de todas as camadas do sistema GUTO. Executa do backend ao frontend, cobrindo cada subsistema crítico.

---

## Stack de Produção

| Camada | URL / Local |
|--------|------------|
| Backend | `https://cerebroguto.onrender.com` |
| Frontend/Coach Panel | Vercel (verificar URL em produção) |
| Redis | Upstash `https://innocent-cow-112561.upstash.io` |
| Supabase (presence) | `https://olzycotraeufsvdccwwg.supabase.co` |
| Proxy local | `http://localhost:3001` (dev) |

---

## Fase 1 — Backend Health

### 1.1 Servidor online
```bash
curl -s -o /dev/null -w "%{http_code}" https://cerebroguto.onrender.com/health 2>/dev/null || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null
```
Esperado: `200`. Se `000` = servidor down. Se `502` = Render ainda inicializando (aguardar 30s).

### 1.2 TypeScript do backend compila
```bash
cd /Users/williandossantos/GUTOO/guto-backend && npx tsc --noEmit 2>&1 | head -30
```

### 1.3 Dependências do backend
```bash
cd /Users/williandossantos/GUTOO/guto-backend && npm list --depth=0 2>&1 | grep -E "UNMET|invalid|error" || echo "OK"
```

### 1.4 TypeScript do frontend compila
```bash
cd /Users/williandossantos/GUTOO/guto-app-v0 && npx tsc --noEmit 2>&1 | head -30
```

---

## Fase 2 — Autenticação

### 2.1 Login admin funciona
```bash
# Testar endpoint de login (admin ou coach)
curl -s -X POST https://cerebroguto.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"[ADMIN_EMAIL_DO_ENV]","password":"[ADMIN_PASS_DO_ENV]"}' \
  -w "\nHTTP: %{http_code}" | tail -5
```
Esperado: HTTP 200 + JSON com `token`.

### 2.2 Verificar JWT_SECRET configurado
```bash
grep "JWT_SECRET" /Users/williandossantos/GUTOO/guto-backend/.env 2>/dev/null | head -1 | sed 's/=.*/=***/'
```

### 2.3 Token inválido retorna 401
```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer token_invalido" \
  https://cerebroguto.onrender.com/admin/students
```
Esperado: `401`.

---

## Fase 3 — Redis / Persistência

### 3.1 Redis acessível
```bash
# Testar via endpoint que usa Redis
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer [TOKEN_ADMIN]" \
  https://cerebroguto.onrender.com/admin/students
```
Se 200: Redis está funcional (o endpoint lê do Redis). Se 500: checar `.env` UPSTASH_REDIS_URL.

### 3.2 Verificar variáveis de ambiente do Redis
```bash
grep -E "UPSTASH|REDIS" /Users/williandossantos/GUTOO/guto-backend/.env 2>/dev/null | sed 's/=.*/=***/'
```

### 3.3 Fallback de filesystem
```bash
ls /Users/williandossantos/GUTOO/guto-backend/data/*.json 2>/dev/null || echo "Sem fallback de arquivo"
```

---

## Fase 4 — Testes Automatizados do Backend

```bash
cd /Users/williandossantos/GUTOO/guto-backend && npm test 2>&1 | tail -40
```

### Suítes críticas a verificar:
| Arquivo de Teste | O que valida |
|---|---|
| `guto.integration.test.ts` | Core: chat, treino, dieta |
| `guto-workout.test.ts` | Geração e edição de treinos |
| `guto-weekly-workout.test.ts` | Plano semanal de treinos |
| `guto-weekly-diet.test.ts` | Plano semanal de dietas |
| `guto-evolution.test.ts` | Evolução do avatar (Baby→Elite) |
| `guto-arena-global-ranking.test.ts` | XP e ranking |
| `guto-team-isolation.test.ts` | Isolamento de dados por time |
| `guto.legacy-coach-routes.test.ts` | Rotas de compatibilidade |
| `proactivity-resolver.test.ts` | Sistema proativo |

Critério de passe: todos os testes `✓ pass`. Qualquer `✗ fail` ou `error` documenta e reporta.

---

## Fase 5 — API Admin (endpoints críticos)

Para cada endpoint, usar o token obtido na Fase 2.

### 5.1 Listar alunos
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/students | python3 -m json.tool 2>/dev/null | head -20
```
Esperado: `200` + array de alunos.

### 5.2 Listar coaches
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/coaches
```

### 5.3 Listar times/empresas
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/teams
```

### 5.4 Catálogo de exercícios
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/exercises/catalog | python3 -m json.tool 2>/dev/null | head -10
```
Esperado: array de exercícios com vídeos.

### 5.5 Logs
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/logs
```

---

## Fase 6 — Fluxo Treino (end-to-end)

Escolher um `userId` de aluno existente.

### 6.1 GET treino atual
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/students/[USER_ID]/workout
```
Esperado: `200` + objeto de treino com exercícios e vídeos.

### 6.2 Treino tem vídeos em todos os exercícios
Verificar no JSON retornado que NENHUM exercício tem `videoUrl: null` ou `videoUrl: ""`.

### 6.3 GET plano semanal de treinos
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/students/[USER_ID]/workout/week
```

---

## Fase 7 — Fluxo Dieta (end-to-end)

### 7.1 GET dieta atual
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/students/[USER_ID]/diet
```
Esperado: `200` + objeto com refeições, macros calculados.

### 7.2 GET plano semanal de dieta
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/students/[USER_ID]/diet/week
```

---

## Fase 8 — Arena e XP

### 8.1 Ranking global acessível
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/arena
```
Esperado: `200` + lista de duplas com XP.

---

## Fase 9 — Exercícios Customizados

### 9.1 Fila de aprovações
```bash
curl -s -w "\nHTTP: %{http_code}" \
  -H "Authorization: Bearer [TOKEN]" \
  https://cerebroguto.onrender.com/admin/exercises/custom
```

---

## Fase 10 — Frontend / Coach Panel

### 10.1 Build do frontend sem erros
```bash
cd /Users/williandossantos/GUTOO/guto-app-v0 && npm run build 2>&1 | tail -20
```
Esperado: `✓ Compiled successfully` ou equivalente. Zero erros de build.

### 10.2 Variáveis de ambiente do frontend
```bash
grep -E "NEXT_PUBLIC_|API_URL|SUPABASE" /Users/williandossantos/GUTOO/guto-app-v0/.env* 2>/dev/null | sed 's/=.*/=***/'
```

### 10.3 Proxy de API configurado
```bash
cat /Users/williandossantos/GUTOO/guto-app-v0/app/api/guto/\[...path\]/route.ts 2>/dev/null | head -20
```

---

## Fase 11 — Integrações Externas

### 11.1 Supabase (presence)
```bash
grep "SUPABASE" /Users/williandossantos/GUTOO/guto-backend/.env 2>/dev/null | sed 's/=.*/=***/'
```

### 11.2 AI (Gemini/Codex)
```bash
grep -E "GEMINI|ANTHROPIC|OPENAI" /Users/williandossantos/GUTOO/guto-backend/.env 2>/dev/null | sed 's/=.*/=***/'
```
Verificar que a chave existe e não está vazia.

### 11.3 Stripe
```bash
grep "STRIPE" /Users/williandossantos/GUTOO/guto-backend/.env 2>/dev/null | sed 's/=.*/=***/'
```

---

## Relatório Final

```
GUTO SYSTEM TEST — [data]
==========================

BACKEND
  Servidor:         ✅/❌ HTTP [código]
  TypeScript:       ✅/❌ [N erros]
  Testes (N/total): ✅/❌

PERSISTÊNCIA
  Redis:            ✅/❌
  Env vars:         ✅/❌

APIs CRÍTICAS
  Auth:             ✅/❌
  Alunos:           ✅/❌
  Coaches:          ✅/❌
  Times:            ✅/❌
  Exercícios:       ✅/❌
  Treinos:          ✅/❌
  Dietas:           ✅/❌
  Arena:            ✅/❌

FRONTEND
  Build:            ✅/❌
  Env vars:         ✅/❌

INTEGRAÇÕES
  Supabase:         ✅/❌ (env presente)
  AI (Gemini):      ✅/❌ (env presente)
  Stripe:           ✅/❌ (env presente)

PROBLEMAS CRÍTICOS (bloqueiam operação):
  - [lista]

PROBLEMAS NÃO-CRÍTICOS (monitorar):
  - [lista]
```
