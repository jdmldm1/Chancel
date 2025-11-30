'use client'

import { useMutation, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Users, Lock, Globe } from 'lucide-react'
import Link from 'next/link'

const CREATE_GROUP = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
      name
      description
      visibility
      createdAt
    }
  }
`

export default function NewGroupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [createGroup, { loading }] = useMutation(CREATE_GROUP, {
    onCompleted: (data) => {
      router.push(`/groups/${data.createGroup.id}`)
    },
    onError: (error) => {
      setErrors({ submit: error.message })
    },
  })

  if (!session) {
    router.push('/auth/login')
    return null
  }

  if (session.user?.role !== 'LEADER') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 mb-4">Only leaders can create groups</p>
          <Link href="/groups" className="text-blue-600 hover:underline">
            Back to Groups
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await createGroup({
      variables: {
        input: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          imageUrl: formData.imageUrl.trim() || undefined,
          visibility: formData.visibility,
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Groups
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Create New Group
          </h1>
          <p className="text-slate-600">
            Create a group to connect with your community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
            {/* Group Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., Young Adults Bible Study"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What is this group about?"
              />
            </div>

            {/* Image URL */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Visibility
              </label>
              <div className="space-y-3">
                {/* Public Option */}
                <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-blue-50/50"
                  style={{
                    borderColor: formData.visibility === 'PUBLIC' ? '#3b82f6' : '#e2e8f0',
                    backgroundColor: formData.visibility === 'PUBLIC' ? '#eff6ff' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    checked={formData.visibility === 'PUBLIC'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="text-blue-600" size={20} />
                      <span className="font-semibold text-slate-800">Public</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Anyone can discover and join this group
                    </p>
                  </div>
                </label>

                {/* Private Option */}
                <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-purple-50/50"
                  style={{
                    borderColor: formData.visibility === 'PRIVATE' ? '#8b5cf6' : '#e2e8f0',
                    backgroundColor: formData.visibility === 'PRIVATE' ? '#f5f3ff' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="PRIVATE"
                    checked={formData.visibility === 'PRIVATE'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PRIVATE' })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="text-purple-600" size={20} />
                      <span className="font-semibold text-slate-800">Private</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Only invited members can see and join this group
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Link
                href="/groups"
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-center font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Users size={20} />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
