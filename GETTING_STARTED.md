# Getting Started with BibleProject

## Prerequisites

- Node.js 18+ (check with `node --version`)
- npm (comes with Node.js)
- PostgreSQL 14+ (we'll set this up with Docker later)

## Quick Start (First Time Setup)

### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies across all workspaces (web app, database package, types, auth).

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the values:
- `DATABASE_URL` - Database connection string (we'll configure this after PostgreSQL is running)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Keep as `http://localhost:3000` for local development

### 3. Database Setup (Prerequisites)

Before running the app, you need a PostgreSQL database. Choose one:

**Option A: Docker (Recommended)**
```bash
docker run -d \
  --name bibleproject-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bibleproject \
  -p 5432:5432 \
  postgres:15-alpine
```

Then set `DATABASE_URL` in `.env.local`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bibleproject?schema=public"
```

**Option B: Local PostgreSQL Installation**
Install PostgreSQL, create a database named `bibleproject`, and set your `DATABASE_URL`.

### 4. Push Database Schema

Once your database is running:

```bash
npm run db:push
```

This syncs the Prisma schema to your database.

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts:
- Next.js dev server on `http://localhost:3000`
- TypeScript type checking
- Hot reloading on file changes

### Build for Production

```bash
npm run build
npm run start
```

## Common Commands

### Database Commands

```bash
npm run db:push      # Sync schema to database
npm run db:migrate   # Create a new migration
npm run db:seed      # Seed test data (not yet implemented)
npm run db:studio    # Open Prisma Studio (GUI for database)
```

### Code Quality

```bash
npm run lint         # Lint code
npm run type-check   # Check TypeScript types
npm run format       # Format code with Prettier
```

### Monorepo Commands

```bash
npm run build        # Build all packages
npm run dev          # Start all dev servers (uses Turbo)
```

## Troubleshooting

### "Database connection failed"
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Verify the database name exists

### "next: command not found"
- Run `npm install` to install dependencies
- Check Node.js version with `node --version` (should be 18+)

### "Port 3000 already in use"
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## Project Structure Overview

- **apps/web/** - Next.js frontend and API routes
- **packages/db/** - Prisma ORM and database schema
- **packages/types/** - Shared TypeScript type definitions
- **packages/auth/** - Authentication utilities (password hashing, validation)

## Next Steps

1. Get the boilerplate running with the steps above
2. Visit `http://localhost:3000` in your browser
3. See the home page with Sign In / Sign Up buttons
4. Check [CLAUDE.md](./CLAUDE.md) for architecture details
5. Check [TODO.md](./TODO.md) to see what features to build next

## More Help

For development guidelines and architecture patterns, see [CLAUDE.md](./CLAUDE.md).

For project tasks and progress, see [TODO.md](./TODO.md).
