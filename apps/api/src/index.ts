import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { typeDefs } from './graphql/schema/typeDefs.js'
import { resolvers, type Context } from './graphql/resolvers/index.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

interface MyContext extends Context {
  prisma: PrismaClient
  userId?: string
}

async function startServer() {
  const app = express()
  const httpServer = http.createServer(app)

  // Create Apollo Server
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.NODE_ENV !== 'production',
  })

  await server.start()

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<MyContext> => {
        // TODO: Extract user ID from authentication token
        // For now, we'll leave it undefined
        // const token = req.headers.authorization?.replace('Bearer ', '')
        // const userId = await verifyToken(token)

        return {
          prisma,
          userId: undefined, // Will be set by auth middleware later
        }
      },
    })
  )

  const PORT = process.env.PORT || 4000

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, resolve)
  })

  console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`)
  console.log(`📊 GraphQL Playground available in development mode`)
}

// Start the server
startServer().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏳ Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n⏳ Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})
