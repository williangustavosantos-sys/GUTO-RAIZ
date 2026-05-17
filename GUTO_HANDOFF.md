# GUTO — HANDOFF PARA PRÓXIMO ASSISTENTE
**Data:** 15 de maio de 2026 (atualizado ao longo do dia)
**Projeto:** GUTO — Companheiro Ativo Digital
**Repositórios:**
- CEREBROGUTO (backend): `/Users/williandossantos/GUTOO/guto-backend`
- CORPOGUTO (frontend): `/Users/williandossantos/GUTOO/guto-app-v0`
- RAIZ (monorepo): `/Users/williandossantos/GUTOO`

---

## 🟡 BUG PARCIALMENTE CORRIGIDO (PR #8 mergeado)

**Sintoma original:** App falando em inglês + travando após PR #7 mergear.

**Corrigidos (PR #8 — mergeado):**
- ✅ TTS freeze no iOS/Android: `speakWithBrowser` agora tem timeout de 8s, `playBlob` timeout de 15s
- ✅ `copy` adicionado ao dep array de `sendTextToGuto` — erros de conexão agora no idioma certo

**Ainda pode causar resposta em inglês (investigar se persistir):**
- ❓ Idioma salvo na memória do usuário pode estar como `en-US`
  Verificar: `GutoMemory.language` no Redis/banco para o usuário afetado
  Se estiver errado, corrigir via painel admin ou endpoint de memória

---

## REGRA DESTE HANDOFF

Trabalhar **sempre em branch**, nunca direto em `main`.
Cada fix tem seu próprio commit descritivo.
Após cada grupo de fixes: push para o GitHub.
**Pode mergear diretamente** — fundador autorizou merge sem revisão prévia.

---

## ESTADO ATUAL — TUDO MERGEADO EM MAIN

### CEREBROGUTO (guto-backend) — main está com:
- ✅ JWT_SECRET guard + CORS deny-by-default em produção
- ✅ render.yaml com todos os env vars
- ✅ gemini.log vazamento removido
- ✅ billing webhook async
- ✅ `foodIntolerances` passado para NutritionProfile e prompt de dieta
- ✅ Arena auth — arenaGroupId derivado do usuário autenticado
- ✅ Voz italiana: `Neural2-F` (fem) → `Neural2-C` (masc)

### CORPOGUTO (guto-app-v0) — main está com:
- ✅ Removido `local-user` defaults de `getGutoMemory`, `getGutoProactive`, `getDietPlan`
- ✅ `chat-tab.tsx`: audioFailure, emptyResponseFallback, connectionError em 3 idiomas
- ✅ `diet-tab.tsx`: erros timeout/conexão traduzidos em 3 idiomas
- ✅ `lib/api/client.ts`: ApiError com campo `code` (TIMEOUT / CONNECTION_ERROR)
- ✅ `login/page.tsx`: erros timeout/conexão traduzidos em 3 idiomas
- ✅ Avatar canvas: pixel ratio cap 1.5x → 3x (nítido em iPhone moderno)
- ✅ Voice default: `isMuted=false` (voz ativa por padrão para novos usuários)
- ✅ `speakWithBrowser`: guard `spoken` previne dupla invocação
- ✅ `visibilitychange`: rAF só reinicia quando tab fica visível
- ✅ `view-models.ts`: caminhos de vídeo `triceps/` → `bracos/` (3 vídeos 404 corrigidos)
- ✅ `xpRewardLabel` adicionado ao chatCopy nos 3 idiomas

---

## 🔴 BUG ATIVO — PRÓXIMO FIX OBRIGATÓRIO

Ver seção "BUG ATIVO" no topo deste arquivo.

---

## PRÓXIMOS FIXES A FAZER (EM ORDEM)

### ── BLOCO URGENTE ── (bug introduzido — corrigir antes de tudo)

---

#### BUG-1: `guto-voice-service.ts` — TTS sem timeout máximo (causa freeze)

**Arquivo:** `guto-app-v0/lib/guto-voice/guto-voice-service.ts`
**Branch:** `fix/bug-voice-timeout`

Com `isMuted=false` como padrão (mudança do PR #7), o TTS agora é chamado em toda
mensagem proativa. Se `utterance.onend` ou `audio.onended` nunca disparar (bug
conhecido no iOS Safari e alguns Androids), a Promise nunca resolve e o app trava.

**Fix em `speakWithBrowser`** (função ~linha 192):
```typescript
function speakWithBrowser(text: string, language: string) {
  return new Promise<void>((resolve) => {
    if (!isBrowser() || !window.speechSynthesis || !text.trim()) {
      resolve(); return
    }
    // Timeout de segurança: máximo 8 segundos
    const MAX_MS = 8000
    let resolved = false
    const safeResolve = () => { if (!resolved) { resolved = true; resolve() } }
    const safeTimeout = setTimeout(safeResolve, MAX_MS)
    // ... resto do código atual ...
    utterance.onend = () => { clearTimeout(safeTimeout); safeResolve() }
    utterance.onerror = () => { clearTimeout(safeTimeout); safeResolve() }
  })
}
```

**Fix em `playBlob`** (função ~linha 429):
```typescript
const MAX_MS = 15000
let resolved = false
const safeResolve = () => { if (!resolved) { resolved = true; URL.revokeObjectURL(url); resolve() } }
const safeTimeout = setTimeout(safeResolve, MAX_MS)
audio.onended = () => { clearTimeout(safeTimeout); safeResolve() }
audio.onerror = () => { clearTimeout(safeTimeout); safeResolve() }
```

---

#### BUG-2: `chat-tab.tsx` — `copy` ausente do dep array de `sendTextToGuto`

**Arquivo:** `guto-app-v0/components/guto/tabs/chat-tab.tsx` ~linha 937
**Branch:** mesma `fix/bug-voice-timeout`

`copy.emptyResponseFallback` e `copy.connectionError` usam closure velha após troca de idioma.

**Fix:** adicionar `copy` ao array de dependências:
```typescript
}, [
  copy,  // ← ADICIONAR AQUI
  handleProactiveMemoryAction,
  isMuted,
  language,
  ...
])
```

---

### ── BLOCO P0 ── (críticos, fazer em sequência)

---

#### P0-4: `proactive-store.ts` — TTL em `pending_confirmation`

**Arquivo:** `guto-backend/src/proactivity/proactive-store.ts`
**Branch a criar:** `fix/p0-proactive-ttl` (a partir de `main` do CEREBROGUTO)

**Problema:** Memórias proativas com status `pending_confirmation` nunca expiram. O GUTO fica perguntando sobre eventos de meses atrás para sempre.

**O que fazer:**
1. Ler o arquivo completo para entender a estrutura do tipo de item proativo
2. Adicionar campo `expiresAt?: number` ao tipo (timestamp em ms)
3. Ao salvar item com `status: "pending_confirmation"`, definir `expiresAt = Date.now() + 7 * 86400_000` (7 dias)
4. Na função que retorna itens ativos, filtrar os expirados e auto-descartar:

```typescript
const now = Date.now();
return items.filter(item => {
  if (
    item.status === "pending_confirmation" &&
    item.expiresAt &&
    item.expiresAt < now
  ) {
    // marcar como descartado assincronamente, não bloquear retorno
    void markProactiveItem(item.id, "discarded").catch(() => {});
    return false;
  }
  return true;
});
```

**Validar:** Nenhum tipo quebrado, nenhum import novo necessário.

---

#### P0-5: `server.ts` — `validated_postponed` nunca reagenda

**Arquivo:** `guto-backend/server.ts`
**Branch:** mesma `fix/p0-proactive-ttl` (mesmo sistema)

**Problema:** Quando usuário diz "aquela viagem foi adiada", o sistema marca como `validated_postponed` mas nunca cria nova memória futura. O evento some para sempre.

**O que fazer:**
1. Grep: `grep -n "validated_postponed" /Users/williandossantos/GUTOO/guto-backend/server.ts`
2. Localizar o bloco case/handler de `validated_postponed` (~linha 4820)
3. Após marcar o item original como `discarded`, criar novo item proativo com:
   - `status: "pending_confirmation"`
   - `scheduledFor`: tentar extrair data da mensagem do usuário; se não conseguir, usar `new Date(Date.now() + 7 * 86400_000).toISOString()`
   - `expiresAt`: 3 dias após `scheduledFor`
   - `origin: "rescheduled_from_postponed"`
   - Novo `id` (UUID ou similar)
4. O item original deve ser marcado como `discarded` (não deletado)

**Exemplo do código correto:**
```typescript
case "validated_postponed": {
  // Descartar item original
  await markProactiveItem(originalItem.id, "discarded");
  // Reagendar para +7 dias (ou data extraída do contexto)
  const rescheduleDate = new Date(Date.now() + 7 * 86400_000);
  await saveProactiveItem({
    ...originalItem,
    id: crypto.randomUUID(),
    status: "pending_confirmation",
    scheduledFor: rescheduleDate.toISOString(),
    expiresAt: rescheduleDate.getTime() + 3 * 86400_000,
    origin: "rescheduled_from_postponed",
  });
  break;
}
```

**Após P0-4 e P0-5:** Commitar ambos juntos, push `fix/p0-proactive-ttl`.

---

#### P0-6: `workout-validation-flow.tsx` — câmera trava sem timeout

**Arquivo:** `guto-app-v0/components/guto/validation/workout-validation-flow.tsx`
**Branch a criar:** `fix/p0-camera-validation-timeout` (a partir de `main` do CORPOGUTO)

**Problema:** Se a detecção facial falha (pouca luz, câmera ruim, iOS), a tela trava para sempre. Usuário não consegue validar treino.

**O que fazer:**
1. Ler o arquivo completo
2. Identificar onde o step de câmera é renderizado
3. Adicionar estado: `const [cameraTimedOut, setCameraTimedOut] = useState(false)`
4. Adicionar useEffect que dispara quando entra no step de câmera:

```typescript
const CAMERA_TIMEOUT_MS = 15_000;

useEffect(() => {
  if (step !== "camera") return; // ajustar para o nome real do step de câmera
  setCameraTimedOut(false);
  const timer = setTimeout(() => setCameraTimedOut(true), CAMERA_TIMEOUT_MS);
  return () => clearTimeout(timer);
}, [step]);
```

5. No JSX, quando `cameraTimedOut`, mostrar botão de override:

```tsx
{cameraTimedOut && (
  <button
    onClick={() => submitManualOverride()} // usar a função correta do componente
    className="..." // mesma classe dos outros botões do componente
  >
    {/* Texto i18n — verificar se há cópia de i18n no componente */}
    Validar manualmente
  </button>
)}
```

6. Garantir que `submitManualOverride` (ou função equivalente) inclui um campo `manualOverride: true` no payload enviado ao backend

**Validar:** TypeScript sem erros, componente renderiza normalmente.

---

#### P0-7: Arena — backend não valida se `arenaGroupId` pertence ao time do usuário

**Arquivo:** `guto-backend/server.ts` ou `guto-backend/src/arena-router.ts` (verificar qual existe)
**Branch a criar:** `fix/p0-arena-auth` (a partir de `main` do CEREBROGUTO)

**Problema:** Qualquer usuário autenticado pode ver o ranking de qualquer grupo passando um `arenaGroupId` arbitrário.

**O que fazer:**
1. Grep: `grep -rn "arenaGroupId\|arena.*ranking\|ranking.*arena" /Users/williandossantos/GUTOO/guto-backend/` para localizar o handler
2. No handler que retorna ranking por grupo, após buscar o grupo, validar:

```typescript
const user = req.gutoUser!;
const group = await getArenaGroup(arenaGroupId);

if (!group) {
  return res.status(404).json({ error: "Grupo não encontrado." });
}
if (group.teamId !== user.teamId) {
  return res.status(403).json({ error: "Acesso não autorizado a este grupo." });
}
```

3. Ajustar os nomes das funções/campos ao que existe no código real

---

#### P0-8: `guto-voice-service.ts` — fallback de voz cai em feminina no iOS

**Arquivo:** `guto-app-v0/lib/guto-voice/guto-voice-service.ts`
**Branch a criar:** `fix/p0-voice-gender-safety` (a partir de `main` do CORPOGUTO)

**Problema:** Quando ElevenLabs falha, o browser TTS usa `voices[0]` que no iOS Safari é feminina. Isso é **pior que silêncio** — quebra a identidade do GUTO.

**O que fazer:**
1. Ler o arquivo, linhas 160–330
2. Localizar `pickBrowserVoice()` (~linha 165)
3. Corrigir para retornar `null` se não encontrar voz masculina:

```typescript
function pickBrowserVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const masculine = voices.find(v =>
    /\bmale\b/i.test(v.name) ||
    /jorge|carlos|diego|luca|marco|james|daniel|david|mateus|alex/i.test(v.name.toLowerCase())
  );
  return masculine ?? null; // NUNCA retornar voices[0]
}
```

4. Localizar onde `pickBrowserVoice` é chamado (~linha 319)
5. Tratar retorno `null` com silêncio (não falar, apenas exibir texto):

```typescript
const voice = pickBrowserVoice(voices);
if (!voice) {
  console.warn("[GutoVoice] Nenhuma voz masculina disponível. Usando silêncio.");
  return; // não fala — o texto já está visível na tela de chat
}
utterance.voice = voice;
```

---

### ── BLOCO P1 ── (necessários antes do primeiro usuário real)

Fazer P1s somente após todos os P0 estarem commitados e mergeados.

#### P1-1: Soberania do nome — `guto-app.tsx`
**Arquivo:** `guto-app-v0/components/guto/guto-app.tsx`
**Branch:** `fix/p1-name-sovereignty`

**Problema:** Linha ~1838: `setCommittedName(inviteResolvedName)` + `saveGutoMemory({ name: inviteResolvedName })` executam ANTES do usuário confirmar o nome. E `hasMemoryName()` (~linha 903) pula a tela de naming.

**O que fazer:**
- `inviteResolvedName` deve ser apenas `defaultValue` do input de nome — nunca commitar automaticamente
- `hasMemoryName()` não deve pular a tela de naming no primeiro onboarding (apenas em re-entradas)
- `setCommittedName` e `saveGutoMemory({ name })` só devem ser chamados no handler de submit do botão "Confirmar"

---

#### P1-2: Teclado iOS esconde botão de confirmar nome
**Arquivo:** `guto-app-v0/components/guto/screens/name-screen.tsx`
**Branch:** `fix/p1-name-keyboard-ios`

**O que fazer:**
```typescript
useEffect(() => {
  const handler = () => {
    const kbHeight = window.innerHeight - (window.visualViewport?.height ?? window.innerHeight);
    setKeyboardHeight(kbHeight);
  };
  window.visualViewport?.addEventListener("resize", handler);
  return () => window.visualViewport?.removeEventListener("resize", handler);
}, []);
// No JSX: <div style={{ paddingBottom: keyboardHeight + 16 }}>botão</div>
```

---

#### P1-3: `calibration-screen.tsx:65` — `"sem dor"` hardcoded PT-BR
**Arquivo:** `guto-app-v0/components/guto/screens/calibration-screen.tsx`
**Branch:** `fix/p1-calibration-i18n`

**O que fazer:**
```typescript
const noInjuryFallback: Record<SupportedLanguage, string> = {
  "pt-BR": "sem dor",
  "en-US": "no pain or injury",
  "it-IT": "nessun dolore",
};
trainingPathology: pathology.trim() || noInjuryFallback[language]
```

---

#### P1-4: `guto-app.tsx:2496–2497` — "SELANDO"/"CONECTANDO" hardcoded PT-BR no pacto
**Arquivo:** `guto-app-v0/components/guto/guto-app.tsx`
**Branch:** `fix/p1-pact-screen-i18n`

```typescript
const pactCopy = {
  "pt-BR": { sealing: "SELANDO O PACTO...", connecting: "CONECTANDO COM O GUTO..." },
  "en-US": { sealing: "SEALING THE PACT...", connecting: "CONNECTING WITH GUTO..." },
  "it-IT": { sealing: "SIGILLANDO IL PATTO...", connecting: "CONNESSIONE CON GUTO..." },
}
```

---

#### P1-5: `startSystem()` não concede XP inicial
**Arquivo:** `guto-app-v0/components/guto/guto-app.tsx`, função `startSystem()` (~linha 988)
**Branch:** `fix/p1-initial-xp`

Após concluir onboarding, chamar a função/endpoint que concede XP por `onboarding_complete`. Verificar como XP é concedido no backend (grep por `grantXP` ou `xp` no backend) e replicar a chamada.

---

#### P1-6: `nutrition.ts` — `foodIntolerances` nunca chega no prompt da dieta
**Arquivo:** `guto-backend/src/nutrition.ts`
**Branch:** `fix/p1-diet-intolerances`

Adicionar `foodIntolerances: string[]` à interface `NutritionProfile` e incluir no prompt:
```typescript
if (profile.foodIntolerances?.length > 0) {
  prompt += `\nINTOLERÂNCIAS ALIMENTARES: ${profile.foodIntolerances.join(", ")}. NUNCA incluir esses ingredientes no plano.`;
}
```

---

#### P1-7: `diet-tab.tsx` — sem disclaimer médico
**Arquivo:** `guto-app-v0/components/guto/tabs/diet-tab.tsx`
**Branch:** `fix/p1-diet-disclaimer`

Adicionar footer com:
```typescript
const dietDisclaimer = {
  "pt-BR": "Sugestão de IA — não é prescrição clínica. Consulte um nutricionista.",
  "en-US": "AI suggestion — not clinical nutrition advice. Consult a registered dietitian.",
  "it-IT": "Suggerimento IA — non è una prescrizione clinica. Consulta un dietologo.",
}
```

---

#### P1-8: `sw.js:6` — `"Tô aqui."` hardcoded PT-BR no service worker
**Arquivo:** `guto-app-v0/public/sw.js`, linha 6
**Branch:** `fix/p1-sw-i18n`

Substituir `"Tô aqui."` por `"GUTO"` (neutro). O backend deve enviar `body` já traduzido no payload de push.

---

#### P1-9: `guto-online-engine.ts:78` — checklist PT-BR hardcoded
**Arquivo:** `guto-backend/src/guto-online-engine.ts`, ~linha 78
**Branch:** `fix/p1-guto-online-i18n`

Grep por `"Aquecimento"` e `"série"` no arquivo. Criar mapa i18n ou usar as strings do plano de treino gerado (que já vem no idioma correto via IA).

---

#### P1-10: Admin panel — histórico de fotos de validação ausente
**Identificar** qual arquivo é o drawer do aluno no painel admin (grep por `studentDrawer` ou `StudentDetail` ou `aluno` em `guto-app-v0/components`).
Adicionar seção "Validações" com thumbnails, data/hora e flag `manualOverride`.

---

## WORKFLOW PARA CADA FIX

```bash
# Backend:
cd /Users/williandossantos/GUTOO/guto-backend
git checkout main && git pull
git checkout -b fix/NOME-DO-FIX

# Fazer as edições...

git add <arquivos específicos>
git commit -m "fix(p0|p1): descrição clara do que foi corrigido e por quê"
git push origin fix/NOME-DO-FIX

# Frontend:
cd /Users/williandossantos/GUTOO/guto-app-v0
git checkout main && git pull
git checkout -b fix/NOME-DO-FIX
# ... mesma sequência
```

---

## REFERÊNCIAS DE CÓDIGO IMPORTANTES

### Idiomas suportados
```typescript
type SupportedLanguage = "pt-BR" | "en-US" | "it-IT"
```

### Como ler idioma atual no frontend
```typescript
import { getLanguage } from "@/lib/language"
const lang = getLanguage(language) as SupportedLanguage
```

### Como detectar produção no backend
```typescript
import { isProductionEnv } from "./src/config.js"
// true se NODE_ENV=production OU RENDER=true
```

### Estrutura de autenticação
- Backend usa `req.gutoUser!.userId` (do JWT) — nunca aceita userId de query param ou body
- Frontend não envia userId em requisições — o backend extrai do token

### Persistência de memória (3 camadas)
1. Redis/Upstash (primário, produção)
2. Filesystem JSON em `data/` (fallback, efêmero no Render)
3. RAM (fallback de emergência)
- Sempre preferir as funções com sufixo `Async` nos endpoints críticos

---

## CONTATO E CONTEXTO

O projeto segue o **Santo Graal V3.1** em:
`/Users/williandossantos/GUTOO/GUTO_SANTO_GRAAL_V3_1_IMPECAVEL.md`

Leia este documento antes de qualquer decisão de produto. Ele define o que é o GUTO, como cada parte deve funcionar e os princípios inegociáveis.

Founder: Willian Gustavo Santos (williangustavosantos@gmail.com)
