# Parte 3 — Sistema Principal, Chat, Missão e Dieta (ponteiro)

> **Esta série `PARTE_x` virou ponteiro.** O conteúdo profundo está nas **`*_DETALHADA`** (fonte de verdade). Este arquivo só aponta o caminho.

## Onde está o conteúdo desta parte

| Tema | Documento canônico |
|---|---|
| Visão integrada das abas (página por página) | `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 8–10) |
| Chat / cérebro: contrato de turno, contexto, honestidade, segurança, fallback | `GUTO_CHAT_E_CEREBRO_DETALHADA.md` |
| Missão / Treino do dia | `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` |
| Dieta | `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` |
| Calibragem que treino/dieta/chat consomem | `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` |

## Resumo (nenhuma aba é um silo)

```txt
       [ Memória do Backend / Cérebro ]
         /           |             \
  ( Chat/GUTO )  ( Missão )     ( Dieta )
        \            |             /
     [ Validação -> XP -> Arena/Percurso/Evoluir ]
```

- **Chat** é contrato de turno estruturado (não texto livre); só diz "salvei" se persistiu; com lock do coach, vira pendência.
- **Treino e dieta** são planos oficiais do backend — o frontend não inventa. O botão de dúvida "?" leva contexto do exercício/refeição ao chat.
- Mudança numa aba reflete nas outras (mesma memória). `lockedByCoach` nunca é sobrescrito automaticamente.
