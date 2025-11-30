import { GraphQLScalarType } from 'graphql';
import type { PrismaClient } from '@prisma/client';
import { UserRole, ResourceType, SessionVisibility, ReactionType } from '@prisma/client';
export interface Context {
    prisma: PrismaClient;
    userId?: string;
    loaders: any;
}
export declare const resolvers: {
    DateTime: GraphQLScalarType<Date | null, string>;
    Query: {
        groups: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        }[]>;
        group: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            members: {
                id: string;
                userId: string;
                groupId: string;
                role: import(".prisma/client").$Enums.UserRole;
                joinedAt: Date;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        }>;
        myGroups: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        }[]>;
        publicGroups: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        }[]>;
        groupMembers: (_parent: unknown, args: {
            groupId: string;
        }, context: Context) => Promise<{
            id: string;
            userId: string;
            groupId: string;
            role: import(".prisma/client").$Enums.UserRole;
            joinedAt: Date;
        }[]>;
        groupChatMessages: (_parent: unknown, args: {
            groupId: string;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            groupId: string;
            message: string;
        }[]>;
        me: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            password: string;
        } | null>;
        user: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            password: string;
        } | null>;
        users: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            password: string;
        }[]>;
        session: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
        } | null>;
        sessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
        }[]>;
        publicSessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
        }[]>;
        mySessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
        }[]>;
        series: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        } | null>;
        allSeries: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        }[]>;
        mySeries: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
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
            userId: string;
            sessionId: string;
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
            userId: string;
            sessionId: string;
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
            id: string;
            description: string | null;
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
            userId: string;
            message: string;
            sessionId: string;
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
        prayerRequests: (_parent: unknown, _args: unknown, context: Context) => Promise<({
            reactions: {
                id: string;
                createdAt: Date;
                userId: string;
                reactionType: import(".prisma/client").$Enums.ReactionType;
                prayerRequestId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            isAnonymous: boolean;
        })[]>;
        prayerRequest: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<({
            reactions: {
                id: string;
                createdAt: Date;
                userId: string;
                reactionType: import(".prisma/client").$Enums.ReactionType;
                prayerRequestId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            isAnonymous: boolean;
        }) | null>;
    };
    Mutation: {
        createGroup: (_parent: unknown, args: {
            input: {
                name: string;
                description?: string;
                imageUrl?: string;
                visibility?: import(".prisma/client").GroupVisibility;
            };
        }, context: Context) => Promise<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        }>;
        updateGroup: (_parent: unknown, args: {
            id: string;
            input: {
                name?: string;
                description?: string;
                imageUrl?: string;
                visibility?: import(".prisma/client").GroupVisibility;
            };
        }, context: Context) => Promise<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        }>;
        deleteGroup: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<boolean>;
        addGroupMember: (_parent: unknown, args: {
            groupId: string;
            userId: string;
        }, context: Context) => Promise<{
            id: string;
            userId: string;
            groupId: string;
            role: import(".prisma/client").$Enums.UserRole;
            joinedAt: Date;
        }>;
        removeGroupMember: (_parent: unknown, args: {
            groupId: string;
            userId: string;
        }, context: Context) => Promise<boolean>;
        sendGroupChatMessage: (_parent: unknown, args: {
            groupId: string;
            message: string;
        }, context: Context) => Promise<{
            user: {
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                password: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            groupId: string;
            message: string;
        }>;
        assignGroupToSession: (_parent: unknown, args: {
            groupId: string;
            sessionId: string;
        }, context: Context) => Promise<{
            id: string;
            groupId: string;
            addedAt: Date;
            sessionId: string;
        }>;
        removeGroupFromSession: (_parent: unknown, args: {
            groupId: string;
            sessionId: string;
        }, context: Context) => Promise<boolean>;
        assignGroupToSeries: (_parent: unknown, args: {
            groupId: string;
            seriesId: string;
        }, context: Context) => Promise<{
            id: string;
            groupId: string;
            addedAt: Date;
            seriesId: string;
        }>;
        removeGroupFromSeries: (_parent: unknown, args: {
            groupId: string;
            seriesId: string;
        }, context: Context) => Promise<boolean>;
        signup: (_parent: unknown, args: {
            email: string;
            password: string;
            name: string;
            role: UserRole;
        }, context: Context) => Promise<{
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            password: string;
        }>;
        updateUser: (_parent: unknown, args: {
            input: {
                name?: string;
                email?: string;
            };
        }, context: Context) => Promise<{
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            password: string;
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
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        }>;
        updateSeries: (_parent: unknown, args: {
            id: string;
            input: {
                title?: string;
                description?: string;
                imageUrl?: string;
            };
        }, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        }>;
        deleteSeries: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
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
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
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
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
        }>;
        deleteSession: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
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
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                password: string;
            };
            replies: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                sessionId: string;
                passageId: string;
                content: string;
                verseNumber: number | null;
                parentId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            sessionId: string;
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
            userId: string;
            sessionId: string;
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
            userId: string;
            role: import(".prisma/client").$Enums.UserRole;
            joinedAt: Date;
            sessionId: string;
        }>;
        joinSessionByCode: (_parent: unknown, args: {
            joinCode: string;
        }, context: Context) => Promise<{
            participant: {
                id: string;
                userId: string;
                role: import(".prisma/client").$Enums.UserRole;
                joinedAt: Date;
                sessionId: string;
            };
            session: {
                series: ({
                    sessions: {
                        id: string;
                        description: string | null;
                        imageUrl: string | null;
                        leaderId: string;
                        visibility: import(".prisma/client").$Enums.SessionVisibility;
                        createdAt: Date;
                        updatedAt: Date;
                        joinCode: string | null;
                        title: string;
                        startDate: Date;
                        endDate: Date;
                        seriesId: string | null;
                        sessionType: import(".prisma/client").$Enums.SessionType;
                        videoCallUrl: string | null;
                    }[];
                } & {
                    id: string;
                    description: string | null;
                    imageUrl: string | null;
                    leaderId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                }) | null;
            } & {
                id: string;
                description: string | null;
                imageUrl: string | null;
                leaderId: string;
                visibility: import(".prisma/client").$Enums.SessionVisibility;
                createdAt: Date;
                updatedAt: Date;
                joinCode: string | null;
                title: string;
                startDate: Date;
                endDate: Date;
                seriesId: string | null;
                sessionType: import(".prisma/client").$Enums.SessionType;
                videoCallUrl: string | null;
            };
            series: ({
                sessions: {
                    id: string;
                    description: string | null;
                    imageUrl: string | null;
                    leaderId: string;
                    visibility: import(".prisma/client").$Enums.SessionVisibility;
                    createdAt: Date;
                    updatedAt: Date;
                    joinCode: string | null;
                    title: string;
                    startDate: Date;
                    endDate: Date;
                    seriesId: string | null;
                    sessionType: import(".prisma/client").$Enums.SessionType;
                    videoCallUrl: string | null;
                }[];
            } & {
                id: string;
                description: string | null;
                imageUrl: string | null;
                leaderId: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
            }) | null;
            addedToSeriesSessions: any[];
            totalSessionsJoined: number;
        }>;
        regenerateJoinCode: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
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
            id: string;
            description: string | null;
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
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                password: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            message: string;
            sessionId: string;
        }>;
        createPrayerRequest: (_parent: unknown, args: {
            content: string;
            isAnonymous: boolean;
        }, context: Context) => Promise<{
            reactions: {
                id: string;
                createdAt: Date;
                userId: string;
                reactionType: import(".prisma/client").$Enums.ReactionType;
                prayerRequestId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            isAnonymous: boolean;
        }>;
        deletePrayerRequest: (_parent: unknown, args: {
            id: string;
        }, context: Context) => Promise<boolean>;
        togglePrayerReaction: (_parent: unknown, args: {
            prayerRequestId: string;
            reactionType: ReactionType;
        }, context: Context) => Promise<{
            id: string;
            createdAt: Date;
            userId: string;
            reactionType: import(".prisma/client").$Enums.ReactionType;
            prayerRequestId: string;
        } | null>;
    };
    Subscription: {
        groupChatMessageAdded: {
            subscribe: (_parent: unknown, args: {
                groupId: string;
            }, _context: Context) => AsyncGenerator<any, void, unknown>;
        };
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
    User: {
        sessions: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
        }[]>;
        comments: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            sessionId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
    };
    Series: {
        leader: (parent: {
            leaderId: string;
        }, _args: unknown, context: Context) => any;
        sessions: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.SessionVisibility;
            createdAt: Date;
            updatedAt: Date;
            joinCode: string | null;
            title: string;
            startDate: Date;
            endDate: Date;
            seriesId: string | null;
            sessionType: import(".prisma/client").$Enums.SessionType;
            videoCallUrl: string | null;
        }[]>;
    };
    Session: {
        leader: (parent: {
            leaderId: string;
        }, _args: unknown, context: Context) => any;
        series: (parent: {
            seriesId?: string | null;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SeriesClient<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs> | null;
        scripturePassages: (parent: {
            id: string;
        }, _args: unknown, context: Context) => any;
        comments: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            sessionId: string;
            passageId: string;
            content: string;
            verseNumber: number | null;
            parentId: string | null;
        }[]>;
        resources: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            description: string | null;
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
        }, _args: unknown, context: Context) => any;
        chatMessages: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            message: string;
            sessionId: string;
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
        }, _args: unknown, context: Context) => any;
        from: (parent: {
            fromId: string;
        }, _args: unknown, context: Context) => any;
        to: (parent: {
            toId: string;
        }, _args: unknown, context: Context) => any;
    };
    ScripturePassage: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => any;
        comments: (parent: {
            id: string;
        }, _args: unknown, context: Context) => any;
    };
    Comment: {
        passage: (parent: {
            passageId: string;
        }, _args: unknown, context: Context) => any;
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => any;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => any;
        parent: (parent: {
            parentId?: string | null;
        }, _args: unknown, context: Context) => any;
        replies: (parent: {
            id: string;
        }, _args: unknown, context: Context) => any;
    };
    SessionResource: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => any;
        uploader: (parent: {
            uploadedBy: string;
        }, _args: unknown, context: Context) => any;
    };
    SessionParticipant: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => any;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => any;
    };
    Notification: {
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => any;
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => any;
    };
    ChatMessage: {
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => any;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => any;
    };
    PrayerRequest: {
        user: (parent: {
            userId: string;
            isAnonymous: boolean;
        }, _args: unknown, context: Context) => any;
        reactions: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            userId: string;
            reactionType: import(".prisma/client").$Enums.ReactionType;
            prayerRequestId: string;
        }[]>;
        reactionCounts: (parent: {
            id: string;
        }, _args: unknown, context: Context) => Promise<{
            hearts: number;
            prayingHands: number;
        }>;
    };
    PrayerReaction: {
        prayerRequest: (parent: {
            prayerRequestId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__PrayerRequestClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            isAnonymous: boolean;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => any;
    };
    Group: {
        leader: (parent: {
            leaderId: string;
        }, _args: unknown, context: Context) => any;
        members: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            userId: string;
            groupId: string;
            role: import(".prisma/client").$Enums.UserRole;
            joinedAt: Date;
        }[]>;
        chatMessages: (parent: {
            id: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            groupId: string;
            message: string;
        }[]>;
        memberCount: (parent: {
            id: string;
        }, _args: unknown, context: Context) => Promise<number>;
    };
    GroupMember: {
        group: (parent: {
            groupId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__GroupClient<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => any;
    };
    GroupChatMessage: {
        group: (parent: {
            groupId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__GroupClient<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        user: (parent: {
            userId: string;
        }, _args: unknown, context: Context) => any;
    };
    GroupSession: {
        group: (parent: {
            groupId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__GroupClient<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        session: (parent: {
            sessionId: string;
        }, _args: unknown, context: Context) => any;
    };
    GroupSeries: {
        group: (parent: {
            groupId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__GroupClient<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
        series: (parent: {
            seriesId: string;
        }, _args: unknown, context: Context) => import(".prisma/client").Prisma.Prisma__SeriesClient<{
            id: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    };
};
//# sourceMappingURL=index.d.ts.map