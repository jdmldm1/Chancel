import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateSessionMutation, useUpdateSessionMutation } from '@bibleproject/types/src/graphql'

interface SessionFormProps {
  session?: {
    id: string
    title: string
    description?: string | null
    scheduledDate: string
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
  content: z.string().min(1, 'Content is required'),
})

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scripturePassages: z.array(scripturePassageSchema).min(1, 'At least one scripture passage is required'),
})

type FormData = z.infer<typeof formSchema>

export default function SessionForm({ session, onSuccess }: SessionFormProps) {
  const [createSession] = useCreateSessionMutation()
  const [updateSession] = useUpdateSessionMutation()

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: session?.title || '',
      description: session?.description || '',
      scheduledDate: session?.scheduledDate.split('T')[0] || '',
      scripturePassages: session?.scripturePassages.map(p => ({
        book: p.book,
        chapter: p.chapter,
        verseStart: p.verseStart,
        verseEnd: p.verseEnd,
        content: p.content,
      })) || [{
        book: '',
        chapter: 1,
        verseStart: 1,
        content: '',
      }],
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const input = {
        title: data.title,
        description: data.description,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
        scripturePassages: data.scripturePassages.map(p => ({
          book: p.book,
          chapter: p.chapter,
          verseStart: p.verseStart,
          verseEnd: p.verseEnd || null,
          content: p.content,
        })),
      }

      if (session) {
        await updateSession({
          variables: { id: session.id, input: { ...input, scripturePassages: undefined } }, // scripturePassages cannot be updated directly via updateSession
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

      {/* Scripture Passages - For simplicity, only one passage for now */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">Scripture Passages</h3>
        {/* You'd typically map over an array for multiple passages, using react-hook-form's useFieldArray */}
        <div>
          <label htmlFor="scripturePassages.0.book" className="block text-sm font-medium text-gray-700">Book</label>
          <input
            id="scripturePassages.0.book"
            type="text"
            {...register('scripturePassages.0.book')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.scripturePassages?.[0]?.book && <p className="text-red-500 text-sm">{errors.scripturePassages[0].book.message}</p>}
        </div>
        <div>
          <label htmlFor="scripturePassages.0.chapter" className="block text-sm font-medium text-gray-700">Chapter</label>
          <input
            id="scripturePassages.0.chapter"
            type="number"
            {...register('scripturePassages.0.chapter', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.scripturePassages?.[0]?.chapter && <p className="text-red-500 text-sm">{errors.scripturePassages[0].chapter.message}</p>}
        </div>
        <div>
          <label htmlFor="scripturePassages.0.verseStart" className="block text-sm font-medium text-gray-700">Start Verse</label>
          <input
            id="scripturePassages.0.verseStart"
            type="number"
            {...register('scripturePassages.0.verseStart', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.scripturePassages?.[0]?.verseStart && <p className="text-red-500 text-sm">{errors.scripturePassages[0].verseStart.message}</p>}
        </div>
        <div>
          <label htmlFor="scripturePassages.0.verseEnd" className="block text-sm font-medium text-gray-700">End Verse (Optional)</label>
          <input
            id="scripturePassages.0.verseEnd"
            type="number"
            {...register('scripturePassages.0.verseEnd', { valueAsNumber: true, required: false })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.scripturePassages?.[0]?.verseEnd && <p className="text-red-500 text-sm">{errors.scripturePassages[0].verseEnd.message}</p>}
        </div>
        <div>
          <label htmlFor="scripturePassages.0.content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="scripturePassages.0.content"
            {...register('scripturePassages.0.content')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
          {errors.scripturePassages?.[0]?.content && <p className="text-red-500 text-sm">{errors.scripturePassages[0].content.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
      >
        {session ? 'Update Session' : 'Create Session'}
      </button>
    </form>
  )
}
