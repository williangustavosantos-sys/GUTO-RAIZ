import AsyncStorage from "@react-native-async-storage/async-storage"
import type { GutoOnlineSessionState } from "./guto-online-types"

const SESSION_KEY = "guto.mobile.online.session.v1"

export async function saveOnlineSession(state: GutoOnlineSessionState) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(state))
}

export async function loadOnlineSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as GutoOnlineSessionState
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY)
    return null
  }
}

export async function clearOnlineSession() {
  await AsyncStorage.removeItem(SESSION_KEY)
}
