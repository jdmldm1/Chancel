'use client'

import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

const MY_SESSIONS_QUERY = gql`
  query MySessions {
    mySessions {
      id
      title
      description
      startDate
      endDate
      sessionType
      visibility
      leader {
        id
        name
      }
      participants {
        id
        user {
          id
          name
        }
      }
      comments {
        id
      }
      scripturePassages {
        id
      }
    }
  }
`

const MY_JOIN_REQUESTS_QUERY = gql`
  query MyJoinRequests {
    myJoinRequests {
      id
      status
      createdAt
      session {
        id
        title
        startDate
      }
      from {
        id
        name
      }
    }
  }
`

interface Session {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  sessionType: string
  visibility: string
  leader: {
    id: string
    name: string
  }
  participants: Array<{
    id: string
    user: {
      id: string
      name: string
    }
  }>
  comments: Array<{ id: string }>
  scripturePassages: Array<{ id: string }>
}

interface JoinRequest {
  id: string
  status: string
  createdAt: string
  session: {
    id: string
    title: string
    startDate: string
  }
  from: {
    id: string
    name: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  const { data: sessionsData, loading: sessionsLoading } = useQuery<{
    mySessions: Session[]
  }>(MY_SESSIONS_QUERY)
  const { data: joinRequestsData, loading: joinRequestsLoading } = useQuery<{
    myJoinRequests: JoinRequest[]
  }>(MY_JOIN_REQUESTS_QUERY)

  if (status === 'loading' || sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const sessions: Session[] = sessionsData?.mySessions || []
  const joinRequests: JoinRequest[] = joinRequestsData?.myJoinRequests || []
  const pendingRequests = joinRequests.filter(r => r.status === 'PENDING')

  const isLeader = session.user.role === 'LEADER'
  const now = new Date()

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter(s => {
    const startDate = new Date(s.startDate)
    if (activeTab === 'upcoming') return startDate >= now
    if (activeTab === 'past') return startDate < now
    return true
  }).sort((a, b) => {
    const dateA = new Date(a.startDate).getTime()
    const dateB = new Date(b.startDate).getTime()
    return activeTab === 'past' ? dateB - dateA : dateA - dateB
  })

  // Calculate stats
  const leaderSessions = sessions.filter(s => s.leader.id === session.user.id)
  const memberSessions = sessions.filter(s => s.leader.id !== session.user.id)
  const totalComments = sessions.reduce((sum, s) => sum + s.comments.length, 0)
  const totalParticipants = sessions.reduce((sum, s) => sum + s.participants.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {isLeader ? 'Leader Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-600">
            Welcome back, {session.user.name}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{sessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            {isLeader && (
              <p className="text-xs text-gray-500 mt-2">
                {leaderSessions.length} as leader
              </p>
            )}
          </div>

          {isLeader && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalParticipants}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Across all sessions
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalComments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Discussion activity
            </p>
          </div>

          {!isLeader && pendingRequests.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Invites</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{pendingRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Awaiting response
              </p>
            </div>
          )}
        </div>

        {/* Pending Join Requests (for members) */}
        {!isLeader && pendingRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{request.session.title}</p>
                    <p className="text-sm text-gray-600">
                      Invited by {request.from.name} • {new Date(request.session.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/sessions/${request.session.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Session
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {isLeader && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/sessions?create=true"
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-medium">Create New Session</div>
                  <div className="text-sm text-white/80">Start a new Bible study</div>
                </div>
              </Link>
              <Link
                href="/bible"
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <div className="font-medium">Browse Bible</div>
                  <div className="text-sm text-white/80">Find scripture passages</div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">My Sessions</h2>

            {/* Tabs */}
            <div className="flex gap-4 mt-4 border-b border-gray-200 -mb-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
            </div>
          </div>

          <div className="p-6">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="text-lg font-medium mb-1">No {activeTab} sessions</p>
                <p className="text-sm">
                  {isLeader
                    ? "Create your first session to get started"
                    : "Join a session to begin your study"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredSessions.map((sessionItem) => {
                  const isSessionLeader = sessionItem.leader.id === session?.user?.id
                  const startDate = new Date(sessionItem.startDate)
                  const isPast = startDate < now

                  return (
                    <Link
                      key={sessionItem.id}
                      href={`/sessions/${sessionItem.id}`}
                      className="group block border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {sessionItem.title}
                            </h3>
                            {isSessionLeader && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                Leader
                              </span>
                            )}
                            {isPast && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                Completed
                              </span>
                            )}
                          </div>
                          {sessionItem.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {sessionItem.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {startDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {sessionItem.participants.length} participants
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {sessionItem.comments.length} comments
                            </div>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
