'use client'

import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetSessionQuery
} from '@bibleproject/types/src/graphql'

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      createdAt
      verseNumber
      user {
        id
        name
      }
      passageId
      sessionId
      parentId
    }
  }
`

type ScripturePassage = NonNullable<GetSessionQuery['session']>['scripturePassages'][0]
type Comment = ScripturePassage['comments'][0]

interface VerseData {
  number: number
  text: string
  comments: Comment[]
}

interface VerseByVersePassageProps {
  passage: ScripturePassage
  sessionId: string
  canComment: boolean
}

// Parse scripture content into individual verses
function parseVerses(passage: ScripturePassage): VerseData[] {
  const verses: VerseData[] = []
  const lines = passage.content.split('\n')

  let currentVerseNumber = passage.verseStart
  let currentVerseText = ''

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    // Check if line starts with a verse number pattern (e.g., "1 " or "1. ")
    const verseMatch = trimmedLine.match(/^(\d+)[.\s]+(.*)/)

    if (verseMatch) {
      // Save previous verse if exists
      if (currentVerseText) {
        const verseComments = passage.comments.filter(c => c.verseNumber === currentVerseNumber)
        verses.push({
          number: currentVerseNumber,
          text: currentVerseText.trim(),
          comments: verseComments
        })
      }

      // Start new verse
      currentVerseNumber = parseInt(verseMatch[1])
      currentVerseText = verseMatch[2]
    } else {
      // Continue current verse
      currentVerseText += ' ' + trimmedLine
    }
  }

  // Add last verse
  if (currentVerseText) {
    const verseComments = passage.comments.filter(c => c.verseNumber === currentVerseNumber)
    verses.push({
      number: currentVerseNumber,
      text: currentVerseText.trim(),
      comments: verseComments
    })
  }

  return verses
}

export default function VerseByVersePassage({
  passage,
  sessionId,
  canComment,
}: VerseByVersePassageProps) {
  const { data: session } = useSession()
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)
  const [newComment, setNewComment] = useState('')

  const verses = parseVerses(passage)

  const [createComment, { loading }] = useMutation<CreateCommentMutation, CreateCommentMutationVariables>(
    CREATE_COMMENT,
    {
      refetchQueries: ['GetSession'],
      onCompleted: () => {
        setNewComment('')
        setSelectedVerse(null)
      },
    }
  )

  const handleSubmitComment = async (verseNumber: number) => {
    if (!newComment.trim() || !session) return

    await createComment({
      variables: {
        input: {
          content: newComment.trim(),
          passageId: passage.id,
          sessionId,
          verseNumber,
          parentId: null,
        },
      },
    })
  }

  const reference = `${passage.book} ${passage.chapter}`

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Scripture Header */}
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h3 className="text-xl font-semibold text-blue-900">{reference}</h3>
      </div>

      {/* Verse-by-Verse Display */}
      <div className="px-6 py-6">
        {verses.map((verse) => (
          <div key={verse.number} className="mb-6 last:mb-0">
            {/* Verse Row */}
            <div className="flex items-start gap-4 group">
              {/* Verse Number */}
              <div className="flex-shrink-0 w-12 text-right">
                <span className="text-sm font-semibold text-blue-600">{verse.number}</span>
              </div>

              {/* Verse Text */}
              <div className="flex-1">
                <p className="text-gray-800 text-base leading-relaxed">
                  {verse.text}
                </p>

                {/* Comment Button & Count */}
                <div className="mt-2 flex items-center gap-3">
                  {canComment && (
                    <button
                      onClick={() => setSelectedVerse(selectedVerse === verse.number ? null : verse.number)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {selectedVerse === verse.number ? 'Cancel' : 'Comment'}
                    </button>
                  )}

                  {verse.comments.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {verse.comments.length} {verse.comments.length === 1 ? 'comment' : 'comments'}
                    </span>
                  )}
                </div>

                {/* Comment Form */}
                {selectedVerse === verse.number && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={`Comment on verse ${verse.number}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedVerse(null)}
                        className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitComment(verse.number)}
                        disabled={loading || !newComment.trim()}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Comments */}
                {verse.comments.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {verse.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-900">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
