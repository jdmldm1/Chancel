import DataLoader from 'dataloader';
/**
 * DataLoaders for batching and caching database queries
 * Prevents N+1 query problems by batching multiple queries into a single database call
 */
// User DataLoader
export const createUserLoader = (prisma) => {
    return new DataLoader(async (ids) => {
        const users = await prisma.user.findMany({
            where: { id: { in: [...ids] } },
        });
        const userMap = new Map(users.map((user) => [user.id, user]));
        return ids.map((id) => userMap.get(id) || null);
    });
};
// Session DataLoader
export const createSessionLoader = (prisma) => {
    return new DataLoader(async (ids) => {
        const sessions = await prisma.session.findMany({
            where: { id: { in: [...ids] } },
        });
        const sessionMap = new Map(sessions.map((session) => [session.id, session]));
        return ids.map((id) => sessionMap.get(id) || null);
    });
};
// ScripturePassage DataLoader
export const createScripturePassageLoader = (prisma) => {
    return new DataLoader(async (ids) => {
        const passages = await prisma.scripturePassage.findMany({
            where: { id: { in: [...ids] } },
        });
        const passageMap = new Map(passages.map((passage) => [passage.id, passage]));
        return ids.map((id) => passageMap.get(id) || null);
    });
};
// Scripture Passages by Session DataLoader
export const createPassagesBySessionLoader = (prisma) => {
    return new DataLoader(async (sessionIds) => {
        const passages = await prisma.scripturePassage.findMany({
            where: { sessionId: { in: [...sessionIds] } },
            orderBy: { order: 'asc' },
        });
        const passagesBySession = new Map();
        // Group passages by session ID
        passages.forEach((passage) => {
            if (!passagesBySession.has(passage.sessionId)) {
                passagesBySession.set(passage.sessionId, []);
            }
            passagesBySession.get(passage.sessionId).push(passage);
        });
        return sessionIds.map((sessionId) => passagesBySession.get(sessionId) || []);
    });
};
// Comments by Passage DataLoader
export const createCommentsByPassageLoader = (prisma) => {
    return new DataLoader(async (passageIds) => {
        const comments = await prisma.comment.findMany({
            where: {
                passageId: { in: [...passageIds] },
                parentId: null // Only load top-level comments
            },
            orderBy: { createdAt: 'asc' },
        });
        const commentsByPassage = new Map();
        comments.forEach((comment) => {
            if (!commentsByPassage.has(comment.passageId)) {
                commentsByPassage.set(comment.passageId, []);
            }
            commentsByPassage.get(comment.passageId).push(comment);
        });
        return passageIds.map((passageId) => commentsByPassage.get(passageId) || []);
    });
};
// Participants by Session DataLoader
export const createParticipantsBySessionLoader = (prisma) => {
    return new DataLoader(async (sessionIds) => {
        const participants = await prisma.sessionParticipant.findMany({
            where: { sessionId: { in: [...sessionIds] } },
            orderBy: { joinedAt: 'asc' },
        });
        const participantsBySession = new Map();
        participants.forEach((participant) => {
            if (!participantsBySession.has(participant.sessionId)) {
                participantsBySession.set(participant.sessionId, []);
            }
            participantsBySession.get(participant.sessionId).push(participant);
        });
        return sessionIds.map((sessionId) => participantsBySession.get(sessionId) || []);
    });
};
// Comment DataLoader
export const createCommentLoader = (prisma) => {
    return new DataLoader(async (ids) => {
        const comments = await prisma.comment.findMany({
            where: { id: { in: [...ids] } },
        });
        const commentMap = new Map(comments.map((comment) => [comment.id, comment]));
        return ids.map((id) => commentMap.get(id) || null);
    });
};
// Comment Replies DataLoader (for nested comments)
export const createCommentRepliesLoader = (prisma) => {
    return new DataLoader(async (parentIds) => {
        const replies = await prisma.comment.findMany({
            where: { parentId: { in: [...parentIds] } },
            orderBy: { createdAt: 'asc' },
        });
        const repliesByParent = new Map();
        replies.forEach((reply) => {
            if (reply.parentId) {
                if (!repliesByParent.has(reply.parentId)) {
                    repliesByParent.set(reply.parentId, []);
                }
                repliesByParent.get(reply.parentId).push(reply);
            }
        });
        return parentIds.map((parentId) => repliesByParent.get(parentId) || []);
    });
};
/**
 * Creates all DataLoaders for a request
 * Each request gets fresh DataLoaders to avoid caching across requests
 */
export const createDataLoaders = (prisma) => ({
    userLoader: createUserLoader(prisma),
    sessionLoader: createSessionLoader(prisma),
    scripturePassageLoader: createScripturePassageLoader(prisma),
    passagesBySessionLoader: createPassagesBySessionLoader(prisma),
    commentsByPassageLoader: createCommentsByPassageLoader(prisma),
    participantsBySessionLoader: createParticipantsBySessionLoader(prisma),
    commentLoader: createCommentLoader(prisma),
    commentRepliesLoader: createCommentRepliesLoader(prisma),
});
//# sourceMappingURL=dataloaders.js.map