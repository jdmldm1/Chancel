'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession()

  return (
    <main className={`pt-16 min-h-screen transition-all duration-300 ${session ? 'md:pl-64' : ''}`}>
      {children}
    </main>
  )
}
