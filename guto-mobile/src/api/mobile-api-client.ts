import Constants from "expo-constants"
import * as SecureStore from "expo-secure-store"
import type {
  GutoMemory,
  GutoVoiceResponse,
  MobileSessionEventPayload,
  SendGutoMessageRequest,
  SendGutoMessageResponse,
} from "../contracts/guto-api"

const AUTH_TOKEN_KEY = "guto-auth-token"

function getApiUrl() {
  const configured = Constants.expoConfig?.extra?.apiUrl
  return typeof configured === "string" && configured.trim() ? configured.replace(/\/$/, "") : "http://localhost:3001"
}

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token)
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY)
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAuthToken()
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = typeof data?.message === "string" ? data.message : `GUTO API ${response.status}`
    throw new Error(message)
  }
  return data as T
}

export const gutoMobileApi = {
  getMemory() {
    return request<GutoMemory>("/guto/memory")
  },

  updateMemory(memory: Partial<GutoMemory>) {
    return request<GutoMemory>("/guto/memory", {
      method: "POST",
      body: JSON.stringify(memory),
    })
  },

  sendMessage(payload: SendGutoMessageRequest) {
    return request<SendGutoMessageResponse>("/guto", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  synthesizeVoice(text: string, language: string) {
    return request<GutoVoiceResponse>("/voz", {
      method: "POST",
      body: JSON.stringify({ text, language }),
    })
  },

  recordSessionEvent(payload: MobileSessionEventPayload) {
    return request<{ ok: true }>("/guto/events", {
      method: "POST",
      body: JSON.stringify({
        event: "guto_online_session_event",
        language: "pt-BR",
        metadata: payload,
        timestamp: new Date(payload.at).toISOString(),
      }),
    })
  },
}
