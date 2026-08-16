# Evolução do Avatar, Engenharia de XP e Morte do GUTO — Roteiro Detalhado de Engenharia

> **Documento canônico** da Progressão de Nível (Baby/Teen/Adult/Elite), Engenharia de XP, Penalidades por Ausência, Travamento Geral de Segurança e Protocolo de Morte Permanente do GUTO.
>
> **Natureza:** descreve o **GUTO atual + visão futura marcada**. XP é **mérito real** (lido, nunca editado à mão); a Validação alimenta XP/streak/avatar/Arena/Percurso da **mesma fonte**. O avatar, estágios e XP estão implementados. **Morte/lockdown por XP zerado é FUTURO**: permanece aqui como especificação de produto, mas ainda não é comportamento operacional do backend.
>
> **Documentos relacionados:** `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 12/14) · `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` (mesma fonte de XP) · `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` (validação) · `GUTO_PAINEL_ADMIN_CANONICO_V1.md` (acesso/morte é status comercial, não editável à mão).

---

## O Que É A Evolução Do GUTO

A evolução do GUTO representa a materialização visual do compromisso e da constância do aluno. O avatar do GUTO não funciona como um item cosmético ou decoração estática de plano de fundo do aplicativo.

Ele simboliza a **saúde ativa e o vínculo da relação de dupla**. 
- Quando o aluno comparece, executa as missões diárias e as valida no backend, o GUTO recebe energia e evolui visualmente.
- Quando o aluno some, negligencia as missões e ignora as cobranças, o GUTO enfraquece gradualmente.
- **FUTURO:** se o XP operacional da conta atingir o limite mínimo de **zero**, o GUTO deverá morrer.

No código atual, a morte do GUTO por XP zerado ainda **não** é um evento operacional. O backend já calcula XP com clamp, valida presença real e controla acesso comercial/assinatura, mas não possui `gutoLifeStatus:"dead"` nem lockdown geral por morte do avatar.

---

## O Significado do XP no Ecossistema

O XP (Experiência) é a **força de vida operacional do GUTO**.
- O sistema recompensa estritamente a **presença validada** e o ato de comparecer, ignorando contagens de intensidade de cargas ou metas puramente estéticas.
- O XP inicial concedido no Pacto (`+100 XP`) conta no XP total, na Arena Semanal/Mensal/Individual do período e no Percurso como evento de XP do dia. Ele **não** ativa dias seguidos de consistência (streak), não incrementa `validatedWorkouts` e não marca presença de treino real.
- O mesmo evento validado alimenta Arena Semanal da empresa, Arena Mensal da empresa, Arena Geral, Percurso, Avatar e Painel. Não pode existir cálculo paralelo por tela.

---

## FUTURO - A Regra do Limite de XP Zero (No Negative XP)

O backend calcula e gerencia o saldo total de XP. O valor de experiência **nunca** fica negativo.
- Se uma penalidade de ausência for aplicada sobre um saldo baixo e o resultado matemático for menor que zero (ex: saldo de 10 XP sofrendo penalidade de -20 XP), o sistema realiza um clamp automático do valor em exatamente **zero**.
- **FUTURO:** ao atingir o limite exato de `totalXp = 0`, a conta deverá transitar para o status de `dead` (GUTO morto) e disparar bloqueios de segurança nas APIs do servidor. Hoje o clamp de XP existe, mas essa transição de morte não existe.

---

## Eventos e Atribuições de XP e Penalidades

| Evento de Consistência | Valor de XP | Efeito Sistêmico |
| :--- | :---: | :--- |
| **Pacto de Integração** | `+100 XP` | Buffer emocional inicial de boas-vindas. |
| **Treino Validado (Provas)** | `+100 XP` | Incrementa o streak e o comparecimento. |
| **Missão Adaptada por Dor** | `+50 XP` | Recompensa pela flexibilidade e proteção articular. |
| **Penalidade por Ausência** | `-20 XP` | Aplicado em faltas injustificadas após expirado o dia de Missão. |

### Regras de Aplicação de Penalidades
A dedução de `-20 XP` por ausência é calculada pelo backend ao final do dia operacional (conforme fuso do usuário) e obedece a travas de segurança contra duplicidade:
- Não pode ser aplicada se o usuário declarou e confirmou previamente uma indisponibilidade na Proatividade (ex: dia de viagem aérea em trânsito).
- Não pode ocorrer dupla penalização para o mesmo dia de calendário.
- Não é aplicada caso o aluno tenha relatado lesões graves que forçaram a suspensão assistida de treinos.

---

## Os Estágios de Evolução do GUTO

No código atual, o XP acumulado determina o nível biológico e estético do GUTO. Os thresholds oficiais vêm de `guto-app-v0/lib/guto-evolution.ts`:

1. **Baby:** `0 XP`. O GUTO está no início da relação. Possui feições delicadas, olhos brilhantes e expressa vulnerabilidade.
2. **Teen:** `1500 XP`. A dupla consolidou a primeira barreira de consistência. O avatar ganha contornos mais firmes e expressa atitude.
3. **Adult:** `5000 XP`. O GUTO está forte, sustentando um histórico real de treinos validados e rotina de alta fidelidade.
4. **Elite:** `12000 XP`. O ápice estético. O avatar emite brilho e expressa orgulho, representando um estilo de vida de alta retenção esportiva.

*Regra futura:* qualquer estágio (mesmo que o usuário tenha atingido o nível Elite) deverá estar sujeito a **morte permanente** quando o módulo de morte por XP zerado for implementado.

---

## Estado Atual Implementado do Avatar

O avatar oficial atual é renderizado em código por `GutoVividAvatar`, usado via `GutoAvatarController` no Chat, Evoluir, Percurso e GUTO Online.

- Não depende mais de PNG/WebM para o avatar principal.
- É SVG vetorial com Framer Motion, olhos ciano fixos e estágios `baby`, `teen`, `adult`, `elite`.
- A aba **Evoluir** é a casa principal do avatar: avatar grande, estágio atual, XP, progresso para o próximo nível, transformação visual e vínculo emocional.
- O Chat usa avatar compacto/presença, porque a camada principal do Chat é conversa, histórico, contexto e input.

---

## Estados Visuais do Avatar

O componente atual (`GutoVividAvatar`) aceita emoções `default`, `alert`, `critical`, `reward` e `super`. O estado morto/apagado ainda pertence ao módulo futuro de morte.

- `default/vivo:` Expressão focada, olhos azuis nítidos e postura ativa.
- `alerta:` Exibido quando o usuário falha no primeiro dia da Missão. O avatar perde vivacidade.
- `critico:` Exibido quando o saldo de XP está perigosamente baixo (abaixo de 40 XP). O avatar expressa fadiga e enfraquecimento físico, alertando o usuário no chat:
  > *"Will, eu estou quase apagando por completo. Se você faltar ou sumir de novo hoje, o nosso acesso morre definitivamente."*
- `reward:` Animação curta e vibrante exibida no momento em que o treino é validado com fotos.
- `super:` Camada especial do avatar interativo, acionada por toque no controller.
- **FUTURO - `morto/apagado`:** olhos completamente pretos, sem brilho, sem movimentos e cores acinzentadas frias. Representação visual definitiva da morte.

---

## FUTURO - O Protocolo de Travamento por GUTO Morto

Quando o módulo de morte for implementado e o saldo de XP atingir o zero absoluto no backend, as variáveis de controle da conta deverão ser atualizadas:

```json
{
  "totalXp": 0,
  "gutoLifeStatus": "dead",
  "accessLocked": true,
  "deadAt": "2026-05-21T18:00:00Z",
  "deathReason": "xp_depletion"
}
```

### Comportamento das Abas com o GUTO Morto (Lockdown Geral)
O sistema aplica uma tela de blackout total em toda a interface do aplicativo móvel, bloqueando os recursos principais:

- **Chat do GUTO:** Bloqueado contra novas mensagens. Qualquer entrada de texto do usuário é desabilitada. O chat exibe apenas a copy final em destaque:
  > *"O GUTO apagou. Este acesso terminou. Para continuar, entre em contato com o administrador do GUTO."* (No idioma escolhido pelo aluno).
- **Aba Missão:** O card do treino do dia some, exibindo o status de treino bloqueado pela morte do companheiro.
- **Aba Dieta:** O plano de refeições é ocultado, impossibilitando novas consultas.
- **Aba Arena:** O usuário é marcado com a sinalização `[DEAD]` no ranking do seu grupo e fica tecnicamente impedido de pontuar na semana ou no mês.
- **GUTO Online e Validação:** Desabilitados. Não é permitido treinar ou validar presença na conta.
- **Aba Evoluir:** Exibe a imagem do avatar morto em destaque com o botão direto de contato e suporte ao administrador.
- **Aba Percurso:** Travada em modo de *somente leitura*, permitindo apenas a visualização nostálgica do diário de consistência construído antes da morte.

---

## FUTURO - Dupla Proteção de Segurança (Guards de Rede)

A trava de segurança contra o uso do GUTO morto não ocorre apenas de forma estética na interface do celular. O backend atua como a autoridade suprema de negação:

```txt
               [ Guard de Segurança do Backend ]

  Requisição do Usuário (ex: POST /guto)
  ├── 1. Backend lê o token JWT e localiza o perfil
  ├── 2. Avalia: se gutoLifeStatus === "dead" ou accessLocked === true
  ├── 3. Rejeita o processamento imediatamente (HTTP 403 Forbidden)
  └── 4. Retorna o contrato estruturado de negação:
         {
           "action": "lock_screen",
           "speech": "O GUTO apagou. Este acesso terminou. Fale com o admin.",
           "status": "dead"
         }
```

Isso impede que modificações locais de código no frontend ou tentativas de bypass de rotas no navegador forcem o uso indevido de contas expiradas.

---

## FUTURO - Novo Acesso Após a Morte

Quando o módulo de morte existir, o GUTO **não deverá reviver dentro do app automaticamente**. Quando o XP chegar a zero, aquele acesso deverá entrar em estado terminal e o celular deverá ficar bloqueado.
- O aluno está impedido de reviver o GUTO realizando treinos "por fora" ou enviando fotos de validação, pois os botões estão fisicamente travados e as rotas de API bloqueadas no backend.
- **Caminho Comercial:** O usuário precisa entrar em contato com o Admin/Coach do GUTO para comprar um novo acesso.
- **Ação no Painel Admin/Coach:** qualquer liberação futura é uma decisão administrativa e comercial fora do app do aluno. O app não deve mostrar botão de reviver, compra automática ou promessa de restauração imediata.
- **Regra futura:** enquanto não houver novo acesso liberado pelo Admin, o backend deverá negar chat, treinos, dieta, GUTO Online e rotas protegidas. O avatar deverá permanecer apagado e as páginas do app deverão continuar bloqueadas.

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **XP Negativo:** O sistema permitir saldos de XP menores que zero (ex: `-20 XP`), estragando a lógica de travas do banco de dados.
- **Morte Incompleta:** O app exibir o GUTO morto no Chat, mas permitir que o usuário continue gerando treinos na aba Missão ou acessando as orientações da Dieta.
- **Bypass de Rotas:** Permitir que o aluno pule a tela de blackout alterando estados locais de cache do frontend. O backend **deve** negar todas as chamadas de API feitas por contas inativas.
- **Exclusão de Conquistas:** Apagar o histórico de treinos antigos do Percurso do usuário caso a conta morra. O Percurso do GUTO morto deve permanecer em modo de *somente leitura* como prova do legado.
- **Cobrança Humilhante:** A IA usar cópias que ataquem ou ridicularizem o esforço de disciplina do usuário após a morte da conta. O tom deve ser direto, leal e centrado no restabelecimento do vínculo.
- **Reviver Automático:** o sistema reativar contas mortas de forma invisível, conceder novo XP automaticamente ou permitir que o aluno drible a trava comercial sem novo acesso comprado e liberado pelo Admin/Coach.

---

## Pontos de Atenção (doc × código atual)

> Sinalização doc × `guto-app-v0`/`guto-backend`. XP/streak/avatar estão sólidos. **A Morte do GUTO por XP zerado é FUTURO**: descrita aqui em detalhe, mas ainda não implementada no backend.

| # | Tema | Doc (alvo / GUTO finalizado) | Código atual | Tipo |
|---|---|---|---|---|
| X-1 | XP total/semanal/mensal | `totalXp` + `weeklyXp`/`monthlyXp` com reset | Implementado + `clampXp` | ✅ alinhado |
| X-2 | XP por validação (+100 treino, +50 missão adaptada) | Só presença validada gera XP | Implementado | ✅ alinhado |
| X-3 | XP nunca negativo; penalidade −20 com clamp | Clamp a 0 | `clampXp` + `applyDailyMissPenalty` | ✅ alinhado |
| X-4 | XP inicial do Pacto conta como XP, mas não como treino/streak | Buffer de boas-vindas no XP total e período | `grantInitialXp` cria `xpEvent` e `awardArenaXp(type:"bonus")`; não toca `validatedWorkouts`/streak | ✅ alinhado |
| X-5 | Estágios Baby/Teen/Adult/Elite | Progressão por XP | `guto-evolution.ts` (thresholds baby 0 / teen 1500 / adult 5000 / elite 12000) | ✅ alinhado |
| X-6 | XP/streak/avatar não editáveis à mão pelo painel | Mérito real | Painel não expõe edição de XP | ✅ alinhado |
| X-7 | **Validação exige selfie** p/ creditar XP/streak | Sem prova, sem mérito (decisão do fundador) | Backend retorna `SELFIE_REQUIRED` sem `imageBase64`; só credita XP/Arena com evidência | ✅ alinhado |
| X-8 | **FUTURO - Morte: `gutoLifeStatus:"dead"`, `accessLocked`, `deadAt`, `deathReason`** | Estado terminal real no backend | Campos **não existem** | **FUTURO** |
| X-9 | **FUTURO - Guard de API quando morto (403 `GUTO_DECEASED`)** | Backend nega chat/treino/dieta/online/validação | **Nenhum guard** de morte nas rotas | **FUTURO** |
| X-10 | **FUTURO - Blackout/lockdown no app quando morto** | Telas travadas; Percurso read-only | Não há morte operacional por XP zerado | **FUTURO** |
| X-11 | Sem reviver automático; volta só por liberação comercial | Reativação é decisão admin/comercial | Não há auto-revive (nem morte ainda) | ✅ alinhado (depende de X-8) |

> **Decisões do fundador aplicadas:** selfie **obrigatória** (X-7). A Morte é **FUTURO/parte 2 do produto**; o alvo permanece documentado aqui para quando entrar.
