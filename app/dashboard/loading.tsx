import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <Skeleton className="h-9 w-64 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-40 rounded-3xl" />)}
      </div>
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  )
}
