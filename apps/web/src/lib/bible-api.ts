/**
 * Bible API Service Layer
 *
 * This service provides access to Bible verses using bible-api.com
 * which is a free, open-source Bible API with no authentication required.
 *
 * Requests are proxied through the Next.js /api/bible route to avoid CORS issues
 * when fetching from the browser.
 *
 * All requests are queued to avoid rate limiting (429 errors).
 *
 * For future enhancement, you can switch to API.Bible for multiple translations.
 */

import { bibleApiQueue } from './request-queue'

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
 * Retry helper function for API requests
 */
async function retryFetch(
  url: string,
  options: RequestInit,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // If successful or client error (4xx), return immediately
      // Only retry on server errors (5xx) or network errors
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response
      }

      // Server error, retry
      lastError = new Error(`Server error: ${response.status}`)
    } catch (error) {
      lastError = error as Error
    }

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
    }
  }

  throw lastError || new Error('Failed to fetch after retries')
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
  // Queue the request to avoid rate limiting
  return bibleApiQueue.enqueue(async () => {
    try {
      // Build the reference string
      // If verseEnd is provided, fetch a range (e.g., "John 3:16-18")
      // If only verseStart is 1 and no verseEnd, fetch entire chapter (e.g., "John 3")
      // Otherwise fetch a single verse (e.g., "John 3:16")
      let reference: string
      if (verseEnd) {
        // Verse range
        reference = `${book} ${chapter}:${verseStart}-${verseEnd}`
      } else if (verseStart === 1) {
        // Entire chapter (when verseStart is 1 and no verseEnd)
        reference = `${book} ${chapter}`
      } else {
        // Single verse
        reference = `${book} ${chapter}:${verseStart}`
      }

      // Use the Next.js API proxy to avoid CORS issues
      // The proxy forwards requests to bible-api.com from the server side
      const url = `/api/bible?reference=${encodeURIComponent(reference)}&translation=${translation}`

      const response = await retryFetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Use default cache but allow revalidation on errors
        // This prevents caching failed requests
        cache: 'default',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch Bible passage (${response.status}): ${errorText || response.statusText}`)
      }

      const data: BiblePassage = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching Bible passage:', error)
      throw error
    }
  })
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
