# GUTO Mobile

App nativo do aluno. Esta base existe para entregar o que web/PWA nao consegue garantir bem:

- GUTO Online com audio em background;
- controles de lock screen/headset;
- push nativo;
- camera nativa para validacao;
- retomada de sessao quando o app vai para background.

O backend continua em `../guto-backend`. O painel admin/coach continua em `../guto-app-v0`.

## Rodar

```bash
npm install
npm run ios
```

Para Android:

```bash
npm run android
```

## Primeiro marco

O arquivo `App.tsx` e um spike nativo do GUTO Online. Ele valida a state machine, comandos de botao, notificacao e preparacao para lock screen.

Antes de considerar pronto para beta real, testar em dispositivo fisico com dev client:

- audio com tela bloqueada;
- comandos do fone;
- acoes de lock screen;
- retorno do background;
- sincronizacao de eventos com backend.
