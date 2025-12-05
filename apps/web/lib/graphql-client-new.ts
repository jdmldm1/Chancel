'use client'

import { GraphQLClient } from 'graphql-request'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'

// Create a GraphQL client instance
const endpoint = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql')

const client = new GraphQLClient(endpoint, {
  credentials: 'include', // Include cookies for authentication
})

// Helper function to get auth headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {}

  try {
    const response = await fetch('/api/auth/session', {
      cache: 'no-store',
    })

    if (!response.ok) return {}

    const session = await response.json()

    if (session?.user?.id) {
      return {
        authorization: `Bearer ${session.user.id}`,
      }
    }
  } catch (error) {
    console.log('Auth fetch error:', error)
  }

  return {}
}

// Hook for GraphQL queries (replaces Apollo's useQuery)
export function useGraphQLQuery<TData = any, TVariables = Record<string, any>>(
  query: string,
  options?: {
    variables?: TVariables
    skip?: boolean
  }
) {
  const [data, setData] = useState<TData | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  // Track previous variables to detect actual changes
  const prevVariablesRef = useRef<string>('')
  const currentVariables = options?.variables ? JSON.stringify(options.variables) : ''

  // Only update ref after effect runs to avoid infinite loops
  const variablesChanged = prevVariablesRef.current !== currentVariables

  useEffect(() => {
    if (options?.skip) {
      setLoading(false)
      return
    }

    // Update the ref with current value
    prevVariablesRef.current = currentVariables

    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(undefined)

        // Get auth headers
        const authHeaders = await getAuthHeaders()

        // Make request with auth headers
        const result = await client.request<TData>(
          query,
          options?.variables as any,
          authHeaders
        )

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
          console.error('GraphQL query error:', err)
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
  }, [query, options?.skip, currentVariables])

  const refetch = useCallback(async () => {
    if (options?.skip) return

    try {
      setLoading(true)
      setError(undefined)

      const authHeaders = await getAuthHeaders()
      const result = await client.request<TData>(
        query,
        options?.variables as any,
        authHeaders
      )
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      console.error('GraphQL query error:', err)
    } finally {
      setLoading(false)
    }
  }, [query, options?.skip, currentVariables])

  return { data, loading, error, refetch }
}

// Hook for GraphQL mutations (replaces Apollo's useMutation)
export function useGraphQLMutation<TData = any, TVariables = Record<string, any>>(
  mutation: string,
  options?: {
    onCompleted?: (data: TData) => void
    onError?: (error: Error) => void
  }
) {
  const [data, setData] = useState<TData | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const mutate = useCallback(
    async (variables?: TVariables) => {
      try {
        setLoading(true)
        setError(undefined)

        // Get auth headers
        const authHeaders = await getAuthHeaders()

        // Make request with auth headers
        const result = await client.request<TData>(
          mutation,
          variables as any,
          authHeaders
        )
        setData(result)

        // Call onCompleted callback if provided
        if (options?.onCompleted) {
          options.onCompleted(result)
        }

        return { data: result }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error('GraphQL mutation error:', err)

        // Call onError callback if provided
        if (options?.onError) {
          options.onError(error)
        }

        throw error
      } finally {
        setLoading(false)
      }
    },
    [mutation, options]
  )

  return [mutate, { data, loading, error }] as const
}

// Direct query function for server-side or one-off queries
export async function graphqlRequest<TData = any, TVariables = Record<string, any>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const authHeaders = await getAuthHeaders()
  return client.request<TData>(query, variables as any, authHeaders)
}
