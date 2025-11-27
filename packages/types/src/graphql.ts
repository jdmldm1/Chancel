import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
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
};

export type CreateCommentInput = {
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  passageId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
};

export type CreateScripturePassageInput = {
  book: Scalars['String']['input'];
  chapter: Scalars['Int']['input'];
  content: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  sessionId: Scalars['String']['input'];
  verseEnd?: InputMaybe<Scalars['Int']['input']>;
  verseStart: Scalars['Int']['input'];
};

export type CreateSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  scheduledDate: Scalars['DateTime']['input'];
  scripturePassages: Array<CreateScripturePassageInput>;
  title: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Comment;
  createScripturePassage: ScripturePassage;
  createSession: Session;
  deleteComment: Scalars['Boolean']['output'];
  deleteScripturePassage: Scalars['Boolean']['output'];
  deleteSession: Session;
  joinSession: SessionParticipant;
  leaveSession: Scalars['Boolean']['output'];
  updateComment: Comment;
  updateSession: Session;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateScripturePassageArgs = {
  input: CreateScripturePassageInput;
};


export type MutationCreateSessionArgs = {
  input: CreateSessionInput;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteScripturePassageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationLeaveSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCommentInput;
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
  comments: Array<Comment>;
  commentsByPassage: Array<Comment>;
  me?: Maybe<User>;
  mySessions: Array<Session>;
  scripturePassages: Array<ScripturePassage>;
  session?: Maybe<Session>;
  sessions: Array<Session>;
  user?: Maybe<User>;
  users: Array<User>;
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


export type QuerySessionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type ScripturePassage = {
  __typename?: 'ScripturePassage';
  book: Scalars['String']['output'];
  chapter: Scalars['Int']['output'];
  comments: Array<Comment>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  session: Session;
  sessionId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verseEnd?: Maybe<Scalars['Int']['output']>;
  verseStart: Scalars['Int']['output'];
};

export type Session = {
  __typename?: 'Session';
  comments: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  leader: User;
  leaderId: Scalars['String']['output'];
  participants: Array<SessionParticipant>;
  resources: Array<SessionResource>;
  scheduledDate: Scalars['DateTime']['output'];
  scripturePassages: Array<ScripturePassage>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
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
  session: Session;
  sessionId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  uploadedBy: Scalars['String']['output'];
  uploader: User;
};

export type Subscription = {
  __typename?: 'Subscription';
  commentAdded: Comment;
  commentDeleted: Scalars['ID']['output'];
  commentUpdated: Comment;
  userTyping: TypingIndicator;
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

export type UpdateSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  scheduledDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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

export type GetMySessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySessionsQuery = { __typename?: 'Query', mySessions: Array<{ __typename?: 'Session', id: string, title: string, description?: string | null, scheduledDate: any, leader: { __typename?: 'User', id: string, name?: string | null, email: string }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, order: number }>, participants: Array<{ __typename?: 'SessionParticipant', id: string, user: { __typename?: 'User', id: string, name?: string | null } }> }> };

export type CreateSessionMutationVariables = Exact<{
  input: CreateSessionInput;
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', createSession: { __typename?: 'Session', id: string, title: string, description?: string | null, scheduledDate: any, leader: { __typename?: 'User', id: string, name?: string | null }, scripturePassages: Array<{ __typename?: 'ScripturePassage', id: string, book: string, chapter: number, verseStart: number, verseEnd?: number | null, content: string, order: number }> } };

export type UpdateSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSessionInput;
}>;


export type UpdateSessionMutation = { __typename?: 'Mutation', updateSession: { __typename?: 'Session', id: string, title: string, description?: string | null, scheduledDate: any } };

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', deleteSession: { __typename?: 'Session', id: string, title: string } };


export const GetMySessionsDocument = gql`
    query GetMySessions {
  mySessions {
    id
    title
    description
    scheduledDate
    leader {
      id
      name
      email
    }
    scripturePassages {
      id
      book
      chapter
      verseStart
      verseEnd
      content
      order
    }
    participants {
      id
      user {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetMySessionsQuery__
 *
 * To run a query within a React component, call `useGetMySessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMySessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMySessionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMySessionsQuery(baseOptions?: Apollo.QueryHookOptions<GetMySessionsQuery, GetMySessionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMySessionsQuery, GetMySessionsQueryVariables>(GetMySessionsDocument, options);
      }
export function useGetMySessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMySessionsQuery, GetMySessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMySessionsQuery, GetMySessionsQueryVariables>(GetMySessionsDocument, options);
        }
export function useGetMySessionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMySessionsQuery, GetMySessionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMySessionsQuery, GetMySessionsQueryVariables>(GetMySessionsDocument, options);
        }
export type GetMySessionsQueryHookResult = ReturnType<typeof useGetMySessionsQuery>;
export type GetMySessionsLazyQueryHookResult = ReturnType<typeof useGetMySessionsLazyQuery>;
export type GetMySessionsSuspenseQueryHookResult = ReturnType<typeof useGetMySessionsSuspenseQuery>;
export type GetMySessionsQueryResult = Apollo.QueryResult<GetMySessionsQuery, GetMySessionsQueryVariables>;
export const CreateSessionDocument = gql`
    mutation CreateSession($input: CreateSessionInput!) {
  createSession(input: $input) {
    id
    title
    description
    scheduledDate
    leader {
      id
      name
    }
    scripturePassages {
      id
      book
      chapter
      verseStart
      verseEnd
      content
      order
    }
  }
}
    `;
export type CreateSessionMutationFn = Apollo.MutationFunction<CreateSessionMutation, CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSessionMutation, CreateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CreateSessionDocument, options);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<CreateSessionMutation, CreateSessionMutationVariables>;
export const UpdateSessionDocument = gql`
    mutation UpdateSession($id: ID!, $input: UpdateSessionInput!) {
  updateSession(id: $id, input: $input) {
    id
    title
    description
    scheduledDate
  }
}
    `;
export type UpdateSessionMutationFn = Apollo.MutationFunction<UpdateSessionMutation, UpdateSessionMutationVariables>;

/**
 * __useUpdateSessionMutation__
 *
 * To run a mutation, you first call `useUpdateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSessionMutation, { data, loading, error }] = useUpdateSessionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSessionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSessionMutation, UpdateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSessionMutation, UpdateSessionMutationVariables>(UpdateSessionDocument, options);
      }
export type UpdateSessionMutationHookResult = ReturnType<typeof useUpdateSessionMutation>;
export type UpdateSessionMutationResult = Apollo.MutationResult<UpdateSessionMutation>;
export type UpdateSessionMutationOptions = Apollo.BaseMutationOptions<UpdateSessionMutation, UpdateSessionMutationVariables>;
export const DeleteSessionDocument = gql`
    mutation DeleteSession($id: ID!) {
  deleteSession(id: $id) {
    id
    title
  }
}
    `;
export type DeleteSessionMutationFn = Apollo.MutationFunction<DeleteSessionMutation, DeleteSessionMutationVariables>;

/**
 * __useDeleteSessionMutation__
 *
 * To run a mutation, you first call `useDeleteSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSessionMutation, { data, loading, error }] = useDeleteSessionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSessionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSessionMutation, DeleteSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSessionMutation, DeleteSessionMutationVariables>(DeleteSessionDocument, options);
      }
export type DeleteSessionMutationHookResult = ReturnType<typeof useDeleteSessionMutation>;
export type DeleteSessionMutationResult = Apollo.MutationResult<DeleteSessionMutation>;
export type DeleteSessionMutationOptions = Apollo.BaseMutationOptions<DeleteSessionMutation, DeleteSessionMutationVariables>;