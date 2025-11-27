import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

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
  link: from([authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export default apolloClient
