'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { CreateSessionMutation, CreateSessionMutationVariables, UpdateSessionMutation, UpdateSessionMutationVariables } from '@bibleproject/types/src/graphql'
import { BIBLE_BOOKS, getChapterCount, getVerseCount, getLastChapterInBook, getLastVerseInBook } from '@/src/lib/bible-books'

const CREATE_SESSION = gql`
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) {
      id
      title
      description
      scheduledDate
      leader {
        id
        name
      }
      scripturePassages {
        id
        book
        chapter
        verseStart
        verseEnd
        content
        order
      }
    }
  }
`

const UPDATE_SESSION = gql`
  mutation UpdateSession($id: ID!, $input: UpdateSessionInput!) {
    updateSession(id: $id, input: $input) {
      id
      title
      description
      scheduledDate
    }
  }
`

interface SessionFormProps {
  session?: {
    id: string
    title: string
    description?: string | null
    scheduledDate: string
    videoCallUrl?: string | null
    scripturePassages: {
      book: string
      chapter: number
      verseStart: number
      verseEnd?: number | null
      content: string
    }[]
  }
  onSuccess?: () => void
}

const scripturePassageSchema = z.object({
  book: z.string().min(1, 'Book is required'),
  chapter: z.number().min(1, 'Chapter is required'),
  verseStart: z.number().min(1, 'Starting verse is required'),
  verseEnd: z.number().optional().nullable(),
  content: z.string().optional().default(''), // Content now fetched from API, not user-provided
})

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  videoCallUrl: z.string().optional().nullable(),
  scripturePassages: z.array(scripturePassageSchema).min(1, 'At least one scripture passage is required'),
})

type FormData = z.infer<typeof formSchema>

export default function SessionForm({ session, onSuccess }: SessionFormProps) {
  const [createSession] = useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CREATE_SESSION)
  const [updateSession] = useMutation<UpdateSessionMutation, UpdateSessionMutationVariables>(UPDATE_SESSION)

  // State for managing scripture passage selections
  const [selectedBook, setSelectedBook] = useState(session?.scripturePassages[0]?.book || '')
  const [selectedChapter, setSelectedChapter] = useState(session?.scripturePassages[0]?.chapter || 1)
  const [chapters, setChapters] = useState<number[]>([])
  const [versesInChapter, setVersesInChapter] = useState<number[]>([])

  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: session?.title || '',
      description: session?.description || '',
      scheduledDate: session?.scheduledDate.split('T')[0] || '',
      videoCallUrl: session?.videoCallUrl || '',
      scripturePassages: session?.scripturePassages.map(p => ({
        book: p.book,
        chapter: p.chapter,
        verseStart: p.verseStart,
        verseEnd: p.verseEnd,
        content: '',
      })) || [{
        book: '',
        chapter: 1,
        verseStart: 1,
        content: '',
      }],
    },
  })

  // Watch for changes to book and chapter
  const watchedBook = watch('scripturePassages.0.book')
  const watchedChapter = watch('scripturePassages.0.chapter')

  // Update chapters when book changes
  useEffect(() => {
    if (watchedBook) {
      const chapterCount = getChapterCount(watchedBook)
      const chapterArray = Array.from({ length: chapterCount }, (_, i) => i + 1)
      setChapters(chapterArray)
      setSelectedBook(watchedBook)

      // Auto-set end verse to last verse in the last chapter of the book
      const lastChapter = getLastChapterInBook(watchedBook)
      const lastVerse = getLastVerseInBook(watchedBook)
      setValue('scripturePassages.0.chapter', 1)
      setValue('scripturePassages.0.verseStart', 1)
      setValue('scripturePassages.0.verseEnd', lastVerse)
    }
  }, [watchedBook, setValue])

  // Update verses when chapter changes
  useEffect(() => {
    if (watchedBook && watchedChapter) {
      const verseCount = getVerseCount(watchedBook, watchedChapter)
      const verseArray = Array.from({ length: verseCount }, (_, i) => i + 1)
      setVersesInChapter(verseArray)
      setSelectedChapter(watchedChapter)
    }
  }, [watchedBook, watchedChapter])

  const onSubmit = async (data: FormData) => {
    try {
      const input = {
        title: data.title,
        description: data.description,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
        videoCallUrl: data.videoCallUrl || null,
        scripturePassages: data.scripturePassages.map(p => ({
          book: p.book,
          chapter: p.chapter,
          verseStart: p.verseStart,
          verseEnd: p.verseEnd || null,
          content: '', // Content is now fetched from Bible API, not stored in DB
        })),
      }

      if (session) {
        await updateSession({
          variables: {
            id: session.id,
            input: {
              title: input.title,
              description: input.description,
              scheduledDate: input.scheduledDate,
              videoCallUrl: input.videoCallUrl,
            }
          },
        })
      } else {
        await createSession({
          variables: { input },
        })
      }
      reset()
      onSuccess?.()
    } catch (err) {
      console.error('Error saving session:', err)
      // TODO: Display error to user
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Scheduled Date</label>
        <input
          id="scheduledDate"
          type="date"
          {...register('scheduledDate')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.scheduledDate && <p className="text-red-500 text-sm">{errors.scheduledDate.message}</p>}
      </div>

      <div>
        <label htmlFor="videoCallUrl" className="block text-sm font-medium text-gray-700">
          Video Call Room Name (Optional)
        </label>
        <input
          id="videoCallUrl"
          type="text"
          {...register('videoCallUrl')}
          placeholder="e.g., MyChurchBibleStudy2025"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter a unique room name for Jitsi Meet video calls. Leave blank if no video call is needed.
        </p>
        {errors.videoCallUrl && <p className="text-red-500 text-sm">{errors.videoCallUrl.message}</p>}
      </div>

      {/* Scripture Passages */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">Scripture Passages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="scripturePassages.0.book" className="block text-sm font-medium text-gray-700">Book</label>
            <select
              id="scripturePassages.0.book"
              {...register('scripturePassages.0.book')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="">Select a book...</option>
              {BIBLE_BOOKS.map(book => (
                <option key={book.name} value={book.name}>{book.name}</option>
              ))}
            </select>
            {errors.scripturePassages?.[0]?.book && <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[0].book.message}</p>}
          </div>

          <div>
            <label htmlFor="scripturePassages.0.chapter" className="block text-sm font-medium text-gray-700">Chapter</label>
            <select
              id="scripturePassages.0.chapter"
              {...register('scripturePassages.0.chapter', { valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              disabled={!watchedBook}
            >
              <option value="">Select chapter...</option>
              {chapters.map(ch => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
            {errors.scripturePassages?.[0]?.chapter && <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[0].chapter.message}</p>}
          </div>

          <div>
            <label htmlFor="scripturePassages.0.verseStart" className="block text-sm font-medium text-gray-700">Start Verse</label>
            <select
              id="scripturePassages.0.verseStart"
              {...register('scripturePassages.0.verseStart', { valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              disabled={!watchedChapter}
            >
              <option value="">Select verse...</option>
              {versesInChapter.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            {errors.scripturePassages?.[0]?.verseStart && <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[0].verseStart.message}</p>}
          </div>

          <div>
            <label htmlFor="scripturePassages.0.verseEnd" className="block text-sm font-medium text-gray-700">End Verse (Optional)</label>
            <select
              id="scripturePassages.0.verseEnd"
              {...register('scripturePassages.0.verseEnd', { valueAsNumber: true, required: false })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              disabled={!watchedChapter}
            >
              <option value="">Same as start verse...</option>
              {versesInChapter.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            {errors.scripturePassages?.[0]?.verseEnd && <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[0].verseEnd.message}</p>}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
          ℹ️ Scripture content will be automatically fetched from the Bible API when participants view this study session.
        </p>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
      >
        {session ? 'Update Study Session' : 'Create Study Session'}
      </button>
    </form>
  )
}
