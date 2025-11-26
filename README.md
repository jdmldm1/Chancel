# BibleProject

A collaborative web application for group Bible study sessions.

## Overview

BibleProject is a modern, collaborative platform that enables Bible study leaders to organize study sessions with scripture passages, while allowing group members to engage through inline comments and discussions on specific verses.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL 14+
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BibleProject
```

2. Install dependencies:
```bash
npm install
# or
yarn install
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and secrets
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
BibleProject/
├── apps/web/                 # Next.js frontend + API routes
│   ├── app/                  # App Router pages and API routes
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   └── public/               # Static assets
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── db/                   # Prisma database setup
│   └── auth/                 # Authentication utilities
├── CLAUDE.md                 # Development guidelines
└── TODO.md                   # Project task list
```

## Available Scripts

### Development
- `npm run dev` - Start all development servers
- `npm run build` - Build for production
- `npm run lint` - Lint code
- `npm run type-check` - Type check with TypeScript
- `npm run format` - Format code with Prettier

### Database
- `npm run db:push` - Sync schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed test data
- `npm run db:studio` - Open Prisma Studio

### Testing
- `npm run test` - Run all tests
- `npm run test:watch` - Watch mode

## Technology Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Express (optional)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Real-time:** Socket.IO (for future features)
- **Package Manager:** npm with workspaces

## Development Workflow

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines, architecture decisions, and best practices.

Track project progress in [TODO.md](./TODO.md).

## Contributing

1. Follow the development guidelines in CLAUDE.md
2. Use TypeScript for all new code
3. Ensure types are defined in `packages/types`
4. Run tests before committing
5. Keep commits atomic and descriptive

## License

MIT
