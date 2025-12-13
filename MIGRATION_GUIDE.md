# Prisma Migration Guide

## Current Setup vs Recommended Setup

### Current Setup (db push)
Your `docker-compose.yml` currently uses:
```bash
npx prisma db push --skip-generate --accept-data-loss
```

**Pros:** Quick and simple
**Cons:**
- No migration history
- Risk of data loss
- Can't rollback changes
- Not auditable

### Recommended Setup (Prisma Migrate)

Prisma Migrate works like Entity Framework migrations:
- Creates migration files with SQL
- Tracks migration history
- Safer for production
- Can rollback if needed

## How to Switch to Prisma Migrate

### Step 1: Initialize Migrations (One-time)

On your development machine:

```bash
# This creates a baseline migration from your current schema
npx prisma migrate dev --name initial_migration --schema=packages/db/prisma/schema.prisma
```

This creates migration files in `packages/db/prisma/migrations/`

### Step 2: Update docker-compose.yml

Replace the API command in `docker-compose.yml`:

**Current:**
```yaml
command: sh -c "npx prisma db push --schema=./packages/db/prisma/schema.prisma --skip-generate --accept-data-loss && node apps/api/dist/index.js"
```

**New (Production-safe):**
```yaml
command: sh -c "npx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma && node apps/api/dist/index.js"
```

### Step 3: Creating New Migrations

When you change your schema:

```bash
# On development machine
npx prisma migrate dev --name describe_your_change --schema=packages/db/prisma/schema.prisma
```

Then commit the migration files to git:
```bash
git add packages/db/prisma/migrations/
git commit -m "Add migration for [your change]"
```

### Step 4: Deploying Migrations

When you run `./update-production.sh`, it will:
1. Pull latest code (including new migration files)
2. Rebuild containers
3. Run `prisma migrate deploy` to apply new migrations
4. Start the application

## Prisma Migrate Commands

| Command | When to Use |
|---------|-------------|
| `prisma migrate dev` | Development: creates and applies migrations |
| `prisma migrate deploy` | Production: applies pending migrations only |
| `prisma migrate status` | Check which migrations are pending |
| `prisma migrate resolve` | Mark a migration as applied/rolled back |
| `prisma db push` | Prototyping only (current method) |

## Comparison to Entity Framework

| Entity Framework | Prisma |
|------------------|--------|
| `Add-Migration` | `prisma migrate dev --name` |
| `Update-Database` | `prisma migrate deploy` |
| `Get-Migrations` | `prisma migrate status` |
| Migration files in `Migrations/` | Migration files in `prisma/migrations/` |

## Benefits of Switching

1. **Migration History** - Track all database changes over time
2. **Rollback Capability** - Can revert problematic changes
3. **Team Collaboration** - Migrations are in git, team stays in sync
4. **Production Safety** - Preview changes, no accidental data loss
5. **Audit Trail** - Know exactly when and what changed

## When NOT to Use Migrations

- Quick prototyping on dev database
- Throwaway test databases
- When you want to reset frequently

For these cases, `prisma db push` is fine.
