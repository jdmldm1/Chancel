'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession()

  // Always show padding for authenticated/loading users to prevent layout shift
  const showSidebarPadding = status === 'authenticated' || status === 'loading'

  return (
    <main className={`pt-16 min-h-screen transition-all duration-300 ${showSidebarPadding ? 'md:pl-64' : ''}`}>
      {children}
    </main>
  )
}
