import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { typeDefs } from './graphql/schema/typeDefs.js'
import { resolvers, type Context } from './graphql/resolvers/index.js'
import { createDataLoaders, type DataLoaders } from './lib/dataloaders.js'
import dotenv from 'dotenv'
import {
  getComplexity,
  simpleEstimator,
  fieldExtensionsEstimator,
} from 'graphql-query-complexity'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  // Connection pool configuration for better performance
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Simple in-memory PubSub for subscriptions
class PubSub {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()

  subscribe(topic: string, callback: (data: any) => void) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set())
    }
    this.subscribers.get(topic)!.add(callback)

    return () => {
      this.subscribers.get(topic)?.delete(callback)
    }
  }

  publish(topic: string, data: any) {
    const callbacks = this.subscribers.get(topic)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }
}

export const pubsub = new PubSub()

interface MyContext extends Context {
  prisma: PrismaClient
  userId?: string
  loaders: DataLoaders
}

async function startServer() {
  const app = express()
  const httpServer = http.createServer(app)

  // Create executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  // Create WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  // Setup WebSocket server for GraphQL subscriptions
  const serverCleanup = useServer(
    {
      schema,
      context: async () => {
        // Extract auth from connection params if needed
        // Create fresh DataLoaders for WebSocket context
        const loaders = createDataLoaders(prisma)

        return {
          prisma,
          loaders,
        }
      },
    },
    wsServer
  )

  // Create Apollo Server
  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
      // Query complexity plugin to prevent overly expensive queries
      {
        async requestDidStart() {
          return {
            async didResolveOperation({ request, document }) {
              const complexity = getComplexity({
                schema,
                operationName: request.operationName,
                query: document,
                variables: request.variables,
                estimators: [
                  fieldExtensionsEstimator(),
                  simpleEstimator({ defaultComplexity: 1 }),
                ],
              })

              // Max complexity of 1000 (adjust based on your needs)
              const maxComplexity = 1000
              if (complexity > maxComplexity) {
                throw new Error(
                  `Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`
                )
              }

              console.log(`Query complexity: ${complexity}`)
            },
          }
        },
      },
    ],
    introspection: process.env.NODE_ENV !== 'production',
  })

  await server.start()

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.CORS_ORIGIN || [
        'http://localhost:3000',
        'http://localhost:3001',
        /https:\/\/3000--.*\.coder\.app$/,
      ],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<MyContext> => {
        // Extract user ID from authorization header
        const authHeader = req.headers.authorization
        let userId: string | undefined

        if (authHeader && authHeader.startsWith('Bearer ')) {
          userId = authHeader.replace('Bearer ', '')
        }

        // Debug logging
        if (userId) {
          console.log('🔐 Auth Context - User ID:', userId)
        }

        // Create fresh DataLoaders for each request
        const loaders = createDataLoaders(prisma)

        return {
          prisma,
          userId,
          loaders,
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
