import { useGetMySessionsQuery, useDeleteSessionMutation, GetMySessionsDocument } from '@bibleproject/types/src/graphql'
import Link from 'next/link'

export default function SessionList() {
  const { data, loading, error } = useGetMySessionsQuery()
  const [deleteSession] = useDeleteSessionMutation({
    refetchQueries: [{ query: GetMySessionsDocument }],
  })

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSession({ variables: { id } })
      } catch (err) {
        console.error('Error deleting session:', err)
        // TODO: Display error to user
      }
    }
  }

  if (loading) return <p>Loading sessions...</p>
  if (error) return <p>Error: {error.message}</p>

  const sessions = data?.mySessions || []

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions found. Create a new one!</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="p-4 border rounded-md shadow-sm"
            >
              <Link href={`/sessions/${session.id}`} className="text-blue-600 hover:underline">
                <h3 className="text-xl font-bold">{session.title}</h3>
              </Link>
              <p className="text-gray-600">{session.description}</p>
              <p className="text-sm text-gray-500">
                Scheduled for: {new Date(session.scheduledDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Leader: {session.leader?.name || 'N/A'}
              </p>
              <button
                onClick={() => handleDeleteSession(session.id)}
                className="mt-2 rounded-md bg-red-600 px-3 py-1 text-white font-semibold hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
