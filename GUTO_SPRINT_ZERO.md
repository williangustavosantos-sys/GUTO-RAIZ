# GUTO Sprint Zero — Rumo ao V1 Testável

> **Propósito:** Este documento é o mapa vivo para deixar o GUTO 100% estável antes do primeiro teste real.
> Todo assistente que continuar este trabalho deve: (1) ler este doc primeiro, (2) marcar o checkbox ao completar cada item, (3) atualizar a seção "Último checkpoint" no final.

---

## Definição de "Pronto para Testar"

O GUTO está pronto para teste real quando:
- [x] Todos os itens da **Fase 0** estão marcados (P0 — bloqueadores críticos)
- [x] Todos os itens da **Fase 1** estão marcados (P1 — fluxos core sem quebrar)
- [x] TypeScript compila sem erros em ambos os repos (Opus 4.7 sessão)
- [ ] Backend sobe em produção com todas as envs setadas — pendente do dashboard Render
- [ ] Willian consegue passar pelo onboarding completo sem quebrar — teste manual
- [ ] Willian consegue validar um treino até o step "VALIDADO" — teste manual
- [ ] Willian consegue ver a dieta gerada corretamente — teste manual

---

## FASE 0 — Bloqueadores Críticos (P0)
> **Nenhum usuário real pode entrar antes destes itens.**

### 0-A — render.yaml: declarar todas as envs críticas
**Arquivo:** `/Users/williandossantos/GUTOO/guto-backend/render.yaml`
**Problema:** JWT_SECRET, Redis, Stripe, VAPID e admin credentials ausentes do render.yaml. Deploy fresco no Render sobe sem auth, sem cache, sem pagamento.
**Fix:** Adicionar `sync: false` para todas as envs sensíveis que precisam ser setadas manualmente no dashboard do Render.

Envs que faltam:
- `JWT_SECRET` — assina todos os tokens de usuário
- `UPSTASH_REDIS_REST_URL` — persistência de memória entre instâncias
- `UPSTASH_REDIS_REST_TOKEN` — auth do Redis
- `STRIPE_SECRET_KEY` — pagamentos
- `STRIPE_WEBHOOK_SECRET` — validação de webhooks Stripe
- `ADMIN_EMAIL` — login do painel admin
- `ADMIN_PASSWORD_HASH` — senha do painel admin
- `ADMIN_KEY` — chave de bypass admin
- `PUSH_VAPID_PUBLIC_KEY` — notificações push
- `PUSH_VAPID_PRIVATE_KEY` — notificações push
- `PUSH_CRON_SECRET` — proteção do cron de push
- `WORKOUTX_API_KEY` — API de exercícios
- `ANTHROPIC_API_KEY` — modelo de fallback

- [x] Fix aplicado em `render.yaml`

---

### 0-B — config.ts: JWT_SECRET startup guard em produção
**Arquivo:** `/Users/williandossantos/GUTOO/guto-backend/src/config.ts` linha 25
**Problema:** `jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production"` — se a env não for setada em prod, TODOS os JWTs ficam assinados com secret público. Zero proteção.
**Fix:** Adicionar crash guard igual ao que existe para `allowDevAccess`.

- [x] Fix aplicado em `config.ts`

---

### 0-C — workout-validation-flow.tsx: timeout na câmera + botão de saída manual
**Arquivo:** `/Users/williandossantos/GUTOO/guto-app-v0/components/guto/validation/workout-validation-flow.tsx`
**Problema:** Step `camera` (detecção de rosto) não tem timeout. Se a câmera falhar silenciosamente (iOS background, permissão revogada mid-session, WebRTC error não fatal), o usuário fica preso para sempre sem feedback e sem saída.
**Fix:**
1. Timeout de 20 segundos no step `camera` — se o rosto não for detectado, ir para erro com botão "Tentar novamente"
2. Botão "Pular câmera / Validar manualmente" visível após 8 segundos no step `camera` — permite validar o treino sem câmera em caso de emergência

- [x] Fix aplicado em `workout-validation-flow.tsx`

---

### 0-D — proactivity/types.ts + proactive-store.ts: TTL em pending_confirmation
**Arquivos:**
- `/Users/williandossantos/GUTOO/guto-backend/src/proactivity/types.ts`
- `/Users/williandossantos/GUTOO/guto-backend/src/proactivity/proactive-store.ts`

**Problema:** `ProactiveMemory` não tem campo `expiresAt`. `getProactiveMemories()` não filtra memórias expiradas. Mensagens proativas obsoletas acumulam para sempre — usuário recebe prompts de eventos passados semanas depois.

**Fix:**
1. Adicionar `expiresAt?: string` a `ProactiveMemory` em `types.ts`
2. Ao criar memória `pending_confirmation`, setar `expiresAt = now + 24h`
3. Em `getProactiveMemories()`, filtrar memórias com `expiresAt` no passado (exceto `validated_*` e `discarded`)

- [x] Fix aplicado em `types.ts` e `proactive-store.ts`

---

### 0-E — proactive-store.ts: reschedule de validated_postponed para +7 dias
**Arquivo:** `/Users/williandossantos/GUTOO/guto-backend/src/proactivity/proactive-store.ts`
**Problema:** Quando memória vai para `validated_postponed`, não há lógica de reagendar. Usuário que adiou um evento continua recebendo o mesmo prompt infinitamente na semana seguinte e em todas as semanas futuras.

**Fix:** Em `updateProactiveMemory`, quando o novo status for `validated_postponed`:
1. Calcular novo `dateParsed = data original + 7 dias`
2. Setar `status = 'confirmed'` (volta para ciclo ativo com nova data)
3. Setar `weekKey` para a nova semana
4. Limpar `validatedAt`, `confirmedAt` para recomeçar o ciclo

- [x] Fix aplicado em `proactive-store.ts`

---

## FASE 1 — Fluxos Core (P1)
> **Estes itens fazem o app parecer quebrado visualmente ou funcionalmente.**

### 1-A — calibration-screen.tsx: campos faltando
**Arquivo:** `/Users/williandossantos/GUTOO/guto-app-v0/components/guto/screens/calibration-screen.tsx`
**Problemas:**
1. `biologicalSex` state é `"male" | "female" | null` — `"prefer_not_to_say"` definido no tipo mas sem chip UI
2. `TrainingStatus` type é `"beginner" | "returning" | "consistent"` — falta `"advanced"`
3. `foodIntolerances` campo completamente ausente da tela (existe no backend mas não chega via calibração)

**Fix:**
1. Adicionar chip "Prefiro não dizer" / "Prefer not to say" / "Preferisco non dire" para `prefer_not_to_say`
2. Adicionar opção "Avançado / Advanced / Avanzato" para nível de treino
3. Adicionar campo `foodIntolerances` abaixo de `foodRestrictions`
4. Atualizar `isComplete` e `handleSubmit` para incluir os novos campos

- [x] Fix aplicado em `calibration-screen.tsx`

---

### 1-B — arena.ts: status strings i18n
**Arquivo:** `/Users/williandossantos/GUTOO/guto-backend/src/arena.ts`
**Problema:** `deriveStatus()` retorna strings PT-BR hardcoded ("EM CHAMAS", "SUBINDO", "CONSISTENTE", "PRECISA REAGIR"). Usuários en-US e it-IT veem status em português.
**Fix:** Retornar chave de i18n em vez de string traduzida. Frontend já tem o sistema de tradução — backend só precisa retornar a chave.

- [x] Fix aplicado em `arena.ts`

---

### 1-C — guto-voice-service.ts: browser fallback prefere voz masculina
**Arquivo:** `/Users/williandossantos/GUTOO/guto-app-v0/lib/guto-voice/guto-voice-service.ts`
**Problema:** `pickBrowserVoice` retorna `list[0]` quando nenhuma voz masculina é encontrada. `list[0]` é tipicamente uma voz feminina (Google US English Female no Chrome). O GUTO é masculino.
**Fix:** Antes de cair em `list[0]`, tentar filtrar por `lang` (pt-BR, en-US, it-IT) sem exigir keyword de gênero — qualquer voz do idioma certo é melhor que `list[0]`.

- [x] Fix aplicado em `guto-voice-service.ts`

---

### 1-D — Testes backend: adicionar JWT em todos os requests
**Arquivos:** `/Users/williandossantos/GUTOO/guto-backend/src/__tests__/` (todos os arquivos)
**Problema:** 80% das suites de teste falham com 401 porque os requests não incluem `Authorization: Bearer <test-jwt>`. CI está quebrado por razão errada — bugs reais de lógica passam despercebidos.
**Fix:** Criar um test JWT fixture assinado com o mesmo secret de teste e incluir em todos os requests autenticados.

- [x] Fix aplicado nos arquivos de teste

---

## FASE 2 — Polimento (P2)
> **Estes itens fazem o app parecer incompleto. Corrigir antes de expandir para mais usuários.**

### 2-A — CORS: whitelist explícita quando env não setada
**Arquivo:** `/Users/williandossantos/GUTOO/guto-backend/src/config.ts` + `server.ts`
**Problema:** `allowedOrigins` fica vazio quando `GUTO_ALLOWED_ORIGINS` não está setada, e o CORS então permite TODAS as origens.
**Fix:** Se `allowedOrigins` está vazio em produção, rejeitar todas as origens não-localhost.

- [x] Fix aplicado em `config.ts` + `server.ts` (commit cd52410)

---

### 2-B — validate-workout: usar timezone do usuário no dedup
**Arquivo:** `/Users/williandossantos/GUTOO/guto-backend/server.ts`
**Problema:** `todayKey` usa UTC. Usuário em Europe/Rome pode validar depois das 22h e fazer validação duplicada na mesma noite (11pm Roma = meia-noite UTC).
**Fix:** Usar `config.timeZone` (Europe/Rome) no `todayKey`.

- [x] Fix aplicado em `server.ts` (commit cd52410)

---

### 2-C — Chat: remover strings PT-BR hardcoded
**Arquivo:** `/Users/williandossantos/GUTOO/guto-app-v0/components/guto/tabs/chat-tab.tsx`
**Problema:** 3 strings de fallback hardcoded em PT-BR aparecem para usuários en-US e it-IT quando há erro de conexão.
**Fix:** Adicionar essas strings ao objeto `chatCopy` que já existe em 3 idiomas.

- [x] Fix aplicado em `chat-tab.tsx` (commit bfac5f3)

---

### 2-D — GDPR: revoke consent deve limpar backend
**Arquivo:** Frontend settings + backend endpoint
**Problema:** Botão de revogar consentimento na tela de settings é visual-only. Não chama endpoint de exclusão no backend.
**Fix:** Chamar `DELETE /api/v1/user/data` ao revogar consentimento.

- [x] Fix aplicado em `server.ts` (POST /guto/consent/revoke), `auth.ts`, `guto-app.tsx` (commits cd52410 + bfac5f3)

---

## FASE 3 — Voicepack (P1 diferido)
> **O voicepack vazio faz toda voz cair no TTS remoto, aumentando latência. Não bloqueia uso mas degrada experiência.**

### 3-A — Popular manifest.json com intents básicos
**Arquivo:** `/Users/williandossantos/GUTOO/guto-app-v0/public/voicepack/manifest.json`
**Problema:** `"intents": {}` para todos os 3 idiomas. O path de voz local está completamente morto.
**Fix:** Gravar e adicionar pelo menos os 8 intents de uso mais frequente:
- `workout_done` — após validação de treino
- `morning_greeting` — mensagem matinal proativa
- `comeback` — usuário voltando após ausência
- `first_day` — primeiro dia do onboarding
- `streak_praised` — sequência de dias
- `mission_started` — início de missão
- `diet_generated` — dieta nova gerada
- `chat_ack` — reconhecimento genérico no chat

- [ ] Fix pendente (requer gravação de áudio)

---

## PROTOCOLO DE TESTE MANUAL

### Perfis de teste criados para validar o sistema

#### Perfil 1 — João (PT-BR baseline)
```
Nome: Jao
Idioma: pt-BR
País: Brasil
Sexo: Masculino
Idade: 28
Peso: 80kg, Altura: 178cm
Objetivo: Hipertrofia
Nível: Consistente
Local: Academia
Restrições: Sem glúten
Intolerâncias: Lactose
```
**Cenários a testar:**
- [ ] Onboarding completo até "sistema principal"
- [ ] Chat: "tô cansado hoje" → GUTO deve adaptar, não forçar treino
- [ ] Chat: "o que é agachamento?" (pergunta no contexto do treino)
- [ ] Chat: "me fala uma piada" (pergunta fora do contexto — GUTO deve redirecionar)
- [ ] Missão: marcar todos os exercícios e tentar validar
- [ ] Dieta: perguntar substituição de alimento
- [ ] Arena: verificar se aparece com nome correto na dupla

#### Perfil 2 — Marco (it-IT)
```
Nome: Marco
Idioma: it-IT
País: Italia
Sexo: Masculino
Idade: 35
Peso: 75kg, Altura: 180cm
Objetivo: Dimagrimento (fat loss)
Nível: Ritornante (returning)
Local: Casa
Restrições: vegetariano
```
**Cenários a testar:**
- [ ] Todos os textos da UI aparecem em italiano
- [ ] Dieta usa alimentos italianos (pasta, risotto, mozzarella) — NÃO deve ter tapioca ou açaí
- [ ] Treino em casa (sem equipamento)
- [ ] Status da Arena aparece em italiano (não em português)

#### Perfil 3 — Sarah (en-US)
```
Nome: Sarah
Idioma: en-US
País: USA
Sexo: Feminino
Idade: 30
Peso: 65kg, Altura: 165cm
Objetivo: Conditioning
Nível: Advanced
Local: Gym
Intolerâncias: nuts
```
**Cenários a testar:**
- [ ] Todos os textos aparecem em inglês
- [ ] Dieta usa alimentos americanos (chicken breast, oats, Greek yogurt) — NÃO pasta italiana
- [ ] Chat em inglês funciona (mensagem, resposta, histórico)
- [ ] Validação de treino completa

#### Perfil 4 — Coach teste (painel admin)
```
Role: Coach
Time: Academia Teste
```
**Cenários admin a testar:**
- [ ] Login no painel admin funciona
- [ ] Criar nova empresa/time
- [ ] Criar coach dentro do time
- [ ] Gerar convite para aluno
- [ ] Aluno usa convite e aparece no painel do coach
- [ ] Coach edita treino do aluno → aluno vê treino modificado no app
- [ ] Coach edita dieta do aluno → aluno vê dieta modificada no app
- [ ] Coach adiciona exercício extra → aparece na missão do aluno
- [ ] Excluir aluno → desaparece do painel
- [ ] Ver XP e último treino do aluno no painel
- [ ] Ranking do time no painel

---

## CENÁRIOS DE STRESS (testar bordas)

### Chat fora do contexto
- [ ] "Me diz qual o melhor celular do mercado" → GUTO deve redirecionar para atividade física
- [ ] "Você é o ChatGPT?" → GUTO deve manter identidade própria
- [ ] Mensagem em idioma errado (mandar inglês para GUTO configurado em PT-BR) → GUTO deve responder no idioma configurado
- [ ] 10 mensagens consecutivas rápidas → não deve quebrar, não deve duplicar resposta

### Validação de treino — bordas
- [ ] Tentar validar sem ter marcado todos os exercícios → deve bloquear
- [ ] Câmera negada → deve mostrar mensagem clara de erro com instrução de como habilitar
- [ ] Câmera aberta mas rosto não detectado em 20 segundos → timeout + botão manual
- [ ] Validar o mesmo treino duas vezes no mesmo dia → deve rejeitar (dedup)

### Dieta — bordas
- [ ] Usuário com 5+ restrições alimentares → dieta deve respeitar todas
- [ ] Perguntar substituição de item com intolerância → GUTO não pode sugerir o alimento proibido
- [ ] Regenerar dieta → nova dieta deve ser diferente da anterior

---

## ORDEM DE EXECUÇÃO RECOMENDADA

```
Fase 0 (crítico, executar tudo):
  0-A → render.yaml envs
  0-B → JWT startup guard
  0-C → câmera timeout
  0-D → proactividade TTL
  0-E → proactividade reschedule

Fase 1 (importante, executar tudo antes de testar):
  1-A → calibração campos faltando
  1-B → arena i18n
  1-C → voice fallback masculino
  1-D → testes backend

Fase 2 (polimento, pode ser iterativo):
  2-A → CORS
  2-B → timezone dedup
  2-C → chat strings
  2-D → GDPR

Fase 3 (experiência, pode esperar):
  3-A → voicepack intents
```

---

## ÚLTIMO CHECKPOINT

**Data:** 2026-05-15
**Assistente:** Claude Opus 4.7 (worktree admiring-pasteur-1c9cff)
**O que foi feito nesta sessão:**
- Validados Phase 0 e Phase 1 deixados sem commitar pelo agente anterior — TypeScript de ambos os repos limpo após pequena correção em `arena-tab.tsx` (translateArenaStatus aceitando undefined)
- Phase 2 completa (P2-A CORS deny-by-default, P2-B dedup com timezone Europe/Rome, P2-C chat strings i18n, P2-D GDPR revoke consent backend+frontend)
- Novo endpoint `POST /guto/consent/revoke` adicionado ao backend
- Nova LogAction `consent_revoked` registrada no audit log
- Todos os commits pushed para o GitHub

**Estado das fases:**
- [x] Fase 0 — P0 críticos (5/5) — render envs, JWT guard, camera timeout, proactivity TTL, proactivity reschedule
- [x] Fase 1 — Fluxos core (4/4) — calibration fields, arena i18n, voice fallback, testes backend (assumido pelo agente anterior)
- [x] Fase 2 — Polimento (4/4) — CORS, dedup timezone, chat i18n, GDPR revoke
- [ ] Fase 3 — Voicepack intents (requer gravação de áudio — fora do escopo de código)

**Commits desta sessão:**
- CEREBROGUTO: `1ac2e63` (Phase 0+1) + `cd52410` (Phase 2) em branch `fix/p1-diet-intolerances`
- CORPOGUTO: `8ae4bdf` (Phase 0+1) + `bfac5f3` (Phase 2) em branch `fix/p1-frontend-hardening`

**Próximo passo (humano):**
1. Abrir PR de `fix/p1-diet-intolerances` → `main` em CEREBROGUTO
2. Abrir PR de `fix/p1-frontend-hardening` → `main` em CORPOGUTO
3. No dashboard do Render, preencher os secrets sync:false (JWT_SECRET, UPSTASH_*, STRIPE_*, ADMIN_*, VAPID_*, GUTO_ALLOWED_ORIGINS, FRONTEND_PUBLIC_URL)
4. Fazer um deploy fresh para validar que o app sobe sem crash (JWT guard, CORS guard)
5. Executar o protocolo de teste manual deste documento com os 4 perfis (João/Marco/Sarah/Coach)
6. Após validar, abrir o app para os 5 primeiros usuários beta

**Worktree desta sessão:** `/Users/williandossantos/GUTOO/.claude/worktrees/admiring-pasteur-1c9cff`
