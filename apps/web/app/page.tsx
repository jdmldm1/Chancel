'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

        <div className="mt-14 flex gap-4 justify-center animate-fade-in-up animation-delay-400">
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
      </div>
    </main>
  )
}
