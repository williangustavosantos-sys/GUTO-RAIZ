# GUTO Online Shared Logic

Esta pasta e a primeira extracao controlada do GUTO Online para o app nativo.

Origem web:
- `../guto-app-v0/lib/guto-online/guto-online-types.ts`
- `../guto-app-v0/lib/guto-online/guto-online-events.ts`
- `../guto-app-v0/lib/guto-online/guto-online-engine.ts`

Regra:
- o engine deve continuar puro;
- lock screen, headset, storage, voz e notificacao entram por adapters nativos;
- eventos externos sempre viram `GutoOnlineEvent`;
- XP nao e gerado aqui; XP continua preso a validacao real do treino.

Quando a base estabilizar, esta pasta deve virar pacote compartilhado ou workspace interno para evitar divergencia entre web e mobile.
