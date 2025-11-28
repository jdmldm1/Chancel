import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/schema/typeDefs.js';
import { resolvers } from './graphql/resolvers/index.js';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const prisma = new PrismaClient();
// Simple in-memory PubSub for subscriptions
class PubSub {
    subscribers = new Map();
    subscribe(topic, callback) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, new Set());
        }
        this.subscribers.get(topic).add(callback);
        return () => {
            this.subscribers.get(topic)?.delete(callback);
        };
    }
    publish(topic, data) {
        const callbacks = this.subscribers.get(topic);
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }
}
export const pubsub = new PubSub();
async function startServer() {
    const app = express();
    const httpServer = http.createServer(app);
    // Create executable schema
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    // Create WebSocket server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    // Setup WebSocket server for GraphQL subscriptions
    const serverCleanup = useServer({
        schema,
        context: async () => {
            // Extract auth from connection params if needed
            return {
                prisma,
            };
        },
    }, wsServer);
    // Create Apollo Server
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
        introspection: process.env.NODE_ENV !== 'production',
    });
    await server.start();
    // Apply middleware
    app.use('/graphql', cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
        credentials: true,
    }), express.json(), expressMiddleware(server, {
        context: async ({ req }) => {
            // Extract user ID from authorization header
            const authHeader = req.headers.authorization;
            let userId;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                userId = authHeader.replace('Bearer ', '');
            }
            return {
                prisma,
                userId,
            };
        },
    }));
    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => {
        httpServer.listen({ port: PORT }, resolve);
    });
    console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 GraphQL Playground available in development mode`);
}
// Start the server
startServer().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏳ Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n⏳ Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map