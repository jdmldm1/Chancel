import { Skeleton } from '@/components/ui/skeleton'

export function SessionDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start gap-6">
          <div className="flex gap-6 flex-1">
            {/* Image placeholder */}
            <Skeleton className="w-48 h-48 rounded-lg flex-shrink-0" />

            <div className="flex-1 space-y-4">
              {/* Badge */}
              <Skeleton className="h-7 w-36 rounded-full" />

              {/* Title */}
              <Skeleton className="h-10 w-3/4" />

              {/* Series info */}
              <Skeleton className="h-5 w-48" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Metadata */}
              <div className="flex gap-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>

      {/* Scripture Passages Section */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />

        {/* Passage cards */}
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>

      {/* Participants Section */}
      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
