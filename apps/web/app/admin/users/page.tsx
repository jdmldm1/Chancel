'use client'

import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Shield, Users, Trash2, Edit2, Mail, MapPin, Phone, Search } from 'lucide-react'

const ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      id
      email
      name
      role
      bio
      profilePicture
      location
      phoneNumber
      createdAt
    }
  }
`

const UPDATE_USER_ROLE_MUTATION = `
  mutation AdminUpdateUserRole($userId: ID!, $role: UserRole!) {
    adminUpdateUserRole(userId: $userId, role: $role) {
      id
      email
      name
      role
    }
  }
`

const DELETE_USER_MUTATION = `
  mutation AdminDeleteUser($userId: ID!) {
    adminDeleteUser(userId: $userId)
  }
`

export default function UserManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('ALL')

  const { data, loading, error, refetch } = useGraphQLQuery<any>(ALL_USERS_QUERY, {
    skip: !session || session.user?.role !== 'ADMIN',
  })

  const [updateUserRole] = useGraphQLMutation(UPDATE_USER_ROLE_MUTATION, {
    onCompleted: () => refetch(),
  })

  const [deleteUser] = useGraphQLMutation(DELETE_USER_MUTATION, {
    onCompleted: () => refetch(),
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8 px-4">
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

  if (session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="mx-auto mb-4 text-red-600" size={64} />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-4">Administrator access required</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await updateUserRole({
          userId,
          role: newRole,
        })
      } catch (err) {
        alert('Error updating user role: ' + (err as Error).message)
      }
    }
  }

  const handleDeleteUser = async (userId: string, email: string) => {
    if (confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      try {
        await deleteUser({
          userId,
        })
      } catch (err) {
        alert('Error deleting user: ' + (err as Error).message)
      }
    }
  }

  // Filter users
  const filteredUsers = data?.allUsers?.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole

    return matchesSearch && matchesRole
  }) || []

  const roleStats = {
    total: data?.allUsers?.length || 0,
    admin: data?.allUsers?.filter((u: any) => u.role === 'ADMIN').length || 0,
    leader: data?.allUsers?.filter((u: any) => u.role === 'LEADER').length || 0,
    member: data?.allUsers?.filter((u: any) => u.role === 'MEMBER').length || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Admin Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Users className="text-purple-600" size={36} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
          <p className="text-slate-600">Manage user accounts and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Users" value={roleStats.total} color="blue" />
          <StatCard label="Admins" value={roleStats.admin} color="purple" />
          <StatCard label="Leaders" value={roleStats.leader} color="indigo" />
          <StatCard label="Members" value={roleStats.member} color="green" />
        </div>

        {/* Search and Filter */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="LEADER">Leader</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            <p className="text-red-600">Error loading users: {error.message}</p>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                            {(user.displayName || user.username || user.name || user.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{user.displayName || user.username || user.name || 'No name'}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <Mail size={14} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm text-slate-600">
                          {user.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {user.location}
                            </div>
                          )}
                          {user.phoneNumber && (
                            <div className="flex items-center gap-1">
                              <Phone size={14} />
                              {user.phoneNumber}
                            </div>
                          )}
                          {!user.location && !user.phoneNumber && (
                            <span className="text-slate-400">No contact info</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={user.id === session.user?.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700 border-purple-300'
                              : user.role === 'LEADER'
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                              : 'bg-green-100 text-green-700 border-green-300'
                          } ${user.id === session.user?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="LEADER">Leader</option>
                          <option value="MEMBER">Member</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/profile/${user.id}`}
                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            disabled={user.id === session.user?.id}
                            className={`p-2 rounded-lg transition-colors ${
                              user.id === session.user?.id
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={user.id === session.user?.id ? "Can't delete yourself" : 'Delete User'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
      <div className="text-slate-600 text-sm font-medium mb-1">{label}</div>
      <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
    </div>
  )
}
