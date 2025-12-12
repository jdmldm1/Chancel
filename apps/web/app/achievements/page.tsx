'use client'

import { useGraphQLQuery } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Award, Lock, TrendingUp } from 'lucide-react'

const PROGRESS_QUERY = `
  query AchievementProgress {
    achievementProgress {
      achievement {
        id
        name
        description
        iconUrl
        tier
        category
      }
      currentValue
      targetValue
      percentage
      isUnlocked
      unlockedAt
    }
    achievementStats {
      totalUnlocked
      totalAvailable
      byCategory {
        category
        unlocked
        total
      }
    }
    myStreak {
      currentStreak
      longestStreak
    }
  }
`

interface Achievement {
  id: string
  name: string
  description: string
  iconUrl?: string
  tier?: string
  category: string
}

interface AchievementProgress {
  achievement: Achievement
  currentValue: number
  targetValue: number
  percentage: number
  isUnlocked: boolean
  unlockedAt?: string
}

interface CategoryStats {
  category: string
  unlocked: number
  total: number
}

interface AchievementStats {
  totalUnlocked: number
  totalAvailable: number
  byCategory: CategoryStats[]
}

interface UserStreak {
  currentStreak: number
  longestStreak: number
}

export default function AchievementsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { data, loading } = useGraphQLQuery<{
    achievementProgress: AchievementProgress[]
    achievementStats: AchievementStats
    myStreak?: UserStreak
  }>(PROGRESS_QUERY, {
    skip: status === 'loading' || status === 'unauthenticated',
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading achievements...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  // Group by category
  const grouped = (data?.achievementProgress || []).reduce((acc, item) => {
    const cat = item.achievement.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, AchievementProgress[]>)

  const categoryOrder = [
    'SCRIPTURE_READING',
    'SESSION_PARTICIPATION',
    'SESSION_COMPLETION',
    'COMMENTING',
    'GROUP_PARTICIPATION',
    'STREAK',
    'SPECIAL_EVENT',
    'HIDDEN',
  ]

  const categoryNames: Record<string, string> = {
    SCRIPTURE_READING: 'Scripture Reading',
    SESSION_PARTICIPATION: 'Session Participation',
    SESSION_COMPLETION: 'Session Completion',
    COMMENTING: 'Engagement & Comments',
    GROUP_PARTICIPATION: 'Group Membership',
    STREAK: 'Activity Streaks',
    SPECIAL_EVENT: 'Special Events',
    HIDDEN: 'Secret Achievements',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">
            {data?.achievementStats.totalUnlocked || 0} of {data?.achievementStats.totalAvailable || 0} badges unlocked
            {' '}({Math.round(((data?.achievementStats.totalUnlocked || 0) / (data?.achievementStats.totalAvailable || 1)) * 100)}%)
          </p>
        </div>

        {/* Streak Card */}
        {data?.myStreak && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100 mb-1">Current Streak</p>
                <p className="text-4xl font-bold">{data.myStreak.currentStreak} days</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-orange-100 mb-1">Longest Streak</p>
                <p className="text-4xl font-bold">{data.myStreak.longestStreak} days</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}

        {/* Category Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {data?.achievementStats.byCategory.map((cat) => {
            const percentage = cat.total > 0 ? Math.round((cat.unlocked / cat.total) * 100) : 0
            return (
              <div key={cat.category} className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  {categoryNames[cat.category] || cat.category}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{cat.unlocked}</span>
                  <span className="text-sm text-gray-500">/ {cat.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Achievements by Category */}
        {categoryOrder.map((category) => {
          const items = grouped[category]
          if (!items || items.length === 0) return null

          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {categoryNames[category] || category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.achievement.id}
                    className={`
                      bg-white rounded-lg border-2 p-6 transition-all
                      ${
                        item.isUnlocked
                          ? 'border-yellow-400 shadow-lg'
                          : 'border-gray-200 opacity-60'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                        w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0
                        ${
                          item.isUnlocked
                            ? getTierColor(item.achievement.tier)
                            : 'bg-gray-200'
                        }
                      `}
                      >
                        {item.isUnlocked ? (
                          item.achievement.iconUrl ? (
                            <img
                              src={item.achievement.iconUrl}
                              alt={item.achievement.name}
                              className="w-10 h-10"
                            />
                          ) : (
                            <Award className="w-8 h-8 text-white" />
                          )
                        ) : (
                          <Lock className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.achievement.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.achievement.description}
                        </p>

                        {!item.isUnlocked && (
                          <>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(100, item.percentage)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              {item.currentValue} / {item.targetValue}
                            </p>
                          </>
                        )}

                        {item.isUnlocked && item.unlockedAt && (
                          <p className="text-xs text-green-600 font-medium">
                            Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {(!data?.achievementProgress || data.achievementProgress.length === 0) && (
          <div className="text-center py-20">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No achievements available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

function getTierColor(tier?: string | null) {
  switch (tier) {
    case 'BRONZE':
      return 'bg-gradient-to-br from-amber-600 to-amber-800'
    case 'SILVER':
      return 'bg-gradient-to-br from-gray-400 to-gray-600'
    case 'GOLD':
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600'
    case 'PLATINUM':
      return 'bg-gradient-to-br from-cyan-400 to-cyan-600'
    case 'DIAMOND':
      return 'bg-gradient-to-br from-purple-400 to-purple-600'
    default:
      return 'bg-gradient-to-br from-blue-500 to-indigo-500'
  }
}
