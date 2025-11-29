'use client'

import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { GetMySessionsQuery, GetAllSessionsQuery, DeleteSessionMutation, DeleteSessionMutationVariables } from '@bibleproject/types/src/graphql'
import Link from 'next/link'

const GET_MY_SESSIONS = gql`
  query GetMySessions {
    mySessions {
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
      }
      participants {
        id
        user {
          id
          name
        }
      }
    }
  }
`

const GET_ALL_SESSIONS = gql`
  query GetAllSessions {
    sessions {
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
      }
      participants {
        id
        user {
          id
          name
        }
      }
    }
  }
`

const DELETE_SESSION = gql`
  mutation DeleteSession($id: ID!) {
    deleteSession(id: $id) {
      id
      title
    }
  }
`

type Session = GetMySessionsQuery['mySessions'][0]

interface SessionListProps {
  viewMode: 'my' | 'all'
}

export default function SessionList({ viewMode }: SessionListProps) {
  const { data: authSession } = useSession()
  const { data: myData, loading: myLoading, error: myError } = useQuery<GetMySessionsQuery>(GET_MY_SESSIONS, {
    skip: viewMode !== 'my',
  })
  const { data: allData, loading: allLoading, error: allError } = useQuery<GetAllSessionsQuery>(GET_ALL_SESSIONS, {
    skip: viewMode !== 'all',
  })
  const [deleteSession] = useMutation<DeleteSessionMutation, DeleteSessionMutationVariables>(DELETE_SESSION, {
    refetchQueries: [{ query: GET_MY_SESSIONS }, { query: GET_ALL_SESSIONS }],
  })

  const loading = viewMode === 'my' ? myLoading : allLoading
  const error = viewMode === 'my' ? myError : allError
  const sessions = viewMode === 'my' ? (myData?.mySessions || []) : (allData?.sessions || [])

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this study session?')) {
      try {
        await deleteSession({ variables: { id } })
      } catch (err) {
        console.error('Error deleting session:', err)
        // TODO: Display error to user
      }
    }
  }

  if (loading) return <p>Loading study sessions...</p>
  if (error) return <p>Error: {error.message}</p>

  const isMySession = (session: Session) => {
    return session.leader.id === authSession?.user?.id ||
           session.participants.some(p => p.user.id === authSession?.user?.id)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        {viewMode === 'my' ? 'Your Study Sessions' : 'All Study Sessions'}
      </h2>
      {sessions.length === 0 ? (
        <p>No study sessions found. {viewMode === 'my' ? 'Create a new one!' : ''}</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session: Session) => {
            const isMember = isMySession(session)
            const isLeader = session.leader.id === authSession?.user?.id

            return (
              <li
                key={session.id}
                className="p-4 border rounded-md shadow-sm relative"
              >
                {viewMode === 'all' && (
                  <div className="absolute top-2 right-2">
                    {isMember ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {isLeader ? 'Leader' : 'Member'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not Joined
                      </span>
                    )}
                  </div>
                )}
                <Link href={`/sessions/${session.id}`} className="text-blue-600 hover:underline">
                  <h3 className="text-xl font-bold">{session.title}</h3>
                </Link>
                <p className="text-gray-600">{session.description}</p>
                <p className="text-sm text-gray-500">
                  Scheduled for: {new Date(session.scheduledDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Leader: {session.leader?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Participants: {session.participants.length}
                </p>
                {isLeader && (
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="mt-2 rounded-md bg-red-600 px-3 py-1 text-white font-semibold hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
