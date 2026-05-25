# GUTO — Plano De Execução Para Chegar Em Testes

Status: plano operacional canônico para retomada.
Data de atualização: 2026-05-25.

Este documento organiza a execução do projeto para sair do estado de construção guiada por agentes e chegar em testes reais com segurança.

A regra principal é simples: **não mexer no GUTO inteiro de uma vez**. Cada fase deve ler o `README.md` da raiz, abrir o documento específico da área, corrigir o menor bloco possível, validar e só então avançar.

---

## Estado Atual

O `README.md` da raiz é o documento principal do projeto. Os documentos `GUTO_*` e `PARTE_*` são a fonte de verdade de cada área.

O painel admin está pausado temporariamente. A prioridade atual é alinhar o app do aluno e o backend operacional: calibragem, memória, chat, treino, dieta, XP, arena, GUTO Online e proatividade.

### Última Execução Validada

Fase 1.10 da calibragem/memória: propagação correta de alterações feitas por Admin/Coach no caminho técnico atual do painel.

Branch/PR:

- Repositório: `CEREBROGUTO`
- Branch: `codex/admin-calibration-propagation`
- PR: `#14` — mergeado em `main`.

Validações executadas:

- `CEREBROGUTO`: `npx tsx --test tests/guto-team-isolation.test.ts`
- `CEREBROGUTO`: `npx tsx --test tests/guto-diet-invalidation.test.ts`
- `CEREBROGUTO`: `npm run typecheck`
- `CEREBROGUTO`: `npm run test:guto`
- `git diff --check`

Comportamento validado:

- O patch administrativo atual de aluno (`/admin/students/:userId`) agora rastreia campos reais de calibragem alterados por Admin/Coach.
- Se Admin/Coach altera campo nutricional, a dieta do aluno vai para `needs_clarification`, salvo quando estiver protegida por `lockedByCoach`.
- Se Admin/Coach muda `country` sem enviar novo `countryCode`, o backend limpa o código técnico antigo para evitar país obsoleto na dieta/proatividade.
- Quando Admin/Coach altera `trainingLevel`, o backend também sincroniza `trainingStatus` para manter treino e painel no mesmo estado operacional.
- Isso prepara o caminho do painel Admin/Coach sem criar endpoint novo e sem editar calibragem como JSON cru.
- App do aluno, XP, arena, criação de empresa e UI do painel não foram alterados nesta etapa.

### Histórico Validado Recente

1. `CEREBROGUTO` PR #8 — dieta vai para `needs_clarification` quando campos nutricionais da calibragem mudam, preservando `lockedByCoach`.
2. `CEREBROGUTO` PR #9 — `phone` removido da `GutoMemory` do aluno e suprimido em leitura de memória legada.
3. `CEREBROGUTO` PR #10 — `biologicalSex` restrito a `male | female`, sem `prefer_not_to_say`.
4. `CEREBROGUTO` PR #11 — ranges oficiais de idade, altura e peso aplicados na memória pública, chat e painel.
5. `CORPOGUTO` PR #11 — contrato do app remove `phone` da memória do aluno e bloqueia atualização de telefone pelo chat.
6. `CORPOGUTO` PR #12 — ajustes/calibragem do app aguardam persistência antes de mostrar salvo ou avançar tela.
7. Validação local `CEREBROGUTO` — chat/backend gravam `memoryPatch` antes de devolver resposta ao app.
8. Validação local `CORPOGUTO` — idioma e nome ficam fora da calibragem e antes dela no fluxo do app.
9. `CEREBROGUTO` PR #12 — dieta bloqueia alimentos brasileiros difíceis de achar quando o aluno mora fora do Brasil, mesmo se o app estiver em português.
10. `CORPOGUTO` PR #13 — ajustes do app enviam `countryCode` junto com país/cidade e bloqueiam falso “salvo” quando o país é inválido.
11. `CEREBROGUTO` PR #13 — backend limpa `countryCode` antigo quando país muda sem novo código válido, inclusive via chat/memory patch.
12. `CEREBROGUTO` PR #14 — rota administrativa de aluno propaga calibragem para dieta, `countryCode` e `trainingStatus`.

---

## Ordem De Execução

## Fase 0 — Base Limpa E Sincronizada

Objetivo: garantir que qualquer agente comece de um estado rastreável.

Executar:

1. Conferir `git status` na raiz, frontend e backend.
2. Garantir que qualquer trabalho local esteja em branch própria.
3. Validar backend:
   - `npm run typecheck`
   - `npm run test:guto`
4. Validar frontend quando houver mudança nele:
   - `npx tsc --noEmit`
   - teste manual das rotas críticas.
5. Não começar fase nova se existir diff local não explicado.

Critério de saída:

- Branch/PR criado para mudanças já feitas.
- Estado local entendido e documentado.

---

## Fase 1 — Calibragem E Memória

Documentos obrigatórios:

- `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`
- `PARTE_2_CONSENTIMENTO_NOME_CALIBRAGEM_PACTO.md`
- `README.md`

Objetivo: tornar `GutoMemory` a fonte única de verdade.

Status atual:

- Feito: `phone` não existe mais como campo de `GutoMemory`.
- Feito: app do aluno não tipa nem envia `phone` em `saveGutoMemory`.
- Feito: `biologicalSex` só aceita `male | female`.
- Feito: idade, altura e peso respeitam os ranges oficiais.
- Feito: mudanças nutricionais da calibragem invalidam a dieta quando ela não está travada pelo coach.
- Feito: app do aluno só fecha ajustes/calibragem e mostra “salvo” depois de persistência confirmada.
- Feito: chat/backend aplicam e gravam `memoryPatch` antes de devolver resposta ao app.
- Feito: idioma e nome ficam antes da calibragem, não dentro dela.
- Feito: settings alteram residência com `country`, `countryCode` e `city` juntos, usando os mesmos campos de memória usados por treino, dieta e painel futuro.
- Feito: chat/backend não mantêm `countryCode` antigo quando o país muda sem código novo válido.
- Feito: caminho atual Admin/Coach (`/admin/students/:userId`) invalida dieta quando calibragem nutricional muda, limpa `countryCode` obsoleto e mantém `trainingStatus` alinhado ao nível.
- Próximo bloco antes de sair da calibragem: auditar campo por campo se cada dado da calibragem alimenta corretamente treino, dieta, proatividade e painel futuro.
- Falta fase futura do painel: endpoint dedicado de calibragem validada, sem JSON cru.

Corrigir/verificar:

- `phone` não pode existir em `GutoMemory`, endpoint `/guto/memory`, settings do aluno ou chat.
- Telefone só pode existir em contexto comercial/administrativo: empresa, responsável, billing ou contato operacional.
- `biologicalSex` só aceita `male | female`.
- `userAge` só aceita 14-99.
- `heightCm` só aceita 100-250 cm.
- `weightKg` só aceita 30-300 kg.
- Idioma é definido antes da calibragem e não é campo da tela de calibragem.
- Nome da dupla é definido antes da calibragem e não pode ser sobrescrito por e-mail, convite, coach ou fallback.
- Settings do app, chat e painel futuro precisam alterar os mesmos campos da memória.
- Se uma alteração não persistir, o GUTO não pode responder como se tivesse salvo.
- Alterações em calibragem precisam refletir em treino, dieta, painel e app.
- País/cidade precisam refletir em alimentos e contexto local; idioma só controla texto.

Testes mínimos:

- Alterar peso nas configurações reflete no backend.
- Alterar `NÃO COMO` pelo app reflete na dieta.
- Alterar calibragem via chat persiste antes do GUTO dizer que salvou.
- Campo `phone` não aparece em retorno de memória do aluno.
- Campo de idioma não aparece como campo da calibragem.

Critério de saída:

- Calibragem consistente em app, chat e backend.
- Testes específicos adicionados.

---

## Fase 2 — Dieta Integrada

Documentos obrigatórios:

- `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md`
- `PARTE_3_SISTEMA_PRINCIPAL_CHAT_TREINO_DIETA.md`
- `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`

Objetivo: dieta segura, coerente e localizada.

Status atual:

- Feito: mudanças nutricionais da calibragem colocam a dieta em `needs_clarification` quando ela não está travada pelo coach.
- Feito: dieta travada por `lockedByCoach` é preservada quando a calibragem muda, com auditoria da divergência.
- Feito: país/cidade já entram no prompt de geração.
- Feito: `countryCode` não fica obsoleto quando o aluno troca país nas configurações ou pelo chat.
- Feito: backend valida pós-geração que alimentos brasileiros difíceis de achar não sejam usados fora do Brasil sem o país permitir.
- Feito: caso coberto por teste: app em português + aluno na Itália + modelo devolvendo `Tapioca` => geração recusada.
- Falta: validação semântica mais ampla das restrições alimentares complexas, sem depender só de palavras fixas.
- Falta: mensagem de erro mais orientada ao aluno quando a dieta falha por alimento incompatível com o país.
- Falta: checagem semântica/final de coerência alimentar para alergias genéricas e disponibilidade local.

Corrigir/verificar:

- Dieta usa idade, sexo biológico, altura, peso, objetivo, nível, país, cidade e `NÃO COMO`.
- Idioma controla texto. País/cidade controlam alimentos.
- Brasileiro morando na Itália e usando app em português não deve receber alimento brasileiro difícil de encontrar, como tapioca/açaí, sem confirmação explícita.
- Restrições alimentares devem ser interpretadas semanticamente, não só por palavra-chave.
- Se `NÃO COMO`, país ou objetivo estiverem ambíguos, o GUTO pergunta antes de gerar.
- Calorias dos alimentos precisam bater com `targetKcal` e macros dentro da margem definida pelo backend.
- Dieta só vira `generated` depois de persistida.
- `lockedByCoach` nunca é sobrescrito pela IA.

Testes mínimos:

- PT-BR + Itália gera texto em português e alimentos compatíveis com Itália.
- Lactose/glúten/carne/frutos do mar ou alergia declarada não vazam na dieta.
- Informação ambígua bloqueia geração.
- Macros e calorias batem.
- Dieta travada pelo coach permanece travada.

Critério de saída:

- Dieta pronta para teste interno sem risco sanitário óbvio.

---

## Fase 3 — Treino E Missão

Documentos obrigatórios:

- `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md`
- `PARTE_3_SISTEMA_PRINCIPAL_CHAT_TREINO_DIETA.md`
- `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`

Objetivo: treino do dia nascer do backend e respeitar a memória real.

Corrigir/verificar:

- Treino considera objetivo, nível, local, dor, limitação e histórico.
- Histórico recente impede repetição burra de grupo muscular.
- "Ontem" e "anteontem" funcionam em PT/EN/IT.
- Exercício só entra se existir no catálogo oficial com vídeo local validado.
- Dor ou patologia ativa bloqueia/adapta antes de executar.
- Botão de dúvida do exercício manda contexto suficiente para o chat.
- O frontend não inventa treino.

Testes mínimos:

- Usuário com joelho sensível não recebe exercício proibido.
- Usuário em casa não recebe máquina de academia.
- Histórico recente troca foco corretamente.
- Exercício sem vídeo é recusado.

Critério de saída:

- Missão confiável para teste interno.

---

## Fase 4 — Onboarding, Login E Fluxo Inicial

Documentos obrigatórios:

- `PARTE_1_ABERTURA_IDIOMA_LOGIN.md`
- `PARTE_2_CONSENTIMENTO_NOME_CALIBRAGEM_PACTO.md`
- `GUTO_PAGINA_DE_LOGIN_DETALHADA.md`
- `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md`

Objetivo: usuário novo entrar sem orientação externa.

Corrigir/verificar:

- Vídeo/intro abre bem no celular.
- Idioma vem antes do nome e da calibragem.
- Login e convite funcionam em celular real.
- Usuário novo não pula consentimento, nome, calibragem ou pacto.
- `onboardingComplete` antigo não pode burlar calibragem incompleta.
- Nome da dupla é soberano.
- Aluno nunca entra no painel admin.

Testes mínimos:

- Novo usuário por convite.
- Usuário retornando.
- Convite expirado.
- Sem localStorage disponível.
- PT/EN/IT do começo ao sistema principal.

Critério de saída:

- Fluxo inicial pronto para 3 usuários reais.

---

## Fase 5 — Validação, XP, Evolução E Morte Do GUTO

Documentos obrigatórios:

- `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md`
- `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md`
- `PARTE_4_GUTO_ONLINE_VALIDACAO_E_PROATIVIDADE.md`

Objetivo: presença validada alimentar XP, avatar, percurso e arena.

Corrigir/verificar:

- XP nunca fica negativo.
- XP vem de presença validada, não de intensidade.
- Skip camera não pode gerar XP falso.
- Validação com câmera precisa ser segura.
- Avatar, percurso e arena mostram o mesmo XP.
- Estado `GUTO morto` trava corretamente.
- Reativação/recomeço após morte segue regra documentada.

Testes mínimos:

- Validação aceita.
- Validação repetida não duplica XP.
- Skip camera não dá XP indevido.
- Penalidade não passa abaixo de zero.
- Estado morto bloqueia abas certas.

Critério de saída:

- Sistema de confiança de XP pronto para beta interno.

---

## Fase 6 — Arena

Documentos obrigatórios:

- `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md`
- `GUTO_PAINEL_ADMIN_E_COACH_DETALHADA.md`

Objetivo: rankings respeitarem escopo e não vazarem dados sensíveis.

Corrigir/verificar:

- Arena semanal = `teamId`.
- Arena mensal = `teamId`.
- Arena geral = global.
- Coach vê arena da empresa, não só alunos próprios.
- Arena geral mostra `GUTO & Nome — Empresa`.
- Arena nunca mostra peso, altura, patologia, restrição alimentar, telefone, e-mail ou dado clínico.

Testes mínimos:

- Aluno vê semanal/mensal da própria empresa.
- Coach vê semanal/mensal da empresa.
- Super admin vê tudo.
- Geral mistura empresas e mostra nome do time.
- Dados sensíveis não aparecem.

Critério de saída:

- Arena pronta para teste público controlado.

---

## Fase 7 — GUTO Online E Proatividade

Documentos obrigatórios:

- `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md`
- `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md`
- `PARTE_4_GUTO_ONLINE_VALIDACAO_E_PROATIVIDADE.md`

Objetivo: presença ativa funcionar sem parecer cronômetro bonito.

Corrigir/verificar:

- GUTO Online tem máquina de estados real.
- Dor, fadiga, troca e pausa não dependem de chute.
- Sessão retoma após crash quando fizer sentido.
- Proatividade confirma antes de salvar.
- Proatividade valida depois se aconteceu.
- Push/notificação só depois de memória segura.

Testes mínimos:

- Começar sessão.
- Pausar/retomar.
- Reportar dor.
- Trocar exercício.
- Fechar e reabrir app.
- Confirmar/corrigir memória proativa.

Critério de saída:

- Presença ativa pronta para teste interno guiado.

---

## Fase 8 — Painel Admin, Empresa E Coach

Documentos obrigatórios:

- `GUTO_PAINEL_ADMIN_E_COACH_DETALHADA.md`
- `PARTE_5_PAINEL_COACH_E_ADMIN.md`
- `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md`

Objetivo: retomar painel somente depois do app estar confiável.

Retomar nesta ordem:

1. Revalidar `/admin/login`, `/admin`, `/admin/teams/:teamId`, `/empresa`, `/coach` e `/login`.
2. Criar Detalhe do Coach read-only.
3. Criar Detalhe do Aluno read-only.
4. Implementar criação real de empresa.
5. Implementar endpoints agregados `/admin/panel/*`.
6. Trocar mocks por dados reais.
7. Completar Empresa Portal e Coach Portal.

Regras duras:

- Todo coach pertence a uma empresa.
- Todo aluno pertence a um coach e uma empresa.
- Aluno avulso entra em Team interna do GUTO.
- Plano define limite de coaches e alunos.
- Backend aplica escopo por `teamId` e `coachId`.
- Painel nunca calcula KPI carregando todos os alunos no frontend.

Critério de saída:

- B2B pronto para piloto com academia/coach real.

---

## Fase 9 — QA De Teste Real

Documentos obrigatórios:

- `docs/GUTO_QA_MASTER_MATRIX.md`
- `docs/GUTO_AUDITORIA_COMPLETA_ESTADO_ATUAL.md`

Objetivo: liberar teste com pessoas reais sem depender de explicação manual.

Executar:

- Teste página por página.
- Teste iPhone Safari.
- Teste Android Chrome.
- Teste desktop.
- PT/EN/IT.
- Playwright sem mocks contra backend local.
- Verificação de console/network.
- Vercel preview.
- Backend real.
- Checklist de PII/LGPD.

Critério de saída:

- 3 usuários reais podem testar sem o fundador ficar corrigindo por fora.

---

## Como Trabalhar Com Agentes

Para qualquer agente:

1. Ler `README.md`.
2. Ler este plano.
3. Ler apenas o documento da fase atual.
4. Auditar código antes de mexer.
5. Propor correção pequena.
6. Implementar só o autorizado.
7. Rodar validação.
8. Entregar relatório com:
   - arquivos alterados;
   - o que mudou;
   - o que foi afetado;
   - testes rodados;
   - riscos restantes;
   - próxima fase recomendada.

Frase de controle:

```txt
Uma fase só termina quando o comportamento está validado, documentado e subido em branch/PR rastreável.
```
