# Dados e autoridade

## Autoridade administrativa

**PANEL = autoridade administrativa.**

Responsável por:

- companies;
- coaches;
- students;
- permissions e access;
- provisionamento administrativo do vínculo e da credencial V3 do aluno.

O Panel não é autoridade Companion e não deve decidir treino, dieta, chat, fatos ou contexto confirmado.

## Autoridade Companion

**GUTO V3 = autoridade Companion.**

Responsável por:

- consentimento e calibration;
- First Contact;
- confirmed context;
- workout e diet oficiais;
- chat e decisões operacionais autorizadas;
- facts e mudanças permanentes;
- exercise/food swaps;
- XP e missão/BORA quando aplicável ao fluxo V3.

V1/V2 não podem voltar a ser autoridade Companion por fallback silencioso.

## Storage e serviços

- **PostgreSQL/Supabase:** verdade oficial, durável, versionada e isolada. Contexto confirmado, planos, fatos, sessões e estado da jornada devem ser reconciliados aqui.
- **Redis:** estado operacional transitório: active context, locks e idempotência. Não é verdade oficial do usuário e perder uma chave não pode reescrever fatos ou planos.
- **Mem0:** memória de relacionamento, preferências conversacionais e padrões estáveis de interação. Não é autoridade para treino oficial, dieta oficial, XP, contexto médico/físico oficial ou estado operacional ativo.
- **Gemini:** interpreta, propõe, raciocina e fala. Não possui official truth e não persiste mutação sem Policy Gate + executor.
- **Langfuse:** rastreamento e diagnóstico; não é storage de produto.
- **Inngest:** entrega durável de efeitos assíncronos; não é fonte oficial.

## Identity bridge

```text
Panel
  -> student administrativo
  -> vínculo tenant/user/identity V3
  -> credencial e sessão V3
  -> V3 auth resolve ActorContext
  -> operações isoladas por tenantId + userId
```

O bridge deve manter identidade estável e isolamento. Não criar usuário global, estado global ou atalhos que ignorem tenant e usuário.
