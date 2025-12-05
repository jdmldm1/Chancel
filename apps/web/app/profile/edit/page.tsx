'use client'

import { useGraphQLQuery, useGraphQLMutation } from '@/lib/graphql-client-new'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save, User, Mail, MapPin, Phone, FileText, Bell, Book } from 'lucide-react'
import Link from 'next/link'

const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      bio
      profilePicture
      location
      phoneNumber
      emailNotifications
      prayerNotifications
      commentNotifications
      bibleTranslation
    }
  }
`

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      name
      bio
      profilePicture
      location
      phoneNumber
      emailNotifications
      prayerNotifications
      commentNotifications
      bibleTranslation
    }
  }
`

export default function EditProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [success, setSuccess] = useState(false)

  const { data, loading } = useGraphQLQuery<any>(ME_QUERY, {
    skip: !session,
  })

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    phoneNumber: '',
    emailNotifications: true,
    prayerNotifications: true,
    commentNotifications: true,
    bibleTranslation: 'ESV',
  })

  const [dataLoaded, setDataLoaded] = useState(false)

  // Load user data when available
  if (data?.me && !dataLoaded) {
    setFormData({
      name: data.me.name || '',
      bio: data.me.bio || '',
      location: data.me.location || '',
      phoneNumber: data.me.phoneNumber || '',
      emailNotifications: data.me.emailNotifications ?? true,
      prayerNotifications: data.me.prayerNotifications ?? true,
      commentNotifications: data.me.commentNotifications ?? true,
      bibleTranslation: data.me.bibleTranslation || 'ESV',
    })
    setDataLoaded(true)
  }

  const [updateUser, { loading: updating }] = useGraphQLMutation<any>(UPDATE_USER_MUTATION, {
    onCompleted: async (data) => {
      setSuccess(true)
      // Update session with new name
      await update({ name: data.updateUser.name })
      setTimeout(() => setSuccess(false), 3000)
    },
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-96 bg-white/60 backdrop-blur-sm rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser({
          input: formData,
      })
    } catch (err) {
      alert('Error updating profile: ' + (err as Error).message)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sessions"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Sessions
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <User className="text-blue-600" size={36} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Profile
            </h1>
          </div>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✓ Profile updated successfully!
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={data?.me?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <FileText size={16} />
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <Book size={16} />
                  Preferred Bible Translation
                </label>
                <select
                  value={formData.bibleTranslation}
                  onChange={(e) => handleChange('bibleTranslation', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ESV">ESV - English Standard Version</option>
                  <option value="NIV">NIV - New International Version</option>
                  <option value="NASB">NASB - New American Standard Bible</option>
                  <option value="KJV">KJV - King James Version</option>
                  <option value="NKJV">NKJV - New King James Version</option>
                  <option value="NLT">NLT - New Living Translation</option>
                  <option value="CSB">CSB - Christian Standard Bible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 mb-4">
              <Bell size={20} />
              Notification Settings
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-slate-700">Email Notifications</div>
                  <div className="text-sm text-slate-500">Receive general updates via email</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.prayerNotifications}
                  onChange={(e) => handleChange('prayerNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-slate-700">Prayer Request Notifications</div>
                  <div className="text-sm text-slate-500">Get notified about new prayer requests</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.commentNotifications}
                  onChange={(e) => handleChange('commentNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-slate-700">Comment Notifications</div>
                  <div className="text-sm text-slate-500">Get notified when someone replies to your comments</div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/sessions"
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
