# Apollo Client Configuration

This directory contains the Apollo Client setup for the Next.js frontend.

## Files

- **apollo-client.ts**: Main Apollo Client instance configuration
  - Configures HTTP link to GraphQL API
  - Sets up error handling
  - Configures InMemoryCache with type policies
  - Uses credentials: 'include' for cookie-based authentication

- **apollo-provider.tsx**: Client-side Apollo Provider wrapper
  - Wraps children with ApolloProvider
  - Used in app/layout.tsx to provide Apollo Client to all pages

## Configuration

The GraphQL API endpoint is configured via environment variable:

```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Usage

The Apollo Provider is already set up in the root layout. You can use Apollo hooks in any client component:

```tsx
'use client'

import { useQuery, gql } from '@apollo/client'

const GET_DATA = gql`
  query GetData {
    data {
      id
      name
    }
  }
`

export function MyComponent() {
  const { data, loading, error } = useQuery(GET_DATA)

  // ... rest of component
}
```

## Type-Safe Hooks

Use generated hooks from `@bibleproject/types/src/graphql` for type safety:

```tsx
import { useGetMySessionsQuery } from '@bibleproject/types/src/graphql'

const { data, loading, error } = useGetMySessionsQuery()
```

## Cache Configuration

The cache is configured with type policies for efficient updates:

- `mySessions`: Replaces existing data on fetch
- `sessions`: Replaces existing data on fetch

These policies ensure proper cache updates when data changes.
