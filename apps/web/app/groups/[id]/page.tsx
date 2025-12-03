'use client'

import { gql } from '@apollo/client'
import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Users, Lock, Globe, Send, UserPlus, UserMinus, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const GROUP_QUERY = gql`
  query Group($id: ID!) {
    group(id: $id) {
      id
      name
      description
      imageUrl
      visibility
      leaderId
      createdAt
      leader {
        id
        name
        email
      }
      members {
        id
        userId
        role
        joinedAt
        user {
          id
          name
          email
        }
      }
      memberCount
    }
  }
`

const GROUP_CHAT_MESSAGES_QUERY = gql`
  query GroupChatMessages($groupId: ID!) {
    groupChatMessages(groupId: $groupId) {
      id
      groupId
      userId
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`

const SEND_GROUP_CHAT_MESSAGE = gql`
  mutation SendGroupChatMessage($groupId: ID!, $message: String!) {
    sendGroupChatMessage(groupId: $groupId, message: $message) {
      id
      groupId
      userId
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`

const GROUP_CHAT_MESSAGE_SUBSCRIPTION = gql`
  subscription GroupChatMessageAdded($groupId: ID!) {
    groupChatMessageAdded(groupId: $groupId) {
      id
      groupId
      userId
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`

const REMOVE_GROUP_MEMBER = gql`
  mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
    removeGroupMember(groupId: $groupId, userId: $userId)
  }
`

const JOIN_GROUP = gql`
  mutation JoinGroup($groupId: ID!) {
    joinGroup(groupId: $groupId) {
      id
      userId
      role
      joinedAt
    }
  }
`

export default function GroupDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const groupId = params?.id as string
  const [message, setMessage] = useState('')
  const [showMembers, setShowMembers] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: groupData, loading: groupLoading, refetch: refetchGroup } = useQuery<any>(GROUP_QUERY, {
    variables: { id: groupId },
    skip: !session || !groupId,
  })

  const { data: messagesData, refetch: refetchMessages } = useQuery<any>(GROUP_CHAT_MESSAGES_QUERY, {
    variables: { groupId },
    skip: !session || !groupId,
  })

  const [sendMessage] = useMutation<any>(SEND_GROUP_CHAT_MESSAGE, {
    onCompleted: (data) => {
      setMessage('')
    },
    update: (cache, { data }) => {
      if (data?.sendGroupChatMessage) {
        const existingMessages: any = cache.readQuery({
          query: GROUP_CHAT_MESSAGES_QUERY,
          variables: { groupId },
        })

        if (existingMessages) {
          cache.writeQuery({
            query: GROUP_CHAT_MESSAGES_QUERY,
            variables: { groupId },
            data: {
              groupChatMessages: [...existingMessages.groupChatMessages, data.sendGroupChatMessage],
            },
          })
        }
      }
    },
  })

  const [removeMember] = useMutation(REMOVE_GROUP_MEMBER, {
    onCompleted: () => {
      refetchGroup()
    },
  })

  const [joinGroup] = useMutation(JOIN_GROUP, {
    onCompleted: () => {
      refetchGroup()
    },
  })

  // Subscribe to new messages
  const { data: subscriptionData } = useSubscription<any>(GROUP_CHAT_MESSAGE_SUBSCRIPTION, {
    variables: { groupId },
    skip: !groupId,
    onData: ({ client, data }) => {
      if (data.data?.groupChatMessageAdded) {
        const newMessage = data.data.groupChatMessageAdded

        // Update the cache with the new message
        const existingMessages: any = client.readQuery({
          query: GROUP_CHAT_MESSAGES_QUERY,
          variables: { groupId },
        })

        if (existingMessages) {
          // Check if message already exists to avoid duplicates
          const messageExists = existingMessages.groupChatMessages.some(
            (msg: any) => msg.id === newMessage.id
          )

          if (!messageExists) {
            client.writeQuery({
              query: GROUP_CHAT_MESSAGES_QUERY,
              variables: { groupId },
              data: {
                groupChatMessages: [...existingMessages.groupChatMessages, newMessage],
              },
            })
          }
        }
      }
    },
  })

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesData, subscriptionData])

  // Wait for session to load
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-96 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-96 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  const group = groupData?.group
  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-600">Group not found</p>
          <Link href="/groups" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Groups
          </Link>
        </div>
      </div>
    )
  }

  const isLeader = group.leaderId === session.user?.id
  const isMember = isLeader || group.members.some((m: any) => m.userId === session.user?.id)
  const messages = messagesData?.groupChatMessages || []

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    await sendMessage({
      variables: {
        groupId,
        message: message.trim(),
      },
    })
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    await removeMember({
      variables: {
        groupId,
        userId,
      },
    })
  }

  const handleJoinGroup = async () => {
    try {
      await joinGroup({
        variables: {
          groupId,
        },
      })
    } catch (error: any) {
      alert(error.message || 'Failed to join group')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Groups
          </Link>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Image or placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  {group.imageUrl ? (
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Users className="text-white" size={32} />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-slate-800">{group.name}</h1>
                    {group.visibility === 'PRIVATE' ? (
                      <Lock className="text-slate-400" size={20} />
                    ) : (
                      <Globe className="text-slate-400" size={20} />
                    )}
                  </div>
                  <p className="text-slate-600 mb-2">Led by {group.leader.name}</p>
                  {group.description && (
                    <p className="text-slate-600 mt-3">{group.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMembers(!showMembers)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Users size={18} />
                  {group.memberCount} Members
                </button>
                {!isMember && group.visibility === 'PUBLIC' && (
                  <button
                    onClick={handleJoinGroup}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <Users size={18} />
                    Join Group
                  </button>
                )}
                {isLeader && (
                  <Link
                    href={`/groups/${groupId}/settings`}
                    className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Settings size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col h-[600px]">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Group Chat</h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 mt-12">
                    <Users className="mx-auto mb-4 text-slate-400" size={48} />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const isOwnMessage = msg.userId === session.user?.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'bg-white border border-slate-200'
                          } rounded-2xl px-4 py-3`}
                        >
                          {!isOwnMessage && (
                            <p className="text-xs font-semibold text-slate-600 mb-1">
                              {msg.user.name}
                            </p>
                          )}
                          <p className={isOwnMessage ? 'text-white' : 'text-slate-800'}>
                            {msg.message}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-blue-100' : 'text-slate-500'
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {isMember ? (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              ) : group.visibility === 'PUBLIC' ? (
                <div className="p-4 border-t border-slate-200 bg-blue-50 text-center">
                  <p className="text-slate-700">Join this group to participate in the chat</p>
                </div>
              ) : (
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
                  <p className="text-slate-700">This is a private group</p>
                </div>
              )}
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Members</h2>
              </div>

              <div className="p-4 space-y-2 max-h-[540px] overflow-y-auto">
                {group.members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{member.user.name}</p>
                        {member.role === 'LEADER' && (
                          <p className="text-xs text-blue-600">Leader</p>
                        )}
                      </div>
                    </div>

                    {isLeader && member.userId !== group.leaderId && (
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                ))}

                {isLeader && (
                  <Link
                    href={`/groups/${groupId}/add-members`}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <UserPlus size={18} />
                    Add Members
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
