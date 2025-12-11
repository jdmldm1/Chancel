import { GraphQLScalarType, Kind } from 'graphql'
import type { PrismaClient } from '@prisma/client'
import { UserRole, ResourceType, SessionVisibility, JoinRequestStatus, ReactionType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { groupResolvers } from './groupResolvers.js'
import { adminResolvers } from './adminResolvers.js'
import { emailService } from '../../services/email.js'

export interface Context {
  prisma: PrismaClient
  userId?: string // Will be set by auth middleware
  loaders: any // DataLoader instances
}

// Custom DateTime scalar
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString()
    }
    throw Error('GraphQL DateTime Scalar serializer expected a `Date` object')
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value)
    }
    throw Error('GraphQL DateTime Scalar parser expected a `string`')
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  },
})

// Merge all resolvers
const baseResolvers = {
  DateTime: dateTimeScalar,

  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }
      return context.prisma.user.findUnique({
        where: { id: context.userId },
      })
    },

    user: async (_parent: unknown, args: { id: string }, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: args.id },
      })
    },

    users: async (_parent: unknown, _args: unknown, context: Context) => {
      return context.prisma.user.findMany()
    },

    session: async (_parent: unknown, args: { id: string }, context: Context) => {
      return context.prisma.session.findUnique({
        where: { id: args.id },
      })
    },

    sessions: async (_parent: unknown, args: { limit?: number; offset?: number }, context: Context) => {
      return context.prisma.session.findMany({
        take: args.limit || 100,
        skip: args.offset || 0,
        orderBy: { startDate: 'desc' },
      })
    },

    publicSessions: async (_parent: unknown, args: { limit?: number; offset?: number }, context: Context) => {
      return context.prisma.session.findMany({
        where: { visibility: SessionVisibility.PUBLIC },
        take: args.limit || 100,
        skip: args.offset || 0,
        orderBy: { startDate: 'desc' },
      })
    },

    mySessions: async (_parent: unknown, args: { limit?: number; offset?: number }, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Optimized: Single query using OR clause instead of 2 queries + in-memory merge
      return context.prisma.session.findMany({
        where: {
          OR: [
            { leaderId: context.userId },
            { participants: { some: { userId: context.userId } } }
          ]
        },
        take: args.limit || 100,
        skip: args.offset || 0,
        orderBy: { startDate: 'desc' },
      })
    },

    series: async (_parent: unknown, args: { id: string }, context: Context) => {
      return context.prisma.series.findUnique({
        where: { id: args.id },
      })
    },

    allSeries: async (_parent: unknown, _args: unknown, context: Context) => {
      return context.prisma.series.findMany({
        orderBy: { createdAt: 'desc' },
      })
    },

    mySeries: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Return series where user is leader OR participant in any session
      return context.prisma.series.findMany({
        where: {
          OR: [
            { leaderId: context.userId },
            {
              sessions: {
                some: {
                  participants: {
                    some: { userId: context.userId }
                  }
                }
              }
            }
          ]
        },
        orderBy: { createdAt: 'desc' },
      })
    },

    myJoinRequests: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      return context.prisma.joinRequest.findMany({
        where: { toId: context.userId },
        orderBy: { createdAt: 'desc' },
      })
    },

    sessionJoinRequests: async (_parent: unknown, args: { sessionId: string }, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check if user is the leader
      const session = await context.prisma.session.findUnique({
        where: { id: args.sessionId },
      })

      if (!session || session.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.joinRequest.findMany({
        where: { sessionId: args.sessionId },
        orderBy: { createdAt: 'desc' },
      })
    },

    comments: async (_parent: unknown, args: { sessionId: string }, context: Context) => {
      return context.prisma.comment.findMany({
        where: { sessionId: args.sessionId },
        orderBy: { createdAt: 'asc' },
      })
    },

    commentsByPassage: async (_parent: unknown, args: { passageId: string }, context: Context) => {
      return context.prisma.comment.findMany({
        where: { passageId: args.passageId },
        orderBy: { createdAt: 'asc' },
      })
    },

    scripturePassages: async (_parent: unknown, args: { sessionId: string }, context: Context) => {
      return context.prisma.scripturePassage.findMany({
        where: { sessionId: args.sessionId },
        orderBy: { order: 'asc' },
      })
    },

    sessionResources: async (_parent: unknown, args: { sessionId: string }, context: Context) => {
      return context.prisma.sessionResource.findMany({
        where: { sessionId: args.sessionId },
        orderBy: { createdAt: 'desc' },
      })
    },

    chatMessages: async (_parent: unknown, args: { sessionId: string }, context: Context) => {
      return context.prisma.chatMessage.findMany({
        where: { sessionId: args.sessionId },
        orderBy: { createdAt: 'asc' },
      })
    },

    // Bible library queries
    bibleBooks: async (_parent: unknown, _args: unknown, context: Context) => {
      // Get unique books with chapter counts
      const books = await context.prisma.scriptureLibrary.groupBy({
        by: ['book', 'bookNumber'],
        _max: {
          chapter: true,
        },
        orderBy: {
          bookNumber: 'asc',
        },
      })

      return books.map(b => ({
        name: b.book,
        number: b.bookNumber,
        chapterCount: b._max.chapter || 0,
      }))
    },

    biblePassages: async (
      _parent: unknown,
      args: { book: string; chapter: number },
      context: Context
    ) => {
      return context.prisma.scriptureLibrary.findMany({
        where: {
          book: args.book,
          chapter: args.chapter,
        },
        orderBy: {
          verseStart: 'asc',
        },
      })
    },

    searchBible: async (_parent: unknown, args: { query: string }, context: Context) => {
      if (!args.query || args.query.trim().length < 2) {
        return []
      }

      return context.prisma.scriptureLibrary.findMany({
        where: {
          content: {
            contains: args.query,
            mode: 'insensitive',
          },
        },
        take: 50, // Limit results
        orderBy: [
          { bookNumber: 'asc' },
          { chapter: 'asc' },
          { verseStart: 'asc' },
        ],
      })
    },

    prayerRequests: async (_parent: unknown, _args: unknown, context: Context) => {
      return context.prisma.prayerRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          reactions: true,
        },
      })
    },

    prayerRequest: async (_parent: unknown, args: { id: string }, context: Context) => {
      return context.prisma.prayerRequest.findUnique({
        where: { id: args.id },
        include: {
          reactions: true,
        },
      })
    },
  },

  Mutation: {
    signup: async (
      _parent: unknown,
      args: { email: string; password: string; name: string; role: UserRole },
      context: Context
    ) => {
      const { email, password, name, role } = args

      // Check if user already exists
      const existingUser = await context.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await context.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      })

      return user
    },

    updateUser: async (
      _parent: unknown,
      args: { input: { name?: string; email?: string } },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // If email is being updated, check if it's already taken
      if (args.input.email) {
        const existingUser = await context.prisma.user.findUnique({
          where: { email: args.input.email },
        })

        if (existingUser && existingUser.id !== context.userId) {
          throw new Error('Email is already in use')
        }
      }

      return context.prisma.user.update({
        where: { id: context.userId },
        data: args.input,
      })
    },

    changePassword: async (
      _parent: unknown,
      args: { currentPassword: string; newPassword: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Get current user with password
      const user = await context.prisma.user.findUnique({
        where: { id: context.userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Verify current password
      const isValid = await bcrypt.compare(args.currentPassword, user.password)
      if (!isValid) {
        throw new Error('Current password is incorrect')
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(args.newPassword, 10)

      // Update password
      await context.prisma.user.update({
        where: { id: context.userId },
        data: { password: hashedPassword },
      })

      return true
    },

    createSeries: async (
      _parent: unknown,
      args: {
        input: {
          title: string
          description?: string
          imageUrl?: string
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check if user has LEADER role
      const user = await context.prisma.user.findUnique({
        where: { id: context.userId },
      })

      if (!user || user.role !== UserRole.LEADER) {
        throw new Error('Only leaders can create series')
      }

      return context.prisma.series.create({
        data: {
          title: args.input.title,
          description: args.input.description,
          imageUrl: args.input.imageUrl,
          leaderId: context.userId,
        },
      })
    },

    updateSeries: async (
      _parent: unknown,
      args: {
        id: string
        input: { title?: string; description?: string; imageUrl?: string }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const series = await context.prisma.series.findUnique({
        where: { id: args.id },
      })

      if (!series || series.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.series.update({
        where: { id: args.id },
        data: args.input,
      })
    },

    deleteSeries: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const series = await context.prisma.series.findUnique({
        where: { id: args.id },
      })

      if (!series || series.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.series.delete({
        where: { id: args.id },
      })
    },

    createSession: async (
      _parent: unknown,
      args: {
        input: {
          title: string
          description?: string
          startDate: Date
          endDate: Date
          seriesId?: string
          visibility?: SessionVisibility
          videoCallUrl?: string
          imageUrl?: string
          scripturePassages: {
            book: string
            chapter: number
            verseStart: number
            verseEnd?: number
            content: string
            note?: string
          }[]
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check if user has LEADER role
      const user = await context.prisma.user.findUnique({
        where: { id: context.userId },
      })

      if (!user || user.role !== UserRole.LEADER) {
        throw new Error('Only leaders can create sessions')
      }

      const { title, description, startDate, endDate, seriesId, visibility, videoCallUrl, imageUrl, scripturePassages } = args.input

      // Generate join code for all sessions
      const { generateUniqueJoinCode } = await import('../../lib/generateJoinCode.js')
      const joinCode = await generateUniqueJoinCode()

      // Create the session
      const session = await context.prisma.session.create({
        data: {
          title,
          description,
          startDate,
          endDate,
          seriesId,
          visibility: visibility || SessionVisibility.PUBLIC,
          videoCallUrl,
          imageUrl,
          joinCode,
          leaderId: context.userId,
          scripturePassages: {
            create: scripturePassages.map((passage, index) => ({
              ...passage,
              order: index,
            })),
          },
        },
      })

      // If this session is part of a series, auto-add all existing series participants
      if (seriesId) {
        // Get all unique participants from other sessions in this series
        const seriesParticipants = await context.prisma.sessionParticipant.findMany({
          where: {
            session: {
              seriesId: seriesId,
            },
          },
          select: {
            userId: true,
          },
          distinct: ['userId'],
        })

        // Add each participant to the new session
        if (seriesParticipants.length > 0) {
          await context.prisma.sessionParticipant.createMany({
            data: seriesParticipants.map((participant) => ({
              sessionId: session.id,
              userId: participant.userId,
            })),
            skipDuplicates: true,
          })
        }
      }

      return session
    },

    updateSession: async (
      _parent: unknown,
      args: {
        id: string
        input: {
          title?: string
          description?: string
          startDate?: Date
          endDate?: Date
          seriesId?: string
          visibility?: SessionVisibility
          videoCallUrl?: string
          imageUrl?: string
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check if user is the session leader
      const session = await context.prisma.session.findUnique({
        where: { id: args.id },
      })

      if (!session || session.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      // Update the session
      const updatedSession = await context.prisma.session.update({
        where: { id: args.id },
        data: args.input,
      })

      // If session is being added to a series (and wasn't in one before)
      if (args.input.seriesId && session.seriesId !== args.input.seriesId) {
        // Get all unique participants from other sessions in the new series
        const seriesParticipants = await context.prisma.sessionParticipant.findMany({
          where: {
            session: {
              seriesId: args.input.seriesId,
            },
          },
          select: {
            userId: true,
          },
          distinct: ['userId'],
        })

        // Add each series participant to this session
        if (seriesParticipants.length > 0) {
          await context.prisma.sessionParticipant.createMany({
            data: seriesParticipants.map((participant) => ({
              sessionId: args.id,
              userId: participant.userId,
            })),
            skipDuplicates: true,
          })
        }

        // Also add this session's existing participants to all other sessions in the series
        const thisSessionParticipants = await context.prisma.sessionParticipant.findMany({
          where: {
            sessionId: args.id,
          },
        })

        if (thisSessionParticipants.length > 0) {
          // Get all other sessions in the series
          const otherSeriesSessions = await context.prisma.session.findMany({
            where: {
              seriesId: args.input.seriesId,
              id: { not: args.id },
            },
          })

          // Add this session's participants to each session in the series
          for (const otherSession of otherSeriesSessions) {
            await context.prisma.sessionParticipant.createMany({
              data: thisSessionParticipants.map((participant) => ({
                sessionId: otherSession.id,
                userId: participant.userId,
              })),
              skipDuplicates: true,
            })
          }
        }
      }

      return updatedSession
    },

    deleteSession: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const session = await context.prisma.session.findUnique({
        where: { id: args.id },
      })

      if (!session || session.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.session.delete({
        where: { id: args.id },
      })
    },

    createComment: async (
      _parent: unknown,
      args: {
        input: {
          passageId: string
          sessionId: string
          content: string
          verseNumber?: number
          parentId?: string
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const comment = await context.prisma.comment.create({
        data: {
          passageId: args.input.passageId,
          sessionId: args.input.sessionId,
          userId: context.userId,
          content: args.input.content,
          verseNumber: args.input.verseNumber,
          parentId: args.input.parentId,
        },
        include: {
          user: true,
          replies: true,
        },
      })

      // Send email notification for comment replies
      if (args.input.parentId) {
        const parentComment = await context.prisma.comment.findUnique({
          where: { id: args.input.parentId },
          include: {
            user: true,
            session: true,
          },
        })

        if (parentComment && parentComment.user.commentNotifications && parentComment.userId !== context.userId) {
          const commenter = await context.prisma.user.findUnique({
            where: { id: context.userId },
          })

          await emailService.sendCommentReply({
            to: parentComment.user.email,
            userName: parentComment.user.name || 'there',
            sessionTitle: parentComment.session.title,
            commentAuthor: commenter?.name || 'Someone',
            commentContent: args.input.content.substring(0, 200),
            sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sessions/${parentComment.sessionId}`,
          })
        }
      }

      // Publish the comment to subscribers
      const { pubsub } = await import('../../index.js')
      pubsub.publish(`COMMENT_ADDED_${args.input.sessionId}`, comment)

      return comment
    },

    updateComment: async (
      _parent: unknown,
      args: { id: string; input: { content: string } },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const comment = await context.prisma.comment.findUnique({
        where: { id: args.id },
      })

      if (!comment || comment.userId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.comment.update({
        where: { id: args.id },
        data: { content: args.input.content },
      })
    },

    deleteComment: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const comment = await context.prisma.comment.findUnique({
        where: { id: args.id },
      })

      if (!comment || comment.userId !== context.userId) {
        throw new Error('Not authorized')
      }

      await context.prisma.comment.delete({
        where: { id: args.id },
      })

      return true
    },

    createScripturePassage: async (
      _parent: unknown,
      args: {
        input: {
          sessionId: string
          book: string
          chapter: number
          verseStart: number
          verseEnd?: number
          content: string
          order?: number
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const session = await context.prisma.session.findUnique({
        where: { id: args.input.sessionId },
      })

      if (!session || session.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.scripturePassage.create({
        data: {
          sessionId: args.input.sessionId,
          book: args.input.book,
          chapter: args.input.chapter,
          verseStart: args.input.verseStart,
          verseEnd: args.input.verseEnd,
          content: args.input.content,
          order: args.input.order ?? 0,
        },
      })
    },

    deleteScripturePassage: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const passage = await context.prisma.scripturePassage.findUnique({
        where: { id: args.id },
        include: { session: true },
      })

      if (!passage || passage.session.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      await context.prisma.scripturePassage.delete({
        where: { id: args.id },
      })

      return true
    },

    joinSession: async (
      _parent: unknown,
      args: { sessionId: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check session visibility
      const session = await context.prisma.session.findUnique({
        where: { id: args.sessionId },
      })

      if (!session) {
        throw new Error('Session not found')
      }

      if (session.visibility === SessionVisibility.PRIVATE) {
        // Check if there's an accepted join request
        const joinRequest = await context.prisma.joinRequest.findFirst({
          where: {
            sessionId: args.sessionId,
            toId: context.userId,
            status: JoinRequestStatus.ACCEPTED,
          },
        })

        if (!joinRequest) {
          throw new Error('You need an accepted join request to join this private session')
        }
      }

      const participant = await context.prisma.sessionParticipant.create({
        data: {
          sessionId: args.sessionId,
          userId: context.userId,
        },
      })

      // Send email notification
      const user = await context.prisma.user.findUnique({
        where: { id: context.userId },
      })
      const leader = await context.prisma.user.findUnique({
        where: { id: session.leaderId },
      })

      if (user?.emailNotifications) {
        await emailService.sendSessionInvitation({
          to: user.email,
          userName: user.name || 'there',
          sessionTitle: session.title,
          sessionDate: session.startDate,
          sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sessions/${session.id}`,
          invitedBy: leader?.name || 'A leader',
        })
      }

      return participant
    },

    joinSessionByCode: async (
      _parent: unknown,
      args: { joinCode: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Find session by join code with series info
      const session = await context.prisma.session.findUnique({
        where: { joinCode: args.joinCode },
        include: {
          series: {
            include: {
              sessions: true,
            },
          },
        },
      })

      if (!session) {
        throw new Error('Invalid join code')
      }

      // Check if already a participant in this session
      const existing = await context.prisma.sessionParticipant.findUnique({
        where: {
          sessionId_userId: {
            sessionId: session.id,
            userId: context.userId,
          },
        },
      })

      if (existing) {
        throw new Error('You are already a participant in this session')
      }

      // Join the main session
      const participant = await context.prisma.sessionParticipant.create({
        data: {
          sessionId: session.id,
          userId: context.userId,
        },
      })

      const addedToSeriesSessions: any[] = []
      let series = null

      // If session is part of a series, auto-join all sessions in the series
      if (session.seriesId && session.series) {
        series = session.series

        // Get all other sessions in the series
        const otherSessions = session.series.sessions.filter(
          (s) => s.id !== session.id
        )

        // Join each session in the series (skip if already a participant)
        for (const seriesSession of otherSessions) {
          const existingParticipant = await context.prisma.sessionParticipant.findUnique({
            where: {
              sessionId_userId: {
                sessionId: seriesSession.id,
                userId: context.userId,
              },
            },
          })

          if (!existingParticipant) {
            await context.prisma.sessionParticipant.create({
              data: {
                sessionId: seriesSession.id,
                userId: context.userId,
              },
            })
            addedToSeriesSessions.push(seriesSession)
          }
        }
      }

      return {
        participant,
        session,
        series,
        addedToSeriesSessions,
        totalSessionsJoined: 1 + addedToSeriesSessions.length,
      }
    },

    regenerateJoinCode: async (
      _parent: unknown,
      args: { sessionId: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check if user is the session leader
      const session = await context.prisma.session.findUnique({
        where: { id: args.sessionId },
      })

      if (!session) {
        throw new Error('Session not found')
      }

      if (session.leaderId !== context.userId) {
        throw new Error('Only session leaders can regenerate join codes')
      }

      // Generate new join code
      const { generateUniqueJoinCode } = await import('../../lib/generateJoinCode.js')
      const newCode = await generateUniqueJoinCode()

      // Update session with new code
      return context.prisma.session.update({
        where: { id: args.sessionId },
        data: { joinCode: newCode },
      })
    },

    sendJoinRequest: async (
      _parent: unknown,
      args: { sessionId: string; toUserId: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check if user is the session leader
      const session = await context.prisma.session.findUnique({
        where: { id: args.sessionId },
      })

      if (!session || session.leaderId !== context.userId) {
        throw new Error('Only session leaders can send join requests')
      }

      if (session.visibility !== SessionVisibility.PRIVATE) {
        throw new Error('Join requests can only be sent for private sessions')
      }

      // Check if join request already exists
      const existing = await context.prisma.joinRequest.findUnique({
        where: {
          sessionId_toId: {
            sessionId: args.sessionId,
            toId: args.toUserId,
          },
        },
      })

      if (existing) {
        throw new Error('Join request already exists for this user')
      }

      return context.prisma.joinRequest.create({
        data: {
          sessionId: args.sessionId,
          fromId: context.userId,
          toId: args.toUserId,
        },
      })
    },

    acceptJoinRequest: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const joinRequest = await context.prisma.joinRequest.findUnique({
        where: { id: args.id },
      })

      if (!joinRequest || joinRequest.toId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.joinRequest.update({
        where: { id: args.id },
        data: { status: JoinRequestStatus.ACCEPTED },
      })
    },

    rejectJoinRequest: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const joinRequest = await context.prisma.joinRequest.findUnique({
        where: { id: args.id },
      })

      if (!joinRequest || joinRequest.toId !== context.userId) {
        throw new Error('Not authorized')
      }

      return context.prisma.joinRequest.update({
        where: { id: args.id },
        data: { status: JoinRequestStatus.REJECTED },
      })
    },

    leaveSession: async (
      _parent: unknown,
      args: { sessionId: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      await context.prisma.sessionParticipant.deleteMany({
        where: {
          sessionId: args.sessionId,
          userId: context.userId,
        },
      })

      return true
    },

    createSessionResource: async (
      _parent: unknown,
      args: {
        input: {
          sessionId: string
          fileName: string
          fileUrl: string
          fileType: string
          resourceType?: ResourceType
          videoId?: string
          description?: string
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Verify user is leader or participant
      const session = await context.prisma.session.findUnique({
        where: { id: args.input.sessionId },
        include: { participants: true },
      })

      if (!session) {
        throw new Error('Session not found')
      }

      const isLeader = session.leaderId === context.userId
      const isParticipant = session.participants.some(p => p.userId === context.userId)

      if (!isLeader && !isParticipant) {
        throw new Error('Not authorized to upload resources to this session')
      }

      return context.prisma.sessionResource.create({
        data: {
          sessionId: args.input.sessionId,
          fileName: args.input.fileName,
          fileUrl: args.input.fileUrl,
          fileType: args.input.fileType,
          resourceType: args.input.resourceType || ResourceType.FILE,
          videoId: args.input.videoId,
          description: args.input.description,
          uploadedBy: context.userId,
        },
      })
    },

    deleteSessionResource: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const resource = await context.prisma.sessionResource.findUnique({
        where: { id: args.id },
        include: { session: true },
      })

      if (!resource) {
        throw new Error('Resource not found')
      }

      // Only the uploader or session leader can delete
      if (resource.uploadedBy !== context.userId && resource.session.leaderId !== context.userId) {
        throw new Error('Not authorized')
      }

      await context.prisma.sessionResource.delete({
        where: { id: args.id },
      })

      return true
    },

    sendChatMessage: async (
      _parent: unknown,
      args: { sessionId: string; message: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Verify user is leader or participant
      const session = await context.prisma.session.findUnique({
        where: { id: args.sessionId },
        include: { participants: true },
      })

      if (!session) {
        throw new Error('Session not found')
      }

      const isLeader = session.leaderId === context.userId
      const isParticipant = session.participants.some(p => p.userId === context.userId)

      if (!isLeader && !isParticipant) {
        throw new Error('Not authorized to send messages in this session')
      }

      const chatMessage = await context.prisma.chatMessage.create({
        data: {
          sessionId: args.sessionId,
          userId: context.userId,
          message: args.message,
        },
        include: {
          user: true,
        },
      })

      // Publish the message to subscribers
      const { pubsub } = await import('../../index.js')
      pubsub.publish(`CHAT_MESSAGE_ADDED_${args.sessionId}`, chatMessage)

      return chatMessage
    },

    createPrayerRequest: async (
      _parent: unknown,
      args: { content: string; isAnonymous: boolean },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      return context.prisma.prayerRequest.create({
        data: {
          userId: context.userId,
          content: args.content,
          isAnonymous: args.isAnonymous,
        },
        include: {
          reactions: true,
        },
      })
    },

    deletePrayerRequest: async (
      _parent: unknown,
      args: { id: string },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const prayerRequest = await context.prisma.prayerRequest.findUnique({
        where: { id: args.id },
      })

      if (!prayerRequest || prayerRequest.userId !== context.userId) {
        throw new Error('Not authorized to delete this prayer request')
      }

      await context.prisma.prayerRequest.delete({
        where: { id: args.id },
      })

      return true
    },

    togglePrayerReaction: async (
      _parent: unknown,
      args: { prayerRequestId: string; reactionType: ReactionType },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Check if reaction already exists
      const existingReaction = await context.prisma.prayerReaction.findUnique({
        where: {
          prayerRequestId_userId_reactionType: {
            prayerRequestId: args.prayerRequestId,
            userId: context.userId,
            reactionType: args.reactionType,
          },
        },
      })

      if (existingReaction) {
        // Remove the reaction (toggle off)
        await context.prisma.prayerReaction.delete({
          where: { id: existingReaction.id },
        })
        return null
      } else {
        // Add the reaction (toggle on)
        const reaction = await context.prisma.prayerReaction.create({
          data: {
            prayerRequestId: args.prayerRequestId,
            userId: context.userId,
            reactionType: args.reactionType,
          },
        })

        // Send email notification for prayer reactions
        const prayerRequest = await context.prisma.prayerRequest.findUnique({
          where: { id: args.prayerRequestId },
          include: { user: true },
        })

        if (prayerRequest && prayerRequest.user.prayerNotifications && prayerRequest.userId !== context.userId) {
          const reactor = await context.prisma.user.findUnique({
            where: { id: context.userId },
          })

          await emailService.sendPrayerUpdate({
            to: prayerRequest.user.email,
            userName: prayerRequest.user.name || 'there',
            prayerRequestContent: prayerRequest.content.substring(0, 200),
            updateType: 'reaction',
            reactorName: reactor?.name || 'Someone',
          })
        }

        return reaction
      }
    },
  },

  // Field resolvers for nested data
  User: {
    sessions: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findMany({
        where: { leaderId: parent.id },
      })
    },
    comments: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.comment.findMany({
        where: { userId: parent.id },
      })
    },
  },

  Series: {
    leader: (parent: { leaderId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.leaderId)
    },
    sessions: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findMany({
        where: { seriesId: parent.id },
        orderBy: { startDate: 'asc' },
      })
    },
  },

  Session: {
    leader: (parent: { leaderId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.leaderId)
    },
    series: (parent: { seriesId?: string | null }, _args: unknown, context: Context) => {
      if (!parent.seriesId) return null
      return context.prisma.series.findUnique({
        where: { id: parent.seriesId },
      })
    },
    scripturePassages: (parent: { id: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch passage lookups by session
      return context.loaders.passagesBySessionLoader.load(parent.id)
    },
    comments: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.comment.findMany({
        where: { sessionId: parent.id },
      })
    },
    resources: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.sessionResource.findMany({
        where: { sessionId: parent.id },
      })
    },
    participants: (parent: { id: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch participant lookups by session
      return context.loaders.participantsBySessionLoader.load(parent.id)
    },
    chatMessages: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.chatMessage.findMany({
        where: { sessionId: parent.id },
        orderBy: { createdAt: 'asc' },
      })
    },
    joinRequests: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.joinRequest.findMany({
        where: { sessionId: parent.id },
        orderBy: { createdAt: 'desc' },
      })
    },
  },

  JoinRequest: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch session lookups
      return context.loaders.sessionLoader.load(parent.sessionId)
    },
    from: (parent: { fromId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.fromId)
    },
    to: (parent: { toId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.toId)
    },
  },

  ScripturePassage: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch session lookups
      return context.loaders.sessionLoader.load(parent.sessionId)
    },
    comments: (parent: { id: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch comment lookups by passage
      return context.loaders.commentsByPassageLoader.load(parent.id)
    },
  },

  Comment: {
    passage: (parent: { passageId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch passage lookups
      return context.loaders.scripturePassageLoader.load(parent.passageId)
    },
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch session lookups
      return context.loaders.sessionLoader.load(parent.sessionId)
    },
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.userId)
    },
    parent: (parent: { parentId?: string | null }, _args: unknown, context: Context) => {
      if (!parent.parentId) return null
      // Use DataLoader to batch parent comment lookups
      return context.loaders.commentLoader.load(parent.parentId)
    },
    replies: (parent: { id: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch replies lookups
      return context.loaders.commentRepliesLoader.load(parent.id)
    },
  },

  SessionResource: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch session lookups
      return context.loaders.sessionLoader.load(parent.sessionId)
    },
    uploader: (parent: { uploadedBy: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.uploadedBy)
    },
  },

  SessionParticipant: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch session lookups
      return context.loaders.sessionLoader.load(parent.sessionId)
    },
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.userId)
    },
  },

  Notification: {
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.userId)
    },
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch session lookups
      return context.loaders.sessionLoader.load(parent.sessionId)
    },
  },

  ChatMessage: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch session lookups
      return context.loaders.sessionLoader.load(parent.sessionId)
    },
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.userId)
    },
  },

  PrayerRequest: {
    user: (parent: { userId: string; isAnonymous: boolean }, _args: unknown, context: Context) => {
      // Don't return user info if prayer request is anonymous
      if (parent.isAnonymous) {
        return null
      }
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.userId)
    },
    reactions: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.prayerReaction.findMany({
        where: { prayerRequestId: parent.id },
      })
    },
    reactionCounts: async (parent: { id: string }, _args: unknown, context: Context) => {
      const reactions = await context.prisma.prayerReaction.findMany({
        where: { prayerRequestId: parent.id },
      })

      return {
        hearts: reactions.filter(r => r.reactionType === ReactionType.HEART).length,
        prayingHands: reactions.filter(r => r.reactionType === ReactionType.PRAYING_HANDS).length,
      }
    },
  },

  PrayerReaction: {
    prayerRequest: (parent: { prayerRequestId: string }, _args: unknown, context: Context) => {
      return context.prisma.prayerRequest.findUnique({
        where: { id: parent.prayerRequestId },
      })
    },
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      // Use DataLoader to batch user lookups
      return context.loaders.userLoader.load(parent.userId)
    },
  },

  Subscription: {
    commentAdded: {
      subscribe: async function* (_parent: unknown, args: { sessionId: string }, _context: Context) {
        const { pubsub } = await import('../../index.js')
        const topic = `COMMENT_ADDED_${args.sessionId}`

        const asyncIterator = {
          [Symbol.asyncIterator]() {
            const queue: any[] = []
            let resolver: ((value: IteratorResult<any>) => void) | null = null

            const unsubscribe = pubsub.subscribe(topic, (data: any) => {
              if (resolver) {
                resolver({ value: { commentAdded: data }, done: false })
                resolver = null
              } else {
                queue.push(data)
              }
            })

            return {
              next() {
                if (queue.length > 0) {
                  return Promise.resolve({ value: { commentAdded: queue.shift() }, done: false })
                }
                return new Promise<IteratorResult<any>>((resolve) => {
                  resolver = resolve
                })
              },
              return() {
                unsubscribe()
                return Promise.resolve({ value: undefined, done: true })
              },
              throw(_error: any) {
                unsubscribe()
                return Promise.resolve({ value: undefined, done: true })
              },
            }
          },
        }

        yield* asyncIterator
      },
    },
    chatMessageAdded: {
      subscribe: async function* (_parent: unknown, args: { sessionId: string }, _context: Context) {
        const { pubsub } = await import('../../index.js')
        const topic = `CHAT_MESSAGE_ADDED_${args.sessionId}`

        const asyncIterator = {
          [Symbol.asyncIterator]() {
            const queue: any[] = []
            let resolver: ((value: IteratorResult<any>) => void) | null = null

            const unsubscribe = pubsub.subscribe(topic, (data: any) => {
              if (resolver) {
                resolver({ value: { chatMessageAdded: data }, done: false })
                resolver = null
              } else {
                queue.push(data)
              }
            })

            return {
              next() {
                if (queue.length > 0) {
                  return Promise.resolve({ value: { chatMessageAdded: queue.shift() }, done: false })
                }
                return new Promise<IteratorResult<any>>((resolve) => {
                  resolver = resolve
                })
              },
              return() {
                unsubscribe()
                return Promise.resolve({ value: undefined, done: true })
              },
              throw(_error: any) {
                unsubscribe()
                return Promise.resolve({ value: undefined, done: true })
              },
            }
          },
        }

        yield* asyncIterator
      },
    },
  },
}

// Merge all resolvers
export const resolvers = {
  DateTime: baseResolvers.DateTime,
  Query: {
    ...baseResolvers.Query,
    ...groupResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...baseResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...adminResolvers.Mutation,
  },
  Subscription: {
    ...baseResolvers.Subscription,
    ...groupResolvers.Subscription,
  },
  User: baseResolvers.User,
  Series: baseResolvers.Series,
  Session: baseResolvers.Session,
  JoinRequest: baseResolvers.JoinRequest,
  ScripturePassage: baseResolvers.ScripturePassage,
  Comment: baseResolvers.Comment,
  SessionResource: baseResolvers.SessionResource,
  SessionParticipant: baseResolvers.SessionParticipant,
  Notification: baseResolvers.Notification,
  ChatMessage: baseResolvers.ChatMessage,
  PrayerRequest: baseResolvers.PrayerRequest,
  PrayerReaction: baseResolvers.PrayerReaction,
  Group: groupResolvers.Group,
  GroupMember: groupResolvers.GroupMember,
  GroupChatMessage: groupResolvers.GroupChatMessage,
  GroupSession: groupResolvers.GroupSession,
  GroupSeries: groupResolvers.GroupSeries,
}
