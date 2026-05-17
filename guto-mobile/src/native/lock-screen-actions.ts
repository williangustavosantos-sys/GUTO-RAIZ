import TrackPlayer, { Event } from "react-native-track-player"
import { makeEventId, type GutoOnlineEvent } from "../guto-online/guto-online-events"

type DispatchNativeEvent = (event: GutoOnlineEvent) => void

function nowEvent(type: "PAUSED" | "RESUMED" | "REST_SKIPPED" | "SET_COMPLETED"): GutoOnlineEvent {
  return {
    type,
    eventId: makeEventId(`lock_${type.toLowerCase()}`),
    at: Date.now(),
    source: "notification",
  }
}

export function bindLockScreenActions(dispatch: DispatchNativeEvent) {
  const subscriptions = [
    TrackPlayer.addEventListener(Event.RemotePlay, () => dispatch(nowEvent("RESUMED"))),
    TrackPlayer.addEventListener(Event.RemotePause, () => dispatch(nowEvent("PAUSED"))),
    TrackPlayer.addEventListener(Event.RemoteNext, () => dispatch(nowEvent("SET_COMPLETED"))),
    TrackPlayer.addEventListener(Event.RemotePrevious, () => dispatch(nowEvent("REST_SKIPPED"))),
  ]

  return () => {
    for (const subscription of subscriptions) subscription.remove()
  }
}
