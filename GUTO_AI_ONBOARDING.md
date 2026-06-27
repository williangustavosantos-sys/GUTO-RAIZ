# GUTO — Onboarding Obrigatório para IAs

> **LEIA ISTO ANTES DE QUALQUER COISA.** Se você é um agente (humano ou IA) prestes a ler ou modificar este projeto, este é o primeiro arquivo. Não abra código antes de terminar esta leitura. Se você começar pelo código, sua conclusão provavelmente estará errada.

---

## 1. A régua que governa tudo

Antes de qualquer decisão, técnica ou de produto, faça a si mesmo uma pergunta:

> **"Isto faz o usuário sentir que existe alguém pensando por ele?"**

Se a resposta for "não", trate como problema de arquitetura — **mesmo que o código esteja correto**. Esta é a essência do GUTO. Tudo neste documento existe para servir a essa frase.

---

## 2. O que é o GUTO

O GUTO é um **companheiro ativo digital**. Não é, e nunca pode virar:

- um chatbot;
- um aplicativo fitness;
- um gerador de treino ou de dieta;
- um personal trainer digital;
- um agente de IA genérico ("como posso ajudar?").

A missão do GUTO não é responder perguntas. É **transformar intenção em ação**. O fitness é só a porta de entrada, porque tem cadência diária. A visão é presença, continuidade, adaptação e cobrança real — uma dupla: "a gente vai fazer", "eu te puxo".

A identidade correta é sempre **GUTO & [Nome Soberano do usuário]**. O nome confirmado no onboarding é soberano e não pode ser substituído por convite, e-mail, nome do coach ou fallback automático.

## 3. Qual problema o GUTO resolve

O problema das pessoas não é falta de treino, dieta ou informação — isso existe em excesso. O problema é **falta de continuidade, cobrança, vínculo e presença** no momento em que o usuário está cansado, sozinho ou negociando com a própria preguiça.

Um app comum entrega conteúdo. O GUTO entrega **presença**. Um app diz "treino de hoje". O GUTO diz: "Hoje é treino. Já considerei teu joelho, teu nível e teu objetivo. Sem ego. Vamos fazer limpo."

A métrica de sucesso não é treino concluído hoje. É **quantas pessoas voltam depois de 7, 14 e 30 dias porque sentem que o GUTO estava esperando por elas.**

## 4. Filosofia do produto (as leis inegociáveis)

1. **O GUTO tem personalidade própria, não configurável.** Melhor amigo / irmão mais velho: direto, leal, curto, com postura. Cobra sem humilhar. Adapta sem virar frouxo.
2. **Ele conduz, não espera o usuário pensar.** Não terceiriza decisão quando existe caminho seguro.
3. **Toda interação termina com um próximo passo claro.** Sempre.
4. **Ele não pergunta o que já sabe.** Memória é confiança.
5. **Ele lembra contexto ativo** e mantém continuidade entre turnos, telas e dias.
6. **Chat, missão, dieta, percurso e memória são UMA única verdade.** Se divergem, é bug crítico.
7. **Ele adapta** treino/dieta/tom por cidade, rotina, **eventos temporários da vida** (qualquer compromisso futuro que altere rotina — ver lei 13), clima, restrição alimentar, limitação física e histórico.
8. **Ele pergunta quando não sabe** — mas nunca vira formulário nem chatbot passivo.
9. **Ele nunca mente que salvou, mudou ou ajustou** algo se o estado real não mudou.
10. **Idioma é lei.** O GUTO nasce falando português, inglês e italiano de forma fluente, **sempre os três**. Idioma não é tradução nem feature — é parte da personalidade. O cérebro **pensa e responde diretamente no idioma do usuário desde a origem da resposta**; não existe tradução posterior, nem fase "só um idioma". **País ≠ idioma:** um brasileiro em Roma fala português e recebe contexto italiano (alimentação, clima, cultura, disponibilidade). Isso é inteligência do produto.
11. **O GUTO é um sistema fechado contra erro, aberto à criatividade controlada.** A IA cria treino/fala/adaptação com liberdade, mas só dentro de trilhos validados (catálogo de exercícios com vídeo, restrições, segurança, memória confirmada).
12. **O GUTO não é uma árvore de "se X então Y".** O motor é intenção + contexto + memória + fase + idioma + grau de certeza. Palavra-chave/regex só como piso de segurança, **nunca** como cérebro.
13. **O GUTO raciocina sobre conceitos, não sobre casos.** Ele entende a **classe** "Evento Temporário da Vida do Usuário" — viagem, aniversário, reunião, entrevista, campeonato, jogo, consulta, cirurgia, festa, casamento, férias, plantão, evento de trabalho, mudança, show, qualquer compromisso futuro que altere treino, dieta, descanso, horários ou comportamento. **Viagem é apenas uma instância.** Especializar o cérebro para um caso específico é proibido (ver lei 12).

## 5. A identidade do GUTO não se reduz

O GUTO foi concebido como **um único organismo onde tudo influencia tudo**. Arena, Avatar, XP, Percurso, Coach, GUTO Online, Dieta, Proatividade, Painel B2B e os **três idiomas** **não são features extras** — são **identidade**. Existem porque o organismo precisa deles para gerar a sensação de presença.

> O problema do GUTO **nunca foi a quantidade de módulos.** Foi a **arquitetura de decisão** (múltiplos lugares decidindo). O que precisa mudar é a arquitetura, **não o produto.** Queremos um cérebro soberano, não um produto menor.

Nenhuma recomendação neste repositório pode passar a impressão de reduzir, cortar ou congelar a identidade do GUTO. Simplifica-se a **arquitetura**, jamais a **visão**.

## 6. O que NUNCA pode ser feito

- Tratar o GUTO como coleção de features independentes. **Ele é um organismo: tudo influencia tudo.**
- Propor "cortar/reduzir o produto" para fazer um MVP menor. Remover Arena, Avatar, XP, Coach, Percurso, idiomas, B2B ou GUTO Online **não simplifica o GUTO — destrói o GUTO.**
- **Especializar o cérebro/arquitetura para um caso específico** (ex.: um fluxo "de viagem"). Raciocine sobre a **classe** (Evento Temporário da Vida do Usuário). Um fluxo-por-caso é a mesma doença de um gate-por-palavra-chave.
- Resolver um bug adicionando mais um *gate*/regex/`if` que decide o turno. Isso cria o "parlamento de cérebros" — a causa-raiz das regressões (ver `GUTO_DECISION_ARCHITECTURE.md`).
- Deixar um módulo (treino, dieta, proatividade, arena…) tomar decisão própria. Módulos **executam** a decisão do cérebro, não decidem.
- Fingir persistência: dizer "anotei/salvei" sem gravação confirmada.
- Chutar default (`casa`, `sem dor`, `none`) só para seguir o fluxo.
- Tratar idioma como tradução posterior, ou supor uma fase "só um idioma".
- Dizer que algo está pronto porque os testes (mockados) passaram. **Teste verde ≠ comportamento real.**
- Vazar marcador interno de controle para o texto do usuário.
- Misturar áreas sem autorização: uma tarefa de calibragem não vira mudança de painel/XP/treino/prompt.
- Ler, copiar ou expor segredos de `.env`.

## 7. Como uma IA deve trabalhar neste projeto

1. **Entenda o produto antes do código.** Termine a ordem de leitura abaixo.
2. **Diagnostique a causa arquitetural, não o sintoma.** Antes de corrigir, pergunte: "este bug é uma decisão nascendo no lugar errado, ou uma especialização por caso?"
3. **Não misture papéis.** Diagnóstico, implementação e revisão são etapas separadas (ver `GUTO_RELEASE_PROCESS.md`). A IA que implementou não é a que aprova.
4. **Faça o menor fix possível** que resolva a causa **no nível do conceito**, não do exemplo. Se precisar de muitas linhas ou de um novo centro de decisão, pare e explique por quê.
5. **Valide comportamento real**, com o modelo de verdade e estado persistido — nunca só testes mockados.
6. **Pense no organismo inteiro.** Toda mudança no cérebro afeta chat, treino, dieta, proatividade e memória ao mesmo tempo.

## 8. Ordem obrigatória de leitura

Leia **nesta ordem** antes de tocar em qualquer arquivo:

1. **`GUTO_AI_ONBOARDING.md`** (este) — como pensar.
2. **`README.md`** (raiz) — a visão canônica do produto.
3. **`GUTO_DECISION_ARCHITECTURE.md`** — como o cérebro soberano deve pensar. **O documento mais importante.**
4. **`GUTO_SYSTEM_ARCHITECTURE.md`** — como o organismo inteiro se conecta.
5. **O `*_DETALHADA` da área** que você vai tocar (chat, calibragem, treino, dieta, proatividade, online, validação/XP, arena, painel). São a fonte de verdade de cada área.
6. **`GUTO_ENGINEERING_GUIDE.md`** — regras para escrever código sem criar regressão.
7. **`GUTO_RELEASE_PROCESS.md`** — como levar uma mudança da análise ao "pronto" de verdade.

Só depois disso, abra o código.

## 9. Os três repositórios

| Repo | Papel | Apelido |
|---|---|---|
| **GUTO-RAIZ** | Documentação canônica + submódulos. A fonte da visão. | a raiz |
| **CEREBROGUTO** | Backend. Interpreta, decide, gera treino/dieta, aplica segurança, salva memória, controla XP/proatividade. | o cérebro |
| **CORPOGUTO** | Frontend (app do aluno + painéis). Cápsula, avatar, onboarding, abas, chat, missão, dieta, arena, percurso, validação. | o corpo |

Nunca audite ou altere um repo isoladamente: o comportamento do GUTO emerge dos três trabalhando juntos.

## 10. Como validar antes de dizer que algo está pronto

Uma funcionalidade só está "pronta" quando:

- [ ] Passa nas **transcrições douradas** (golden transcripts) rodando contra o **modelo real** (Gemini), não mockado. Elas validam **comportamentos da arquitetura** (detectar evento, confirmar, usar dias depois, não repetir contexto descartado, enriquecer, adaptar treino/dieta/linguagem, manter continuidade), **não um exemplo específico**.
- [ ] O **estado persiste de verdade** (sobrevive a recarregar a tela, sair/voltar, e redeploy).
- [ ] **Uma só verdade**: o dado aparece igual em chat, missão, dieta, arena, percurso e memória.
- [ ] **Termina com próximo passo claro** em todo turno.
- [ ] **Não repergunta** o que já está salvo; **não chuta** default; **não mente** persistência.
- [ ] **Não nasceu nenhum gate novo** (nem especialização por caso) que decide o turno — a decisão ficou no cérebro.
- [ ] Responde **no idioma do usuário desde a origem**, com contexto de país correto.
- [ ] Um usuário comum consegue usar por **10–20 minutos sem sentir que é um chatbot quebrado**.

Se qualquer caixa estiver vazia, **não está pronto** — não importa quantos testes estejam verdes.
