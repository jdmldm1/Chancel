'use client'

import { useGraphQLQuery } from '@/lib/graphql-client-new'
import Link from 'next/link'
import { Award } from 'lucide-react'

const ACHIEVEMENT_STATS_QUERY = `
  query AchievementStats {
    achievementStats {
      totalUnlocked
      totalAvailable
      recentUnlocks {
        id
        unlockedAt
        achievement {
          id
          name
          iconUrl
          tier
        }
      }
    }
  }
`

interface RecentUnlock {
  id: string
  unlockedAt: string
  achievement: {
    id: string
    name: string
    iconUrl?: string
    tier?: string
  }
}

interface AchievementStats {
  totalUnlocked: number
  totalAvailable: number
  recentUnlocks: RecentUnlock[]
}

export function BadgeWidget() {
  const { data, loading } = useGraphQLQuery<{ achievementStats: AchievementStats }>(
    ACHIEVEMENT_STATS_QUERY
  )

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const stats = data?.achievementStats
  const percentage = stats ? Math.round((stats.totalUnlocked / stats.totalAvailable) * 100) : 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Achievements</h2>
        <Link
          href="/achievements"
          className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats?.totalUnlocked || 0}
            </span>
            <span className="text-sm text-gray-500">
              / {stats?.totalAvailable || 0} badges
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-white" />
        </div>
      </div>

      {stats?.recentUnlocks && stats.recentUnlocks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Recently Unlocked</p>
          <div className="flex gap-2">
            {stats.recentUnlocks.slice(0, 5).map((unlock) => (
              <div
                key={unlock.id}
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center border-2 border-yellow-300"
                title={unlock.achievement.name}
              >
                {unlock.achievement.iconUrl ? (
                  <img
                    src={unlock.achievement.iconUrl}
                    alt={unlock.achievement.name}
                    className="w-8 h-8"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent && !parent.querySelector('.fallback-icon')) {
                        const icon = document.createElement('div')
                        icon.className = 'fallback-icon'
                        icon.innerHTML = '<svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>'
                        parent.appendChild(icon)
                      }
                    }}
                  />
                ) : (
                  <Award className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(!stats?.recentUnlocks || stats.recentUnlocks.length === 0) && (
        <div className="text-center py-4 text-gray-400">
          <Award className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-xs">Start engaging to earn badges!</p>
        </div>
      )}
    </div>
  )
}
