import * as Notifications from "expo-notifications"
import { makeEventId, type GutoOnlineEvent } from "../guto-online/guto-online-events"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export async function configureWorkoutNotificationCategory() {
  await Notifications.setNotificationCategoryAsync("guto-online-session", [
    { identifier: "set_done", buttonTitle: "Serie feita", options: { opensAppToForeground: false } },
    { identifier: "pause", buttonTitle: "Pausar", options: { opensAppToForeground: false } },
    { identifier: "resume", buttonTitle: "Continuar", options: { opensAppToForeground: false } },
  ])
}

export async function showWorkoutNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, categoryIdentifier: "guto-online-session" },
    trigger: null,
  })
}

export function bindNotificationActions(dispatch: (event: GutoOnlineEvent) => void) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const action = response.actionIdentifier
    if (action === "set_done") {
      dispatch({ type: "SET_COMPLETED", eventId: makeEventId("notification_set"), at: Date.now(), source: "notification" })
    } else if (action === "pause") {
      dispatch({ type: "PAUSED", eventId: makeEventId("notification_pause"), at: Date.now(), source: "notification" })
    } else if (action === "resume") {
      dispatch({ type: "RESUMED", eventId: makeEventId("notification_resume"), at: Date.now(), source: "notification" })
    }
  })
}
