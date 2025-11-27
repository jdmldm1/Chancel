'use client'

import { useState } from 'react'
import { GetSessionQuery } from '@bibleproject/types/src/graphql'
import CommentSection from './CommentSection'

type ScripturePassage = NonNullable<GetSessionQuery['session']>['scripturePassages'][0]

interface ScripturePassageCardProps {
  passage: ScripturePassage
  sessionId: string
  canComment: boolean
}

export default function ScripturePassageCard({
  passage,
  sessionId,
  canComment,
}: ScripturePassageCardProps) {
  const [showComments, setShowComments] = useState(false)

  const reference = `${passage.book} ${passage.chapter}:${passage.verseStart}${
    passage.verseEnd ? `-${passage.verseEnd}` : ''
  }`

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Scripture Header */}
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h3 className="text-xl font-semibold text-blue-900">{reference}</h3>
      </div>

      {/* Scripture Content */}
      <div className="px-6 py-6">
        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
          {passage.content}
        </p>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
        >
          <span>
            {passage.comments.length} {passage.comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${showComments ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showComments && (
          <div className="px-6 py-4 bg-gray-50">
            <CommentSection
              comments={passage.comments}
              passageId={passage.id}
              sessionId={sessionId}
              canComment={canComment}
            />
          </div>
        )}
      </div>
    </div>
  )
}
