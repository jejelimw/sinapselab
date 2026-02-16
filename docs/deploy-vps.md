# Deploy VPS (Staging)

## Servicos recomendados

- Nginx
- Gunicorn
- Django
- PostgreSQL
- Pasta local para media (`/var/www/sinapse/media`)

## Passos

1. Clone do repositorio na VPS
2. Configure `.env` do backend com credenciais reais
3. Instale dependencias python
4. Execute `python manage.py migrate`
5. Execute `python manage.py collectstatic`
6. Suba Gunicorn (systemd)
7. Configure Nginx para:
   - proxy para Gunicorn
   - servir `/static`
   - servir `/media`
8. Build do web e servir estatico via Nginx

## Backup minimo

- Dump diario do PostgreSQL
- Backup da pasta de media
- Rotacao de logs
