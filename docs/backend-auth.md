# Backend Auth

## JWT

- `POST /api/auth/login/`
  - payload: `email`, `password`
  - retorno: `access`, `refresh`
- `POST /api/auth/refresh/`
  - payload: `refresh`
  - retorno: novo `access`
- `GET /api/auth/me/`
  - requer bearer token

## OAuth

- `POST /api/auth/google/`
- `POST /api/auth/apple/`

## Variaveis obrigatorias

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `APPLE_CLIENT_ID`
- `APPLE_TEAM_ID`
- `APPLE_KEY_ID`
- `APPLE_PRIVATE_KEY`

## Observacoes Apple

- `APPLE_PRIVATE_KEY` pode usar `\n` no `.env`
- O backend converte para quebra real de linha no settings
