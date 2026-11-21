import Link from "next/link"

import { getStudentApplications } from "@/lib/actions/application"
import { getSavedTuitions } from "@/lib/actions/saved-tuitions"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { ApplicationListing } from "@/lib/types/application"
import type { SavedTuition } from "@/lib/types/saved-tuition"
import { ApplicationsTable } from "./_components/applications-table"

export default async function MyApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string | string[]; status?: string | string[] }>
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== "student") {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-8">
        <h1 className="text-2xl font-bold text-blue-950">My Applications</h1>
        <p className="mt-3 text-slate-600">Sign in with a student account to view your applications.</p>
        {!user && <Link href="/sign-in" className="mt-4 inline-block font-semibold text-blue-600">Sign in</Link>}
      </div>
    )
  }

  const params = await searchParams
  const search = typeof params.search === "string" ? params.search.trim() : ""
  const status = params.status === "pending" || params.status === "accepted" || params.status === "rejected" ? params.status : "all"
  const query = new URLSearchParams()
  if (search) query.set("search", search)
  if (status !== "all") query.set("status", status)

  let listing: ApplicationListing
  let saved: SavedTuition[]
  try {
    ;[listing, saved] = await Promise.all([
      getStudentApplications(user.id, query.toString()),
      getSavedTuitions(user.id),
    ])
  } catch {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8">
        <h1 className="text-2xl font-bold text-blue-950">My Applications</h1>
        <p className="mt-3 text-red-600">Could not load your applications. Please refresh and try again.</p>
      </div>
    )
  }

  return <ApplicationsTable listing={listing} savedIds={saved.map((item) => item.tuitionId)} studentId={user.id} search={search} status={status} />
}
