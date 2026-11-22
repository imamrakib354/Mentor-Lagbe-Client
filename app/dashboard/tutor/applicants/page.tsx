import { getTutorApplications } from "@/lib/actions/application"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { ApplicationListing } from "@/lib/types/application"
import { ApplicantsTable } from "./_components/applicants-table"

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; search?: string | string[] }>
}) {
  const user = await getCurrentUser()
  if (user?.role !== "tutor") {
    return <p className="dashboard-surface rounded-2xl border p-6 text-slate-600">Sign in as a tutor to view applicants.</p>
  }

  const { status: requestedStatus, search: requestedSearch } = await searchParams
  const search = typeof requestedSearch === "string" ? requestedSearch.trim() : ""
  const status = requestedStatus === "accepted" || requestedStatus === "rejected" || requestedStatus === "all"
    ? requestedStatus
    : "pending"
  const query = new URLSearchParams()
  if (search) query.set("search", search)
  if (status !== "all") query.set("status", status)
  let listing: ApplicationListing

  try {
    listing = await getTutorApplications(user.id, query.toString())
  } catch {
    return <p className="dashboard-surface rounded-2xl border p-6 text-red-600">Could not load applicants. Please try again.</p>
  }

  return <ApplicantsTable listing={listing} status={status} search={search} />
}
