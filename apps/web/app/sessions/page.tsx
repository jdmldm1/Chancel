'use client'

import React, { useState } from 'react'
import SessionList from '../../components/session/SessionList'
import SessionForm from '../../components/session/SessionForm'

export default function SessionsPage() {
  const [showForm, setShowForm] = useState(false)
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my')

  const handleFormSuccess = () => {
    setShowForm(false)
    // Optionally, refetch sessions or update Apollo cache
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Study Sessions</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700"
        >
          {showForm ? 'Cancel Create Study Session' : 'Create New Study Session'}
        </button>

        {!showForm && (
          <div className="flex gap-2 border border-gray-300 rounded-md p-1">
            <button
              onClick={() => setViewMode('my')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'my'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Sessions
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Browse All
            </button>
          </div>
        )}
      </div>

      {showForm ? (
        <SessionForm onSuccess={handleFormSuccess} />
      ) : (
        <SessionList viewMode={viewMode} />
      )}
    </div>
  )
}
