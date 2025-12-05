'use client'

import React from 'react'
import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import Link from 'next/link'

const GET_MY_JOIN_REQUESTS = `
  query GetMyJoinRequests {
    myJoinRequests {
      id
      status
      createdAt
      session {
        id
        title
        description
        startDate
        endDate
      }
      from {
        id
        name
      }
    }
  }
`

const ACCEPT_JOIN_REQUEST = `
  mutation AcceptJoinRequest($id: ID!) {
    acceptJoinRequest(id: $id) {
      id
      status
    }
  }
`

const REJECT_JOIN_REQUEST = `
  mutation RejectJoinRequest($id: ID!) {
    rejectJoinRequest(id: $id) {
      id
      status
    }
  }
`

export default function MyJoinRequests() {
  const { data, loading, error, refetch } = useGraphQLQuery<any>(GET_MY_JOIN_REQUESTS)
  const [acceptJoinRequest] = useGraphQLMutation<any>(ACCEPT_JOIN_REQUEST, {
    onCompleted: () => refetch(),
  })
  const [rejectJoinRequest] = useGraphQLMutation<any>(REJECT_JOIN_REQUEST, {
    onCompleted: () => refetch(),
  })

  if (loading) return <p>Loading your join requests...</p>
  if (error) return <p>Error loading join requests: {error.message}</p>

  const pendingRequests = (data?.myJoinRequests || []).filter((r: any) => r.status === 'PENDING')
  const processedRequests = (data?.myJoinRequests || []).filter((r: any) => r.status !== 'PENDING')

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Session Invitations</h1>

      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pending Invitations</h2>
          <div className="space-y-4">
            {pendingRequests.map((request: any) => (
              <div
                key={request.id}
                className="p-4 border border-yellow-300 rounded-md bg-yellow-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      href={`/sessions/${request.session.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      <h3 className="text-xl font-bold">{request.session.title}</h3>
                    </Link>
                    <p className="text-gray-600 mt-1">{request.session.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      From: {request.from.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Start: {new Date(request.session.startDate).toLocaleDateString()} - End:{' '}
                      {new Date(request.session.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => acceptJoinRequest({ id: request.id })}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectJoinRequest({ id: request.id })}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedRequests.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Invitations</h2>
          <div className="space-y-4">
            {processedRequests.map((request: any) => (
              <div
                key={request.id}
                className="p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      href={`/sessions/${request.session.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      <h3 className="text-xl font-bold">{request.session.title}</h3>
                    </Link>
                    <p className="text-gray-600 mt-1">{request.session.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      From: {request.from.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingRequests.length === 0 && processedRequests.length === 0 && (
        <p className="text-gray-500">You have no session invitations.</p>
      )}
    </div>
  )
}
