# How to Run BibleProject

## Quick Summary

The boilerplate code is ready to run! Here are the essential steps:

### Step 1: Install Dependencies (Running Now)
```bash
npm install
```
This installs everything needed for the project.

### Step 2: Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bibleproject?schema=public"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Start PostgreSQL (Choose One)

**Using Docker (Easiest):**
```bash
docker run -d \
  --name bibleproject-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bibleproject \
  -p 5432:5432 \
  postgres:15-alpine
```

**Or using local PostgreSQL:**
- Install PostgreSQL
- Create database: `createdb bibleproject`
- Update `DATABASE_URL` in `.env.local`

### Step 4: Push Database Schema
```bash
npm run db:push
```

### Step 5: Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser!

---

## What You'll See

A home page with:
- "BibleProject" title
- "Collaborative group Bible study platform" description
- Sign In and Sign Up buttons

The app is fully typed with TypeScript and uses:
- **Next.js 14** for the frontend
- **Tailwind CSS** for styling
- **Prisma** as the ORM
- **PostgreSQL** as the database

## What's Already Set Up

✅ Monorepo structure with Turbo
✅ TypeScript everywhere
✅ Database schema (Users, Sessions, Comments, Scripture, Resources, etc.)
✅ Tailwind CSS + custom UI components
✅ Authentication utilities (password hashing, validation)
✅ Shared types package
✅ Environment configuration

## Next Phase

Once the app is running, the next phase is:
- **Implement NextAuth.js** - User login/signup
- **Create user management pages** - Profile, role assignment
- **Build session management** - Leaders can create study sessions
- **Add scripture display** - View passages with verse-level comments

See [TODO.md](./TODO.md) for the full list of remaining features.

---

## Troubleshooting

**"npm install" fails?**
- Make sure Node.js 18+ is installed: `node --version`

**"Cannot connect to database"?**
- Make sure PostgreSQL is running
- Verify `DATABASE_URL` in `.env.local`

**"Port 3000 already in use"?**
- Run on different port: `npm run dev -- -p 3001`

**"Prisma push fails"?**
- Make sure the database exists and `DATABASE_URL` is correct
- Check PostgreSQL is running: `psql -U postgres -d bibleproject -c "SELECT 1"`

See [GETTING_STARTED.md](./GETTING_STARTED.md) for more detailed setup information.
