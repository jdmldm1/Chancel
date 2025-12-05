// Simple GraphQL client using fetch (no Apollo)
// This avoids the infinite Observable loop issue with Apollo Client

interface GraphQLRequest {
  query: string
  variables?: Record<string, any>
}

interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: Record<string, any>
  }>
}

export async function graphqlRequest<T = any>(
  request: GraphQLRequest
): Promise<GraphQLResponse<T>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql'

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
    }

    return result
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}

// Hook-like wrapper for use in components (client-side only)
export function useGraphQL<T = any>(query: string, variables?: Record<string, any>) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await graphqlRequest<T>({ query, variables })

        if (!cancelled) {
          if (result.errors) {
            setError(new Error(result.errors[0].message))
          } else {
            setData(result.data || null)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [query, JSON.stringify(variables)])

  return { data, loading, error }
}

// Note: This requires React import
import React from 'react'
