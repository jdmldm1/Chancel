import type { Context } from './index.js'
import { UserRole } from '@prisma/client'
import { AchievementService } from '../../services/achievements.js'

export const achievementResolvers = {
  Query: {
    achievements: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated')

      // Show all non-hidden, plus hidden ones user has unlocked
      const userAchievements = await context.prisma.userAchievement.findMany({
        where: { userId: context.userId },
        select: { achievementId: true },
      })

      const unlockedHiddenIds = userAchievements.map(ua => ua.achievementId)

      return context.prisma.achievement.findMany({
        where: {
          OR: [
            { isHidden: false },
            { id: { in: unlockedHiddenIds } },
          ],
        },
        orderBy: [{ category: 'asc' }, { criteriaValue: 'asc' }],
      })
    },

    achievement: async (_parent: unknown, args: { id: string }, context: Context) => {
      return context.prisma.achievement.findUnique({ where: { id: args.id } })
    },

    myAchievements: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated')

      return context.prisma.userAchievement.findMany({
        where: { userId: context.userId },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      })
    },

    userAchievements: async (_parent: unknown, args: { userId: string }, context: Context) => {
      // Public view - only show non-hidden achievements
      return context.prisma.userAchievement.findMany({
        where: {
          userId: args.userId,
          achievement: { isHidden: false },
        },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      })
    },

    achievementProgress: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated')
      const achievementService = new AchievementService(context.prisma)
      return achievementService.getAchievementProgress(context.userId)
    },

    myStreak: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated')
      return context.prisma.userStreak.findUnique({ where: { userId: context.userId } })
    },

    achievementNotifications: async (
      _parent: unknown,
      args: { unreadOnly?: boolean },
      context: Context
    ) => {
      if (!context.userId) throw new Error('Not authenticated')

      return context.prisma.achievementNotification.findMany({
        where: {
          userId: context.userId,
          ...(args.unreadOnly ? { read: false } : {}),
        },
        include: { achievement: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
    },

    achievementStats: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated')

      const [allAchievements, userAchievements] = await Promise.all([
        context.prisma.achievement.findMany({ where: { isHidden: false } }),
        context.prisma.userAchievement.findMany({
          where: { userId: context.userId },
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
        }),
      ])

      // Group by category
      const byCategory = []
      const categories = [...new Set(allAchievements.map(a => a.category))]

      for (const category of categories) {
        const total = allAchievements.filter(a => a.category === category).length
        const unlocked = userAchievements.filter(ua => ua.achievement.category === category).length
        byCategory.push({ category, total, unlocked })
      }

      return {
        totalUnlocked: userAchievements.length,
        totalAvailable: allAchievements.length,
        byCategory,
        recentUnlocks: userAchievements.slice(0, 5),
      }
    },
  },

  Mutation: {
    checkAchievements: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated')
      const achievementService = new AchievementService(context.prisma)
      return achievementService.checkAndUnlockAchievements(context.userId)
    },

    awardAchievement: async (
      _parent: unknown,
      args: { userId: string; achievementId: string },
      context: Context
    ) => {
      if (!context.userId) throw new Error('Not authenticated')

      // Check admin role
      const user = await context.prisma.user.findUnique({ where: { id: context.userId } })
      if (user?.role !== UserRole.ADMIN) {
        throw new Error('Only admins can manually award achievements')
      }

      const existing = await context.prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId: args.userId,
            achievementId: args.achievementId,
          },
        },
      })

      if (existing) {
        throw new Error('User already has this achievement')
      }

      const userAchievement = await context.prisma.userAchievement.create({
        data: {
          userId: args.userId,
          achievementId: args.achievementId,
        },
        include: { achievement: true },
      })

      await context.prisma.achievementNotification.create({
        data: { userId: args.userId, achievementId: args.achievementId },
      })

      return userAchievement
    },

    markAchievementNotificationRead: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) throw new Error('Not authenticated')

      const notification = await context.prisma.achievementNotification.findUnique({
        where: { id: args.id },
      })

      if (notification?.userId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.achievementNotification.update({
        where: { id: args.id },
        data: { read: true },
        include: { achievement: true },
      })
    },

    markAllAchievementNotificationsRead: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ) => {
      if (!context.userId) throw new Error('Not authenticated')

      await context.prisma.achievementNotification.updateMany({
        where: { userId: context.userId, read: false },
        data: { read: true },
      })

      return true
    },

    seedAchievements: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated')

      const user = await context.prisma.user.findUnique({ where: { id: context.userId } })
      if (user?.role !== UserRole.ADMIN) {
        throw new Error('Only admins can seed achievements')
      }

      const { seedAchievements } = await import('../../scripts/seedAchievements.js')
      await seedAchievements(context.prisma)

      // Clear cache after seeding
      const achievementService = new AchievementService(context.prisma)
      achievementService.clearCache()

      return true
    },
  },

  // Field resolvers
  Achievement: {
    // All fields are direct database fields
  },

  UserAchievement: {
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      return context.loaders.userLoader.load(parent.userId)
    },
    achievement: (parent: { achievementId: string }, _args: unknown, context: Context) => {
      return context.prisma.achievement.findUnique({ where: { id: parent.achievementId } })
    },
  },

  UserStreak: {
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      return context.loaders.userLoader.load(parent.userId)
    },
  },

  AchievementNotification: {
    achievement: (parent: { achievementId: string }, _args: unknown, context: Context) => {
      return context.prisma.achievement.findUnique({ where: { id: parent.achievementId } })
    },
  },
}
