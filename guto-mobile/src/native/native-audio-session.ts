import { Audio } from "expo-av"
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from "react-native-track-player"

let trackPlayerReady = false

export async function configureNativeAudioSession() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  })

  if (!trackPlayerReady) {
    await TrackPlayer.setupPlayer()
    trackPlayerReady = true
  }

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],
    compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
    notificationCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
  })
}

export async function speakLockScreenLine(text: string) {
  if (!trackPlayerReady) await configureNativeAudioSession()
  await TrackPlayer.reset()
  await TrackPlayer.add({
    id: `guto-line-${Date.now()}`,
    url: "https://static.guto.app/silence.mp3",
    title: "GUTO Online",
    artist: text,
  })
}
