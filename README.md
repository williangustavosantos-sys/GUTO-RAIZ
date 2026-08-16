# GUTO — Companheiro Ativo Digital

> Documento canônico do projeto. Leia este arquivo primeiro — para humanos e IAs.

## Índice

- [O Que É O GUTO](#o-que-é-o-guto)
- [Por Que O GUTO É Diferente](#por-que-o-guto-é-diferente)
- [Objetivo Do Produto](#objetivo-do-produto)
- [Como Agentes Devem Trabalhar Neste Projeto](#como-agentes-devem-trabalhar-neste-projeto)
- [Sistema Interno Necessário](#sistema-interno-necessário)
- [Calibragem E Memória](#calibragem-e-memória)
- [Chat Do GUTO](#chat-do-guto)
- [Treino E Missão](#treino-e-missão)
- [GUTO Online](#guto-online)
- [Validação, XP, Arena E Percurso](#validação-xp-arena-e-percurso)
- [Dieta](#dieta)
- [Proatividade](#proatividade)
- [Painel Admin E Coach](#painel-admin-e-coach)
- [Idioma](#idioma)
- [O Que Faz O GUTO Parecer Vivo](#o-que-faz-o-guto-parecer-vivo)
- [Documentos Detalhados Por Área](#documentos-detalhados-por-área)
- [Frase Final](#frase-final)

---

## O Que É O GUTO

O GUTO é um companheiro ativo digital criado para transformar intenção em ação. Ele não é um app fitness comum, não é um chatbot motivacional, não é uma planilha de treino e não é um personal digital genérico. O GUTO é uma presença operacional dentro do celular do usuário: ele entende quem a pessoa é, lembra do que foi combinado, monta o plano do dia, adapta quando existe limitação, cobra presença e acompanha a evolução da dupla.

A ideia central do GUTO nasce de uma verdade simples: o problema da maioria das pessoas não é falta de treino, dieta ou informação. Isso já existe em excesso. O problema real é falta de continuidade, cobrança, vínculo e presença no momento em que o usuário está cansado, sozinho ou tentando negociar com a própria preguiça.

Um app comum entrega conteúdo. O GUTO entrega presença. Um app comum mostra "treino de hoje". O GUTO diz: "Hoje é treino. Eu já considerei teu joelho, teu nível e teu objetivo. Sem ego. Vamos fazer limpo."

O GUTO foi criado para ser uma dupla com o usuário. Por isso a identidade correta é sempre "GUTO & nome do usuário". O nome digitado e confirmado pelo usuário é soberano. Não pode ser substituído por convite, e-mail, nome do coach ou fallback automático.

## Por Que O GUTO É Diferente

A maioria dos apps fitness funciona como biblioteca, calendário ou formulário. O usuário abre, escolhe, lê e tenta executar sozinho. O GUTO funciona de outro jeito: ele conduz.

A diferença principal é que o GUTO não espera apenas comandos. Ele usa memória, calibragem, histórico, idioma, rotina, feedback e contexto semanal para decidir o próximo passo. Ele não pergunta "como posso ajudar?" como uma IA genérica. Ele puxa o usuário para clareza, ação ou continuidade.

O GUTO também não pode ser construído como uma árvore burra de palavras-chave. O usuário pode escrever errado, misturar idiomas, falar com gíria ou mandar uma frase confusa. O sistema precisa interpretar intenção, contexto, fase do fluxo, memória e grau de certeza. Se houver dúvida, o GUTO pergunta. Ele não chuta.

A personalidade também é parte do produto. O GUTO fala como melhor amigo ou irmão mais velho: direto, leal, curto e com postura. Ele cobra sem humilhar. Ele adapta sem virar frouxo. Ele não motiva de forma genérica. Ele lembra o usuário de aparecer.

## Objetivo Do Produto

O objetivo do GUTO é manter duplas ativas ao longo do tempo. A métrica verdadeira não é só treino concluído hoje, mas quantas pessoas continuam voltando depois de 7, 14 e 30 dias porque sentem que o GUTO estava esperando por elas.

O produto está pronto quando um usuário novo consegue entrar, escolher idioma, aceitar consentimento, definir o nome da dupla, fazer calibragem, assinar o pacto, receber a missão, executar ou ser conduzido pelo GUTO Online, validar o treino, ganhar XP e voltar no dia seguinte sem precisar que o fundador explique nada por fora.

A sensação final desejada é: "o GUTO sabe quem eu sou, sabe o que eu preciso fazer hoje e percebe quando eu sumo."

## Como Agentes Devem Trabalhar Neste Projeto

Todo agente, humano ou IA, deve começar pelo `README.md` da raiz antes de tocar qualquer código. Depois disso, deve abrir o documento detalhado da área que será auditada ou alterada. O GUTO não deve ser modificado por palpite geral: cada mudança precisa respeitar a fase, o fluxo e o contrato já documentados.

Regras operacionais:

- Antes de implementar, comparar o pedido com os documentos da raiz e com o código atual.
- Se o pedido for auditoria, entregar primeiro relatório de divergências, riscos e correções mínimas.
- Não misturar áreas: uma tarefa de calibragem não deve virar alteração de painel, XP, arena, treino, dieta ou prompt do cérebro sem autorização explícita.
- Não criar dado falso parecendo real. Mocks só podem existir quando estiverem marcados como fase visual/demo.
- Não dizer que algo está pronto sem rodar validação compatível com o escopo.
- Não ler, copiar ou expor segredos de `.env`.

## Sistema Interno Necessário

Para o GUTO funcionar, tudo precisa estar integrado. Um campo preenchido na calibragem não pode morrer naquela tela. Ele precisa virar memória operacional e chegar no chat, treino, dieta, GUTO Online, validação, proatividade, arena e painel coach.

### Estado atual confirmado no código (2026-06-17)

- **Chat:** a aba GUTO é conversa real. A UI prioriza histórico, contexto, input e banners/cartões de decisão; o avatar ali é compacto, não a vitrine principal.
- **GUTO Online:** é sessão assistida por máquina de estados, focada no treino em execução; assunto fora do treino é redirecionado para o chat normal.
- **Evoluir:** é a casa visual do GUTO. O avatar grande oficial é renderizado por código (`GutoVividAvatar`/`GutoAvatarController`), com estágios Baby, Teen, Adult e Elite por XP.
- **Percurso:** é calendário mensal/memória visual. Treino validado, treino adaptado, dia protegido, viagem, dor, compromisso, pendência e XP aparecem como eventos.
- **Validação:** selfie é obrigatória no backend atual. Sem `imageBase64`, a rota retorna `SELFIE_REQUIRED`; sem prova, não há XP/Arena.
- **Arena/XP:** todo XP ganho conta nos rankings semanal, mensal e individual, inclusive o XP do pacto. O pacto não conta como treino validado e não ativa streak.
- **Painel:** `/coach` é o painel operacional único para super admin, admin e coach. Detalhe do aluno já tem abas de Resumo, Calibragem, Treino, Dieta, Validações, Histórico e Acesso. i18n do cockpit está parcial.
- **FUTURO:** Morte/lockdown do GUTO ainda não existe no backend. App nativo/mobile segue como spike, não como app completo de produção.

O fluxo base é:

```txt
Usuário
→ Frontend
→ Backend
→ Memória
→ IA + regras fechadas
→ ação estruturada
→ persistência
→ UI atualizada
```

O frontend é o corpo do GUTO: cápsula, avatar, onboarding, abas, chat, missão, dieta, arena, percurso, evolução, GUTO Online e validação.

O backend é o cérebro: interpreta mensagens, consulta memória, chama IA, aplica gates de segurança, gera treino, gera dieta, salva memória, controla XP, aplica proatividade e protege o usuário.

A resposta do GUTO não pode ser só texto. Ela precisa ser um contrato estruturado com fala, ação, memória, plano de treino, resposta esperada e emoção do avatar. Isso impede que o app vire um chat bonito que não salva nada.

## Calibragem E Memória

A calibragem inicial é uma das partes mais importantes do sistema. Ela coleta idade, sexo biológico, nível de treino, objetivo, local preferido, altura, peso, país, cidade, patologia ou limitação e o campo único `NÃO COMO`, onde entram restrições alimentares, intolerâncias, alergias e escolhas alimentares relevantes.

O idioma é definido antes da calibragem e acompanha todo o app. Histórico recente não é perguntado como campo inicial: ele nasce do uso real do GUTO, por meio de treinos concluídos, feedbacks, adaptações, faltas, dieta e eventos registrados no backend.

Telefone não faz parte da calibragem do aluno, não entra em `GutoMemory`, não é editado pelo chat e não deve aparecer nas configurações do aluno. Telefone pode existir apenas em cadastro comercial/administrativo, como empresa, responsável, billing ou contato operacional do painel.

Esses dados precisam ser salvos no backend como memória real. O GUTO não deve perguntar de novo algo que já sabe. Se sabe que o usuário tem joelho sensível, o treino precisa respeitar isso. Se sabe que o usuário mora na Itália mas fala português, o texto continua em português, mas a dieta e contexto local devem considerar Itália.

Memória no GUTO é confiança. Se ele diz "salvei", algo precisa ter sido salvo de verdade. Se não salvou, ele não pode fingir.

## Chat Do GUTO

A aba GUTO é o centro operacional da relação. O chat serve para conversar, ajustar memória, adaptar treino, tirar dúvidas, lidar com desculpas, registrar contexto e conduzir o usuário.

Mas o chat não é livre no sentido perigoso. Ele passa pelo backend, usa memória, chama IA dentro de um contrato e só executa se houver certeza. Se falta dado, ele pergunta. Se existe dor, ele protege. Se o usuário tenta mudar algo sensível, ele confirma. Se a IA falha, o fallback precisa ser honesto e seguro.

## Treino E Missão

A aba Missão mostra o treino do dia. Esse treino precisa nascer do backend ou do plano bloqueado pelo coach. Não deve ser uma lista qualquer criada pelo frontend.

O treino deve respeitar calibragem, objetivo, local, nível, histórico recente, dor, limitação e feedback. Também precisa usar catálogo oficial de exercícios com vídeo local validado. Se o exercício não tem vídeo correto, não deveria entrar no treino.

Depois que o GUTO monta um treino, ele vira `lastWorkoutPlan`, ou seja, plano oficial atual. A validação de treino depende desse plano.

## GUTO Online

O GUTO Online é a sessão em que o GUTO treina junto com o usuário em tempo real. Ele não é cronômetro bonito, nem videoaula, nem chatbot aberto. Ele é uma sessão guiada por estado.

Ele precisa controlar briefing, aquecimento, exercício atual, série atual, descanso, pausa, dor, cansaço, troca de exercício, finalização e retomada. Se o usuário fecha o app e volta rápido, a sessão deve continuar. Se passa muito tempo, o sistema precisa decidir se retoma, pergunta ou descarta.

Ações sensíveis no GUTO Online não podem depender só de frase de voz. Voz pode falhar, captar ruído ou entender errado. Para finalizar treino, pular etapa ou trocar exercício, o sistema precisa de estado visual, confirmação ou regra segura.

## Validação, XP, Arena E Percurso

O GUTO não mede só intenção. Ele mede presença validada.

Após o treino, o usuário valida com câmera, contagem, frase e envio para o backend. Se a validação é aceita, o sistema registra o treino, atualiza histórico, dá XP, alimenta Arena, Percurso e evolução do avatar.

XP é consistência, não ego. O usuário não ganha mais porque treinou pesado. Ele ganha porque apareceu. O XP inicial do pacto é um buffer psicológico que conta como XP nas superfícies de período e no total, mas não conta como treino executado nem ativa streak.

Arena, Evoluir, Percurso e memória precisam mostrar o mesmo estado. Se o XP aparece diferente em cada lugar, é bug crítico.

## Dieta

A dieta não deve ser um formulário separado que pergunta tudo de novo. Ela deve usar a memória já salva: idade, sexo biológico, peso, altura, objetivo, país, cidade e o campo único `NÃO COMO`. O idioma define texto e voz; país/cidade definem disponibilidade alimentar.

A dieta precisa respeitar restrições alimentares de verdade. Se o usuário é intolerante a lactose, alimento com lactose não pode aparecer. Se o usuário escreveu "nessun dolore", isso significa ausência de dor física em italiano, não restrição alimentar. Esse tipo de diferença é exatamente por que o GUTO precisa de interpretação semântica, não palavra-chave.

## Proatividade

Proatividade é o que faz o GUTO parecer vivo antes do usuário pedir. Não é notificação genérica.

O ciclo correto é:

```txt
coletar
→ entender
→ validar com o usuário
→ salvar
→ mostrar
→ usar depois
→ validar o que aconteceu
→ atualizar ou descartar
```

Exemplo: o usuário comenta que vai viajar para Roma. O GUTO não deve salvar automaticamente sem confirmar. Ele pergunta se entendeu certo. Se o usuário confirma, a memória fica ativa. Durante a semana, o GUTO pode usar esse contexto para adaptar treino, tom, clima ou agenda. Depois que a data passa, ele não descarta sozinho; pergunta se aconteceu.

Isso cria presença real. O usuário sente que o GUTO estava prestando atenção.

## Painel Admin E Coach

O painel admin transforma o GUTO em plataforma B2B2C.

Existem papéis como super admin, admin, coach e aluno. O aluno vive o GUTO no celular. O coach opera por trás: acompanha progresso, vê calibragem, edita treino, monta dieta, gera convite, vê histórico, identifica risco de abandono e acompanha ranking.

Empresa/time é a unidade comercial principal. Toda empresa possui coaches, todo coach pertence a uma empresa e todo aluno pertence a uma empresa e a um coach. Mesmo alunos vendidos direto pela internet entram em uma Team interna do GUTO, com nome a definir. Não existe aluno operacional sem `teamId` e sem `coachId`.

O coach não substitui o GUTO. Ele melhora a operação por trás. Para o aluno, a presença continua sendo o GUTO.

O painel precisa ter isolamento forte por time e coach. Um coach não pode ver aluno de outro time. Admin vê seu escopo. Super admin vê tudo. XP e streak não devem ser editados livremente pelo coach, porque são parte da confiança do sistema.

## Idioma

Idioma é lei. O app suporta português, inglês e italiano. Quando o usuário escolhe um idioma, todo o app precisa falar esse idioma: onboarding, botões, chat, GUTO Online, validação, dieta, arena, configurações, erros, push e voz quando disponível.

País não é idioma. Um brasileiro morando na Itália pode usar português com contexto alimentar italiano. Isso é essencial para o GUTO parecer inteligente e não um tradutor simples.

## O Que Faz O GUTO Parecer Vivo

O GUTO parece vivo quando o sistema inteiro trabalha junto:

A calibragem vira memória.
A memória guia o chat.
O chat gera ação estruturada.
A ação gera treino.
O treino vira missão.
A missão pode virar GUTO Online.
A validação vira XP.
O XP atualiza Arena, Percurso e avatar.
A proatividade usa contexto semanal.
O coach pode ajustar por trás.
O usuário sente continuidade.

Se qualquer parte decide sozinha, o produto quebra. Se onboarding salva joelho operado mas treino ignora, o GUTO perde confiança. Se o chat diz "anotei" mas não salvou, o GUTO mente. Se o idioma muda mas a UI continua em português, quebra a promessa. Se o coach altera treino e o aluno não vê, quebra operação.

## Documentos Detalhados Por Área

> **Arquitetura dos documentos (2026-06-17):** a fonte de verdade de cada área é a série **`*_DETALHADA`** (uma por área), agora separando **estado atual confirmado no código**, **parcial** e **FUTURO** quando houver visão ainda não implementada. A série **`PARTE_1..5` é só leitura narrativa** e virou **ponteiro** para as DETALHADA. O **painel** tem um único canônico: **`GUTO_PAINEL_ADMIN_CANONICO_V1.md`** (os demais docs de painel são apoio/histórico).

Depois deste README, use o documento canônico da área antes de alterar código:

| Área | Documento canônico (fonte da verdade) | Ponteiro narrativo |
|---|---|---|
| Fluxo geral (espinha, página por página) | `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` | — |
| Abertura, idioma, login e convite | `GUTO_PAGINA_DE_LOGIN_DETALHADA.md` | `PARTE_1_…` |
| Consentimento, nome, calibragem e pacto | `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` | `PARTE_2_…` |
| Chat e cérebro do GUTO | `GUTO_CHAT_E_CEREBRO_DETALHADA.md` | `PARTE_3_…` |
| Treino e missão (treino do dia) | `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` | `PARTE_3_…` |
| Dieta integrada | `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` | `PARTE_3_…` |
| GUTO Online (sessão assistida) | `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` | `PARTE_4_…` |
| Validação, XP, evolução e morte | `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` | `PARTE_4_…` |
| Arena e gamificação | `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` | `PARTE_4_…` |
| Proatividade e ciclo semanal | `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` | `PARTE_4_…` |
| Painel Admin / Empresa / Coach | `GUTO_PAINEL_ADMIN_CANONICO_V1.md` | `PARTE_5_…` |
| Plano de execução para testes | `docs/GUTO_PLANO_EXECUCAO_PARA_TESTES.md` | — |

> **Decisões de produto fechadas (aplicadas nas DETALHADA):** selfie **obrigatória** na validação · risco **Atenção 3–5d / Crítico ≥6d** · vídeo de exercício **catálogo ≤15s / custom ≤30s** · telefone **opcional/comercial** (nunca na `GutoMemory`). A **Morte do GUTO** está especificada mas ainda não implementada no backend (maior divergência doc×código).

## Frase Final

O GUTO não foi criado para ser mais um app fitness com IA. Ele foi criado para ser uma presença diária que conduz o usuário quando ele não quer decidir sozinho.

A maioria dos apps entrega conteúdo. O GUTO entrega presença, memória, cobrança, adaptação e ação real.
