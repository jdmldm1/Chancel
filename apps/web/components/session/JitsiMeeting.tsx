'use client'

import React, { useEffect, useRef, useState } from 'react'

interface JitsiMeetingProps {
  roomName: string
  displayName?: string
  onClose?: () => void
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default function JitsiMeeting({ roomName, displayName = 'User', onClose }: JitsiMeetingProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const [jitsiApi, setJitsiApi] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Jitsi Meet API script
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI)
          return
        }

        const script = document.createElement('script')
        script.src = 'https://meet.jit.si/external_api.js'
        script.async = true
        script.onload = () => resolve(window.JitsiMeetExternalAPI)
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'))
        document.body.appendChild(script)
      })
    }

    const initializeJitsi = async () => {
      try {
        await loadJitsiScript()

        if (!jitsiContainerRef.current) {
          setError('Container not found')
          return
        }

        const domain = 'meet.jit.si'
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: displayName,
          },
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: true,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#1a1a1a',
          },
        }

        const api = new window.JitsiMeetExternalAPI(domain, options)

        api.addEventListener('videoConferenceJoined', () => {
          setIsLoading(false)
        })

        api.addEventListener('readyToClose', () => {
          onClose?.()
        })

        setJitsiApi(api)
      } catch (err) {
        console.error('Error initializing Jitsi:', err)
        setError('Failed to load video call. Please try again.')
        setIsLoading(false)
      }
    }

    initializeJitsi()

    // Cleanup
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose()
      }
    }
  }, [roomName, displayName, onClose])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <div className="text-white text-lg">Connecting to video call...</div>
        </div>
      )}
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </div>
  )
}
