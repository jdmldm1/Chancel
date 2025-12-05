'use client'

import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import { useState } from 'react'
import { Users, Plus, X } from 'lucide-react'

const MY_GROUPS_QUERY = `
  query MyGroups {
    myGroups {
      id
      name
      description
      memberCount
    }
  }
`

const ASSIGN_GROUP_TO_SERIES = `
  mutation AssignGroupToSeries($groupId: ID!, $seriesId: ID!) {
    assignGroupToSeries(groupId: $groupId, seriesId: $seriesId) {
      id
      groupId
      seriesId
    }
  }
`

interface AssignGroupsProps {
  seriesId: string
  isLeader: boolean
}

export default function AssignGroupsToSeries({ seriesId, isLeader }: AssignGroupsProps) {
  const [showSelector, setShowSelector] = useState(false)

  const { data: groupsData } = useGraphQLQuery<any>(MY_GROUPS_QUERY, {
    skip: !isLeader,
  })

  const [assignGroup] = useGraphQLMutation(ASSIGN_GROUP_TO_SERIES, {
    onCompleted: () => {
      setShowSelector(false)
    },
  })

  if (!isLeader) {
    return null
  }

  const groups = groupsData?.myGroups || []

  const handleAssignGroup = async (groupId: string) => {
    try {
      await assignGroup({
      groupId,
      seriesId,
      })
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Assign Groups
        </h3>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {showSelector ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Assign a group to this series to automatically add all group members as participants to all sessions in the series
      </p>

      {showSelector && (
        <div className="space-y-2">
          {groups.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              You don't have any groups yet. Create a group first.
            </p>
          ) : (
            groups.map((group: any) => (
              <button
                key={group.id}
                onClick={() => handleAssignGroup(group.id)}
                className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="text-left">
                  <p className="font-medium text-slate-800">{group.name}</p>
                  {group.description && (
                    <p className="text-xs text-slate-500 line-clamp-1">{group.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users size={14} />
                  {group.memberCount}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
