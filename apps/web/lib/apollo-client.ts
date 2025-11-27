import { ApolloClient, InMemoryCache, HttpLink, from, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
})

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from next-auth session
  if (typeof window !== 'undefined') {
    const session = await fetch('/api/auth/session').then((res) => res.json())

    return {
      headers: {
        ...headers,
        authorization: session?.user ? `Bearer ${session.user.id}` : '',
      },
    }
  }

  return { headers }
})

// WebSocket link for subscriptions
const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql',
      }) as any
    )
  : null

// Split between HTTP and WebSocket links
const splitLink = typeof window !== 'undefined' && wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      from([authLink, httpLink])
    )
  : from([authLink, httpLink])

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        mySessions: {
          merge(existing = [], incoming) {
            return incoming
          },
        },
        sessions: {
          merge(existing = [], incoming) {
            return incoming
          },
        },
      },
    },
  },
})

const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export default apolloClient
