'use client'

import { useParams, useRouter } from 'next/navigation'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { GetSessionQuery } from '@bibleproject/types/src/graphql'
import SessionForm from '@/components/session/SessionForm'

const GET_SESSION = gql`
  query GetSession($id: ID!) {
    session(id: $id) {
      id
      title
      description
      scheduledDate
      videoCallUrl
      imageUrl
      scripturePassages {
        id
        book
        chapter
        verseStart
        verseEnd
        content
        note
      }
    }
  }
`

export default function EditSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const { data, loading, error } = useQuery<GetSessionQuery>(GET_SESSION, {
    variables: { id: sessionId },
  })

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading session...</p>
      </div>
    )
  }

  if (error || !data?.session) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-600">Error loading session: {error?.message || 'Session not found'}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Study Session</h1>
      <SessionForm
        session={{
          id: data.session.id,
          title: data.session.title,
          description: data.session.description,
          scheduledDate: data.session.scheduledDate,
          videoCallUrl: data.session.videoCallUrl,
          imageUrl: data.session.imageUrl,
          scripturePassages: data.session.scripturePassages.map(p => ({
            book: p.book,
            chapter: p.chapter,
            verseStart: p.verseStart,
            verseEnd: p.verseEnd,
            content: p.content,
            note: p.note,
          })),
        }}
        onSuccess={() => router.push(`/sessions/${sessionId}`)}
      />
    </div>
  )
}
