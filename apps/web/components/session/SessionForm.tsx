'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { CreateSessionMutation, CreateSessionMutationVariables, UpdateSessionMutation, UpdateSessionMutationVariables } from '@bibleproject/types/src/graphql'
import { BIBLE_BOOKS, getChapterCount, getVerseCount, getLastVerseInBook } from '@/src/lib/bible-books'
import { useToast } from '@/components/ui/toast'

const CREATE_SESSION = gql`
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) {
      id
      title
      description
      startDate
      endDate
      seriesId
      visibility
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
      startDate
      endDate
      seriesId
      visibility
    }
  }
`

const GET_MY_SERIES = gql`
  query GetMySeries {
    mySeries {
      id
      title
      description
      imageUrl
    }
  }
`

const CREATE_SERIES = gql`
  mutation CreateSeries($input: CreateSeriesInput!) {
    createSeries(input: $input) {
      id
      title
      description
      imageUrl
    }
  }
`

interface SessionFormProps {
  session?: {
    id: string
    title: string
    description?: string | null
    startDate: string
    endDate: string
    seriesId?: string | null
    visibility?: string | null
    sessionType?: string | null
    videoCallUrl?: string | null
    imageUrl?: string | null
    scripturePassages: {
      book: string
      chapter: number
      verseStart: number
      verseEnd?: number | null
      content: string
      note?: string | null
    }[]
  }
  onSuccess?: () => void
}

const scripturePassageSchema = z.object({
  book: z.string().min(1, 'Book is required'),
  chapter: z.number().min(1, 'Chapter is required'),
  verseStart: z.number().min(1, 'Starting verse is required'),
  verseEnd: z.number().optional().nullable(),
  content: z.string().optional().default(''),
  note: z.string().optional().nullable(),
})

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  seriesId: z.string().optional().nullable(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
  sessionType: z.enum(['TOPIC_BASED', 'SCRIPTURE_BASED']).default('SCRIPTURE_BASED'),
  videoCallUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  scripturePassages: z.array(scripturePassageSchema).min(1, 'At least one scripture passage is required'),
  newSeriesTitle: z.string().optional(),
  newSeriesImageUrl: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function SessionForm({ session, onSuccess }: SessionFormProps) {
  const { addToast } = useToast()
  const [createSession] = useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CREATE_SESSION)
  const [updateSession] = useMutation<UpdateSessionMutation, UpdateSessionMutationVariables>(UPDATE_SESSION)
  const [createSeries] = useMutation<any>(CREATE_SERIES, {
    refetchQueries: [{ query: GET_MY_SERIES }],
  })
  const { data: seriesData } = useQuery<any>(GET_MY_SERIES)
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false)
  const [uploadingSessionImage, setUploadingSessionImage] = useState(false)
  const [uploadingSeriesImage, setUploadingSeriesImage] = useState(false)

  // Calculate default dates
  const today = new Date().toISOString().split('T')[0]
  const oneWeekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const handleImageUpload = async (file: File, fieldName: 'imageUrl' | 'newSeriesImageUrl') => {
    const isSeriesImage = fieldName === 'newSeriesImageUrl'
    const setUploading = isSeriesImage ? setUploadingSeriesImage : setUploadingSessionImage

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setValue(fieldName, data.fileUrl)
      addToast({
        type: 'success',
        message: 'Image uploaded successfully',
        description: 'Your image has been uploaded and attached.',
      })
    } catch (error) {
      console.error('Image upload error:', error)
      addToast({
        type: 'error',
        message: 'Image upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: session?.title || '',
      description: session?.description || '',
      startDate: session?.startDate?.split('T')[0] || today,
      endDate: session?.endDate?.split('T')[0] || oneWeekLater,
      seriesId: session?.seriesId || '',
      visibility: (session?.visibility as 'PUBLIC' | 'PRIVATE') || 'PUBLIC',
      sessionType: (session?.sessionType as 'TOPIC_BASED' | 'SCRIPTURE_BASED') || 'SCRIPTURE_BASED',
      videoCallUrl: session?.videoCallUrl || '',
      imageUrl: session?.imageUrl || '',
      newSeriesTitle: '',
      newSeriesImageUrl: '',
      scripturePassages: session?.scripturePassages.map(p => ({
        book: p.book,
        chapter: p.chapter,
        verseStart: p.verseStart,
        verseEnd: p.verseEnd,
        content: '',
        note: p.note || '',
      })) || [{
        book: '',
        chapter: 1,
        verseStart: 1,
        verseEnd: null,
        content: '',
        note: '',
      }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'scripturePassages',
  })

  const watchedPassages = watch('scripturePassages')

  const onSubmit = async (data: FormData) => {
    try {
      let seriesId = data.seriesId

      // Create new series if requested
      if (data.newSeriesTitle && data.newSeriesTitle.trim()) {
        const result = await createSeries({
          variables: {
            input: {
              title: data.newSeriesTitle.trim(),
              imageUrl: data.newSeriesImageUrl?.trim() || null,
            },
          },
        })
        seriesId = result.data.createSeries.id
      }

      const input = {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        seriesId: seriesId || null,
        visibility: data.visibility as any,
        sessionType: data.sessionType as any,
        videoCallUrl: data.videoCallUrl || null,
        imageUrl: data.imageUrl || null,
        scripturePassages: data.scripturePassages.map(p => ({
          book: p.book,
          chapter: p.chapter,
          verseStart: p.verseStart,
          verseEnd: p.verseEnd || null,
          content: '',
          note: p.note || null,
        })),
      }

      if (session) {
        await updateSession({
          variables: {
            id: session.id,
            input: {
              title: input.title,
              description: input.description,
              startDate: input.startDate,
              endDate: input.endDate,
              seriesId: input.seriesId,
              visibility: input.visibility as any,
              sessionType: input.sessionType as any,
              videoCallUrl: input.videoCallUrl,
              imageUrl: input.imageUrl,
            }
          },
        })
        addToast({
          type: 'success',
          message: 'Session updated successfully',
          description: 'Your study session has been updated.',
        })
      } else {
        await createSession({
          variables: { input },
        })
        addToast({
          type: 'success',
          message: 'Session created successfully',
          description: 'Your new study session is ready to go!',
        })
      }
      reset()
      onSuccess?.()
    } catch (err) {
      console.error('Error saving session:', err)
      addToast({
        type: 'error',
        message: session ? 'Failed to update session' : 'Failed to create session',
        description: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      })
    }
  }

  const addPassage = () => {
    append({
      book: '',
      chapter: 1,
      verseStart: 1,
      verseEnd: null,
      content: '',
      note: '',
    })
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            id="startDate"
            type="date"
            {...register('startDate')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            id="endDate"
            type="date"
            {...register('endDate')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="seriesId" className="block text-sm font-medium text-gray-700">
          Series (Optional)
        </label>
        <div className="flex gap-2">
          {!showNewSeriesInput ? (
            <>
              <select
                id="seriesId"
                {...register('seriesId')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option value="">No series (standalone session)</option>
                {seriesData?.mySeries?.map((series: any) => (
                  <option key={series.id} value={series.id}>{series.title}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewSeriesInput(true)}
                className="mt-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm whitespace-nowrap"
              >
                + New Series
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2 flex-1">
                <input
                  type="text"
                  {...register('newSeriesTitle')}
                  placeholder="Enter new series title"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    {...register('newSeriesImageUrl')}
                    placeholder="Enter series image URL or upload"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <label className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap text-sm">
                    {uploadingSeriesImage ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingSeriesImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, 'newSeriesImageUrl')
                      }}
                    />
                  </label>
                </div>
                {watch('newSeriesImageUrl') && (
                  <img
                    src={watch('newSeriesImageUrl') || ''}
                    alt="Series preview"
                    className="h-24 w-24 object-cover rounded-md border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowNewSeriesInput(false)
                  setValue('newSeriesTitle', '')
                  setValue('newSeriesImageUrl', '')
                }}
                className="mt-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm whitespace-nowrap"
              >
                Cancel
              </button>
            </>
          )}
        </div>
        {showNewSeriesInput && (
          <p className="mt-1 text-xs text-gray-500">
            Creating a new series will group related study sessions together.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
          Session Visibility
        </label>
        <select
          id="visibility"
          {...register('visibility')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
        >
          <option value="PUBLIC">Public - Anyone can join</option>
          <option value="PRIVATE">Private - Join by invitation only</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Private sessions require you to send join requests to specific members.
        </p>
        {errors.visibility && <p className="text-red-500 text-sm">{errors.visibility.message}</p>}
      </div>

      {/* Session Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Study Session Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scripture-Based Option */}
          <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            watch('sessionType') === 'SCRIPTURE_BASED'
              ? 'border-blue-600 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-blue-300 bg-white'
          }`}>
            <input
              type="radio"
              value="SCRIPTURE_BASED"
              {...register('sessionType')}
              className="sr-only"
            />
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                watch('sessionType') === 'SCRIPTURE_BASED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${
                  watch('sessionType') === 'SCRIPTURE_BASED' ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  Scripture-Based
                </h4>
                <p className="text-sm text-gray-600">
                  Study specific books of the Bible chapter by chapter or verse by verse
                </p>
              </div>
            </div>
          </label>

          {/* Topic-Based Option */}
          <label className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            watch('sessionType') === 'TOPIC_BASED'
              ? 'border-purple-600 bg-purple-50 shadow-md'
              : 'border-gray-200 hover:border-purple-300 bg-white'
          }`}>
            <input
              type="radio"
              value="TOPIC_BASED"
              {...register('sessionType')}
              className="sr-only"
            />
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                watch('sessionType') === 'TOPIC_BASED'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${
                  watch('sessionType') === 'TOPIC_BASED' ? 'text-purple-900' : 'text-gray-900'
                }`}>
                  Topic-Based
                </h4>
                <p className="text-sm text-gray-600">
                  Explore biblical themes like prayer, faith, or relationships across different passages
                </p>
              </div>
            </div>
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          This helps participants find sessions that match their study preferences
        </p>
        {errors.sessionType && <p className="text-red-500 text-sm mt-1">{errors.sessionType.message}</p>}
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

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Session Image (Optional)
        </label>

        {watch('imageUrl') ? (
          <div className="relative group">
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
              <img
                src={watch('imageUrl') || ''}
                alt="Session preview"
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="150" dx="120"%3EImage not found%3C/text%3E%3C/svg%3E'
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer font-medium shadow-lg flex items-center gap-2 transition-smooth">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingSessionImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'imageUrl')
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setValue('imageUrl', '')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-lg flex items-center gap-2 transition-smooth"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
            {uploadingSessionImage && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Uploading...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center justify-center">
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium shadow-sm transition-smooth flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {uploadingSessionImage ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingSessionImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'imageUrl')
                  }}
                />
              </label>
              <span className="text-sm text-gray-500">or</span>
              <input
                id="imageUrl"
                type="text"
                {...register('imageUrl')}
                placeholder="Enter image URL"
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
        {errors.imageUrl && <p className="text-red-500 text-sm mt-2">{errors.imageUrl.message}</p>}
      </div>

      {/* Scripture Passages */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scripture Passages</h3>
          <button
            type="button"
            onClick={addPassage}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            + Add Another Passage
          </button>
        </div>

        {fields.map((field, index) => (
          <ScripturePassageField
            key={field.id}
            index={index}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            onRemove={fields.length > 1 ? () => remove(index) : undefined}
          />
        ))}

        {errors.scripturePassages && (
          <p className="text-red-500 text-sm mt-2">{errors.scripturePassages.message}</p>
        )}

        <p className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
          ℹ️ Scripture content will be automatically fetched from the Bible API when participants view this study session.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity"
      >
        {isSubmitting && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isSubmitting ? (session ? 'Updating...' : 'Creating...') : (session ? 'Update Study Session' : 'Create Study Session')}
      </button>
    </form>
  )
}

interface ScripturePassageFieldProps {
  index: number
  register: any
  setValue: any
  watch: any
  errors: any
  onRemove?: () => void
}

function ScripturePassageField({ index, register, setValue, watch, errors, onRemove }: ScripturePassageFieldProps) {
  const [chapters, setChapters] = useState<number[]>([])
  const [verses, setVerses] = useState<number[]>([])

  const watchedBook = watch(`scripturePassages.${index}.book`)
  const watchedChapter = watch(`scripturePassages.${index}.chapter`)

  // Update chapters and verses when book changes
  useEffect(() => {
    if (watchedBook) {
      const chapterCount = getChapterCount(watchedBook)
      const chapterArray = Array.from({ length: chapterCount }, (_, i) => i + 1)
      setChapters(chapterArray)

      // Reset to chapter 1 and auto-set end verse
      setValue(`scripturePassages.${index}.chapter`, 1)
      setValue(`scripturePassages.${index}.verseStart`, 1)

      const lastVerse = getLastVerseInBook(watchedBook)
      setValue(`scripturePassages.${index}.verseEnd`, lastVerse)
    }
  }, [watchedBook, setValue, index])

  // Update verses when chapter changes
  useEffect(() => {
    if (watchedBook && watchedChapter) {
      const verseCount = getVerseCount(watchedBook, watchedChapter)
      const verseArray = Array.from({ length: verseCount }, (_, i) => i + 1)
      setVerses(verseArray)
    }
  }, [watchedBook, watchedChapter])

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-700">Passage {index + 1}</h4>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Book</label>
          <select
            {...register(`scripturePassages.${index}.book`)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
          >
            <option value="">Select a book...</option>
            {BIBLE_BOOKS.map(book => (
              <option key={book.name} value={book.name}>{book.name}</option>
            ))}
          </select>
          {errors.scripturePassages?.[index]?.book && (
            <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[index].book.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Chapter</label>
          <select
            {...register(`scripturePassages.${index}.chapter`, { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            disabled={!watchedBook}
          >
            <option value="">Select chapter...</option>
            {chapters.map(ch => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
          {errors.scripturePassages?.[index]?.chapter && (
            <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[index].chapter.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Verse</label>
          <select
            {...register(`scripturePassages.${index}.verseStart`, { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            disabled={!watchedChapter}
          >
            <option value="">Select verse...</option>
            {verses.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          {errors.scripturePassages?.[index]?.verseStart && (
            <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[index].verseStart.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Verse (Optional)</label>
          <select
            {...register(`scripturePassages.${index}.verseEnd`, { valueAsNumber: true, required: false })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            disabled={!watchedChapter}
          >
            <option value="">Same as start verse...</option>
            {verses.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          {errors.scripturePassages?.[index]?.verseEnd && (
            <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[index].verseEnd.message}</p>
          )}
        </div>
      </div>

      {/* Note field */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Leader's Note (Optional)
        </label>
        <textarea
          {...register(`scripturePassages.${index}.note`)}
          rows={3}
          placeholder="Add a note about the point you're trying to make with this passage..."
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          This note will appear above the scripture passage to help participants understand your teaching point.
        </p>
        {errors.scripturePassages?.[index]?.note && (
          <p className="text-red-500 text-sm mt-1">{errors.scripturePassages[index].note.message}</p>
        )}
      </div>
    </div>
  )
}
