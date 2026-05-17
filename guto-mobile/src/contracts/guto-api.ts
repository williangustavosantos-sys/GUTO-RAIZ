export type SupportedLanguage = "pt-BR" | "en-US" | "it-IT"
export type WorkoutLocationMode = "gym" | "home" | "park"

export interface GutoWorkoutExercise {
  id: string
  name: string
  canonicalNamePt: string
  muscleGroup: string
  sets: number
  reps: string
  load?: string | null
  rest: string
  restSeconds?: number
  cue: string
  note: string
  alternatives?: string[]
  order?: number
  videoUrl: string
  videoProvider: "local"
  sourceFileName: string
}

export interface GutoWorkoutPlan {
  studentId?: string
  title?: string
  focus: string
  focusKey?: "chest_triceps" | "back_biceps" | "legs_core" | "shoulders_abs" | "full_body"
  weekDay?: string
  goal?: string
  location?: string
  locationMode?: WorkoutLocationMode
  dateLabel: string
  scheduledFor: string
  summary: string
  exercises: GutoWorkoutExercise[]
  estimatedDurationMinutes?: number
  difficulty?: string
  coachNotes?: string
  source?: "guto_generated" | "coach_manual" | "mixed"
  lockedByCoach?: boolean
  updatedAt?: string
}

export interface GutoExpectedResponse {
  type: "text"
  options?: string[]
  instruction?: string
  context?: "training_schedule" | "training_location" | "training_status" | "training_limitations" | "limitation_check"
}

export interface GutoMemory {
  userId: string
  name: string
  language: SupportedLanguage
  initialXpGranted: boolean
  totalXp: number
  streak: number
  trainedToday: boolean
  adaptedMissionToday: boolean
  lastActiveAt: string
  trainingLocation?: string
  trainingStatus?: string
  trainingLimitations?: string
  trainingAge?: number
  userAge?: number
  biologicalSex?: "female" | "male" | "prefer_not_to_say"
  trainingLevel?: "beginner" | "returning" | "consistent" | "advanced"
  trainingGoal?: "consistency" | "fat_loss" | "muscle_gain" | "conditioning" | "mobility_health"
  preferredTrainingLocation?: "gym" | "home" | "park" | "mixed"
  trainingPathology?: string
  country?: string
  countryCode?: string
  city?: string
  heightCm?: number
  weightKg?: number
  foodRestrictions?: string
  foodIntolerances?: string
  lastWorkoutPlan?: GutoWorkoutPlan | null
}

export interface SendGutoMessageRequest {
  profile: {
    name: string
    userId?: string
    streak?: number
    trainedToday?: boolean
    energyLast?: string
  }
  input: string
  language: SupportedLanguage
  history: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>
  expectedResponse?: GutoExpectedResponse | null
}

export interface SendGutoMessageResponse {
  fala?: string
  acao?: "none" | "updateWorkout" | "lock" | "changeLanguage" | "requestDeleteAccount" | "showProfile"
  expectedResponse?: GutoExpectedResponse | null
  workoutPlan?: GutoWorkoutPlan | null
  memoryPatch?: Partial<GutoMemory>
}

export interface GutoVoiceResponse {
  audioContent?: string
  mimeType?: string
  voiceUsed?: string
  fallback?: string
}

export interface MobileSessionEventPayload {
  sessionId: string
  workoutKey: string
  eventId: string
  eventType: string
  source: "button" | "voice" | "notification" | "system" | "ai"
  at: number
  state: unknown
}
