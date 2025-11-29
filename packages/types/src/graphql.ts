export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  session: Session;
  sessionId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  parent?: Maybe<Comment>;
  parentId?: Maybe<Scalars['String']['output']>;
  passage: ScripturePassage;
  passageId: Scalars['String']['output'];
  replies: Array<Comment>;
  session: Session;
  sessionId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
  verseNumber?: Maybe<Scalars['Int']['output']>;
};

export type CreateCommentInput = {
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  passageId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
  verseNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateScripturePassageInput = {
  book: Scalars['String']['input'];
  chapter: Scalars['Int']['input'];
  content: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  verseEnd?: InputMaybe<Scalars['Int']['input']>;
  verseStart: Scalars['Int']['input'];
};

export type CreateSeriesInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  scripturePassages: Array<CreateScripturePassageInput>;
  seriesId?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  videoCallUrl?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<SessionVisibility>;
};

export type CreateSessionResourceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  fileName: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  resourceType?: InputMaybe<ResourceType>;
  sessionId: Scalars['String']['input'];
  videoId?: InputMaybe<Scalars['String']['input']>;
};

export type JoinRequest = {
  __typename?: 'JoinRequest';
  createdAt: Scalars['DateTime']['output'];
  from: User;
  fromId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  session: Session;
  sessionId: Scalars['String']['output'];
  status: JoinRequestStatus;
  to: User;
  toId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum JoinRequestStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptJoinRequest: JoinRequest;
  createComment: Comment;
  createScripturePassage: ScripturePassage;
  createSeries: Series;
  createSession: Session;
  createSessionResource: SessionResource;
  deleteComment: Scalars['Boolean']['output'];
  deleteScripturePassage: Scalars['Boolean']['output'];
  deleteSeries: Series;
  deleteSession: Session;
  deleteSessionResource: Scalars['Boolean']['output'];
  joinSession: SessionParticipant;
  leaveSession: Scalars['Boolean']['output'];
  rejectJoinRequest: JoinRequest;
  sendChatMessage: ChatMessage;
  sendJoinRequest: JoinRequest;
  signup: User;
  updateComment: Comment;
  updateSeries: Series;
  updateSession: Session;
};


export type MutationAcceptJoinRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateScripturePassageArgs = {
  input: CreateScripturePassageInput;
};


export type MutationCreateSeriesArgs = {
  input: CreateSeriesInput;
};


export type MutationCreateSessionArgs = {
  input: CreateSessionInput;
};


export type MutationCreateSessionResourceArgs = {
  input: CreateSessionResourceInput;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteScripturePassageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSeriesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSessionResourceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationLeaveSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationRejectJoinRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSendChatMessageArgs = {
  message: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationSendJoinRequestArgs = {
  sessionId: Scalars['ID']['input'];
  toUserId: Scalars['ID']['input'];
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};


export type MutationUpdateCommentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCommentInput;
};


export type MutationUpdateSeriesArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSeriesInput;
};


export type MutationUpdateSessionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSessionInput;
};

export type Notification = {
  __typename?: 'Notification';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  sentAt?: Maybe<Scalars['DateTime']['output']>;
  session: Session;
  sessionId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  allSeries: Array<Series>;
  chatMessages: Array<ChatMessage>;
  comments: Array<Comment>;
  commentsByPassage: Array<Comment>;
  me?: Maybe<User>;
  myJoinRequests: Array<JoinRequest>;
  mySeries: Array<Series>;
  mySessions: Array<Session>;
  publicSessions: Array<Session>;
  scripturePassages: Array<ScripturePassage>;
  series?: Maybe<Series>;
  session?: Maybe<Session>;
  sessionJoinRequests: Array<JoinRequest>;
  sessionResources: Array<SessionResource>;
  sessions: Array<Session>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryChatMessagesArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QueryCommentsArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QueryCommentsByPassageArgs = {
  passageId: Scalars['ID']['input'];
};


export type QueryScripturePassagesArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QuerySeriesArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySessionArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySessionJoinRequestsArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QuerySessionResourcesArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum ResourceType {
  File = 'FILE',
  VideoUpload = 'VIDEO_UPLOAD',
  VideoVimeo = 'VIDEO_VIMEO',
  VideoYoutube = 'VIDEO_YOUTUBE'
}

export type ScripturePassage = {
  __typename?: 'ScripturePassage';
  book: Scalars['String']['output'];
  chapter: Scalars['Int']['output'];
  comments: Array<Comment>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  session: Session;
  sessionId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verseEnd?: Maybe<Scalars['Int']['output']>;
  verseStart: Scalars['Int']['output'];
};

export type Series = {
  __typename?: 'Series';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  leader: User;
  leaderId: Scalars['String']['output'];
  sessions: Array<Session>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Session = {
  __typename?: 'Session';
  chatMessages: Array<ChatMessage>;
  comments: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  joinRequests: Array<JoinRequest>;
  leader: User;
  leaderId: Scalars['String']['output'];
  participants: Array<SessionParticipant>;
  resources: Array<SessionResource>;
  scripturePassages: Array<ScripturePassage>;
  series?: Maybe<Series>;
  seriesId?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  videoCallUrl?: Maybe<Scalars['String']['output']>;
  visibility: SessionVisibility;
};

export type SessionParticipant = {
  __typename?: 'SessionParticipant';
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  role: UserRole;
  session: Session;
  sessionId: Scalars['String']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type SessionResource = {
  __typename?: 'SessionResource';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  fileName: Scalars['String']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  resourceType: ResourceType;
  session: Session;
  sessionId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  uploadedBy: Scalars['String']['output'];
  uploader: User;
  videoId?: Maybe<Scalars['String']['output']>;
};

export enum SessionVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Subscription = {
  __typename?: 'Subscription';
  chatMessageAdded: ChatMessage;
  commentAdded: Comment;
  commentDeleted: Scalars['ID']['output'];
  commentUpdated: Comment;
  userTyping: TypingIndicator;
};


export type SubscriptionChatMessageAddedArgs = {
  sessionId: Scalars['ID']['input'];
};


export type SubscriptionCommentAddedArgs = {
  sessionId: Scalars['ID']['input'];
};


export type SubscriptionCommentDeletedArgs = {
  sessionId: Scalars['ID']['input'];
};


export type SubscriptionCommentUpdatedArgs = {
  sessionId: Scalars['ID']['input'];
};


export type SubscriptionUserTypingArgs = {
  sessionId: Scalars['ID']['input'];
};

export type TypingIndicator = {
  __typename?: 'TypingIndicator';
  isTyping: Scalars['Boolean']['output'];
  passageId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
};

export type UpdateCommentInput = {
  content: Scalars['String']['input'];
};

export type UpdateSeriesInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  seriesId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  videoCallUrl?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<SessionVisibility>;
};

export type User = {
  __typename?: 'User';
  comments: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  sessions: Array<Session>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Leader = 'LEADER',
  Member = 'MEMBER'
}

export type GetChatMessagesQueryVariables = Exact<{
  sessionId: Scalars['ID']['input'];
}>;


export type GetChatMessagesQuery = { __typename?: 'Query', chatMessages: Array<{ __typename?: 'ChatMessage', id: string, message: string, createdAt: any, user: { __typename?: 'User', id: string, name?: string | null } }> };

export type SendChatMessageMutationVariables = Exact<{
  sessionId: Scalars['ID']['input'];
  message: Scalars['String']['input'];
}>;


export type SendChatMessageMutation = { __typename?: 'Mutation', sendChatMessage: { __typename?: 'ChatMessage', id: string, message: string, createdAt: any, user: { __typename?: 'User', id: string, name?: string | null } } };

export type ChatMessageAddedSubscriptionVariables = Exact<{
  sessionId: Scalars['ID']['input'];
}>;


export type ChatMessageAddedSubscription = { __typename?: 'Subscription', chatMessageAdded: { __typename?: 'ChatMessage', id: string, message: string, createdAt: any, user: { __typename?: 'User', id: string, name?: string | null } } };

export type GetSessionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSessionQuery = { __typename?: 'Query', session?: { __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, seriesId?: string | null, visibility: SessionVisibility, videoCallUrl?: string | null, imageUrl?: string | null, series?: { __typename?: 'Series', id: string, title: string } | null, leader: { __typename?: 'User', id: string, name?: string | null, email: string }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, note?: string | null, order: number, comments: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, parentId?: string | null, user: { __typename?: 'User', id: string, name?: string | null }, replies: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, parentId?: string | null, user: { __typename?: 'User', id: string, name?: string | null }, replies: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, user: { __typename?: 'User', id: string, name?: string | null } }> }> }> }>, participants: Array<{ __typename?: 'SessionParticipant', id: string, joinedAt: any, role: UserRole, user: { __typename?: 'User', id: string, name?: string | null, role: UserRole } }>, resources: Array<{ __typename?: 'SessionResource', id: string, fileName: string, fileUrl: string, fileType: string, resourceType: ResourceType, videoId?: string | null, description?: string | null, createdAt: any, uploader: { __typename?: 'User', id: string, name?: string | null } }> } | null };

export type GetCommentsByPassageQueryVariables = Exact<{
  passageId: Scalars['ID']['input'];
}>;


export type GetCommentsByPassageQuery = { __typename?: 'Query', commentsByPassage: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, parentId?: string | null, user: { __typename?: 'User', id: string, name?: string | null }, replies: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, user: { __typename?: 'User', id: string, name?: string | null } }> }> };

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, passageId: string, sessionId: string, parentId?: string | null, user: { __typename?: 'User', id: string, name?: string | null } } };

export type UpdateCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, passageId: string, sessionId: string, parentId?: string | null, user: { __typename?: 'User', id: string, name?: string | null } } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type JoinSessionMutationVariables = Exact<{
  sessionId: Scalars['ID']['input'];
}>;


export type JoinSessionMutation = { __typename?: 'Mutation', joinSession: { __typename?: 'SessionParticipant', id: string, joinedAt: any, role: UserRole, user: { __typename?: 'User', id: string, name?: string | null } } };

export type CreateSessionResourceMutationVariables = Exact<{
  input: CreateSessionResourceInput;
}>;


export type CreateSessionResourceMutation = { __typename?: 'Mutation', createSessionResource: { __typename?: 'SessionResource', id: string, fileName: string, fileUrl: string, fileType: string, description?: string | null, createdAt: any, uploader: { __typename?: 'User', id: string, name?: string | null } } };

export type DeleteSessionResourceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSessionResourceMutation = { __typename?: 'Mutation', deleteSessionResource: boolean };

export type CommentAddedSubscriptionVariables = Exact<{
  sessionId: Scalars['ID']['input'];
}>;


export type CommentAddedSubscription = { __typename?: 'Subscription', commentAdded: { __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, parentId?: string | null, passageId: string, user: { __typename?: 'User', id: string, name?: string | null }, replies: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, user: { __typename?: 'User', id: string, name?: string | null } }> } };

export type GetMySessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySessionsQuery = { __typename?: 'Query', mySessions: Array<{ __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, visibility: SessionVisibility, series?: { __typename?: 'Series', id: string, title: string } | null, leader: { __typename?: 'User', id: string, name?: string | null, email: string }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, order: number }>, participants: Array<{ __typename?: 'SessionParticipant', id: string, user: { __typename?: 'User', id: string, name?: string | null } }> }> };

export type GetAllSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSessionsQuery = { __typename?: 'Query', publicSessions: Array<{ __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, visibility: SessionVisibility, series?: { __typename?: 'Series', id: string, title: string } | null, leader: { __typename?: 'User', id: string, name?: string | null, email: string }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, order: number }>, participants: Array<{ __typename?: 'SessionParticipant', id: string, user: { __typename?: 'User', id: string, name?: string | null } }> }> };

export type CreateSessionMutationVariables = Exact<{
  input: CreateSessionInput;
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', createSession: { __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, seriesId?: string | null, visibility: SessionVisibility, videoCallUrl?: string | null, leader: { __typename?: 'User', id: string, name?: string | null }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, order: number }> } };

export type UpdateSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSessionInput;
}>;


export type UpdateSessionMutation = { __typename?: 'Mutation', updateSession: { __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, seriesId?: string | null, visibility: SessionVisibility, videoCallUrl?: string | null } };

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', deleteSession: { __typename?: 'Session', id: string, title: string } };
