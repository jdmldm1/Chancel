'use client'

import React, { useState } from 'react'
import SessionList from '../../components/session/SessionList'
import SessionForm from '../../components/session/SessionForm'

export default function SessionsPage() {
  const [showForm, setShowForm] = useState(false)

  const handleFormSuccess = () => {
    setShowForm(false)
    // Optionally, refetch sessions or update Apollo cache
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Sessions</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="rounded-md bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 mb-6"
      >
        {showForm ? 'Cancel Create Session' : 'Create New Session'}
      </button>

      {showForm ? (
        <SessionForm onSuccess={handleFormSuccess} />
      ) : (
        <SessionList />
      )}
    </div>
  )
}
