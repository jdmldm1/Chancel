/**
 * Video URL Parsing Utilities
 *
 * Helper functions to extract video IDs from YouTube and Vimeo URLs
 * and determine the resource type.
 */

export type VideoResourceType = 'VIDEO_YOUTUBE' | 'VIDEO_VIMEO' | 'VIDEO_UPLOAD' | 'FILE'

export interface ParsedVideo {
  resourceType: VideoResourceType
  videoId: string
  fileName: string
}

/**
 * Parse a YouTube URL and extract the video ID
 * Supports formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function parseYouTubeUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^&\s?]+)/,
    /(?:youtube\.com\/embed\/)([^&\s?]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Parse a Vimeo URL and extract the video ID
 * Supports formats:
 * - https://vimeo.com/VIDEO_ID
 * - https://player.vimeo.com/video/VIDEO_ID
 */
export function parseVimeoUrl(url: string): string | null {
  const patterns = [
    /(?:vimeo\.com\/)(\d+)/,
    /(?:player\.vimeo\.com\/video\/)(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Parse any video URL and return the resource type and video ID
 * @param url The video URL to parse
 * @returns ParsedVideo object or null if not a recognized video URL
 */
export function parseVideoUrl(url: string): ParsedVideo | null {
  // Try YouTube
  const youtubeId = parseYouTubeUrl(url)
  if (youtubeId) {
    return {
      resourceType: 'VIDEO_YOUTUBE',
      videoId: youtubeId,
      fileName: `YouTube Video: ${youtubeId}`,
    }
  }

  // Try Vimeo
  const vimeoId = parseVimeoUrl(url)
  if (vimeoId) {
    return {
      resourceType: 'VIDEO_VIMEO',
      videoId: vimeoId,
      fileName: `Vimeo Video: ${vimeoId}`,
    }
  }

  return null
}

/**
 * Check if a URL is a video URL (YouTube or Vimeo)
 */
export function isVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null
}

/**
 * Get a thumbnail URL for a video
 */
export function getVideoThumbnail(resourceType: VideoResourceType, videoId: string): string | null {
  if (resourceType === 'VIDEO_YOUTUBE') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  // Vimeo thumbnails require API call, so we'll skip for now
  return null
}
