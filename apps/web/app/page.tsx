'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useGraphQLQuery } from '@/lib/graphql-client-new'
import SessionCard from '@/components/ui/SessionCard'
import GroupsPromotionSection from '@/components/ui/GroupsPromotionSection'

const GET_ACTIVE_UPCOMING_SESSIONS = `
  query GetActiveUpcomingSessions($limit: Int) {
    activeUpcomingSessions(limit: $limit) {
      id
      title
      description
      startDate
      endDate
      sessionType
      imageUrl
      leader { id name }
      series { id title imageUrl }
      participants { id }
    }
  }
`

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Fetch active and upcoming sessions for landing page
  const { data, loading, error } = useGraphQLQuery(GET_ACTIVE_UPCOMING_SESSIONS, {
    variables: { limit: 3 }
  })

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [status, session, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Only show home page to unauthenticated users
  if (status === 'authenticated') {
    return null // Will redirect via useEffect
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-gradient-to-b from-white to-gray-50/30">
      <div className="relative text-center max-w-4xl">
        {/* Logo - minimalist version */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <svg
            className="w-20 h-20 text-gray-900 transform hover:scale-105 transition-transform duration-200"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M65 30 C 75 30, 75 40, 75 50 C 75 60, 75 70, 65 70" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M40 35 L 35 35 C 28 35, 25 40, 25 50 C 25 60, 28 65, 35 65 L 40 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl md:text-8xl animate-fade-in-up mb-6">
          Chancel
        </h1>

        <p className="mt-2 text-lg sm:text-xl text-gray-500 font-light animate-fade-in-up animation-delay-100">
          Sacred space. Shared study.
        </p>

        <p className="mt-8 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up animation-delay-200">
          Experience transformative Bible study through collaborative group sessions,
          verse-by-verse exploration, and meaningful community discussions.
        </p>

        {/* Feature highlights - minimalist */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
          <div className="text-center group">
            <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Deep Study</h3>
            <p className="text-sm text-gray-500 font-light">Verse-by-verse exploration</p>
          </div>

          <div className="text-center group">
            <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Live Discussion</h3>
            <p className="text-sm text-gray-500 font-light">Real-time conversations</p>
          </div>

          <div className="text-center group">
            <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Community</h3>
            <p className="text-sm text-gray-500 font-light">Meaningful connections</p>
          </div>
        </div>

        {/* Active Bible Studies Section */}
        <div className="mt-20 animate-fade-in-up animation-delay-500">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Join Active Bible Studies
          </h2>
          <p className="text-gray-600 mb-10">
            Discover ongoing and upcoming study sessions from the community
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skeleton cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border-2 border-gray-100 rounded-lg p-6 h-64 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error || !data?.activeUpcomingSessions?.length ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No active sessions at the moment</p>
              <a href="/auth/signup" className="text-gray-900 underline hover:text-gray-700">
                Be the first to create a session
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.activeUpcomingSessions.slice(0, 3).map((session: any, idx: number) => (
                  <div key={session.id} className={`animate-fade-in animation-delay-${600 + idx * 50}`}>
                    <SessionCard session={{
                      ...session,
                      participantCount: session.participants?.length || 0
                    }} />
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <a
                  href="/auth/signup?redirect=/sessions"
                  className="text-gray-900 underline hover:text-gray-700 transition-colors"
                >
                  View all sessions →
                </a>
              </div>
            </>
          )}
        </div>

        {/* Groups Promotion Section */}
        <div className="mt-20 animate-fade-in-up animation-delay-600">
          <GroupsPromotionSection />
        </div>

        <div className="mt-20 flex gap-4 justify-center animate-fade-in-up animation-delay-400">
          <a
            href="/auth/login"
            className="rounded-lg bg-gray-900 px-8 py-3 text-white font-medium hover:bg-gray-800 transition-all duration-200"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="rounded-lg border border-gray-300 px-8 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Sign Up
          </a>
        </div>

        {/* Footer with GitHub link */}
        <div className="mt-16 pt-8 border-t border-gray-200 animate-fade-in-up animation-delay-500">
          <a
            href="https://github.com/jdmldm1/Chancel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-sm">View on GitHub</span>
          </a>
        </div>
      </div>
    </main>
  )
}
