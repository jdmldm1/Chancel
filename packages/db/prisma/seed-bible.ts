import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

/**
 * Bible Pre-loading Script
 *
 * This script imports Bible passages from markdown files into the database.
 *
 * Expected markdown format:
 * # Book Chapter
 * 1 Verse text here
 * 2 More verse text
 *
 * OR
 *
 * # Book Chapter:VerseStart-VerseEnd
 * Content without verse numbers (entire passage)
 */

interface BiblePassage {
  book: string
  chapter: number
  verseStart: number
  verseEnd?: number
  content: string
}

/**
 * Parse a markdown file containing Bible passages
 * @param filePath Path to the markdown file
 * @returns Array of Bible passages
 */
function parseMarkdownBible(filePath: string): BiblePassage[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const passages: BiblePassage[] = []

  // Split by headings (## or #)
  const sections = content.split(/^##? /gm).filter(s => s.trim())

  for (const section of sections) {
    const lines = section.split('\n')
    const header = lines[0].trim()

    // Parse header: "Genesis 1" or "Genesis 1:1-5"
    const match = header.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/)
    if (!match) continue

    const book = match[1].trim()
    const chapter = parseInt(match[2])
    const verseStart = match[3] ? parseInt(match[3]) : 1
    const verseEnd = match[4] ? parseInt(match[4]) : undefined

    // Get content (everything after the header)
    const passageContent = lines.slice(1).join('\n').trim()

    if (passageContent) {
      passages.push({
        book,
        chapter,
        verseStart,
        verseEnd,
        content: passageContent
      })
    }
  }

  return passages
}

/**
 * Import Bible passages into a ScriptureLibrary table (new table to create)
 * This stores all Bible verses for easy reference
 */
async function seedBibleLibrary(bibleFilePath: string) {
  console.log('🔍 Parsing Bible markdown file...')
  const passages = parseMarkdownBible(bibleFilePath)

  console.log(`📚 Found ${passages.length} passages to import`)

  // Note: You'll need to create a ScriptureLibrary table in your schema
  // For now, this is a placeholder showing the structure

  console.log('\n⚠️  To use this feature, add this to your schema.prisma:')
  console.log(`
model ScriptureLibrary {
  id         String   @id @default(cuid())
  book       String
  chapter    Int
  verseStart Int
  verseEnd   Int?
  content    String   @db.Text
  createdAt  DateTime @default(now())

  @@unique([book, chapter, verseStart, verseEnd])
  @@index([book, chapter])
}
  `)

  // Uncomment this once you've added the table to schema:
  /*
  for (const passage of passages) {
    await prisma.scriptureLibrary.upsert({
      where: {
        book_chapter_verseStart_verseEnd: {
          book: passage.book,
          chapter: passage.chapter,
          verseStart: passage.verseStart,
          verseEnd: passage.verseEnd || passage.verseStart
        }
      },
      update: {
        content: passage.content
      },
      create: passage
    })
  }

  console.log('✅ Bible library seeded successfully!')
  */
}

async function main() {
  const bibleFilePath = process.argv[2]

  if (!bibleFilePath) {
    console.log('Usage: tsx prisma/seed-bible.ts <path-to-bible-markdown>')
    console.log('\nExample:')
    console.log('  tsx prisma/seed-bible.ts ./data/bible.md')
    process.exit(1)
  }

  if (!fs.existsSync(bibleFilePath)) {
    console.error(`❌ File not found: ${bibleFilePath}`)
    process.exit(1)
  }

  await seedBibleLibrary(bibleFilePath)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding Bible:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
