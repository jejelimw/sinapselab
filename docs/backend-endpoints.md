# Backend Endpoints

## Auth

- `GET /api/auth/health/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `POST /api/auth/google/`
- `POST /api/auth/apple/`

## Solicitacoes (cliente)

- `GET /api/solicitacoes/`
- `POST /api/solicitacoes/`
- `GET /api/solicitacoes/{id}/`
- `POST /api/solicitacoes/{id}/anexos/`

Filtros:

- `status`
- `start_date`
- `end_date`

## Solicitacoes (laboratorio)

- `GET /api/laboratorio/solicitacoes/`
- `GET /api/laboratorio/solicitacoes/{id}/`
- `PATCH /api/laboratorio/solicitacoes/{id}/status/`
- `POST /api/laboratorio/solicitacoes/{id}/responder/`

## Notificacoes

- `POST /api/notificacoes/device-token/`
