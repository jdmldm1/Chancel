'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40",
      "hidden md:block",
      className
    )}>
      {children}
    </aside>
  )
}

interface SidebarContentProps {
  children: ReactNode
  className?: string
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn("flex flex-col h-full overflow-y-auto py-6 px-4", className)}>
      {children}
    </div>
  )
}

interface SidebarSectionProps {
  title?: string
  children: ReactNode
  className?: string
}

export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  return (
    <div className={cn("mb-6", className)}>
      {title && (
        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  )
}

interface SidebarItemProps {
  icon?: ReactNode
  children: ReactNode
  active?: boolean
  onClick?: () => void
  href?: string
  badge?: string | number
  className?: string
}

export function SidebarItem({
  icon,
  children,
  active,
  onClick,
  href,
  badge,
  className
}: SidebarItemProps) {
  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {badge && (
        <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
          {badge}
        </span>
      )}
    </>
  )

  const baseClasses = cn(
    "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
    active
      ? "bg-blue-50 text-blue-700 shadow-sm"
      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    className
  )

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  )
}
