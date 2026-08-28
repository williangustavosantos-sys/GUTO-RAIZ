# Achados atuais do Founder Manual Test

Não ampliar estes relatos com uma causa não comprovada. Reproduza um problema por ciclo antes de corrigir.

## ISSUE 1 — First Contact CTA

- Sintoma: `CONFIRMAR CONTEXTO` visualmente quebrado no mobile.
- A lógica de confirmação funcionou no teste.
- Classificação: **UI BUG**.

## ISSUE 2 — Nutrition Engine

Perfil real testado:

- male;
- 34 anos;
- 74.8 kg;
- 188 cm;
- returning;
- 6x/week;
- hypertrophy.

Dieta gerada aproximadamente:

- 1718.94 kcal;
- 79.95 g protein;
- 253.62 g carbs;
- 42.74 g fat.

O `generateDietDraft` atual usa alimentos e quantidades praticamente fixos e soma os nutrientes depois. Ainda não há target nutricional individual suficientemente robusto.

Classificação: **PRODUCT/DOMAIN BLOCKER**.

## ISSUE 3 — Food swap

O swap funciona tecnicamente. Sequência observada:

- potato -> rice;
- rice -> beans.

A lógica atual prioriza equivalência calórica e não preserva suficientemente papel nutricional, estrutura de macros, contexto da refeição e target diário.

Classificação: **DOMAIN LOGIC ISSUE**.

## ISSUE 4 — Exercise occupied

Estado observado:

- active context: `Supino reto máquina`;
- input: `ocupado`;
- chamada `active-context`: HTTP 200;
- turno seguinte `POST /guto/v3`: HTTP 502;
- request observada: `fad2235e-3a3f-48a0-9f34-3046fdc31e21`.

Não há causa raiz confirmada. Investigue com reprodução e correlação antes do fix.

Classificação: **BACKEND BUG**.

## Observação separada

Foi observado warning de depreciação do client PostgreSQL relacionado a concurrent query. Não há evidência de que ele tenha causado o 502 e ele não deve ser apresentado como causa.
