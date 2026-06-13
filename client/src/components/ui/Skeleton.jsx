import { cn } from '../../lib/utils'

export default function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-xl', className)} />
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-2 border border-white/6 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  )
}
