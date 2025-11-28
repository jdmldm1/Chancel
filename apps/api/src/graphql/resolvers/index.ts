import { GraphQLScalarType, Kind } from 'graphql'
import type { PrismaClient } from '@prisma/client'
import { UserRole, ResourceType } from '@prisma/client'
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
        orderBy: { scheduledDate: 'desc' },
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
        (a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime()
      )
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

    createSession: async (
      _parent: unknown,
      args: {
        input: {
          title: string
          description?: string
          scheduledDate: Date
          scripturePassages: {
            book: string
            chapter: number
            verseStart: number
            verseEnd?: number
            content: string
          }[]
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const { title, description, scheduledDate, scripturePassages } = args.input

      return context.prisma.session.create({
        data: {
          title,
          description,
          scheduledDate,
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
        input: { title?: string; description?: string; scheduledDate?: Date }
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

      return context.prisma.sessionParticipant.create({
        data: {
          sessionId: args.sessionId,
          userId: context.userId,
        },
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

  Session: {
    leader: (parent: { leaderId: string }, _args: unknown, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.leaderId },
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
  },
}
