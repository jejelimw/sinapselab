# Backend Uploads

## Limites

- Tamanho maximo: `20MB` por arquivo
- Extensoes permitidas:
  - `pdf`
  - `png`
  - `jpg`
  - `jpeg`
  - `doc`
  - `docx`
  - `xls`
  - `xlsx`

## Validacoes

- Validacao por extensao
- Validacao por MIME type
- Limites globais em settings:
  - `MAX_UPLOAD_SIZE_MB`
  - `FILE_UPLOAD_MAX_MEMORY_SIZE`
  - `DATA_UPLOAD_MAX_MEMORY_SIZE`

## Storage atual

- Local filesystem (VPS)
- `MEDIA_ROOT` e `MEDIA_URL` configuraveis por `.env`
