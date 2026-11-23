import { TuitionBrowser } from "./_components/tuition-browser"
import { getPublicTuitions } from "@/lib/actions/tuitions"
import type { TuitionListing } from "@/lib/types/tuition"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Tuitions",
  description: "Search approved tuition listings by subject, class level and learning mode.",
}

type SearchParams = Record<string, string | string[] | undefined>

function getSearchValue(
  searchParams: SearchParams,
  name: string
) {
  const value = searchParams[name]
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

export default async function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const search = await searchParams
  const mode = getSearchValue(search, "mode")
  const sort: "newest" | "oldest" =
    getSearchValue(search, "sort") === "oldest" ? "oldest" : "newest"
  const filters = {
    search: getSearchValue(search, "search"),
    subject: getSearchValue(search, "subject"),
    classLevel: getSearchValue(search, "classLevel"),
    mode: mode === "Online" || mode === "Offline" ? mode : "",
    sort,
  }
  const params = new URLSearchParams()

  for (const [name, value] of Object.entries(filters)) {
    if (value) params.set(name, value)
  }

  const page = getSearchValue(search, "page")
  if (page) params.set("page", page)

  let listing: TuitionListing = {
    tuitions: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
  }
  let error = ""

  try {
    listing = await getPublicTuitions(params.toString())
  } catch {
    error = "We couldn't load tuitions. Please try again."
  }

  return <TuitionBrowser listing={listing} filters={filters} error={error} />
}
