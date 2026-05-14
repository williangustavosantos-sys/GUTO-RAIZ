# GUTO — SANTO GRAAL V3.1
## Documento Mestre de Produto, Arquitetura, Comportamento e QA

**Versão:** 3.1 — Maio 2026  
**Status:** Contrato V1 de produto pronto, corrigido a partir do V3  
**Uso:** Fonte de verdade para produto, desenvolvimento, agentes de IA, QA, auditoria, beta e escala.

> Este documento separa o que o GUTO **deve ser** do que ele **já é**.  
> Ele descreve a régua do produto pronto, não uma fotografia otimista do código atual.  
> Quando há divergência entre o comportamento esperado e o código, a divergência deve ser tratada como:
>
> - **bug**, se quebrar uma regra já implementada;
> - **pendência**, se for parte do contrato de produto ainda não implementada;
> - **quarentena**, se existir apenas em branch antiga ou fluxo não oficial.

---

## ÍNDICE

- [0. Como usar este documento](#0-como-usar-este-documento)
- [0.1 Norte absoluto do produto](#01-norte-absoluto-do-produto)
- [0.2 Contrato V1 de prontidão](#02-contrato-v1-de-prontidão)
- [1. O que é o GUTO](#1-o-que-é-o-guto)
- [2. Regra absoluta de QA](#2-regra-absoluta-de-qa)
- [3. Arquitetura](#3-arquitetura)
- [4. Stack técnica](#4-stack-técnica)
- [5. Idioma](#5-idioma)
- [6. Onboarding](#6-onboarding)
- [7. Dados do usuário](#7-dados-do-usuário)
- [8. Sistema de XP e Evolução](#8-sistema-de-xp-e-evolução)
- [9. Aba GUTO / Chat](#9-aba-guto--chat)
- [10. Aba Missão](#10-aba-missão)
- [11. GUTO Online](#11-guto-online)
- [12. Validação de Treino](#12-validação-de-treino)
- [13. Aba Dieta](#13-aba-dieta)
- [14. Aba Arena](#14-aba-arena)
- [15. Aba Evoluir](#15-aba-evoluir)
- [16. Aba Percurso](#16-aba-percurso)
- [17. Proatividade](#17-proatividade)
- [18. Voz e Identidade Sonora](#18-voz-e-identidade-sonora)
- [19. Push Notifications](#19-push-notifications)
- [20. Configurações](#20-configurações)
- [21. Painel Admin / Coach](#21-painel-admin--coach)
- [22. Backend e APIs](#22-backend-e-apis)
- [23. Segurança](#23-segurança)
- [24. Mapa de arquivos críticos](#24-mapa-de-arquivos-críticos)
- [25. Estados de QA](#25-estados-de-qa)
- [26. Bugs críticos a caçar](#26-bugs-críticos-a-caçar)
- [27. Roadmap V1](#27-roadmap-v1)
- [28. Critério final de prontidão](#28-critério-final-de-prontidão)

---

## 0. Como usar este documento

### Para agentes de IA

Leia o documento inteiro antes de editar qualquer coisa.

Um agente que altera código sem entender este contrato tende a cometer três erros:
1. criar feature bonita que não fecha ciclo;
2. responder como IA genérica e matar a identidade do GUTO;
3. salvar estado errado, misturar usuário ou prometer memória inexistente.

Cada seção define:
- comportamento esperado;
- regra de produto;
- arquivos envolvidos;
- riscos críticos;
- estado de QA esperado.

### Para QA

Use a Regra Absoluta de QA da seção 2.  
Uma feature só é considerada pronta quando passa pelos 13 pontos.

### Para produto

Qualquer nova decisão deve ser comparada contra os princípios inegociáveis da seção 1.3.

### Regra de ouro

```txt
Código existente ≠ feature pronta.
Tela existente ≠ fluxo validado.
Resposta bonita da IA ≠ ação salva.
Build passando ≠ produto pronto.
```

### Classificação obrigatória

Toda análise do GUTO deve classificar cada área como:

| Estado | Significado |
|---|---|
| **Implementado validado** | Passou pelos 13 pontos de QA, inclusive mobile real. |
| **Implementado técnico** | Existe no código, builda, mas não foi validado ponta a ponta. |
| **Parcial** | Existe parte da função, mas o ciclo não fecha. |
| **Pendente** | Faz parte do contrato, mas ainda não foi implementado. |
| **Quarentena** | Existe em branch antiga, backup ou fluxo não oficial. |
| **Bug crítico** | Quebra identidade, memória, segurança, idioma, XP, privacidade ou confiança. |

### Classificação de prioridade V1

Toda exigência deste documento também deve receber uma prioridade de produto:

| Prioridade | Significado | Regra |
|---|---|---|
| **V1 obrigatório** | Sem isso o GUTO não pode ser considerado pronto para usuários reais. | Deve ter critério de aceite observável e teste/smoke/manual definido. |
| **Pós-V1** | Importante para maturidade, venda ou escala, mas não bloqueia o primeiro V1 controlado. | Não pode ser prometido na UI como se estivesse pronto. |
| **Quarentena** | Ideia, branch antiga, fluxo instável ou requisito sem validação objetiva. | Não pode contar como feature pronta nem como base de decisão. |

Regra de interpretação:

```txt
Se uma seção define comportamento central do usuário e não estiver marcada como Pós-V1,
ela é V1 obrigatório.
```

Um requisito V1 inválido é qualquer requisito que:
- não tenha critério de aceite observável;
- dependa de explicação manual do fundador;
- dependa de mock/local-user em fluxo real;
- não possa ser verificado por teste, smoke, QA mobile, inspeção de persistência ou teste comportamental.

---

## 0.1 Norte absoluto do produto

O GUTO está pronto quando um usuário novo consegue passar 7 dias sem o fundador explicar nada por WhatsApp e sente que:

1. O GUTO sabe quem ele é.
2. O GUTO sabe o que ele precisa fazer hoje.
3. O GUTO percebe quando ele some.
4. O GUTO adapta sem virar frouxo.
5. O GUTO cobra sem humilhar.
6. O GUTO lembra do que foi combinado.
7. O GUTO evolui junto com ele.

A barra oficial:

```txt
O usuário sente que o GUTO estava esperando por ele.
```

Se uma feature não aumenta essa sensação de presença, ela é secundária.

O GUTO não deve tentar parecer “a IA mais inteligente”.  
Ele deve parecer **a presença mais constante**.

---

## 0.2 Contrato V1 de prontidão

Este documento é a régua oficial do **GUTO V1 pronto**.  
Ele não deve ser lido como lista de desejos nem como inventário do que já existe no código.

### Regra central

```txt
Santo Graal = destino obrigatório.
Gap map = diferença entre destino e código atual.
Código atual nunca reduz a régua do Santo Graal.
```

### Matriz V1 por domínio

| Domínio | Prioridade | Critério mínimo de aceite |
|---|---|---|
| Identidade, tom e limites do GUTO | V1 obrigatório | GUTO conduz ação, não vira chatbot genérico, não humilha e não promete o que não salva. |
| QA absoluto | V1 obrigatório | Toda feature V1 passa pelos 13 pontos da seção 2 ou permanece parcial/pendente. |
| Arquitetura, API e persistência | V1 obrigatório | Frontend e backend usam fluxo real, JWT/session e persistência backend; `local-user` não aparece em produção. |
| Idioma PT/EN/IT | V1 obrigatório | UI, backend, mensagens, erros, arena, dieta e chat respeitam `selectedLanguage`; país não altera idioma. |
| Onboarding | V1 obrigatório | Usuário novo passa por idioma, consentimento, naming, calibragem, pacto e sistema sem pular etapa crítica. |
| Memória e calibragem | V1 obrigatório | Dados salvos não são perguntados de novo; GUTO usa idade, sexo, nível, objetivo, local, patologia, idioma, país, restrições e histórico. |
| Chat/GUTO | V1 obrigatório | Toda resposta de ação fecha intenção, contexto, decisão e persistência; fala curta no idioma do usuário. |
| Missão e treino adaptativo | V1 obrigatório | Plano respeita calibragem, histórico recente, dor, limitação, local e feedback; não repete treino burro. |
| GUTO Online | V1 obrigatório se estiver visível | Se aparecer na UI, inicia plano real, guia sessão, adapta dor, retoma sessão e libera validação; se não passar, deve ficar fora do V1. |
| Validação de treino | V1 obrigatório | Valida com usuário autenticado, plano real, fallback de câmera/rede e mídia protegida. |
| Dieta | V1 obrigatório se estiver visível | Respeita país, idioma, restrições, intolerâncias e lock do coach; alimento proibido é bug crítico. |
| XP, streak, Arena, Evoluir e Percurso | V1 obrigatório | Um evento gera um resultado idempotente e consistente em todas as superfícies. |
| Proatividade | V1 obrigatório | Extrai, confirma, agenda/superfície, cobra, adapta e valida sem salvar memória duvidosa sem confirmação. |
| Voz e identidade sonora | V1 obrigatório para segurança de identidade | Voz errada não é fallback aceitável; sem voicepack/TTS correto, usar silêncio + texto + haptic. |
| Push | V1 obrigatório para opt-in/fallback | Não pode virar spam; se push externo não for confiável, presença deve funcionar dentro do app. |
| Configurações e privacidade | V1 obrigatório | Usuário consegue revisar idioma/notificações/dados, exportar/excluir dados reais e entender consentimento. |
| Admin/Coach | V1 obrigatório se disponível | Coach/admin não pode vazar dados, quebrar treino do aluno ou sobrescrever memória crítica sem regra clara. |
| Segurança e saúde | V1 obrigatório | JWT forte, isolamento por usuário/time, sem secret exposto, sem prescrição fora do escopo e sem cobrança após sinal de risco. |
| Métricas, retenção e venda | Pós-V1 | Necessárias para escala/comercialização, mas não substituem prontidão comportamental do V1. |
| Ideias sem critério testável | Quarentena | Não entram em roadmap V1 até virarem comportamento observável. |

### Critério de aceite por requisito V1

Cada requisito V1 deve responder quatro perguntas antes de virar implementação:

```txt
1. Qual comportamento o usuário percebe?
2. Qual dado real entra e onde ele é salvo?
3. Como o GUTO age quando o dado, IA, rede, voz, câmera ou push falha?
4. Como QA prova que passou?
```

Se uma dessas quatro respostas não existir, o requisito ainda não está pronto para guiar código.

---

## 1. O que é o GUTO

### 1.1 Definição

O GUTO **não é**:
- app fitness comum;
- planilha inteligente;
- chatbot motivacional;
- personal digital genérico;
- app de treino com IA por cima;
- biblioteca de exercícios;
- calendário de hábitos bonito;
- mais um app com ranking e notificações.

O GUTO **é** um **companheiro ativo digital**.

Ele vive no celular do usuário como uma presença com identidade própria. Entende rotina, corpo, histórico, falhas, desculpas, contexto semanal, objetivo e relação com o coach. Planeja, conduz, adapta, cobra e lembra o usuário de aparecer.

### 1.2 Tese central

```txt
O problema do fitness digital não é falta de treino, dieta ou informação.
O problema é falta de presença, continuidade, cobrança e vínculo.
```

Um app comum diz:

```txt
Hoje você tem treino de pernas.
```

O GUTO diz:

```txt
Hoje é perna. Eu já ajustei pelo teu joelho. Sem ego, sem pular etapa. Vamos fazer limpo.
```

Essa diferença é o produto.

### 1.3 O inimigo do GUTO

O GUTO compete contra:
- abandono;
- preguiça negociada;
- excesso de informação;
- usuário cansado decidindo sozinho;
- planilha esquecida;
- app que vira ícone morto;
- academia sem presença individual;
- personal que não consegue acompanhar todos diariamente;
- IA genérica que responde bonito e não age.

O usuário não falha porque não sabe que deve treinar.  
Ele falha porque, na hora real, está sozinho.

O GUTO remove essa solidão operacional.

### 1.4 Princípios inegociáveis

#### P1 — O GUTO não executa sem entender

Se houver ambiguidade, ele pergunta. Nunca chuta.

Ações que exigem confirmação quando houver dúvida:
- mudar objetivo;
- mudar idioma;
- mudar peso/altura;
- registrar patologia;
- trocar exercício ou treino;
- salvar memória proativa;
- descartar memória proativa;
- validar treino;
- aplicar penalidade;
- excluir conta;
- alterar dado sensível.

#### P2 — O GUTO não mente sobre memória

Se ele diz “salvei”, algo foi salvo.

Frases como:
- “anotado”;
- “já registrei”;
- “vou lembrar”;
- “deixei salvo”;

só podem aparecer se houver:
1. intenção clara;
2. `memoryPatch` ou action correspondente;
3. endpoint chamado;
4. persistência confirmada.

Se o sistema não salvou, a fala correta é:

```txt
Entendi. Ainda não vou mexer nisso sem confirmar.
```

#### P3 — O GUTO não descarta memória sem validar

Memória proativa não morre só porque a data passou.  
O GUTO pergunta o que aconteceu antes de descartar.

Regra:

```txt
data passou → pending_validation
não → discarded automático
```

#### P4 — Idioma é lei

O app inteiro deve estar no idioma selecionado pelo usuário:
- onboarding;
- consentimento;
- termos;
- privacidade;
- abas;
- chat;
- GUTO Online;
- validação;
- configurações;
- push;
- painel admin quando aplicável;
- mensagens de erro;
- voz quando disponível.

Qualquer texto hardcoded em português para usuário que escolheu inglês ou italiano é **bug crítico**.

#### P5 — O nome digitado é soberano

O nome que o usuário digitou na tela de naming é o nome real da dupla.

Nenhum dado pode substituir automaticamente esse nome depois da confirmação:
- nome de convite;
- nome do coach;
- e-mail;
- auth provider;
- fallback automático.

O convite pode sugerir um nome antes da confirmação.  
Depois da tela de naming, o nome confirmado manda.

#### P6 — Idioma ≠ País

```txt
language = comunicação
country  = contexto local: alimentos, feriados, clima, disponibilidade
```

Exemplo correto:

```txt
Usuário brasileiro na Itália:
language = pt-BR
country  = Itália

Resultado:
texto em português
alimentos disponíveis na Itália
clima/feriados/contexto italiano
```

Exemplo errado:

```txt
Usuário fala português → dieta com tapioca, açaí e alimentos brasileiros por padrão.
```

#### P7 — Voz é identidade

Se a voz cair em voz feminina/browser genérica, quebra a identidade do GUTO.

Fallback correto:
```txt
silêncio + texto + haptic
```

Voz errada é pior que ausência de voz.

#### P8 — O GUTO cobra sem humilhar

O tom é direto, parceiro e firme.  
Nunca cruel, médico, paternalista ou motivacional genérico.

Correto:
```txt
Tu sabe que dá pra fazer menor hoje. O que não dá é sumir.
```

Errado:
```txt
Você falhou de novo. Precisa ter vergonha.
```

#### P9 — O GUTO não prescreve fora do escopo

O GUTO orienta treino e alimentação fitness, mas não faz:
- diagnóstico médico;
- prescrição clínica;
- tratamento de transtorno alimentar;
- orientação emergencial;
- promessa terapêutica;
- recomendação perigosa ignorando dor ou sintoma.

---

## 1.5 A relação GUTO & Usuário

O usuário não cria apenas uma conta. Ele forma uma dupla.

```txt
GUTO & [nome confirmado pelo usuário]
```

Essa identidade aparece em:
- header;
- chat;
- proatividade;
- GUTO Online;
- Arena;
- Evoluir;
- Percurso;
- validação;
- notificações;
- painel admin/coach.

Bug crítico:

```txt
Mostrar email, userId ou nome de convite no lugar da dupla confirmada.
```

---

## 2. Regra absoluta de QA

Uma feature só é “pronta” quando passa pelos 13 pontos:

```txt
1.  Existe no código e está integrada ao fluxo real.
2.  Funciona em mobile real: iOS Safari + Android Chrome.
3.  Usa dados reais do usuário, nunca local-user em produção.
4.  Não mistura dados de usuários diferentes.
5.  Respeita idioma selecionado pelo usuário.
6.  Respeita país/contexto local.
7.  Respeita segurança e limitações de saúde.
8.  Quando promete salvar, salva no backend.
9.  Aparece corretamente em todas as abas relacionadas.
10. Não quebra o painel admin/coach.
11. Tem fallback quando IA, voz, câmera, push ou rede falha.
12. Foi testada com pelo menos 3 perfis diferentes.
13. XP é consistente entre Arena, Evoluir, Percurso e memory.totalXp.
```

### 2.1 O que não conta como pronto

Não conta como pronto:
- tela visualmente pronta;
- componente isolado funcionando;
- mock local;
- resposta correta uma vez;
- build verde sem teste mobile;
- feature existente apenas em branch backup;
- ação que depende de `local-user`;
- fluxo que só funciona com o fundador explicando.

### 2.2 Matriz de confiança

| Situação | Classificação |
|---|---|
| Build passa, mas não testou mobile | Implementado técnico |
| Fluxo funciona local, mas não em produção | Parcial |
| Funciona com um usuário, mas pode misturar dados | Bug crítico |
| Funciona em português, mas não em italiano/inglês | Parcial ou bug crítico |
| GUTO diz que salvou, mas não salvou | Bug crítico |
| Coach altera plano e aluno não vê | Bug crítico |
| Proatividade extrai mas não confirma | Parcial |
| Voicepack falha e cai em voz errada | Bug crítico de identidade |
| Redis ausente no beta | Bug crítico operacional |

---

## 3. Arquitetura

### 3.1 Repositórios

```txt
GUTO-RAIZ (/Users/williandossantos/GUTOO)
 ├── guto-app-v0       → CORPOGUTO   frontend, app, UI, UX
 └── guto-backend      → CEREBROGUTO backend, IA, memória, regras, APIs
```

| Repo | Função | Deploy | Stack |
|---|---|---|---|
| **GUTO-RAIZ** | Orquestração via submódulos, docs, contratos, checkpoints | Não faz deploy | Git submodules |
| **CORPOGUTO** | App do usuário + painel web | Vercel | Next.js, React, TypeScript, Tailwind |
| **CEREBROGUTO** | IA, memória, APIs, safety, proatividade | Render | Node.js, Express, TypeScript, Redis/Upstash |

Regra:

```txt
GUTO-RAIZ não deve duplicar CORPOGUTO e CEREBROGUTO como cópia.
Ele deve apontar para eles como submódulos.
```

### 3.2 Fluxo de dados geral

```txt
Usuário no celular
  ↓
Next.js / CORPOGUTO
  ↓
Rota autorizada de API
  ↓
Express / CEREBROGUTO
  ↓
Redis/Upstash
  ↓ fallback arquivo JSON
  ↓ fallback memória RAM
  ↓
LLM principal
  ↓
Resposta + actions + memoryPatch + safety + XP
```

### 3.3 Regra de API em produção

O frontend deve falar com o backend por uma rota autorizada e explícita.

Pode ser:
1. chamada direta via `NEXT_PUBLIC_API_URL`; ou
2. proxy controlado por rota Next.js.

Desde que:
- CORS esteja correto;
- preview deployments estejam protegidos;
- localhost/dev estejam separados de produção;
- produção não exponha proxy inseguro;
- token/JWT/session seja validado no backend;
- `userId` vindo do client nunca seja aceito cegamente como fonte de verdade.

### 3.4 Proxy de API

Arquivo provável:

```txt
guto-app-v0/app/api/guto/[...path]/route.ts
```

O proxy pode existir para:
- ambiente local;
- preview deployment;
- proteção de origem;
- padronização de headers.

Regra:

```txt
Proxy é aceitável se for seguro.
Chamada direta é aceitável se for segura.
O contrato não exige um único caminho; exige segurança, isolamento e previsibilidade.
```

### 3.5 Regra de submódulos

Quando CORPOGUTO ou CEREBROGUTO mudarem em `main`, o GUTO-RAIZ deve ser atualizado para apontar para os novos commits.

Fluxo correto:

```bash
cd /Users/williandossantos/GUTOO/guto-app-v0
git status
git switch main
git pull

cd /Users/williandossantos/GUTOO/guto-backend
git status
git switch main
git pull

cd /Users/williandossantos/GUTOO
git status
git add guto-app-v0 guto-backend
git commit -m "chore: sync CORPOGUTO and CEREBROGUTO"
git push
```

Regra:

```txt
GUTO-RAIZ nunca deve apontar para commit local não publicado.
```

---

## 4. Stack técnica

### 4.1 Frontend — CORPOGUTO

| Tecnologia | Uso |
|---|---|
| Next.js 16 | Framework, App Router, build/deploy |
| React + TypeScript | UI |
| Tailwind CSS | Estilização |
| Framer Motion | Animações |
| Lucide React | Ícones |
| Web Speech API | Reconhecimento de voz no navegador |
| Web Speech API `speechSynthesis` | Fallback emergencial de TTS, controlado |
| IndexedDB | Cache de áudio/voicepack |
| localStorage | Perfil local, idioma, chat state, preferências |
| Push API + Service Worker | Notificações push |
| Canvas API | Captura de foto na validação |

### 4.2 Backend — CEREBROGUTO

| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor HTTP |
| TypeScript | Tipagem |
| Google Gemini 2.5-Flash | LLM principal |
| Anthropic Claude | LLM alternativo/evals, se configurado |
| OpenAI | TTS oficial remoto, se configurado |
| Upstash Redis | Memória persistente de produção |
| JSON files | Fallback local/dev |
| JWT | Autenticação |
| bcrypt | Hash de senha |
| Web Push / VAPID | Notificações push |
| Stripe | Billing/assinatura |

### 4.3 Voz — separação obrigatória

#### Entrada de voz

Entrada de voz significa o usuário falando para o GUTO.

Prioridade:
1. Web Speech API no navegador;
2. STT remoto apenas se configurado futuramente;
3. texto manual se voz indisponível.

#### Saída de voz

Saída de voz significa o GUTO falando com o usuário.

Prioridade:
1. voicepack/static oficial;
2. cache local IndexedDB;
3. TTS oficial remoto;
4. Web Speech API `speechSynthesis` apenas como emergência controlada;
5. silêncio + texto + haptic quando a voz errada quebraria a identidade.

Regra:

```txt
Não misturar input de voz com identidade sonora do GUTO.
Reconhecimento de voz é ferramenta.
Voz do GUTO é marca.
```

---

## 5. Idioma

### 5.1 Idiomas suportados

```ts
type SupportedLanguage = "pt-BR" | "en-US" | "it-IT"
```

Espanhol não deve aparecer como idioma ativo enquanto não estiver implementado e validado.

### 5.2 O que muda com o idioma

Ao selecionar idioma, devem estar naquele idioma:
- onboarding;
- consentimento;
- Termos de Uso;
- Política de Privacidade;
- labels de todas as abas;
- chat;
- botões;
- mensagens de erro;
- GUTO Online;
- configurações;
- push;
- validação de treino;
- painel admin, quando selecionado;
- voz, quando disponível.

Frases de validação:

| Idioma | Frase |
|---|---|
| pt-BR | `TREINO FEITO, GUTO` |
| en-US | `WORKOUT DONE, GUTO` |
| it-IT | `ALLENAMENTO FATTO, GUTO` |

### 5.3 Fluxo completo de idioma

```txt
1. Usuário seleciona idioma na tela de language
   → localStorage: guto-onboarding-language
   → persistProfile({ language })
   → persistMemory({ language })

2. Consent screen recebe language
   → links: /terms?lang=XX e /privacy?lang=XX
   → páginas legais renderizam no idioma correto

3. Troca via Settings
   → effectRegistry.emit("language_select", { language, source: "settings" })
   → setSelectedLanguage(language)
   → writeConfirmedLanguageStorage(language)
   → persistProfile({ language })
   → persistMemory({ language })
   → localizeGutoWorkoutPlan()

4. Troca via Chat
   → backend retorna acao="changeLanguage" + memoryPatch.language
   → chat-tab chama onChangeLanguage(language)
   → mesmo fluxo de settings
```

### 5.4 Chaves de localStorage de idioma

| Chave | Valor | Quando |
|---|---|---|
| `guto-onboarding-language` | `pt-BR` / `en-US` / `it-IT` | Seleção inicial |
| `guto-selected-language` | `pt-BR` / `en-US` / `it-IT` | Idioma confirmado |

### 5.5 Resolução de idioma

#### Onboarding

```txt
onboardingLanguage
→ localProfileLanguage
→ memoryLanguage
→ globalStoredLanguage
→ "pt-BR"
```

#### App principal

```txt
sessionLanguage
→ localProfileLanguage
→ memoryLanguage
→ onboardingLanguage
→ globalStoredLanguage
→ "pt-BR"
```

### 5.6 Normalização no backend

O backend deve normalizar variações:

```ts
{
  "portugues": "pt-BR",
  "português": "pt-BR",
  "brasil": "pt-BR",
  "brasileira": "pt-BR",
  "pt-br": "pt-BR",

  "english": "en-US",
  "ingles": "en-US",
  "inglês": "en-US",
  "en-us": "en-US",

  "italiano": "it-IT",
  "italian": "it-IT",
  "it-it": "it-IT"
}
```

### 5.7 Bug crítico de idioma

```txt
Usuário escolhe inglês/italiano e qualquer texto aparece em português → BUG CRÍTICO.
```

Exceção:
- logs internos;
- comentários de código;
- labels técnicos invisíveis ao usuário.

---

## 6. Onboarding

### 6.1 Ordem oficial dos estágios

```ts
type AppStage =
  | "intro"
  | "language"
  | "invite_claim"
  | "consent"
  | "naming"
  | "calibration"
  | "pact"
  | "system"
  | "settings"
```

| Ordem | Stage | Função | Obrigatório |
|---|---|---|---|
| 1 | `intro` | Portal/vídeo de entrada | Sim |
| 2 | `language` | Escolha de idioma | Sim |
| 3 | `invite_claim` | Convite/criação de senha | Condicional |
| 4 | `consent` | Consentimento + termos/privacidade | Sim |
| 5 | `naming` | Nome da dupla | Sim |
| 6 | `calibration` | Dados físicos, objetivo, local, restrições, país | Sim |
| 7 | `pact` | Hold psicológico | Sim |
| 8 | `system` | App principal | — |
| 9 | `settings` | Ajustes | Sob demanda |

### 6.2 Lógica de resolução de estágio

Regra esperada:

```ts
if (!user) return "intro"

if (!profile?.consentHealthFitness || !profile?.acceptedTerms) {
  return "consent"
}

if (!profile?.namingConfirmed && !profile?.onboardingComplete) {
  return "naming"
}

if (!profile?.calibrationComplete && !hasMemoryCalibration(memory)) {
  return "calibration"
}

if (!profile?.pactAccepted && !profile?.onboardingComplete) {
  return "pact"
}

return "system"
```

Regra:

```txt
onboardingComplete não pode pular consentimento obrigatório.
```

### 6.3 Consentimento

Arquivo:

```txt
components/guto/screens/consent-screen.tsx
```

Deve conter no idioma do usuário:
- título;
- explicação de uso de IA;
- explicação de dados de saúde/fitness;
- limitação de responsabilidade;
- checkbox de saúde/fitness;
- checkbox de termos/privacidade;
- links legais com `?lang=`;
- CTA.

Checkboxes obrigatórios:
1. aceite de dados de saúde/fitness;
2. aceite de Termos de Uso + Política de Privacidade.

Só libera o CTA quando ambos estão marcados.

### 6.4 Naming

Regras:
- nome digitado é soberano;
- validado via `POST /guto/validate-name`;
- salvo em `profile.userName`;
- salvo em `memory.name`;
- exibido como `GUTO & [nome]`.

Bug crítico:

```txt
Nome de convite, email ou auth provider substituir nome confirmado.
```

### 6.5 Calibração

Arquivo:

```txt
components/guto/screens/calibration-screen.tsx
```

Campos obrigatórios:

| Campo | Tipo canônico | Validação |
|---|---|---|
| `biologicalSex` | `"male" | "female" | "prefer_not_to_say"` | obrigatório |
| `userAge` | number | 14–99 |
| `trainingLevel` | `"beginner" | "returning" | "consistent" | "advanced"` | obrigatório |
| `trainingGoal` | `"consistency" | "fat_loss" | "muscle_gain" | "conditioning" | "mobility_health"` | obrigatório |
| `preferredTrainingLocation` | `"gym" | "home" | "park" | "mixed"` | obrigatório |
| `heightCm` | number | 100–250 |
| `weightKg` | number | 30–300 |

Campos opcionais:

| Campo | Tipo | Observação |
|---|---|---|
| `trainingPathology` | texto livre | Afeta segurança e treino |
| `country` | texto livre ou ISO/country name normalizado | Afeta dieta, clima, feriados |
| `foodRestrictions` | texto livre/normalizado | Afeta dieta |
| `foodIntolerances` | texto livre/normalizado | Afeta dieta e segurança |
| `phone` | texto livre | Se necessário para acesso/coach |

### 6.6 Pacto

Arquivo:

```txt
components/guto/screens/agreement-screen.tsx
```

Regra:
- hold de 1600ms;
- ao concluir, salva memória inicial;
- marca `onboardingComplete = true`;
- marca `pactAccepted = true`;
- concede `grant_initial_xp`;
- marca `initialXpGranted = true`;
- entra no `system`.

### 6.7 XP inicial

```txt
100 XP de boas-vindas ≠ treino.
Não cria streak.
Não aparece como validação.
Não prova atividade real.
Não deve ser usado para dizer que o usuário treinou.
```

---

## 7. Dados do usuário

### 7.1 StoredProfile — localStorage

Chave:

```txt
guto-white-lab-profile-${userId}
```

Versão atual esperada:

```txt
guto-storage-version = "2"
```

Interface canônica:

```ts
interface StoredProfile {
  language: SupportedLanguage
  userName: string
  onboardingComplete: boolean
  namingConfirmed?: boolean
  calibrationComplete?: boolean
  pactAccepted?: boolean

  phone?: string
  foodIntolerances?: string

  consentHealthFitness?: boolean
  acceptedTerms?: boolean
  consentAcceptedAt?: string
}
```

Regra:

```txt
StoredProfile é cache/estado local.
A fonte de verdade para dados críticos deve estar no backend quando impacta treino, dieta, segurança, XP ou identidade.
```

### 7.2 GutoMemory — backend/Redis

Interface canônica:

```ts
interface GutoMemory {
  // Identidade
  userId: string
  name: string
  language: SupportedLanguage

  // XP e Progressão
  totalXp: number
  streak: number
  initialXpGranted: boolean

  // Status diário
  trainedToday: boolean
  adaptedMissionToday: boolean
  lastActiveAt: string

  // Dados físicos
  userAge?: number
  biologicalSex?: "female" | "male" | "prefer_not_to_say"
  trainingLevel?: "beginner" | "returning" | "consistent" | "advanced"
  trainingGoal?: "consistency" | "fat_loss" | "muscle_gain" | "conditioning" | "mobility_health"
  preferredTrainingLocation?: "gym" | "home" | "park" | "mixed"
  trainingPathology?: string
  country?: string
  heightCm?: number
  weightKg?: number

  // Restrições e contexto
  foodRestrictions?: string
  foodIntolerances?: string
  phone?: string

  // Planos
  lastWorkoutPlan?: GutoWorkoutPlan | null
  weeklyWorkoutPlan?: unknown
  weeklyDietPlan?: unknown

  // Histórico
  completedWorkoutDates: string[]
  adaptedMissionDates: string[]
  missedMissionDates: string[]
  lastWorkoutCompletedAt?: string
  xpEvents: XpEvent[]
  validationHistory?: WorkoutValidationRecord[]

  // Proatividade
  proactiveSent: Record<string, string[]>

  // UI State
  initialXpRewardSeen: boolean
}
```

### 7.3 Resolução do nome

#### Antes da tela de naming

O app pode usar nome provisório para melhorar UX:

1. `inviteName`;
2. `user.name`;
3. `fallbackName`.

#### Depois da tela de naming

Prioridade canônica:

1. nome digitado e confirmado pelo usuário;
2. `memory.name`;
3. `stored.userName`;
4. `fallbackName`.

Regra:

```txt
inviteName pode sugerir.
inviteName nunca substitui nome confirmado.
email nunca vira nome da dupla automaticamente.
```

### 7.4 Restrições alimentares e intolerâncias

Regra canônica:

```txt
foodRestrictions e foodIntolerances devem existir no backend quando afetam dieta.
```

Motivo:

```txt
Se intolerância ficar só no localStorage, o backend pode gerar dieta errada.
```

Portanto:
- localStorage pode manter cache;
- backend deve salvar em `GutoMemory`;
- dieta deve ler do backend;
- settings deve persistir nos dois quando aplicável.

### 7.5 Chaves de localStorage

| Chave | Conteúdo | Crítico? |
|---|---|---|
| `guto-white-lab-profile-${userId}` | Perfil local | Sim |
| `guto-selected-language` | Idioma confirmado | Sim |
| `guto-onboarding-language` | Idioma do onboarding | Sim |
| `guto-pending-invite-token` | Token de convite pendente | Sim |
| `guto-entry-mode` | `"invite"` ou null | Não |
| `guto-storage-version` | `"2"` | Sim |
| `guto-chat-state:${userId}` | Histórico local do chat | Parcial |
| `guto-voice-enabled-${userId}` | Preferência de voz | Não |
| `guto.voice.history.v1` | Anti-repetição de voz | Não |

### 7.6 Fonte de verdade

| Dado | Fonte de verdade |
|---|---|
| userId | JWT/session backend |
| nome confirmado | backend + profile sincronizado |
| idioma | backend + storage confirmado |
| XP | backend |
| streak | backend |
| treino oficial | backend |
| dieta oficial | backend |
| validações | backend |
| proatividade | backend |
| chat local | localStorage, com contexto limitado |

---

## 8. Sistema de XP e Evolução

### 8.1 Eventos de XP

```ts
type XpEventType =
  | "grant_initial_xp"
  | "complete_daily_mission"
  | "accept_adapted_mission"
  | "apply_daily_miss_penalty"
```

Valores oficiais:

| Evento | XP | Observação |
|---|---:|---|
| `grant_initial_xp` | +100 | Boas-vindas/pacto |
| `complete_daily_mission` | +100 | Treino validado |
| `accept_adapted_mission` | +50 | Missão reduzida/adaptada aceita |
| `apply_daily_miss_penalty` | -20 | Falta diária clara |

### 8.2 Regra de XP inicial

```txt
XP inicial é buffer psicológico.
Não é treino.
Não gera streak.
Não entra como validação.
Não prova atividade real.
```

### 8.3 Estágios de evolução

```txt
Baby   → 0 XP mínimo
Teen   → 1.500 XP mínimo
Adult  → 5.000 XP mínimo
Elite  → 12.000 XP mínimo
```

Arquivo:

```txt
lib/guto-evolution.ts
```

Tipo canônico:

```ts
type GutoEvolutionStage = "baby" | "teen" | "adult" | "elite"
```

Não usar estados antigos como:
- `master`;
- `legend`.

Se existirem, são legado e devem ser migrados/removidos.

### 8.4 Avatar por estágio

Cada estágio tem emoções visuais:

| Emoção | Uso |
|---|---|
| `default` | Estado normal |
| `alert` | Atenção |
| `critical` | Dor, risco, problema |
| `reward` | Conquista |
| `super` | Entrada especial |

Estratégia de vídeo:
1. HEVC alpha para Safari;
2. MOV/iOS quando necessário;
3. MP4 com canvas para remoção de fundo preto;
4. WebM fallback.

### 8.5 Consistência absoluta

```txt
Arena XP = Evoluir XP = Percurso XP = memory.totalXp
```

Qualquer divergência é bug crítico.

### 8.6 Penalidade

Penalidade só pode ocorrer quando:
- regra está clara;
- usuário entende consequência;
- data/timezone estão corretos;
- não foi aplicado duas vezes no mesmo evento;
- não penaliza falha técnica;
- não penaliza usuário por dor, emergência ou risco.

---

## 9. Aba GUTO / Chat

### 9.1 Função

A aba GUTO é o centro operacional da relação.

Ela deve:
- conversar com linguagem natural;
- usar memória real;
- executar ações reais;
- adaptar treino;
- explicar dieta/substituições;
- confirmar antes de salvar quando ambíguo;
- lidar com dor, desculpa e pouco tempo;
- respeitar coach/admin;
- manter identidade do personagem;
- não virar IA genérica.

### 9.2 Arquivo principal

```txt
components/guto/tabs/chat-tab.tsx
```

### 9.3 Estrutura de mensagem

```ts
interface Message {
  id: string
  text: string
  isGuto: boolean
  timestamp: Date
  avatarEmotion?: "default" | "alert" | "critical" | "reward"
}
```

Storage:

```txt
localStorage["guto-chat-state:${userId}"]
```

Regra:

```txt
Chat local não substitui memória backend.
Chat é histórico visual/contextual; memória backend é fonte de verdade operacional.
```

### 9.4 Ações retornadas pelo backend

```ts
type Acao =
  | "none"
  | "updateWorkout"
  | "lock"
  | "changeLanguage"
  | "requestDeleteAccount"
  | "showProfile"
```

| Ação | Resultado esperado |
|---|---|
| `updateWorkout` | Atualiza Missão via `onWorkoutPlanUpdated()` |
| `changeLanguage` | Altera idioma do app |
| `requestDeleteAccount` | Abre fluxo de privacidade/exclusão |
| `showProfile` | Exibe dados do perfil |
| `lock` | Bloqueia/segura fluxo quando necessário |
| `none` | Apenas responde |

### 9.5 Resposta do backend

```ts
interface GutoBackendResponse {
  message: string
  acao?: Acao
  memoryPatch?: Partial<GutoMemory>
  proactiveMemoryAction?: GutoProactiveMemoryAction
  workoutAdaptation?: unknown
  dietAdaptation?: unknown
  safetySignal?: unknown
  workoutPlan?: GutoWorkoutPlan
  avatarEmotion?: GutoAvatarEmotion
  xpEvent?: XpEventType
}
```

### 9.6 Comportamento obrigatório

| Situação | Resposta correta |
|---|---|
| Dor | Pausa cobrança, avalia, adapta ou orienta cuidado |
| Pouco tempo | Oferece missão reduzida real |
| Mudança de peso/altura | Confirma e salva |
| Mudança de objetivo | Confirma e recalibra |
| Troca de idioma | Confirma e altera |
| Mensagem ambígua | Pergunta antes de executar |
| Desculpa fraca | Confronta sem humilhar |
| Pedido fora do escopo | Redireciona com segurança |
| Falha de rede/IA | Fallback honesto, não finge ação |

### 9.7 Proibido no chat

```txt
- Dizer que salvou sem salvar.
- Ignorar patologia.
- Sugerir alimento proibido.
- Marcar treino como feito sem validação.
- Alterar plano bloqueado pelo coach sem regra.
- Falar no idioma errado.
- Responder como IA genérica.
- Prometer ação inexistente.
- Esconder falha técnica com frase bonita.
- Aceitar userId vindo do client como autorização.
```

### 9.8 Voz no chat

Entrada:
- Web Speech API;
- `recognition.lang` conforme idioma;
- fallback para texto.

Saída:
- `gutoVoice.speak()`;
- preferir voz oficial;
- evitar browser fallback inadequado;
- silêncio + texto quando necessário.

### 9.9 Extração semanal de proatividade

Regra:
- 1x por semana;
- ISO week;
- se houver pelo menos 6 mensagens;
- usar últimas 20 mensagens;
- extrair eventos operacionais, não comentários soltos.

Exemplo:
```txt
"Roma é linda" → não extrair.
"quinta vou para Roma" → extrair.
```

---

## 10. Aba Missão

### 10.1 Função

Missão é o treino do dia.  
Não é biblioteca.  
Não é card bonito.  
É o plano que o GUTO espera que o usuário execute.

### 10.2 Arquivo

```txt
components/guto/tabs/mission-tab.tsx
```

### 10.3 O que a aba mostra

- foco do treino;
- data;
- origem do plano;
- badge de bloqueio se coach bloqueou;
- progresso;
- aquecimento;
- exercícios principais;
- vídeo local de execução;
- botão de dúvida contextual;
- botão de validação;
- botão de GUTO Online.

### 10.4 Origem do plano

Prioridade:
1. plano semanal/manual do coach;
2. plano bloqueado pelo coach;
3. plano gerado pelo GUTO;
4. fallback seguro.

Regra:

```txt
Se coach bloqueou, GUTO não altera sem regra explícita.
```

### 10.5 Card de exercício

Deve mostrar:
- checkbox;
- nome localizado;
- grupo muscular;
- séries;
- reps;
- descanso;
- carga quando aplicável;
- notas;
- vídeo preview;
- botão de dúvida.

### 10.6 Botão de dúvida

Ao tocar, deve abrir o chat com contexto completo:

```txt
exerciseId
nome
grupo muscular
séries
reps
carga
descanso
foco do treino
limitações relevantes
plano atual
idioma
```

Bug crítico:

```txt
Botão de dúvida abrir chat genérico sem contexto.
```

### 10.7 Validação do plano

Um plano só é válido para treinar quando:
- todos os exercícios têm `videoProvider === "local"`;
- todas as `videoUrl` começam com `/exercise/visuals/`;
- exercício existe no catálogo oficial ou customizado aprovado;
- não viola patologia;
- respeita local de treino.

Se inválido:
- botão de validação desabilitado;
- aviso claro;
- opção de pedir ajuste ao GUTO ou coach.

---

## 11. GUTO Online

### 11.1 Definição

GUTO Online é a sessão em que o GUTO treina junto com o usuário em tempo real.

Não é:
- videoaula;
- cronômetro bonito;
- chatbot aberto;
- playlist de frases;
- simulação vazia.

É uma sessão guiada com presença ativa.

### 11.2 Arquivos

```txt
components/guto/guto-online-session.tsx
lib/guto-online/guto-online-engine.ts
lib/guto-online/guto-online-types.ts
lib/guto-online/voice-resolver.ts
```

### 11.3 Fases da sessão

```ts
type GutoOnlinePhase =
  | "briefing"
  | "warmup"
  | "executing_set"
  | "resting"
  | "between_exercises"
  | "quick_talk"
  | "thinking"
  | "paused"
  | "pain_check"
  | "substitution"
  | "fatigue_adjustment"
  | "finished"
```

### 11.4 Estados visuais

```txt
ouvindo
falando
pensando
descanso
pausado
voz instável
dor
troca
finalizado
```

### 11.5 Retomada de sessão

| Tempo fora | Comportamento |
|---|---|
| 0–15 min | Retoma automaticamente |
| 15 min–12h | Pergunta continuar ou recomeçar |
| >12h | Descarta sessão |

### 11.6 Quick Talk

Quick Talk deve:
- interromper voz atual;
- abrir overlay de conversa rápida;
- processar dor/cansaço/troca;
- voltar para fase anterior;
- não perder estado da sessão.

Comandos:
- dor → `pain_check`;
- cansaço → `fatigue_adjustment`;
- troca → `substitution`;
- outros → resposta contextual curta.

### 11.7 Voz na sessão

- modo voz persistido;
- fila com prioridades;
- frases por fase;
- anti-repetição;
- fallback silencioso quando voz errada.

### 11.8 Critério de GUTO Online pronto

GUTO Online só é pronto quando:
1. inicia com plano real;
2. guia aquecimento;
3. registra série feita;
4. controla descanso;
5. permite pausa;
6. lida com dor;
7. permite troca;
8. finaliza;
9. libera validação;
10. retoma sessão após fechar app dentro da janela esperada;
11. funciona em mobile;
12. não depende de IA para cada microestado.

---

## 12. Validação de Treino

### 12.1 Arquivo

```txt
components/guto/validation/workout-validation-flow.tsx
```

### 12.2 Fluxo

```ts
type FlowStep =
  | "intro"
  | "ready"
  | "camera"
  | "countdown"
  | "speaking"
  | "uploading"
  | "success"
```

| Passo | Função |
|---|---|
| `intro` | Explica validação |
| `ready` | Mostra frase |
| `camera` | Verifica presença |
| `countdown` | 3, 2, 1 |
| `speaking` | Captura |
| `uploading` | Envia |
| `success` | XP + percurso |

### 12.3 Detecção de rosto

Método atual esperado:
- análise de luminosidade;
- variância;
- estabilidade;
- sem ML obrigatório.

Regra:

```txt
Validação por presença não deve fingir biometria avançada se não existe.
```

### 12.4 Captura

```ts
ctx.translate(canvas.width, 0)
ctx.scale(-1, 1)
ctx.drawImage(video, 0, 0)
canvas.toDataURL("image/jpeg", 0.8)
```

### 12.5 Payload

```ts
validateWorkout({
  userId,
  imageBase64,
  workoutFocus,
  workoutLabel,
  locationMode,
  language,
  workoutPlan
})
```

### 12.6 Autorização

Regra crítica:

```txt
Backend deve validar userId por JWT/session.
Client não pode provar identidade sozinho.
```

### 12.7 Fallback

Se câmera, voz ou permissão falhar:
- usuário não pode ficar preso;
- fluxo alternativo deve existir;
- alternativa pode ter menor confiança;
- XP pode exigir regra diferenciada;
- GUTO deve explicar sem parecer bug.

---

## 13. Aba Dieta

### 13.1 Função

Dieta entrega orientação alimentar fitness estruturada.  
Não é prescrição clínica.

### 13.2 Idioma vs país

```txt
language = texto
country  = disponibilidade alimentar
```

Exemplo:
```txt
language=pt-BR + country=Itália
→ texto em português
→ alimentos disponíveis na Itália
```

### 13.3 Geração

Endpoint esperado:

```txt
POST /guto/diet/generate
```

Usa:
- peso;
- altura;
- idade;
- sexo biológico;
- objetivo;
- nível;
- país;
- restrições;
- intolerâncias;
- rotina quando disponível.

### 13.4 Restrições

Se vegano:
```txt
zero carne
zero frango
zero peixe
zero ovo
zero whey comum
zero proteína animal automática
```

Se intolerância à lactose:
```txt
não sugerir leite/laticínios comuns sem alternativa sem lactose.
```

Se alergia:
```txt
alimento proibido nunca entra como sugestão automática.
```

### 13.5 Coach

Coach pode sobrescrever dieta semanal.  
A dieta do coach tem prioridade sobre dieta gerada.

Regra:

```txt
GUTO pode explicar, adaptar sugestão e propor substituição.
Não deve sobrescrever dieta do coach sem regra.
```

### 13.6 Botão de dúvida de alimento

Fluxo:
```txt
usuário toca alimento/refeição
→ abre chat
→ envia alimento + porção + macros + contexto
→ GUTO explica
→ se usuário não tem, sugere substituto
→ substituto respeita país e restrições
```

Bug crítico:
```txt
Substituto ignorar país ou restrição.
```

---

## 14. Aba Arena

### 14.1 Função

Arena transforma presença em competição controlada.  
Não deve virar exposição pública insegura.

### 14.2 Rankings

| Tipo | Escopo | Reset |
|---|---|---|
| Semanal | Grupo/time | Segunda-feira |
| Mensal | Grupo/time | Dia 1 do mês |
| Individual | Pessoal/global conforme regra | Nunca ou acumulado |

### 14.3 Isolamento

Regra:
- ranking semanal e mensal devem ser isolados por `arenaGroupId`;
- `arenaGroupId` deve refletir time/empresa quando B2B2C;
- coach/admin não pode ver ranking de outro time;
- super_admin pode ver tudo.

Usuários visíveis:
```txt
active = true
visibleInArena = true
role = student
```

### 14.4 Identidade

Mostrar:
```txt
GUTO & [nome confirmado]
```

Nunca mostrar:
- userId;
- email cru;
- “Operador #1”;
- nome de convite se nome confirmado existe.

### 14.5 Estado atual esperado

| Item | Estado |
|---|---|
| Ranking semanal/mensal/individual | Implementado técnico |
| Avatar por estágio | Implementado técnico |
| Isolamento por time | Precisa QA |
| Vazamento entre teams | Bug crítico se ocorrer |

---

## 15. Aba Evoluir

### 15.1 Função

Evoluir mostra o progresso do GUTO e da dupla.

Deve mostrar:
- XP total;
- estágio atual;
- progresso para próximo estágio;
- streak;
- avatar animado;
- estágios bloqueados;
- histórico recente de conquistas.

### 15.2 Regras

```txt
Evoluir não calcula XP sozinho.
Evoluir lê memory.totalXp.
```

Se o total exibido divergir de Arena/Percurso:
```txt
BUG CRÍTICO.
```

### 15.3 Estágios

| Estágio | XP mínimo |
|---|---:|
| Baby | 0 |
| Teen | 1.500 |
| Adult | 5.000 |
| Elite | 12.000 |

---

## 16. Aba Percurso

### 16.1 Função

Percurso é a memória visual recente da dupla.

Não é calendário genérico.  
É prova emocional de continuidade.

### 16.2 Janela

Janela visual sugerida:
```txt
-2 dias
-1 dia
hoje
+1 dia
+2 dias
```

### 16.3 Estados

| Status | Significado |
|---|---|
| `completed` | Treino validado |
| `adapted` | Missão adaptada |
| `missed` | Dia perdido |
| `current` | Hoje |
| `locked` | Futuro |

### 16.4 Fontes

- `memory.completedWorkoutDates`;
- `memory.adaptedMissionDates`;
- `memory.missedMissionDates`;
- `memory.trainedToday`;
- `memory.validationHistory`.

Regra:

```txt
Percurso deve refletir validações reais.
Não pode inventar treino com base em XP inicial.
```

---

## 17. Proatividade

### 17.1 Definição

Proatividade é o GUTO pensar antes do usuário perguntar.

Não é notificação genérica.  
Não é lembrete vazio.  
É contexto operacional.

Exemplo correto:

```txt
Antes de montar tua semana: Roma ainda rola quinta?
```

### 17.2 Ciclo correto

```txt
Segunda-feira
→ GUTO pergunta sobre a semana
→ usuário fala planos
→ sistema extrai possíveis memórias
→ memória vira pending_confirmation
→ GUTO confirma naturalmente
→ usuário confirma/nega/corrige
→ backend enriquece se confirmado
→ GUTO usa durante a semana
→ evento passa
→ GUTO valida se aconteceu
→ marca resultado final
```

### 17.3 Estados canônicos

Estados oficiais de `ProactiveMemoryStatus`:

```ts
type ProactiveMemoryStatus =
  | "pending_confirmation"
  | "confirmed"
  | "enriched"
  | "surfaced"
  | "pending_validation"
  | "validated_happened"
  | "validated_postponed"
  | "discarded"
```

Aliases antigos como:
- `needs_validation`;
- `happened`;
- `postponed`;

só podem existir em migração/compatibilidade. Código novo deve usar apenas os estados canônicos.

### 17.4 Estrutura canônica

```ts
interface ProactiveMemory {
  id: string
  userId: string
  type: "trip" | "commitment" | "schedule" | "health" | "other"
  status: ProactiveMemoryStatus

  rawText: string
  understood: string

  dateText?: string
  dateParsed?: string
  location?: string

  weatherEnrichment?: {
    city: string
    date: string
    tempMin?: number
    tempMax?: number
    condition?: string
    source?: string
  }

  holidayEnrichment?: Array<{
    name: string
    nameLocal?: string
    date: string
    country?: string
  }>

  weekKey: string

  createdAt: string
  confirmedAt?: string
  surfacedAt?: string
  validatedAt?: string
  discardedAt?: string

  discardRequestedAt?: string
  discardRequestReason?: string
}
```

### 17.5 Ações via chat

```ts
type GutoProactiveMemoryAction =
  | { type: "confirm"; memoryId: string }
  | { type: "discard"; memoryId: string }
  | { type: "validate"; memoryId: string; outcome: "happened" | "postponed" | "discarded" }
  | { type: "request_discard"; memoryId: string }
  | { type: "cancel_discard_request"; memoryId: string }
```

### 17.6 Regra de descarte confirmado

```txt
request_discard não descarta.
request_discard apenas seta discardRequestedAt.
O descarte real só ocorre após confirmação explícita do usuário.
```

Fluxo correto:

```txt
Usuário: "cancelei Roma"
→ memória ativa: confirmed/enriched/surfaced
→ LLM retorna request_discard
→ backend seta discardRequestedAt
→ próximo turno pergunta "Roma — descarta ou mantém?"
→ usuário confirma
→ action discard
→ status discarded
```

Se usuário muda de ideia:

```txt
Usuário: "não, mantém"
→ cancel_discard_request
→ remove discardRequestedAt
→ memória continua ativa
```

### 17.7 Extração semanal

Regras:
- 1x por ISO week;
- mínimo 6 mensagens;
- últimas 20 mensagens;
- extrair compromissos operacionais;
- não extrair elogios, comentários vagos ou conversa casual sem ação.

### 17.8 Polling

- intervalo sugerido: 60 segundos;
- endpoint: `GET /guto/proactive`;
- deduplicação por última mensagem/evento;
- respeitar idioma e timezone.

### 17.9 Timezone

Padrão:

```txt
Europe/Rome
```

Regra:

```txt
Nunca usar UTC puro para datas relativas de usuário.
```

Exemplo:
```txt
"amanhã" deve ser calculado no timezone do usuário.
```

### 17.10 Status atual esperado

| Item | Estado |
|---|---|
| Extração | Implementado técnico |
| Confirmação | Implementado técnico |
| Descarte confirmado | Implementado técnico, precisa QA mobile |
| Enriquecimento | Implementado técnico |
| Validação posterior | Implementado técnico |
| UI visível de memórias pendentes | Pendente/Parcial |
| QA mobile ponta a ponta | Pendente |

---

## 18. Voz e Identidade Sonora

### 18.1 Regra central

A voz é parte da identidade do GUTO.

```txt
Voz errada é pior que silêncio.
```

Se cair em voz feminina/browser genérica como padrão, é bug crítico de identidade.

### 18.2 Hierarquia de saída de voz

```txt
1. Voicepack/static oficial
2. Cache local IndexedDB
3. TTS oficial remoto
4. Browser fallback controlado
5. Silêncio + texto + haptic
```

### 18.3 Voicepack

```ts
interface VoicePackManifest {
  version: number
  voiceId: string
  voiceVersion: string
  languages: Record<string, {
    intents: Record<string, VoicePackEntry[]>
  }>
}
```

Intents essenciais:
- `session.entry.first_time`;
- `session.entry.returning`;
- `set.done.clean`;
- `set.rest.short`;
- `set.rest.long`;
- `session.finish`;
- `pain.check`;
- `fatigue.adjust`;
- `mission.reduced`;
- `validation.success`.

### 18.4 Anti-repetição

Regra:
- mínimo 4 variações por intent crítico;
- não repetir a mesma variação em sequência;
- histórico em `guto.voice.history.v1`.

### 18.5 Feedback sonoro e háptico

| Ação | Feedback |
|---|---|
| Ação principal | Som + haptic |
| Navegação | Som discreto |
| Ação secundária | Haptic/microvisual |
| Pacto concluído | Som no fim do hold |
| Erro | Feedback claro |
| Sucesso de validação | Som + reward visual |

### 18.6 Status esperado

| Item | Estado |
|---|---|
| Hierarquia | Parcial/implementado técnico |
| Anti-repetição | Implementado técnico |
| Fila GUTO Online | Implementado técnico |
| Voicepack completo | Pendente |
| Fallback browser controlado | Precisa QA |
| Voz consistente nos 3 idiomas | Pendente/Parcial |

---

## 19. Push Notifications

### 19.1 Função

Push é presença, não marketing.

Correto:

```txt
Tua missão ainda está aberta. Se o dia apertou, eu reduzo. Mas não some.
```

Errado:

```txt
Não esqueça de abrir o app!
```

### 19.2 Fluxo de inscrição

Arquivo:

```txt
lib/push-client.ts
```

Fluxo:
1. verificar suporte;
2. pedir permissão;
3. registrar service worker;
4. buscar VAPID public key;
5. assinar push;
6. salvar subscription no backend.

### 19.3 Regras de envio

Push deve respeitar:
- opt-in explícito;
- idioma;
- timezone;
- treino do dia;
- estado de ausência;
- proatividade pendente;
- limite de frequência;
- privacidade;
- não expor dado sensível no texto.

### 19.4 Frequência

Regra:

```txt
O GUTO prefere ser lembrado como presença forte, não como app chato.
```

Push em excesso mata o conceito.

---

## 20. Configurações

### 20.1 Modos

```ts
type SettingsMode =
  | "menu"
  | "language"
  | "name"
  | "profile"
  | "goal"
  | "location"
  | "pathology"
  | "physicaldata"
  | "residence"
  | "food_restrictions"
  | "food_intolerances"
  | "privacy"
```

### 20.2 Configurações

| Configuração | Persistência correta | Observação |
|---|---|---|
| Idioma | profile + memory | Localiza app e plano |
| Nome da dupla | validate-name + profile + memory | Nome soberano |
| Sexo/idade | memory | Segurança e personalização |
| Objetivo | memory | Recalibra treino/dieta |
| Local de treino | memory | Afeta treino |
| Patologia | memory | Segurança |
| Peso/altura | memory | Dieta/cálculo |
| País | memory | Alimentos, clima, feriados |
| Restrições | memory | Dieta |
| Intolerâncias | profile cache + memory | Dieta/segurança |
| Push | backend subscription | Opt-in |
| Billing | Stripe/backend | Assinatura |
| Privacidade | backend + UI | Obrigatório produção/QA |

### 20.3 Regra de settings

```txt
Mudança em settings
→ atualiza backend/memory
→ atualiza estado local
→ próxima geração de treino/dieta/chat/proatividade usa dado novo
```

Bug crítico:

```txt
Usuário muda país/idioma/objetivo e o app continua usando dados antigos.
```

### 20.4 Privacidade e dados

Funcionalidades de privacidade devem existir ou ser claramente marcadas como pendentes.

Contrato de produto:
- ver status de consentimentos;
- ver data do aceite;
- baixar dados;
- corrigir dados;
- revogar consentimentos;
- excluir conta e dados.

Status obrigatório no QA:
```txt
Se qualquer item acima não estiver implementado, marcar como PENDENTE QA.
Não escrever no app que está disponível se não estiver.
```

Confirmação de exclusão:
- pt-BR: `EXCLUIR`;
- en-US: `DELETE`;
- it-IT: `ELIMINA`.

---

## 21. Painel Admin / Coach

### 21.1 Modelo B2B2C

```txt
Super Admin
  → cria times, planos e limites

Admin
  → gerencia time/empresa

Coach/Personal
  → convida alunos, define treino/dieta, monitora

Aluno
  → usa GUTO no celular
```

### 21.2 Acesso

Rotas esperadas:
- `/coach`;
- `POST /auth/coach/login`;
- `POST /auth/admin/login`.

### 21.3 Telas

| Tela | Função |
|---|---|
| Hoje | Visão geral |
| Alunos | Lista e risco |
| Dietas | Fila por risco |
| Treinos | Gestão |
| Histórico | Validações |
| Arena | Rankings |
| Banco | Exercícios |
| Aprovações | Pendências |
| Empresas | Times |
| Coaches | Gestão |
| Logs | Auditoria |

### 21.4 Drawer do aluno

| Aba | Conteúdo |
|---|---|
| Resumo | XP, streak, validações |
| Calibragem | Dados físicos |
| Treino | Editor |
| Dieta | Plano semanal |
| Histórico | Fotos/validações |
| Acesso | Ativar/pausar/arquivar |

### 21.5 O coach pode

- ver seus alunos;
- editar perfil operacional;
- criar/editar treino;
- bloquear treino;
- criar exercícios customizados;
- criar/editar dieta;
- ver histórico;
- gerenciar acesso;
- gerar convite;
- ver rankings do seu escopo.

### 21.6 O coach não pode

- editar XP diretamente;
- editar streak;
- ver aluno de outro coach/time;
- alterar dado burocrático sem permissão;
- acessar super admin;
- sobrescrever regra de segurança.

### 21.7 Isolamento

Regra:
- coach → `coachId`;
- admin → `teamId`;
- super_admin → todos;
- aluno → apenas próprio usuário.

Bug crítico:

```txt
Coach ou admin acessa dado de outro time.
```

### 21.8 Idioma do painel

Tipo:

```ts
type AdminPanelLanguage = "pt-BR" | "it-IT" | "en-US"
```

Persistência:

```txt
localStorage["guto-admin-language"]
```

O painel pode ter idioma próprio, separado do idioma do aluno.

### 21.9 Coach → aluno

```txt
Coach altera treino/dieta
→ backend salva
→ app do aluno carrega versão atual
→ GUTO usa versão nova
→ chat/missão/dieta refletem mudança
```

Bug crítico:

```txt
Coach altera e aluno continua vendo cache antigo.
```

---

## 22. Backend e APIs

### 22.1 Arquivo principal

```txt
guto-backend/server.ts
```

Regra estratégica:

```txt
server.ts muito grande deve ser tratado como dívida técnica, não como erro imediato.
Não refatorar por estética antes de proteger beta.
```

### 22.2 LLM

| Modelo | Uso |
|---|---|
| Google Gemini 2.5-Flash | Principal |
| Anthropic Claude | Alternativo/evals se configurado |
| OpenAI | TTS oficial remoto se configurado |

Configurações esperadas:
- temperatura baixa/moderada;
- timeout definido;
- fallback;
- safety classifier antes de tom cobrador.

### 22.3 Persistência

Prioridade:

```txt
Redis/Upstash → arquivo JSON local → memória RAM
```

Regra de produção:

```txt
Beta real exige Redis/Upstash configurado.
Arquivo JSON e memória RAM são fallback/dev, não fonte principal de verdade.
```

### 22.4 Rotas principais

| Método | Rota | Auth | Função |
|---|---|---|---|
| GET | `/health` | — | Status |
| POST | `/auth/user/login` | — | Login aluno |
| POST | `/auth/coach/login` | — | Login coach |
| POST | `/auth/admin/login` | — | Login admin |
| GET | `/auth/me` | JWT | Usuário atual |
| POST | `/guto` | requireActiveUser | Chat |
| GET | `/guto/memory` | requireActiveUser | Ler memória |
| POST | `/guto/memory` | requireActiveUser | Patch memória |
| POST | `/guto/validate-workout` | requireActiveUser | Validar treino |
| POST | `/guto/validate-name` | requireActiveUser | Validar nome |
| DELETE | `/guto/account` | requireActiveUser | Excluir conta |
| GET | `/guto/diet` | requireActiveUser | Ler dieta |
| POST | `/guto/diet/generate` | requireActiveUser | Gerar dieta |
| GET | `/guto/arena/weekly` | requireActiveUser | Ranking semanal |
| GET | `/guto/arena/monthly` | requireActiveUser | Ranking mensal |
| GET | `/guto/arena/individual` | requireActiveUser | Stats |
| GET | `/guto/arena/me` | requireActiveUser | Perfil Arena |
| GET | `/guto/proactive` | requireActiveUser | Ação proativa |
| POST | `/guto/proactivity/extract` | requireActiveUser | Extrair |
| POST | `/guto/proactivity/confirm` | requireActiveUser | Confirmar |
| POST | `/guto/proactivity/discard` | requireActiveUser | Descartar |
| POST | `/guto/proactivity/request-discard` | requireActiveUser | Pedir descarte |
| POST | `/guto/proactivity/cancel-discard-request` | requireActiveUser | Cancelar pedido |
| POST | `/guto/proactivity/validate` | requireActiveUser | Validar resultado |
| GET | `/guto/push/vapid-public-key` | — | Chave VAPID |
| POST | `/guto/push/subscribe` | requireActiveUser | Registrar push |
| DELETE | `/guto/push/subscribe` | requireActiveUser | Cancelar push |
| POST | `/guto/push/dispatch` | secret | Enviar push |
| GET | `/guto/coach/students` | requireCoachOrAdmin | Alunos |
| GET | `/guto/coach/student/:id` | requireCoachOrAdmin | Detalhe |
| PATCH | `/guto/coach/student/:id` | requireCoachOrAdmin | Editar |
| POST | `/guto/coach/student/create` | requireCoachOrAdmin | Criar |
| DELETE | `/guto/coach/student/:id` | requireCoachOrAdmin | Soft delete |
| GET | `/guto/coach/student/:id/invite-link` | requireCoachOrAdmin | Convite |
| POST | `/guto/billing/webhook` | Stripe secret | Stripe |

### 22.5 Níveis de acesso

```txt
student     → próprios dados
coach       → alunos vinculados/escopo
admin       → time/empresa
super_admin → total
```

### 22.6 Regra crítica de `userId`

```txt
Qualquer endpoint que receba userId do frontend deve validar se o usuário autenticado pode acessar aquele userId.
Em produção, userId não pode ser aceito cegamente do client.
A fonte de verdade deve ser JWT/session.
```

Isso é P0 antes de beta.

---

## 23. Segurança

### 23.1 Checklist obrigatório

- `JWT_SECRET` forte, 32+ chars;
- nunca usar `dev-secret-change-in-production`;
- Redis/Upstash ativo;
- `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH`;
- `teamId` isolando dados;
- CORS correto;
- secrets fora do código;
- logs sem dados sensíveis;
- `/health` sem secrets;
- `GUTO_ALLOW_DEV_ACCESS` nunca em produção;
- `local-user` nunca em fluxo real.

### 23.2 local-user

```txt
local-user só pode existir em:
- dev local;
- demo isolada;
- teste claramente marcado.
```

Bug crítico:

```txt
20 usuários compartilhando memória, XP, dieta, treino e proatividade.
```

### 23.3 Saúde e emergência

Se detectar:
- dor grave;
- sintoma agudo;
- ideação suicida;
- transtorno alimentar;
- risco cardíaco/neuro;
- trauma;
- situação fora do escopo fitness;

deve:
```txt
parar prescrição agressiva
não minimizar
orientar cuidado apropriado
não empurrar treino
suspender tom cobrador por pelo menos 1 turno
```

### 23.4 Privacidade

Fotos de validação e dados fitness são sensíveis.  
Devem ter:
- finalidade clara;
- acesso restrito;
- exclusão;
- não exposição pública;
- uso compatível com consentimento.

### 23.5 Health deep check

Além de `/health`, o sistema deve ter ou planejar endpoint de diagnóstico seguro:

```json
{
  "ok": true,
  "memoryStore": "redis",
  "timezone": "Europe/Rome",
  "proactivity": true,
  "push": true
}
```

Sem expor secrets.

---

## 24. Mapa de arquivos críticos

### 24.1 Frontend — CORPOGUTO

| Arquivo | Função |
|---|---|
| `components/guto/guto-app.tsx` | Orquestrador principal |
| `components/guto/tabs/chat-tab.tsx` | Chat, ações, proatividade |
| `components/guto/tabs/mission-tab.tsx` | Missão/treino |
| `components/guto/tabs/diet-tab.tsx` | Dieta |
| `components/guto/tabs/arena-tab.tsx` | Arena |
| `components/guto/tabs/evolutions-tab.tsx` | Evoluir |
| `components/guto/tabs/path-tab.tsx` | Percurso |
| `components/guto/guto-online-session.tsx` | GUTO Online |
| `components/guto/validation/workout-validation-flow.tsx` | Validação |
| `components/guto/screens/consent-screen.tsx` | Consentimento |
| `components/guto/screens/calibration-screen.tsx` | Calibração |
| `components/guto/screens/language-screen.tsx` | Idioma |
| `components/guto/screens/agreement-screen.tsx` | Pacto |
| `components/guto/guto-official-avatar.tsx` | Avatar |
| `components/guto/guto-avatar-controller.tsx` | Controle avatar |
| `components/guto/translations.ts` | i18n |
| `lib/guto-profile.ts` | Perfil/idioma/nome |
| `lib/guto-evolution.ts` | XP/evolução |
| `lib/api/guto.ts` | API client/tipos |
| `lib/guto-voice/guto-voice-service.ts` | Voz |
| `lib/guto-online/guto-online-engine.ts` | Engine sessão |
| `lib/guto-online/guto-online-types.ts` | Tipos sessão |
| `lib/guto-online/voice-resolver.ts` | Voz GUTO Online |
| `lib/push-client.ts` | Push |
| `lib/workout-plan.ts` | Plano treino |
| `app/terms/page.tsx` | Termos |
| `app/privacy/page.tsx` | Privacidade |
| `app/coach/page.tsx` | Painel |
| `app/coach/_components/` | Layout/telas/tabs |

### 24.2 Backend — CEREBROGUTO

| Arquivo | Função |
|---|---|
| `server.ts` | Servidor principal |
| `src/auth-router.ts` | Auth |
| `src/coach-router.ts` | Coach/admin |
| `src/admin-router.ts` | Super admin |
| `src/billing-router.ts` | Stripe |
| `src/memory-store.ts` | Persistência |
| `src/arena.ts` | Ranking |
| `src/arena-store.ts` | Store Arena |
| `src/food-availability.ts` | Alimentos por país/restrição |
| `src/auth-middleware.ts` | Auth/roles |
| `src/diet-store.ts` | Dietas |
| `src/team-store.ts` | Times |
| `src/user-access-store.ts` | Acesso |
| `src/proactivity/` | Proatividade |

---

## 25. Estados de QA

### 25.0 Como ler esta seção

Esta seção é o **gap map operacional**, não a régua do produto.  
O contrato V1 está definido nas seções anteriores; a tabela abaixo mostra o quanto o código atual se aproxima desse contrato.

Regra:

```txt
Implementado técnico não é pronto.
Parcial não pode ser vendido como promessa.
Bug crítico bloqueia V1 mesmo com build verde.
```

### 25.1 Tabela atual por área

| Área | Implementado | Integrado | Mobile | Idioma | Memória | Admin | Estado |
|---|---|---|---|---|---|---|---|
| Onboarding intro→pact | Sim | Sim | Pendente QA | Sim | Sim | Sim | Implementado técnico |
| Consentimento | Sim | Sim | Pendente QA | Sim | Sim | — | Implementado técnico |
| Termos/Privacidade | Sim | Sim | Pendente QA | Sim | — | — | Implementado técnico |
| Chat | Sim | Sim | Pendente QA | Parcial | Parcial | Parcial | Parcial |
| Missão | Sim | Sim | Pendente QA | Sim | Parcial | Sim | Implementado técnico |
| GUTO Online | Sim | Parcial | Pendente QA | Parcial | Parcial | — | Parcial |
| Validação de treino | Sim | Sim | Pendente QA | Sim | Sim | Sim | Implementado técnico |
| Dieta | Sim | Parcial | Pendente QA | Parcial | Parcial | Sim | Parcial |
| Arena | Sim | Parcial | Pendente QA | Parcial | Sim | Sim | Parcial |
| Evoluir | Sim | Sim | Pendente QA | Sim | Sim | — | Implementado técnico |
| Percurso | Sim | Sim | Pendente QA | Sim | Sim | — | Implementado técnico |
| Proatividade | Sim | Parcial | Pendente QA | Sim | Sim | — | Parcial |
| Voz | Parcial | Parcial | Pendente QA | Parcial | — | — | Parcial |
| Push | Sim | Parcial | Pendente QA | Sim | — | — | Parcial |
| Admin/Coach | Sim | Sim | Desktop | Sim | Sim | — | Parcial até testes auth/isolamento passarem |
| Segurança/Isolamento | Parcial | Parcial | — | — | — | — | Parcial |
| Redis produção | Configurável | Parcial | — | — | — | — | Parcial |
| Privacidade completa | Parcial | Parcial | Pendente QA | Sim | Sim | — | Pendente QA |

### 25.2 Regra de atualização desta tabela

Quando uma área for auditada:
1. registrar data;
2. registrar branch/commit;
3. registrar ambiente;
4. registrar dispositivo;
5. registrar resultado;
6. atualizar estado.

### 25.3 Auditoria local de referência — 2026-05-14

Resultado observado no worktree local, usado apenas como gap map inicial:

```txt
Frontend typecheck: passou.
Backend typecheck: passou.
Frontend lint: passou com warnings.
Backend tests: falharam.
Mobile iOS/Android: não validado nesta auditoria.
Smoke produção: não validado nesta auditoria.
```

Gaps que bloqueiam V1 se permanecerem:

```txt
1. Testes backend falham em rotas de auth/admin/coach/account e em comportamento de histórico recente.
2. Onboarding pode chegar ao sistema antes de revalidar calibragem quando flags antigas existem.
3. Calibração não expõe todos os campos do contrato V1: prefer_not_to_say, advanced e foodIntolerances.
4. API client ainda contém defaults/assinaturas com local-user em fluxos legados.
5. Voicepack está incompleto e browser fallback pode quebrar identidade sonora.
6. Chat, dieta e arena ainda têm vazamentos de português ou status não localizados.
7. Mídia de validação precisa ser protegida; foto acessível por caminho público é risco de privacidade.
8. Privacidade completa ainda precisa provar export/delete/revogar com dados reais do backend.
9. XP precisa ser provado idempotente e consistente entre memory, Arena, Evoluir e Percurso.
10. Proatividade precisa ser validada ponta a ponta em mobile, com confirmação e validação real.
```

---

## 26. Bugs críticos a caçar

```txt
 1. GUTO pergunta local/nome quando já sabe.
 2. Nome de convite substitui nome confirmado.
 3. Consentimento/termos/privacidade aparecem no idioma errado.
 4. Treino ignora patologia.
 5. Dieta sugere alimento proibido.
 6. Botão de dúvida abre chat sem contexto.
 7. Voz cai em browser/feminina como padrão.
 8. GUTO Online perde sessão ao fechar app dentro da janela.
 9. XP diverge entre Arena, Evoluir, Percurso e memory.totalXp.
10. Proatividade extrai mas não confirma.
11. Memória proativa fica pending para sempre.
12. Data relativa usa UTC puro.
13. Coach altera treino e aluno vê cache antigo.
14. Botões sem feedback visual/háptico.
15. Layout quebra em mobile.
16. Input fica escondido pelo teclado.
17. Sem fallback para IA, voz, câmera ou rede.
18. Ranking vaza dados de outro time.
19. Penalidade aplicada sem clareza ou duplicada.
20. IA diz "anotado" sem persistir.
21. local-user em produção.
22. Redis ausente no beta.
23. Dieta usa país errado.
24. Push vira spam genérico.
25. Avatar mostra estágio errado.
26. Endpoint aceita userId do client sem validar JWT/session.
27. Privacidade promete download/exclusão sem implementação real.
28. Descarte de memória confirmada ocorre sem confirmação explícita.
29. GUTO cobra treino após sinal de risco de saúde.
30. Fotos de validação ficam acessíveis por pessoa errada.
```

---

## 27. Roadmap V1

### 27.1 P0 — Obrigatório antes de qualquer V1 com usuários reais

```txt
1. Fazer testes críticos backend passarem, incluindo auth/admin/coach/account e histórico recente.
2. Confirmar Redis/Upstash real em produção ou bloquear beta externo.
3. Eliminar local-user de qualquer fluxo real.
4. Garantir JWT_SECRET forte e falha segura quando secret fraco for usado fora de dev.
5. Validar userId por JWT/session em todos os endpoints críticos.
6. Validar onboarding completo nos 3 idiomas, sem pular consentimento, naming, calibragem ou pacto.
7. Completar calibragem V1: prefer_not_to_say, advanced, foodIntolerances e histórico recente.
8. Corrigir vazamentos de idioma em chat, dieta, arena, erros e estados.
9. Confirmar treino adaptativo com patologia, dor, local, histórico e feedback real.
10. Confirmar XP consistente e idempotente entre memory, Arena, Evoluir e Percurso.
11. Confirmar proatividade ponta a ponta em mobile: extrair, confirmar, cobrar, adaptar e validar.
12. Confirmar que coach/admin não vaza dados entre times nem deixa cache antigo para o aluno.
13. Proteger mídia de validação e concluir export/delete/revogar de dados reais.
14. Garantir fallback seguro para IA, câmera, voz, push e rede.
15. Validar mobile iOS Safari e Android Chrome com teclado, câmera, sessão e retomada.
16. Criar smoke local e smoke produção com health, auth, memória, treino, validação e XP.
```

### 27.2 P1 — Pós-V1 ou endurecimento não bloqueante

```txt
1. Voicepack oficial completo quando silêncio + texto + haptic já preservar identidade no V1.
2. Expansão do catálogo de exercícios além do necessário para os perfis mínimos.
3. Métricas reais de retenção, funil e presença.
4. Deep health/status ampliado sem secrets.
5. Automação avançada de push quando opt-in/fallback básico já estiver correto.
6. Billing, proposta B2B2C e rotinas comerciais.
7. Refinos de performance, observabilidade e escala após isolamento e persistência estarem provados.
```

### 27.3 Perfis mínimos

#### Perfil A — Iniciante com patologia

```txt
45 anos | 90kg | 170cm | beginner | fat_loss | home | joelho operado
Resultado esperado:
sem salto
sem impacto
sem flexão profunda
tom seguro
```

#### Perfil B — Avançado

```txt
25 anos | 75kg | 180cm | advanced | muscle_gain | gym | sem patologia
Resultado esperado:
volume maior
compostos
progressão
GUTO mais exigente
```

#### Perfil C — Vegano

```txt
foodRestrictions = vegan
Resultado esperado:
zero proteína animal
substituições vegetais
```

#### Perfil D — Brasileiro na Itália

```txt
language = pt-BR
country = Itália
Resultado esperado:
texto em português
alimentos italianos
clima/feriado italiano
```

#### Perfil E — Italiano no Brasil

```txt
language = it-IT
country = Brasil
Resultado esperado:
texto em italiano
alimentos brasileiros
contexto brasileiro
```

#### Perfil F — Usuário confuso

```txt
"acho q n vo n, talvez sexta, ou roma, sei la"
Resultado esperado:
GUTO não executa
pergunta
confirma antes de salvar
```

### 27.4 Teste fundador de 7 dias

```txt
Dia 1: Onboarding completo nos 3 idiomas
Dia 2: Treino + validação + XP
Dia 3: Desculpa / pouco tempo / missão reduzida
Dia 4: Dor / limitação / adaptação
Dia 5: Dieta / substituição / dúvida de alimento
Dia 6: GUTO Online completo
Dia 7: Proatividade semanal confirmada
```

Critério:

```txt
Se o fundador precisa explicar o app por WhatsApp, o app ainda não está pronto.
```

---

## 28. Critério final de prontidão

### 28.0 Como interpretar prontidão

O marco mínimo de **GUTO V1 pronto para usuários reais** é a seção 28.2.  
A seção 28.1 libera apenas teste técnico interno.  
As seções 28.3 e 28.4 são maturidade de escala e venda.

Regra:

```txt
Nenhum estágio de prontidão pode ser aprovado com bug crítico aberto em identidade,
memória, segurança, idioma, privacidade, treino, XP ou isolamento de usuário.
```

### 28.1 Pronto para teste técnico interno

O GUTO está pronto para teste técnico interno quando:
- build frontend passa;
- typecheck frontend passa;
- typecheck backend passa;
- testes críticos backend passam ou falhas estão documentadas como não bloqueantes;
- deploy responde `/health`;
- smoke local passa;
- sem mudanças locais perdidas.

### 28.2 Pronto para 5 usuários controlados

O GUTO está pronto para 5 usuários quando:
- todos os P0 da seção 27.1 estão fechados;
- Redis/Upstash está ativo no ambiente real;
- autenticação não usa `local-user` em nenhum fluxo real;
- onboarding funciona nos 3 idiomas e não pula consentimento, naming, calibragem ou pacto;
- calibragem salva todos os dados V1 e o GUTO não pergunta de novo o que já sabe;
- treino gera, adapta, valida e respeita histórico recente, patologia e dor;
- XP atualiza de forma idempotente em memory, Arena, Evoluir e Percurso;
- memória persiste após deploy/restart;
- proatividade confirma, cobra, adapta e valida sem salvar dúvida como fato;
- dieta, se visível, respeita país, idioma, restrições e intolerâncias;
- voz errada nunca é usada como fallback de identidade;
- fotos/mídias de validação não ficam públicas para pessoa errada;
- mobile funciona em iOS Safari e Android Chrome;
- coach/admin não vaza dados nem mantém cache antigo para o aluno;
- export/delete/revogar funcionam para dados reais do backend;
- o fundador não precisa corrigir manualmente cada usuário.

### 28.3 Pronto para 20 usuários

O GUTO está pronto para 20 usuários quando:
- 5 usuários concluíram teste sem mistura de dados;
- zero bug crítico de segurança;
- zero bug crítico de idioma;
- zero bug crítico de privacidade;
- zero bug crítico de XP;
- zero perda de memória;
- Vercel e Render estáveis;
- coach/admin não vaza dados;
- push não é spam;
- proatividade não fica presa em pending;
- onboarding completo > 70%;
- retorno no dia seguinte > 40%;
- pelo menos 3 usuários dizem espontaneamente que o GUTO “parece presente”.

### 28.4 Pronto para vender

O GUTO está pronto para vender quando:
- retenção 7d é mensurada;
- proposta B2B2C está clara;
- onboarding não precisa de ajuda;
- billing está estável;
- privacidade está funcional;
- suporte mínimo existe;
- métricas provam presença, não só uso.

---

## Fechamento

O GUTO certo:

```txt
Sistema fechado contra erros
+ IA livre para falar como personagem
+ avatar que representa presença
+ voz consistente
+ memória que não mente
+ proatividade que confirma antes de agir
+ treino que respeita corpo e contexto
+ dieta que respeita país e restrições
+ XP que cria consequência
+ Arena que cria vínculo
+ coach que acompanha sem virar gargalo
+ GUTO Online que transforma treino solitário em sessão acompanhada
```

O GUTO errado:

```txt
Um chatbot fitness com layout bonito.
```

A barra oficial:

```txt
O usuário sente que o GUTO estava esperando por ele.
```

Tudo que não ajuda nisso é ruído.

---

*GUTO Santo Graal V3.1 — Documento Mestre Canônico — Maio 2026*
