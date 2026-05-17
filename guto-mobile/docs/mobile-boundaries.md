# GUTO Mobile Boundaries

## Superficies

### Backend atual (`guto-backend`)
Permanece como cerebro do GUTO:
- autenticacao JWT;
- memoria e calibragem;
- chat `/guto`;
- treino oficial;
- dieta;
- voz remota `/voz`;
- proatividade;
- admin/coach APIs;
- persistencia Redis/fallback local.

### Web atual (`guto-app-v0`)
Permanece como:
- painel admin/coach;
- convite, login e billing web;
- beta/PWA controlado;
- fallback visual para aluno enquanto o app nativo nasce.

### Mobile nativo (`guto-mobile`)
Nova superficie do aluno:
- onboarding mobile;
- missao do dia;
- GUTO Online com audio/background/lock screen;
- validacao com camera nativa;
- chat e proatividade dentro do app;
- push APNs/FCM/Expo Notifications.

## Reaproveitavel

- `lib/guto-online/guto-online-engine.ts`: reducer/state machine.
- `lib/guto-online/guto-online-types.ts`: fases, estado, janelas de retomada.
- `lib/guto-online/guto-online-events.ts`: contrato de eventos.
- `lib/guto-online/voice-resolver.ts`: anti-repeticao e selecao de voicepack.
- tipos de `lib/api/guto.ts`: treino, memoria, chat e voz.

## Web-only

- DOM, `window`, `document`;
- `localStorage`;
- `IndexedDB`;
- `HTMLAudioElement`;
- `speechSynthesis`;
- Service Worker/Web Push;
- `getUserMedia`/Canvas;
- Next Router/Image;
- Radix/Tailwind web.

## Adapter nativo obrigatorio

- storage: SecureStore/AsyncStorage/MMKV;
- audio: Track Player para lock screen e headset;
- TTS/voicepack: arquivo/cache nativo + TTS remoto;
- push: APNs/FCM/Expo Notifications;
- camera: Expo Camera;
- lifecycle: AppState + timestamps absolutos;
- haptic: Expo Haptics.
