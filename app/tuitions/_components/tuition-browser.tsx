"use client"

import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { TuitionCard } from "./tuition-card"
import {
  TuitionPagination,
  type TuitionFilters,
} from "./tuition-pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  classLevels,
  tuitionSubjectsByClassLevel,
} from "@/lib/data/tuition-options"
import type { Tuition, TuitionListing } from "@/lib/types/tuition"

type TuitionBrowserProps = {
  listing: TuitionListing
  filters: TuitionFilters
  error?: string
}

const subjects = Array.from(
  new Set(Object.values(tuitionSubjectsByClassLevel).flat())
).sort()

function createHref(filters: TuitionFilters) {
  const params = new URLSearchParams()

  for (const [name, value] of Object.entries(filters)) {
    if (value) params.set(name, value)
  }

  const query = params.toString()
  return query ? `/tuitions?${query}` : "/tuitions"
}

export function TuitionBrowser({
  listing,
  filters,
  error,
}: TuitionBrowserProps) {
  const router = useRouter()
  const formKey = JSON.stringify(filters)

  function updateFilter(name: keyof TuitionFilters, value: string) {
    router.push(
      createHref({
        ...filters,
        [name]: value,
      })
    )
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    updateFilter("search", String(formData.get("search") || "").trim())
  }

  return (
    <div className="pb-8">
      <section className="rounded-3xl bg-linear-to-b from-blue-50 to-[#e8f1ff] px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-blue-100 bg-white/70 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            Tuition marketplace
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 sm:text-5xl">
            Browse All Tuitions
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Explore approved tuition posts and find a mentor who fits your
            learning goals.
          </p>
        </div>

        <form
          key={formKey}
          onSubmit={handleSearch}
          className="mt-8 w-full rounded-2xl border border-blue-100 bg-white p-3 shadow-lg shadow-blue-950/5"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
              />
              <Input
                name="search"
                defaultValue={filters.search}
                placeholder="Search by tuition title or subject..."
                className="h-12 border-blue-100 bg-white pl-10 text-blue-950 focus-visible:border-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="h-12 bg-blue-600 px-7 text-white hover:bg-blue-700"
            >
              <Search aria-hidden="true" />
              Search
            </Button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <select
              defaultValue={filters.subject}
              onChange={(event) => updateFilter("subject", event.target.value)}
              aria-label="Filter by subject"
              className="h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20"
            >
              <option value="">All subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              defaultValue={filters.classLevel}
              onChange={(event) =>
                updateFilter("classLevel", event.target.value)
              }
              aria-label="Filter by class level"
              className="h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20"
            >
              <option value="">All levels</option>
              {classLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              defaultValue={filters.mode}
              onChange={(event) => updateFilter("mode", event.target.value)}
              aria-label="Filter by tuition mode"
              className="h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20"
            >
              <option value="">All modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>

            <select
              defaultValue={filters.sort}
              onChange={(event) =>
                updateFilter(
                  "sort",
                  event.target.value === "oldest" ? "oldest" : "newest"
                )
              }
              aria-label="Sort tuitions"
              className="h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/tuitions")}
              className="h-11 border-blue-100 bg-white text-blue-700 hover:bg-blue-50"
            >
              Reset
            </Button>
          </div>
        </form>
      </section>

      <section className="pt-8">
        <p className="text-sm text-slate-600">
          {listing.total === 0
            ? "No tuitions found"
            : `Showing ${listing.total} tuition${listing.total === 1 ? "" : "s"}`}
        </p>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-10 text-center text-sm text-red-700">
            {error}
          </div>
        ) : listing.tuitions.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-blue-100 bg-white px-5 py-14 text-center shadow-sm shadow-blue-950/5">
            <h2 className="text-lg font-semibold text-blue-950">
              No matching tuitions found
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Try changing your search or clearing the filters.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/tuitions")}
              className="mt-5 border-blue-100 text-blue-700 hover:bg-blue-50"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listing.tuitions.map((tuition: Tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        )}

        <TuitionPagination
          filters={filters}
          page={listing.page}
          pageSize={listing.pageSize}
          total={listing.total}
          totalPages={listing.totalPages}
        />
      </section>
    </div>
  )
}
