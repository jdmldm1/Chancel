'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, BookOpen, MessageSquare, Heart, Shield, TrendingUp } from 'lucide-react'

const ADMIN_STATS_QUERY = gql`
  query AdminStats {
    adminStats {
      totalUsers
      totalLeaders
      totalMembers
      totalSessions
      totalGroups
      totalComments
      totalPrayerRequests
    }
  }
`

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { data, loading, error } = useQuery<any>(ADMIN_STATS_QUERY, {
    skip: !session || session.user?.role !== 'ADMIN',
  })

  // Wait for session to load
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">Error loading stats: {error.message}</p>
        </div>
      </div>
    )
  }

  const stats = data?.adminStats

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-purple-600" size={36} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-600">System overview and management</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-32 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="text-blue-600" size={28} />}
              label="Total Users"
              value={stats?.totalUsers || 0}
              color="blue"
            />
            <StatCard
              icon={<Shield className="text-purple-600" size={28} />}
              label="Leaders"
              value={stats?.totalLeaders || 0}
              color="purple"
            />
            <StatCard
              icon={<Users className="text-green-600" size={28} />}
              label="Members"
              value={stats?.totalMembers || 0}
              color="green"
            />
            <StatCard
              icon={<BookOpen className="text-indigo-600" size={28} />}
              label="Sessions"
              value={stats?.totalSessions || 0}
              color="indigo"
            />
            <StatCard
              icon={<Users className="text-pink-600" size={28} />}
              label="Groups"
              value={stats?.totalGroups || 0}
              color="pink"
            />
            <StatCard
              icon={<MessageSquare className="text-orange-600" size={28} />}
              label="Comments"
              value={stats?.totalComments || 0}
              color="orange"
            />
            <StatCard
              icon={<Heart className="text-red-600" size={28} />}
              label="Prayer Requests"
              value={stats?.totalPrayerRequests || 0}
              color="red"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            href="/admin/users"
            icon={<Users size={32} />}
            title="User Management"
            description="Manage user accounts, roles, and permissions"
            color="from-blue-600 to-indigo-600"
          />
          <ActionCard
            href="/sessions"
            icon={<BookOpen size={32} />}
            title="All Sessions"
            description="View and manage all study sessions"
            color="from-purple-600 to-pink-600"
          />
          <ActionCard
            href="/groups"
            icon={<Users size={32} />}
            title="All Groups"
            description="View and manage all groups"
            color="from-green-600 to-teal-600"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        {icon}
        <TrendingUp className={`text-${color}-600`} size={20} />
      </div>
      <div>
        <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
        <p className={`text-3xl font-bold text-${color}-600`}>{value.toLocaleString()}</p>
      </div>
    </div>
  )
}

function ActionCard({ href, icon, title, description, color }: { href: string; icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <Link
      href={href}
      className="block bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl transition-all hover:scale-[1.02] group"
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${color} text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </Link>
  )
}
