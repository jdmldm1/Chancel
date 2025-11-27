export const typeDefs = `#graphql
  scalar DateTime

  enum UserRole {
    LEADER
    MEMBER
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

  type Session {
    id: ID!
    title: String!
    description: String
    scheduledDate: DateTime!
    leaderId: String!
    leader: User!
    scripturePassages: [ScripturePassage!]!
    comments: [Comment!]!
    resources: [SessionResource!]!
    participants: [SessionParticipant!]!
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

  # Input types for mutations
  input CreateSessionInput {
    title: String!
    description: String
    scheduledDate: DateTime!
    scripturePassages: [CreateScripturePassageInput!]!
  }

  input UpdateSessionInput {
    title: String
    description: String
    scheduledDate: DateTime
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
  }

  input CreateSessionResourceInput {
    sessionId: String!
    fileName: String!
    fileUrl: String!
    fileType: String!
    description: String
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!

    # Session queries
    session(id: ID!): Session
    sessions: [Session!]!
    mySessions: [Session!]!

    # Comment queries
    comments(sessionId: ID!): [Comment!]!
    commentsByPassage(passageId: ID!): [Comment!]!

    # Scripture queries
    scripturePassages(sessionId: ID!): [ScripturePassage!]!

    # Resource queries
    sessionResources(sessionId: ID!): [SessionResource!]!
  }

  type Mutation {
    # Auth mutations
    signup(email: String!, password: String!, name: String!, role: UserRole!): User!

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
    leaveSession(sessionId: ID!): Boolean!

    # Resource mutations
    createSessionResource(input: CreateSessionResourceInput!): SessionResource!
    deleteSessionResource(id: ID!): Boolean!
  }

  type Subscription {
    # Real-time comment updates
    commentAdded(sessionId: ID!): Comment!
    commentUpdated(sessionId: ID!): Comment!
    commentDeleted(sessionId: ID!): ID!

    # Typing indicators
    userTyping(sessionId: ID!): TypingIndicator!
  }

  type TypingIndicator {
    userId: ID!
    userName: String!
    passageId: ID!
    isTyping: Boolean!
  }
`
