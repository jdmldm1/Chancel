import { GraphQLScalarType } from 'graphql';
import type { PrismaClient } from '@prisma/client';
import { UserRole, ResourceType, SessionVisibility } from '@prisma/client';
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
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
        } | null>;
        sessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
        }[]>;
        publicSessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
        }[]>;
        mySessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
        }[]>;
        series: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            leaderId: string;
            imageUrl: string | null;
        } | null>;
        allSeries: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            leaderId: string;
            imageUrl: string | null;
        }[]>;
        mySeries: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            leaderId: string;
            imageUrl: string | null;
        }[]>;
        myJoinRequests: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fromId: string;
            toId: string;
            status: import(".prisma/client").$Enums.JoinRequestStatus;
        }[]>;
        sessionJoinRequests: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fromId: string;
            toId: string;
            status: import(".prisma/client").$Enums.JoinRequestStatus;
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
            note: string | null;
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
        bibleBooks: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            name: string;
            number: number;
            chapterCount: number;
        }[]>;
        biblePassages: (_parent: unknown, args: {
            book: string;
            chapter: number;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            content: string;
            book: string;
            chapter: number;
            verseStart: number;
            verseEnd: number | null;
            bookNumber: number;
        }[]>;
        searchBible: (_parent: unknown, args: {
            query: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            content: string;
            book: string;
            chapter: number;
            verseStart: number;
            verseEnd: number | null;
            bookNumber: number;
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
        updateUser: (_parent: unknown, args: {
            input: {
                name?: string;
                email?: string;
            };
        }, context: Context) => Promise<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        }>;
        changePassword: (_parent: unknown, args: {
            currentPassword: string;
            newPassword: string;
        }, context: Context) => Promise<boolean>;
        createSeries: (_parent: unknown, args: {
            input: {
                title: string;
                description?: string;
                imageUrl?: string;
            };
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            leaderId: string;
            imageUrl: string | null;
        }>;
        updateSeries: (_parent: unknown, args: {
            id: string;
            input: {
                title?: string;
                description?: string;
                imageUrl?: string;
            };
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            leaderId: string;
            imageUrl: string | null;
        }>;
        deleteSeries: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            leaderId: string;
            imageUrl: string | null;
        }>;
        createSession: (_parent: unknown, args: {
            input: {
                title: string;
                description?: string;
                startDate: Date;
                endDate: Date;
                seriesId?: string;
                visibility?: SessionVisibility;
                videoCallUrl?: string;
                imageUrl?: string;
                scripturePassages: {
                    book: string;
                    chapter: number;
                    verseStart: number;
                    verseEnd?: number;
                    content: string;
                    note?: string;
                }[];
            };
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
        }>;
        updateSession: (_parent: unknown, args: {
            id: string;
            input: {
                title?: string;
                description?: string;
                startDate?: Date;
                endDate?: Date;
                seriesId?: string;
                visibility?: SessionVisibility;
                videoCallUrl?: string;
                imageUrl?: string;
            };
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
        }>;
        deleteSession: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
            note: string | null;
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
        sendJoinRequest: (_parent: unknown, args: {
            sessionId: string;
            toUserId: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fromId: string;
            toId: string;
            status: import(".prisma/client").$Enums.JoinRequestStatus;
        }>;
        acceptJoinRequest: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fromId: string;
            toId: string;
            status: import(".prisma/client").$Enums.JoinRequestStatus;
        }>;
        rejectJoinRequest: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fromId: string;
            toId: string;
            status: import(".prisma/client").$Enums.JoinRequestStatus;
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
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
    Series: {
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
        sessions: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
        series: (parent: {
            seriesId?: string | null;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SeriesClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            leaderId: string;
            imageUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs> | null;
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
            note: string | null;
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
        joinRequests: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fromId: string;
            toId: string;
            status: import(".prisma/client").$Enums.JoinRequestStatus;
        }[]>;
    };
    JoinRequest: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        from: (parent: {
            fromId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__UserClient<{
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        to: (parent: {
            toId: string;
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
    ScripturePassage: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SessionClient<{
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
            note: string | null;
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
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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
            startDate: Date;
            endDate: Date;
            leaderId: string;
            seriesId: string | null;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
            imageUrl: string | null;
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