# Contrato de ambiente

Somente nomes e finalidade são documentados aqui. Nunca versionar valores secretos, database URLs completas, senhas, API keys ou JWT secrets.

## Frontend

| Variável | Obrigatoriedade | Ambientes | Finalidade |
|---|---|---|---|
| `GUTO_BACKEND_PROXY_URL` | required | Preview + Production | destino server-side do proxy `/api/guto/*` |
| `NEXT_PUBLIC_GUTO_API_URL` | required | Preview + Production | origem pública da API; `NEXT_PUBLIC_API_URL` é fallback legado |
| `NEXT_PUBLIC_GUTO_V3_ENABLED` | required | Preview + Production V3 | ativa cliente e rotas Companion V3 |
| `NEXT_PUBLIC_GUTO_V3_PANEL_ENABLED` | required quando Panel opera com V3 | Preview + Production | libera apenas superfícies administrativas permitidas |
| `GUTO_V3_ONLY` | required para cutover soberano | Preview + Production V3 | bloqueia proxy de superfícies Companion legadas |
| `NEXT_PUBLIC_GUTO_TIME_ZONE` | optional | ambos | timezone de apresentação |
| `NEXT_PUBLIC_VERCEL_ENV` | platform | Vercel | identificação do ambiente |
| `NEXT_PUBLIC_APP_VERSION` | optional | ambos | versão exibida/telemetria |

Não use `NEXT_PUBLIC_ENABLE_DEMO_LOGIN` em Production.

## Backend — núcleo V3

| Variável | Obrigatoriedade | Ambientes | Finalidade |
|---|---|---|---|
| `GUTO_V3_ENABLED` | required | Preview + Production V3 | habilita router/runtime V3 |
| `GUTO_V3_ONLY` | required no cutover | Preview + Production V3 | bloqueia autoridade Companion V1/V2 |
| `GUTO_V3_PANEL_ENABLED` | required quando bridge Panel está ativo | ambos | mantém superfície administrativa limitada |
| `GUTO_V3_TARGET_ENV` | recommended | ambos | identifica o alvo operacional |
| `DATABASE_URL` | required | ambos | conexão runtime PostgreSQL restrita |
| `GUTO_V3_RUNTIME_DB_ROLE` | required/recommended | ambos | papel runtime esperado pelo health/RLS |
| `GUTO_V3_PG_SSL` | required conforme provedor | ambos | política SSL da conexão |
| `GUTO_V3_PG_POOL_MAX` | optional | ambos | limite do pool |
| `GUTO_V3_ADMIN_DATABASE_URL` | optional e privilegiada | jobs locais/bridge autorizado | migrations, seed ou provisionamento administrativo; não dar ao runtime Companion sem necessidade |

## Backend — Redis e idempotência

| Variável | Obrigatoriedade | Ambientes | Finalidade |
|---|---|---|---|
| `UPSTASH_REDIS_REST_URL` | required | ambos | Redis operacional |
| `UPSTASH_REDIS_REST_TOKEN` | required | ambos | autenticação Redis |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | fallback | ambos | nomes alternativos aceitos pelo código |
| `GUTO_V3_OPERATIONAL_TTL_SECONDS` | optional | ambos | TTL do contexto/idempotência |
| `GUTO_V3_LOCK_TTL_MS` | optional | ambos | TTL de lock por operação |

## Backend — Gemini/Genkit

| Variável | Obrigatoriedade | Ambientes | Finalidade |
|---|---|---|---|
| `GEMINI_API_KEY` | required | ambos | Gemini/Genkit e Gemini Interactions |
| `GUTO_GEMINI_MODEL` | optional | ambos | modelo selecionado |
| `GUTO_V3_GEMINI_INTERACTIONS_STORE` | required, não `false` | ambos | persistência/continuidade das interactions V3 |
| `GUTO_V3_GEMINI_INTERACTION_RETENTION_DAYS` | optional | ambos | retenção das interações persistidas |

Gemini não é autoridade matemática nem storage oficial.

## Backend — Mem0, Langfuse e Inngest

| Variável | Obrigatoriedade para `ready=true` | Ambientes | Finalidade |
|---|---|---|---|
| `MEM0_API_KEY` | required | ambos | memória relacional |
| `MEM0_BASE_URL` | optional | ambos | endpoint Mem0 |
| `LANGFUSE_PUBLIC_KEY` | required | ambos | tracing |
| `LANGFUSE_SECRET_KEY` | required | ambos | tracing |
| `LANGFUSE_BASE_URL` | optional | ambos | endpoint Langfuse |
| `LANGFUSE_TRACING_ENVIRONMENT` | recommended | ambos | separa Preview/Production |
| `INNGEST_EVENT_KEY` | required | ambos | publicação de eventos |
| `INNGEST_SIGNING_KEY` | required | ambos | verificação de callbacks |

## Backend — Auth e segurança

| Variável | Obrigatoriedade | Ambientes | Finalidade |
|---|---|---|---|
| `GUTO_V3_JWT_SECRET` | required, mínimo 32 chars | ambos | assinatura de sessão V3 |
| `GUTO_V3_JWT_ISSUER` | optional/default | ambos | issuer JWT |
| `GUTO_V3_JWT_AUDIENCE` | optional/default | ambos | audience JWT, separar alvos quando aplicável |
| `GUTO_V3_SESSION_TTL_SECONDS` | optional/default | ambos | validade da sessão |
| `GUTO_V3_TRACE_HASH_SALT` | recommended | ambos | hash de identificadores em tracing |
| `GUTO_ALLOWED_ORIGINS` | required | ambos | allowlist CORS |
| `GUTO_TRUST_PROXY` | required na Vercel | ambos | interpretação correta do proxy |
| `GUTO_V3_LOGIN_RATE_LIMIT_MAX` | optional/default | ambos | limite de tentativas de login |

## Teste/Preview isolado

Os nomes abaixo são exclusivos de testes/Preview:

- seed isolado: `GUTO_V3_TEST_PROJECT_REF`, `GUTO_V3_TEST_SEED_ENABLED`, `GUTO_V3_TEST_USER_A_EMAIL`, `GUTO_V3_TEST_USER_A_PASSWORD`, `GUTO_V3_TEST_USER_A_PASSWORD_HASH`, `GUTO_V3_TEST_USER_B_EMAIL`, `GUTO_V3_TEST_USER_B_PASSWORD`, `GUTO_V3_TEST_USER_B_PASSWORD_HASH`;
- verificador de integrações: `GUTO_V3_VERIFY_USER_A_EMAIL`, `GUTO_V3_VERIFY_USER_A_PASSWORD`, `GUTO_V3_VERIFY_USER_B_EMAIL`, `GUTO_V3_VERIFY_USER_B_PASSWORD`;
- verificador Panel -> V3: `GUTO_VERIFY_API_URL`, `GUTO_VERIFY_ADMIN_EMAIL`, `GUTO_VERIFY_ADMIN_PASSWORD`, `GUTO_VERIFY_STUDENT_EMAIL`, `GUTO_VERIFY_STUDENT_PASSWORD`, `GUTO_VERIFY_STUDENT_NAME`, `GUTO_VERIFY_TEAM_ID`, `GUTO_VERIFY_FRONTEND_URL`.

Nunca reutilizar conta do fundador ou dados Production. Nomes de variáveis que contêm `PASSWORD`, `KEY`, `TOKEN`, `SECRET` ou `URL` não autorizam registrar seus valores.

Variáveis de tolerância atuais do domínio: `GUTO_V3_NUTRITION_SUM_TOLERANCE_KCAL` e `GUTO_V3_NUTRITION_MACRO_TOLERANCE_KCAL`. Elas controlam validação aritmética; não substituem targets nutricionais individualizados.
