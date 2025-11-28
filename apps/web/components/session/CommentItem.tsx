'use client'

import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  UpdateCommentMutation,
  UpdateCommentMutationVariables,
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  GetSessionQuery
} from '@bibleproject/types/src/graphql'

const CREATE_COMMENT = gql`
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

const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $input: UpdateCommentInput!) {
    updateComment(id: $id, input: $input) {
      id
      content
      updatedAt
    }
  }
`

const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`

type Comment = NonNullable<GetSessionQuery['session']>['scripturePassages'][0]['comments'][0]

interface CommentItemProps {
  comment: Comment
  passageId: string
  sessionId: string
  canComment: boolean
  isReply?: boolean
}

export default function CommentItem({
  comment,
  passageId,
  sessionId,
  canComment,
  isReply = false,
}: CommentItemProps) {
  const { data: session } = useSession()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const isOwner = session?.user?.id === comment.user.id

  const [createComment, { loading }] = useMutation<CreateCommentMutation, CreateCommentMutationVariables>(
    CREATE_COMMENT,
    {
      refetchQueries: ['GetSession'],
      onCompleted: () => {
        setReplyContent('')
        setShowReplyForm(false)
      },
    }
  )

  const [updateComment, { loading: updating }] = useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(
    UPDATE_COMMENT,
    {
      refetchQueries: ['GetSession'],
      onCompleted: () => {
        setIsEditing(false)
      },
    }
  )

  const [deleteComment, { loading: deleting }] = useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(
    DELETE_COMMENT,
    {
      refetchQueries: ['GetSession'],
    }
  )

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !session) return

    await createComment({
      variables: {
        input: {
          content: replyContent.trim(),
          passageId,
          sessionId,
          parentId: comment.id,
        },
      },
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editContent.trim()) return

    await updateComment({
      variables: {
        id: comment.id,
        input: {
          content: editContent.trim(),
        },
      },
    })
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    await deleteComment({
      variables: { id: comment.id },
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(comment.content)
  }

  const timeAgo = (date: string) => {
    const now = new Date()
    const commentDate = new Date(date)
    const seconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

    return commentDate.toLocaleDateString()
  }

  return (
    <div className={isReply ? 'ml-12' : ''}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
            {comment.user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{comment.user.name}</span>
              <span className="text-gray-500 text-sm">{timeAgo(comment.createdAt)}</span>
            </div>

            {/* Edit/Delete Menu */}
            {isOwner && !isEditing && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-gray-600 hover:text-blue-600"
                  title="Edit comment"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-sm text-gray-600 hover:text-red-600 disabled:opacity-50"
                  title="Delete comment"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={3}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={updating || !editContent.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={updating}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>

              {/* Action Buttons */}
              <div className="mt-2 flex items-center space-x-3">
                {canComment && !isReply && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reply
                  </button>
                )}
              </div>
            </>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={2}
              />
              <div className="mt-2 flex space-x-2">
                <button
                  type="submit"
                  disabled={loading || !replyContent.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? 'Posting...' : 'Reply'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false)
                    setReplyContent('')
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply as Comment}
              passageId={passageId}
              sessionId={sessionId}
              canComment={canComment}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
