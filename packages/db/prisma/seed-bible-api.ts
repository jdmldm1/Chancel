import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Bible Pre-loading Script using Bible API
 *
 * This script fetches Bible passages from the free bible-api.com service
 * and imports them into the ScriptureLibrary table.
 *
 * Usage: npx tsx packages/db/prisma/seed-bible-api.ts
 */

// Bible books in order with their chapter counts
const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis', number: 1, chapters: 50 },
  { name: 'Exodus', number: 2, chapters: 40 },
  { name: 'Leviticus', number: 3, chapters: 27 },
  { name: 'Numbers', number: 4, chapters: 36 },
  { name: 'Deuteronomy', number: 5, chapters: 34 },
  { name: 'Joshua', number: 6, chapters: 24 },
  { name: 'Judges', number: 7, chapters: 21 },
  { name: 'Ruth', number: 8, chapters: 4 },
  { name: '1 Samuel', number: 9, chapters: 31 },
  { name: '2 Samuel', number: 10, chapters: 24 },
  { name: '1 Kings', number: 11, chapters: 22 },
  { name: '2 Kings', number: 12, chapters: 25 },
  { name: '1 Chronicles', number: 13, chapters: 29 },
  { name: '2 Chronicles', number: 14, chapters: 36 },
  { name: 'Ezra', number: 15, chapters: 10 },
  { name: 'Nehemiah', number: 16, chapters: 13 },
  { name: 'Esther', number: 17, chapters: 10 },
  { name: 'Job', number: 18, chapters: 42 },
  { name: 'Psalms', number: 19, chapters: 150 },
  { name: 'Proverbs', number: 20, chapters: 31 },
  { name: 'Ecclesiastes', number: 21, chapters: 12 },
  { name: 'Song of Solomon', number: 22, chapters: 8 },
  { name: 'Isaiah', number: 23, chapters: 66 },
  { name: 'Jeremiah', number: 24, chapters: 52 },
  { name: 'Lamentations', number: 25, chapters: 5 },
  { name: 'Ezekiel', number: 26, chapters: 48 },
  { name: 'Daniel', number: 27, chapters: 12 },
  { name: 'Hosea', number: 28, chapters: 14 },
  { name: 'Joel', number: 29, chapters: 3 },
  { name: 'Amos', number: 30, chapters: 9 },
  { name: 'Obadiah', number: 31, chapters: 1 },
  { name: 'Jonah', number: 32, chapters: 4 },
  { name: 'Micah', number: 33, chapters: 7 },
  { name: 'Nahum', number: 34, chapters: 3 },
  { name: 'Habakkuk', number: 35, chapters: 3 },
  { name: 'Zephaniah', number: 36, chapters: 3 },
  { name: 'Haggai', number: 37, chapters: 2 },
  { name: 'Zechariah', number: 38, chapters: 14 },
  { name: 'Malachi', number: 39, chapters: 4 },

  // New Testament
  { name: 'Matthew', number: 40, chapters: 28 },
  { name: 'Mark', number: 41, chapters: 16 },
  { name: 'Luke', number: 42, chapters: 24 },
  { name: 'John', number: 43, chapters: 21 },
  { name: 'Acts', number: 44, chapters: 28 },
  { name: 'Romans', number: 45, chapters: 16 },
  { name: '1 Corinthians', number: 46, chapters: 16 },
  { name: '2 Corinthians', number: 47, chapters: 13 },
  { name: 'Galatians', number: 48, chapters: 6 },
  { name: 'Ephesians', number: 49, chapters: 6 },
  { name: 'Philippians', number: 50, chapters: 4 },
  { name: 'Colossians', number: 51, chapters: 4 },
  { name: '1 Thessalonians', number: 52, chapters: 5 },
  { name: '2 Thessalonians', number: 53, chapters: 3 },
  { name: '1 Timothy', number: 54, chapters: 6 },
  { name: '2 Timothy', number: 55, chapters: 4 },
  { name: 'Titus', number: 56, chapters: 3 },
  { name: 'Philemon', number: 57, chapters: 1 },
  { name: 'Hebrews', number: 58, chapters: 13 },
  { name: 'James', number: 59, chapters: 5 },
  { name: '1 Peter', number: 60, chapters: 5 },
  { name: '2 Peter', number: 61, chapters: 3 },
  { name: '1 John', number: 62, chapters: 5 },
  { name: '2 John', number: 63, chapters: 1 },
  { name: '3 John', number: 64, chapters: 1 },
  { name: 'Jude', number: 65, chapters: 1 },
  { name: 'Revelation', number: 66, chapters: 22 },
]

interface BibleApiResponse {
  reference: string
  verses: Array<{
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }>
  text: string
  translation_id: string
  translation_name: string
  translation_note: string
}

async function fetchChapter(book: string, chapter: number, retries = 3): Promise<BibleApiResponse | null> {
  const url = `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv`

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url)

      if (response.status === 429) {
        // Rate limited - wait longer and retry
        const waitTime = (attempt + 1) * 2000 // 2s, 4s, 6s
        console.log(`Rate limited, waiting ${waitTime/1000}s...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }

      if (!response.ok) {
        console.error(`Failed to fetch ${book} ${chapter}: ${response.status}`)
        return null
      }

      return await response.json()
    } catch (error) {
      if (attempt === retries - 1) {
        console.error(`Error fetching ${book} ${chapter}:`, error)
        return null
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return null
}

async function seedBibleData(options: { booksLimit?: number; delay?: number; resume?: boolean } = {}) {
  const { booksLimit, delay = 1500, resume = false } = options // Rate limiting: 1.5s between requests (increased from 500ms)

  const booksToProcess = booksLimit ? BIBLE_BOOKS.slice(0, booksLimit) : BIBLE_BOOKS

  console.log(`📚 Starting Bible import...`)
  console.log(`📖 Processing ${booksToProcess.length} books`)

  if (resume) {
    console.log(`♻️  Resume mode: skipping books that already have data`)
  }

  let totalChapters = 0
  let totalVerses = 0
  let errors = 0

  for (const book of booksToProcess) {
    // Check if book already has data (resume mode)
    if (resume) {
      const existingCount = await prisma.scriptureLibrary.count({
        where: { book: book.name }
      })

      if (existingCount > 0) {
        console.log(`\n⏭️  ${book.name} - Skipping (${existingCount} verses already imported)`)
        continue
      }
    }

    console.log(`\n📕 ${book.name} (${book.chapters} chapters)`)

    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      process.stdout.write(`  Chapter ${chapter}/${book.chapters}... `)

      const data = await fetchChapter(book.name, chapter)

      if (!data || !data.verses || data.verses.length === 0) {
        console.log(`❌ Failed`)
        errors++
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // Import each verse
      for (const verse of data.verses) {
        try {
          await prisma.scriptureLibrary.upsert({
            where: {
              book_chapter_verseStart_verseEnd: {
                book: book.name,
                chapter: verse.chapter,
                verseStart: verse.verse,
                verseEnd: verse.verse,
              },
            },
            update: {
              content: verse.text.trim(),
            },
            create: {
              book: book.name,
              bookNumber: book.number,
              chapter: verse.chapter,
              verseStart: verse.verse,
              verseEnd: verse.verse,
              content: verse.text.trim(),
            },
          })
          totalVerses++
        } catch (error) {
          console.error(`\n  Error importing ${book.name} ${chapter}:${verse.verse}:`, error)
          errors++
        }
      }

      totalChapters++
      console.log(`✓ (${data.verses.length} verses)`)

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  console.log(`\n✅ Import complete!`)
  console.log(`📊 Statistics:`)
  console.log(`   - Books: ${booksToProcess.length}`)
  console.log(`   - Chapters: ${totalChapters}`)
  console.log(`   - Verses: ${totalVerses}`)
  if (errors > 0) {
    console.log(`   - Errors: ${errors}`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const options: { booksLimit?: number; delay?: number; resume?: boolean } = {}

  // Parse command line arguments
  if (args.includes('--test')) {
    console.log('🧪 Test mode: importing first 5 books only')
    options.booksLimit = 5
  }

  if (args.includes('--fast')) {
    console.log('⚡ Fast mode: reduced delay between requests')
    options.delay = 1000
  }

  if (args.includes('--resume')) {
    console.log('♻️  Resume mode: skipping books already in database')
    options.resume = true
  }

  const testIndex = args.indexOf('--books')
  if (testIndex !== -1 && args[testIndex + 1]) {
    options.booksLimit = parseInt(args[testIndex + 1])
    console.log(`📚 Limited mode: importing first ${options.booksLimit} books`)
  }

  const delayIndex = args.indexOf('--delay')
  if (delayIndex !== -1 && args[delayIndex + 1]) {
    options.delay = parseInt(args[delayIndex + 1])
    console.log(`⏱️  Custom delay: ${options.delay}ms between requests`)
  }

  console.log(`
╔════════════════════════════════════════════════════════════╗
║           Bible Pre-loading Script (API Mode)              ║
║                                                            ║
║  This will fetch Bible data from bible-api.com            ║
║  and import it into your database.                        ║
║                                                            ║
║  Data source: King James Version (KJV)                    ║
║  Total books: 66 (39 OT + 27 NT)                         ║
║  Total chapters: ~1,189                                   ║
║  Total verses: ~31,102                                    ║
║                                                            ║
║  Note: This may take 10-20 minutes for the full Bible.   ║
║                                                            ║
║  Options:                                                  ║
║    --test         Import first 5 books only (for testing) ║
║    --books N      Import first N books only               ║
║    --resume       Skip books already in database          ║
║    --fast         Reduce delay between requests (1s)      ║
║    --delay N      Custom delay in milliseconds            ║
╚════════════════════════════════════════════════════════════╝
  `)

  if (!args.includes('--yes') && !args.includes('--test')) {
    console.log('⚠️  Warning: This will make ~1,189 API requests.')
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n')
    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  await seedBibleData(options)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding Bible:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
