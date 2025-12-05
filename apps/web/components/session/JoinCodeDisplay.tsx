'use client'

import { useState } from 'react'
import { useGraphQLMutation } from '@/lib/graphql-client-new'
import { useToast } from '@/components/ui/toast'

const REGENERATE_JOIN_CODE = `
  mutation RegenerateJoinCode($sessionId: ID!) {
    regenerateJoinCode(sessionId: $sessionId) {
      id
      joinCode
    }
  }
`

interface JoinCodeDisplayProps {
  sessionId: string
  joinCode: string
  sessionTitle: string
  onCodeRegenerated?: (newCode: string) => void
}

export default function JoinCodeDisplay({
  sessionId,
  joinCode,
  sessionTitle,
  onCodeRegenerated
}: JoinCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()
  const [regenerateCode, { loading }] = useGraphQLMutation<any>(REGENERATE_JOIN_CODE, {
    onCompleted: (data) => {
      const newCode = data?.regenerateJoinCode?.joinCode
      if (newCode && onCodeRegenerated) {
        onCodeRegenerated(newCode)
      }
      addToast({
        type: 'success',
        message: 'Join code regenerated!',
        description: 'The old code will no longer work.',
      })
    },
    onError: (error) => {
      addToast({
        type: 'error',
        message: 'Failed to regenerate code',
        description: error.message,
      })
    },
  })

  const formatCode = (code: string) => {
    if (code.length === 6) {
      return `${code.slice(0, 3)}-${code.slice(3)}`
    }
    return code
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinCode)
      setCopied(true)
      addToast({
        type: 'success',
        message: 'Join code copied!',
        description: 'Share this code with participants to join the session.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to copy code',
      })
    }
  }

  const handleRegenerate = () => {
    if (confirm('Are you sure you want to regenerate the join code? The old code will stop working immediately.')) {
      regenerateCode({ sessionId })
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Session Join Code</h3>
            <p className="text-sm text-gray-600">Share this code to invite participants</p>
          </div>
        </div>
      </div>

      {/* Join Code Display */}
      <div className="bg-white rounded-lg p-4 mb-4 border-2 border-blue-300">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-blue-600 tracking-widest mb-2">
            {formatCode(joinCode)}
          </div>
          <p className="text-xs text-gray-500">6-character code</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Code
            </>
          )}
        </button>

        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-100/50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Tip:</span> Anyone with this code can join the session. Regenerate if the code is compromised.
        </p>
      </div>
    </div>
  )
}
