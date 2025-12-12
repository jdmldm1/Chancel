'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import ChanelLogo from './ChanelLogo'
import { Sidebar, SidebarContent, SidebarSection, SidebarItem } from './ui/sidebar'
import { useState } from 'react'

// SVG Icons (inline for minimalism)
const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const BookOpenIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const PlusCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MenuIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const UserCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ChartBarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

export default function EnhancedNavigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              {session && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <MenuIcon />
                </button>
              )}

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 px-2 group">
                <ChanelLogo size="sm" className="text-gray-900 transition-transform group-hover:scale-105 duration-200" />
                <span className="text-gray-900 font-semibold text-lg">
                  Chancel
                </span>
              </Link>
            </div>

            {/* Right side - User info and actions */}
            <div className="flex items-center gap-3">
              {status === 'loading' ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : session ? (
                <>
                  <Link
                    href="/profile"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <UserCircleIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.displayName || session.user.username || session.user.name}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      {session.user.role}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-200"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Only shown when logged in */}
      {session && (
        <>
          {/* Desktop Sidebar */}
          <Sidebar className={mobileMenuOpen ? 'block' : 'hidden md:block'}>
            <SidebarContent>
              <SidebarSection>
                <SidebarItem
                  icon={<HomeIcon />}
                  href="/"
                  active={pathname === '/'}
                >
                  Home
                </SidebarItem>
                <SidebarItem
                  icon={<ChartBarIcon />}
                  href="/dashboard"
                  active={pathname?.startsWith('/dashboard')}
                >
                  Dashboard
                </SidebarItem>
                <SidebarItem
                  icon={<BookOpenIcon />}
                  href="/sessions"
                  active={pathname?.startsWith('/sessions')}
                >
                  Study Sessions
                </SidebarItem>
                <SidebarItem
                  icon={<BookOpenIcon />}
                  href="/series"
                  active={pathname?.startsWith('/series')}
                >
                  Study Session Series
                </SidebarItem>
              </SidebarSection>

              {session.user.role === 'LEADER' && (
                <SidebarSection title="Leader Actions">
                  <SidebarItem
                    icon={<PlusCircleIcon />}
                    href="/sessions?create=true"
                  >
                    Create Session
                  </SidebarItem>
                  <SidebarItem
                    icon={<BookOpenIcon />}
                    href="/bible"
                    active={pathname?.startsWith('/bible')}
                  >
                    Browse Bible
                  </SidebarItem>
                </SidebarSection>
              )}

              <SidebarSection title="Community">
                <SidebarItem
                  icon={<UsersIcon />}
                  href="/groups"
                  active={pathname?.startsWith('/groups')}
                >
                  Groups
                </SidebarItem>
                <SidebarItem
                  icon={<UsersIcon />}
                  href="/sessions?view=all"
                >
                  Browse All Sessions
                </SidebarItem>
                <SidebarItem
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                  href="/prayer-requests"
                  active={pathname?.startsWith('/prayer-requests')}
                >
                  Prayer Requests
                </SidebarItem>
              </SidebarSection>

              {session.user.role === 'ADMIN' && (
                <SidebarSection title="Administration">
                  <SidebarItem
                    icon={<ShieldIcon />}
                    href="/admin"
                    active={pathname === '/admin'}
                  >
                    Admin Dashboard
                  </SidebarItem>
                  <SidebarItem
                    icon={<UsersIcon />}
                    href="/admin/users"
                    active={pathname?.startsWith('/admin/users')}
                  >
                    User Management
                  </SidebarItem>
                </SidebarSection>
              )}

              {/* Decorative element at bottom */}
              <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="px-3 py-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 italic">
                    "Sacred space. Shared study."
                  </p>
                </div>
              </div>
            </SidebarContent>
          </Sidebar>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </>
      )}
    </>
  )
}
