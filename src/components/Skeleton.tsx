// src/components/Skeleton.tsx

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-brand-100/60 rounded-md ${className}`}
    />
  );
}

export function OrderCardSkeleton() {
  return (
    <li className="bg-white border border-brand-100 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-40 mb-2" />
      <Skeleton className="h-3 w-32 mb-3" />
      <Skeleton className="h-16 w-full mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>
    </li>
  );
}

export function ProductRowSkeleton() {
  return (
    <li className="bg-white border border-brand-100 rounded-2xl p-3">
      <div className="flex gap-3">
        <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </li>
  );
}