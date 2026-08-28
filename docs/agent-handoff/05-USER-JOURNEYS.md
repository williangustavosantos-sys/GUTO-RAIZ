# Jornadas de usuário

## Founder Journey crítico

```text
Panel
-> create student
-> login V3
-> consent
-> calibration
-> First Contact
-> food context
-> physical functional context
-> confirmation
-> workout
-> diet
-> chat
-> exercise swap
-> food swap
-> mission/BORA
-> XP
-> permanent fact
-> adaptation
-> reload
-> logout/login
-> continuity
```

Cada passo crítico deve ser verificado tanto na interface quanto no estado persistido correspondente. Resposta HTTP ou tela bonita sem persistência coerente não fecha a jornada.

## Calibration

A Calibration atual coleta somente campos objetivos:

- sexo biológico;
- idade;
- peso;
- altura;
- nível/estado de treino;
- objetivo de treino;
- frequência semanal de treino.

Restrições alimentares e limitações funcionais não devem ser antecipadas para a Calibration.

## First Contact

O First Contact coleta:

- contexto alimentar;
- contexto físico funcional;
- confirmação do resumo antes da criação dos planos oficiais.

Invariantes:

- não gerar treino ou dieta antes da confirmação;
- confirmação cria/avança o confirmed context;
- treino e dieta devem apontar para a mesma versão confirmada;
- depois de concluído, `First Contact` permanece `COMPLETED` após reload e logout/login;
- não rerodar o fluxo concluído por falha de cache, Mem0 ou Redis.
