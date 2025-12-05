'use client'

import { useState } from 'react'
import { useGraphQLQuery } from '@/lib/graphql-client-new'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const BIBLE_BOOKS_QUERY = `
  query BibleBooks {
    bibleBooks {
      name
      number
      chapterCount
    }
  }
`

const BIBLE_PASSAGES_QUERY = `
  query BiblePassages($book: String!, $chapter: Int!) {
    biblePassages(book: $book, chapter: $chapter) {
      id
      book
      bookNumber
      chapter
      verseStart
      verseEnd
      content
    }
  }
`

const SEARCH_BIBLE_QUERY = `
  query SearchBible($query: String!) {
    searchBible(query: $query) {
      id
      book
      bookNumber
      chapter
      verseStart
      verseEnd
      content
    }
  }
`

interface BibleBook {
  name: string
  number: number
  chapterCount: number
}

interface BiblePassage {
  id: string
  book: string
  bookNumber: number
  chapter: number
  verseStart: number
  verseEnd?: number
  content: string
}

export default function BrowseBiblePage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'browse' | 'search'>('browse')

  const { data: booksData, loading: booksLoading } = useGraphQLQuery<{
    bibleBooks: BibleBook[]
  }>(BIBLE_BOOKS_QUERY)

  const { data: passagesData, loading: passagesLoading } = useGraphQLQuery<{
    biblePassages: BiblePassage[]
  }>(BIBLE_PASSAGES_QUERY, {
    variables: { book: selectedBook || '', chapter: selectedChapter || 1 },
    skip: !selectedBook || !selectedChapter,
  })

  const { data: searchData, loading: searchLoading } = useGraphQLQuery<{
    searchBible: BiblePassage[]
  }>(SEARCH_BIBLE_QUERY, {
    variables: { query: searchQuery },
    skip: !searchQuery || searchQuery.length < 2,
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const books: BibleBook[] = booksData?.bibleBooks || []
  const passages: BiblePassage[] = activeTab === 'browse'
    ? passagesData?.biblePassages || []
    : searchData?.searchBible || []

  const selectedBookData = books.find(b => b.name === selectedBook)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Browse Bible
          </h1>
          <p className="text-gray-600">
            Search and select scripture passages for your study sessions
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse by Book
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'search'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Search Scripture
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Book/Chapter Selection or Search */}
          <div className="lg:col-span-4 space-y-4">
            {activeTab === 'browse' ? (
              <>
                {/* Book Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Book</h3>
                  {booksLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : books.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <p className="mb-2">No Bible data available</p>
                      <p className="text-xs">Please import Bible data using the seed script</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-1">
                      {books.map((book) => (
                        <button
                          key={book.number}
                          onClick={() => {
                            setSelectedBook(book.name)
                            setSelectedChapter(1)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedBook === book.name
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {book.name}
                          <span className="text-xs text-gray-500 ml-2">
                            ({book.chapterCount} chapters)
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chapter Selection */}
                {selectedBookData && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Select Chapter ({selectedBook})
                    </h3>
                    <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                      {Array.from({ length: selectedBookData.chapterCount }, (_, i) => i + 1).map((chapter) => (
                        <button
                          key={chapter}
                          onClick={() => setSelectedChapter(chapter)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedChapter === chapter
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {chapter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Scripture</h3>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter search term..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter at least 2 characters to search
                </p>
              </div>
            )}
          </div>

          {/* Main Content - Scripture Display */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'browse' && (!selectedBook || !selectedChapter) ? (
                <div className="text-center py-16 text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-1">Select a book and chapter</p>
                  <p className="text-sm">Choose from the sidebar to view scripture passages</p>
                </div>
              ) : activeTab === 'search' && searchQuery.length < 2 ? (
                <div className="text-center py-16 text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-1">Search the Bible</p>
                  <p className="text-sm">Enter a search term to find passages</p>
                </div>
              ) : (passagesLoading || searchLoading) ? (
                <div className="flex justify-center py-16">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : passages.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg font-medium mb-1">No passages found</p>
                  <p className="text-sm">
                    {activeTab === 'search'
                      ? 'Try a different search term'
                      : 'This chapter may not be in the library yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'browse'
                        ? `${selectedBook} ${selectedChapter}`
                        : `Search Results (${passages.length})`}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {passages.map((passage) => (
                      <div
                        key={passage.id}
                        className="group relative border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-blue-600 mb-1">
                              {passage.book} {passage.chapter}:
                              {passage.verseStart}
                              {passage.verseEnd && passage.verseEnd !== passage.verseStart
                                ? `-${passage.verseEnd}`
                                : ''}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{passage.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
