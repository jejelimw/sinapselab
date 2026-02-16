# Backend RBAC

## Roles

- `cliente`
- `lab_atendente`
- `lab_analista`
- `lab_supervisor`
- `lab_admin`

## Regras atuais

- Cliente
  - cria solicitacao
  - lista apenas solicitacoes proprias
  - faz upload de anexos nos proprios itens
- Laboratorio (`lab_*`)
  - lista solicitacoes do laboratorio
  - altera status
- Resposta tecnica (`lab_analista`, `lab_supervisor`, `lab_admin`)
  - pode responder solicitacao

## Permissoes no codigo

- `IsLabUser`: `apps/backend/apps/common/permissions.py`
- `CanRespondSolicitacao`: `apps/backend/apps/common/permissions.py`
