# GUTO — Guia de Engenharia para IAs

> Manual de como **escrever código** no GUTO sem recriar o ciclo de regressão. Pré-requisito: `GUTO_AI_ONBOARDING.md`, `GUTO_DECISION_ARCHITECTURE.md`, `GUTO_SYSTEM_ARCHITECTURE.md`.

---

## 1. A regra mãe

> **Nunca conserte um bug criando um novo centro de decisão — nem um novo ramo especializado por caso.**

A causa-raiz das regressões do GUTO é o "parlamento de cérebros". Cada `gate`/regex/`if` novo que **decide** o turno — e cada ramo nomeado por exemplo (`travelDetected`, `isWedding`…) — aprofunda a doença. A correção certa quase sempre é: **levar a decisão para o cérebro e dar a ele o contexto que faltava**, raciocinando por **classe**, não por exemplo.

## 2. As 11 regras inegociáveis

1. **Nunca adicione um novo gate para resolver um caso isolado.** Se um caso específico quebra, o cérebro não tinha o contexto certo — corrija o contexto, não a periferia.
2. **Nunca especialize por instância.** Não crie fluxo/ramo "de viagem", "de cirurgia", "de casamento". Trate a **classe** (ex.: Evento Temporário da Vida do Usuário); o tipo é **dado de contexto**, não ramo de decisão.
3. **Sempre procure a causa arquitetural.** Pergunte "por que este bug é possível?", não só "onde acontece?". Um bug é quase sempre uma decisão no lugar errado, duas fontes de verdade, ou especialização por caso.
4. **Sempre verifique o impacto no organismo inteiro.** Uma mudança no cérebro afeta chat, treino, dieta, proatividade, memória e idioma de uma vez.
5. **Faça o menor fix que resolve a causa.** Se exige muitas linhas ou um novo decisor, **pare e explique** — provavelmente o desenho está errado.
6. **Uma só verdade.** Nunca crie um segundo lugar que guarda o mesmo estado. Leia e escreva na fonte única e durável.
7. **Persistência honesta.** Só responda "salvei/anotei/ajustei" depois da gravação confirmada. Em falha, rollback e fala honesta.
8. **Idioma na origem.** A fala nasce no idioma do usuário, no cérebro. Não traduza depois. Os três idiomas existem sempre. País ≠ idioma.
9. **Trilhos fechados.** Prescrição só dentro do catálogo validado (exercício com vídeo, `NÃO COMO`, país). Respeite `lockedByCoach`.
10. **Próximo passo sempre.** Todo turno termina com `next_step`/`expectedResponse` não-vazio.
11. **Controle nunca vira fala.** Marcadores internos (`[CONFIRMAÇÃO PENDENTE]` etc.) jamais aparecem ao usuário.

## 3. Não reduza o produto

O organismo do GUTO (Arena, Avatar, XP, Percurso, Coach, GUTO Online, Dieta, Proatividade, B2B, três idiomas) é **identidade, não feature**. Nenhuma tarefa de engenharia pode propor remover/cortar/"adiar para depois" partes do produto como forma de simplificar. **Simplifique a arquitetura de decisão, nunca a visão.** Se você sente vontade de cortar um módulo para estabilizar, o que você precisa, na verdade, é consolidar a decisão no cérebro — o módulo continua, só deixa de decidir.

## 4. Como abordar um bug (protocolo)

```txt
1. Reproduza ao vivo com o MODELO REAL e estado persistido (não confie no mock).
2. Classifique a causa: a decisão nasceu no lugar errado? há duas verdades?
   faltou contexto ao cérebro? vazou controle? há especialização por caso?
3. Escreva/atualize a TRANSCRIÇÃO DOURADA que captura o COMPORTAMENTO certo
   (não o exemplo). Pode usar viagem, aniversário, plantão — o que importa
   é o comportamento da arquitetura.
4. Corrija a CAUSA (geralmente: dar contexto ao cérebro / consolidar verdade /
   colapsar ramo por caso em raciocínio por classe), não o sintoma.
5. Rode as transcrições douradas contra o modelo real. Verde só conta aqui.
6. Verifique regressão nos fluxos vizinhos do organismo.
```

## 5. Testes e Golden Transcripts

- A suíte atual roda com o **modelo mockado** ("modelo mockado vazio"). Ela testa os gates determinísticos e os fallbacks — **não** o comportamento real do GUTO. Por isso fica verde enquanto o app quebra.
- **Os testes mockados continuam úteis** como rede determinística (contratos, segurança, trilhos). Não os jogue fora. Mas eles **não** são critério de "pronto".
- **As Golden Transcripts validam COMPORTAMENTOS da arquitetura, não exemplos.** Cada transcript prova um comportamento; o exemplo usado (viagem, aniversário, reunião…) é intercambiável. Comportamentos canônicos a cobrir:
  - detectar um evento temporário na fala livre;
  - confirmar corretamente antes de salvar (anti-chute);
  - usar o contexto **dias depois**, no momento certo;
  - **não repetir** contexto já descartado/recusado;
  - enriquecer a memória (clima/feriado/fuso) sem bloquear se falhar;
  - adaptar **treino**, **dieta** e **linguagem** ao contexto;
  - manter **continuidade** (nunca "descanso" por padrão, nunca "intensidade máxima pra compensar");
  - terminar com **próximo passo**; responder no **idioma** correto; **não reperguntar** o que já sabe.
- Rodam contra o **Gemini de verdade**, com **estado persistido**. Cada bug encontrado ao vivo vira uma transcript nova (de comportamento).
- **Nunca diga "está pronto" sem validar o comportamento completo ao vivo.**

## 6. Refatorar com segurança (não cometer suicídio técnico)

- **Reescrita big-bang do backend = proibida.** Reescrever o monólito do zero perde anos de regras de segurança embutidas e introduz cem bugs novos sem nunca ter um sistema funcionando.
- **Decomposição cirúrgica = obrigatória.** Regra: **nunca extraia/mova nada sem antes ter a transcrição dourada daquele comportamento passando contra o modelo real.** Primeiro a rede, depois o corte. Um pedaço por vez, o app sempre funcionando.
- Comece pelo orquestrador do turno de chat (consolidar no cérebro). Depois, um fluxo por vez.

## 7. Modelo e custo (contexto técnico)

- **Motor ativo de chat/dieta:** Google **Gemini** (`generativelanguage`). **OpenAI** só para transcrição de áudio. O `@anthropic-ai/sdk` aparece no `package.json` mas hoje é juiz de eval, **não** o motor.
- Um cérebro soberano precisa ser **esperto o bastante para interpretar** e raciocinar por classe. Se a qualidade de decisão for fraca, avalie um modelo mais forte **no turno do cérebro** (é um modelo por turno, não o app inteiro) — decisão consciente de custo.
- O LLM **nunca** opera solto: sempre dentro do contrato de turno, com memória injetada e trilhos fechados.

## 8. Higiene de mudança

- **Não misture áreas** numa mesma mudança sem autorização (calibragem ≠ painel ≠ XP ≠ prompt).
- **Não crie mocks que parecem dados reais** sem marcá-los como fase visual/demo.
- **Não leia/exponha segredos** de `.env`.
- **Respeite os submódulos:** GUTO-RAIZ aponta para CEREBROGUTO e CORPOGUTO; mudanças de comportamento quase sempre vivem no cérebro.
- **Documente a decisão**, não só o diff: registre qual papel cada peça assumiu e por que a decisão ficou no cérebro, raciocinando por classe.

## 9. Checklist antes de abrir PR

- [ ] A correção atacou a **causa arquitetural**, não o sintoma.
- [ ] **Nenhum gate novo** e **nenhuma especialização por caso** decide o turno; a decisão ficou (ou voltou) ao cérebro, por classe.
- [ ] **Uma só verdade**; estado persiste de verdade (sobrevive a sair/voltar e redeploy).
- [ ] **Transcrições douradas** de comportamento relevantes passam **com o modelo real**.
- [ ] Verifiquei **fluxos vizinhos** do organismo (sem regressão).
- [ ] Fala no **idioma correto** desde a origem; **próximo passo** presente; **persistência honesta**.
- [ ] Não vazou marcador interno; não chutei default; não menti "salvei".
- [ ] Não reduzi nenhuma parte do produto/identidade.
- [ ] Um usuário comum aguentaria **10–20 min sem sentir chatbot quebrado**.
