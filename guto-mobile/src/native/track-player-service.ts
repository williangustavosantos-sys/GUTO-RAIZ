import TrackPlayer, { Event } from "react-native-track-player"

export default async function trackPlayerService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    void TrackPlayer.pause()
  })
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    void TrackPlayer.play()
  })
}
