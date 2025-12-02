'use client'

import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/components/ui/toast'

const MY_SERIES_QUERY = gql`
  query MySeries {
    mySeries {
      id
      title
      description
      imageUrl
      createdAt
      sessions {
        id
        title
        startDate
        endDate
      }
    }
  }
`

const CREATE_SERIES_MUTATION = gql`
  mutation CreateSeries($input: CreateSeriesInput!) {
    createSeries(input: $input) {
      id
      title
      description
      imageUrl
    }
  }
`

const DELETE_SERIES_MUTATION = gql`
  mutation DeleteSeries($id: ID!) {
    deleteSeries(id: $id) {
      id
    }
  }
`

interface Series {
  id: string
  title: string
  description?: string
  imageUrl?: string
  createdAt: string
  sessions: Array<{
    id: string
    title: string
    startDate: string
    endDate: string
  }>
}

export default function SeriesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { addToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [timeFilter, setTimeFilter] = useState<'active' | 'past' | 'future'>('active')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  })

  const { data, loading, refetch } = useQuery<{ mySeries: Series[] }>(MY_SERIES_QUERY)
  const [createSeries, { loading: creating }] = useMutation(CREATE_SERIES_MUTATION)
  const [deleteSeries] = useMutation(DELETE_SERIES_MUTATION)

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const isLeader = session.user.role === 'LEADER'

  const allSeries = data?.mySeries || []

  // Helper function to determine if a series is active, past, or future
  const getSeriesStatus = (series: Series) => {
    if (series.sessions.length === 0) return 'future' // No sessions means future/planning

    const now = new Date()
    const hasActiveSessions = series.sessions.some(s => {
      const startDate = new Date(s.startDate)
      const endDate = new Date(s.endDate)
      return startDate <= now && endDate >= now
    })

    if (hasActiveSessions) return 'active'

    // Check if all sessions are in the past
    const allPast = series.sessions.every(s => new Date(s.endDate) < now)
    if (allPast) return 'past'

    // Otherwise, all sessions are in the future
    return 'future'
  }

  // Filter series by time
  const series = allSeries.filter(s => {
    const status = getSeriesStatus(s)
    return status === timeFilter
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createSeries({
        variables: {
          input: {
            title: formData.title,
            description: formData.description || null,
            imageUrl: formData.imageUrl || null,
          },
        },
      })

      addToast({ type: 'success', message: 'Series created successfully!' })
      setShowCreateModal(false)
      setFormData({ title: '', description: '', imageUrl: '' })
      refetch()
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to create series' })
      console.error(error)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await deleteSeries({ variables: { id } })
      addToast({ type: 'success', message: 'Series deleted successfully!' })
      refetch()
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to delete series' })
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Study Session Series
              </h1>
              <p className="text-gray-600">
                {isLeader ? 'Organize your study sessions into series' : 'View series you are participating in'}
              </p>
            </div>
            {isLeader && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Series
              </button>
            )}
          </div>

          {/* Time Filter */}
          <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm w-fit">
            <button
              onClick={() => setTimeFilter('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeFilter === 'active'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Active Series
            </button>
            <button
              onClick={() => setTimeFilter('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeFilter === 'past'
                  ? 'bg-gray-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Past Series
            </button>
            <button
              onClick={() => setTimeFilter('future')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeFilter === 'future'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Future Series
            </button>
          </div>
        </div>

        {/* Series Grid */}
        {series.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {timeFilter} series found
            </h3>
            <p className="text-gray-600 mb-4">
              {timeFilter === 'active'
                ? isLeader
                  ? 'You have no series with active sessions. Create a series or try a different filter.'
                  : 'No active series found. Try a different filter.'
                : timeFilter === 'past'
                ? 'You have no series with completed sessions. Try a different filter.'
                : isLeader
                ? 'You have no planned series. Create a series to get started.'
                : 'No future series found. Try a different filter.'}
            </p>
            {isLeader && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Series
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {s.title}
                  </h3>
                  {s.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {s.sessions.length} session{s.sessions.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/series/${s.id}`}
                      className={`${isLeader ? 'flex-1' : 'w-full'} px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium`}
                    >
                      View Details
                    </Link>
                    {isLeader && (
                      <button
                        onClick={() => handleDelete(s.id, s.title)}
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Series</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Paul's Letters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of this series..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Series'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
