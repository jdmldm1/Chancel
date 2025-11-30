import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';
/**
 * DataLoaders for batching and caching database queries
 * Prevents N+1 query problems by batching multiple queries into a single database call
 */
export declare const createUserLoader: (prisma: PrismaClient) => DataLoader<string, {
    id: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: import(".prisma/client").$Enums.UserRole;
    email: string;
    password: string;
} | null, string>;
export declare const createSessionLoader: (prisma: PrismaClient) => DataLoader<string, {
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
} | null, string>;
export declare const createScripturePassageLoader: (prisma: PrismaClient) => DataLoader<string, {
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
} | null, string>;
export declare const createPassagesBySessionLoader: (prisma: PrismaClient) => DataLoader<string, {
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
}[], string>;
export declare const createCommentsByPassageLoader: (prisma: PrismaClient) => DataLoader<string, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    sessionId: string;
    passageId: string;
    content: string;
    verseNumber: number | null;
    parentId: string | null;
}[], string>;
export declare const createParticipantsBySessionLoader: (prisma: PrismaClient) => DataLoader<string, {
    id: string;
    userId: string;
    role: import(".prisma/client").$Enums.UserRole;
    joinedAt: Date;
    sessionId: string;
}[], string>;
export declare const createCommentLoader: (prisma: PrismaClient) => DataLoader<string, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    sessionId: string;
    passageId: string;
    content: string;
    verseNumber: number | null;
    parentId: string | null;
} | null, string>;
export declare const createCommentRepliesLoader: (prisma: PrismaClient) => DataLoader<string, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    sessionId: string;
    passageId: string;
    content: string;
    verseNumber: number | null;
    parentId: string | null;
}[], string>;
/**
 * Creates all DataLoaders for a request
 * Each request gets fresh DataLoaders to avoid caching across requests
 */
export declare const createDataLoaders: (prisma: PrismaClient) => {
    userLoader: DataLoader<string, {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        password: string;
    } | null, string>;
    sessionLoader: DataLoader<string, {
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
    } | null, string>;
    scripturePassageLoader: DataLoader<string, {
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
    } | null, string>;
    passagesBySessionLoader: DataLoader<string, {
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
    }[], string>;
    commentsByPassageLoader: DataLoader<string, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        sessionId: string;
        passageId: string;
        content: string;
        verseNumber: number | null;
        parentId: string | null;
    }[], string>;
    participantsBySessionLoader: DataLoader<string, {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.UserRole;
        joinedAt: Date;
        sessionId: string;
    }[], string>;
    commentLoader: DataLoader<string, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        sessionId: string;
        passageId: string;
        content: string;
        verseNumber: number | null;
        parentId: string | null;
    } | null, string>;
    commentRepliesLoader: DataLoader<string, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        sessionId: string;
        passageId: string;
        content: string;
        verseNumber: number | null;
        parentId: string | null;
    }[], string>;
};
export type DataLoaders = ReturnType<typeof createDataLoaders>;
//# sourceMappingURL=dataloaders.d.ts.map