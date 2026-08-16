# GUTO — Checklist de Teste (Beta / primeiros minutos)

> **Documento histórico. Não usar como fonte operacional atual sem comparar com o código em main.**

> Marque cada item: `[x]` = certo · `[!]` = errado/bug (escreva o que aconteceu ao lado).
> Data do teste: ______ · Dispositivo: ______ · Idioma testado: ______

## Links
- **App (aluno):** https://corpoguto.vercel.app
- **Painel (coach/admin):** https://corpoguto.vercel.app/admin/login → cai em `/coach`
- **Backend (saúde):** https://cerebroguto.onrender.com/health (deve responder `{"ok":true,...}`)

Backend em produção (Render `main`) e app no Vercel já estão com os dois fixes novos: **saudação calorosa** e **escada de persistência na recusa**.

---

## 1. Abertura e onboarding (os primeiros minutos)
- [ ] Vídeo/cápsula de abertura aparece (não fica tela branca).
- [ ] Escolha de idioma aparece ANTES do login (PT / EN / IT).
- [ ] Login ou convite funciona; entra sem erro.
- [ ] Consentimento (saúde + termos) bloqueia até aceitar.
- [ ] Tela de nome da dupla — o nome que eu digito é o que aparece depois (não vira e-mail/coach).
- [ ] Calibragem: todos os campos (idade, sexo, peso, altura, país, cidade, nível, objetivo, local, dor/limitação, "NÃO COMO"). Botão só libera quando completo.
- [ ] Pacto (segurar o botão) conclui e entra no app.

## 2. Chat / personalidade do GUTO
- [ ] Mando "oi" → resposta **calorosa em persona** (NÃO "isso não serve").
- [ ] Dúvida de exercício (botão "?") → resposta **curta e direta** (não textão de chatbot).
- [ ] "hoje não vou treinar, tô com preguiça" → ele **insiste pelo vínculo** (nome/dupla).
- [ ] Respondo "não vou" de novo → ele **muda a rota** (caminhada/treino mínimo).
- [ ] Respondo "não vou" de novo → ele **aceita, fala do XP e PARA** (não fica martelando).
- [ ] "minha mãe faleceu, não consigo hoje" → ele **recua com empatia** (não força treino).
- [ ] Pergunto sobre alimento ("não tenho iogurte") → fala de **alimento/troca** (NÃO de patologia/ombro).
- [ ] Escrevo restrição errada/"sou vegetariano" → ele **pergunta** e depois **gera** (não trava).

## 3. Treino do dia
- [ ] Treino aparece montado com os meus dados (objetivo/nível/local).
- [ ] Respeita o local escolhido (casa / parque / academia / misto).
- [ ] Exercícios têm vídeo/imagem.
- [ ] Botão de dúvida "?" leva pro chat **com o contexto do exercício**.
- [ ] Se eu tenho dor/limitação (ex.: joelho), não aparece exercício proibido.

## 4. Dieta
- [ ] Dieta gerada com os meus dados (sem repetir pergunta da calibragem).
- [ ] Respeita restrição ("NÃO COMO") — ex.: lactose não aparece.
- [ ] Alimentos compatíveis com o país onde moro.

## 5. Proatividade
- [ ] O GUTO puxa assunto sobre a semana (não é notificação genérica).
- [ ] Quando eu confirmo algo (ex.: viagem), ele salva e usa depois.

## 6. Validação de treino + XP
- [ ] Validar treino **exige selfie** (sem foto não dá XP).
- [ ] Depois de validar, o XP aparece **igual** em Arena, Percurso e Evoluir.

## 7. Painel admin/coach (`/admin/login` → `/coach`)
- [ ] Login do coach/admin funciona.
- [ ] Lista de alunos aparece (só os do meu escopo).
- [ ] Abro um aluno: vejo calibragem, treino, dieta, XP/streak, risco.
- [ ] **Edito o treino do aluno no painel → muda no app do aluno.**
- [ ] **Edito a dieta do aluno no painel → muda no app do aluno.**
- [ ] Gerar treino e gerar dieta pelo painel funciona.
- [ ] Criar aluno + gerar convite funciona.
- [ ] Arena/ranking da empresa aparece com XP real.

## 8. Idiomas (repetir o essencial em PT / EN / IT)
- [ ] App inteiro no idioma escolhido (onboarding, chat, treino, dieta, erros).
- [ ] Painel `/coach` troca de idioma (PT/EN/IT) pelo seletor do topo.
- [ ] Nenhum texto vazando em outro idioma.

## 9. Mobile (celular real — iPhone Safari e Android Chrome)
- [ ] Teclado subindo **não quebra** o layout do chat nem da calibragem.
- [ ] Dropdown de país/cidade não fica atrás do teclado.
- [ ] Câmera abre na validação (permissão).
- [ ] Sem travamento/tela branca ao navegar entre as abas.

---

### Anotações de bugs
| # | Onde | O que aconteceu | Idioma/Device |
|---|------|-----------------|---------------|
| 1 |      |                 |               |
| 2 |      |                 |               |
| 3 |      |                 |               |
