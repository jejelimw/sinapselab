# Backend Overview

## Stack

- Django + DRF
- PostgreSQL
- JWT (SimpleJWT)
- OAuth (Google e Apple via allauth + dj-rest-auth)

## Apps

- `apps.accounts`
  - usuario custom (`email` como login)
  - endpoint `me`
  - login JWT + refresh
  - social login Google/Apple
- `apps.solicitacoes`
  - solicitacoes do cliente
  - resposta do laboratorio
  - filtros por data e status
  - anexos com validacao
- `apps.notifications`
  - registro de tokens de dispositivo (mobile)

## Banco

- Configurado por `DATABASE_URL`
- Valor padrao para local: `postgresql://postgres:postgres@localhost:5432/sinapselab`
