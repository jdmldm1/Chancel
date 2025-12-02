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
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 lg:p-24 overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-4xl">
        {/* Logo with subtle animation */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
            <svg
              className="relative w-28 h-28 text-blue-600 drop-shadow-lg transform hover:scale-110 transition-transform duration-300"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none"/>
              <path d="M65 30 C 75 30, 75 40, 75 50 C 75 60, 75 70, 65 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
              <path d="M40 35 L 35 35 C 28 35, 25 40, 25 50 C 25 60, 28 65, 35 65 L 40 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up">
          <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Chancel
          </span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-blue-600 font-medium animate-fade-in-up animation-delay-100">
          Sacred space. Shared study.
        </p>

        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          Experience transformative Bible study through collaborative group sessions,
          verse-by-verse exploration, and meaningful community discussions.
        </p>

        {/* Feature highlights */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Deep Study</h3>
            <p className="text-sm text-gray-600">Verse-by-verse exploration with inline commentary</p>
          </div>

          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Discussion</h3>
            <p className="text-sm text-gray-600">Real-time conversations and shared insights</p>
          </div>

          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-sm text-gray-600">Connect with others in meaningful study</p>
          </div>
        </div>

        <div className="mt-12 flex gap-4 justify-center animate-fade-in-up animation-delay-400">
          <a
            href="/auth/login"
            className="group relative rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="/auth/signup"
            className="rounded-lg border-2 border-blue-600 px-8 py-3.5 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md backdrop-blur-sm"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  )
}
