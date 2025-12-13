import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { buildSchema } from 'graphql'
import { addResolversToSchema } from '@graphql-tools/schema'
import { typeDefs } from './graphql/schema/typeDefs.js'
import { resolvers, type Context } from './graphql/resolvers/index.js'
import { createDataLoaders, type DataLoaders } from './lib/dataloaders.js'
import dotenv from 'dotenv'

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

  // Build schema from typeDefs and add resolvers
  const builtSchema = buildSchema(typeDefs)
  const schema = addResolversToSchema({
    schema: builtSchema,
    resolvers
  })

  // Create WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  // Setup WebSocket server for GraphQL subscriptions
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        // Extract auth from connection params
        const authHeader = ctx.connectionParams?.authorization as string | undefined
        let userId: string | undefined

        if (authHeader && authHeader.startsWith('Bearer ')) {
          userId = authHeader.replace('Bearer ', '')
        }

        // Create fresh DataLoaders for WebSocket context
        const loaders = createDataLoaders(prisma)

        return {
          prisma,
          userId,
          loaders,
        }
      },
      onConnect: async () => {
        console.log('📡 WebSocket client connected')
        return true
      },
      onDisconnect: () => {
        console.log('📡 WebSocket client disconnected')
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
    ],
    introspection: process.env.NODE_ENV !== 'production',
  })

  await server.start()

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: [
        'https://chancel.study',
        'http://localhost:3000',
        'http://localhost:3003',
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
