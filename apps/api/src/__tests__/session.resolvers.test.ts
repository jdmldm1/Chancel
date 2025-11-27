import { describe, it, expect, vi } from 'vitest'
import { resolvers } from '../graphql/resolvers'
import type { Context } from '../graphql/resolvers'

// Mock Prisma client
const mockPrisma = {
  session: {
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
}

const mockContext: Context = {
  prisma: mockPrisma as any,
  userId: 'test-user-id',
}

describe('Session Resolvers', () => {
  describe('Mutation: createSession', () => {
    it('should create a new session with scripture passages', async () => {
      const input = {
        title: 'Test Session',
        description: 'Test Description',
        scheduledDate: new Date(),
        scripturePassages: [
          {
            book: 'Genesis',
            chapter: 1,
            verseStart: 1,
            verseEnd: 31,
            content: 'In the beginning...',
          },
        ],
      }

      const expectedSession = {
        id: 'new-session-id',
        leaderId: mockContext.userId,
        ...input,
      }

      mockPrisma.session.create.mockResolvedValue(expectedSession)

      const result = await resolvers.Mutation.createSession(
        null,
        { input },
        mockContext
      )

      expect(mockPrisma.session.create).toHaveBeenCalledWith({
        data: {
          title: input.title,
          description: input.description,
          scheduledDate: input.scheduledDate,
          leaderId: mockContext.userId,
          scripturePassages: {
            create: input.scripturePassages.map((p, i) => ({ ...p, order: i })),
          },
        },
      })
      expect(result).toEqual(expectedSession)
    })

    it('should throw an error if user is not authenticated', async () => {
      const contextWithoutUser = { ...mockContext, userId: undefined }
      const input = {
        title: 'Test Session',
        scheduledDate: new Date(),
        scripturePassages: [],
      }
      await expect(
        resolvers.Mutation.createSession(null, { input }, contextWithoutUser)
      ).rejects.toThrow('Not authenticated')
    })
  })

  describe('Mutation: deleteSession', () => {
    it('should delete a session if the user is the leader', async () => {
      const sessionId = 'session-to-delete'
      const mockSession = {
        id: sessionId,
        leaderId: mockContext.userId,
      }

      mockPrisma.session.findUnique.mockResolvedValue(mockSession)
      mockPrisma.session.delete.mockResolvedValue(mockSession)

      const result = await resolvers.Mutation.deleteSession(
        null,
        { id: sessionId },
        mockContext
      )

      expect(mockPrisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
      })
      expect(mockPrisma.session.delete).toHaveBeenCalledWith({
        where: { id: sessionId },
      })
      expect(result).toEqual(mockSession)
    })

    it('should throw an error if the user is not the leader', async () => {
      const sessionId = 'session-to-delete'
      const mockSession = {
        id: sessionId,
        leaderId: 'another-user-id',
      }

      mockPrisma.session.findUnique.mockResolvedValue(mockSession)

      await expect(
        resolvers.Mutation.deleteSession(null, { id: sessionId }, mockContext)
      ).rejects.toThrow('Not authorized')
    })

    it('should throw an error if the session does not exist', async () => {
        const sessionId = 'non-existent-session'
        mockPrisma.session.findUnique.mockResolvedValue(null)
  
        await expect(
          resolvers.Mutation.deleteSession(null, { id: sessionId }, mockContext)
        ).rejects.toThrow('Not authorized')
      })
  })
})
