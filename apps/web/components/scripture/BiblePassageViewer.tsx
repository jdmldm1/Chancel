'use client'

import React, { useEffect, useState } from 'react'
import { fetchBiblePassage, formatPassageForDisplay, BibleTranslationId } from '@/src/lib/bible-api'

interface BiblePassageViewerProps {
  book: string
  chapter: number
  verseStart: number
  verseEnd?: number
  translation?: BibleTranslationId
  onVerseClick?: (verseNumber: number) => void
  highlightedVerses?: number[]
}

export default function BiblePassageViewer({
  book,
  chapter,
  verseStart,
  verseEnd,
  translation = 'web',
  onVerseClick,
  highlightedVerses = []
}: BiblePassageViewerProps) {
  const [verses, setVerses] = useState<Array<{ verseNumber: number; text: string; reference: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState('')

  useEffect(() => {
    const loadPassage = async () => {
      setLoading(true)
      setError(null)

      try {
        const passage = await fetchBiblePassage(book, chapter, verseStart, verseEnd, translation)
        const formattedVerses = formatPassageForDisplay(passage)
        setVerses(formattedVerses)
        setReference(passage.reference)
      } catch (err) {
        console.error('Failed to load Bible passage:', err)
        setError('Failed to load Bible passage. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadPassage()
  }, [book, chapter, verseStart, verseEnd, translation])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Loading scripture...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
        <p className="text-sm text-red-600 mt-2">
          Reference: {book} {chapter}:{verseStart}{verseEnd ? `-${verseEnd}` : ''}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {reference}
      </h3>

      <div className="space-y-3">
        {verses.map(({ verseNumber, text }) => {
          const isHighlighted = highlightedVerses.includes(verseNumber)

          return (
            <div
              key={verseNumber}
              className={`group flex gap-3 p-2 rounded transition-colors ${
                isHighlighted ? 'bg-yellow-50 border-l-4 border-yellow-400 pl-3' : 'hover:bg-gray-50'
              } ${onVerseClick ? 'cursor-pointer' : ''}`}
              onClick={() => onVerseClick?.(verseNumber)}
            >
              <span className="text-sm font-bold text-gray-500 min-w-[2rem] flex-shrink-0">
                {verseNumber}
              </span>
              <p className="text-gray-800 leading-relaxed flex-1">
                {text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
