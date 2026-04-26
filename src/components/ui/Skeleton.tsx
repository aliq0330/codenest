import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function PostSkeleton() {
  return (
    <div className="border-b border-[#2e2e2e] p-4">
      <div className="flex gap-3">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-10 rounded" />
            <Skeleton className="h-4 w-10 rounded" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return <div>{Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)}</div>;
}

export function ProfileHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="px-4 pb-4">
        <Skeleton className="h-16 w-16 rounded-full -mt-8 border-4 border-[#0a0a0a]" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
      <Skeleton className="h-7 w-16 rounded-full" />
    </div>
  );
}
