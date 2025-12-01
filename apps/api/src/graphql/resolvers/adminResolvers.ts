import { UserRole } from '@prisma/client'
import type { Context } from './index'

// Helper function to check if user is admin
const requireAdmin = (context: Context) => {
  if (!context.userId) {
    throw new Error('Not authenticated')
  }

  // We'll check the role in the resolver itself
  return context.userId
}

export const adminResolvers = {
  Query: {
    allUsers: async (_parent: unknown, _args: unknown, context: Context) => {
      const userId = requireAdmin(context)

      const user = await context.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user || user.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      return context.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      })
    },

    allSessions: async (_parent: unknown, _args: unknown, context: Context) => {
      const userId = requireAdmin(context)

      const user = await context.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user || user.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      return context.prisma.session.findMany({
        orderBy: { createdAt: 'desc' },
      })
    },

    allGroups: async (_parent: unknown, _args: unknown, context: Context) => {
      const userId = requireAdmin(context)

      const user = await context.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user || user.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      return context.prisma.group.findMany({
        orderBy: { createdAt: 'desc' },
      })
    },

    adminStats: async (_parent: unknown, _args: unknown, context: Context) => {
      const userId = requireAdmin(context)

      const user = await context.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user || user.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      const [
        totalUsers,
        totalLeaders,
        totalMembers,
        totalSessions,
        totalGroups,
        totalComments,
        totalPrayerRequests,
      ] = await Promise.all([
        context.prisma.user.count(),
        context.prisma.user.count({ where: { role: UserRole.LEADER } }),
        context.prisma.user.count({ where: { role: UserRole.MEMBER } }),
        context.prisma.session.count(),
        context.prisma.group.count(),
        context.prisma.comment.count(),
        context.prisma.prayerRequest.count(),
      ])

      return {
        totalUsers,
        totalLeaders,
        totalMembers,
        totalSessions,
        totalGroups,
        totalComments,
        totalPrayerRequests,
      }
    },
  },

  Mutation: {
    adminDeleteUser: async (
      _parent: unknown,
      args: { userId: string },
      context: Context
    ) => {
      const adminId = requireAdmin(context)

      const admin = await context.prisma.user.findUnique({
        where: { id: adminId },
      })

      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      // Prevent deleting yourself
      if (args.userId === adminId) {
        throw new Error('Cannot delete your own admin account')
      }

      await context.prisma.user.delete({
        where: { id: args.userId },
      })

      return true
    },

    adminUpdateUserRole: async (
      _parent: unknown,
      args: { userId: string; role: UserRole },
      context: Context
    ) => {
      const adminId = requireAdmin(context)

      const admin = await context.prisma.user.findUnique({
        where: { id: adminId },
      })

      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      // Prevent changing your own role
      if (args.userId === adminId) {
        throw new Error('Cannot change your own admin role')
      }

      return context.prisma.user.update({
        where: { id: args.userId },
        data: { role: args.role },
      })
    },

    adminDeleteSession: async (
      _parent: unknown,
      args: { sessionId: string },
      context: Context
    ) => {
      const adminId = requireAdmin(context)

      const admin = await context.prisma.user.findUnique({
        where: { id: adminId },
      })

      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      await context.prisma.session.delete({
        where: { id: args.sessionId },
      })

      return true
    },

    adminDeleteGroup: async (
      _parent: unknown,
      args: { groupId: string },
      context: Context
    ) => {
      const adminId = requireAdmin(context)

      const admin = await context.prisma.user.findUnique({
        where: { id: adminId },
      })

      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      await context.prisma.group.delete({
        where: { id: args.groupId },
      })

      return true
    },

    adminDeleteSeries: async (
      _parent: unknown,
      args: { seriesId: string },
      context: Context
    ) => {
      const adminId = requireAdmin(context)

      const admin = await context.prisma.user.findUnique({
        where: { id: adminId },
      })

      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Admin access required')
      }

      await context.prisma.series.delete({
        where: { id: args.seriesId },
      })

      return true
    },
  },
}
