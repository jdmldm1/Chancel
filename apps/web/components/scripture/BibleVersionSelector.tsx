'use client'

import React from 'react'
import { SUPPORTED_TRANSLATIONS, BibleTranslationId } from '@/src/lib/bible-api'

interface BibleVersionSelectorProps {
  selectedVersion: BibleTranslationId
  onVersionChange: (version: BibleTranslationId) => void
  className?: string
}

export default function BibleVersionSelector({
  selectedVersion,
  onVersionChange,
  className = ''
}: BibleVersionSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="bible-version" className="text-sm font-medium text-gray-700">
        Translation:
      </label>
      <select
        id="bible-version"
        value={selectedVersion}
        onChange={(e) => onVersionChange(e.target.value as BibleTranslationId)}
        className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5 px-2"
      >
        {SUPPORTED_TRANSLATIONS.map((translation) => (
          <option key={translation.id} value={translation.id}>
            {translation.name}
          </option>
        ))}
      </select>
    </div>
  )
}
