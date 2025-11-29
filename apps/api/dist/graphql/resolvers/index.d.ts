import { GraphQLScalarType } from 'graphql';
import type { PrismaClient } from '@prisma/client';
import { UserRole, ResourceType } from '@prisma/client';
export interface Context {
    prisma: PrismaClient;
    userId?: string;
}
export declare const resolvers: {
    DateTime: GraphQLScalarType<Date | null, string>;
    Query: {
        me: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null>;
        user: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null>;
        users: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        }[]>;
        session: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        } | null>;
        sessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        }[]>;
        mySessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        }[]>;
        comments: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
        commentsByPassage: (_parent: unknown, args: {
            passageId: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
        scripturePassages: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            content: string;
            book: string;
            chapter: number;
            verseStart: number;
            verseEnd: number | null;
            order: number;
        }[]>;
        sessionResources: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            resourceType: import(".prisma/client").$Enums.ResourceType;
            videoId: string | null;
            uploadedBy: string;
        }[]>;
        chatMessages: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            message: string;
        }[]>;
    };
    Mutation: {
        signup: (_parent: unknown, args: {
            email: string;
            password: string;
            name: string;
            role: UserRole;
        }, context: Context) => Promise<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        }>;
        createSession: (_parent: unknown, args: {
            input: {
                title: string;
                description?: string;
                scheduledDate: Date;
                scripturePassages: {
                    book: string;
                    chapter: number;
                    verseStart: number;
                    verseEnd?: number;
                    content: string;
                }[];
            };
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        }>;
        updateSession: (_parent: unknown, args: {
            id: string;
            input: {
                title?: string;
                description?: string;
                scheduledDate?: Date;
            };
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        }>;
        deleteSession: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        }>;
        createComment: (_parent: unknown, args: {
            input: {
                passageId: string;
                sessionId: string;
                content: string;
                verseNumber?: number;
                parentId?: string;
            };
        }, context: Context) => Promise<{
            user: {
                name: string | null;
                id: string;
                email: string;
                password: string;
                role: import(".prisma/client").$Enums.UserRole;
                createdAt: Date;
                updatedAt: Date;
            };
            replies: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sessionId: string;
                userId: string;
                passageId: string;
                content: string;
                verseNumber: number | null;
                parentId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }>;
        updateComment: (_parent: unknown, args: {
            id: string;
            input: {
                content: string;
            };
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }>;
        deleteComment: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<boolean>;
        createScripturePassage: (_parent: unknown, args: {
            input: {
                sessionId: string;
                book: string;
                chapter: number;
                verseStart: number;
                verseEnd?: number;
                content: string;
                order?: number;
            };
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            content: string;
            book: string;
            chapter: number;
            verseStart: number;
            verseEnd: number | null;
            order: number;
        }>;
        deleteScripturePassage: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<boolean>;
        joinSession: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<{
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            sessionId: string;
            userId: string;
            joinedAt: Date;
        }>;
        leaveSession: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<boolean>;
        createSessionResource: (_parent: unknown, args: {
            input: {
                sessionId: string;
                fileName: string;
                fileUrl: string;
                fileType: string;
                resourceType?: ResourceType;
                videoId?: string;
                description?: string;
            };
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            resourceType: import(".prisma/client").$Enums.ResourceType;
            videoId: string | null;
            uploadedBy: string;
        }>;
        deleteSessionResource: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<boolean>;
        sendChatMessage: (_parent: unknown, args: {
            sessionId: string;
            message: string;
        }, context: Context) => Promise<{
            user: {
                name: string | null;
                id: string;
                email: string;
                password: string;
                role: import(".prisma/client").$Enums.UserRole;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            message: string;
        }>;
    };
    User: {
        sessions: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        }[]>;
        comments: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
    };
    Session: {
        leader: (parent: {
            leaderId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__UserClient<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        scripturePassages: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            content: string;
            book: string;
            chapter: number;
            verseStart: number;
            verseEnd: number | null;
            order: number;
        }[]>;
        comments: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
        resources: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            resourceType: import(".prisma/client").$Enums.ResourceType;
            videoId: string | null;
            uploadedBy: string;
        }[]>;
        participants: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            sessionId: string;
            userId: string;
            joinedAt: Date;
        }[]>;
        chatMessages: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            message: string;
        }[]>;
    };
    ScripturePassage: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        comments: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
    };
    Comment: {
        passage: (parent: {
            passageId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__ScripturePassageClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            content: string;
            book: string;
            chapter: number;
            verseStart: number;
            verseEnd: number | null;
            order: number;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__UserClient<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        parent: (parent: {
            parentId?: string | null;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__CommentClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs> | null;
        replies: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
    };
    SessionResource: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        uploader: (parent: {
            uploadedBy: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__UserClient<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    };
    SessionParticipant: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__UserClient<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    };
    Notification: {
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__UserClient<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    };
    ChatMessage: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            scheduledDate: Date;
            leaderId: string;
            videoCallUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__UserClient<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    };
    Subscription: {
        commentAdded: {
            subscribe: (_parent: unknown, args: {
                sessionId: string;
            }, _context: Context) => AsyncGenerator<any, void, unknown>;
        };
        chatMessageAdded: {
            subscribe: (_parent: unknown, args: {
                sessionId: string;
            }, _context: Context) => AsyncGenerator<any, void, unknown>;
        };
    };
};
//# sourceMappingURL=index.d.ts.map