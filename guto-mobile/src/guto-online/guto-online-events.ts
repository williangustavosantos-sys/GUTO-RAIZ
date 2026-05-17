import type { GutoOnlineSource, GutoQuickTalkIntent } from "./guto-online-types"

export type GutoOnlineEvent =
  | { type: "SESSION_STARTED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "SESSION_RESUMED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "VOICE_MODE_TOGGLED"; eventId: string; at: number; enabled: boolean; source: GutoOnlineSource }
  | { type: "WARMUP_COMPLETED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "SET_COMPLETED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "EXERCISE_COMPLETED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "REST_STARTED"; eventId: string; at: number; restPlannedSeconds: number; restEndsAt: number; source: GutoOnlineSource }
  | { type: "REST_EXTENDED"; eventId: string; at: number; seconds: number; restEndsAt: number; source: GutoOnlineSource }
  | { type: "REST_SKIPPED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "REST_FINISHED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "QUICK_TALK_OPENED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "QUICK_TALK_SUBMITTED"; eventId: string; at: number; text: string; inputMode: "voice" | "text"; source: GutoOnlineSource }
  | { type: "QUICK_TALK_RESPONDED"; eventId: string; at: number; text: string; intent: GutoQuickTalkIntent; source: GutoOnlineSource }
  | { type: "QUICK_TALK_CLOSED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "PAIN_REPORTED"; eventId: string; at: number; message?: string; source: GutoOnlineSource }
  | { type: "SWAP_REQUESTED"; eventId: string; at: number; message?: string; source: GutoOnlineSource }
  | { type: "FATIGUE_REPORTED"; eventId: string; at: number; message?: string; source: GutoOnlineSource }
  | { type: "PAUSED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "RESUMED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "SESSION_FINISHED"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "TICK"; eventId: string; at: number; source: GutoOnlineSource }
  | { type: "GUTO_SAID"; eventId: string; at: number; intentKey: string; text: string; source: GutoOnlineSource }

export type GutoOnlineEventType = GutoOnlineEvent["type"]

export const SEMANTIC_DEDUPE_EVENT_TYPES = new Set<GutoOnlineEventType>([
  "SET_COMPLETED",
  "EXERCISE_COMPLETED",
  "REST_SKIPPED",
  "WARMUP_COMPLETED",
  "SESSION_FINISHED",
])

export function makeEventId(prefix = "ev"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export function makeSessionId(): string {
  return makeEventId("session")
}
