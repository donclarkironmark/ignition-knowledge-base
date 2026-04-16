import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

/**
 * Branded skeleton/shimmer placeholder (S-57)
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-lg bg-[#e5e5e5]',
        className
      )}
    />
  );
}

/**
 * Document page skeleton layout
 */
export function DocumentSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <Skeleton className="h-4 w-48" />
      <div className="mt-4 flex gap-8">
        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <div className="mt-6 rounded-xl bg-white p-8 shadow-sm">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Homepage skeleton layout
 */
export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-2 h-5 w-96" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
