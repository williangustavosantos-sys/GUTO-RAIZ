# GUTO — Plano de Execução para o Beta (OBSOLETO)

> ⚠️ **Este documento está obsoleto.**  
> Substituído por **`GUTO_PLANO_EXECUCAO_V2.md`** em 13 de Maio de 2026.  
> Mantido aqui apenas para referência histórica. Não usar como guia de trabalho.

**20 duplas. Custo mínimo. Foco total.**
_Versão 1.0 — Maio 2026 (SUPERSEDED)_

---

## Contexto rápido

A análise completa está em `ANALISE_GUTO_2026.md`. Este documento é o plano de ação — o que fazer, em qual ordem, quanto vai custar e quanto tempo leva.

**Diagnóstico resumido:**
- O produto está ~70% completo para o beta
- 3 dos 4 stores de dados já têm Redis implementado no código — só faltam as env vars no Render
- Arena store não tem Redis — precisa de código novo
- GUTO Online está funcional mas incompleto (5 de 11 estados da visão)
- Voicepack existe como estrutura mas não tem os áudios gerados
- Custo projetado para o beta: **~R$60–70/mês** (≈ $10–12/mês)

---

## Custo total projetado para o beta de 20 pessoas

| Serviço | Plano | Custo/mês |
|---------|-------|-----------|
| Render (backend) | Starter $7 | ~R$40 |
| Vercel (frontend) | Hobby — gratuito | R$0 |
| Upstash Redis | Free tier (10K cmds/dia) | R$0 |
| Gemini API | Free tier (15 req/min) | R$0 |
| Google Cloud TTS | ~500 sínteses únicas × $0.000016 | ~R$0.50 |
| **Total** | | **~R$40–45/mês** |

> **Observação sobre o Google TTS:** Cada frase é gerada UMA vez e cacheada no IndexedDB do dispositivo do usuário. Para 20 usuários com ~50 frases únicas = ~1.000 sínteses no total ao longo do beta inteiro. Custo: praticamente zero.

> **Sobre o Gemini Flash:** Para as exceções do GUTO Online (dor, substituição, fadiga), cada chamada usa max 80 tokens. Custo por chamada: ~$0.000003. Para 20 usuários fazendo 5 sessões/semana com 2 exceções/sessão = ~$0.006/mês. Arredonda para zero.

---

## Sprint 0 — Infra (30 minutos, $0)

**Objetivo:** Ativar persistência real nos 3 stores que já têm Redis pronto no código.

### O que fazer

**No painel do Render** (Settings → Environment Variables), adicionar:

```
UPSTASH_REDIS_REST_URL    = <URL do Upstash>
UPSTASH_REDIS_REST_TOKEN  = <Token do Upstash>
JWT_SECRET                = <string longa aleatória — nunca o default>
```

> O `JWT_SECRET` padrão é `"dev-secret-change-in-production"`. Se isso estiver em produção, qualquer pessoa pode forjar tokens de autenticação. Trocar agora.

### Como criar o Upstash (gratuito)

1. Acessa upstash.com → cria conta gratuita
2. Cria database → seleciona "Redis" → região mais próxima (ex: eu-west-1 para Itália)
3. Copia `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`
4. Cola no Render e faz redeploy

### O que isso resolve imediatamente

| Store | Dados que param de sumir |
|-------|--------------------------|
| `user-access-store.ts` | Todos os usuários cadastrados |
| `team-store.ts` | Times e estrutura de grupos |
| `invite-store.ts` | Convites gerados mas não usados |

**Tempo:** 30 minutos  
**Custo:** R$0 (free tier do Upstash cobre 20 usuários com folga enorme)

---

## Sprint 1 — Arena Store com Redis (2–3 horas, $0)

**Objetivo:** Arena (XP, rankings, perfis) não pode sumir no restart do Render.

### Problema

`arena-store.ts` é o único dos 4 stores que não tem Redis implementado. Usa só arquivo em `/tmp/arena-store.json` — que é apagado a cada deploy no Render.

### Solução

Seguir o padrão exato do `user-access-store.ts` que já funciona. O código é quase copy-paste.

### Código a adicionar em `arena-store.ts`

```typescript
// No topo do arquivo — adicionar imports
import { Redis } from "@upstash/redis"
import { config } from "./config"

// Instância Redis (lazy, só cria se env vars existem)
let _redis: Redis | null = null
function getRedis(): Redis | null {
  if (!config.upstashRedisUrl || !config.upstashRedisToken) return null
  if (!_redis) _redis = new Redis({ url: config.upstashRedisUrl, token: config.upstashRedisToken })
  return _redis
}

const REDIS_KEY = "guto:arena"

// Substituir readArenaStore() por:
async function readArenaStore(): Promise<ArenaStore> {
  const redis = getRedis()
  if (redis) {
    try {
      const data = await redis.get<ArenaStore>(REDIS_KEY)
      if (data) return data
    } catch (e) {
      console.warn("[arena-store] Redis read failed, falling back to file:", e)
    }
  }
  // fallback: lê arquivo (código existente)
  try {
    const raw = fs.readFileSync(ARENA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

// Substituir writeArenaStore() por:
async function writeArenaStore(store: ArenaStore): Promise<void> {
  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(REDIS_KEY, store)
    } catch (e) {
      console.warn("[arena-store] Redis write failed:", e)
    }
  }
  // sempre salva arquivo também (redundância barata)
  try {
    fs.mkdirSync(path.dirname(ARENA_FILE), { recursive: true })
    fs.writeFileSync(ARENA_FILE, JSON.stringify(store, null, 2))
  } catch (e) {
    console.warn("[arena-store] File write failed:", e)
  }
}
```

> **Atenção:** Vai precisar tornar as funções que chamam `readArenaStore` e `writeArenaStore` async se ainda não forem. Verificar todos os callers.

**Tempo:** 2–3 horas  
**Custo:** R$0

---

## Sprint 2 — Warm-up do cache Redis no startup (1 hora, $0)

**Objetivo:** Prevenir race condition onde o servidor sobe mas o `memCache` está vazio, fazendo as primeiras leituras síncronas falharem.

### Problema

`user-access-store.ts`, `team-store.ts` e `invite-store.ts` têm `readStoreSync()` que usa `memCache`. Se o servidor acabou de subir e nenhuma leitura async aconteceu ainda, `memCache` está vazio mesmo com Redis configurado.

### Solução

Em `server.ts`, no bloco de inicialização (logo depois do `app.listen`), adicionar:

```typescript
// Warm-up: carrega todos os stores em memCache antes de aceitar requests
async function warmUpCaches() {
  console.log("[startup] Warming up Redis caches...")
  await Promise.all([
    readStoreAsync(),          // user-access-store
    readTeamStoreAsync(),      // team-store  
    readInviteStoreAsync(),    // invite-store
    readArenaStore(),          // arena-store (novo)
  ])
  console.log("[startup] Cache warm-up complete")
}

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`)
  await warmUpCaches()
})
```

**Tempo:** 1 hora  
**Custo:** R$0

---

## Sprint 3 — Persistência de Sessão no GUTO Online (3–4 horas, $0)

**Objetivo:** Se o usuário fechar o app no meio de uma sessão, não reiniciar do zero.

### Problema

Todo o estado da sessão GUTO Online vive apenas em React state (`useState`). Fechar o app = perder o treino em andamento.

### Solução mínima (localStorage)

Em `guto-online-session.tsx`, salvar/restaurar estado crítico:

```typescript
// Chave de sessão
const SESSION_KEY = `guto-online-session-${workoutId}`

// Dados a persistir
interface PersistedSession {
  phase: SessionPhase
  currentExerciseIndex: number
  currentSet: number
  restEndsAt: number | null  // timestamp
  workoutId: string
  savedAt: number
}

// Salvar sempre que estado mudar (useEffect)
useEffect(() => {
  const data: PersistedSession = {
    phase, currentExerciseIndex, currentSet,
    restEndsAt, workoutId, savedAt: Date.now()
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
}, [phase, currentExerciseIndex, currentSet, restEndsAt])

// Restaurar no mount
useEffect(() => {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return
  try {
    const saved: PersistedSession = JSON.parse(raw)
    // Só restaura se for recente (< 2 horas)
    if (Date.now() - saved.savedAt < 2 * 60 * 60 * 1000) {
      setPhase(saved.phase === "executing" ? "paused" : saved.phase)
      setCurrentExerciseIndex(saved.currentExerciseIndex)
      setCurrentSet(saved.currentSet)
      // Não restaura restEndsAt — o descanso já passou
    }
    localStorage.removeItem(SESSION_KEY) // limpa após restaurar
  } catch { /* ignora */ }
}, [])
```

> Expiração de 2 horas: se o usuário voltou depois de mais tempo, mais fácil reiniciar do que continuar onde parou.

**Tempo:** 3–4 horas  
**Custo:** R$0

---

## Sprint 4 — Endpoint de Exceções IA para GUTO Online (4–6 horas, ~R$0)

**Objetivo:** Quando o usuário diz "doeu", "não tem esse equipamento" ou "tô com câimbra", o GUTO responde de forma inteligente em vez de usar texto hardcoded genérico.

### Backend: novo endpoint

Criar `POST /guto/online/exception` em `server.ts`:

```typescript
app.post("/guto/online/exception", authenticate, async (req, res) => {
  const { type, context } = req.body
  // type: "pain" | "substitute" | "fatigue" | "form_question"
  // context: { exercise: string, muscle: string, set: number, userMessage: string }

  const prompt = buildExceptionPrompt(type, context, req.user)
  
  const result = await Promise.race([
    callGeminiFlash(prompt, { maxTokens: 80, temperature: 0.3 }),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000))
  ])

  if (!result) {
    // Timeout: retorna fallback local
    return res.json({ text: EXCEPTION_FALLBACKS[type] })
  }
  
  res.json({ text: result })
})

// Fallbacks locais (nunca retorna erro para o usuário)
const EXCEPTION_FALLBACKS = {
  pain: "Para. Respira fundo. Esse exercício fica pra próxima sessão.",
  substitute: "Faz o mesmo padrão de movimento com peso corporal agora.",
  fatigue: "Reduz a carga em 20% e mantém a forma. Força.",
  form_question: "Foco na contração do músculo alvo. Vai devagar nessa série."
}
```

### Frontend: chamar o endpoint quando detectar intenção

Em `guto-online-session.tsx`, nas funções de detecção de comando:

```typescript
async function handleException(type: ExceptionType, userMessage: string) {
  // Mostra "pensando..." imediatamente
  setGutoSpeaking(true)
  setCurrentCaption("...")
  
  try {
    const response = await fetch("/api/guto/online/exception", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, context: { exercise: currentExercise.name, userMessage } }),
      signal: AbortSignal.timeout(5000)
    })
    const { text } = await response.json()
    await speakAndWait(text)
  } catch {
    // Fallback local se request falhar
    await speakAndWait(EXCEPTION_FALLBACKS_CLIENT[type])
  }
}
```

**Tempo:** 4–6 horas  
**Custo:** ~R$0 (Gemini Flash, 80 tokens, ~$0.000003/chamada)

---

## Sprint 5 — ARENA_GROUP hardcoded (1 hora, $0)

**Objetivo:** Remover o hardcode `"will-personal-alpha"` do frontend.

### Problema

Em algum ponto do frontend, o `arenaGroup` está fixo em `"will-personal-alpha"`. Usuários novos entram no ranking do grupo errado.

### Fix

Buscar no frontend por `"will-personal-alpha"` e substituir pela leitura do `user.teamId` que já vem no JWT decode ou no endpoint `/guto/me`:

```typescript
// Em vez de:
const arenaGroup = "will-personal-alpha"

// Usar:
const arenaGroup = user?.teamId ?? user?.arenaGroup ?? "global"
```

**Tempo:** 1 hora  
**Custo:** R$0

---

## Sprint 6 — Frases do GUTO Online (4–6 horas, ~R$3 one-time)

**Objetivo:** Ter variações de voz pré-geradas para os ~50 intents principais do GUTO Online. Elimina dependência de chamadas TTS em tempo real.

### O que criar

Arquivo `scripts/phrases-ptbr.json` com as frases chave:

```json
{
  "online_start_session": [
    "Bora. Treino montado, dupla pronta.",
    "Chegou a hora. Eu tô aqui do seu lado.",
    "Vamos nessa. Você sabe o que fazer."
  ],
  "online_exercise_intro": [
    "Próximo: {exercise}. {sets} séries de {reps}.",
    "{exercise} agora. Vamos nessa.",
    "Agora é {exercise}. Foca na execução."
  ],
  "online_set_done": [
    "Série feita. Descansa {rest} segundos.",
    "Boa. {rest} segundos e volta.",
    "Feito. Respira. {rest} segundos."
  ],
  "online_rest_ending": [
    "Três, dois, um — bora.",
    "Descansou bem. Próxima série.",
    "Acabou o descanso. Foca."
  ],
  "online_workout_done": [
    "Treino validado, {name}. Isso aqui vai pro percurso.",
    "Fechou. A dupla entregou hoje.",
    "Treino concluído. Você apareceu quando importava."
  ],
  "online_pain_detected": [
    "Para. Esse exercício sai da sessão de hoje.",
    "Entendido. Dor não é fraqueza, é sinal. Paramos aqui.",
    "Ok. Preserva o corpo. O treino adapta."
  ],
  "online_fatigue_detected": [
    "Cansado é diferente de impossível. Reduz a carga e continua.",
    "Entendido. Baixa o peso, mantém a forma.",
    "Tá pesado. Mas você ainda tá aqui. Isso é o que importa."
  ]
}
```

### Geração dos áudios

```bash
# Rodar UMA vez — gera os arquivos .mp3 em public/voicepack/pt-BR/
node scripts/generate-voicepack.mjs --lang pt-BR --limit 150
```

> Com ~150 sínteses no Google Cloud TTS a $0.000016/síntese = **$0.0024**. Arredonda para zero.

**Tempo:** 4–6 horas (criar frases + rodar script + verificar qualidade)  
**Custo:** ~R$0.01

---

## Sequência de execução recomendada

```
Dia 1 (manhã)   — Sprint 0: env vars Render + Upstash (30 min)
Dia 1 (tarde)   — Sprint 5: fix ARENA_GROUP hardcode (1 hora)
Dia 2           — Sprint 1: Redis no arena-store (3 horas)
Dia 3 (manhã)   — Sprint 2: warm-up de cache no startup (1 hora)
Dia 3 (tarde)   — Sprint 3: persistência de sessão GUTO Online (4 horas)
Dia 4           — Sprint 4: endpoint de exceções IA (6 horas)
Dia 5           — Sprint 6: criar frases + voicepack (6 horas)
Dia 6–7         — Testes internos com 3–5 pessoas antes de abrir para os 20
```

**Total: ~7 dias de desenvolvimento focado**

---

## O que NÃO fazer agora (redução de custo e foco)

Estas features estão na visão mas não bloqueiam o beta de 20 pessoas:

| Feature | Motivo para adiar |
|---------|-------------------|
| Voicepack em EN, ES, IT | Beta é PT-BR. Gera depois que confirmar que o fluxo funciona |
| Times de amigos (v2.0) | Feature de v2.0. Beta é individual |
| Wake word ("Ei GUTO") | Agradável, não essencial. Voice recognition já funciona com tap |
| Notificações push avançadas | Web Push já existe. Personalização fica pra depois |
| Stripe subscriptions | Beta é manual/gratuito. Ativa quando tiver >50 usuários |
| Painel admin completo | Coach pode usar `will-personal-alpha` por enquanto |
| GUTO Online 11 estados completos | 5 estados funcionam para validar a mecânica |

---

## Checklist de lançamento do beta

### Antes de mandar convite para qualquer pessoa

- [ ] Sprint 0 concluído — Redis conectado no Render
- [ ] JWT_SECRET trocado (não está mais com o valor default)
- [ ] Sprint 1 concluído — arena-store persiste no Redis
- [ ] Sprint 5 concluído — ARENA_GROUP não está mais hardcoded
- [ ] Testar fluxo completo: onboarding → calibragem → pacto → treino do dia → validação → XP na arena
- [ ] Testar logout + login em dispositivo diferente — sessão persiste

### Antes de atingir 10 usuários ativos

- [ ] Sprint 3 concluído — sessão GUTO Online persiste
- [ ] Sprint 4 concluído — exceções IA funcionando
- [ ] Sprint 2 concluído — warm-up de cache no startup

### Antes de atingir 20 usuários ativos

- [ ] Sprint 6 concluído — voicepack PT-BR gerado
- [ ] Monitoramento básico ativo: quantas duplas abriram o app nos últimos 7 dias
- [ ] Processo para resetar/corrigir dados manualmente se necessário

---

## Métricas do beta

O único número que define se o GUTO funcionou:

> **Quantas das 20 duplas ainda estão ativas depois de 30 dias**

Secundárias:
- Sessões GUTO Online iniciadas vs. completadas
- Média de XP por usuário na semana 2 vs. semana 4
- Quantas vezes o avatar "morreu" (Tamagotchi mechanic sendo usada)
- Quantos convites os 20 beta users geraram espontaneamente

---

## Custo recorrente projetado por faixa de crescimento

| Usuários | Redis | Gemini | Render | Total/mês |
|----------|-------|--------|--------|-----------|
| 0–20 (beta) | Free | Free | $7 | ~$7 |
| 20–200 | Free | Free | $7 | ~$7 |
| 200–1.000 | Free ($0) | Free | $7 + CDN mínimo | ~$15 |
| 1.000–5.000 | Upstash Pay-as-go ~$5 | ~$10 | $25 | ~$40 |
| 5.000+ | Negociar Redis dedicado | ~$50 | $50+ | ~$100+ |

> Upstash free tier aguenta até ~200 usuários ativos (10K comandos/dia ÷ ~50 ops/usuário/dia = 200). Não precisa upgradar antes disso.

---

_Documento gerado em maio 2026. Próxima revisão após completar o sprint 0._
