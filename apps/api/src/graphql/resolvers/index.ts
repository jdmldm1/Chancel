import { GraphQLScalarType, Kind } from 'graphql'
import type { PrismaClient } from '@prisma/client'
import { UserRole, ResourceType, SessionVisibility, JoinRequestStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

export interface Context {
  prisma: PrismaClient
  userId?: string // Will be set by auth middleware
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

export const resolvers = {
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

    sessions: async (_parent: unknown, _args: unknown, context: Context) => {
      return context.prisma.session.findMany({
        orderBy: { startDate: 'desc' },
      })
    },

    publicSessions: async (_parent: unknown, _args: unknown, context: Context) => {
      return context.prisma.session.findMany({
        where: { visibility: SessionVisibility.PUBLIC },
        orderBy: { startDate: 'desc' },
      })
    },

    mySessions: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      // Get sessions where user is either the leader or a participant
      const participantSessions = await context.prisma.sessionParticipant.findMany({
        where: { userId: context.userId },
        include: { session: true },
      })

      const leaderSessions = await context.prisma.session.findMany({
        where: { leaderId: context.userId },
      })

      // Combine and deduplicate
      const allSessions = [
        ...leaderSessions,
        ...participantSessions.map(p => p.session),
      ]

      // Remove duplicates based on id
      const uniqueSessions = Array.from(
        new Map(allSessions.map(s => [s.id, s])).values()
      )

      return uniqueSessions.sort(
        (a, b) => b.startDate.getTime() - a.startDate.getTime()
      )
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

      return context.prisma.series.findMany({
        where: { leaderId: context.userId },
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

      const { title, description, startDate, endDate, seriesId, visibility, videoCallUrl, imageUrl, scripturePassages } = args.input

      return context.prisma.session.create({
        data: {
          title,
          description,
          startDate,
          endDate,
          seriesId,
          visibility: visibility || SessionVisibility.PUBLIC,
          videoCallUrl,
          imageUrl,
          leaderId: context.userId,
          scripturePassages: {
            create: scripturePassages.map((passage, index) => ({
              ...passage,
              order: index,
            })),
          },
        },
      })
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

      return context.prisma.session.update({
        where: { id: args.id },
        data: args.input,
      })
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

      return context.prisma.sessionParticipant.create({
        data: {
          sessionId: args.sessionId,
          userId: context.userId,
        },
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
      return context.prisma.user.findUnique({
        where: { id: parent.leaderId },
      })
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
      return context.prisma.user.findUnique({
        where: { id: parent.leaderId },
      })
    },
    series: (parent: { seriesId?: string | null }, _args: unknown, context: Context) => {
      if (!parent.seriesId) return null
      return context.prisma.series.findUnique({
        where: { id: parent.seriesId },
      })
    },
    scripturePassages: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.scripturePassage.findMany({
        where: { sessionId: parent.id },
        orderBy: { order: 'asc' },
      })
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
      return context.prisma.sessionParticipant.findMany({
        where: { sessionId: parent.id },
      })
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
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      })
    },
    from: (parent: { fromId: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.fromId },
      })
    },
    to: (parent: { toId: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.toId },
      })
    },
  },

  ScripturePassage: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      })
    },
    comments: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.comment.findMany({
        where: { passageId: parent.id },
      })
    },
  },

  Comment: {
    passage: (parent: { passageId: string }, _args: unknown, context: Context) => {
      return context.prisma.scripturePassage.findUnique({
        where: { id: parent.passageId },
      })
    },
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      })
    },
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      })
    },
    parent: (parent: { parentId?: string | null }, _args: unknown, context: Context) => {
      if (!parent.parentId) return null
      return context.prisma.comment.findUnique({
        where: { id: parent.parentId },
      })
    },
    replies: (parent: { id: string }, _args: unknown, context: Context) => {
      return context.prisma.comment.findMany({
        where: { parentId: parent.id },
      })
    },
  },

  SessionResource: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      })
    },
    uploader: (parent: { uploadedBy: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.uploadedBy },
      })
    },
  },

  SessionParticipant: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      })
    },
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      })
    },
  },

  Notification: {
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      })
    },
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      })
    },
  },

  ChatMessage: {
    session: (parent: { sessionId: string }, _args: unknown, context: Context) => {
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      })
    },
    user: (parent: { userId: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      })
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
