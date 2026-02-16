# Laboratorio de Proteses

Monorepo inicial para:

- Web: React + Vite
- Mobile: React Native + Expo
- Backend: Django + DRF + JWT + OAuth Google/Apple

Identidade web aplicada: **Sinapse Lab** (tema preto + laranja) com Tailwind + componentes no padrao shadcn/ui e carousel Embla autoplay.

## Estrutura

- `apps/web`: landing page e portal
- `apps/mobile`: app mobile cliente/laboratorio
- `apps/backend`: API de autenticacao, solicitacoes, anexos e notificacoes

## Backend (setup rapido)

1. Suba PostgreSQL:

```bash
docker compose up -d postgres
```

2. Copie `apps/backend/.env.example` para `apps/backend/.env` e preencha credenciais OAuth.
3. Crie ambiente virtual e instale dependencias:

```bash
cd apps/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements/base.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Endpoints principais da API

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `POST /api/auth/google/`
- `POST /api/auth/apple/`
- `GET|POST /api/solicitacoes/`
- `POST /api/solicitacoes/{id}/anexos/`
- `GET /api/laboratorio/solicitacoes/`
- `POST /api/laboratorio/solicitacoes/{id}/responder/`
- `PATCH /api/laboratorio/solicitacoes/{id}/status/`
- `POST /api/notificacoes/device-token/`

## Documentacao

- Arquitetura geral: `docs/arquitetura.md`
- Brand guide web: `docs/brand-guide.md`
- Backend overview: `docs/backend-overview.md`
- Backend auth: `docs/backend-auth.md`
- Backend RBAC: `docs/backend-rbac.md`
- Backend endpoints: `docs/backend-endpoints.md`
- Backend uploads: `docs/backend-uploads.md`
- Deploy VPS: `docs/deploy-vps.md`

## Web (setup rapido)

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev
```

## Mobile (setup rapido)

```bash
cd apps/mobile
npm install
npm run start
```
