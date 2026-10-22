# Propeller

Propeller é uma plataforma para organizar projetos, tarefas e roadmaps em um só lugar. Inclui agenda, contas de usuário, ferramentas administrativas e notificações.

## Aplicações

Este repositório é um monorepo gerenciado com Bun e Turborepo:

- `apps/web`: interface web em Next.js e React. Executa localmente em `http://localhost:3001`.
- `apps/backend`: API em NestJS, com autenticação Better Auth, persistência PostgreSQL via Drizzle ORM e documentação Swagger.
- `packages/`: configurações e pacotes compartilhados.

## Requisitos

- [Bun](https://bun.sh/) 1.3.12
- Node.js 24 ou superior
- Um banco PostgreSQL

## Configuração local

Na raiz do repositório, instale as dependências:

```bash
bun install
```

Configure as variáveis de ambiente nos arquivos ignorados pelo Git `apps/backend/.env` e `apps/web/.env.local`:

### `apps/backend/.env`

```dotenv
DATABASE_URL=postgresql://usuario:senha@localhost:5432/propeller
UI_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
PORT=3000
```

`DATABASE_URL` deve apontar para um banco PostgreSQL acessível. `UI_URL` é a origem confiável do frontend para Better Auth; `CORS_ORIGIN` é a origem permitida pelo CORS. Em produção, use as URLs HTTPS públicas correspondentes.

### `apps/web/.env.local`

```dotenv
API_URL=http://localhost:3000
```

`API_URL` é a URL base da API, sem acrescentar `/api`. O Next.js usa essa URL para encaminhar chamadas `/api/*` e o middleware consulta a sessão do usuário.

Não compartilhe nem faça commit de valores secretos ou arquivos `.env`. Para produção, configure as mesmas variáveis nos ambientes da plataforma de hospedagem. Configure também `BETTER_AUTH_SECRET` na API com um valor aleatório forte e privado.

## Banco de dados

Com o `DATABASE_URL` configurado na API, aplique as migrações:

```bash
bun run --cwd apps/backend db:migrate
```

Execute o comando novamente quando novas migrações forem adicionadas. Confira o destino de `DATABASE_URL` antes de aplicar migrações em produção.

## Desenvolvimento

Inicie frontend e API juntos a partir da raiz:

```bash
bun run dev
```

Ou inicie cada aplicação em um terminal separado:

```bash
bun run --cwd apps/backend dev
```

```bash
bun run --cwd apps/web dev
```

A interface fica em `http://localhost:3001`; a API usa `http://localhost:3000`. A documentação interativa da API fica em `http://localhost:3000/api/docs`, e o documento OpenAPI em `http://localhost:3000/api/docs-json`.

## Comandos úteis

Na raiz:

| Comando | Descrição |
| --- | --- |
| `bun run dev` | Inicia as aplicações em modo de desenvolvimento |
| `bun run build` | Compila os apps e pacotes |
| `bun run lint` | Executa o lint dos pacotes configurados |
| `bun run check-types` | Verifica os tipos TypeScript |
| `bun run format` | Formata arquivos TypeScript, TSX e Markdown com Prettier |

Comandos específicos:

| Comando | Descrição |
| --- | --- |
| `bun run --cwd apps/backend db:migrate` | Aplica as migrações do PostgreSQL |
| `bun run --cwd apps/backend test` | Executa os testes unitários da API |
| `bun run --cwd apps/backend test:e2e` | Executa os testes end-to-end da API |

## Deploy

Configure frontend e API com suas respectivas variáveis de ambiente. O frontend deve receber `API_URL` apontando para a URL pública da API. A API deve receber `DATABASE_URL`, `BETTER_AUTH_SECRET`, `UI_URL` e `CORS_ORIGIN`; `UI_URL` e `CORS_ORIGIN` devem corresponder à origem pública do frontend. Use HTTPS em produção e aplique as migrações do banco antes de disponibilizar a versão.

