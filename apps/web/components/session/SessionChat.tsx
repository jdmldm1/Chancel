'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import {
  GetChatMessagesQuery,
  SendChatMessageMutation,
  SendChatMessageMutationVariables,
} from '@bibleproject/types/src/graphql'

const GET_CHAT_MESSAGES = `
  query GetChatMessages($sessionId: ID!) {
    chatMessages(sessionId: $sessionId) {
      id
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`

const SEND_CHAT_MESSAGE = `
  mutation SendChatMessage($sessionId: ID!, $message: String!) {
    sendChatMessage(sessionId: $sessionId, message: $message) {
      id
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`

const CHAT_MESSAGE_ADDED = `
  subscription ChatMessageAdded($sessionId: ID!) {
    chatMessageAdded(sessionId: $sessionId) {
      id
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`

interface SessionChatProps {
  sessionId: string
}

export default function SessionChat({ sessionId }: SessionChatProps) {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data, loading, error, refetch } = useGraphQLQuery<GetChatMessagesQuery>(GET_CHAT_MESSAGES, {
    variables: { sessionId },
  })

  const [sendMessage, { loading: sending }] = useGraphQLMutation<
    SendChatMessageMutation,
    SendChatMessageMutationVariables
  >(SEND_CHAT_MESSAGE, {
    onCompleted: () => {
      setMessage('')
      refetch()
    },
  })

  // TODO: Re-enable subscriptions once WebSocket is properly configured
  // Subscribe to new messages
  // useSubscription<ChatMessageAddedSubscription>(CHAT_MESSAGE_ADDED, {
  //   variables: { sessionId },
  //   onData: ({ data: subscriptionData }) => {
  //     if (subscriptionData.data?.chatMessageAdded) {
  //       refetch()
  //     }
  //   },
  // })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data?.chatMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      await sendMessage({
        sessionId,
        message: message.trim(),
      })
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error loading chat: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-xl font-semibold text-blue-900 hover:text-blue-700"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Session Chat ({data?.chatMessages?.length || 0})
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col" style={{ minHeight: '600px' }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ minHeight: '400px', maxHeight: '500px' }}>
        {data?.chatMessages && data.chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          data?.chatMessages?.map((msg) => {
            const isOwnMessage = msg.user.id === session?.user?.id

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold mb-1 text-gray-700">
                      {msg.user.displayName || msg.user.username || msg.user.name || 'Anonymous'}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            disabled={sending}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
        </div>
      )}
    </div>
  )
}
