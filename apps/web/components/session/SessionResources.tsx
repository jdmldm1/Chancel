'use client'

import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import {
  CreateSessionResourceMutation,
  CreateSessionResourceMutationVariables,
  DeleteSessionResourceMutation,
  DeleteSessionResourceMutationVariables,
  GetSessionQuery,
  ResourceType
} from '@bibleproject/types/src/graphql'
import VideoPlayer from './VideoPlayer'
import { parseVideoUrl, isVideoUrl } from '@/lib/video-utils'

const CREATE_SESSION_RESOURCE = gql`
  mutation CreateSessionResource($input: CreateSessionResourceInput!) {
    createSessionResource(input: $input) {
      id
      fileName
      fileUrl
      fileType
      resourceType
      videoId
      description
      createdAt
      uploader {
        id
        name
      }
    }
  }
`

const DELETE_SESSION_RESOURCE = gql`
  mutation DeleteSessionResource($id: ID!) {
    deleteSessionResource(id: $id)
  }
`

type SessionResource = NonNullable<GetSessionQuery['session']>['resources'][0]

interface SessionResourcesProps {
  resources: SessionResource[]
  sessionId: string
  canUpload: boolean
  currentUserId?: string
  sessionLeaderId: string
}

export default function SessionResources({
  resources,
  sessionId,
  canUpload,
  currentUserId,
  sessionLeaderId,
}: SessionResourcesProps) {
  const { data: session } = useSession()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [description, setDescription] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [uploadType, setUploadType] = useState<'file' | 'video'>('file')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [createResource] = useMutation<CreateSessionResourceMutation, CreateSessionResourceMutationVariables>(
    CREATE_SESSION_RESOURCE,
    {
      refetchQueries: ['GetSession'],
      onCompleted: () => {
        setShowUploadForm(false)
        setDescription('')
        setVideoUrl('')
        setUploadError('')
        setUploadType('file')
      },
      onError: (error) => {
        setUploadError(error.message)
      },
    }
  )

  const [deleteResource] = useMutation<DeleteSessionResourceMutation, DeleteSessionResourceMutationVariables>(
    DELETE_SESSION_RESOURCE,
    {
      refetchQueries: ['GetSession'],
    }
  )

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError('')

    try {
      // Upload file to API
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const { fileUrl, fileName, fileType } = await response.json()

      // Create resource in GraphQL
      await createResource({
        variables: {
          input: {
            sessionId,
            fileName,
            fileUrl,
            fileType,
            description: description.trim() || undefined,
          },
        },
      })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUrlSubmit = async () => {
    if (!videoUrl.trim()) {
      setUploadError('Please enter a video URL')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const parsedVideo = parseVideoUrl(videoUrl.trim())

      if (!parsedVideo) {
        throw new Error('Invalid video URL. Please use a YouTube or Vimeo link.')
      }

      await createResource({
        variables: {
          input: {
            sessionId,
            fileName: parsedVideo.fileName,
            fileUrl: videoUrl.trim(),
            fileType: 'video/url',
            resourceType: parsedVideo.resourceType as ResourceType,
            videoId: parsedVideo.videoId,
            description: description.trim() || undefined,
          },
        },
      })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to add video')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    await deleteResource({
      variables: { id: resourceId },
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType === 'application/pdf') return '📄'
    if (fileType.includes('word')) return '📝'
    return '📎'
  }

  const canDelete = (resource: SessionResource) => {
    return currentUserId === resource.uploader.id || currentUserId === sessionLeaderId
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-xl font-semibold text-blue-900 hover:text-blue-700"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Resources ({resources.length})
        </button>
        {canUpload && !isCollapsed && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            {showUploadForm ? 'Cancel' : 'Upload Resource'}
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="px-6 py-6">

      {/* Upload Form */}
      {showUploadForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            {/* Upload Type Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setUploadType('file')}
                className={`px-4 py-2 text-sm font-medium ${
                  uploadType === 'file'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📎 Upload File
              </button>
              <button
                onClick={() => setUploadType('video')}
                className={`px-4 py-2 text-sm font-medium ${
                  uploadType === 'video'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🎥 Add Video
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this resource..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose File
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, Word, Text, Images (JPG, PNG, GIF). Max size: 10MB
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supports YouTube and Vimeo URLs
                </p>
                <button
                  onClick={handleVideoUrlSubmit}
                  disabled={uploading || !videoUrl.trim()}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            )}

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
            {uploading && uploadType === 'file' && (
              <p className="text-sm text-blue-600">Uploading...</p>
            )}
          </div>
        </div>
      )}

      {/* Resources List */}
      {resources.length === 0 ? (
        <p className="text-gray-500 text-sm">No resources uploaded yet.</p>
      ) : (
        <div className="space-y-6">
          {resources.map((resource) => {
            const isVideo = resource.resourceType && ['VIDEO_YOUTUBE', 'VIDEO_VIMEO', 'VIDEO_UPLOAD'].includes(resource.resourceType)

            return (
              <div key={resource.id} className="bg-gray-50 rounded-lg p-4">
                {/* Resource Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isVideo ? (
                        <span className="text-xl">🎥</span>
                      ) : (
                        <span className="text-xl">{getFileIcon(resource.fileType)}</span>
                      )}
                      <h3 className="font-medium text-gray-900">{resource.fileName}</h3>
                    </div>
                    {resource.description && (
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Added by {resource.uploader.name} •{' '}
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {canDelete(resource) && (
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Video Player or File Link */}
                {isVideo ? (
                  <div className="mt-3">
                    <VideoPlayer
                      resourceType={resource.resourceType as any}
                      videoId={resource.videoId}
                      fileUrl={resource.fileUrl}
                      fileName={resource.fileName}
                    />
                  </div>
                ) : (
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download File
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
        </div>
      )}
    </div>
  )
}
