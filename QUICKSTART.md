# Quick Start Guide

This guide will help you get the Browse Bible and Dashboard features up and running.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Environment variables configured (`.env.local` with `DATABASE_URL`)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

```bash
# Push the schema to your database (includes ScriptureLibrary table)
npm -w @bibleproject/db run db:push

# Seed with sample session data
npm -w @bibleproject/db run db:seed
```

## Step 3: Import Bible Data

You have two options:

### Option A: Test Mode (Recommended First)

Import just 5 books to test the feature:

```bash
npm -w @bibleproject/db run db:seed:bible:test
```

This takes about 2-3 minutes and imports Genesis, Exodus, Leviticus, Numbers, and Deuteronomy.

### Option B: Full Bible Import

Import all 66 books of the Bible:

```bash
npm -w @bibleproject/db run db:seed:bible -- --yes
```

⚠️ **Note**: This takes 10-20 minutes and makes ~1,189 API requests to bible-api.com

### Other Options

```bash
# Import first 10 books only
npm -w @bibleproject/db run db:seed:bible -- --books 10 --yes

# Fast mode (less delay between requests)
npm -w @bibleproject/db run db:seed:bible -- --fast --yes
```

## Step 4: Generate GraphQL Types

```bash
npm run codegen
```

## Step 5: Start Development Servers

```bash
npm run dev
```

This starts:
- Frontend at http://localhost:3000
- GraphQL API at http://localhost:4000/graphql

## Step 6: Try the Features

1. **Sign up** or **log in** at http://localhost:3000
2. Navigate to:
   - **Dashboard**: http://localhost:3000/dashboard
   - **Browse Bible**: http://localhost:3000/bible (Leaders only)

## Features Overview

### Dashboard (`/dashboard`)

**All Users:**
- View session statistics
- Filter sessions (Upcoming, Past, All)
- See participant counts and comment activity

**Leaders:**
- Quick action buttons for creating sessions and browsing Bible
- Analytics on total participants

**Members:**
- Pending invitation notifications
- Join session links

### Browse Bible (`/bible`)

**Browse by Book Tab:**
1. Select a book from the sidebar
2. Select a chapter
3. View all verses in that chapter

**Search Scripture Tab:**
1. Enter a search term (minimum 2 characters)
2. View up to 50 matching passages
3. Results show book, chapter, verse, and content

## Verifying Bible Data

After importing, verify the data in Prisma Studio:

```bash
npm -w @bibleproject/db run db:studio
```

Navigate to the `ScriptureLibrary` table and you should see:
- **Test mode**: ~2,000-3,000 verses (first 5 books)
- **Full import**: ~31,102 verses (entire Bible)

## Troubleshooting

### "No Bible data available" message

**Cause**: ScriptureLibrary table is empty
**Solution**: Run `npm -w @bibleproject/db run db:seed:bible:test` to import Bible data

### Build errors after adding features

**Cause**: GraphQL types not regenerated
**Solution**: Run `npm run codegen` to regenerate types

### API requests failing during Bible import

**Cause**: Network issues or rate limiting
**Solution**: Try again later or use `--books N` to import in smaller batches

### Database connection errors

**Cause**: DATABASE_URL not set correctly
**Solution**: Check your `.env.local` file has a valid PostgreSQL connection string

## Next Steps

- **Create a session** from the dashboard
- **Browse Bible passages** and plan your study sessions
- **Invite members** to join your sessions
- **Start discussions** using the inline commenting feature

For more detailed information, see:
- [CLAUDE.md](./CLAUDE.md) - Full project documentation
- [BIBLE_SEEDING.md](./packages/db/BIBLE_SEEDING.md) - Bible data import details
