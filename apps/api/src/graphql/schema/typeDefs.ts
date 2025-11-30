export const typeDefs = `#graphql
  scalar DateTime

  enum UserRole {
    LEADER
    MEMBER
  }

  enum ResourceType {
    FILE
    VIDEO_UPLOAD
    VIDEO_YOUTUBE
    VIDEO_VIMEO
  }

  enum SessionVisibility {
    PUBLIC
    PRIVATE
  }

  enum SessionType {
    TOPIC_BASED
    SCRIPTURE_BASED
  }

  enum JoinRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type User {
    id: ID!
    email: String!
    name: String
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
    sessions: [Session!]!
    comments: [Comment!]!
  }

  type Series {
    id: ID!
    title: String!
    description: String
    imageUrl: String
    leaderId: String!
    leader: User!
    sessions: [Session!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Session {
    id: ID!
    title: String!
    description: String
    startDate: DateTime!
    endDate: DateTime!
    leaderId: String!
    seriesId: String
    visibility: SessionVisibility!
    sessionType: SessionType!
    videoCallUrl: String
    imageUrl: String
    joinCode: String
    leader: User!
    series: Series
    scripturePassages: [ScripturePassage!]!
    comments: [Comment!]!
    resources: [SessionResource!]!
    participants: [SessionParticipant!]!
    chatMessages: [ChatMessage!]!
    joinRequests: [JoinRequest!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type JoinRequest {
    id: ID!
    sessionId: String!
    fromId: String!
    toId: String!
    status: JoinRequestStatus!
    session: Session!
    from: User!
    to: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ScripturePassage {
    id: ID!
    sessionId: String!
    book: String!
    chapter: Int!
    verseStart: Int!
    verseEnd: Int
    content: String!
    note: String
    order: Int!
    session: Session!
    comments: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    passageId: String!
    sessionId: String!
    userId: String!
    content: String!
    verseNumber: Int
    parentId: String
    passage: ScripturePassage!
    session: Session!
    user: User!
    parent: Comment
    replies: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SessionResource {
    id: ID!
    sessionId: String!
    fileName: String!
    fileUrl: String!
    fileType: String!
    resourceType: ResourceType!
    videoId: String
    uploadedBy: String!
    description: String
    session: Session!
    uploader: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SessionParticipant {
    id: ID!
    sessionId: String!
    userId: String!
    role: UserRole!
    joinedAt: DateTime!
    session: Session!
    user: User!
  }

  type JoinSessionResult {
    participant: SessionParticipant!
    session: Session!
    series: Series
    addedToSeriesSessions: [Session!]!
    totalSessionsJoined: Int!
  }

  type Notification {
    id: ID!
    userId: String!
    sessionId: String!
    type: String!
    content: String!
    sentAt: DateTime
    createdAt: DateTime!
    user: User!
    session: Session!
  }

  type ChatMessage {
    id: ID!
    sessionId: String!
    userId: String!
    message: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    session: Session!
    user: User!
  }

  type ScriptureLibrary {
    id: ID!
    book: String!
    bookNumber: Int!
    chapter: Int!
    verseStart: Int!
    verseEnd: Int
    content: String!
    createdAt: DateTime!
  }

  type BibleBook {
    name: String!
    number: Int!
    chapterCount: Int!
  }

  enum ReactionType {
    HEART
    PRAYING_HANDS
  }

  enum GroupVisibility {
    PUBLIC
    PRIVATE
  }

  type PrayerRequest {
    id: ID!
    userId: String!
    content: String!
    isAnonymous: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    reactions: [PrayerReaction!]!
    reactionCounts: ReactionCounts!
  }

  type PrayerReaction {
    id: ID!
    prayerRequestId: String!
    userId: String!
    reactionType: ReactionType!
    createdAt: DateTime!
    prayerRequest: PrayerRequest!
    user: User!
  }

  type ReactionCounts {
    hearts: Int!
    prayingHands: Int!
  }

  type Group {
    id: ID!
    name: String!
    description: String
    imageUrl: String
    leaderId: String!
    visibility: GroupVisibility!
    createdAt: DateTime!
    updatedAt: DateTime!
    leader: User!
    members: [GroupMember!]!
    chatMessages: [GroupChatMessage!]!
    memberCount: Int!
  }

  type GroupMember {
    id: ID!
    groupId: String!
    userId: String!
    role: UserRole!
    joinedAt: DateTime!
    group: Group!
    user: User!
  }

  type GroupChatMessage {
    id: ID!
    groupId: String!
    userId: String!
    message: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    group: Group!
    user: User!
  }

  type GroupSession {
    id: ID!
    groupId: String!
    sessionId: String!
    addedAt: DateTime!
    group: Group!
    session: Session!
  }

  type GroupSeries {
    id: ID!
    groupId: String!
    seriesId: String!
    addedAt: DateTime!
    group: Group!
    series: Series!
  }

  # Input types for mutations
  input UpdateUserInput {
    name: String
    email: String
  }

  input CreateSeriesInput {
    title: String!
    description: String
    imageUrl: String
  }

  input UpdateSeriesInput {
    title: String
    description: String
    imageUrl: String
  }

  input CreateSessionInput {
    title: String!
    description: String
    startDate: DateTime!
    endDate: DateTime!
    seriesId: String
    visibility: SessionVisibility
    sessionType: SessionType
    videoCallUrl: String
    imageUrl: String
    scripturePassages: [CreateScripturePassageInput!]!
  }

  input UpdateSessionInput {
    title: String
    description: String
    startDate: DateTime
    endDate: DateTime
    seriesId: String
    visibility: SessionVisibility
    sessionType: SessionType
    videoCallUrl: String
    imageUrl: String
  }

  input CreateCommentInput {
    passageId: String!
    sessionId: String!
    content: String!
    verseNumber: Int
    parentId: String
  }

  input UpdateCommentInput {
    content: String!
  }

  input CreateScripturePassageInput {
    book: String!
    chapter: Int!
    verseStart: Int!
    verseEnd: Int
    content: String!
    note: String
  }

  input CreateSessionResourceInput {
    sessionId: String!
    fileName: String!
    fileUrl: String!
    fileType: String!
    resourceType: ResourceType
    videoId: String
    description: String
  }

  input CreateGroupInput {
    name: String!
    description: String
    imageUrl: String
    visibility: GroupVisibility
  }

  input UpdateGroupInput {
    name: String
    description: String
    imageUrl: String
    visibility: GroupVisibility
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!

    # Series queries
    series(id: ID!): Series
    allSeries: [Series!]!
    mySeries: [Series!]!

    # Session queries
    session(id: ID!): Session
    sessions: [Session!]!
    mySessions: [Session!]!
    publicSessions: [Session!]!

    # Comment queries
    comments(sessionId: ID!): [Comment!]!
    commentsByPassage(passageId: ID!): [Comment!]!

    # Scripture queries
    scripturePassages(sessionId: ID!): [ScripturePassage!]!

    # Resource queries
    sessionResources(sessionId: ID!): [SessionResource!]!

    # Chat queries
    chatMessages(sessionId: ID!): [ChatMessage!]!

    # Join request queries
    myJoinRequests: [JoinRequest!]!
    sessionJoinRequests(sessionId: ID!): [JoinRequest!]!

    # Bible library queries
    bibleBooks: [BibleBook!]!
    biblePassages(book: String!, chapter: Int!): [ScriptureLibrary!]!
    searchBible(query: String!): [ScriptureLibrary!]!

    # Prayer request queries
    prayerRequests: [PrayerRequest!]!
    prayerRequest(id: ID!): PrayerRequest

    # Group queries
    groups: [Group!]!
    group(id: ID!): Group
    myGroups: [Group!]!
    publicGroups: [Group!]!
    groupMembers(groupId: ID!): [GroupMember!]!
    groupChatMessages(groupId: ID!): [GroupChatMessage!]!
  }

  type Mutation {
    # Auth mutations
    signup(email: String!, password: String!, name: String!, role: UserRole!): User!

    # User mutations
    updateUser(input: UpdateUserInput!): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!

    # Series mutations
    createSeries(input: CreateSeriesInput!): Series!
    updateSeries(id: ID!, input: UpdateSeriesInput!): Series!
    deleteSeries(id: ID!): Series!

    # Session mutations
    createSession(input: CreateSessionInput!): Session!
    updateSession(id: ID!, input: UpdateSessionInput!): Session!
    deleteSession(id: ID!): Session!

    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, input: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!

    # Scripture passage mutations
    createScripturePassage(input: CreateScripturePassageInput!): ScripturePassage!
    deleteScripturePassage(id: ID!): Boolean!

    # Participant mutations
    joinSession(sessionId: ID!): SessionParticipant!
    joinSessionByCode(joinCode: String!): JoinSessionResult!
    regenerateJoinCode(sessionId: ID!): Session!
    leaveSession(sessionId: ID!): Boolean!

    # Resource mutations
    createSessionResource(input: CreateSessionResourceInput!): SessionResource!
    deleteSessionResource(id: ID!): Boolean!

    # Chat mutations
    sendChatMessage(sessionId: ID!, message: String!): ChatMessage!

    # Join request mutations
    sendJoinRequest(sessionId: ID!, toUserId: ID!): JoinRequest!
    acceptJoinRequest(id: ID!): JoinRequest!
    rejectJoinRequest(id: ID!): JoinRequest!

    # Prayer request mutations
    createPrayerRequest(content: String!, isAnonymous: Boolean!): PrayerRequest!
    deletePrayerRequest(id: ID!): Boolean!
    togglePrayerReaction(prayerRequestId: ID!, reactionType: ReactionType!): PrayerReaction

    # Group mutations
    createGroup(input: CreateGroupInput!): Group!
    updateGroup(id: ID!, input: UpdateGroupInput!): Group!
    deleteGroup(id: ID!): Boolean!
    addGroupMember(groupId: ID!, userId: ID!): GroupMember!
    removeGroupMember(groupId: ID!, userId: ID!): Boolean!
    sendGroupChatMessage(groupId: ID!, message: String!): GroupChatMessage!
    assignGroupToSession(groupId: ID!, sessionId: ID!): GroupSession!
    removeGroupFromSession(groupId: ID!, sessionId: ID!): Boolean!
    assignGroupToSeries(groupId: ID!, seriesId: ID!): GroupSeries!
    removeGroupFromSeries(groupId: ID!, seriesId: ID!): Boolean!
  }

  type Subscription {
    # Real-time comment updates
    commentAdded(sessionId: ID!): Comment!
    commentUpdated(sessionId: ID!): Comment!
    commentDeleted(sessionId: ID!): ID!

    # Typing indicators
    userTyping(sessionId: ID!): TypingIndicator!

    # Chat subscriptions
    chatMessageAdded(sessionId: ID!): ChatMessage!

    # Group chat subscriptions
    groupChatMessageAdded(groupId: ID!): GroupChatMessage!
  }

  type TypingIndicator {
    userId: ID!
    userName: String!
    passageId: ID!
    isTyping: Boolean!
  }
`
