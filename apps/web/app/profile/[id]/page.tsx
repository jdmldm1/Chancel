'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, Phone, Calendar, Edit2, User as UserIcon, BookOpen, MessageSquare, Heart } from 'lucide-react'

const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      email
      name
      bio
      profilePicture
      location
      phoneNumber
      role
      bibleTranslation
      createdAt
    }
  }
`

export default function ProfileViewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string

  const { data, loading, error } = useQuery<any>(USER_QUERY, {
    variables: { id: userId },
    skip: !userId || !session,
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">Error loading profile: {error.message}</p>
          <Link href="/sessions" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Sessions
          </Link>
        </div>
      </div>
    )
  }

  const user = data?.user

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <UserIcon className="mx-auto mb-4 text-slate-400" size={64} />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">User Not Found</h1>
          <p className="text-slate-600 mb-4">This user profile does not exist</p>
          <Link href="/sessions" className="text-blue-600 hover:underline">
            Back to Sessions
          </Link>
        </div>
      </div>
    )
  }

  const isOwnProfile = session.user?.id === userId
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'LEADER':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300'
      case 'MEMBER':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sessions"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Sessions
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
          {/* Header Section with gradient */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            {isOwnProfile && (
              <div className="absolute top-4 right-4">
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-md"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </Link>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-800">
                  {user.name || 'Anonymous User'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>

              {user.bio && (
                <p className="text-slate-600 text-lg mb-4">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            {user.bibleTranslation && (
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">Study Preferences</h2>
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen size={18} />
                  <span>Prefers <strong>{user.bibleTranslation}</strong> translation</span>
                </div>
              </div>
            )}

            {/* Activity Stats (placeholder for future implementation) */}
            <div className="border-t border-slate-200 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={<BookOpen className="text-blue-600" size={24} />}
                  label="Sessions"
                  value="Coming Soon"
                  color="blue"
                />
                <StatCard
                  icon={<MessageSquare className="text-indigo-600" size={24} />}
                  label="Comments"
                  value="Coming Soon"
                  color="indigo"
                />
                <StatCard
                  icon={<Heart className="text-red-600" size={24} />}
                  label="Prayer Requests"
                  value="Coming Soon"
                  color="red"
                />
              </div>
            </div>

            {/* Recent Activity (placeholder) */}
            <div className="border-t border-slate-200 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
              <div className="bg-slate-50 rounded-lg p-6 text-center text-slate-500">
                <MessageSquare className="mx-auto mb-2 text-slate-400" size={32} />
                <p>Activity feed coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <div className="flex items-center gap-3 mb-2">
        {icon}
      </div>
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
    </div>
  )
}
