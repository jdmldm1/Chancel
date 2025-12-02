'use client'

import { useState } from 'react'
import { getScriptureInsight } from '@/lib/ollama-api'
import { Sparkles, BookOpen, History, Heart, Lightbulb, X, Loader2 } from 'lucide-react'

interface AIInsightsModalProps {
  isOpen: boolean
  onClose: () => void
  scriptureText: string
  scriptureReference: string
}

type InsightType = 'summarize' | 'historical' | 'nature-of-god' | 'application'

interface InsightOption {
  type: InsightType
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

const insightOptions: InsightOption[] = [
  {
    type: 'summarize',
    label: 'Summarize',
    description: 'Get a brief summary of the main message',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'blue',
  },
  {
    type: 'historical',
    label: 'Historical Context',
    description: 'Learn about the historical and archaeological background',
    icon: <History className="w-5 h-5" />,
    color: 'amber',
  },
  {
    type: 'nature-of-god',
    label: 'Nature of God',
    description: 'Discover what this reveals about God\'s character',
    icon: <Heart className="w-5 h-5" />,
    color: 'purple',
  },
  {
    type: 'application',
    label: 'Life Application',
    description: 'Find practical ways to apply this to your life',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'green',
  },
]

export default function AIInsightsModal({
  isOpen,
  onClose,
  scriptureText,
  scriptureReference,
}: AIInsightsModalProps) {
  const [selectedInsight, setSelectedInsight] = useState<InsightType | null>(null)
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleGetInsight = async (type: InsightType) => {
    setSelectedInsight(type)
    setLoading(true)
    setError(null)
    setResponse('')

    try {
      const insight = await getScriptureInsight(scriptureText, scriptureReference, type)
      setResponse(insight)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI insight')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedInsight(null)
    setResponse('')
    setError(null)
    onClose()
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
      amber: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
      green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">AI Scripture Insights</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Reference */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-sm font-semibold text-blue-900">{scriptureReference}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedInsight ? (
            /* Insight Options */
            <div className="space-y-3">
              <p className="text-gray-600 mb-4">
                Choose an AI-powered insight for this scripture passage:
              </p>
              {insightOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleGetInsight(option.type)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getColorClasses(option.color)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{option.label}</h3>
                      <p className="text-sm opacity-80">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Response Display */
            <div className="space-y-4">
              {/* Selected Insight Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  {insightOptions.find(o => o.type === selectedInsight)?.icon}
                  <h3 className="font-semibold text-gray-900">
                    {insightOptions.find(o => o.type === selectedInsight)?.label}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedInsight(null)
                    setResponse('')
                    setError(null)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Choose Different Insight
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-gray-600">Getting AI insights...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {response}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
