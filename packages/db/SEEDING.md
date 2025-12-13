# Database Seeding Guide

This document explains how to seed your Chancel database with Bible study plans and scripture data.

## Overview

Chancel offers two seeding scripts for creating study content:

1. **Canonical Bible Study** (`seed.ts`) - 52-week journey through the entire Bible
2. **Additional Studies** (`seed-studies.ts`) - Topical, book, character, and thematic studies

Both scripts accept a year parameter and are non-destructive, allowing you to seed multiple years.

## Canonical Bible Study Plan (52 weeks)

The main seed script (`prisma/seed.ts`) creates a complete 52-week canonical Bible study plan for any specified year.

### Features

- **52 Weekly Sessions**: Covers the entire Bible from Genesis to Revelation
- **4 Quarterly Series**:
  1. Foundations: In the Beginning (Weeks 1-13)
  2. Kingdom & Wisdom: Judges to Songs (Weeks 14-26)
  3. Prophets: Voices of Warning & Hope (Weeks 27-39)
  4. New Covenant: The Messiah & His Church (Weeks 40-52)
- **Automatic Date Calculation**: Finds the first Sunday of the specified year as the start date
- **Detailed Reading Notes**: Each week includes contextual notes for the passages
- **Non-Destructive**: Can be run multiple times with different years without conflicts

### Usage

```bash
# Seed a specific year
npm -w @bibleproject/db run db:seed 2024
npm -w @bibleproject/db run db:seed 2025
npm -w @bibleproject/db run db:seed 2026

# If no year is specified, uses the current year
npm -w @bibleproject/db run db:seed
```

### What Gets Created

For each year, the script creates:
- 4 Series records (one for each quarter)
- 52 Session records (one for each week)
- ~1,189 ScripturePassage records (one per chapter in the Bible)
- Test users (if they don't already exist):
  - Leader: `leader@example.com` / `password`
  - Member 1: `member1@example.com` / `password`
  - Member 2: `member2@example.com` / `password`

### Example Output

```
🌱 Starting database seed for year 2024...
✅ Leader user already exists
📖 Creating year-long Bible study series for 2024...
   First Sunday: 2024-01-07
✅ Created series: Foundations: In the Beginning (2024)
✅ Created 13 sessions for Foundations: In the Beginning
✅ Created series: Kingdom & Wisdom: Judges to Songs (2024)
✅ Created 13 sessions for Kingdom & Wisdom: Judges to Songs
✅ Created series: Prophets: Voices of Warning & Hope (2024)
✅ Created 13 sessions for Prophets: Voices of Warning & Hope
✅ Created series: New Covenant: The Messiah & His Church (2024)
✅ Created 13 sessions for New Covenant: The Messiah & His Church
✅ Created all 52 weekly sessions for 2024

📚 One Year Canonical Bible Study
Year: 2024
Total: 52 weekly sessions across 4 quarterly series
Starting: 2024-01-07 (Week 1)
Ending: 2025-01-04 (Week 52)

💡 To add another year, run: npm run db:seed <year>
```

### Duplicate Prevention

The script checks if sessions already exist for the specified year and skips seeding if found:

```
⚠️  Found 52 existing sessions for 2024. Skipping to avoid duplicates.
   To reseed 2024, manually delete sessions for that year first.
```

### Bible Study Plan Structure

Each week includes specific books and chapters with contextual notes:

**Week 1**: Genesis 1-11 (Creation, Fall, and the Flood)
**Week 2**: Genesis 12-25 (Abraham's call and covenant)
**Week 3**: Genesis 26-36 (Isaac and Jacob)
...continuing through...
**Week 52**: Revelation 1-22 (The grand finale)

## Additional Study Plans (73 sessions)

The additional studies script (`prisma/seed-studies.ts`) creates focused, topical studies for any specified year.

### Features

- **13 Study Series**: 73 total sessions across multiple study types
- **Variety of Formats**: Topical, book, character, and thematic studies
- **Thoughtful Notes**: Each session includes detailed theological notes
- **Flexible Scheduling**: Sessions are scheduled sequentially starting from the first Sunday of the year
- **Non-Destructive**: Can be run multiple times with different years

### Usage

```bash
# Seed additional studies for a specific year
npm -w @bibleproject/db run db:seed:studies 2024
npm -w @bibleproject/db run db:seed:studies 2025
npm -w @bibleproject/db run db:seed:studies 2026
```

### What Gets Created

**Topical Studies (4 series, 26 sessions):**
1. **Prayer: Conversations with God** (8 weeks) - The Lord's Prayer, prayer in the garden, bold prayer, praying Scripture, intercession, prayer and fasting, the prayer of faith, praying in the Spirit
2. **Marriage and Family: God's Design** (6 weeks) - The first marriage, love in action, the love chapter, parenting with purpose, discipline and grace, building a Christ-centered home
3. **Faith and Doubt: Believing God** (6 weeks) - Defining faith, Abraham's faith, Thomas' honest doubt, the centurion's great faith, Peter walking on water, faith that works
4. **The Holy Spirit: God's Power in Us** (6 weeks) - The promise of the Spirit, Pentecost, filled with the Spirit, fruit of the Spirit, spiritual gifts, led by the Spirit

**Book Studies (4 series, 17 sessions):**
1. **Philippians: Joy in All Circumstances** (4 weeks) - Partnership in the gospel, the mind of Christ, knowing Christ, contentment and peace
2. **James: Faith That Works** (5 weeks) - Trials and temptations, favoritism and faith, taming the tongue, humility and submission, patience and prayer
3. **Jonah: The Reluctant Prophet** (4 weeks) - Running from God, prayer from the depths, obedience and revival, God's compassion
4. **Ruth: Loyalty and Redemption** (4 weeks) - Tragedy and loyalty, working in the field, at the threshing floor, redemption accomplished

**Character Studies (3 series, 18 sessions):**
1. **David: A Man After God's Heart** (6 weeks) - Anointed as a boy, facing giants, friendship and covenant, sparing Saul, David's fall, Psalm 51
2. **Paul: From Persecutor to Apostle** (6 weeks) - Saul the persecutor, Damascus road encounter, called to the Gentiles, thorn in the flesh, running the race, finishing well
3. **Moses: Leader and Deliverer** (6 weeks) - The burning bush, confronting Pharaoh, the Passover and Exodus, receiving the Law, the golden calf, forbidden to enter

**Thematic Studies (2 series, 12 sessions):**
1. **The Covenant: God's Promises Through History** (6 weeks) - Creation covenant, Noahic covenant, Abrahamic covenant, Mosaic covenant, Davidic covenant, New covenant
2. **The Kingdom of God: Already and Not Yet** (6 weeks) - The Kingdom announced, Kingdom parables, Sermon on the Mount, the Kingdom in power, the Kingdom through the cross, the Kingdom consummated

### Example Output

```
🌱 Seeding additional Bible study plans for 2024...

📚 Creating 13 study series for 2024...
   Start date reference: 2024-01-07
✅ Created "Prayer: Conversations with God" - 8 sessions
✅ Created "Marriage and Family: God's Design" - 6 sessions
✅ Created "Faith and Doubt: Believing God" - 6 sessions
✅ Created "The Holy Spirit: God's Power in Us" - 6 sessions
✅ Created "Philippians: Joy in All Circumstances" - 4 sessions
✅ Created "James: Faith That Works" - 5 sessions
✅ Created "Jonah: The Reluctant Prophet" - 4 sessions
✅ Created "Ruth: Loyalty and Redemption" - 4 sessions
✅ Created "David: A Man After God's Heart" - 6 sessions
✅ Created "Paul: From Persecutor to Apostle" - 6 sessions
✅ Created "Moses: Leader and Deliverer" - 6 sessions
✅ Created "The Covenant: God's Promises Through History" - 6 sessions
✅ Created "The Kingdom of God: Already and Not Yet" - 6 sessions

✅ Successfully created 73 additional study sessions for 2024

📖 Study Types Added:
   - Topical Studies: 4 series
   - Book Studies: 4 series
   - Character Studies: 3 series
   - Thematic Studies: 2 series
```

### Duplicate Prevention

Like the canonical seed script, this script checks if series already exist for the specified year:

```
⚠️  Series "Prayer: Conversations with God (2024)" already exists. Skipping.
```

## Bible Text Seeding

For importing the actual Bible text (verses), see [BIBLE_SEEDING.md](./BIBLE_SEEDING.md).

### Quick Reference

```bash
# Import test data (5 books)
npm -w @bibleproject/db run db:seed:bible:test

# Import full Bible (all 66 books)
npm -w @bibleproject/db run db:seed:bible -- --yes
```

## Recommended Seeding Workflow

1. **Push database schema**:
   ```bash
   npm -w @bibleproject/db run db:push
   ```

2. **Seed canonical Bible study plans for multiple years**:
   ```bash
   npm -w @bibleproject/db run db:seed 2024
   npm -w @bibleproject/db run db:seed 2025
   npm -w @bibleproject/db run db:seed 2026
   ```

3. **Seed additional study plans for multiple years**:
   ```bash
   npm -w @bibleproject/db run db:seed:studies 2024
   npm -w @bibleproject/db run db:seed:studies 2025
   npm -w @bibleproject/db run db:seed:studies 2026
   ```

4. **Import Bible text** (optional, for Bible browser feature):
   ```bash
   npm -w @bibleproject/db run db:seed:bible:test  # Test with 5 books
   # OR
   npm -w @bibleproject/db run db:seed:bible -- --yes  # Full Bible
   ```

5. **Create admin user** (optional):
   ```bash
   node create_admin.js
   ```
   Credentials: `admin@example.com` / `admin123`

### Summary

After completing the workflow above, you'll have:
- **52 sessions/year** from the canonical Bible study plan
- **73 sessions/year** from additional topical, book, character, and thematic studies
- **Total: 125 study sessions per year**
- Full Bible text in the ScriptureLibrary table (if imported)
- Admin access for platform management

## Database Management

```bash
# View database in GUI
npm -w @bibleproject/db run db:studio

# Reset database (warning: deletes all data)
npm -w @bibleproject/db run db:push --force-reset

# Create new migration
npm -w @bibleproject/db run db:migrate
```

## Troubleshooting

### "Invalid year" Error

Make sure you provide a valid year between 2000 and 2100:
```bash
npm -w @bibleproject/db run db:seed 2024  # ✅ Valid
npm -w @bibleproject/db run db:seed 1999  # ❌ Too old
npm -w @bibleproject/db run db:seed xyz   # ❌ Not a number
```

### "Environment variable not found: DATABASE_URL"

Ensure your `.env` file exists and contains:
```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/bibleproject?schema=public"
```

### Sessions Already Exist

If you need to re-seed a year, manually delete the sessions for that year first:
1. Open Prisma Studio: `npm -w @bibleproject/db run db:studio`
2. Navigate to Session table
3. Filter by year in the startDate field
4. Delete the sessions
5. Re-run the seed script

## Next Steps

After seeding:
- Start the development server: `npm run dev`
- Visit the dashboard: http://localhost:3000/dashboard
- Browse available sessions
- Join sessions as a member or create new ones as a leader
