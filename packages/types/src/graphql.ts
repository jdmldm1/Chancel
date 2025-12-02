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

export type AdminStats = {
  __typename?: 'AdminStats';
  totalComments: Scalars['Int']['output'];
  totalGroups: Scalars['Int']['output'];
  totalLeaders: Scalars['Int']['output'];
  totalMembers: Scalars['Int']['output'];
  totalPrayerRequests: Scalars['Int']['output'];
  totalSessions: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type BibleBook = {
  __typename?: 'BibleBook';
  chapterCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
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

export type CreateGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  visibility?: InputMaybe<GroupVisibility>;
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
  sessionType?: InputMaybe<SessionType>;
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

export type Group = {
  __typename?: 'Group';
  chatMessages: Array<GroupChatMessage>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  leader: User;
  leaderId: Scalars['String']['output'];
  memberCount: Scalars['Int']['output'];
  members: Array<GroupMember>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visibility: GroupVisibility;
};

export type GroupChatMessage = {
  __typename?: 'GroupChatMessage';
  createdAt: Scalars['DateTime']['output'];
  group: Group;
  groupId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type GroupMember = {
  __typename?: 'GroupMember';
  group: Group;
  groupId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  role: UserRole;
  user: User;
  userId: Scalars['String']['output'];
};

export type GroupSeries = {
  __typename?: 'GroupSeries';
  addedAt: Scalars['DateTime']['output'];
  group: Group;
  groupId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  series: Series;
  seriesId: Scalars['String']['output'];
};

export type GroupSession = {
  __typename?: 'GroupSession';
  addedAt: Scalars['DateTime']['output'];
  group: Group;
  groupId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  session: Session;
  sessionId: Scalars['String']['output'];
};

export enum GroupVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

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

export type JoinSessionResult = {
  __typename?: 'JoinSessionResult';
  addedToSeriesSessions: Array<Session>;
  participant: SessionParticipant;
  series?: Maybe<Series>;
  session: Session;
  totalSessionsJoined: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptJoinRequest: JoinRequest;
  addGroupMember: GroupMember;
  adminDeleteGroup: Scalars['Boolean']['output'];
  adminDeleteSeries: Scalars['Boolean']['output'];
  adminDeleteSession: Scalars['Boolean']['output'];
  adminDeleteUser: Scalars['Boolean']['output'];
  adminUpdateUserRole: User;
  assignGroupToSeries: GroupSeries;
  assignGroupToSession: GroupSession;
  changePassword: Scalars['Boolean']['output'];
  createComment: Comment;
  createGroup: Group;
  createPrayerRequest: PrayerRequest;
  createScripturePassage: ScripturePassage;
  createSeries: Series;
  createSession: Session;
  createSessionResource: SessionResource;
  deleteComment: Scalars['Boolean']['output'];
  deleteGroup: Scalars['Boolean']['output'];
  deletePrayerRequest: Scalars['Boolean']['output'];
  deleteScripturePassage: Scalars['Boolean']['output'];
  deleteSeries: Series;
  deleteSession: Session;
  deleteSessionResource: Scalars['Boolean']['output'];
  joinSession: SessionParticipant;
  joinSessionByCode: JoinSessionResult;
  leaveSession: Scalars['Boolean']['output'];
  regenerateJoinCode: Session;
  rejectJoinRequest: JoinRequest;
  removeGroupFromSeries: Scalars['Boolean']['output'];
  removeGroupFromSession: Scalars['Boolean']['output'];
  removeGroupMember: Scalars['Boolean']['output'];
  sendChatMessage: ChatMessage;
  sendGroupChatMessage: GroupChatMessage;
  sendJoinRequest: JoinRequest;
  signup: User;
  togglePrayerReaction?: Maybe<PrayerReaction>;
  updateComment: Comment;
  updateGroup: Group;
  updateSeries: Series;
  updateSession: Session;
  updateUser: User;
};


export type MutationAcceptJoinRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAddGroupMemberArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAdminDeleteGroupArgs = {
  groupId: Scalars['ID']['input'];
};


export type MutationAdminDeleteSeriesArgs = {
  seriesId: Scalars['ID']['input'];
};


export type MutationAdminDeleteSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationAdminDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationAdminUpdateUserRoleArgs = {
  role: UserRole;
  userId: Scalars['ID']['input'];
};


export type MutationAssignGroupToSeriesArgs = {
  groupId: Scalars['ID']['input'];
  seriesId: Scalars['ID']['input'];
};


export type MutationAssignGroupToSessionArgs = {
  groupId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreatePrayerRequestArgs = {
  content: Scalars['String']['input'];
  isAnonymous: Scalars['Boolean']['input'];
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


export type MutationDeleteGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePrayerRequestArgs = {
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


export type MutationJoinSessionByCodeArgs = {
  joinCode: Scalars['String']['input'];
};


export type MutationLeaveSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationRegenerateJoinCodeArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationRejectJoinRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveGroupFromSeriesArgs = {
  groupId: Scalars['ID']['input'];
  seriesId: Scalars['ID']['input'];
};


export type MutationRemoveGroupFromSessionArgs = {
  groupId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationRemoveGroupMemberArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationSendChatMessageArgs = {
  message: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationSendGroupChatMessageArgs = {
  groupId: Scalars['ID']['input'];
  message: Scalars['String']['input'];
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


export type MutationTogglePrayerReactionArgs = {
  prayerRequestId: Scalars['ID']['input'];
  reactionType: ReactionType;
};


export type MutationUpdateCommentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCommentInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
};


export type MutationUpdateSeriesArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSeriesInput;
};


export type MutationUpdateSessionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSessionInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
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

export type PrayerReaction = {
  __typename?: 'PrayerReaction';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  prayerRequest: PrayerRequest;
  prayerRequestId: Scalars['String']['output'];
  reactionType: ReactionType;
  user: User;
  userId: Scalars['String']['output'];
};

export type PrayerRequest = {
  __typename?: 'PrayerRequest';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isAnonymous: Scalars['Boolean']['output'];
  reactionCounts: ReactionCounts;
  reactions: Array<PrayerReaction>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminStats: AdminStats;
  allGroups: Array<Group>;
  allSeries: Array<Series>;
  allSessions: Array<Session>;
  allUsers: Array<User>;
  bibleBooks: Array<BibleBook>;
  biblePassages: Array<ScriptureLibrary>;
  chatMessages: Array<ChatMessage>;
  comments: Array<Comment>;
  commentsByPassage: Array<Comment>;
  group?: Maybe<Group>;
  groupChatMessages: Array<GroupChatMessage>;
  groupMembers: Array<GroupMember>;
  groups: Array<Group>;
  me?: Maybe<User>;
  myGroups: Array<Group>;
  myJoinRequests: Array<JoinRequest>;
  mySeries: Array<Series>;
  mySessions: Array<Session>;
  prayerRequest?: Maybe<PrayerRequest>;
  prayerRequests: Array<PrayerRequest>;
  publicGroups: Array<Group>;
  publicSessions: Array<Session>;
  scripturePassages: Array<ScripturePassage>;
  searchBible: Array<ScriptureLibrary>;
  series?: Maybe<Series>;
  session?: Maybe<Session>;
  sessionJoinRequests: Array<JoinRequest>;
  sessionResources: Array<SessionResource>;
  sessions: Array<Session>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryBiblePassagesArgs = {
  book: Scalars['String']['input'];
  chapter: Scalars['Int']['input'];
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


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGroupChatMessagesArgs = {
  groupId: Scalars['ID']['input'];
};


export type QueryGroupMembersArgs = {
  groupId: Scalars['ID']['input'];
};


export type QueryMySessionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPrayerRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPublicSessionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryScripturePassagesArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QuerySearchBibleArgs = {
  query: Scalars['String']['input'];
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


export type QuerySessionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type ReactionCounts = {
  __typename?: 'ReactionCounts';
  hearts: Scalars['Int']['output'];
  prayingHands: Scalars['Int']['output'];
};

export enum ReactionType {
  Heart = 'HEART',
  PrayingHands = 'PRAYING_HANDS'
}

export enum ResourceType {
  File = 'FILE',
  VideoUpload = 'VIDEO_UPLOAD',
  VideoVimeo = 'VIDEO_VIMEO',
  VideoYoutube = 'VIDEO_YOUTUBE'
}

export type ScriptureLibrary = {
  __typename?: 'ScriptureLibrary';
  book: Scalars['String']['output'];
  bookNumber: Scalars['Int']['output'];
  chapter: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  verseEnd?: Maybe<Scalars['Int']['output']>;
  verseStart: Scalars['Int']['output'];
};

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
  joinCode?: Maybe<Scalars['String']['output']>;
  joinRequests: Array<JoinRequest>;
  leader: User;
  leaderId: Scalars['String']['output'];
  participants: Array<SessionParticipant>;
  resources: Array<SessionResource>;
  scripturePassages: Array<ScripturePassage>;
  series?: Maybe<Series>;
  seriesId?: Maybe<Scalars['String']['output']>;
  sessionType: SessionType;
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

export enum SessionType {
  ScriptureBased = 'SCRIPTURE_BASED',
  TopicBased = 'TOPIC_BASED'
}

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
  groupChatMessageAdded: GroupChatMessage;
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


export type SubscriptionGroupChatMessageAddedArgs = {
  groupId: Scalars['ID']['input'];
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

export type UpdateGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<GroupVisibility>;
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
  sessionType?: InputMaybe<SessionType>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  videoCallUrl?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<SessionVisibility>;
};

export type UpdateUserInput = {
  bibleTranslation?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  commentNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  prayerNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  bibleTranslation: Scalars['String']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  commentNotifications: Scalars['Boolean']['output'];
  comments: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailNotifications: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  prayerNotifications: Scalars['Boolean']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  sessions: Array<Session>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Leader = 'LEADER',
  Member = 'MEMBER'
}

export type BibleBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type BibleBooksQuery = { __typename?: 'Query', bibleBooks: Array<{ __typename?: 'BibleBook', name: string, number: number, chapterCount: number }> };

export type BiblePassagesQueryVariables = Exact<{
  book: Scalars['String']['input'];
  chapter: Scalars['Int']['input'];
}>;


export type BiblePassagesQuery = { __typename?: 'Query', biblePassages: Array<{ __typename?: 'ScriptureLibrary', id: string, book: string, bookNumber: number, chapter: number, verseStart: number, verseEnd?: number | null, content: string }> };

export type SearchBibleQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchBibleQuery = { __typename?: 'Query', searchBible: Array<{ __typename?: 'ScriptureLibrary', id: string, book: string, bookNumber: number, chapter: number, verseStart: number, verseEnd?: number | null, content: string }> };

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


export type GetSessionQuery = { __typename?: 'Query', session?: { __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, seriesId?: string | null, visibility: SessionVisibility, sessionType: SessionType, videoCallUrl?: string | null, imageUrl?: string | null, series?: { __typename?: 'Series', id: string, title: string, imageUrl?: string | null } | null, leader: { __typename?: 'User', id: string, name?: string | null, email: string }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, note?: string | null, order: number, comments: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, parentId?: string | null, user: { __typename?: 'User', id: string, name?: string | null }, replies: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, parentId?: string | null, user: { __typename?: 'User', id: string, name?: string | null }, replies: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, verseNumber?: number | null, user: { __typename?: 'User', id: string, name?: string | null } }> }> }> }>, participants: Array<{ __typename?: 'SessionParticipant', id: string, joinedAt: any, role: UserRole, user: { __typename?: 'User', id: string, name?: string | null, role: UserRole } }>, resources: Array<{ __typename?: 'SessionResource', id: string, fileName: string, fileUrl: string, fileType: string, resourceType: ResourceType, videoId?: string | null, description?: string | null, createdAt: any, uploader: { __typename?: 'User', id: string, name?: string | null } }> } | null };

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


export type GetMySessionsQuery = { __typename?: 'Query', mySessions: Array<{ __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, visibility: SessionVisibility, sessionType: SessionType, imageUrl?: string | null, series?: { __typename?: 'Series', id: string, title: string, imageUrl?: string | null } | null, leader: { __typename?: 'User', id: string, name?: string | null, email: string }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, order: number }>, participants: Array<{ __typename?: 'SessionParticipant', id: string, user: { __typename?: 'User', id: string, name?: string | null } }> }> };

export type GetAllSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSessionsQuery = { __typename?: 'Query', publicSessions: Array<{ __typename?: 'Session', id: string, title: string, description?: string | null, startDate: any, endDate: any, visibility: SessionVisibility, sessionType: SessionType, imageUrl?: string | null, series?: { __typename?: 'Series', id: string, title: string, imageUrl?: string | null } | null, leader: { __typename?: 'User', id: string, name?: string | null, email: string }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, order: number }>, participants: Array<{ __typename?: 'SessionParticipant', id: string, user: { __typename?: 'User', id: string, name?: string | null } }> }> };

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
