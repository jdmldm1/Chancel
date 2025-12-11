'use client'

import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { GetMySessionsQuery, GetAllSessionsQuery, DeleteSessionMutation, DeleteSessionMutationVariables } from '@bibleproject/types/src/graphql'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { SessionListSkeleton } from './SessionListSkeleton'
import EmptyState from '../ui/EmptyState'

const GET_MY_SESSIONS = `
  query GetMySessions($limit: Int, $offset: Int) {
    mySessions(limit: $limit, offset: $offset) {
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
      }
      participants {
        id
        user {
          id
        }
      }
    }
  }
`

const GET_ALL_SESSIONS = `
  query GetAllSessions($limit: Int, $offset: Int) {
    publicSessions(limit: $limit, offset: $offset) {
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
      }
      participants {
        id
        user {
          id
        }
      }
    }
  }
`

const DELETE_SESSION = `
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
  timeFilter?: 'current' | 'past' | 'future'
}

export default function SessionList({ viewMode, timeFilter = 'current' }: SessionListProps) {
  const { data: authSession } = useSession()
  const [sessionTypeFilter, setSessionTypeFilter] = useState<'all' | 'SCRIPTURE_BASED' | 'TOPIC_BASED'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'participants' | 'title'>('date')
  const [offset, setOffset] = useState(0)
  const [allSessions, setAllSessions] = useState<Session[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const limit = 500  // Increased from 100 to 500 to get all sessions including past ones
  const isFirstRender = useRef(true)

  const { data: myData, loading: myLoading, error: myError } = useGraphQLQuery<GetMySessionsQuery>(GET_MY_SESSIONS, {
    skip: viewMode !== 'my',
    variables: { limit, offset: 0 },
  })
  const { data: allData, loading: allLoading, error: allError, refetch: refetchAll } = useGraphQLQuery<GetAllSessionsQuery>(GET_ALL_SESSIONS, {
    skip: viewMode !== 'all',
    variables: { limit, offset: 0 },
  })
  const [deleteSession] = useGraphQLMutation<DeleteSessionMutation, DeleteSessionMutationVariables>(DELETE_SESSION, {
  })

  // Initialize sessions when data loads
  useEffect(() => {
    if (viewMode === 'my' && myData?.mySessions) {
      setAllSessions(myData.mySessions)
      setHasMore(myData.mySessions.length === limit)
      setOffset(myData.mySessions.length)
    } else if (viewMode === 'all' && allData?.publicSessions) {
      setAllSessions(allData.publicSessions)
      setHasMore(allData.publicSessions.length === limit)
      setOffset(allData.publicSessions.length)
    }
  }, [myData, allData, viewMode, limit])

  // Reset pagination when viewMode changes (but not on initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setAllSessions([])
    setOffset(0)
    setHasMore(true)
  }, [viewMode])

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    try {
      const authHeaders = typeof window !== 'undefined'
        ? await fetch('/api/auth/session', { cache: 'no-store' })
            .then(res => res.ok ? res.json() : {})
            .then(session => session?.user?.id ? { authorization: `Bearer ${session.user.id}` } : {})
        : {}

      const { GraphQLClient } = await import('graphql-request')
      const endpoint = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql'
      const client = new GraphQLClient(endpoint, { credentials: 'include' })

      const query = viewMode === 'my' ? GET_MY_SESSIONS : GET_ALL_SESSIONS
      const result = await client.request<GetMySessionsQuery | GetAllSessionsQuery>(
        query,
        { limit, offset },
        authHeaders
      )

      const newSessions = viewMode === 'my'
        ? (result as GetMySessionsQuery).mySessions || []
        : (result as GetAllSessionsQuery).publicSessions || []

      setAllSessions(prev => [...prev, ...newSessions])
      setOffset(prev => prev + newSessions.length)
      setHasMore(newSessions.length === limit)
    } catch (err) {
      console.error('Error loading more sessions:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const loading = viewMode === 'my' ? myLoading : allLoading
  const error = viewMode === 'my' ? myError : allError

  // Use accumulated sessions if we have them, otherwise use fresh query data
  const sessionsToDisplay = allSessions.length > 0 ? allSessions :
    (viewMode === 'my' ? (myData?.mySessions || []) : (allData?.publicSessions || []))

  // Filter by time (current, past, future)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  const timeFilteredSessions = sessionsToDisplay.filter(s => {
    const startDate = new Date(s.startDate)
    const endDate = new Date(s.endDate)

    if (timeFilter === 'current') {
      // Session is "current" if it overlaps with today at all
      return startDate <= endOfToday && endDate >= startOfToday
    } else if (timeFilter === 'past') {
      // Session is "past" if it ended before today started
      return endDate < startOfToday
    } else if (timeFilter === 'future') {
      // Session is "future" if it starts after today ends
      return startDate > endOfToday
    }
    return true
  })

  // Filter, search, and sort sessions
  let sessions = sessionTypeFilter === 'all'
    ? timeFilteredSessions
    : timeFilteredSessions.filter(s => s.sessionType === sessionTypeFilter)

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    sessions = sessions.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.description?.toLowerCase().includes(query) ||
      s.leader.name?.toLowerCase().includes(query) ||
      s.series?.title.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  sessions = [...sessions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      case 'participants':
        return b.participants.length - a.participants.length
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this study session?')) {
      try {
        await deleteSession({ id })
      } catch (err) {
        console.error('Error deleting session:', err)
        // TODO: Display error to user
      }
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {viewMode === 'my' ? 'Your Study Sessions' : 'All Study Sessions'}
          </h2>
        </div>
        <SessionListSkeleton count={5} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load sessions</h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    )
  }

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
      {/* Header with title and count */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {viewMode === 'my' ? 'Your Study Sessions' : 'All Study Sessions'}
          <span className="ml-3 text-lg font-normal text-gray-500">
            ({sessions.length} {sessions.length === 1 ? 'session' : 'sessions'})
          </span>
        </h2>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, leader, or series..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-smooth"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Session Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type:</span>
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'participants' | 'title')}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-smooth cursor-pointer shadow-sm"
            >
              <option value="date">Newest First</option>
              <option value="participants">Most Participants</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
      {sessions.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No sessions match your search' : sessionTypeFilter === 'all' ? 'No study sessions found' : `No ${sessionTypeFilter === 'SCRIPTURE_BASED' ? 'scripture-based' : 'topic-based'} sessions found`}
          description={
            searchQuery
              ? `No sessions found for "${searchQuery}". Try different keywords or clear your search.`
              : viewMode === 'my'
              ? "You haven't created or joined any sessions yet. Start your Bible study journey by creating a new session!"
              : sessionTypeFilter !== 'all'
              ? "Try adjusting your filters or check back later for new sessions."
              : "There are no public sessions available at the moment. Check back later or create your own!"
          }
          icon={searchQuery ? 'search' : sessionTypeFilter !== 'all' ? 'filter' : 'sessions'}
          action={
            viewMode === 'my' && !searchQuery
              ? {
                  label: 'Create Your First Session',
                  onClick: () => (window.location.href = '/sessions?create=true'),
                }
              : undefined
          }
        />
      ) : (
        <ul className="space-y-4">
          {sessions.map((session: Session) => {
            const isMember = isMySession(session)
            const isLeader = session.leader.id === authSession?.user?.id
            const typeBadge = getSessionTypeBadge(session.sessionType)

            return (
              <li
                key={session.id}
                className="p-6 border-2 border-gray-100 rounded-xl shadow-sm relative bg-white card-lift group cursor-pointer"
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
                        src={(session.series?.imageUrl || session.imageUrl) || undefined}
                        alt={session.series?.title || session.title}
                        className="w-32 h-32 object-contain rounded-md bg-gray-50"
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
                        <span className="font-medium">Start:</span> {new Date(session.startDate).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">End:</span> {new Date(session.endDate).toLocaleString()}
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

      {/* Load More Button */}
      {!loading && !searchQuery && sessions.length > 0 && hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
          >
            {isLoadingMore ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading more...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Load More Sessions
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
