'use client'

import { useGraphQLQuery } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Users, Lock, Globe, Plus } from 'lucide-react'
import Link from 'next/link'

const MY_GROUPS_QUERY = `
  query MyGroups {
    myGroups {
      id
      name
      description
      imageUrl
      visibility
      memberCount
      leader {
        id
        name
      }
      createdAt
    }
  }
`

const PUBLIC_GROUPS_QUERY = `
  query PublicGroups {
    publicGroups {
      id
      name
      description
      imageUrl
      visibility
      memberCount
      leader {
        id
        name
      }
      createdAt
    }
  }
`

export default function GroupsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLeader = session?.user?.role === 'LEADER'

  const { data: myGroupsData, loading: myGroupsLoading } = useGraphQLQuery<any>(MY_GROUPS_QUERY, {
    skip: !session,
  })

  const { data: publicGroupsData, loading: publicGroupsLoading } = useGraphQLQuery<any>(PUBLIC_GROUPS_QUERY, {
    skip: !session,
  })

  // Wait for session to load before checking authentication
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

  const myGroups = myGroupsData?.myGroups || []
  const publicGroups = publicGroupsData?.publicGroups || []

  // Filter out public groups that are already in myGroups
  const myGroupIds = new Set(myGroups.map((g: any) => g.id))
  const otherPublicGroups = publicGroups.filter((g: any) => !myGroupIds.has(g.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Groups
            </h1>
            <p className="text-slate-600">
              Connect with your community through study groups
            </p>
          </div>
          {isLeader && (
            <Link
              href="/groups/new"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus size={20} />
              Create Group
            </Link>
          )}
        </div>

        {/* My Groups Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            My Groups
          </h2>
          {myGroupsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : myGroups.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50">
              <Users className="mx-auto mb-4 text-slate-400" size={48} />
              <p className="text-slate-600 mb-4">You're not part of any groups yet</p>
              <p className="text-sm text-slate-500">
                {isLeader
                  ? 'Create a new group or join a public group below'
                  : 'Join a public group below to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map((group: any) => (
                <GroupCard key={group.id} group={group} isMember={true} />
              ))}
            </div>
          )}
        </section>

        {/* Public Groups Section */}
        {otherPublicGroups.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="text-indigo-600" size={24} />
              Discover Public Groups
            </h2>
            {publicGroupsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPublicGroups.map((group: any) => (
                  <GroupCard key={group.id} group={group} isMember={false} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function GroupCard({ group, isMember }: { group: any; isMember: boolean }) {
  const isPrivate = group.visibility === 'PRIVATE'

  return (
    <Link
      href={`/groups/${group.id}`}
      className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] hover:bg-white/80"
    >
      {/* Image or placeholder */}
      <div className="mb-4 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center overflow-hidden">
        {group.imageUrl ? (
          <img
            src={group.imageUrl}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Users className="text-white" size={48} />
        )}
      </div>

      {/* Group info */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
          {group.name}
        </h3>
        {isPrivate && <Lock className="text-slate-400 flex-shrink-0" size={18} />}
      </div>

      {group.description && (
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {group.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}</span>
        </div>
        <div className="text-xs">
          Led by {group.leader.name || 'Unknown'}
        </div>
      </div>

      {!isMember && (
        <div className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm text-center">
          Click to join
        </div>
      )}
    </Link>
  )
}
