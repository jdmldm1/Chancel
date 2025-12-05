'use client'

import React, { useState } from 'react'
import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'

const GET_USERS = `
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`

const SEND_JOIN_REQUEST = `
  mutation SendJoinRequest($sessionId: ID!, $toUserId: ID!) {
    sendJoinRequest(sessionId: $sessionId, toUserId: $toUserId) {
      id
      status
      to {
        id
        name
        email
      }
    }
  }
`

const GET_SESSION_JOIN_REQUESTS = `
  query GetSessionJoinRequests($sessionId: ID!) {
    sessionJoinRequests(sessionId: $sessionId) {
      id
      status
      createdAt
      to {
        id
        name
        email
      }
    }
  }
`

interface JoinRequestManagerProps {
  sessionId: string
}

export default function JoinRequestManager({ sessionId }: JoinRequestManagerProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const { data: usersData } = useGraphQLQuery<any>(GET_USERS)
  const { data: requestsData, refetch } = useGraphQLQuery<any>(GET_SESSION_JOIN_REQUESTS, {
    variables: { sessionId },
  })
  const [sendJoinRequest, { loading }] = useGraphQLMutation<any>(SEND_JOIN_REQUEST, {
    onCompleted: () => {
      setSelectedUserId('')
      refetch()
    },
  })

  const handleSendRequest = async () => {
    if (!selectedUserId) return

    try {
      await sendJoinRequest({
        sessionId,
        toUserId: selectedUserId,
      })
    } catch (err) {
      console.error('Error sending join request:', err)
      alert('Failed to send join request. Please try again.')
    }
  }

  const existingRequestUserIds = new Set(
    (requestsData?.sessionJoinRequests || []).map((r: any) => r.to.id)
  )

  const availableUsers = (usersData?.users || []).filter(
    (user: any) => !existingRequestUserIds.has(user.id)
  )

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Manage Join Requests</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invite Members to This Private Session
        </label>
        <div className="flex gap-2">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 bg-white"
          >
            <option value="">Select a member to invite...</option>
            {availableUsers.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email}) - {user.role}
              </option>
            ))}
          </select>
          <button
            onClick={handleSendRequest}
            disabled={!selectedUserId || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
      </div>

      {requestsData?.sessionJoinRequests && requestsData.sessionJoinRequests.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">Sent Invitations</h4>
          <div className="space-y-2">
            {requestsData.sessionJoinRequests.map((request: any) => (
              <div
                key={request.id}
                className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md"
              >
                <div>
                  <p className="font-medium">{request.to.name}</p>
                  <p className="text-sm text-gray-500">{request.to.email}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.status === 'ACCEPTED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
