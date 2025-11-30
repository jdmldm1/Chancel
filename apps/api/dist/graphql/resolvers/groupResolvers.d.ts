import { GroupVisibility } from '@prisma/client';
import type { Context } from './index';
export declare const groupResolvers: {
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
    };
    Mutation: {
        createGroup: (_parent: unknown, args: {
            input: {
                name: string;
                description?: string;
                imageUrl?: string;
                visibility?: GroupVisibility;
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
                visibility?: GroupVisibility;
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
    Subscription: {
        groupChatMessageAdded: {
            subscribe: (_parent: unknown, args: {
                groupId: string;
            }, _context: Context) => AsyncGenerator<any, void, unknown>;
        };
    };
};
//# sourceMappingURL=groupResolvers.d.ts.map