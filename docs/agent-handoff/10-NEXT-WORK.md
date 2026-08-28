# Próximo trabalho

Este arquivo prioriza missões futuras. Nada desta lista deve ser implementado durante o handoff.

## PRIORITY 1 — Nutrition Engine individualizado

Antes de implementar do zero, auditar open source e produzir uma decisão de build/adapt/port:

- projeto prioritário: https://github.com/ddarmon/llmn
- investigar: optimizer, constraints, TDEE, macro targets, portion limits, solver, adaptive TDEE, licença e viabilidade de port para TypeScript;
- referência arquitetural: https://github.com/whiteravens20/diet-app
- verificar a licença antes de ler/incorporar código; código Noncommercial não pode entrar no GUTO comercial.

Fontes de dados a avaliar:

- USDA FoodData Central como fonte primária estruturada;
- CREA / composição italiana para alimentos relevantes ao mercado italiano;
- Open Food Facts apenas como complemento para produtos comerciais quando apropriado.

Entrega esperada da primeira missão Freebuff: auditoria objetiva de licença, modelo de dados, constraints/solver e proposta de integração mínima compatível com as fronteiras V3. Não implementar o motor antes dessa decisão.

## PRIORITY 2 — Food swap nutricional

Preservar papel nutricional, macros, refeição, restrições e meta diária; tratar depois do contrato de target do Nutrition Engine.

## PRIORITY 3 — 502 em `ocupado`

Reproduzir o request, fechar correlação e causa raiz, então fazer fix mínimo + regressão + Preview + mesmo cenário em navegador. Não assumir relação com o warning PostgreSQL.

## PRIORITY 4 — CTA mobile do First Contact

Corrigir somente o layout do `CONFIRMAR CONTEXTO` depois de reprodução nos viewports afetados, preservando a lógica já funcional.
