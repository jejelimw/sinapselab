# Arquitetura Inicial

## Fronteiras do monorepo

- `apps/web`: interface web (landing + portal)
- `apps/mobile`: app mobile (Expo)
- `apps/backend`: API e regras de negocio

## Perfis

- cliente
- lab_atendente
- lab_analista
- lab_supervisor
- lab_admin

## Modulos backend

- `accounts`: usuario custom, JWT, social login
- `solicitacoes`: criacao, filtros por data/status, resposta do laboratorio, anexos
- `notifications`: registro de device tokens

## Banco de dados

- PostgreSQL via `DATABASE_URL`
- Compose local: `docker-compose.yml`

## Integracao web-api

- Login JWT em `/api/auth/login/`
- Dashboard cliente em `/api/solicitacoes/`
- Dashboard laboratorio em `/api/laboratorio/solicitacoes/`

## Frontend web

- TailwindCSS + componentes no padrao shadcn/ui
- Carousel Embla com autoplay e controles
- Tema oficial Sinapse Lab: preto + laranja

## Regras de upload

- ate 20MB por arquivo
- tipos: pdf, png, jpg, jpeg, doc, docx, xls, xlsx

## Documentos de referencia

- `docs/backend-overview.md`
- `docs/backend-auth.md`
- `docs/backend-rbac.md`
- `docs/backend-endpoints.md`
- `docs/backend-uploads.md`
- `docs/deploy-vps.md`
