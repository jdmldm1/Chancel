# Bible Data Seeding Guide

This guide explains how to populate the ScriptureLibrary table with Bible data.

## Quick Start (Recommended)

The easiest way is to use the API-based seed script:

```bash
# Test mode - import first 5 books only (recommended for testing)
npm -w @bibleproject/db run db:seed:bible:test

# Import the entire Bible (takes 10-20 minutes)
npm -w @bibleproject/db run db:seed:bible -- --yes

# Import first 10 books
npm -w @bibleproject/db run db:seed:bible -- --books 10 --yes

# Fast mode (less delay between requests)
npm -w @bibleproject/db run db:seed:bible -- --fast --yes
```

## What the Script Does

- Fetches Bible data from **bible-api.com** (free, no API key needed)
- Uses the **King James Version (KJV)** translation
- Imports all **66 books**, **~1,189 chapters**, and **~31,102 verses**
- Includes rate limiting to be respectful to the API (500ms delay by default)

## Data Source Details

- **API**: https://bible-api.com
- **Translation**: KJV (King James Version)
- **License**: Public domain
- **No API key required**: Completely free

## Alternative: Manual Markdown Import

If you prefer to use markdown files, you can:

### Option 1: Download from Bible repositories

Some public domain Bible repositories:
- https://github.com/scrollmapper/bible_databases
- https://github.com/thiagobodruk/bible
- https://github.com/aruljohn/Bible-kjv

### Option 2: Create your own markdown file

Format:
```markdown
# Genesis 1
1 In the beginning God created the heaven and the earth.
2 And the earth was without form, and void...

# Genesis 2
1 Thus the heavens and the earth were finished...
```

Then use the original script:
```bash
npx tsx packages/db/prisma/seed-bible.ts path/to/bible.md
```

## Verification

After seeding, verify the data:

```bash
# Check how many verses were imported
npx prisma studio

# Or use psql
psql $DATABASE_URL -c "SELECT book, COUNT(*) FROM \"ScriptureLibrary\" GROUP BY book ORDER BY MIN(\"bookNumber\");"
```

## Tips

1. **Start with test mode** to make sure everything works before importing the entire Bible
2. **Be patient** - importing the full Bible takes time due to rate limiting
3. **Check your database size** - the full Bible will add several MB to your database
4. **Use fast mode carefully** - too many requests might get rate-limited by the API

## Troubleshooting

**Problem**: API requests failing
- **Solution**: Check your internet connection, try again later, or use `--fast` mode with fewer books

**Problem**: Script timing out
- **Solution**: Import books in batches using `--books N` option

**Problem**: Duplicate key errors
- **Solution**: The script uses `upsert`, so duplicates should be handled automatically. If issues persist, clear the table first:
  ```sql
  DELETE FROM "ScriptureLibrary";
  ```

## Example Usage Workflow

```bash
# 1. Test with a few books first
cd /path/to/BibleStudy
npm -w @bibleproject/db run db:seed:bible:test

# 2. If that works, import the entire Bible
npm -w @bibleproject/db run db:seed:bible -- --yes

# 3. Verify in Prisma Studio
npm -w @bibleproject/db run db:studio
```

## Statistics

After importing the full Bible, you should see:
- **Old Testament**: 39 books, 929 chapters, ~23,145 verses
- **New Testament**: 27 books, 260 chapters, ~7,957 verses
- **Total**: 66 books, 1,189 chapters, ~31,102 verses
