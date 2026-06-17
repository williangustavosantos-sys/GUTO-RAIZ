# 05 — Dieta Integrada

> **Documento histórico. Não usar como fonte operacional atual sem comparar com o código em main.**

> Spec: `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` · Código: `guto-backend/src/nutrition.ts`, `food-catalog.ts`, `food-availability.ts`, `diet-store.ts`; `guto-app-v0/components/guto/tabs/diet-tab.tsx`, `lib/diet-plan.ts`
>
> **Veredito: 🟢 a engenharia da dieta é a mais sólida do produto — mas hoje está 🔴 inalcançável pelo chat.**

---

## O que a spec manda
Dieta **não** repergunta: usa a memória (idade, sexo, peso, altura, objetivo, país, cidade, NÃO COMO). Idioma só traduz texto; **país/cidade** definem alimento. `foodRestrictions` é soberano (intolerância → alimento sumido). Patologia ≠ restrição. Macros coerentes com `targetKcal`. `lockedByCoach` respeitado. **P0 sanitário**: nunca sugerir alimento proibido. Proibido: furo sanitário, idioma como país, dieta com dado ambíguo, "salvei" sem persistir.

## O que existe no código
- `nutrition.ts`: BMR Mifflin-St Jeor + TDEE + macros; `scaleDietToTarget` repara ±80 kcal.
- `food-catalog.ts` (tags de restrição) + `food-availability.ts` (disponibilidade por país).
- `POST /guto/diet/generate`; `diet/lock`; editor do painel barra alimento proibido.
- `lib/diet-plan.ts` (`sanitizeDietPlan`) no front.

## ✅ O que está certo
- **D-1..D-7, D-9 ✅** (por teste — `guto-diet-generation`, `guto-weekly-diet`, `guto-diet-calorie-repair`, `guto-diet-invalidation`): nutrição real, restrição banida, desacoplamento idioma×país, macros coerentes, lock respeitado, "não tenho alimento" = substituição.
- Geração proativa ao fim da calibragem; `dietProfileKey` reativa regeneração se o perfil muda.

## ❌ O que está errado / quebra
- **DI-1 (P0, upstream) — dieta inalcançável pelo chat.** Verificado ao vivo: "e a minha dieta, como tá?", "quantas calorias por dia?", "posso comer pizza hoje?" → **todas viram "distração"** ([03 B-1](03_chat_e_cerebro.md)). O motor de dieta funciona, mas o usuário **não chega nele** pela conversa.
- **D-8 (spec) — swap de alimento por chat com cobertura parcial.** Respeita lock, mas a troca de alimento conversacional não tem cobertura completa.

## ➕ O que falta adicionar
- Roteamento das perguntas de dieta/caloria/alimento no chat para o handler de dieta (parte do fix do [03]).
- Cobertura completa de swap de alimento por chat (D-8).

## 🛠 Plano de ação
1. **(depende de [03])** Rotear perguntas de dieta no chat para o handler/contexto de dieta em vez de "distração". Sem isso, toda a (boa) engenharia de dieta fica invisível.
2. **(P1) Swap de alimento por chat (D-8)** com persistência + respeito a lock.
3. **(verificação sanitária P0)** Gerar dieta para um intolerante a lactose e a um vegetariano e confirmar **zero** alimento proibido (a lógica passa nos testes; validar com perfis reais em 3 idiomas).

## Como verificar
Calibrar com NÃO COMO = "lactose"; gerar dieta; confirmar ausência total de laticínios e macros batendo com `targetKcal`. Depois, pelo chat, perguntar "posso comer X?" e exigir resposta de dieta (não "distração").
