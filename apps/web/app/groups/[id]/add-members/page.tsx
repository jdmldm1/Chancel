'use client'

import { useQuery, useMutation, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, UserPlus, Check } from 'lucide-react'
import Link from 'next/link'

const GROUP_QUERY = gql`
  query Group($id: ID!) {
    group(id: $id) {
      id
      name
      leaderId
      members {
        userId
      }
    }
  }
`

const USERS_QUERY = gql`
  query Users {
    users {
      id
      name
      email
      role
    }
  }
`

const ADD_GROUP_MEMBER = gql`
  mutation AddGroupMember($groupId: ID!, $userId: ID!) {
    addGroupMember(groupId: $groupId, userId: $userId) {
      id
      userId
      user {
        id
        name
      }
    }
  }
`

export default function AddGroupMembersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const groupId = params?.id as string
  const [addedMembers, setAddedMembers] = useState<Set<string>>(new Set())

  const { data: groupData, loading: groupLoading } = useQuery(GROUP_QUERY, {
    variables: { id: groupId },
    skip: !session || !groupId,
  })

  const { data: usersData, loading: usersLoading } = useQuery(USERS_QUERY, {
    skip: !session,
  })

  const [addMember, { loading: addingMember }] = useMutation(ADD_GROUP_MEMBER, {
    onCompleted: (data) => {
      setAddedMembers(new Set(addedMembers).add(data.addGroupMember.userId))
    },
  })

  if (!session) {
    router.push('/auth/login')
    return null
  }

  if (groupLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  const group = groupData?.group
  if (!group || group.leaderId !== session.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-600 mb-4">Not authorized</p>
          <Link href="/groups" className="text-blue-600 hover:underline">
            Back to Groups
          </Link>
        </div>
      </div>
    )
  }

  const users = usersData?.users || []
  const memberIds = new Set(group.members.map((m: any) => m.userId))

  // Filter out users who are already members
  const availableUsers = users.filter((user: any) => !memberIds.has(user.id))

  const handleAddMember = async (userId: string) => {
    await addMember({
      variables: {
        groupId,
        userId,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/groups/${groupId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            Back to {group.name}
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Add Members
          </h1>
          <p className="text-slate-600">
            Select members to add to {group.name}
          </p>
        </div>

        {/* Users List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
          {availableUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="mx-auto mb-4 text-slate-400" size={48} />
              <p className="text-slate-600">All users are already members of this group</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableUsers.map((user: any) => {
                const isAdded = addedMembers.has(user.id)
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        {user.role === 'LEADER' && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            Leader
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddMember(user.id)}
                      disabled={addingMember || isAdded}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        isAdded
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={18} />
                          Added
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Done Button */}
        <div className="mt-6 text-center">
          <Link
            href={`/groups/${groupId}`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  )
}
