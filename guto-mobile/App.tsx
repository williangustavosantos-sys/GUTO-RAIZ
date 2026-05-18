import { useEffect, useMemo, useState } from "react"
import { AppState, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native"
import * as Haptics from "expo-haptics"
import TrackPlayer from "react-native-track-player"
import { sampleWorkoutPlan } from "./src/fixtures/sample-workout"
import { GutoOnlineEngine } from "./src/guto-online/guto-online-engine"
import { makeEventId, type GutoOnlineEvent } from "./src/guto-online/guto-online-events"
import type { GutoOnlineSessionState } from "./src/guto-online/guto-online-types"
import { saveOnlineSession } from "./src/guto-online/session-storage"
import { configureNativeAudioSession, speakLockScreenLine } from "./src/native/native-audio-session"
import { bindLockScreenActions } from "./src/native/lock-screen-actions"
import {
  bindNotificationActions,
  configureWorkoutNotificationCategory,
  showWorkoutNotification,
} from "./src/native/notifications"
import trackPlayerService from "./src/native/track-player-service"

TrackPlayer.registerPlaybackService(() => trackPlayerService)

function event(type: GutoOnlineEvent["type"], source: GutoOnlineEvent["source"] = "button"): GutoOnlineEvent {
  return { type, eventId: makeEventId(type.toLowerCase()), at: Date.now(), source } as GutoOnlineEvent
}

function phaseCopy(state: GutoOnlineSessionState) {
  if (state.phase === "briefing") return "GUTO ja esta na area. Comeca a sessao e deixa que eu conduzo."
  if (state.phase === "warmup") return "Aquecimento primeiro. Corpo acordado antes de carga."
  if (state.phase === "executing_set") return `Serie ${state.currentSet}. Faz limpo e marca quando terminar.`
  if (state.phase === "resting") return "Descanso rodando. Respira, mas nao some."
  if (state.phase === "between_exercises") return "Exercicio fechado. Proximo bloco, sem perder ritmo."
  if (state.phase === "paused") return "Pausado. Retoma antes da mente negociar."
  if (state.phase === "finished") return "Treino fechado. Agora falta validar."
  return "GUTO esta ajustando a sessao."
}

export default function App() {
  const engine = useMemo(() => new GutoOnlineEngine(sampleWorkoutPlan), [])
  const [state, setState] = useState(() => engine.getSnapshot().state)

  const dispatch = (nextEvent: GutoOnlineEvent) => {
    const snapshot = engine.dispatch(nextEvent)
    setState(snapshot.state)
    void saveOnlineSession(snapshot.state)
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    return snapshot
  }

  useEffect(() => {
    void configureNativeAudioSession()
    void configureWorkoutNotificationCategory()
    const unbindLockScreen = bindLockScreenActions(dispatch)
    const notificationSubscription = bindNotificationActions(dispatch)
    return () => {
      unbindLockScreen()
      notificationSubscription.remove()
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => dispatch(event("TICK", "system")), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (status !== "active") void saveOnlineSession(state)
    })
    return () => subscription.remove()
  }, [state])

  const currentExercise = sampleWorkoutPlan.exercises[state.exerciseIndex]
  const line = phaseCopy(state)

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.shell}>
        <Text style={styles.eyebrow}>GUTO ONLINE NATIVE SPIKE</Text>
        <Text style={styles.title}>GUTO & Will</Text>
        <Text style={styles.line}>{line}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Fase</Text>
          <Text style={styles.cardValue}>{state.phase}</Text>
          <Text style={styles.cardLabel}>Exercicio</Text>
          <Text style={styles.cardValue}>{currentExercise?.name ?? "Finalizado"}</Text>
          <Text style={styles.cardLabel}>Series feitas</Text>
          <Text style={styles.cardValue}>{state.completedSets.length}</Text>
        </View>

        <View style={styles.actions}>
          {state.phase === "briefing" && (
            <Action label="Comecar sessao" onPress={() => dispatch(event("SESSION_STARTED"))} />
          )}
          {state.phase === "warmup" && (
            <Action label="Aquecimento feito" onPress={() => dispatch(event("WARMUP_COMPLETED"))} />
          )}
          {state.phase === "executing_set" && <Action label="Serie feita" onPress={() => dispatch(event("SET_COMPLETED"))} />}
          {state.phase === "between_exercises" && (
            <Action label="Proximo exercicio" onPress={() => dispatch(event("EXERCISE_COMPLETED"))} />
          )}
          {state.phase === "resting" && <Action label="Pular descanso" onPress={() => dispatch(event("REST_SKIPPED"))} />}
          {state.phase === "paused" && <Action label="Continuar" onPress={() => dispatch(event("RESUMED"))} />}
          {state.phase !== "paused" && state.phase !== "finished" && (
            <Action label="Pausar" secondary onPress={() => dispatch(event("PAUSED"))} />
          )}
          <Action
            label="Testar lock screen"
            secondary
            onPress={() => {
              void speakLockScreenLine(line)
              void showWorkoutNotification("GUTO Online", line)
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

function Action({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) {
  return (
    <Pressable style={[styles.button, secondary && styles.buttonSecondary]} onPress={onPress}>
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#06101f" },
  shell: { flex: 1, padding: 24, justifyContent: "center", gap: 18 },
  eyebrow: { color: "#00e5ff", fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#ffffff", fontSize: 34, fontWeight: "900" },
  line: { color: "#d9f7ff", fontSize: 18, lineHeight: 26, fontWeight: "700" },
  card: { borderWidth: 1, borderColor: "rgba(0,229,255,0.25)", borderRadius: 22, padding: 18, backgroundColor: "rgba(255,255,255,0.06)" },
  cardLabel: { color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: "900", letterSpacing: 1.2, marginTop: 8 },
  cardValue: { color: "#ffffff", fontSize: 18, fontWeight: "800", marginTop: 4 },
  actions: { gap: 12 },
  button: { minHeight: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#00e5ff" },
  buttonSecondary: { backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" },
  buttonText: { color: "#06101f", fontSize: 15, fontWeight: "900" },
  buttonTextSecondary: { color: "#ffffff" },
})
