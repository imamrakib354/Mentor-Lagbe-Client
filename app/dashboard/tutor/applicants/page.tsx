import { getTutorApplications } from "@/lib/actions/application"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { Application, ApplicationStatus } from "@/lib/types/application"
import { ApplicantsTable } from "./_components/applicants-table"

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>
}) {
  const user = await getCurrentUser()
  if (user?.role !== "tutor") {
    return <p className="rounded-2xl bg-white p-6 text-slate-600">Sign in as a tutor to view applicants.</p>
  }

  const { status: requestedStatus } = await searchParams
  const status = requestedStatus === "accepted" || requestedStatus === "rejected" || requestedStatus === "all"
    ? requestedStatus
    : "pending"
  let allApplications: Application[]
  let applications: Application[]

  try {
    allApplications = await getTutorApplications(user.id)
    applications = status === "all"
      ? allApplications
      : await getTutorApplications(user.id, status as ApplicationStatus)
  } catch {
    return <p className="rounded-2xl bg-white p-6 text-red-600">Could not load applicants. Please try again.</p>
  }

  return <ApplicantsTable applications={applications} allApplications={allApplications} status={status} />
}
