import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading account page"
      className="w-full max-w-7xl"
    >
      <span className="sr-only">Loading account page, please wait.</span>
      <div
        aria-hidden="true"
        className="grid overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-blue-900/15 lg:grid-cols-2 [&_[data-slot=skeleton]]:bg-blue-100 motion-reduce:[&_[data-slot=skeleton]]:animate-none"
      >
        <Skeleton className="hidden min-h-176 rounded-none lg:block" />
        <div className="space-y-6 px-5 py-8 sm:p-10 xl:px-14">
          <Skeleton className="h-14 w-56 max-w-full rounded-xl" />
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-4 w-full" />
          {[0, 1, 2].map((field) => (
            <div key={field} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
