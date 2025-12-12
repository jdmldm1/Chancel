'use client'

import { useGraphQLQuery } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, BookOpen, Calendar } from 'lucide-react'
import { BadgeWidget } from '@/components/achievements/BadgeWidget'

const MY_SESSIONS_QUERY = `
  query MySessions($limit: Int, $offset: Int) {
    mySessions(limit: $limit, offset: $offset) {
      id
      title
      description
      startDate
      endDate
      sessionType
      visibility
      imageUrl
      leader {
        id
        name
      }
      participants {
        id
      }
      comments {
        id
      }
    }
  }
`

const MY_SERIES_QUERY = `
  query MySeries {
    mySeries {
      id
      title
      description
      imageUrl
      leader {
        id
        name
      }
      sessions {
        id
        startDate
        endDate
      }
    }
  }
`

const MY_GROUPS_QUERY = `
  query MyGroups {
    myGroups {
      id
      name
      description
      imageUrl
      visibility
      memberCount
      leader {
        id
        name
      }
    }
  }
`

const DASHBOARD_STATS_QUERY = `
  query DashboardStats {
    dashboardStats {
      totalSessions
      completedSessions
      totalSeries
      completedSeries
      totalGroups
      totalComments
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
  imageUrl?: string
  leader: {
    id: string
    name: string
  }
  participants: Array<{ id: string }>
  comments: Array<{ id: string }>
}

interface Series {
  id: string
  title: string
  description?: string
  imageUrl?: string
  leader: {
    id: string
    name: string
  }
  sessions: Array<{
    id: string
    startDate: string
    endDate: string
  }>
}

interface Group {
  id: string
  name: string
  description?: string
  imageUrl?: string
  visibility: string
  memberCount: number
  leader: {
    id: string
    name: string
  }
}

interface DashboardStats {
  totalSessions: number
  completedSessions: number
  totalSeries: number
  completedSeries: number
  totalGroups: number
  totalComments: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Using new graphql-request client (no more Apollo Client!)
  const { data: sessionsData, loading: sessionsLoading } = useGraphQLQuery<{
    mySessions: Session[]
  }>(MY_SESSIONS_QUERY, {
    skip: status === 'loading' || status === 'unauthenticated',
    variables: { limit: 500, offset: 0 },
  })

  const { data: seriesData, loading: seriesLoading } = useGraphQLQuery<{
    mySeries: Series[]
  }>(MY_SERIES_QUERY, {
    skip: status === 'loading' || status === 'unauthenticated',
  })

  const { data: groupsData, loading: groupsLoading } = useGraphQLQuery<{
    myGroups: Group[]
  }>(MY_GROUPS_QUERY, {
    skip: status === 'loading' || status === 'unauthenticated',
  })

  const { data: statsData, loading: statsLoading } = useGraphQLQuery<{
    dashboardStats: DashboardStats
  }>(DASHBOARD_STATS_QUERY, {
    skip: status === 'loading' || status === 'unauthenticated',
  })

  if (status === 'loading' || sessionsLoading || seriesLoading || groupsLoading || statsLoading) {
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
  const series: Series[] = seriesData?.mySeries || []
  const groups: Group[] = groupsData?.myGroups || []
  const stats = statsData?.dashboardStats

  const isLeader = session.user.role === 'LEADER'
  const now = new Date()

  console.log('Dashboard Debug:', {
    totalSessions: sessions.length,
    now: now.toISOString(),
    firstThreeSessions: sessions.slice(0, 3).map(s => ({
      title: s.title,
      startDate: s.startDate,
      endDate: s.endDate,
    }))
  })

  // Filter to show only active/current sessions (current date between start and end)
  const activeSessions = sessions.filter(s => {
    const startDate = new Date(s.startDate)
    const endDate = new Date(s.endDate)
    const isActive = startDate <= now && endDate >= now
    return isActive
  }).sort((a, b) => {
    const dateA = new Date(a.startDate).getTime()
    const dateB = new Date(b.startDate).getTime()
    return dateA - dateB
  })

  console.log('Active Sessions:', activeSessions.length, activeSessions.slice(0, 3).map(s => s.title))

  // Filter to show only active series (series with at least one active session)
  const activeSeries = series.filter(s => {
    return s.sessions.some(session => {
      const startDate = new Date(session.startDate)
      const endDate = new Date(session.endDate)
      return startDate <= now && endDate >= now
    })
  })

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            {isLeader ? 'Leader Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-500 font-light">
            Welcome back, {session.user.displayName || session.user.username || session.user.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Sessions</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stats?.completedSessions ?? 0}</p>
              </div>
              <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Series</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stats?.completedSeries ?? 0}</p>
              </div>
              <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Groups</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stats?.totalGroups ?? 0}</p>
              </div>
              <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Comments</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stats?.totalComments ?? 0}</p>
              </div>
              <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Badge Widget */}
        <BadgeWidget />

        {/* Three-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* My Sessions */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">My Sessions</h2>
              <Link
                href="/sessions"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="p-5">
              {activeSessions.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-light">No active sessions</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeSessions.slice(0, 5).map((sessionItem) => {
                    const isSessionLeader = sessionItem.leader.id === session?.user?.id
                    const startDate = new Date(sessionItem.startDate)

                    return (
                      <Link
                        key={sessionItem.id}
                        href={`/sessions/${sessionItem.id}`}
                        className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {sessionItem.imageUrl ? (
                            <img
                              src={sessionItem.imageUrl}
                              alt={sessionItem.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {sessionItem.title}
                              </h3>
                              {isSessionLeader && (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                  Leader
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {startDate.toLocaleDateString()} - {new Date(sessionItem.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sessionItem.participants.length} participants
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* My Series */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">My Series</h2>
              <Link
                href="/series"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="p-5">
              {activeSeries.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-light">No active series</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeSeries.slice(0, 5).map((seriesItem) => {
                    const isSeriesLeader = seriesItem.leader.id === session?.user?.id

                    return (
                      <Link
                        key={seriesItem.id}
                        href={`/series/${seriesItem.id}`}
                        className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {seriesItem.imageUrl ? (
                            <img
                              src={seriesItem.imageUrl}
                              alt={seriesItem.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {seriesItem.title}
                              </h3>
                              {isSeriesLeader && (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                                  Leader
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {seriesItem.sessions.length} {seriesItem.sessions.length === 1 ? 'session' : 'sessions'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* My Groups */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">My Groups</h2>
              <Link
                href="/groups"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="p-5">
              {groups.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-light">No groups yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groups.slice(0, 5).map((group) => {
                    const isGroupLeader = group.leader.id === session?.user?.id

                    return (
                      <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {group.imageUrl ? (
                            <img
                              src={group.imageUrl}
                              alt={group.name}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded flex items-center justify-center flex-shrink-0">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {group.name}
                              </h3>
                              {isGroupLeader && (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                                  Leader
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                            </p>
                          </div>
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
    </div>
  )
}
