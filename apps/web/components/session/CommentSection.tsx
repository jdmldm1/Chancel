'use client'

import { useState } from 'react'
import { useGraphQLMutation } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { CreateCommentMutation, CreateCommentMutationVariables, GetSessionQuery } from '@bibleproject/types/src/graphql'
import CommentItem from './CommentItem'

const CREATE_COMMENT = `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      createdAt
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

type Comment = NonNullable<GetSessionQuery['session']>['scripturePassages'][0]['comments'][0]

interface CommentSectionProps {
  comments: Comment[]
  passageId: string
  sessionId: string
  canComment: boolean
  onCommentChange?: () => void
}

export default function CommentSection({
  comments,
  passageId,
  sessionId,
  canComment,
  onCommentChange,
}: CommentSectionProps) {
  const { data: session } = useSession()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const [createComment, { loading }] = useGraphQLMutation<CreateCommentMutation, CreateCommentMutationVariables>(
    CREATE_COMMENT,
    {
      onCompleted: () => {
        setNewComment('')
        setReplyingTo(null)
        onCommentChange?.()
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault()
    if (!newComment.trim() || !session) return

    await createComment({
      input: {
        content: newComment.trim(),
        passageId,
        sessionId,
        parentId: parentId || null,
      },
    })
  }

  // Organize comments by parent/child relationship
  const topLevelComments = comments.filter((c) => !c.parentId)

  return (
    <div className="space-y-4">
      {/* New Comment Form */}
      {canComment && (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              passageId={passageId}
              sessionId={sessionId}
              canComment={canComment}
            />
          ))
        )}
      </div>
    </div>
  )
}
