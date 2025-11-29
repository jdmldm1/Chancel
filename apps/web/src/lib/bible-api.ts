/**
 * Bible API Service Layer
 *
 * This service provides access to Bible verses using bible-api.com
 * which is a free, open-source Bible API with no authentication required.
 *
 * For future enhancement, you can switch to API.Bible for multiple translations.
 */

export interface BibleVerse {
  book_id: string
  book_name: string
  chapter: number
  verse: number
  text: string
}

export interface BiblePassage {
  reference: string
  verses: BibleVerse[]
  text: string
  translation_id: string
  translation_name: string
  translation_note: string
}

export interface BibleApiError {
  error: string
  message: string
}

/**
 * Fetch a Bible passage from bible-api.com
 *
 * @param book - Book name (e.g., "John", "Genesis", "1 Corinthians")
 * @param chapter - Chapter number
 * @param verseStart - Starting verse number
 * @param verseEnd - Optional ending verse number for a range
 * @param translation - Bible translation (default: "web" for World English Bible)
 * @returns Promise with the Bible passage data
 *
 * @example
 * // Fetch a single verse
 * const verse = await fetchBiblePassage("John", 3, 16)
 *
 * // Fetch a range of verses
 * const passage = await fetchBiblePassage("John", 3, 16, 18)
 */
export async function fetchBiblePassage(
  book: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number,
  translation: string = 'web'
): Promise<BiblePassage> {
  try {
    // Build the reference string (e.g., "John 3:16" or "John 3:16-18")
    const verseRange = verseEnd ? `${verseStart}-${verseEnd}` : `${verseStart}`
    const reference = `${book} ${chapter}:${verseRange}`

    // bible-api.com uses a simple REST endpoint
    // For other translations, you can append ?translation=kjv, etc.
    const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache for 1 hour (Bible text doesn't change)
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Bible passage: ${response.statusText}`)
    }

    const data: BiblePassage = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Bible passage:', error)
    throw error
  }
}

/**
 * Format Bible verses for display
 *
 * @param passage - Bible passage data from the API
 * @returns Array of verses with verse numbers and text
 */
export function formatPassageForDisplay(passage: BiblePassage) {
  return passage.verses.map(verse => ({
    verseNumber: verse.verse,
    text: verse.text,
    reference: `${verse.book_name} ${verse.chapter}:${verse.verse}`
  }))
}

/**
 * Get supported Bible translations
 *
 * bible-api.com supports several translations including:
 * - web (World English Bible) - Default, public domain
 * - kjv (King James Version)
 * - bbe (Bible in Basic English)
 * - oeb-cw (Open English Bible, Commonwealth)
 * - oeb-us (Open English Bible, US)
 * - webbe (World English Bible British Edition)
 * - wmbb (World Messianic Bible British Edition)
 * - clementine (Clementine Latin Vulgate)
 */
export const SUPPORTED_TRANSLATIONS = [
  { id: 'web', name: 'World English Bible', language: 'English' },
  { id: 'kjv', name: 'King James Version', language: 'English' },
  { id: 'bbe', name: 'Bible in Basic English', language: 'English' },
  { id: 'oeb-cw', name: 'Open English Bible (Commonwealth)', language: 'English' },
  { id: 'oeb-us', name: 'Open English Bible (US)', language: 'English' },
  { id: 'webbe', name: 'World English Bible British Edition', language: 'English' },
] as const

export type BibleTranslationId = typeof SUPPORTED_TRANSLATIONS[number]['id']

/**
 * Validate book name
 * Returns a standardized book name or throws an error
 */
export function validateBookName(book: string): string {
  // Common book abbreviations and their full names
  const bookAbbreviations: Record<string, string> = {
    'gen': 'Genesis',
    'exo': 'Exodus',
    'lev': 'Leviticus',
    'num': 'Numbers',
    'deu': 'Deuteronomy',
    'joh': 'John',
    '1co': '1 Corinthians',
    '2co': '2 Corinthians',
    // Add more as needed
  }

  const normalizedBook = book.toLowerCase().trim()
  return bookAbbreviations[normalizedBook] || book
}
