# GUTO — Arquitetura do Sistema (o Organismo)

> Visão de **alto nível** de como todas as partes do GUTO se conectam. Não contém detalhes de implementação — para isso, ver os `*_DETALHADA` de cada área. Pré-requisito: `GUTO_AI_ONBOARDING.md` e `README.md`.

---

## 1. O princípio: o GUTO é um organismo, não uma soma de módulos

Não existem funcionalidades independentes. Tudo influencia o resto. O valor do produto — a sensação de "alguém pensando por mim" — **emerge do ciclo fechado**, não de nenhuma parte isolada.

```txt
Calibragem → Memória → Chat → Treino → Missão → GUTO Online
   → Validação → XP → Arena → Avatar → Percurso → Coach
   → Proatividade → Memória (de novo)
```

**Regra de ouro do organismo:** se qualquer parte decide sozinha ou deixa de atualizar outra parte, o usuário deixa de sentir continuidade e o produto inteiro quebra. Por isso Arena, Avatar, Coach, Percurso, Dieta, Treino e Proatividade **não são opcionais** — eles existem para formar **um único comportamento**.

## 2. As três camadas físicas

```txt
  CORPOGUTO (frontend / o corpo)
        │  HTTPS
        ▼
  CEREBROGUTO (backend / o cérebro)
        │
        ▼
  MEMÓRIA + estado persistente (fonte única de verdade)
```

- **CORPOGUTO (o corpo):** renderiza, captura entrada, mostra avatar/abas/cards, executa a UI. **Não decide comportamento do GUTO.** Faz rollback otimista quando a persistência falha (para nunca mentir que salvou).
- **CEREBROGUTO (o cérebro):** interpreta a mensagem, carrega a memória, decide o turno, gera treino/dieta dentro dos trilhos, aplica segurança, persiste, controla XP/proatividade.
- **Memória/estado:** a **fonte única de verdade**. Precisa ser durável (sobreviver a redeploy) e consultada por todas as áreas. Se chat, missão e dieta lerem verdades diferentes, é bug crítico.

## 3. O fluxo de um turno (o caminho do dado)

```txt
Usuário escreve / toca botão rápido
→ Frontend: POST /guto/chat  (mensagem + contexto da aba)
→ Backend carrega GutoMemory (fonte de verdade)
→ Piso de segurança: classificador de risco (1 chamada; falha-aberta)
→ CÉREBRO SOBERANO: 1 decisão, dentro do CONTRATO DE TURNO + trilhos fechados
→ Ação estruturada validada (treino, memória, proatividade, dieta...)
→ Persistência real (quando aplicável)
→ Contrato de turno volta ao app
→ UI executa: fala, emoção do avatar, botões, cards — já no idioma do usuário
```

A resposta do GUTO **nunca é só texto**. É um **contrato estruturado**. Isso impede que o app vire "um chat bonito que não salva nada".

## 4. O Contrato de Turno (a interface entre cérebro e corpo)

O cérebro devolve **um** objeto estruturado (definido em `CEREBROGUTO/src/guto-turn-contract.ts`). Campos canônicos:

| Campo | O que é | Quem executa |
|---|---|---|
| `fala` / `speech` | O que o GUTO diz, **já no idioma do usuário** | UI (bolha + voz) |
| `acao` / `action` | Ação estruturada (ex.: `updateWorkout`, gerar dieta, abrir proatividade) | módulo executor |
| `expectedResponse` | Botões rápidos sugeridos (sempre há um próximo passo) | UI |
| `avatarEmotion` | Emoção do avatar no turno | UI (avatar) |
| `memoryPatch` | Adições/correções à memória (campos permitidos, conservador) | memória |
| `workoutPlan` | Plano quando o turno gera/edita treino | aba Missão / `lastWorkoutPlan` |
| `next_step` | **Invariante de produto: nunca vazio.** Garante que toda interação conduz | cérebro/UI |

O contrato é **validado** antes de aplicar. Turno malformado cai no **fallback honesto** (mantém a identidade, não inventa treino/dieta, não mente persistência).

## 5. Responsabilidades — onde cada parte começa e termina

### O cérebro (decide)
- **Cérebro soberano:** a única autoridade que decide o que o GUTO faz no turno. Recebe contexto de todos os fornecedores e emite **um** contrato. (Detalhe em `GUTO_DECISION_ARCHITECTURE.md`.)
- **Piso de segurança (`risk-classifier`):** única exceção com poder de veto — suspende a persona por um turno em risco real (autolesão, transtorno alimentar, evento cardio/neuro agudo, trauma). Falha-aberta.

### Fornecedores de contexto (informam, não decidem)
- **Memória / Calibragem:** quem é o usuário, restrições, objetivo, idioma, país/cidade, histórico.
- **Proatividade:** eventos da semana (viagem, compromisso, janela curta) como contexto a adaptar — **propõe** continuidade, não decide sozinha.
- **Catálogos (exercício/comida):** os trilhos seguros; o que pode ser prescrito.
- **Histórico/risco de abandono, clima/feriado local:** sinais auxiliares.

### Executores / mãos (fazem, não decidem)
- **Treino & Missão:** materializam o `workoutPlan` decidido; respeitam catálogo, vídeo e `lockedByCoach`.
- **Dieta:** materializa o plano respeitando `NÃO COMO`, país e idioma.
- **GUTO Online:** conduz a sessão por estado (briefing, série, descanso, pausa, dor, retomada).
- **Validação → XP → Arena → Avatar → Percurso:** registram presença validada e propagam **o mesmo** estado a todos os lugares.

### Operação humana (por trás)
- **Coach / Empresa / Admin:** acompanham, editam plano (que vira `lockedByCoach`), geram convite, veem risco. **Para o aluno, a presença continua sendo o GUTO.** Isolamento forte por time/coach. XP/streak não são editados à mão (são confiança do sistema).

## 6. As áreas do organismo (mapa rápido)

| Área | Papel no organismo | Doc fonte de verdade |
|---|---|---|
| Calibragem & Memória | Coleta inicial → memória operacional viva | `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` |
| Chat & Cérebro | Central de relação; onde a decisão acontece | `GUTO_CHAT_E_CEREBRO_DETALHADA.md` |
| Treino & Missão | Treino do dia, dentro dos trilhos | `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` |
| Dieta | Plano alimentar por memória + país + restrição | `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` |
| GUTO Online | Sessão assistida guiada por estado | `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` |
| Validação, XP, Evolução | Presença validada vira progresso | `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` |
| Arena & Gamificação | Consistência vira pertencimento/ranking | `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` |
| Proatividade | Contexto semanal vira presença ativa | `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` |
| Painel Admin/Coach/Empresa | Operação B2B2C por trás | `GUTO_PAINEL_ADMIN_CANONICO_V1.md` |

## 7. Idioma na arquitetura (lei, não camada de tradução)

O idioma **não** é uma etapa de tradução no fim do pipeline. O **cérebro produz a fala já no idioma do usuário** (`pt-BR`, `en-US`, `it-IT`), com a personalidade do GUTO naquele idioma. Todos os módulos apenas exibem.

**País ≠ idioma.** O idioma governa fala/botões/voz. O país/cidade governa contexto (alimentação, clima, disponibilidade, cultura). Os dois entram como contexto no cérebro e saem combinados em uma única resposta. Tratar idioma como tradução posterior é uma regressão arquitetural.

## 8. Invariantes de sistema (se quebrar, é bug crítico)

1. **Uma só verdade:** todas as áreas leem o mesmo estado persistido.
2. **Uma só decisão por turno:** emitida pelo cérebro, no contrato.
3. **Persistência honesta:** "salvei" só com gravação confirmada.
4. **Próximo passo sempre:** `next_step` nunca vazio.
5. **Trilhos fechados:** prescrição só dentro do catálogo validado.
6. **Idioma correto na origem:** fala nasce no idioma do usuário.
7. **Plano do coach soberano:** `lockedByCoach` nunca é sobrescrito por automação.
