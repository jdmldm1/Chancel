import { UserRole } from '@prisma/client';
import type { Context } from './index';
export declare const adminResolvers: {
    Query: {
        allUsers: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            password: string;
        }[]>;
        allSessions: (_parent: unknown, _args: unknown, context: Context) => Promise<{
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
        allGroups: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            leaderId: string;
            visibility: import(".prisma/client").$Enums.GroupVisibility;
            createdAt: Date;
            updatedAt: Date;
        }[]>;
        adminStats: (_parent: unknown, _args: unknown, context: Context) => Promise<{
            totalUsers: number;
            totalLeaders: number;
            totalMembers: number;
            totalSessions: number;
            totalGroups: number;
            totalComments: number;
            totalPrayerRequests: number;
        }>;
    };
    Mutation: {
        adminDeleteUser: (_parent: unknown, args: {
            userId: string;
        }, context: Context) => Promise<boolean>;
        adminUpdateUserRole: (_parent: unknown, args: {
            userId: string;
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
        adminDeleteSession: (_parent: unknown, args: {
            sessionId: string;
        }, context: Context) => Promise<boolean>;
        adminDeleteGroup: (_parent: unknown, args: {
            groupId: string;
        }, context: Context) => Promise<boolean>;
        adminDeleteSeries: (_parent: unknown, args: {
            seriesId: string;
        }, context: Context) => Promise<boolean>;
    };
};
//# sourceMappingURL=adminResolvers.d.ts.map