# Evolução do Avatar, Engenharia de XP e Morte do GUTO — Roteiro Detalhado de Engenharia

> **Documento canônico** da Progressão de Nível (Baby/Teen/Adult/Elite), Engenharia de XP, Penalidades por Ausência, Travamento Geral de Segurança e Protocolo de Morte Permanente do GUTO.
>
> **Natureza:** descreve o **GUTO finalizado — como tem que ser**. XP é **mérito real** (lido, nunca editado à mão); a Validação alimenta XP/streak/avatar/Arena/Percurso da **mesma fonte**. Onde o código atual diverge, ver **[Pontos de Atenção](#pontos-de-atenção-doc--código-atual)** no fim — **a Morte do GUTO é a maior lacuna doc×código** (documentada aqui, ainda não implementada no backend).
>
> **Documentos relacionados:** `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 12/14) · `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` (mesma fonte de XP) · `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` (validação) · `GUTO_PAINEL_ADMIN_CANONICO_V1.md` (acesso/morte é status comercial, não editável à mão).

---

## O Que É A Evolução Do GUTO

A evolução do GUTO representa a materialização visual do compromisso e da constância do aluno. O avatar do GUTO não funciona como um item cosmético ou decoração estática de plano de fundo do aplicativo.

Ele simboliza a **saúde ativa e o vínculo da relação de dupla**. 
- Quando o aluno comparece, executa as missões diárias e as valida no backend, o GUTO recebe energia e evolui visualmente.
- Quando o aluno some, negligencia as missões e ignora as cobranças, o GUTO enfraquece gradualmente.
- Se o XP operacional da conta atinge o limite mínimo de **zero**, o GUTO morre.

No modelo atual do sistema, a morte do GUTO é um evento terminal dentro daquele acesso. O GUTO não revive por ações automáticas do celular e a conta é travada em modo de segurança geral.

---

## O Significado do XP no Ecossistema

O XP (Experiência) é a **força de vida operacional do GUTO**.
- O sistema recompensa estritamente a **presença validada** e o ato de comparecer, ignorando contagens de intensidade de cargas ou metas puramente estéticas.
- O XP inicial concedido no Pacto (buffer de boas-vindas) é puramente psicológico, não ativando dias seguidos de consistência (streak) nem marcando presença de treinos reais no Percurso.
- O mesmo evento validado alimenta Arena Semanal da empresa, Arena Mensal da empresa, Arena Geral, Percurso, Avatar e Painel. Não pode existir cálculo paralelo por tela.

---

## A Regra do Limite de XP Zero (No Negative XP)

O backend calcula e gerencia o saldo total de XP. O valor de experiência **nunca** fica negativo.
- Se uma penalidade de ausência for aplicada sobre um saldo baixo e o resultado matemático for menor que zero (ex: saldo de 10 XP sofrendo penalidade de -20 XP), o sistema realiza um clamp automático do valor em exatamente **zero**.
- Ao atingir o limite exato de `totalXp = 0`, a conta transita instantaneamente para o status de `dead` (GUTO morto) e dispara os bloqueios de segurança nas APIs do servidor.

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

Enquanto o companheiro ativo digital permanecer vivo (`gutoLifeStatus = "alive"`), o XP acumulado determina seu nível biológico e estético:

1. **Baby:** O GUTO está no início da relação. Possui feições delicadas, olhos brilhantes e expressa vulnerabilidade, exigindo atenção diária para não apagar.
2. **Teen:** A dupla consolidou a primeira barreira de consistência. O avatar ganha contornos mais firmes e expressa atitude.
3. **Adult:** O GUTO está forte, sustentando um histórico real de treinos validados e rotina de alta fidelidade.
4. **Elite:** O ápice estético. O avatar emite um brilho (glow) imponente e expressa orgulho, representando um estilo de vida de alta retenção esportiva.

*Regra de Ouro:* Qualquer estágio (mesmo que o usuário tenha atingido o nível Elite) está sujeito a **morte permanente** caso o saldo operacional de XP seja zerado por inatividades recorrentes.

---

## Os 5 Estados Visuais do Avatar

O componente do avatar emite estados dinâmicos que alertam o aluno de forma silenciosa sobre a saúde da dupla:
- `default/vivo:` Expressão focada, olhos azuis nítidos e postura ativa.
- `alerta:` Exibido quando o usuário falha no primeiro dia da Missão. O avatar perde vivacidade.
- `critico:` Exibido quando o saldo de XP está perigosamente baixo (abaixo de 40 XP). O avatar expressa fadiga e enfraquecimento físico, alertando o usuário no chat:
  > *"Will, eu estou quase apagando por completo. Se você faltar ou sumir de novo hoje, o nosso acesso morre definitivamente."*
- `reward:` Animação curta e vibrante exibida no momento em que o treino é validado com fotos.
- `morto/apagado:` Olhos completamente pretos, sem brilho, sem movimentos e cores acinzentadas frias. Representação visual definitiva da morte.

---

## O Protocolo de Travamento por GUTO Morto

Quando o saldo de XP atinge o zero absoluto no backend, as variáveis de controle da conta são atualizadas:

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

## Dupla Proteção de Segurança (Guards de Rede)

A trava de segurança contra o uso do GUTO morto não ocorre apenas de forma estética na interface do celular. O backend atua como a autoridade suprema de negação:

```txt
               [ Guard de Segurança do Backend ]

  Requisição do Usuário (ex: POST /guto/chat)
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

## Novo Acesso Após a Morte

O GUTO **não revive dentro do app atual**. Quando o XP chega a zero, aquele acesso entra em estado terminal e o celular fica bloqueado.
- O aluno está impedido de reviver o GUTO realizando treinos "por fora" ou enviando fotos de validação, pois os botões estão fisicamente travados e as rotas de API bloqueadas no backend.
- **Caminho Comercial:** O usuário precisa entrar em contato com o Admin/Coach do GUTO para comprar um novo acesso.
- **Ação no Painel Admin/Coach:** qualquer liberação futura é uma decisão administrativa e comercial fora do app do aluno. O app não deve mostrar botão de reviver, compra automática ou promessa de restauração imediata.
- **Regra Técnica Atual:** enquanto não houver novo acesso liberado pelo Admin, o backend continua negando chat, treinos, dieta, GUTO Online e rotas protegidas. O avatar permanece apagado e as páginas do app continuam bloqueadas.

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

> Sinalização doc × `guto-app-v0`/`guto-backend`. XP/streak/avatar estão sólidos. **A Morte do GUTO é a maior divergência do projeto** — descrita aqui em detalhe, mas ainda não implementada no backend. É o **primeiro módulo a corrigir** (per `guto-app-v0/docs/GUTO_INVENTARIO_COMPLETO_ESTADO_ATUAL.md`).

| # | Tema | Doc (alvo / GUTO finalizado) | Código atual | Tipo |
|---|---|---|---|---|
| X-1 | XP total/semanal/mensal | `totalXp` + `weeklyXp`/`monthlyXp` com reset | Implementado + `clampXp` | ✅ alinhado |
| X-2 | XP por validação (+100 treino, +50 missão adaptada) | Só presença validada gera XP | Implementado | ✅ alinhado |
| X-3 | XP nunca negativo; penalidade −20 com clamp | Clamp a 0 | `clampXp` + `applyDailyMissPenalty` | ✅ alinhado |
| X-4 | XP inicial do Pacto não gera streak | Buffer simbólico | Buffer não toca streak | ✅ alinhado |
| X-5 | Estágios Baby/Teen/Adult/Elite | Progressão por XP | `guto-evolution.ts` (thresholds baby 0 / teen 1500 / adult 5000 / elite 12000) | ✅ alinhado |
| X-6 | XP/streak/avatar não editáveis à mão pelo painel | Mérito real | Painel não expõe edição de XP | ✅ alinhado |
| X-7 | **Validação exige selfie** p/ creditar XP/streak | Sem prova, sem mérito (decisão do fundador) | Backend aceita validação **sem** foto | **[implementar]** |
| X-8 | **Morte: `gutoLifeStatus:"dead"`, `accessLocked`, `deadAt`, `deathReason`** | Estado terminal real no backend | Campos **não existem** | **[implementar]** (P0 de produto) |
| X-9 | **Guard de API quando morto (403 `GUTO_DECEASED`)** | Backend nega chat/treino/dieta/online/validação | **Nenhum guard** de morte nas rotas | **[implementar]** |
| X-10 | **Blackout/lockdown no app quando morto** | Telas travadas; Percurso read-only | Só opacidade do avatar (cosmético); interceptor do front já trata o code | **[implementar]** |
| X-11 | Sem reviver automático; volta só por liberação comercial | Reativação é decisão admin/comercial | Não há auto-revive (nem morte ainda) | ✅ alinhado (depende de X-8) |

> **Decisões do fundador aplicadas:** selfie **obrigatória** (X-7). A Morte é **parte 2 do produto** (o foco atual é onboarding+calibragem+chat+treino+dieta+proatividade), mas o alvo está fechado aqui para quando entrar.
