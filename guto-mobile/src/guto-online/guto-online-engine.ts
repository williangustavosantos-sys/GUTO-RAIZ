import type { GutoWorkoutExercise, GutoWorkoutPlan } from "../contracts/guto-api"
import type { GutoChecklistItem, GutoOnlineSessionState } from "./guto-online-types"
import {
  SEMANTIC_DEDUPE_WINDOW_MS,
  isLastExerciseOfPlan,
  isLastSetOfExercise,
  makeWorkoutKey,
} from "./guto-online-types"
import {
  SEMANTIC_DEDUPE_EVENT_TYPES,
  makeEventId,
  makeSessionId,
  type GutoOnlineEvent,
} from "./guto-online-events"

export interface GutoOnlineEngineSnapshot {
  state: GutoOnlineSessionState
  eventLog: GutoOnlineEvent[]
  lastDispatched?: GutoOnlineEvent
}

export type GutoOnlineEngineListener = (snapshot: GutoOnlineEngineSnapshot) => void

function parseRestSeconds(exercise?: GutoWorkoutExercise) {
  if (typeof exercise?.restSeconds === "number" && exercise.restSeconds > 0) return Math.round(exercise.restSeconds)
  const match = String(exercise?.rest || "").match(/\d+/)
  return match ? Number.parseInt(match[0], 10) : 60
}

function checklistLabels(language: string) {
  if (language === "en-US") return { warmup: "Warm-up", set: "set", validate: "Validate workout" }
  if (language === "it-IT") return { warmup: "Riscaldamento", set: "serie", validate: "Valida allenamento" }
  return { warmup: "Aquecimento", set: "serie", validate: "Validar treino" }
}

function buildChecklist(exercises: GutoWorkoutExercise[], language: string): GutoChecklistItem[] {
  const labels = checklistLabels(language)
  const items: GutoChecklistItem[] = [{ id: "warmup", kind: "warmup", label: labels.warmup, done: false }]
  for (const exercise of exercises) {
    for (let setNumber = 1; setNumber <= (exercise.sets || 1); setNumber += 1) {
      items.push({
        id: `set:${exercise.id}:${setNumber}`,
        kind: "set",
        label: `${exercise.name} - ${labels.set} ${setNumber}`,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setNumber,
        totalSets: exercise.sets || 1,
        done: false,
      })
    }
  }
  items.push({ id: "validation", kind: "validation", label: labels.validate, done: false })
  return items
}

function markChecklist(checklist: GutoChecklistItem[], predicate: (item: GutoChecklistItem) => boolean, doneAt: number) {
  return checklist.map((item) => (item.done || !predicate(item) ? item : { ...item, done: true, doneAt }))
}

export function createInitialState(input: {
  plan: GutoWorkoutPlan
  language: string
  userName?: string
  voiceMode?: "enabled" | "disabled"
  sessionId?: string
  startedAt?: number
}): GutoOnlineSessionState {
  const startedAt = input.startedAt ?? Date.now()
  return {
    sessionId: input.sessionId ?? makeSessionId(),
    workoutKey: makeWorkoutKey(input.plan),
    planFocus: input.plan.focus,
    planDateLabel: input.plan.dateLabel,
    language: input.language,
    userName: input.userName,
    startedAt,
    updatedAt: startedAt,
    phase: "briefing",
    previousPhase: null,
    voiceMode: input.voiceMode ?? "enabled",
    exerciseIndex: 0,
    currentSet: 1,
    warmupCompleted: false,
    restEndsAt: null,
    restPlannedSeconds: null,
    quickTalk: null,
    lastGutoLine: "",
    lastAction: "",
    completedSets: [],
    checklist: buildChecklist(input.plan.exercises || [], input.language),
  }
}

function reduce(state: GutoOnlineSessionState, exercises: GutoWorkoutExercise[], event: GutoOnlineEvent): GutoOnlineSessionState {
  const currentExercise = exercises[state.exerciseIndex]
  const at = event.at

  switch (event.type) {
    case "SESSION_STARTED":
      return { ...state, phase: state.warmupCompleted ? "executing_set" : "warmup", updatedAt: at }
    case "VOICE_MODE_TOGGLED":
      return { ...state, voiceMode: event.enabled ? "enabled" : "disabled", updatedAt: at }
    case "WARMUP_COMPLETED":
      return {
        ...state,
        warmupCompleted: true,
        phase: exercises.length ? "executing_set" : "finished",
        lastAction: "warmup_completed",
        updatedAt: at,
        checklist: markChecklist(state.checklist, (item) => item.kind === "warmup", at),
      }
    case "SET_COMPLETED": {
      if (!currentExercise || state.phase !== "executing_set") return state
      const completedSet = {
        exerciseId: currentExercise.id,
        exerciseName: currentExercise.name,
        setNumber: state.currentSet,
        completedAt: at,
        source: event.source,
        eventId: event.eventId,
      }
      const checklist = markChecklist(
        state.checklist,
        (item) => item.kind === "set" && item.exerciseId === currentExercise.id && item.setNumber === state.currentSet,
        at,
      )
      if (!isLastSetOfExercise(state, currentExercise)) {
        const restPlannedSeconds = parseRestSeconds(currentExercise)
        return {
          ...state,
          completedSets: [...state.completedSets, completedSet],
          currentSet: state.currentSet + 1,
          phase: "resting",
          restPlannedSeconds,
          restEndsAt: at + restPlannedSeconds * 1000,
          checklist,
          lastAction: "set_completed",
          updatedAt: at,
        }
      }
      return {
        ...state,
        completedSets: [...state.completedSets, completedSet],
        phase: isLastExerciseOfPlan(state.exerciseIndex, exercises.length) ? "finished" : "between_exercises",
        checklist,
        lastAction: "exercise_completed",
        updatedAt: at,
      }
    }
    case "EXERCISE_COMPLETED":
      if (isLastExerciseOfPlan(state.exerciseIndex, exercises.length)) {
        return { ...state, phase: "finished", endedAt: at, updatedAt: at, lastAction: "session_finished" }
      }
      return {
        ...state,
        exerciseIndex: state.exerciseIndex + 1,
        currentSet: 1,
        phase: "executing_set",
        restEndsAt: null,
        restPlannedSeconds: null,
        updatedAt: at,
        lastAction: "next_exercise",
      }
    case "REST_SKIPPED":
    case "REST_FINISHED":
      return { ...state, phase: "executing_set", restEndsAt: null, restPlannedSeconds: null, updatedAt: at }
    case "REST_EXTENDED":
      return { ...state, restEndsAt: event.restEndsAt, restPlannedSeconds: (state.restPlannedSeconds || 0) + event.seconds, updatedAt: at }
    case "QUICK_TALK_OPENED":
      return {
        ...state,
        phase: "quick_talk",
        previousPhase: state.phase,
        quickTalk: { openedAt: at, inputMode: "notification_action", canResume: true },
        updatedAt: at,
      }
    case "QUICK_TALK_CLOSED":
      return { ...state, phase: state.previousPhase || "executing_set", previousPhase: null, quickTalk: null, updatedAt: at }
    case "PAIN_REPORTED":
      return { ...state, phase: "pain_check", previousPhase: state.phase, lastAction: "pain_reported", updatedAt: at }
    case "FATIGUE_REPORTED":
      return { ...state, phase: "fatigue_adjustment", previousPhase: state.phase, lastAction: "fatigue_reported", updatedAt: at }
    case "SWAP_REQUESTED":
      return { ...state, phase: "substitution", previousPhase: state.phase, lastAction: "swap_requested", updatedAt: at }
    case "PAUSED":
      return { ...state, previousPhase: state.phase, phase: "paused", updatedAt: at }
    case "RESUMED":
    case "SESSION_RESUMED":
      return { ...state, phase: state.previousPhase || "executing_set", previousPhase: null, updatedAt: at }
    case "SESSION_FINISHED":
      return { ...state, phase: "finished", endedAt: at, updatedAt: at }
    case "TICK":
      if (state.phase === "resting" && state.restEndsAt && at >= state.restEndsAt) {
        return { ...state, phase: "executing_set", restEndsAt: null, restPlannedSeconds: null, updatedAt: at }
      }
      return { ...state, updatedAt: at }
    case "GUTO_SAID":
      return { ...state, lastGutoLine: event.text, updatedAt: at }
    default:
      return state
  }
}

export class GutoOnlineEngine {
  private state: GutoOnlineSessionState
  private eventLog: GutoOnlineEvent[] = []
  private listeners = new Set<GutoOnlineEngineListener>()

  constructor(private readonly plan: GutoWorkoutPlan, state?: GutoOnlineSessionState) {
    this.state = state ?? createInitialState({ plan, language: plan.exercises[0]?.name ? "pt-BR" : "pt-BR" })
  }

  getSnapshot(): GutoOnlineEngineSnapshot {
    return { state: this.state, eventLog: this.eventLog }
  }

  subscribe(listener: GutoOnlineEngineListener) {
    this.listeners.add(listener)
    listener(this.getSnapshot())
    return () => this.listeners.delete(listener)
  }

  dispatch(event: GutoOnlineEvent) {
    const previous = this.eventLog[this.eventLog.length - 1]
    if (this.eventLog.some((item) => item.eventId === event.eventId)) return this.getSnapshot()
    if (
      previous &&
      previous.type === event.type &&
      SEMANTIC_DEDUPE_EVENT_TYPES.has(event.type) &&
      event.at - previous.at < SEMANTIC_DEDUPE_WINDOW_MS
    ) {
      return this.getSnapshot()
    }

    this.state = reduce(this.state, this.plan.exercises || [], event)
    this.eventLog = [...this.eventLog, event].slice(-300)
    const snapshot = { state: this.state, eventLog: this.eventLog, lastDispatched: event }
    for (const listener of this.listeners) listener(snapshot)
    return snapshot
  }

  action(type: GutoOnlineEvent["type"], source: GutoOnlineEvent["source"] = "button") {
    return this.dispatch({ type, eventId: makeEventId(type.toLowerCase()), at: Date.now(), source } as GutoOnlineEvent)
  }
}
