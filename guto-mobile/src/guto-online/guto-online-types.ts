import type { GutoWorkoutExercise, GutoWorkoutPlan } from "../contracts/guto-api"

export type GutoOnlinePhase =
  | "briefing"
  | "warmup"
  | "executing_set"
  | "resting"
  | "between_exercises"
  | "quick_talk"
  | "thinking"
  | "paused"
  | "pain_check"
  | "substitution"
  | "fatigue_adjustment"
  | "finished"

export type GutoVoiceMode = "enabled" | "disabled"
export type GutoOnlineInputMode = "button" | "voice_push_to_talk" | "text_quick_reply" | "notification_action"
export type GutoOnlinePlatform = "ios" | "android"
export type GutoOnlineSource = "button" | "voice" | "notification" | "system" | "ai"

export interface GutoOnlineCompletedSet {
  exerciseId: string
  exerciseName: string
  setNumber: number
  completedAt: number
  source: GutoOnlineSource
  eventId: string
}

export interface GutoChecklistItem {
  id: string
  kind: "warmup" | "set" | "exercise" | "validation"
  label: string
  exerciseId?: string
  exerciseName?: string
  setNumber?: number
  totalSets?: number
  done: boolean
  doneAt?: number
}

export type GutoQuickTalkIntent =
  | "swap_equipment"
  | "pain"
  | "fatigue"
  | "doubt_execution"
  | "off_topic"
  | "emotional"
  | "noisy_unclear"
  | "command_set_done"
  | "command_pause"
  | "command_resume"
  | "command_finish"
  | "unknown"

export interface GutoQuickTalkState {
  openedAt: number
  inputMode: GutoOnlineInputMode | null
  lastUserText?: string
  lastGutoText?: string
  intent?: GutoQuickTalkIntent
  canResume: boolean
}

export interface GutoOnlineSessionState {
  sessionId: string
  workoutKey: string
  planFocus: string
  planDateLabel: string
  language: string
  userName?: string
  startedAt: number
  updatedAt: number
  endedAt?: number
  phase: GutoOnlinePhase
  previousPhase: GutoOnlinePhase | null
  voiceMode: GutoVoiceMode
  exerciseIndex: number
  currentSet: number
  warmupCompleted: boolean
  restEndsAt: number | null
  restPlannedSeconds: number | null
  quickTalk: GutoQuickTalkState | null
  lastGutoLine: string
  lastAction: string
  completedSets: GutoOnlineCompletedSet[]
  checklist: GutoChecklistItem[]
}

export const AUTO_RESUME_WINDOW_MS = 15 * 60 * 1000
export const MAX_SESSION_AGE_MS = 12 * 60 * 60 * 1000
export const SEMANTIC_DEDUPE_WINDOW_MS = 800

export function makeWorkoutKey(plan: GutoWorkoutPlan): string {
  return `${plan.focus}:${plan.scheduledFor}`
}

export function isLastSetOfExercise(state: Pick<GutoOnlineSessionState, "currentSet">, exercise?: GutoWorkoutExercise) {
  if (!exercise) return false
  return state.currentSet >= (exercise.sets || 1)
}

export function isLastExerciseOfPlan(exerciseIndex: number, totalExercises: number): boolean {
  return exerciseIndex >= totalExercises - 1
}
