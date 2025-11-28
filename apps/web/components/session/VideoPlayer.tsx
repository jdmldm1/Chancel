'use client'

import { useState } from 'react'

type ResourceType = 'VIDEO_YOUTUBE' | 'VIDEO_VIMEO' | 'VIDEO_UPLOAD' | 'FILE'

interface VideoPlayerProps {
  resourceType: ResourceType
  videoId?: string | null
  fileUrl?: string
  fileName?: string
}

export default function VideoPlayer({ resourceType, videoId, fileUrl, fileName }: VideoPlayerProps) {
  const [error, setError] = useState(false)

  if (resourceType === 'VIDEO_YOUTUBE' && videoId) {
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={fileName || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setError(true)}
        />
        {error && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
            <p className="text-red-600">Failed to load video</p>
          </div>
        )}
      </div>
    )
  }

  if (resourceType === 'VIDEO_VIMEO' && videoId) {
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://player.vimeo.com/video/${videoId}`}
          title={fileName || 'Vimeo video'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onError={() => setError(true)}
        />
        {error && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
            <p className="text-red-600">Failed to load video</p>
          </div>
        )}
      </div>
    )
  }

  if (resourceType === 'VIDEO_UPLOAD' && fileUrl) {
    return (
      <div className="w-full">
        <video
          className="w-full rounded-lg"
          controls
          onError={() => setError(true)}
        >
          <source src={fileUrl} type="video/mp4" />
          <source src={fileUrl} type="video/webm" />
          <source src={fileUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        {error && (
          <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            Failed to load video. The file format may not be supported.
          </div>
        )}
      </div>
    )
  }

  return null
}
