import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include', // Include cookies for authentication
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
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export default apolloClient
