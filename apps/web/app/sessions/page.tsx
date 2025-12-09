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
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1">
            Study Sessions
          </h1>
          <p className="text-gray-500 font-light">Manage and explore collaborative Bible study sessions</p>
        </div>
        <button
          onClick={() => setShowJoinModal(true)}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Join with Code
        </button>
      </div>

      {/* Action bar */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Create Session Button */}
        {isLeader && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-white font-medium hover:bg-gray-800 transition-all duration-200 w-fit"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showForm ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
            {showForm ? 'Cancel' : 'Create New Session'}
          </button>
        )}

        {/* Filters - Combined into single row */}
        {!showForm && (
          <div className="flex flex-wrap items-center gap-4">
            {/* View Mode Filter */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('my')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'my'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Sessions
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Browse All
              </button>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200"></div>

            {/* Time Filter */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTimeFilter('current')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeFilter === 'current'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setTimeFilter('past')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeFilter === 'past'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setTimeFilter('future')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeFilter === 'future'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Future
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {showForm ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
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
