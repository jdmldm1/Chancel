'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { gql } from '@apollo/client'
import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { GetSessionQuery, JoinSessionMutation, JoinSessionMutationVariables, CommentAddedSubscription } from '@bibleproject/types/src/graphql'
import ScripturePassageCard from '@/components/session/ScripturePassageCard'
import SessionResources from '@/components/session/SessionResources'

const GET_SESSION = gql`
  query GetSession($id: ID!) {
    session(id: $id) {
      id
      title
      description
      scheduledDate
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
        <div className="text-lg">Loading session...</div>
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
        <div className="text-gray-600">Session not found</div>
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{sessionData.title}</h1>
            {sessionData.description && (
              <p className="mt-2 text-lg text-gray-600">{sessionData.description}</p>
            )}
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <div>
                <span className="font-medium">Leader:</span> {sessionData.leader.name}
              </div>
              <div>
                <span className="font-medium">Scheduled:</span>{' '}
                {new Date(sessionData.scheduledDate).toLocaleDateString('en-US', {
                  weekday: 'long',
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

          {!isLeader && !isParticipant && session && (
            <button
              onClick={handleJoinSession}
              disabled={joining}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {joining ? 'Joining...' : 'Join Session'}
            </button>
          )}
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Participants</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
        </div>
      </div>
    </div>
  )
}
