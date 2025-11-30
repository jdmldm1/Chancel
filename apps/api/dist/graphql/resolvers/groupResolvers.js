import { UserRole, GroupVisibility } from '@prisma/client';
export const groupResolvers = {
    Query: {
        groups: async (_parent, _args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Return all groups where user is a member or leader, plus public groups
            const userGroups = await context.prisma.group.findMany({
                where: {
                    OR: [
                        { visibility: GroupVisibility.PUBLIC },
                        { leaderId: context.userId },
                        {
                            members: {
                                some: {
                                    userId: context.userId,
                                },
                            },
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            });
            return userGroups;
        },
        group: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const group = await context.prisma.group.findUnique({
                where: { id: args.id },
                include: {
                    members: true,
                },
            });
            if (!group) {
                throw new Error('Group not found');
            }
            // Check if user has access to this group
            const isLeader = group.leaderId === context.userId;
            const isMember = group.members.some(m => m.userId === context.userId);
            const isPublic = group.visibility === GroupVisibility.PUBLIC;
            if (!isLeader && !isMember && !isPublic) {
                throw new Error('Not authorized to view this group');
            }
            return group;
        },
        myGroups: async (_parent, _args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return context.prisma.group.findMany({
                where: {
                    OR: [
                        { leaderId: context.userId },
                        {
                            members: {
                                some: {
                                    userId: context.userId,
                                },
                            },
                        },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            });
        },
        publicGroups: async (_parent, _args, context) => {
            return context.prisma.group.findMany({
                where: { visibility: GroupVisibility.PUBLIC },
                orderBy: { createdAt: 'desc' },
            });
        },
        groupMembers: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return context.prisma.groupMember.findMany({
                where: { groupId: args.groupId },
                orderBy: { joinedAt: 'asc' },
            });
        },
        groupChatMessages: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return context.prisma.groupChatMessage.findMany({
                where: { groupId: args.groupId },
                orderBy: { createdAt: 'asc' },
            });
        },
    },
    Mutation: {
        createGroup: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Check if user has LEADER role
            const user = await context.prisma.user.findUnique({
                where: { id: context.userId },
            });
            if (!user || user.role !== UserRole.LEADER) {
                throw new Error('Only leaders can create groups');
            }
            const group = await context.prisma.group.create({
                data: {
                    name: args.input.name,
                    description: args.input.description,
                    imageUrl: args.input.imageUrl,
                    visibility: args.input.visibility || GroupVisibility.PUBLIC,
                    leaderId: context.userId,
                },
            });
            // Automatically add the leader as a member
            await context.prisma.groupMember.create({
                data: {
                    groupId: group.id,
                    userId: context.userId,
                    role: UserRole.LEADER,
                },
            });
            return group;
        },
        updateGroup: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const group = await context.prisma.group.findUnique({
                where: { id: args.id },
            });
            if (!group || group.leaderId !== context.userId) {
                throw new Error('Not authorized');
            }
            return context.prisma.group.update({
                where: { id: args.id },
                data: args.input,
            });
        },
        deleteGroup: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const group = await context.prisma.group.findUnique({
                where: { id: args.id },
            });
            if (!group || group.leaderId !== context.userId) {
                throw new Error('Not authorized');
            }
            await context.prisma.group.delete({
                where: { id: args.id },
            });
            return true;
        },
        addGroupMember: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const group = await context.prisma.group.findUnique({
                where: { id: args.groupId },
            });
            if (!group) {
                throw new Error('Group not found');
            }
            // Only group leader can add members
            if (group.leaderId !== context.userId) {
                throw new Error('Only group leaders can add members');
            }
            // Check if user is already a member
            const existing = await context.prisma.groupMember.findUnique({
                where: {
                    groupId_userId: {
                        groupId: args.groupId,
                        userId: args.userId,
                    },
                },
            });
            if (existing) {
                throw new Error('User is already a member of this group');
            }
            return context.prisma.groupMember.create({
                data: {
                    groupId: args.groupId,
                    userId: args.userId,
                    role: UserRole.MEMBER,
                },
            });
        },
        removeGroupMember: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            const group = await context.prisma.group.findUnique({
                where: { id: args.groupId },
            });
            if (!group) {
                throw new Error('Group not found');
            }
            // Only group leader can remove members, or members can remove themselves
            if (group.leaderId !== context.userId && args.userId !== context.userId) {
                throw new Error('Not authorized');
            }
            // Prevent leader from removing themselves
            if (group.leaderId === args.userId) {
                throw new Error('Group leader cannot be removed. Delete the group instead.');
            }
            await context.prisma.groupMember.deleteMany({
                where: {
                    groupId: args.groupId,
                    userId: args.userId,
                },
            });
            return true;
        },
        sendGroupChatMessage: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Verify user is a member of the group
            const member = await context.prisma.groupMember.findUnique({
                where: {
                    groupId_userId: {
                        groupId: args.groupId,
                        userId: context.userId,
                    },
                },
            });
            if (!member) {
                throw new Error('Not authorized to send messages in this group');
            }
            const chatMessage = await context.prisma.groupChatMessage.create({
                data: {
                    groupId: args.groupId,
                    userId: context.userId,
                    message: args.message,
                },
                include: {
                    user: true,
                },
            });
            // Publish the message to subscribers
            const { pubsub } = await import('../../index.js');
            pubsub.publish(`GROUP_CHAT_MESSAGE_ADDED_${args.groupId}`, chatMessage);
            return chatMessage;
        },
        assignGroupToSession: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Check if user is session leader
            const session = await context.prisma.session.findUnique({
                where: { id: args.sessionId },
            });
            if (!session || session.leaderId !== context.userId) {
                throw new Error('Only session leaders can assign groups');
            }
            // Check if group assignment already exists
            const existing = await context.prisma.groupSession.findUnique({
                where: {
                    groupId_sessionId: {
                        groupId: args.groupId,
                        sessionId: args.sessionId,
                    },
                },
            });
            if (existing) {
                throw new Error('Group is already assigned to this session');
            }
            // Create the group-session assignment
            const groupSession = await context.prisma.groupSession.create({
                data: {
                    groupId: args.groupId,
                    sessionId: args.sessionId,
                },
            });
            // Add all group members to the session
            const groupMembers = await context.prisma.groupMember.findMany({
                where: { groupId: args.groupId },
            });
            if (groupMembers.length > 0) {
                await context.prisma.sessionParticipant.createMany({
                    data: groupMembers.map(member => ({
                        sessionId: args.sessionId,
                        userId: member.userId,
                        role: member.role,
                    })),
                    skipDuplicates: true,
                });
            }
            return groupSession;
        },
        removeGroupFromSession: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Check if user is session leader
            const session = await context.prisma.session.findUnique({
                where: { id: args.sessionId },
            });
            if (!session || session.leaderId !== context.userId) {
                throw new Error('Only session leaders can remove group assignments');
            }
            await context.prisma.groupSession.deleteMany({
                where: {
                    groupId: args.groupId,
                    sessionId: args.sessionId,
                },
            });
            return true;
        },
        assignGroupToSeries: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Check if user is series leader
            const series = await context.prisma.series.findUnique({
                where: { id: args.seriesId },
                include: { sessions: true },
            });
            if (!series || series.leaderId !== context.userId) {
                throw new Error('Only series leaders can assign groups');
            }
            // Check if group assignment already exists
            const existing = await context.prisma.groupSeries.findUnique({
                where: {
                    groupId_seriesId: {
                        groupId: args.groupId,
                        seriesId: args.seriesId,
                    },
                },
            });
            if (existing) {
                throw new Error('Group is already assigned to this series');
            }
            // Create the group-series assignment
            const groupSeries = await context.prisma.groupSeries.create({
                data: {
                    groupId: args.groupId,
                    seriesId: args.seriesId,
                },
            });
            // Add all group members to all sessions in the series
            const groupMembers = await context.prisma.groupMember.findMany({
                where: { groupId: args.groupId },
            });
            if (groupMembers.length > 0 && series.sessions.length > 0) {
                for (const session of series.sessions) {
                    await context.prisma.sessionParticipant.createMany({
                        data: groupMembers.map(member => ({
                            sessionId: session.id,
                            userId: member.userId,
                            role: member.role,
                        })),
                        skipDuplicates: true,
                    });
                }
            }
            return groupSeries;
        },
        removeGroupFromSeries: async (_parent, args, context) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Check if user is series leader
            const series = await context.prisma.series.findUnique({
                where: { id: args.seriesId },
            });
            if (!series || series.leaderId !== context.userId) {
                throw new Error('Only series leaders can remove group assignments');
            }
            await context.prisma.groupSeries.deleteMany({
                where: {
                    groupId: args.groupId,
                    seriesId: args.seriesId,
                },
            });
            return true;
        },
    },
    // Field resolvers
    Group: {
        leader: (parent, _args, context) => {
            return context.loaders.userLoader.load(parent.leaderId);
        },
        members: (parent, _args, context) => {
            return context.prisma.groupMember.findMany({
                where: { groupId: parent.id },
                orderBy: { joinedAt: 'asc' },
            });
        },
        chatMessages: (parent, _args, context) => {
            return context.prisma.groupChatMessage.findMany({
                where: { groupId: parent.id },
                orderBy: { createdAt: 'asc' },
            });
        },
        memberCount: async (parent, _args, context) => {
            return context.prisma.groupMember.count({
                where: { groupId: parent.id },
            });
        },
    },
    GroupMember: {
        group: (parent, _args, context) => {
            return context.prisma.group.findUnique({
                where: { id: parent.groupId },
            });
        },
        user: (parent, _args, context) => {
            return context.loaders.userLoader.load(parent.userId);
        },
    },
    GroupChatMessage: {
        group: (parent, _args, context) => {
            return context.prisma.group.findUnique({
                where: { id: parent.groupId },
            });
        },
        user: (parent, _args, context) => {
            return context.loaders.userLoader.load(parent.userId);
        },
    },
    GroupSession: {
        group: (parent, _args, context) => {
            return context.prisma.group.findUnique({
                where: { id: parent.groupId },
            });
        },
        session: (parent, _args, context) => {
            return context.loaders.sessionLoader.load(parent.sessionId);
        },
    },
    GroupSeries: {
        group: (parent, _args, context) => {
            return context.prisma.group.findUnique({
                where: { id: parent.groupId },
            });
        },
        series: (parent, _args, context) => {
            return context.prisma.series.findUnique({
                where: { id: parent.seriesId },
            });
        },
    },
    Subscription: {
        groupChatMessageAdded: {
            subscribe: async function* (_parent, args, _context) {
                const { pubsub } = await import('../../index.js');
                const topic = `GROUP_CHAT_MESSAGE_ADDED_${args.groupId}`;
                const asyncIterator = {
                    [Symbol.asyncIterator]() {
                        const queue = [];
                        let resolver = null;
                        const unsubscribe = pubsub.subscribe(topic, (data) => {
                            if (resolver) {
                                resolver({ value: { groupChatMessageAdded: data }, done: false });
                                resolver = null;
                            }
                            else {
                                queue.push(data);
                            }
                        });
                        return {
                            next() {
                                if (queue.length > 0) {
                                    return Promise.resolve({ value: { groupChatMessageAdded: queue.shift() }, done: false });
                                }
                                return new Promise((resolve) => {
                                    resolver = resolve;
                                });
                            },
                            return() {
                                unsubscribe();
                                return Promise.resolve({ value: undefined, done: true });
                            },
                            throw(_error) {
                                unsubscribe();
                                return Promise.resolve({ value: undefined, done: true });
                            },
                        };
                    },
                };
                yield* asyncIterator;
            },
        },
    },
};
//# sourceMappingURL=groupResolvers.js.map