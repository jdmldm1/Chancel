# Quick Start - Run BibleProject in 5 Minutes

## ✅ Step 1: Dependencies Installed

Dependencies are already installed! You have 410 packages ready to go.

## ✅ Step 2: Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bibleproject?schema=public"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
```

## ✅ Step 3: Start PostgreSQL

Choose one option:

### Option A: Docker (Recommended)
```bash
docker run -d \
  --name bibleproject-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bibleproject \
  -p 5432:5432 \
  postgres:15-alpine
```

### Option B: Local PostgreSQL
- Install PostgreSQL
- Run: `createdb bibleproject`
- Update `DATABASE_URL` in `.env.local`

## ✅ Step 4: Push Database Schema

```bash
npm run db:push
```

This creates all tables in your database based on the Prisma schema.

## ✅ Step 5: Run the App

```bash
npm run dev
```

Open **http://localhost:3000** in your browser!

---

## What You'll See

A landing page with:
- BibleProject title
- Signup and Login buttons
- Clean, modern design

## Next Commands You Might Need

```bash
# View database in GUI
npm run db:studio

# Check for TypeScript errors
npm run type-check

# Format code
npm run format

# Build for production
npm run build
```

## Troubleshooting

**Can't connect to database?**
- Make sure PostgreSQL is running
- Verify `DATABASE_URL` in `.env.local`
- Try: `psql -U postgres -d bibleproject -c "SELECT 1"`

**Port 3000 in use?**
- Run on different port: `npm run dev -- -p 3001`

**Prisma error?**
- Make sure database exists
- Check DATABASE_URL is correct
- Run: `npm run db:push` again

---

That's it! You're up and running. Check [TODO.md](./TODO.md) for what to build next.
