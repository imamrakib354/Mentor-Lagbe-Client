import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function SectionHeadingSkeleton() {
  return (
    <div className="mb-8 space-y-3">
      <Skeleton className="h-3 w-40 max-w-full" />
      <Skeleton className="h-8 w-72 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  )
}

export default function Loading() {
  return (
    <div role="status" aria-label="Loading homepage" aria-busy="true">
      <span className="sr-only">Loading homepage, please wait.</span>

      <div
        aria-hidden="true"
        className="space-y-10 sm:space-y-12 [&_[data-slot=skeleton]]:bg-blue-200/70 motion-reduce:[&_[data-slot=skeleton]]:animate-none"
      >
        {/* Hero */}
        <div className="grid overflow-hidden rounded-3xl border border-blue-100 bg-blue-50 lg:min-h-144 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-5 pt-10 pb-8 sm:px-10 sm:pt-14 lg:py-14 lg:pr-0 lg:pl-12 xl:pl-16">
            <Skeleton className="h-9 w-64 max-w-full rounded-full" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-10 w-11/12 sm:h-14" />
              <Skeleton className="h-10 w-full sm:h-14" />
            </div>
            <div className="mt-5 max-w-xl space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="mt-7 h-12 w-52 max-w-full rounded-xl" />
            <div className="mt-10 flex flex-wrap gap-5">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-5 w-32" />
              ))}
            </div>
          </div>
          <Skeleton className="mx-auto mt-4 h-96 w-4/5 max-w-md rounded-t-[6rem] rounded-b-none sm:h-112 lg:mt-6 lg:h-auto lg:self-stretch" />
        </div>

        {/* Featured tuitions */}
        <div className="rounded-3xl border border-blue-200 bg-white px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeadingSkeleton />
            <Skeleton className="mb-5 h-10 w-48 max-w-full rounded-xl" />
          </div>
          <Skeleton className="mb-5 h-3 w-80 max-w-full" />
          <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Card
                key={index}
                className="min-h-80 rounded-2xl border border-blue-100 bg-white py-6 ring-0"
              >
                <CardContent className="flex h-full flex-col px-5 sm:px-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <Skeleton className="size-12 rounded-2xl" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-5/6" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[0, 1].map((item) => (
                      <div key={item} className="space-y-2">
                        <Skeleton className="h-3 w-14" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="mt-5 mb-5 h-7 w-32" />
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 pt-4">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-24 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tutor and student plans */}
        <div className="rounded-3xl border border-blue-200 bg-linear-to-br from-blue-100 to-sky-100 px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10">
          <SectionHeadingSkeleton />
          <div className="grid gap-6 xl:grid-cols-2">
            {[0, 1].map((audience) => (
              <div
                key={audience}
                className="rounded-2xl border border-blue-200/70 bg-white/45 p-4 sm:p-5"
              >
                <div className="mb-5 flex items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-6 w-36 max-w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[0, 1].map((plan) => (
                    <Card
                      key={plan}
                      className="min-h-92 rounded-2xl border border-blue-100 bg-white py-6 ring-0"
                    >
                      <CardContent className="flex h-full flex-col px-5">
                        <Skeleton className="h-6 w-28 max-w-full" />
                        <Skeleton className="mt-4 h-10 w-24" />
                        <Skeleton className="mt-3 h-3 w-36 max-w-full" />
                        <div className="my-5 space-y-4 border-t border-blue-100 pt-5">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="mt-auto h-11 w-full rounded-xl" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="mx-auto mt-5 h-3 w-96 max-w-full" />
        </div>

        {/* How it works */}
        <div className="rounded-3xl border border-blue-200 bg-white px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10">
          <SectionHeadingSkeleton />
          <div className="grid gap-6 xl:grid-cols-2">
            {[0, 1].map((audience) => (
              <Card
                key={audience}
                className="gap-0 rounded-2xl border border-blue-100 bg-white py-0 ring-0"
              >
                <div className="flex items-center gap-3 border-b border-blue-100 bg-blue-50/80 p-5 sm:p-6">
                  <Skeleton className="size-11 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-5 w-32 max-w-full" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>
                </div>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-7 p-5 sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                  {Array.from({ length: 4 }, (_, step) => (
                    <div key={step} className="space-y-3">
                      <Skeleton className="mx-auto mb-4 size-14 rounded-full" />
                      <Skeleton className="mx-auto h-4 w-20 max-w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="mx-auto h-3 w-4/5" />
                      <Skeleton className="mx-auto h-3 w-3/5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subjects, statistics, and testimonials */}
        <div className="rounded-3xl border border-blue-200 bg-sky-100 px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10">
          <SectionHeadingSkeleton />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_0.9fr_1.15fr]">
            <Card className="rounded-2xl border border-blue-100 bg-white py-6 ring-0">
              <CardContent className="px-5 sm:px-6">
                <Skeleton className="h-6 w-32 max-w-full" />
                <Skeleton className="mt-3 h-4 w-full" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }, (_, subject) => (
                    <Skeleton key={subject} className="h-14 rounded-xl" />
                  ))}
                </div>
                <Skeleton className="mt-5 h-3 w-full" />
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-blue-100 bg-white py-6 ring-0">
              <CardContent className="px-5 sm:px-6">
                <Skeleton className="h-6 w-44 max-w-full" />
                <Skeleton className="mt-3 h-4 w-full" />
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }, (_, stat) => (
                    <Skeleton key={stat} className="h-24 rounded-xl" />
                  ))}
                </div>
                <Skeleton className="mt-5 h-3 w-full" />
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-blue-100 bg-white py-6 ring-0 md:col-span-2 xl:col-span-1">
              <CardContent className="px-5 sm:px-6">
                <Skeleton className="h-6 w-36 max-w-full" />
                <Skeleton className="mt-3 h-4 w-4/5" />
                <div className="mt-6 space-y-3">
                  {[0, 1].map((testimonial) => (
                    <div
                      key={testimonial}
                      className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4"
                    >
                      <Skeleton className="size-4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex items-center gap-2 pt-2">
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="h-3 w-28 max-w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
