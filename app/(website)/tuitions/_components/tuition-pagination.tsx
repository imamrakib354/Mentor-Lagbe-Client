import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type TuitionFilters = {
  search: string
  subject: string
  classLevel: string
  mode: string
  sort: "newest" | "oldest"
}

type TuitionPaginationProps = {
  filters: TuitionFilters
  page: number
  pageSize: number
  total: number
  totalPages: number
}

function getPageHref(filters: TuitionFilters, page: number) {
  const params = new URLSearchParams()

  for (const [name, value] of Object.entries(filters)) {
    if (value) params.set(name, value)
  }

  params.set("page", String(page))
  return `/tuitions?${params.toString()}`
}

export function TuitionPagination({
  filters,
  page,
  pageSize,
  total,
  totalPages,
}: TuitionPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <footer className="mt-10 flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={getPageHref(filters, page - 1)}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-700 hover:bg-blue-50"
            aria-label="Previous page"
          >
            <ChevronLeft aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-white text-slate-300"
          >
            <ChevronLeft aria-hidden="true" />
          </span>
        )}

        <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-blue-600 px-3 text-sm font-bold text-white">
          {page}
        </span>

        {page < totalPages ? (
          <Link
            href={getPageHref(filters, page + 1)}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-700 hover:bg-blue-50"
            aria-label="Next page"
          >
            <ChevronRight aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-white text-slate-300"
          >
            <ChevronRight aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Showing {from}–{to} of {total} tuitions · Page {page} of {totalPages}
      </p>
    </footer>
  )
}
