import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// Absolute minimal Apollo Client configuration to debug infinite loop
const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only', // Changed from cache-first to avoid cache issues
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

export default apolloClient
