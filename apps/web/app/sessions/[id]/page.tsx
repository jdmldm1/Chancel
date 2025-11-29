'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { gql } from '@apollo/client'
import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { GetSessionQuery, JoinSessionMutation, JoinSessionMutationVariables, CommentAddedSubscription } from '@bibleproject/types/src/graphql'
import ScripturePassageCard from '@/components/session/ScripturePassageCard'
import SessionResources from '@/components/session/SessionResources'
import VideoCallModal from '@/components/session/VideoCallModal'
import SessionChat from '@/components/session/SessionChat'

const GET_SESSION = gql`
  query GetSession($id: ID!) {
    session(id: $id) {
      id
      title
      description
      startDate
      endDate
      seriesId
      visibility
      videoCallUrl
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
      scripturePassages {
        id
        book
        chapter
        verseStart
        verseEnd
        content
        note
        order
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
            replies {
              id
              content
              verseNumber
              createdAt
              user {
                id
                name
              }
            }
          }
        }
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

const JOIN_SESSION = gql`
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

const COMMENT_ADDED = gql`
  subscription CommentAdded($sessionId: ID!) {
    commentAdded(sessionId: $sessionId) {
      id
      content
      createdAt
      parentId
      passageId
      user {
        id
        name
      }
      replies {
        id
        content
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const sessionId = params.id as string
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [participantsCollapsed, setParticipantsCollapsed] = useState(false)

  const { data, loading, error, refetch } = useQuery<GetSessionQuery>(GET_SESSION, {
    variables: { id: sessionId },
  })

  const [joinSession, { loading: joining }] = useMutation<JoinSessionMutation, JoinSessionMutationVariables>(
    JOIN_SESSION,
    {
      onCompleted: () => {
        refetch()
      },
    }
  )

  // Subscribe to new comments
  useSubscription<CommentAddedSubscription>(COMMENT_ADDED, {
    variables: { sessionId },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.commentAdded) {
        // Refetch the session to get updated comments
        refetch()
      }
    },
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading study session...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    )
  }

  if (!data?.session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Study session not found</div>
      </div>
    )
  }

  const sessionData = data.session
  const isLeader = session?.user?.id === sessionData.leader.id
  const isParticipant = sessionData.participants.some(
    (p) => p.user.id === session?.user?.id
  )

  const handleJoinSession = async () => {
    await joinSession({ variables: { sessionId } })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Session Image */}
      {sessionData.imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src={sessionData.imageUrl}
            alt={sessionData.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start gap-6">
          <div className="flex gap-6 flex-1">
            {(sessionData.series?.imageUrl || sessionData.imageUrl) && (
              <div className="flex-shrink-0">
                <img
                  src={sessionData.series?.imageUrl || sessionData.imageUrl}
                  alt={sessionData.series?.title || sessionData.title}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">{sessionData.title}</h1>
              {sessionData.series && (
                <p className="mt-2 text-sm text-indigo-600 font-medium">
                  Part of series: {sessionData.series.title}
                </p>
              )}
              {sessionData.description && (
                <p className="mt-2 text-lg text-gray-600">{sessionData.description}</p>
              )}
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
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
        <h2 className="text-2xl font-semibold text-gray-900">Scripture Passages</h2>
        {sessionData.scripturePassages.length === 0 ? (
          <p className="text-gray-500">No scripture passages added yet.</p>
        ) : (
          <div className="space-y-6">
            {[...sessionData.scripturePassages]
              .sort((a, b) => a.order - b.order)
              .map((passage) => (
                <ScripturePassageCard
                  key={passage.id}
                  passage={passage}
                  sessionId={sessionId}
                  canComment={isParticipant || isLeader}
                />
              ))}
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
        />
      </div>

      {/* Participants */}
      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <button
              onClick={() => setParticipantsCollapsed(!participantsCollapsed)}
              className="flex items-center gap-2 text-xl font-semibold text-blue-900 hover:text-blue-700"
            >
              <svg
                className={`w-5 h-5 transition-transform ${participantsCollapsed ? '-rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Participants ({sessionData.participants.length})
            </button>
          </div>

          {!participantsCollapsed && (
            <ul className="divide-y divide-gray-200">
              {sessionData.participants.map((participant) => (
                <li key={participant.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participant.user.name}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(participant.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {participant.role}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Session Chat */}
      {(isParticipant || isLeader) && (
        <div className="mt-8">
          <SessionChat sessionId={sessionId} />
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
    </div>
  )
}
