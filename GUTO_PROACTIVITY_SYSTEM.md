# GUTO — SISTEMA DE PROATIVIDADE
**Documento técnico com código completo**
**Versão 1.0 — Maio 2026**

---

## VISÃO DO SISTEMA

O GUTO não manda notificação. Ele está presente.

A diferença: uma notificação diz "lembrei de você". O GUTO diz "tava pensando na sua semana e vi que Roma vai fazer sol no fim de semana."

O sistema funciona em um ciclo simples:

```
COLETAR → ENTENDER → CONFIRMAR → ENRIQUECER → USAR → VALIDAR → DESCARTAR
```

Toda segunda-feira, o GUTO pergunta sobre a semana. Extrai o que importa. Confirma com o usuário antes de salvar. Enriquece com clima/feriados em background. Usa durante a semana quando faz sentido. Na semana seguinte, valida o que aconteceu antes de perguntar de novo.

**Regras inegociáveis:**
- GUTO nunca salva sem confirmar que entendeu certo
- GUTO nunca descarta sem validar que aconteceu
- GUTO não tem medo de perguntar de novo
- GUTO fala no idioma do usuário em todos os pontos do sistema
- GUTO nunca usa templates — o LLM decide como falar, com contexto real

---

## ARQUITETURA

```
guto-backend/src/
  services/
    proactivity/
      types.ts                  ← schema de memórias proativas
      weekly-conversation.ts    ← conversa de segunda
      memory-extractor.ts       ← extrai eventos do chat
      memory-enricher.ts        ← clima + feriados
      proactivity-injector.ts   ← injeta contexto no chat
      memory-validator.ts       ← valida e descarta
      index.ts                  ← exports

  routes/
    proactivity.ts              ← endpoints

  cron/
    proactivity-cron.ts         ← enriquecimento em background
```

---

## PARTE 1 — TYPES

**`services/proactivity/types.ts`**

```typescript
export type ProactiveMemoryType =
  | 'trip'         // viagem para algum lugar
  | 'commitment'   // compromisso, reunião, evento
  | 'schedule'     // mudança de horário de treino
  | 'health'       // limitação, dor, cansaço planejado
  | 'other'        // qualquer coisa que o GUTO julgou relevante

export type ProactiveMemoryStatus =
  | 'pending_confirmation'  // GUTO extraiu mas ainda não confirmou com usuário
  | 'confirmed'             // usuário confirmou, memória ativa
  | 'enriched'              // enriquecida com dados externos
  | 'surfaced'              // GUTO já usou durante a semana
  | 'pending_validation'    // semana passou, aguardando validação
  | 'validated_happened'    // aconteceu, pode descartar
  | 'validated_postponed'   // não aconteceu, moveu para próxima semana
  | 'discarded'             // descartada

export interface WeatherEnrichment {
  city: string
  date: string             // ISO date
  tempMin: number
  tempMax: number
  condition: string        // "sol", "chuva", "nublado"
  conditionRaw: string     // raw do API
  fetchedAt: string
}

export interface HolidayEnrichment {
  date: string
  name: string             // nome no idioma do usuário
  country: string
}

export interface ProactiveEnrichment {
  weather?: WeatherEnrichment[]
  holidays?: HolidayEnrichment[]
  fetchedAt?: string
}

export interface ProactiveMemory {
  id: string
  userId: string
  language: string         // pt-BR / en-US / it-IT
  weekStart: string        // ISO date da segunda-feira desta semana
  type: ProactiveMemoryType
  
  // O que o usuário disse — texto livre extraído pelo LLM
  rawSummary: string
  
  // Versão estruturada confirmada
  confirmedSummary?: string
  
  // Data/período relevante (pode ser null se não tiver data)
  eventDate?: string       // ISO date
  eventDateEnd?: string    // para viagens multi-dia
  
  // Localização relevante (para clima)
  location?: string        // ex: "Roma", "São Paulo"
  locationCountry?: string // ex: "IT", "BR"
  
  // Enriquecimento externo
  enrichment?: ProactiveEnrichment
  
  // Estado
  status: ProactiveMemoryStatus
  surfacedAt?: string      // quando GUTO usou durante a semana
  
  createdAt: string
  updatedAt: string
}

// O que o GUTO recebe como contexto ao responder no chat
export interface ProactivityContext {
  hasWeeklyConversationThisWeek: boolean
  weekStart: string
  memories: ProactiveMemory[]
  pendingValidation: ProactiveMemory[]  // semana passada, aguardando validação
  upcomingHolidays: HolidayEnrichment[]
}
```

---

## PARTE 2 — CONVERSA SEMANAL

**`services/proactivity/weekly-conversation.ts`**

```typescript
import { format, startOfWeek, isSameWeek } from 'date-fns'
import { ProactiveMemory, ProactivityContext } from './types'
import { db } from '@/lib/db'

// Verifica se o GUTO já fez a conversa de segunda dessa semana
export async function hasWeeklyConversationThisWeek(userId: string): Promise<boolean> {
  const weekStart = getWeekStart()
  const record = await db.proactiveWeeklyConversation.findFirst({
    where: { userId, weekStart }
  })
  return Boolean(record)
}

// Marca que a conversa semanal aconteceu
export async function markWeeklyConversationDone(userId: string): Promise<void> {
  const weekStart = getWeekStart()
  await db.proactiveWeeklyConversation.upsert({
    where: { userId_weekStart: { userId, weekStart } },
    create: { userId, weekStart, createdAt: new Date().toISOString() },
    update: { updatedAt: new Date().toISOString() }
  })
}

export function getWeekStart(): string {
  const now = new Date()
  const monday = startOfWeek(now, { weekStartsOn: 1 })
  return format(monday, 'yyyy-MM-dd')
}

// Retorna true se hoje é segunda-feira no timezone do usuário
export function isMondayForUser(timezone: string): boolean {
  const now = new Date()
  const localDay = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long'
  }).format(now)
  return localDay === 'Monday'
}

// Contexto completo para o LLM decidir como abrir a conversa semanal
export function buildWeeklyOpeningContext(
  userName: string,
  language: string,
  pendingValidation: ProactiveMemory[],
  holidays: Array<{ date: string; name: string }>
): string {
  const hasPendingValidation = pendingValidation.length > 0
  const hasHolidays = holidays.length > 0

  const validationContext = hasPendingValidation
    ? pendingValidation.map(m => `- ${m.confirmedSummary || m.rawSummary}`).join('\n')
    : ''

  const holidayContext = hasHolidays
    ? holidays.map(h => `- ${h.name} (${h.date})`).join('\n')
    : ''

  // Este contexto vai para o system prompt do GUTO
  // O GUTO decide como usar — não é script
  return `
[CONTEXTO DA CONVERSA SEMANAL]
Usuário: ${userName}
Idioma: ${language}
Semana que começa hoje.

${hasPendingValidation ? `MEMÓRIAS DA SEMANA PASSADA PARA VALIDAR:
${validationContext}

Antes de perguntar sobre essa semana, valide o que ficou pendente da semana passada.
Pergunte sobre cada item de forma natural — uma coisa de cada vez, não uma lista.
Só avance para a semana nova depois que o usuário confirmar o que aconteceu.` : ''}

${hasHolidays ? `FERIADOS DESTA SEMANA:
${holidayContext}

Se fizer sentido, mencione o feriado de forma natural ao perguntar sobre a semana.
Não force. Só mencione se for relevante para o planejamento.` : ''}

OBJETIVO:
Perguntar informalmente sobre como vai ser a semana — horários de treino, compromissos, viagens, qualquer coisa que possa afetar a rotina.
Tom: amigo que quer ajudar a montar o plano da semana.
Não é questionário. É conversa.
Faça uma pergunta de cada vez.
Se o usuário não quiser falar sobre a semana, tudo bem. Não insista.
`.trim()
}
```

---

## PARTE 3 — EXTRAÇÃO DE MEMÓRIA

O coração do sistema. Depois que o usuário responde à conversa semanal, o LLM extrai o que importa.

**`services/proactivity/memory-extractor.ts`**

```typescript
import OpenAI from 'openai'
import { ProactiveMemory, ProactiveMemoryType } from './types'
import { getWeekStart } from './weekly-conversation'
import { nanoid } from 'nanoid'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface ExtractedEvent {
  type: ProactiveMemoryType
  rawSummary: string
  eventDate?: string       // YYYY-MM-DD se mencionou data
  eventDateEnd?: string
  location?: string
  locationCountry?: string
  confidence: 'high' | 'medium' | 'low'
}

// Extrai eventos de uma conversa
// conversationText = o que o usuário disse nessa troca
export async function extractEventsFromConversation(
  conversationText: string,
  language: string,
  userTimezone: string,
  currentDate: string   // YYYY-MM-DD
): Promise<ExtractedEvent[]> {
  
  const systemPrompt = `
Você é um extrator de eventos relevantes de conversas.
Data atual: ${currentDate}
Idioma do usuário: ${language}

Analise o texto da conversa e extraia APENAS eventos que:
1. Têm data ou período futuro relevante (esta semana ou nas próximas semanas)
2. Podem afetar a rotina de treino ou a vida do usuário
3. O usuário mencionou com intenção clara

Tipos de evento:
- trip: viagem para outro lugar
- commitment: reunião, evento, compromisso específico
- schedule: mudança de horário de treino desta semana
- health: dor, limitação física, cansaço planejado
- other: outro evento relevante

Para cada evento extraído, informe:
- type: o tipo
- rawSummary: resumo natural em ${language} do que o usuário disse
- eventDate: YYYY-MM-DD se mencionou data (null se vago)
- eventDateEnd: YYYY-MM-DD se tiver período (null se ponto único)
- location: cidade ou lugar mencionado (null se não mencionou)
- locationCountry: código ISO do país (null se não identificável)
- confidence: high (data e evento claros), medium (evento claro, data vaga), low (incerto)

NÃO extraia:
- Eventos passados
- Coisas vagas sem contexto ("talvez", "sei lá")
- Informações sobre treino do dia atual (isso é outro sistema)

Retorne JSON array. Se não houver nada relevante, retorne [].
`.trim()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Conversa:\n${conversationText}` }
    ]
  })

  try {
    const parsed = JSON.parse(response.choices[0].message.content || '{}')
    return Array.isArray(parsed.events) ? parsed.events : []
  } catch {
    return []
  }
}

// Transforma eventos extraídos em ProactiveMemory com status pending_confirmation
export function buildPendingMemories(
  userId: string,
  language: string,
  events: ExtractedEvent[]
): ProactiveMemory[] {
  const weekStart = getWeekStart()
  const now = new Date().toISOString()

  // Só confirmar automaticamente eventos de alta confiança com data clara
  // Eventos medium/low passam por confirmação do GUTO antes de salvar
  return events.map(event => ({
    id: nanoid(),
    userId,
    language,
    weekStart,
    type: event.type,
    rawSummary: event.rawSummary,
    confirmedSummary: undefined,       // ainda não confirmado
    eventDate: event.eventDate,
    eventDateEnd: event.eventDateEnd,
    location: event.location,
    locationCountry: event.locationCountry,
    status: 'pending_confirmation' as const,
    createdAt: now,
    updatedAt: now
  }))
}

// Salva memórias pendentes no banco
export async function savePendingMemories(memories: ProactiveMemory[]): Promise<void> {
  if (memories.length === 0) return
  await db.proactiveMemory.createMany({ data: memories })
}
```

---

## PARTE 4 — CONFIRMAÇÃO COM O USUÁRIO

Esta é a parte mais importante. GUTO nunca salva sem confirmar que entendeu certo.

O sistema não usa um script de confirmação. Ele injeta o contexto no LLM e o GUTO confirma naturalmente na conversa.

**`services/proactivity/memory-extractor.ts` (continuação)**

```typescript
// Contexto de confirmação para o LLM
// Chamado quando há memórias pending_confirmation
export function buildConfirmationContext(
  pendingMemories: ProactiveMemory[],
  language: string
): string {
  const items = pendingMemories
    .map(m => `- ${m.rawSummary}${m.eventDate ? ` (${m.eventDate})` : ''}`)
    .join('\n')

  return `
[CONFIRMAÇÃO PENDENTE]
Você extraiu as seguintes informações da conversa do usuário:
${items}

INSTRUÇÃO:
Confirme com o usuário se entendeu certo.
- Faça de forma natural, como um amigo que quer ter certeza antes de anotar
- Confirme um item de cada vez se houver mais de um
- Se o usuário corrigir, anote a versão correta
- Se o usuário disser que você entendeu errado, pergunte de novo
- Não diga "vou salvar" ou "vou anotar" — apenas confirme se entendeu
- Se o usuário disser que não há nada importante, aceite e não force confirmação

Exemplo do tom (adapte para o idioma ${language}):
"Então você vai viajar para Roma na sexta, é isso? Só pra eu não esquecer."
"Entendi que quarta você tem reunião até tarde — então o treino seria antes. Certo?"
`.trim()
}

// Após usuário confirmar, transforma pending_confirmation em confirmed
export async function confirmMemory(
  memoryId: string,
  confirmedSummary: string
): Promise<void> {
  await db.proactiveMemory.update({
    where: { id: memoryId },
    data: {
      status: 'confirmed',
      confirmedSummary,
      updatedAt: new Date().toISOString()
    }
  })
}

// Descarta memória que o usuário disse que não existe
export async function discardMemory(memoryId: string): Promise<void> {
  await db.proactiveMemory.update({
    where: { id: memoryId },
    data: {
      status: 'discarded',
      updatedAt: new Date().toISOString()
    }
  })
}
```

---

## PARTE 5 — ENRIQUECIMENTO COM DADOS EXTERNOS

Roda em background depois que a memória é confirmada. Busca clima e feriados.

**`services/proactivity/memory-enricher.ts`**

```typescript
import { ProactiveMemory, WeatherEnrichment, HolidayEnrichment } from './types'

// ─── Clima ────────────────────────────────────────────────────────────────────

// Usa wttr.in — sem API key, gratuito
// Retorna clima para uma cidade em uma data específica
export async function fetchWeatherForLocation(
  city: string,
  date: string,         // YYYY-MM-DD
  language: string      // para traduzir a condição
): Promise<WeatherEnrichment | null> {
  try {
    // wttr.in retorna JSON com previsão de 3 dias
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) return null
    
    const data = await response.json()
    const weather = data?.weather
    if (!Array.isArray(weather) || weather.length === 0) return null

    // wttr.in retorna os próximos dias — encontrar o dia correto
    const targetDay = weather.find((w: any) => w.date === date) || weather[0]
    if (!targetDay) return null

    const conditionCode = targetDay.hourly?.[4]?.weatherCode || '113'
    const conditionRaw = targetDay.hourly?.[4]?.weatherDesc?.[0]?.value || ''
    
    return {
      city,
      date,
      tempMin: parseInt(targetDay.mintempC),
      tempMax: parseInt(targetDay.maxtempC),
      condition: translateWeatherCondition(conditionRaw, language),
      conditionRaw,
      fetchedAt: new Date().toISOString()
    }
  } catch {
    return null
  }
}

function translateWeatherCondition(condition: string, language: string): string {
  const lower = condition.toLowerCase()
  
  const translations: Record<string, Record<string, string>> = {
    'pt-BR': {
      sunny: 'sol',
      clear: 'céu limpo',
      cloudy: 'nublado',
      overcast: 'encoberto',
      rain: 'chuva',
      drizzle: 'garoa',
      snow: 'neve',
      storm: 'tempestade',
      fog: 'neblina',
    },
    'en-US': {
      sunny: 'sunny',
      clear: 'clear sky',
      cloudy: 'cloudy',
      overcast: 'overcast',
      rain: 'rain',
      drizzle: 'drizzle',
      snow: 'snow',
      storm: 'storm',
      fog: 'fog',
    },
    'it-IT': {
      sunny: 'sole',
      clear: 'cielo sereno',
      cloudy: 'nuvoloso',
      overcast: 'coperto',
      rain: 'pioggia',
      drizzle: 'pioggerella',
      snow: 'neve',
      storm: 'temporale',
      fog: 'nebbia',
    }
  }
  
  const lang = language in translations ? language : 'pt-BR'
  const map = translations[lang]
  
  if (lower.includes('sunny') || lower.includes('clear')) return map.sunny
  if (lower.includes('cloud')) return map.cloudy
  if (lower.includes('overcast')) return map.overcast
  if (lower.includes('drizzle')) return map.drizzle
  if (lower.includes('rain')) return map.rain
  if (lower.includes('snow') || lower.includes('blizzard')) return map.snow
  if (lower.includes('thunder') || lower.includes('storm')) return map.storm
  if (lower.includes('fog') || lower.includes('mist')) return map.fog
  
  return conditionRaw // fallback: retorna o original
}

// ─── Feriados ─────────────────────────────────────────────────────────────────

// Usa date.nager.at — gratuito, sem API key
export async function fetchHolidaysThisWeek(
  countryCode: string,   // ex: 'BR', 'IT', 'US'
  weekStart: string,     // YYYY-MM-DD (segunda-feira)
  language: string
): Promise<HolidayEnrichment[]> {
  try {
    const year = new Date(weekStart).getFullYear()
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) return []
    
    const holidays = await response.json()
    if (!Array.isArray(holidays)) return []
    
    // Filtrar feriados desta semana (segunda a domingo)
    const weekEnd = addDays(weekStart, 6)
    
    return holidays
      .filter((h: any) => h.date >= weekStart && h.date <= weekEnd)
      .map((h: any) => ({
        date: h.date,
        name: translateHolidayName(h.localName, h.name, language),
        country: countryCode
      }))
  } catch {
    return []
  }
}

function translateHolidayName(localName: string, englishName: string, language: string): string {
  // Para pt-BR e it-IT, usar o nome local se disponível
  // Para en-US, usar o nome em inglês
  if (language === 'en-US') return englishName
  return localName || englishName
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// ─── Enriquecedor principal ───────────────────────────────────────────────────

export async function enrichMemory(memory: ProactiveMemory): Promise<void> {
  if (memory.status !== 'confirmed') return
  
  const enrichment: ProactiveMemory['enrichment'] = {}
  let hasEnrichment = false

  // Buscar clima se tem localização E data
  if (memory.location && memory.eventDate) {
    const weather = await fetchWeatherForLocation(
      memory.location,
      memory.eventDate,
      memory.language
    )
    if (weather) {
      enrichment.weather = [weather]
      hasEnrichment = true
    }
    
    // Se for viagem multi-dia, buscar todos os dias
    if (memory.eventDateEnd && memory.eventDateEnd !== memory.eventDate) {
      const additionalDays = getDatesInRange(memory.eventDate, memory.eventDateEnd)
      const additionalWeather = await Promise.allSettled(
        additionalDays.slice(1).map(d =>
          fetchWeatherForLocation(memory.location!, d, memory.language)
        )
      )
      enrichment.weather = [
        weather,
        ...additionalWeather
          .filter(r => r.status === 'fulfilled' && r.value !== null)
          .map(r => (r as PromiseFulfilledResult<WeatherEnrichment>).value)
      ]
    }
  }

  if (hasEnrichment) {
    enrichment.fetchedAt = new Date().toISOString()
    await db.proactiveMemory.update({
      where: { id: memory.id },
      data: {
        enrichment,
        status: 'enriched',
        updatedAt: new Date().toISOString()
      }
    })
  }
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const current = new Date(start)
  const endDate = new Date(end)
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// Roda o enriquecimento de todas as memórias confirmed não enriquecidas ainda
export async function enrichPendingMemories(): Promise<void> {
  const memories = await db.proactiveMemory.findMany({
    where: { status: 'confirmed' }
  })
  
  // Enriquecer em paralelo (com limite para não sobrecarregar APIs)
  const chunks = chunkArray(memories, 3)
  for (const chunk of chunks) {
    await Promise.allSettled(chunk.map(enrichMemory))
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}
```

---

## PARTE 6 — INJEÇÃO NO CONTEXTO DO CHAT

Esta é a parte onde o GUTO usa as memórias para ser proativo. Não é um script. É contexto injetado no system prompt do GUTO para que ele decida naturalmente quando e como usar.

**`services/proactivity/proactivity-injector.ts`**

```typescript
import { ProactiveMemory, HolidayEnrichment } from './types'
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns'

// Monta o bloco de contexto proativo para o system prompt do GUTO
export function buildProactivityContext(
  memories: ProactiveMemory[],
  upcomingHolidays: HolidayEnrichment[],
  language: string,
  userName: string
): string {
  const activeMemories = memories.filter(m =>
    ['confirmed', 'enriched', 'surfaced'].includes(m.status)
  )

  if (activeMemories.length === 0 && upcomingHolidays.length === 0) {
    return ''
  }

  const memoryLines = activeMemories.map(m => {
    const lines: string[] = []
    
    // Base
    lines.push(`• ${m.confirmedSummary || m.rawSummary}`)
    
    // Data relativa
    if (m.eventDate) {
      const daysUntil = differenceInDays(new Date(m.eventDate), new Date())
      if (daysUntil === 0) lines.push(`  → hoje`)
      else if (daysUntil === 1) lines.push(`  → amanhã`)
      else if (daysUntil > 0) lines.push(`  → daqui ${daysUntil} dias (${m.eventDate})`)
    }
    
    // Clima enriquecido
    if (m.enrichment?.weather?.length) {
      const w = m.enrichment.weather[0]
      lines.push(`  → clima em ${w.city}: ${w.condition}, ${w.tempMin}°–${w.tempMax}°C`)
    }
    
    return lines.join('\n')
  }).join('\n\n')

  const holidayLines = upcomingHolidays
    .map(h => `• Feriado: ${h.name} (${h.date})`)
    .join('\n')

  return `
[CONTEXTO PROATIVO — USE COM NATURALIDADE]
Você tem as seguintes informações sobre a semana de ${userName}:

${memoryLines}

${upcomingHolidays.length > 0 ? `FERIADOS DESTA SEMANA:\n${holidayLines}` : ''}

INSTRUÇÕES:
- Use essas informações apenas quando fizer sentido na conversa
- Não mencione todas de uma vez
- Não diga "vi no meu sistema" ou "tenho anotado" — você simplesmente sabe
- Se o usuário perguntar sobre o clima de uma viagem que você tem enriquecida, responda sem hesitar
- Se a data de um evento está próxima e o usuário não mencionou, pode trazer naturalmente
- Se um feriado afeta o planejamento de treino da semana, mencione
- Você pode usar o clima para sugerir alternativas de treino (chuva → treino em casa)
- Não force. Se não couber na conversa, não mencione.
`.trim()
}

// Marca memória como surfaced (GUTO já usou)
export async function markMemorySurfaced(memoryId: string): Promise<void> {
  await db.proactiveMemory.update({
    where: { id: memoryId },
    data: {
      status: 'surfaced',
      surfacedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })
}

// Busca o contexto completo para injetar no chat
export async function getProactivityContextForUser(
  userId: string,
  language: string,
  userName: string,
  countryCode: string
): Promise<string> {
  const weekStart = getWeekStart()
  
  // Memórias ativas desta semana
  const memories = await db.proactiveMemory.findMany({
    where: {
      userId,
      weekStart,
      status: { in: ['confirmed', 'enriched', 'surfaced'] }
    }
  })

  // Feriados desta semana para o país do usuário
  const holidays = await fetchHolidaysThisWeek(countryCode, weekStart, language)

  return buildProactivityContext(memories, holidays, language, userName)
}
```

---

## PARTE 7 — VALIDAÇÃO E DESCARTE

Na semana seguinte, antes de perguntar sobre a nova semana, o GUTO valida o que aconteceu.

**`services/proactivity/memory-validator.ts`**

```typescript
import { ProactiveMemory } from './types'
import { getWeekStart } from './weekly-conversation'
import { subWeeks, format } from 'date-fns'

// Busca memórias da semana passada que ainda não foram validadas
export async function getPendingValidationMemories(
  userId: string
): Promise<ProactiveMemory[]> {
  const lastWeekStart = format(
    subWeeks(new Date(getWeekStart()), 1),
    'yyyy-MM-dd'
  )
  
  return db.proactiveMemory.findMany({
    where: {
      userId,
      weekStart: lastWeekStart,
      status: { in: ['confirmed', 'enriched', 'surfaced'] }
    }
  })
}

// Contexto de validação para o LLM
// GUTO vai perguntar sobre cada item pendente antes de falar da semana nova
export function buildValidationContext(
  pendingMemories: ProactiveMemory[],
  language: string,
  userName: string
): string {
  if (pendingMemories.length === 0) return ''

  const items = pendingMemories
    .map(m => {
      const summary = m.confirmedSummary || m.rawSummary
      const dateInfo = m.eventDate ? ` (${m.eventDate})` : ''
      return `• ${summary}${dateInfo}`
    })
    .join('\n')

  return `
[VALIDAÇÃO DA SEMANA PASSADA]
Antes de perguntar sobre essa semana, você tem os seguintes itens pendentes de validação:

${items}

INSTRUÇÃO:
Valide cada item de forma natural. Um de cada vez.
Pergunte se aconteceu, como foi, se mudou.

Tom natural (adapte para ${language}):
- "E aquela viagem pra Roma, rolou?" 
- "A reunião de quarta foi bem?"
- "Como foi o compromisso que você tinha quinta?"

Com base na resposta do usuário:
- Se aconteceu → entendemos, pode seguir. Internamente: marcar como validated_happened
- Se não aconteceu e vai rolar logo → perguntar quando, atualizar a memória
- Se não vai mais acontecer → tudo bem, não precisa falar mais sobre isso

IMPORTANTE:
- Não pergunte tudo de uma vez — uma coisa de cada vez
- Se o usuário não quiser falar sobre algo, aceite e passe para o próximo
- Só pergunte sobre a semana nova depois de terminar a validação
`.trim()
}

// Marca memória como validada (aconteceu)
export async function markValidatedHappened(memoryId: string): Promise<void> {
  await db.proactiveMemory.update({
    where: { id: memoryId },
    data: {
      status: 'validated_happened',
      updatedAt: new Date().toISOString()
    }
  })
}

// Memória foi adiada — criar nova para a próxima semana
export async function postponeMemory(
  memory: ProactiveMemory,
  newEventDate?: string
): Promise<void> {
  const weekStart = getWeekStart()
  const now = new Date().toISOString()
  
  // Criar nova memória para esta semana com os dados atualizados
  await db.proactiveMemory.create({
    data: {
      id: nanoid(),
      userId: memory.userId,
      language: memory.language,
      weekStart,
      type: memory.type,
      rawSummary: memory.rawSummary,
      confirmedSummary: memory.confirmedSummary,
      eventDate: newEventDate || memory.eventDate,
      eventDateEnd: memory.eventDateEnd,
      location: memory.location,
      locationCountry: memory.locationCountry,
      status: 'confirmed',    // já confirmada, não precisa confirmar de novo
      createdAt: now,
      updatedAt: now
    }
  })
  
  // Descartar a versão antiga
  await db.proactiveMemory.update({
    where: { id: memory.id },
    data: {
      status: 'validated_postponed',
      updatedAt: now
    }
  })
}

// Descarta memória que não vai mais acontecer
export async function discardOutdatedMemory(memoryId: string): Promise<void> {
  await db.proactiveMemory.update({
    where: { id: memoryId },
    data: {
      status: 'discarded',
      updatedAt: new Date().toISOString()
    }
  })
}
```

---

## PARTE 8 — INTEGRAÇÃO COM O CHAT

Aqui é onde tudo se conecta. O route de chat do GUTO precisa:
1. Verificar se é início de semana e há validações pendentes
2. Verificar se é segunda e não houve conversa semanal
3. Injetar contexto proativo no system prompt
4. Detectar quando o usuário confirma/descarta memórias e atualizar o banco

**`routes/proactivity.ts`**

```typescript
import { Router } from 'express'
import { authenticateJWT } from '@/middleware/auth'
import {
  hasWeeklyConversationThisWeek,
  markWeeklyConversationDone,
  buildWeeklyOpeningContext,
  isMondayForUser
} from '@/services/proactivity/weekly-conversation'
import { getPendingValidationMemories } from '@/services/proactivity/memory-validator'
import { fetchHolidaysThisWeek, getWeekStart } from '@/services/proactivity/memory-enricher'
import { getProactivityContextForUser } from '@/services/proactivity/proactivity-injector'

const router = Router()

// Retorna o estado proativo para o frontend saber o que fazer
router.get('/state', authenticateJWT, async (req, res) => {
  const { userId, language, timezone, countryCode, userName } = req.user!
  
  const hasWeeklyConv = await hasWeeklyConversationThisWeek(userId)
  const isMonday = isMondayForUser(timezone || 'America/Sao_Paulo')
  const pendingValidation = await getPendingValidationMemories(userId)
  const weekStart = getWeekStart()
  const holidays = await fetchHolidaysThisWeek(
    countryCode || 'BR',
    weekStart,
    language
  )

  res.json({
    shouldStartWeeklyConversation: isMonday && !hasWeeklyConv,
    hasPendingValidation: pendingValidation.length > 0,
    pendingValidationCount: pendingValidation.length,
    upcomingHolidays: holidays
  })
})

// Chamado quando o chat identifica que a conversa semanal terminou
router.post('/weekly-conversation/done', authenticateJWT, async (req, res) => {
  const { userId } = req.user!
  await markWeeklyConversationDone(userId)
  res.json({ ok: true })
})

export default router
```

**Modificação no route de chat existente:**

```typescript
// Em guto-backend/src/routes/chat.ts
// Adicionar ao buildSystemPrompt():

async function buildSystemPrompt(user: AuthUser, memory: GutoMemory): Promise<string> {
  const basePrompt = getBaseGutoSystemPrompt(user.language, memory)
  
  // Injetar contexto proativo
  const proactivityContext = await getProactivityContextForUser(
    user.userId,
    user.language,
    memory.userName || user.userName,
    user.countryCode || 'BR'
  )
  
  // Verificar se deve abrir com conversa semanal
  const hasWeeklyConv = await hasWeeklyConversationThisWeek(user.userId)
  const isMonday = isMondayForUser(user.timezone || 'America/Sao_Paulo')
  const pendingValidation = await getPendingValidationMemories(user.userId)
  const holidays = await fetchHolidaysThisWeek(
    user.countryCode || 'BR',
    getWeekStart(),
    user.language
  )
  
  let weeklyContext = ''
  if (isMonday && !hasWeeklyConv) {
    weeklyContext = buildWeeklyOpeningContext(
      memory.userName || user.userName,
      user.language,
      pendingValidation,
      holidays
    )
  }
  
  return [basePrompt, proactivityContext, weeklyContext]
    .filter(Boolean)
    .join('\n\n')
}
```

---

## PARTE 9 — CRON DE ENRIQUECIMENTO

Roda em background para enriquecer memórias confirmadas com clima e feriados.

**`cron/proactivity-cron.ts`**

```typescript
import cron from 'node-cron'
import { enrichPendingMemories } from '@/services/proactivity/memory-enricher'

// Roda a cada hora — enriquece memórias confirmadas ainda sem enriquecimento
// Não é urgente: o usuário não precisa do clima no mesmo segundo que confirmou
cron.schedule('0 * * * *', async () => {
  try {
    console.log('[PROACTIVITY] Starting enrichment run...')
    await enrichPendingMemories()
    console.log('[PROACTIVITY] Enrichment done.')
  } catch (error) {
    console.error('[PROACTIVITY] Enrichment failed:', error)
    // Não propaga o erro — proatividade não é crítica para o app funcionar
  }
})
```

---

## PARTE 10 — SCHEMA DO BANCO

**Adicionar ao schema Prisma:**

```prisma
model ProactiveMemory {
  id                 String   @id
  userId             String
  language           String
  weekStart          String   // YYYY-MM-DD da segunda-feira
  type               String   // trip | commitment | schedule | health | other
  rawSummary         String
  confirmedSummary   String?
  eventDate          String?  // YYYY-MM-DD
  eventDateEnd       String?
  location           String?
  locationCountry    String?
  enrichment         Json?    // WeatherEnrichment + HolidayEnrichment
  status             String   // pending_confirmation | confirmed | enriched | surfaced | ...
  surfacedAt         String?
  createdAt          String
  updatedAt          String

  @@index([userId, weekStart, status])
}

model ProactiveWeeklyConversation {
  id         String @id @default(cuid())
  userId     String
  weekStart  String // YYYY-MM-DD
  createdAt  String
  updatedAt  String?

  @@unique([userId, weekStart])
}
```

---

## PARTE 11 — FLUXO COMPLETO SEMANA A SEMANA

```
SEGUNDA-FEIRA (primeira abertura do chat):

1. Backend verifica: é segunda + não houve conversa semanal ainda
2. System prompt inclui: contexto de validação da semana passada (se houver)
3. GUTO abre: valida o que ficou pendente → um item de cada vez → natural
4. Após validação: pergunta sobre a semana nova
5. Usuário fala livremente
6. Backend extrai eventos da conversa (LLM extrator)
7. GUTO confirma o que entendeu → um item de cada vez → natural
8. Usuário confirma ou corrige
9. Backend salva como 'confirmed'
10. Backend marca conversa semanal como feita
11. Cron em background busca clima/feriados → atualiza para 'enriched'

DURANTE A SEMANA (qualquer chat):

1. System prompt sempre inclui contexto proativo das memórias ativas
2. GUTO usa as informações quando fizer sentido na conversa
3. Se usuário pergunta sobre viagem/clima/feriado → GUTO já sabe
4. Quando GUTO usa uma memória → marca como 'surfaced'

PRÓXIMA SEGUNDA:

1. Ciclo reinicia com validação do que ficou da semana passada
```

---

## PARTE 12 — EXEMPLOS DE FLUXO EM 3 IDIOMAS

### pt-BR — Semana com viagem

**Segunda-feira, usuário abre o chat:**

> GUTO: "E aí, Will. Semana passada você tinha reunião quarta — foi bem?"

> Usuário: "Foi, acabou bem mais cedo do que eu esperava."

> GUTO: "Boa. E essa semana, como vai ser pra mim planejar direito?"

> Usuário: "Quarta viajo pra Roma, volto domingo."

> GUTO: "Roma quarta, volta domingo — entendi. Tem algum horário de treino que vai mudar essa semana por causa disso?"

> Usuário: "Segunda e terça consigo de manhã. Quarta não."

> GUTO: "Então segunda e terça cedo, e quarta sem treino porque viaja. Fechado."

*[Backend salva: viagem Roma (qua–dom), treino seg e ter manhã. Cron busca clima em Roma para quarta a domingo.]*

**Quarta-feira, usuário abre o chat antes da viagem:**

> Usuário: "Oi GUTO"

> GUTO: "Roma hoje. Vi que vai fazer sol lá no fim de semana, uns 22 graus. Aproveita."

---

### it-IT — Settimana con impegno

**Lunedì, utente apre la chat:**

> GUTO: "Ciao Luca. La settimana scorsa avevi quell'evento giovedì — com'è andata?"

> Utente: "Benissimo, grazie."

> GUTO: "Ottimo. E questa settimana — come la vedi per gli allenamenti?"

> Utente: "Martedì ho una riunione fino alle 20. Il resto è libero."

> GUTO: "Martedì sera impegnato, gli altri giorni liberi. Giusto? Così organizzo bene la settimana."

> Utente: "Sì, esatto."

*[Backend salva: riunione martedì sera. Nessuna location → nessun arricchimento meteo.]*

---

### en-US — Week with commitment

**Monday, user opens chat:**

> GUTO: "Hey Alex. Last week you had that Friday thing — how'd it go?"

> User: "It went well, thanks."

> GUTO: "Good. What's this week looking like for me to plan around?"

> User: "I'm traveling to London Thursday through Sunday."

> GUTO: "London Thursday to Sunday — got it. Any workouts happening before you go?"

> User: "Tuesday and Wednesday morning."

> GUTO: "Tuesday and Wednesday mornings, then off Thursday. Makes sense."

*[Backend saves: London trip Thu–Sun, workouts Tue+Wed. Cron fetches London weather.]*

**Wednesday evening:**

> User: "Hey GUTO"

> GUTO: "London tomorrow. It's going to be around 14 degrees and cloudy over the weekend — layer up."

---

## PARTE 13 — REGRAS QUE NUNCA MUDAM

```typescript
const PROACTIVITY_RULES = {
  // GUTO nunca salva sem confirmar
  NEVER_SAVE_WITHOUT_CONFIRMATION: true,
  
  // GUTO nunca descarta sem validar
  NEVER_DISCARD_WITHOUT_VALIDATION: true,
  
  // GUTO confirma um item de cada vez — nunca uma lista
  CONFIRM_ONE_AT_A_TIME: true,
  
  // GUTO não força — se usuário não quiser falar, aceita
  NEVER_FORCE: true,
  
  // GUTO usa as informações — não anuncia que as tem
  USE_DONT_ANNOUNCE: true,
  
  // Proatividade falha silenciosamente — nunca quebra o chat
  FAIL_SILENTLY: true,
  
  // Idioma sempre o do usuário — em todos os pontos do sistema
  ALWAYS_USER_LANGUAGE: true,
  
  // GUTO não tem medo de perguntar de novo se não entendeu
  ASK_AGAIN_IF_UNCLEAR: true,
  
  // Memória de clima/feriado pode ficar desatualizada — não é crítica
  ENRICHMENT_IS_BEST_EFFORT: true,
} as const
```

---

## O QUE ESTE SISTEMA NÃO FAZ

- Não envia push notification
- Não tem cron que manda mensagem — o GUTO age quando o usuário abre o chat
- Não escuta todas as conversas — só extrai durante a conversa semanal
- Não salva humor, estado emocional ou detalhes pessoais sem contexto claro
- Não acumula memória infinitamente — cada semana tem seu ciclo
- Não menciona todas as informações que tem — usa quando faz sentido

## O QUE ESTE SISTEMA FAZ

- Torna o GUTO presente na vida real do usuário, não só no treino
- Faz o GUTO parecer que se lembra — porque ele realmente guarda
- Usa dados reais (clima, feriados) para ser relevante
- Limpa a própria memória toda semana — não vira uma IA que lembra de coisa velha
- Funciona nos 3 idiomas sem nenhuma diferença de comportamento
- É simples o suficiente para funcionar sem falhar

---

*Documento criado: Maio 2026*
*Implementação: começar pela Parte 10 (schema) → Parte 1 (types) → Parte 3 (extração) → Parte 2 (conversa semanal) → Parte 8 (integração no chat)*
