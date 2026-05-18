export interface VoicePackEntry {
  id: string
  variation: number
  tone?: string
  structureKey?: string
  text: string
  url: string
}

export interface VoicePackManifest {
  version: number
  voiceId: string
  voiceVersion: string
  languages: Record<string, { intents: Record<string, VoicePackEntry[]> }>
}

export interface VoiceRuntimeState {
  recentByIntent: Record<string, string[]>
  lastByIntent: Record<string, string>
}

export type VoiceResolvedSource = { kind: "file"; url: string; entry: VoicePackEntry } | { kind: "none" }

const MAX_RECENT_PER_INTENT = 4

export function createInitialVoiceRuntimeState(): VoiceRuntimeState {
  return { recentByIntent: {}, lastByIntent: {} }
}

function normalizeLanguage(lang: string) {
  const normalized = lang.trim().replace("_", "-").toLowerCase()
  if (normalized === "pt" || normalized === "pt-br") return "pt-BR"
  if (normalized === "en" || normalized === "en-us") return "en-US"
  if (normalized === "it" || normalized === "it-it") return "it-IT"
  return lang
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function similarityScore(reference: string, candidate: string) {
  const referenceTerms = new Set(normalizeText(reference).split(" ").filter(Boolean))
  const candidateTerms = new Set(normalizeText(candidate).split(" ").filter(Boolean))
  if (!referenceTerms.size || !candidateTerms.size) return 0
  let intersection = 0
  for (const term of candidateTerms) {
    if (referenceTerms.has(term)) intersection += 1
  }
  return intersection / Math.max(referenceTerms.size, candidateTerms.size)
}

export class VoiceResolver {
  private state: VoiceRuntimeState

  constructor(private readonly manifest: VoicePackManifest, initialState: VoiceRuntimeState = createInitialVoiceRuntimeState()) {
    this.state = initialState
  }

  getState() {
    return this.state
  }

  resolve(input: { intentKey: string; lang: string; text: string }): VoiceResolvedSource {
    const entries = this.manifest.languages[normalizeLanguage(input.lang)]?.intents[input.intentKey] || []
    if (!entries.length) return { kind: "none" }

    const recentIds = this.state.recentByIntent[input.intentKey] || []
    const pool = entries.filter((entry) => !recentIds.includes(entry.id))
    const selected = (pool.length ? pool : entries)
      .map((entry, index) => ({
        entry,
        index,
        score: similarityScore(input.text, entry.text) + (entry.id === this.state.lastByIntent[input.intentKey] ? -1 : 0),
      }))
      .sort((left, right) => right.score - left.score || left.index - right.index)[0]?.entry

    if (!selected) return { kind: "none" }
    this.remember(input.intentKey, selected.id)
    return { kind: "file", url: selected.url, entry: selected }
  }

  private remember(intentKey: string, entryId: string) {
    const current = this.state.recentByIntent[intentKey] || []
    this.state = {
      recentByIntent: {
        ...this.state.recentByIntent,
        [intentKey]: [entryId, ...current.filter((item) => item !== entryId)].slice(0, MAX_RECENT_PER_INTENT),
      },
      lastByIntent: { ...this.state.lastByIntent, [intentKey]: entryId },
    }
  }
}
