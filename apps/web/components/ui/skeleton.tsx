import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        "shimmer",
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="p-6 border-2 border-gray-100 rounded-xl bg-white space-y-4">
      <div className="flex gap-4">
        <Skeleton className="w-32 h-32 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-4 pt-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full", className)} />
}

function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-32", className)} />
}

function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />
}

function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 w-20 rounded-full", className)} />
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonBadge,
}
