'use client'

import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { GetMySessionsQuery, GetAllSessionsQuery, DeleteSessionMutation, DeleteSessionMutationVariables } from '@bibleproject/types/src/graphql'
import Link from 'next/link'
import { useState } from 'react'

const GET_MY_SESSIONS = gql`
  query GetMySessions {
    mySessions {
      id
      title
      description
      startDate
      endDate
      visibility
      sessionType
      imageUrl
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
    publicSessions {
      id
      title
      description
      startDate
      endDate
      visibility
      sessionType
      imageUrl
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
  const [sessionTypeFilter, setSessionTypeFilter] = useState<'all' | 'SCRIPTURE_BASED' | 'TOPIC_BASED'>('all')

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
  const allSessions = viewMode === 'my' ? (myData?.mySessions || []) : (allData?.publicSessions || [])

  // Filter sessions by type
  const sessions = sessionTypeFilter === 'all'
    ? allSessions
    : allSessions.filter(s => s.sessionType === sessionTypeFilter)

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

  // Helper function to get session type badge
  const getSessionTypeBadge = (type: string) => {
    if (type === 'TOPIC_BASED') {
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        label: 'Topic-Based',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )
      }
    }
    return {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      label: 'Scripture-Based',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {viewMode === 'my' ? 'Your Study Sessions' : 'All Study Sessions'}
        </h2>

        {/* Session Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by type:</span>
          <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setSessionTypeFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                sessionTypeFilter === 'all'
                  ? 'bg-gray-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSessionTypeFilter('SCRIPTURE_BASED')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                sessionTypeFilter === 'SCRIPTURE_BASED'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Scripture
            </button>
            <button
              onClick={() => setSessionTypeFilter('TOPIC_BASED')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                sessionTypeFilter === 'TOPIC_BASED'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Topics
            </button>
          </div>
        </div>
      </div>
      {sessions.length === 0 ? (
        <p>No study sessions found. {viewMode === 'my' ? 'Create a new one!' : ''}</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session: Session) => {
            const isMember = isMySession(session)
            const isLeader = session.leader.id === authSession?.user?.id
            const typeBadge = getSessionTypeBadge(session.sessionType)

            return (
              <li
                key={session.id}
                className="p-6 border-2 border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative bg-white hover:border-gray-200"
              >
                {viewMode === 'all' && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    {isMember ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {isLeader ? 'Leader' : 'Member'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        Not Joined
                      </span>
                    )}
                  </div>
                )}
                <div className="flex gap-4">
                  {(session.series?.imageUrl || session.imageUrl) && (
                    <div className="flex-shrink-0">
                      <img
                        src={session.series?.imageUrl || session.imageUrl}
                        alt={session.series?.title || session.title}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    {/* Session Type Badge */}
                    <div className="mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}>
                        {typeBadge.icon}
                        {typeBadge.label}
                      </span>
                    </div>

                    <Link href={`/sessions/${session.id}`} className="group">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {session.title}
                      </h3>
                    </Link>
                    {session.series && (
                      <p className="text-sm text-indigo-600 font-semibold mb-2 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Series: {session.series.title}
                      </p>
                    )}
                    <p className="text-gray-600 leading-relaxed">{session.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Start:</span> {new Date(session.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">End:</span> {new Date(session.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Leader:</span> {session.leader?.name || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-medium">Participants:</span> {session.participants.length}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {session.visibility === 'PRIVATE' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Private Session
                        </span>
                      )}
                      {isLeader && (
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 text-xs transition-all duration-200 shadow-sm hover:shadow"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
