export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}
export declare class EmailService {
    private readonly defaultFrom;
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendSessionInvitation(params: {
        to: string;
        userName: string;
        sessionTitle: string;
        sessionDate: Date;
        sessionUrl: string;
        invitedBy: string;
    }): Promise<boolean>;
    sendCommentReply(params: {
        to: string;
        userName: string;
        sessionTitle: string;
        commentAuthor: string;
        commentContent: string;
        sessionUrl: string;
    }): Promise<boolean>;
    sendPrayerUpdate(params: {
        to: string;
        userName: string;
        prayerRequestContent: string;
        updateType: 'new' | 'reaction';
        reactorName?: string;
    }): Promise<boolean>;
    sendGroupInvitation(params: {
        to: string;
        userName: string;
        groupName: string;
        invitedBy: string;
        groupUrl: string;
    }): Promise<boolean>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=email.d.ts.map