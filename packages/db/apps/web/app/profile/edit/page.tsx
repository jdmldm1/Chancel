'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGraphQLMutation, useGraphQLQuery } from '@/lib/graphql-client-new'
import { useToast } from '@/components/ui/toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional()
    .or(z.literal('')),
  displayName: z.string().max(50, 'Display name must be less than 50 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  phoneNumber: z.string().max(20).optional().or(z.literal('')),
  bibleTranslation: z.string().optional().or(z.literal('')),
  emailNotifications: z.boolean(),
  prayerNotifications: z.boolean(),
  commentNotifications: z.boolean(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const GET_CURRENT_USER = `
  query GetCurrentUser {
    currentUser {
      id
      email
      name
      username
      displayName
      bio
      location
      phoneNumber
      bibleTranslation
      emailNotifications
      prayerNotifications
      commentNotifications
      emailVerified
      createdAt
    }
  }
`

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      name
      username
      displayName
      bio
      location
      phoneNumber
      bibleTranslation
      emailNotifications
      prayerNotifications
      commentNotifications
    }
  }
`
const SEND_VERIFICATION_EMAIL_MUTATION = `
  mutation SendVerificationEmail {
    sendVerificationEmail
  }
`


export default function ProfileEditPage() {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const { addToast } = useToast()
  const [error, setError] = useState<string | null>(null)

  const { data, loading: queryLoading } = useGraphQLQuery(GET_CURRENT_USER)

  const [updateUser, { loading: mutationLoading }] = useGraphQLMutation(UPDATE_USER_MUTATION, {
    onCompleted: async () => {
      addToast({
        type: 'success',
        message: 'Profile updated successfully!',
      })
      await updateSession() // Refresh session data
      router.push('/profile/' + session?.user?.id)
    },
    onError: (error) => {
      setError(error.message || 'An error occurred while updating profile')
      addToast({
        type: 'error',
        message: 'Update failed',
        description: error.message || 'An error occurred. Please try again.',
      })
    },
  })

  const [sendVerificationEmail, { loading: sendingEmail }] = useGraphQLMutation(SEND_VERIFICATION_EMAIL_MUTATION, {
    onCompleted: () => {
      addToast({
        type: "success",
        message: "Verification email sent!",
        description: "Please check your inbox for the verification link."
      })
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: "Failed to send email",
        description: error.message || "Please try again later."
      })
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (data?.currentUser) {
      reset({
        name: data.currentUser.name || '',
        username: data.currentUser.username || '',
        displayName: data.currentUser.displayName || '',
        email: data.currentUser.email || '',
        bio: data.currentUser.bio || '',
        location: data.currentUser.location || '',
        phoneNumber: data.currentUser.phoneNumber || '',
        bibleTranslation: data.currentUser.bibleTranslation || 'ESV',
        emailNotifications: data.currentUser.emailNotifications ?? true,
        prayerNotifications: data.currentUser.prayerNotifications ?? true,
        commentNotifications: data.currentUser.commentNotifications ?? true,
      })
    }
  }, [data, reset])

  const onSubmit = async (formData: ProfileFormData) => {
    setError(null)

    // Build update object with only non-empty fields
    const updateData: any = {}
    if (formData.name) updateData.name = formData.name
    if (formData.username) updateData.username = formData.username
    if (formData.displayName !== undefined) updateData.displayName = formData.displayName || null
    if (formData.email) updateData.email = formData.email
    if (formData.bio !== undefined) updateData.bio = formData.bio || null
    if (formData.location !== undefined) updateData.location = formData.location || null
    if (formData.phoneNumber !== undefined) updateData.phoneNumber = formData.phoneNumber || null
    if (formData.bibleTranslation) updateData.bibleTranslation = formData.bibleTranslation
    updateData.emailNotifications = formData.emailNotifications
    updateData.prayerNotifications = formData.prayerNotifications
    updateData.commentNotifications = formData.commentNotifications

    await updateUser({ input: updateData })
  }

  if (queryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const user = data?.currentUser
  const accountAge = user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const needsVerification = !user?.emailVerified && accountAge >= 30

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information and preferences</p>
        </div>

        {/* Email Verification Warning */}
        {needsVerification && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">Email Verification Required</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Your account is over 30 days old and requires email verification.
                </p>
                <button
                  type="button"
                  onClick={() => sendVerificationEmail({})}
                  disabled={sendingEmail}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Verification Email
                    </>
                  )}
                </button>
              </div>
        )}

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Public Identity Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">Public Identity</h2>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span> <span className="text-gray-500 font-normal">(publicly visible)</span>
                </label>
                <input
                  {...register('username')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="johndoe"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This is how other users will see you in comments and chat
                </p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Display name <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  {...register('displayName')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John (shown instead of username if set)"
                />
                {errors.displayName && (
                  <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  If set, this will be shown instead of your username
                </p>
              </div>
            </div>

            {/* Private Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">Private Information</h2>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name <span className="text-gray-500 font-normal">(private)</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  {...register('location')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, Country"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">Preferences</h2>

              <div>
                <label htmlFor="bibleTranslation" className="block text-sm font-medium text-gray-700">
                  Preferred Bible translation
                </label>
                <select
                  {...register('bibleTranslation')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ESV">ESV</option>
                  <option value="NIV">NIV</option>
                  <option value="KJV">KJV</option>
                  <option value="NKJV">NKJV</option>
                  <option value="NLT">NLT</option>
                  <option value="NASB">NASB</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Notification preferences
                </label>

                <div className="flex items-center">
                  <input
                    {...register('emailNotifications')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Email notifications for new sessions and updates
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('prayerNotifications')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Prayer request notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('commentNotifications')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Comment reply notifications
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={mutationLoading}
                className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {mutationLoading ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
