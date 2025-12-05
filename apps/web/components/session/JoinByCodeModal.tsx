'use client'

import { useState } from 'react'
import { useGraphQLMutation } from '@/lib/graphql-client-new'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'

const JOIN_BY_CODE_MUTATION = `
  mutation JoinSessionByCode($joinCode: String!) {
    joinSessionByCode(joinCode: $joinCode) {
      participant {
        id
        sessionId
        userId
      }
      session {
        id
        title
      }
      series {
        id
        title
      }
      addedToSeriesSessions {
        id
        title
      }
      totalSessionsJoined
    }
  }
`

interface JoinByCodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JoinByCodeModal({ isOpen, onClose }: JoinByCodeModalProps) {
  const [joinCode, setJoinCode] = useState('')
  const [joinByCode, { loading }] = useGraphQLMutation<any>(JOIN_BY_CODE_MUTATION)
  const { addToast } = useToast()
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Remove any hyphens or spaces from input
    const cleanCode = joinCode.replace(/[-\s]/g, '').toUpperCase()

    if (cleanCode.length !== 6) {
      addToast({ type: 'error', message: 'Join code must be 6 characters' })
      return
    }

    try {
      const result = await joinByCode({
        joinCode: cleanCode,
      })

      const data = result.data?.joinSessionByCode
      const sessionId = data?.session?.id
      const sessionTitle = data?.session?.title
      const series = data?.series
      const addedToSeriesSessions = data?.addedToSeriesSessions || []
      const totalSessionsJoined = data?.totalSessionsJoined || 1

      // Show success message with series information
      if (series && addedToSeriesSessions.length > 0) {
        addToast({
          type: 'success',
          message: `Joined ${totalSessionsJoined} session${totalSessionsJoined > 1 ? 's' : ''}!`,
          description: `You've been added to "${sessionTitle}" and ${addedToSeriesSessions.length} other session${addedToSeriesSessions.length > 1 ? 's' : ''} in the "${series.title}" series.`,
        })
      } else if (series) {
        addToast({
          type: 'success',
          message: `Successfully joined "${sessionTitle}"!`,
          description: `This session is part of the "${series.title}" series.`,
        })
      } else {
        addToast({
          type: 'success',
          message: `Successfully joined "${sessionTitle}"!`,
        })
      }

      onClose()
      setJoinCode('')

      // Redirect to session page
      if (sessionId) {
        router.push(`/sessions/${sessionId}`)
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to join session',
      })
    }
  }

  const handleClose = () => {
    setJoinCode('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Join with Code</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              Enter the 6-character code provided by the session leader to join a private session.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-2">
              Join Code
            </label>
            <input
              id="joinCode"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              maxLength={7}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono font-bold tracking-widest uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500 text-center">
              Format: ABC123 or ABC-123
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || joinCode.replace(/[-\s]/g, '').length !== 6}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Joining...
                </span>
              ) : (
                'Join Session'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
