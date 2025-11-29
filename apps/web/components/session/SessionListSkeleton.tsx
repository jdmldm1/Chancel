import { Skeleton } from '@/components/ui/skeleton'

export function SessionCardSkeleton() {
  return (
    <div className="p-6 border-2 border-gray-100 rounded-xl bg-white space-y-4 animate-fade-in">
      <div className="flex gap-4">
        {/* Image skeleton */}
        <Skeleton className="w-32 h-32 rounded-md flex-shrink-0" />

        <div className="flex-1 space-y-3">
          {/* Session type badge */}
          <Skeleton className="h-6 w-28 rounded-full" />

          {/* Title */}
          <Skeleton className="h-6 w-3/4" />

          {/* Description lines */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Metadata section */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SessionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  )
}
