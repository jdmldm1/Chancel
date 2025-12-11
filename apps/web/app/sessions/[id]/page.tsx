'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { GetSessionQuery, JoinSessionMutation, JoinSessionMutationVariables } from '@bibleproject/types/src/graphql'
import ScripturePassageCard from '@/components/session/ScripturePassageCard'
import SessionResources from '@/components/session/SessionResources'
import VideoCallModal from '@/components/session/VideoCallModal'
import SessionChat from '@/components/session/SessionChat'
import JoinCodeDisplay from '@/components/session/JoinCodeDisplay'
import AssignGroupsToSession from '@/components/session/AssignGroupsToSession'
import { SessionDetailSkeleton } from '@/components/session/SessionDetailSkeleton'
import { useToast } from '@/components/ui/toast'
import { MessageCircle, X } from 'lucide-react'

const GET_SESSION = `
  query GetSession($id: ID!) {
    session(id: $id) {
      id
      title
      description
      startDate
      endDate
      seriesId
      visibility
      sessionType
      videoCallUrl
      imageUrl
      joinCode
      series {
        id
        title
        imageUrl
      }
      leader {
        id
        name
        email
      }
      participants {
        id
        user {
          id
          name
          role
        }
        joinedAt
        role
      }
      resources {
        id
        fileName
        fileUrl
        fileType
        resourceType
        videoId
        description
        createdAt
        uploader {
          id
          name
        }
      }
    }
  }
`

const GET_PAGINATED_PASSAGES = `
  query GetPaginatedPassages($sessionId: ID!, $limit: Int, $offset: Int, $includeCompleted: Boolean) {
    paginatedPassages(sessionId: $sessionId, limit: $limit, offset: $offset, includeCompleted: $includeCompleted) {
      passages {
        id
        book
        chapter
        verseStart
        verseEnd
        content
        note
        order
        isCompleted
        comments {
          id
          content
          verseNumber
          createdAt
          user {
            id
            name
          }
          parentId
          replies {
            id
            content
            verseNumber
            createdAt
            parentId
            user {
              id
              name
            }
          }
        }
      }
      totalCount
      hasMore
      completedCount
      progressPercentage
    }
  }
`

const TOGGLE_PASSAGE_COMPLETION = `
  mutation TogglePassageCompletion($passageId: ID!) {
    togglePassageCompletion(passageId: $passageId) {
      id
      passageId
      userId
    }
  }
`

const JOIN_SESSION = `
  mutation JoinSession($sessionId: ID!) {
    joinSession(sessionId: $sessionId) {
      id
      user {
        id
        name
      }
      joinedAt
      role
    }
  }
`

// TODO: Re-enable subscriptions once WebSocket is properly configured
// const COMMENT_ADDED = `
//   subscription CommentAdded($sessionId: ID!) {
//     commentAdded(sessionId: $sessionId) {
//       id
//       content
//       createdAt
//       parentId
//       passageId
//       user {
//         id
//         name
//       }
//       replies {
//         id
//         content
//         createdAt
//         user {
//           id
//           name
//         }
//       }
//     }
//   }
// `

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { addToast } = useToast()
  const sessionId = params.id as string
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [participantsCollapsed, setParticipantsCollapsed] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false)
  const [showCompletedPassages, setShowCompletedPassages] = useState(false)
  const [passagesOffset, setPassagesOffset] = useState(0)
  const [completedPassagesOffset, setCompletedPassagesOffset] = useState(0)
  const passagesLimit = 10

  const { data, loading, error, refetch } = useGraphQLQuery<GetSessionQuery>(GET_SESSION, {
    variables: { id: sessionId },
  })

  // Query for active (not completed) passages
  const { data: activePassagesData, loading: loadingActive, refetch: refetchActive } = useGraphQLQuery(
    GET_PAGINATED_PASSAGES,
    {
      variables: {
        sessionId,
        limit: passagesLimit,
        offset: passagesOffset,
        includeCompleted: false,
      },
    }
  )

  // Query for completed passages
  const { data: completedPassagesData, loading: loadingCompleted, refetch: refetchCompleted } = useGraphQLQuery(
    GET_PAGINATED_PASSAGES,
    {
      variables: {
        sessionId,
        limit: passagesLimit,
        offset: completedPassagesOffset,
        includeCompleted: showCompletedPassages,
      },
      skip: !showCompletedPassages,
    }
  )

  const [joinSession, { loading: joining }] = useGraphQLMutation<JoinSessionMutation, JoinSessionMutationVariables>(
    JOIN_SESSION,
    {
      onCompleted: () => {
        refetch()
        addToast({
          type: 'success',
          message: 'Successfully joined session',
          description: 'You can now participate in this study session.',
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          message: 'Failed to join session',
          description: error.message,
        })
      },
    }
  )

  const [toggleCompletion] = useGraphQLMutation(TOGGLE_PASSAGE_COMPLETION, {
    onCompleted: () => {
      refetchActive()
      if (showCompletedPassages) {
        refetchCompleted()
      }
      addToast({
        type: 'success',
        message: 'Progress updated',
        description: 'Passage completion status toggled.',
      })
    },
    onError: (error) => {
      addToast({
        type: 'error',
        message: 'Failed to update progress',
        description: error.message,
      })
    },
  })

  // TODO: Re-enable subscriptions once WebSocket is properly configured
  // For now, real-time comments will use polling via cache-and-network fetchPolicy
  // useSubscription<CommentAddedSubscription>(COMMENT_ADDED, {
  //   variables: { sessionId },
  //   onData: ({ data: subscriptionData, client }) => {
  //     if (subscriptionData.data?.commentAdded) {
  //       // Optimized: Update Apollo cache directly instead of full refetch
  //       const newComment = subscriptionData.data.commentAdded
  //       const existingData = client.cache.readQuery<GetSessionQuery>({
  //         query: GET_SESSION,
  //         variables: { id: sessionId },
  //       })

  //       if (existingData?.session) {
  //         // Find the passage this comment belongs to and update only that passage
  //         const updatedPassages = existingData.session.scripturePassages.map(passage => {
  //           if (passage.id === newComment.passageId) {
  //             // Add the new comment to the passage
  //             const updatedComments = [...passage.comments]

  //             // If it's a reply, add it to the parent's replies
  //             if (newComment.parentId) {
  //               const parentIndex = updatedComments.findIndex(c => c.id === newComment.parentId)
  //               if (parentIndex !== -1 && updatedComments[parentIndex].replies) {
  //                 updatedComments[parentIndex] = {
  //                   ...updatedComments[parentIndex],
  //                   replies: [...updatedComments[parentIndex].replies, {
  //                     ...newComment,
  //                     replies: [] // Initialize empty replies array for the new comment
  //                   }]
  //                 }
  //               }
  //             } else {
  //               // It's a top-level comment
  //               updatedComments.push({
  //                 ...newComment,
  //                 replies: [] // Initialize empty replies array for new top-level comments
  //               })
  //             }

  //             return { ...passage, comments: updatedComments }
  //           }
  //           return passage
  //         })

  //         // Write the updated data back to cache
  //         client.cache.writeQuery({
  //           query: GET_SESSION,
  //           variables: { id: sessionId },
  //           data: {
  //             session: {
  //               ...existingData.session,
  //               scripturePassages: updatedPassages,
  //             },
  //           },
  //         })
  //       }
  //     }
  //   },
  // })

  if (loading) {
    return <SessionDetailSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md w-full text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-900">Unable to Load Session</h3>
          <p className="text-red-700">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data?.session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 max-w-md w-full text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Session Not Found</h3>
          <p className="text-gray-600">The study session you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/sessions"
            className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sessions
          </Link>
        </div>
      </div>
    )
  }

  const sessionData = data.session
  const isLeader = session?.user?.id === sessionData.leader.id
  const isParticipant = sessionData.participants.some(
    (p) => p.user.id === session?.user?.id
  )

  const handleJoinSession = async () => {
    await joinSession({ sessionId })
  }

  // Helper function to get session type badge styles
  const getSessionTypeBadge = (type: string) => {
    if (type === 'TOPIC_BASED') {
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        label: 'Topic-Based Study',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )
      }
    }
    return {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      label: 'Scripture-Based Study',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  }

  const typeBadge = getSessionTypeBadge(sessionData.sessionType)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Image */}
      {sessionData.imageUrl && (
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={sessionData.imageUrl}
            alt={sessionData.title}
            className="w-full h-80 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}>
                {typeBadge.icon}
                {typeBadge.label}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">{sessionData.title}</h1>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start gap-6">
          <div className="flex gap-6 flex-1">
            {(sessionData.series?.imageUrl || sessionData.imageUrl) && (
              <div className="flex-shrink-0">
                <img
                  src={(sessionData.series?.imageUrl || sessionData.imageUrl) || undefined}
                  alt={sessionData.series?.title || sessionData.title}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="flex-1">
              {!sessionData.imageUrl && (
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border} shadow-sm`}>
                    {typeBadge.icon}
                    {typeBadge.label}
                  </span>
                </div>
              )}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {sessionData.title}
              </h1>
              {sessionData.series && (
                <p className="mt-2 text-sm text-indigo-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Part of series: {sessionData.series.title}
                </p>
              )}
              {sessionData.description && (
                <p className="mt-3 text-lg text-gray-600 leading-relaxed">{sessionData.description}</p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Leader:</span> {sessionData.leader.name}
                </div>
                <div>
                  <span className="font-medium">Start:</span>{' '}
                  {new Date(sessionData.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div>
                  <span className="font-medium">End:</span>{' '}
                  {new Date(sessionData.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div>
                  <span className="font-medium">Participants:</span> {sessionData.participants.length}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {isLeader && (
              <Link
                href={`/sessions/${sessionId}/edit`}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Session
              </Link>
            )}
            {sessionData.videoCallUrl && (isParticipant || isLeader) && (
              <button
                onClick={() => setIsVideoCallOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join Video Call
              </button>
            )}
            {!isLeader && !isParticipant && session && (
              <button
                onClick={handleJoinSession}
                disabled={joining}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {joining ? 'Joining...' : 'Join Study Session'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scripture Passages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Scripture Passages</h2>
        </div>

        {/* Progress Indicator */}
        {activePassagesData?.paginatedPassages && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-900">Study Progress</h3>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(activePassagesData.paginatedPassages.progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-md"
                style={{ width: `${activePassagesData.paginatedPassages.progressPercentage}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-blue-700 font-medium">
              {activePassagesData.paginatedPassages.completedCount} of {activePassagesData.paginatedPassages.totalCount} passages completed
            </p>
          </div>
        )}

        {/* Active Passages */}
        {loadingActive ? (
          <p className="text-gray-500">Loading passages...</p>
        ) : !activePassagesData?.paginatedPassages?.passages?.length && passagesOffset === 0 ? (
          <p className="text-gray-500">No more passages to study! Great job! 🎉</p>
        ) : (
          <div className="space-y-6">
            {activePassagesData?.paginatedPassages?.passages.map((passage: any) => (
              <ScripturePassageCard
                key={passage.id}
                passage={passage}
                sessionId={sessionId}
                canComment={isParticipant || isLeader}
                onCommentChange={() => {
                  refetchActive()
                  refetch()
                }}
                onToggleCompletion={() => toggleCompletion({ passageId: passage.id })}
                showCompletionButton={isParticipant || isLeader}
              />
            ))}

            {/* Load More Active Passages */}
            {activePassagesData?.paginatedPassages?.hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setPassagesOffset(prev => prev + passagesLimit)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Load More Passages
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completed Passages Section */}
        {activePassagesData?.paginatedPassages?.completedCount > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowCompletedPassages(!showCompletedPassages)}
              className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-between text-gray-700 font-medium"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Show Completed Passages ({activePassagesData.paginatedPassages.completedCount})
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${showCompletedPassages ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showCompletedPassages && (
              <div className="mt-6 space-y-6 opacity-75">
                {loadingCompleted ? (
                  <p className="text-gray-500">Loading completed passages...</p>
                ) : (
                  <>
                    {completedPassagesData?.paginatedPassages?.passages
                      ?.filter((p: any) => p.isCompleted)
                      .map((passage: any) => (
                        <ScripturePassageCard
                          key={passage.id}
                          passage={passage}
                          sessionId={sessionId}
                          canComment={isParticipant || isLeader}
                          onCommentChange={() => {
                            refetchCompleted()
                            refetch()
                          }}
                          onToggleCompletion={() => toggleCompletion({ passageId: passage.id })}
                          showCompletionButton={isParticipant || isLeader}
                        />
                      ))}

                    {/* Load More Completed Passages */}
                    {completedPassagesData?.paginatedPassages?.hasMore && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setCompletedPassagesOffset(prev => prev + passagesLimit)}
                          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-md"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Load More Completed
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resources */}
      <div className="mt-8">
        <SessionResources
          resources={sessionData.resources}
          sessionId={sessionId}
          canUpload={isParticipant || isLeader}
          currentUserId={session?.user?.id}
          sessionLeaderId={sessionData.leader.id}
          onResourceChange={refetch}
        />
      </div>


      {/* Assign Groups to Session (Leaders Only) */}
      {isLeader && (
        <div className="mt-8">
          <AssignGroupsToSession sessionId={sessionId} isLeader={isLeader} />
        </div>
      )}

      {/* Participants */}
      <div className="mt-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
            <button
              onClick={() => setParticipantsCollapsed(!participantsCollapsed)}
              className="flex items-center gap-3 text-xl font-semibold text-blue-900 hover:text-blue-700 transition-colors w-full focus-ring rounded-md"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${participantsCollapsed ? '-rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Participants
              <span className="ml-auto text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {sessionData.participants.length}
              </span>
            </button>
          </div>

          {!participantsCollapsed && (
            <>
              {/* Invite by Code Link (Leaders Only) */}
              {isLeader && (sessionData as any).joinCode && (
                <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                  <button
                    onClick={() => setIsJoinCodeModalOpen(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Invite by Code
                  </button>
                </div>
              )}

              <ul className="divide-y divide-gray-100">
                {sessionData.participants.map((participant, index) => (
                  <li
                    key={participant.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {participant.user.name?.charAt(0).toUpperCase() || '?'}
                        </div>

                        {/* User info */}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{participant.user.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Joined {new Date(participant.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Role badge */}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                        {participant.role}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      {(isParticipant || isLeader) && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center z-40"
          title="Open Chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Floating Chat Panel */}
      {(isParticipant || isLeader) && isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageCircle size={20} />
              Session Chat
            </h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              title="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <SessionChat sessionId={sessionId} />
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {sessionData.videoCallUrl && (
        <VideoCallModal
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          roomName={sessionData.videoCallUrl}
          displayName={session?.user?.name || 'Guest'}
        />
      )}

      {/* Join Code Modal */}
      {isLeader && (sessionData as any).joinCode && isJoinCodeModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Invite by Code</h2>
              <button
                onClick={() => setIsJoinCodeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <JoinCodeDisplay
                sessionId={sessionId}
                joinCode={(sessionData as any).joinCode}
                sessionTitle={sessionData.title}
                onCodeRegenerated={() => refetch()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
