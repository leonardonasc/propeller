# Propeller

Propeller é uma plataforma de produtividade para organizar projetos e acompanhar tarefas em um só lugar.

O projeto está sendo desenvolvido como um monorepo com Turborepo, separando a aplicação web da API.

## Tecnologias

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NestJS](https://nestjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Better Auth](https://www.better-auth.com/)
- [Turborepo](https://turbo.build/repo)
- [Bun](https://bun.sh/)

## Funcionalidades

- Cadastro, login e gerenciamento de sessão
- Dashboard autenticado
- Criação e listagem de projetos
- Visualização de detalhes de um projeto
- Visão geral, quadro e lista de tarefas por projeto
- API REST para gerenciamento de projetos
- Persistência de dados com PostgreSQL e Drizzle ORM
- Interface responsiva com Next.js e Tailwind CSS

## Roadmap mvp
- Autenticação (Registro, Login) ✅
- Interfaces + responsividade (70%) 
- Criar projetos
- Criar tasks

## Estrutura do projeto

```text
.
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── database/
│   │   │   │   └── schema/
│   │   │   ├── projects/
│   │   │   ├── users/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── drizzle/
│   │
│   └── web/
│       ├── app/
│       │   ├── (main)/
│       │   │   ├── dashboard/
│       │   │   └── projects/
│       │   ├── login/
│       │   ├── src/
│       │   │   ├── schemas/
│       │   │   └── services/
│       │   ├── globals.css
│       │   └── layout.tsx
│       ├── components/
│       └── lib/
│
├── packages/
│   ├── eslint-config/
│   └── typescript-config/
│
├── package.json
├── turbo.json
└── README.md
```

### Aplicações

- `apps/web`: aplicação web construída com Next.js.
- `apps/backend`: API REST construída com NestJS.

### Pacotes

- `packages/eslint-config`: configurações compartilhadas do ESLint.
- `packages/typescript-config`: configurações compartilhadas do TypeScript.

## Pré-requisitos

- Node.js 24 ou superior
- Bun 1.3.12 ou superior
- PostgreSQL

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd coffee-store
bun install
```

## Variáveis de ambiente

### Backend

Crie `apps/backend/.env`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/propeller
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=seu_secret
UI_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
```

### Frontend

Crie `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Desenvolvimento

Para iniciar o frontend e o backend pelo Turborepo:

```bash
bun run dev
```

A aplicação web estará disponível em [http://localhost:3001](http://localhost:3001) e a API em [http://localhost:3000](http://localhost:3000).

Para executar cada aplicação separadamente:

```bash
bun --cwd apps/web run dev
bun --cwd apps/backend run dev
```

## Scripts

Na raiz do projeto:

```bash
bun run dev          # inicia as aplicações em desenvolvimento
bun run build        # gera o build de todas as aplicações
bun run lint         # executa o lint do monorepo
bun run check-types  # verifica os tipos TypeScript
bun run format       # formata arquivos TypeScript e Markdown
```

Scripts disponíveis no backend:

```bash
bun --cwd apps/backend run test
bun --cwd apps/backend run test:e2e
bun --cwd apps/backend run test:cov
```

## Banco de dados

O backend utiliza PostgreSQL com Drizzle ORM. A configuração do schema está em `apps/backend/src/database/schema` e as migrações ficam em `apps/backend/drizzle`.

Defina `DATABASE_URL` antes de iniciar a API.

## Status

Em desenvolvimento. Autenticação e gerenciamento básico de projetos já estão implementados. Tarefas, calendário, organização de rotina e configurações ainda estão em evolução.
