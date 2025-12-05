'use client'

import { useState } from 'react'
import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/toast'

const GET_PRAYER_REQUESTS = `
  query GetPrayerRequests {
    prayerRequests {
      id
      userId
      content
      isAnonymous
      createdAt
      user {
        id
        name
      }
      reactionCounts {
        hearts
        prayingHands
      }
      reactions {
        id
        userId
        reactionType
      }
    }
  }
`

const CREATE_PRAYER_REQUEST = `
  mutation CreatePrayerRequest($content: String!, $isAnonymous: Boolean!) {
    createPrayerRequest(content: $content, isAnonymous: $isAnonymous) {
      id
      content
      isAnonymous
      createdAt
    }
  }
`

const DELETE_PRAYER_REQUEST = `
  mutation DeletePrayerRequest($id: ID!) {
    deletePrayerRequest(id: $id)
  }
`

const TOGGLE_PRAYER_REACTION = `
  mutation TogglePrayerReaction($prayerRequestId: ID!, $reactionType: ReactionType!) {
    togglePrayerReaction(prayerRequestId: $prayerRequestId, reactionType: $reactionType) {
      id
      reactionType
    }
  }
`

export default function PrayerRequestsPage() {
  const { data: session } = useSession()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const { data, loading, refetch } = useGraphQLQuery<any>(GET_PRAYER_REQUESTS)
  const [createRequest, { loading: creating }] = useGraphQLMutation(CREATE_PRAYER_REQUEST, {
    onCompleted: () => {
      setContent('')
      setIsAnonymous(false)
      setShowForm(false)
      refetch()
      addToast({ type: 'success', message: 'Prayer request shared!' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: error.message })
    },
  })

  const [deleteRequest] = useGraphQLMutation(DELETE_PRAYER_REQUEST, {
    onCompleted: () => {
      refetch()
      addToast({ type: 'success', message: 'Prayer request deleted' })
    },
  })

  const [toggleReaction] = useGraphQLMutation(TOGGLE_PRAYER_REACTION, {
    onCompleted: () => {
      refetch()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    createRequest({ content, isAnonymous })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this prayer request?')) {
      deleteRequest({ id })
    }
  }

  const handleReaction = (prayerRequestId: string, reactionType: 'HEART' | 'PRAYING_HANDS') => {
    toggleReaction({ prayerRequestId, reactionType })
  }

  const userHasReacted = (request: any, reactionType: string) => {
    return request.reactions.some(
      (r: any) => r.userId === session?.user?.id && r.reactionType === reactionType
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Prayer Requests
        </h1>
        <p className="text-gray-600">Share your prayer needs and lift others up in prayer</p>
      </div>

      {/* Create Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 text-white font-semibold hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {showForm ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
          {showForm ? 'Cancel' : 'Share Prayer Request'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Prayer Request
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Share what you'd like prayer for..."
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Post anonymously
              </label>
            </div>

            <button
              type="submit"
              disabled={creating || !content.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {creating ? 'Sharing...' : 'Share Prayer Request'}
            </button>
          </form>
        </div>
      )}

      {/* Prayer Requests List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {data?.prayerRequests?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-600 text-lg">No prayer requests yet</p>
              <p className="text-gray-500 text-sm mt-1">Be the first to share a prayer need</p>
            </div>
          ) : (
            data?.prayerRequests?.map((request: any) => {
              const isOwner = request.userId === session?.user?.id
              const hasHeartReaction = userHasReacted(request, 'HEART')
              const hasPrayingReaction = userHasReacted(request, 'PRAYING_HANDS')

              return (
                <div key={request.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {request.isAnonymous ? 'Anonymous' : request.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{request.content}</p>

                  {/* Reactions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleReaction(request.id, 'HEART')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                        hasHeartReaction
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <span className="text-lg">❤️</span>
                      <span className="text-sm font-medium">{request.reactionCounts.hearts}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(request.id, 'PRAYING_HANDS')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                        hasPrayingReaction
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                      }`}
                    >
                      <span className="text-lg">🙏</span>
                      <span className="text-sm font-medium">{request.reactionCounts.prayingHands}</span>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
