'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import SessionList from '../../components/session/SessionList'
import SessionForm from '../../components/session/SessionForm'
import JoinByCodeModal from '../../components/session/JoinByCodeModal'

export default function SessionsPage() {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my')
  const [timeFilter, setTimeFilter] = useState<'current' | 'past' | 'future'>('current')

  const isLeader = session?.user?.role === 'LEADER'

  const handleFormSuccess = () => {
    setShowForm(false)
    // Optionally, refetch sessions or update Apollo cache
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with gradient */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Study Sessions
        </h1>
        <p className="text-gray-600">Manage and explore collaborative Bible study sessions</p>
      </div>

      {/* Action bar */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {isLeader && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-5 py-3 text-white font-semibold hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showForm ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
              {showForm ? 'Cancel' : 'Create New Session'}
            </button>
          )}

          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-white font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Join with Code
          </button>

          {!showForm && (
            <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('my')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'my'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                My Sessions
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Browse All
              </button>
            </div>
          )}
        </div>

        {/* Time Filter */}
        {!showForm && (
          <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm w-fit">
            <button
              onClick={() => setTimeFilter('current')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeFilter === 'current'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Current Sessions
            </button>
            <button
              onClick={() => setTimeFilter('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeFilter === 'past'
                  ? 'bg-gray-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Past Sessions
            </button>
            <button
              onClick={() => setTimeFilter('future')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeFilter === 'future'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Future Sessions
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {showForm ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <SessionForm onSuccess={handleFormSuccess} />
          </div>
        ) : (
          <SessionList viewMode={viewMode} timeFilter={timeFilter} />
        )}
      </div>

      {/* Join by Code Modal */}
      <JoinByCodeModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </div>
  )
}
