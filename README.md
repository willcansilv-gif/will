# VitaHub

## Visao geral

O VitaHub e um sistema full-stack com Node/Express, React e PostgreSQL. O banco e inicializado automaticamente na primeira subida do Docker Compose, criando todas as tabelas essenciais e um usuario administrador padrao.

## Como subir o projeto

```bash
docker compose up -d
```

### O que e criado automaticamente

Na primeira inicializacao do PostgreSQL (volume vazio):

- Banco `vitahub`
- Tabelas essenciais (`users`, `patients`, `providers`, `appointments`, `triages`, `telemed_sessions`) com indices e constraints
- Usuario administrador padrao

### Credenciais do administrador padrao

- **Email:** `admin@vitahub.local`
- **Senha:** `Admin@123!`

> A senha e armazenada com hash bcrypt no banco. Altere-a apos o primeiro login em ambientes reais.

## Observacoes

- Nao e necessario executar SQL manualmente.
- O script `db/init.sql` e executado automaticamente apenas na primeira inicializacao do container do PostgreSQL.
