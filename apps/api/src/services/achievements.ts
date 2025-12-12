import type { PrismaClient } from '@prisma/client'
import { AchievementCategory, CriteriaType } from '@prisma/client'

export class AchievementService {
  private achievementCache: any[] | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(private prisma: PrismaClient) {}

  /**
   * Check and unlock achievements for a user
   * Called after significant actions (comment, complete passage, etc.)
   */
  async checkAndUnlockAchievements(userId: string): Promise<any[]> {
    try {
      const newAchievements: any[] = []

      // Get all achievements user hasn't unlocked yet
      const existingAchievements = await this.prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true },
      })
      const unlockedIds = existingAchievements.map(ua => ua.achievementId)

      const availableAchievements = await this.getCachedAchievements()
      const toCheck = availableAchievements.filter(
        a => !unlockedIds.includes(a.id) &&
             (a.criteriaType === CriteriaType.COUNT || a.criteriaType === CriteriaType.COMPOSITE)
      )

      // Check each achievement in parallel
      const checks = await Promise.all(
        toCheck.map(async (achievement) => {
          const currentValue = await this.getCurrentValue(userId, achievement.category)
          return { achievement, currentValue, shouldUnlock: currentValue >= achievement.criteriaValue }
        })
      )

      // Unlock all eligible achievements
      for (const { achievement, currentValue, shouldUnlock } of checks) {
        if (shouldUnlock) {
          const userAchievement = await this.prisma.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
              progress: currentValue,
            },
            include: { achievement: true },
          })

          // Create in-app notification
          await this.prisma.achievementNotification.create({
            data: {
              userId,
              achievementId: achievement.id,
            },
          })

          newAchievements.push(userAchievement)
        }
      }

      return newAchievements
    } catch (error) {
      console.error('Error checking achievements:', error)
      return []
    }
  }

  /**
   * Get cached achievement definitions
   */
  private async getCachedAchievements(): Promise<any[]> {
    const now = Date.now()
    if (!this.achievementCache || (now - this.cacheTimestamp) > this.CACHE_TTL) {
      this.achievementCache = await this.prisma.achievement.findMany()
      this.cacheTimestamp = now
    }
    return this.achievementCache
  }

  /**
   * Get current count for an achievement category
   */
  private async getCurrentValue(userId: string, category: AchievementCategory): Promise<number> {
    try {
      switch (category) {
        case AchievementCategory.SCRIPTURE_READING:
          return this.prisma.passageCompletion.count({ where: { userId } })

        case AchievementCategory.SESSION_PARTICIPATION:
          return this.prisma.sessionParticipant.count({ where: { userId } })

        case AchievementCategory.SESSION_COMPLETION:
          return this.getCompletedSessionsCount(userId)

        case AchievementCategory.COMMENTING:
          return this.getTotalCommentsCount(userId)

        case AchievementCategory.GROUP_PARTICIPATION:
          return this.prisma.groupMember.count({ where: { userId } })

        case AchievementCategory.STREAK:
          const streak = await this.prisma.userStreak.findUnique({ where: { userId } })
          return streak?.currentStreak || 0

        default:
          return 0
      }
    } catch (error) {
      console.error(`Error getting current value for category ${category}:`, error)
      return 0
    }
  }

  /**
   * Count sessions where user completed all passages
   */
  private async getCompletedSessionsCount(userId: string): Promise<number> {
    try {
      const sessions = await this.prisma.session.findMany({
        where: {
          OR: [
            { leaderId: userId },
            { participants: { some: { userId } } },
          ],
        },
        include: {
          scripturePassages: {
            include: {
              completions: { where: { userId } },
            },
          },
        },
      })

      return sessions.filter(session => {
        if (session.scripturePassages.length === 0) return false
        return session.scripturePassages.every(p => p.completions.length > 0)
      }).length
    } catch (error) {
      console.error('Error counting completed sessions:', error)
      return 0
    }
  }

  /**
   * Count total comments (passage + session chat + group chat)
   */
  private async getTotalCommentsCount(userId: string): Promise<number> {
    try {
      const [passageComments, sessionChats, groupChats] = await Promise.all([
        this.prisma.comment.count({ where: { userId } }),
        this.prisma.chatMessage.count({ where: { userId } }),
        this.prisma.groupChatMessage.count({ where: { userId } }),
      ])
      return passageComments + sessionChats + groupChats
    } catch (error) {
      console.error('Error counting total comments:', error)
      return 0
    }
  }

  /**
   * Update user's activity streak
   */
  async updateStreak(userId: string): Promise<void> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const streak = await this.prisma.userStreak.findUnique({ where: { userId } })

      if (!streak) {
        // Create new streak
        await this.prisma.userStreak.create({
          data: {
            userId,
            currentStreak: 1,
            longestStreak: 1,
            lastActivityDate: today,
          },
        })
        // Check for streak achievements
        await this.checkStreakAchievements(userId, 1)
      } else {
        const lastActivity = new Date(streak.lastActivityDate)
        lastActivity.setHours(0, 0, 0, 0)

        const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff === 0) {
          // Same day, no update needed
          return
        } else if (daysDiff === 1) {
          // Consecutive day
          const newStreak = streak.currentStreak + 1
          await this.prisma.userStreak.update({
            where: { userId },
            data: {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, streak.longestStreak),
              lastActivityDate: today,
            },
          })

          // Check streak achievements
          await this.checkStreakAchievements(userId, newStreak)
        } else {
          // Streak broken
          await this.prisma.userStreak.update({
            where: { userId },
            data: {
              currentStreak: 1,
              lastActivityDate: today,
            },
          })
          // Check for day 1 streak achievement
          await this.checkStreakAchievements(userId, 1)
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error)
    }
  }

  /**
   * Check and unlock streak-based achievements
   */
  private async checkStreakAchievements(userId: string, streakCount: number): Promise<void> {
    try {
      const streakAchievements = await this.prisma.achievement.findMany({
        where: {
          category: AchievementCategory.STREAK,
          criteriaValue: { lte: streakCount },
        },
      })

      for (const achievement of streakAchievements) {
        const existing = await this.prisma.userAchievement.findUnique({
          where: {
            userId_achievementId: { userId, achievementId: achievement.id },
          },
        })

        if (!existing) {
          await this.prisma.userAchievement.create({
            data: { userId, achievementId: achievement.id, progress: streakCount },
          })

          await this.prisma.achievementNotification.create({
            data: { userId, achievementId: achievement.id },
          })
        }
      }
    } catch (error) {
      console.error('Error checking streak achievements:', error)
    }
  }

  /**
   * Get user's progress toward all achievements
   */
  async getAchievementProgress(userId: string): Promise<any[]> {
    try {
      const allAchievements = await this.prisma.achievement.findMany({
        where: { isHidden: false },
      })

      const unlockedAchievements = await this.prisma.userAchievement.findMany({
        where: { userId },
      })

      const unlockedMap = new Map(
        unlockedAchievements.map(ua => [ua.achievementId, ua])
      )

      const progress = await Promise.all(
        allAchievements.map(async (achievement) => {
          const unlocked = unlockedMap.get(achievement.id)
          const currentValue = await this.getCurrentValue(userId, achievement.category)

          return {
            achievement,
            currentValue,
            targetValue: achievement.criteriaValue,
            percentage: Math.min(100, (currentValue / achievement.criteriaValue) * 100),
            isUnlocked: !!unlocked,
            unlockedAt: unlocked?.unlockedAt || null,
          }
        })
      )

      return progress
    } catch (error) {
      console.error('Error getting achievement progress:', error)
      return []
    }
  }

  /**
   * Check hidden achievements after specific actions
   */
  async checkHiddenAchievements(userId: string, action: string, metadata?: any): Promise<void> {
    try {
      switch (action) {
        case 'FIRST_COMMENT':
          await this.checkFirstComment(userId)
          break
        case 'EARLY_BIRD':
          await this.checkEarlyBird(userId, metadata?.timestamp || new Date())
          break
        case 'NIGHT_OWL':
          await this.checkNightOwl(userId, metadata?.timestamp || new Date())
          break
        case 'CONVERSATION_STARTER':
          await this.checkConversationStarter(userId, metadata?.commentId)
          break
        case 'PRAYER_WARRIOR':
          await this.checkPrayerWarrior(userId)
          break
      }
    } catch (error) {
      console.error(`Error checking hidden achievement ${action}:`, error)
    }
  }

  private async checkFirstComment(userId: string): Promise<void> {
    const commentCount = await this.prisma.comment.count({ where: { userId } })
    if (commentCount === 1) {
      const achievement = await this.prisma.achievement.findFirst({
        where: { code: 'HIDDEN_FIRST_COMMENT' },
      })
      if (achievement) {
        await this.unlockAchievement(userId, achievement.id)
      }
    }
  }

  private async checkEarlyBird(userId: string, timestamp: Date): Promise<void> {
    const hour = timestamp.getHours()
    if (hour < 6) {
      const achievement = await this.prisma.achievement.findFirst({
        where: { code: 'HIDDEN_EARLY_BIRD' },
      })
      if (achievement) {
        await this.unlockAchievement(userId, achievement.id)
      }
    }
  }

  private async checkNightOwl(userId: string, timestamp: Date): Promise<void> {
    const hour = timestamp.getHours()
    if (hour >= 22) {
      const achievement = await this.prisma.achievement.findFirst({
        where: { code: 'HIDDEN_NIGHT_OWL' },
      })
      if (achievement) {
        await this.unlockAchievement(userId, achievement.id)
      }
    }
  }

  private async checkConversationStarter(userId: string, commentId: string): Promise<void> {
    if (!commentId) return

    const replyCount = await this.prisma.comment.count({
      where: { parentId: commentId },
    })

    if (replyCount >= 10) {
      const achievement = await this.prisma.achievement.findFirst({
        where: { code: 'HIDDEN_CONVERSATION_STARTER' },
      })
      if (achievement) {
        await this.unlockAchievement(userId, achievement.id)
      }
    }
  }

  private async checkPrayerWarrior(userId: string): Promise<void> {
    const prayerCount = await this.prisma.prayerRequest.count({ where: { userId } })
    if (prayerCount >= 50) {
      const achievement = await this.prisma.achievement.findFirst({
        where: { code: 'HIDDEN_PRAYER_WARRIOR' },
      })
      if (achievement) {
        await this.unlockAchievement(userId, achievement.id)
      }
    }
  }

  private async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const existing = await this.prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId } },
    })

    if (!existing) {
      await this.prisma.userAchievement.create({
        data: { userId, achievementId },
      })

      await this.prisma.achievementNotification.create({
        data: { userId, achievementId },
      })
    }
  }

  /**
   * Clear achievement cache (call after seeding or updating achievements)
   */
  clearCache(): void {
    this.achievementCache = null
    this.cacheTimestamp = 0
  }
}
