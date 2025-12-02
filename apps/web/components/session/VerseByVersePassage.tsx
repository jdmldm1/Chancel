'use client'

import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetSessionQuery
} from '@bibleproject/types/src/graphql'
import CommentItem from './CommentItem'
import { fetchBiblePassage, BibleTranslationId } from '@/src/lib/bible-api'
import BibleVersionSelector from '../scripture/BibleVersionSelector'
import AIInsightsModal from '../scripture/AIInsightsModal'
import { Sparkles } from 'lucide-react'

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

type SortOption = 'newest' | 'oldest'

export default function VerseByVersePassage({
  passage,
  sessionId,
  canComment,
}: VerseByVersePassageProps) {
  const { data: session } = useSession()
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)
  const [newComment, setNewComment] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('oldest')
  const [bibleTranslation, setBibleTranslation] = useState<BibleTranslationId>('web')
  const [verses, setVerses] = useState<VerseData[]>([])
  const [loadingVerses, setLoadingVerses] = useState(true)
  const [versesError, setVersesError] = useState<string | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)

  // Fetch verses from Bible API
  useEffect(() => {
    const loadVerses = async () => {
      setLoadingVerses(true)
      setVersesError(null)

      try {
        const biblePassage = await fetchBiblePassage(
          passage.book,
          passage.chapter,
          passage.verseStart,
          passage.verseEnd || undefined,
          bibleTranslation
        )

        // Map API verses to our VerseData format with comments
        const versesWithComments: VerseData[] = biblePassage.verses.map(v => ({
          number: v.verse,
          text: v.text,
          comments: passage.comments.filter(c => c.verseNumber === v.verse)
        }))

        setVerses(versesWithComments)
      } catch (error) {
        console.error('Failed to load Bible verses:', error)
        setVersesError('Failed to load scripture from Bible API')
      } finally {
        setLoadingVerses(false)
      }
    }

    loadVerses()
  }, [passage.book, passage.chapter, passage.verseStart, passage.verseEnd, bibleTranslation, passage.comments])

  const sortComments = (comments: Comment[]) => {
    return [...comments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })
  }

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

  // Get full passage text for AI
  const fullPassageText = verses.map(v => `${v.number}. ${v.text}`).join(' ')

  if (loadingVerses) {
    return (
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-smooth hover:shadow-xl">
        <div className="px-6 py-8 flex items-center justify-center">
          <div className="text-gray-600">Loading scripture...</div>
        </div>
      </div>
    )
  }

  if (versesError) {
    return (
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-smooth hover:shadow-xl">
        <div className="px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{versesError}</p>
            <p className="text-sm text-red-600 mt-2">Reference: {reference}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-smooth hover:shadow-xl">
      {/* Scripture Header */}
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-blue-900">{reference}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
            title="Get AI insights on this passage"
          >
            <Sparkles className="w-4 h-4" />
            AI Insights
          </button>
          <BibleVersionSelector
            selectedVersion={bibleTranslation}
            onVersionChange={setBibleTranslation}
          />
        </div>
      </div>

      {/* Leader's Note */}
      {passage.note && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 px-6 py-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Leader's Note:</p>
              <p className="mt-1 text-sm text-yellow-700 whitespace-pre-wrap">{passage.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Verse-by-Verse Display */}
      <div className="px-6 py-6">
        {verses.map((verse, index) => (
          <div key={verse.number} className={verse.comments.length > 0 || selectedVerse === verse.number ? "mb-6" : "mb-2"}>
            {/* Verse Row */}
            <div className="flex items-start gap-4 group">
              {/* Verse Number */}
              <div className="flex-shrink-0 w-12 text-right">
                <span className="text-sm font-semibold text-blue-600">{verse.number}</span>
              </div>

              {/* Verse Text */}
              <div className="flex-1">
                <p className="text-gray-800 text-base leading-relaxed inline">
                  {verse.text}
                </p>

                {/* Comment Button & Count - Show button only on hover */}
                <div className="mt-1 flex items-center gap-3">
                  {canComment && (
                    <button
                      onClick={() => setSelectedVerse(selectedVerse === verse.number ? null : verse.number)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {selectedVerse === verse.number ? 'Cancel' : 'Comment'}
                    </button>
                  )}

                  {verse.comments.length > 0 && (
                    <span className="text-sm text-gray-500 inline-flex">
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
                  <div className="mt-4">
                    {/* Sort Controls */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {verse.comments.length} {verse.comments.length === 1 ? 'comment' : 'comments'}
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="oldest">Oldest first</option>
                        <option value="newest">Newest first</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      {sortComments(verse.comments).map((comment) => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          passageId={passage.id}
                          sessionId={sessionId}
                          canComment={canComment}
                          isReply={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Modal */}
      <AIInsightsModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        scriptureText={fullPassageText}
        scriptureReference={reference}
      />
    </div>
  )
}
