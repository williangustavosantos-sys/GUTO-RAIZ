# Regras de trabalho do GUTO

1. Leia `docs/agent-handoff/00-START-HERE.md` antes de qualquer outro documento do projeto.
2. Leia os demais arquivos de `docs/agent-handoff/` na ordem numérica.
3. Confirme repositório, branch, HEAD, upstream, status, stashes e gitlinks antes de alterar arquivos.
4. Rode o baseline aplicável antes da mudança.
5. Não altere a arquitetura sem necessidade demonstrada e autorização compatível com a missão.
6. Preserve as fronteiras de autoridade do V3 descritas no handoff.
7. Faça mudanças pequenas, testáveis e, quando possível, um bug por branch/PR.
8. Para fluxos críticos, valide em Preview antes de Production.

Regras permanentes preservadas:

- Leia `GUTO_HANDOFF_ATUAL.md` também quando ele existir no checkout, mas trate `docs/agent-handoff/` como o handoff operacional V3 mais recente.
- Nunca apague, resete, limpe ou misture trabalho não relacionado.
- Reproduza o bug antes do fix.
- Siga teste -> PR -> merge -> deploy -> smoke.
- Teste automatizado não é aceite final.
- Não declare Beta sem aprovação manual explícita do fundador.
- Não faça auditoria geral nem adicione features sem solicitação.
