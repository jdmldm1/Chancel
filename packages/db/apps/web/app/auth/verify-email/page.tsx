'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGraphQLMutation } from '@/lib/graphql-client-new'
import Link from 'next/link'

const VERIFY_EMAIL_MUTATION = `
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      id
      email
      emailVerified
    }
  }
`

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [verifyEmail] = useGraphQLMutation(VERIFY_EMAIL_MUTATION, {
    onCompleted: () => {
      setStatus('success')
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    },
    onError: (error) => {
      setStatus('error')
      setErrorMessage(error.message || 'Verification failed')
    },
  })

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('No verification token provided')
      return
    }

    verifyEmail({ token })
  }, [token, verifyEmail])

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full mx-4 space-y-8 p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200">
        {status === 'verifying' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. Redirecting you to the dashboard...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full animate-pulse" style={{ animation: 'progress 3s ease-in-out' }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-red-600 mb-6">
              {errorMessage}
            </p>
            <p className="text-gray-600 mb-6">
              The verification link may be invalid or expired. Please request a new verification email.
            </p>
            <div className="space-y-3">
              <Link
                href="/profile/edit"
                className="block w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Go to Profile
              </Link>
              <Link
                href="/dashboard"
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
