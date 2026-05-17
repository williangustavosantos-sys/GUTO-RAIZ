# Mobile API Contract

O app nativo consome o backend existente. O objetivo e manter uma unica fonte de verdade para memoria, treino, dieta, XP e proatividade.

## Autenticacao

- Token JWT salvo no device via SecureStore.
- Toda rota operacional usa `Authorization: Bearer <token>`.
- O app nativo nao usa `local-user`.

## Rotas V1

| Area | Metodo | Rota | Uso mobile |
|---|---:|---|---|
| Memoria | GET | `/guto/memory` | carregar perfil canonico |
| Memoria | POST | `/guto/memory` | persistir calibragem/settings |
| Chat | POST | `/guto` | conversar com GUTO e receber acoes |
| Voz | POST | `/voz` | gerar audio oficial remoto |
| Proatividade | GET | `/guto/proactive` | buscar fala ativa do GUTO |
| Validacao | POST | `/guto/validate-workout` | enviar validacao do treino |
| Eventos | POST | `/guto/events` | telemetria e eventos de sessao |

## Evento de GUTO Online

```ts
interface MobileSessionEventPayload {
  sessionId: string
  workoutKey: string
  eventId: string
  eventType: string
  source: "button" | "voice" | "notification" | "system" | "ai"
  at: number
  state: unknown
}
```

Regra:
- evento precisa ser idempotente pelo `eventId`;
- backend nao deve gerar XP apenas por evento de sessao;
- XP continua preso a validacao real do treino;
- eventos de lock screen/headset devem entrar com `source: "notification"` ou `source: "system"`.

## Falhas

- Rede falhou: sessao continua localmente e sincroniza depois.
- Voz falhou: texto + haptic, nunca voz errada.
- App foi para background: salvar snapshot local e retomar por `restEndsAt` absoluto.
- Backend recusou evento duplicado: app nao muda UX, apenas registra telemetria.
