'use client'

import React from 'react'
import JitsiMeeting from './JitsiMeeting'

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  roomName: string
  displayName?: string
}

export default function VideoCallModal({ isOpen, onClose, roomName, displayName }: VideoCallModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4 bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
          <h3 className="text-white text-lg font-semibold">Video Call</h3>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Leave Call
          </button>
        </div>

        {/* Jitsi Container */}
        <div className="w-full h-full pt-16">
          <JitsiMeeting roomName={roomName} displayName={displayName} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
