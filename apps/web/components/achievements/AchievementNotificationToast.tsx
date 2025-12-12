'use client'

import { useEffect, useState } from 'react'
import { useGraphQLQuery } from '@/lib/graphql-client-new'
import { Award, X } from 'lucide-react'

const NOTIFICATIONS_QUERY = `
  query AchievementNotifications {
    achievementNotifications(unreadOnly: true) {
      id
      createdAt
      achievement {
        id
        name
        description
        iconUrl
        tier
      }
    }
  }
`

interface Achievement {
  id: string
  name: string
  description: string
  iconUrl?: string
  tier?: string
}

interface AchievementNotification {
  id: string
  createdAt: string
  achievement: Achievement
}

export function AchievementNotificationToast() {
  const { data, refetch } = useGraphQLQuery<{ achievementNotifications: AchievementNotification[] }>(
    NOTIFICATIONS_QUERY,
    { pollInterval: 30000 } // Poll every 30 seconds
  )
  const [visible, setVisible] = useState<AchievementNotification | null>(null)
  const [queue, setQueue] = useState<AchievementNotification[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (data?.achievementNotifications && data.achievementNotifications.length > 0) {
      // Add new notifications to queue, excluding already dismissed ones
      const newNotifications = data.achievementNotifications.filter(
        (notif) =>
          !dismissedIds.has(notif.id) &&
          !queue.find((q) => q.id === notif.id) &&
          (!visible || visible.id !== notif.id)
      )
      if (newNotifications.length > 0) {
        setQueue((prev) => [...prev, ...newNotifications])
      }
    }
  }, [data, dismissedIds])

  useEffect(() => {
    // Show next notification from queue if none is currently visible
    if (!visible && queue.length > 0) {
      const [next, ...rest] = queue
      setVisible(next)
      setQueue(rest)
    }
  }, [visible, queue])

  const dismiss = async () => {
    if (visible) {
      // Add to dismissed IDs to prevent re-showing
      setDismissedIds((prev) => new Set(prev).add(visible.id))

      // Mark as read via GraphQL mutation
      try {
        await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            query: `
              mutation MarkNotificationRead($id: ID!) {
                markAchievementNotificationRead(id: $id) {
                  id
                }
              }
            `,
            variables: { id: visible.id },
          }),
        })
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }

      setVisible(null)

      // Refetch after a delay to allow backend to process
      setTimeout(() => refetch(), 1000)

      // Auto-show next notification after a delay
      if (queue.length > 0) {
        setTimeout(() => {
          const [next, ...rest] = queue
          setVisible(next)
          setQueue(rest)
        }, 500)
      }
    }
  }

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dismiss()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-2xl p-6 max-w-sm border-4 border-yellow-300">
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            {visible.achievement.iconUrl ? (
              <img
                src={visible.achievement.iconUrl}
                alt={visible.achievement.name}
                className="w-12 h-12"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent && !parent.querySelector('.fallback-icon')) {
                    const icon = document.createElement('div')
                    icon.className = 'fallback-icon'
                    icon.innerHTML = '<svg class="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>'
                    parent.appendChild(icon)
                  }
                }}
              />
            ) : (
              <Award className="w-10 h-10 text-yellow-600" />
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide mb-1">
              Achievement Unlocked!
            </p>
            <h3 className="text-lg font-bold mb-1">{visible.achievement.name}</h3>
            <p className="text-sm text-white/90">{visible.achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
