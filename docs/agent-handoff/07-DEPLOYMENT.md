# Deployment

## Projetos

| Componente | GitHub | Projeto Vercel | Production |
|---|---|---|---|
| Frontend | CORPOGUTO | `corpoguto` (`prj_DNOacOwnlpwpVCuseiynsKw5N5Hq`) | https://corpoguto.vercel.app |
| Backend | CEREBROGUTO | `cerebroguto-sovereign-smoke` (`prj_xLOfqMBjnGSPOBniMLPPOQA5eEfM`) | https://cerebroguto-sovereign-smoke.vercel.app |

Os projetos pertencem ao team Vercel `team_nHdoEBA8W5CwzGDn8BZeDGVu`. Nunca copie arquivos locais `.vercel/.env*`, tokens ou segredos para Git ou documentação.

## Fluxo obrigatório para mudança relevante

```text
GitHub branch
-> Vercel Preview
-> testes e health gate
-> validação no navegador
-> Production somente após aprovação
```

- **Preview:** deployment isolado de branch para validar o SHA candidato sem alterar o domínio Production.
- **Production:** domínio público estável. Promover somente o artefato/SHA validado; não fazer novo build de fonte diferente e chamar de mesma release.

Para fluxo crítico:

1. baseline local;
2. push da branch;
3. deployment Preview dos projetos corretos;
4. `GET /health/v3` no backend candidato;
5. validação do cenário exato em navegador e persistência;
6. somente então, com autorização, promoção para Production e novo smoke.

## Health gate V3

Um backend saudável deve responder:

- endpoint: `/health/v3`;
- status: HTTP 200;
- corpo: `ready=true`;
- dependências configuradas e checks de Postgres, Redis e auth bem-sucedidos.

`ready=true` é condição necessária, não aceite suficiente. Não exponha secrets ao registrar o health.
