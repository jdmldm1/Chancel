'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 text-gray-900 font-semibold text-xl">
              BibleProject
            </Link>
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/sessions"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  Sessions
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user.name} ({session.user.role})
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
