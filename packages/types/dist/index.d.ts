export declare enum UserRole {
    LEADER = "LEADER",
    MEMBER = "MEMBER"
}
export interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export interface Session {
    id: string;
    title: string;
    description: string | null;
    scheduledDate: Date;
    leaderId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ScripturePassage {
    id: string;
    sessionId: string;
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd: number | null;
    content: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Comment {
    id: string;
    passageId: string;
    sessionId: string;
    userId: string;
    content: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface SessionResource {
    id: string;
    sessionId: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface SessionParticipant {
    id: string;
    sessionId: string;
    userId: string;
    role: UserRole;
    joinedAt: Date;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface AuthSession {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: UserRole;
    };
    expires: string;
}
//# sourceMappingURL=index.d.ts.map