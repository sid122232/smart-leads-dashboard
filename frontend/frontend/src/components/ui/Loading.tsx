import { cn } from '@/utils';

export const Spinner = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'size-5 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600',
      className
    )}
  />
);

export const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner className="size-8" />
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 dark:border-white/10">
    <div className="size-10 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
    </div>
    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);