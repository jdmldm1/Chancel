import Link from 'next/link'

interface SessionCardProps {
  session: {
    id: string
    title: string
    description: string | null
    startDate: string
    endDate: string
    sessionType: 'SCRIPTURE_BASED' | 'TOPIC_BASED'
    imageUrl?: string | null
    leader: { name: string | null }
    participantCount: number
    series?: { title: string; imageUrl?: string | null } | null
  }
}

export default function SessionCard({ session }: SessionCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateRange = () => {
    const start = formatDate(session.startDate)
    const end = formatDate(session.endDate)
    return start === end ? start : `${start} - ${end}`
  }

  const getTypeBadge = () => {
    if (session.sessionType === 'SCRIPTURE_BASED') {
      return (
        <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full mb-3">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Scripture
        </div>
      )
    } else {
      return (
        <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full mb-3">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Topic
        </div>
      )
    }
  }

  const displayImage = session.series?.imageUrl || session.imageUrl

  return (
    <Link href={`/sessions/${session.id}`}>
      <div className="bg-white border-2 border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col">
        {displayImage && (
          <div className="mb-4 -mx-6 -mt-6">
            <img
              src={displayImage}
              alt={session.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
          </div>
        )}

        {getTypeBadge()}

        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
          {session.title}
        </h3>

        {session.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
            {session.description}
          </p>
        )}

        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDateRange()}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Leader: {session.leader.name || 'Unknown'}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{session.participantCount} participant{session.participantCount !== 1 ? 's' : ''}</span>
          </div>

          {session.series && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium">Part of: {session.series.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
