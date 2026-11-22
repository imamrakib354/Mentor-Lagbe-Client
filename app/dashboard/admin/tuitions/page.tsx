import { getAdminTuitions } from "@/lib/actions/admin"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { classLevels, tuitionSubjectsByClassLevel, type ClassLevel } from "@/lib/data/tuition-options"
import type { Tuition } from "@/lib/types/tuition"
import { TuitionsTable } from "./_components/tuitions-table"

type SearchParams = Record<string, string | string[] | undefined>

export default async function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const user = await getCurrentUser()
  if (user?.role !== "admin") {
    return <p className="dashboard-surface rounded-2xl border p-6 text-slate-600">Sign in as an admin to manage tuitions.</p>
  }

  const search = await searchParams
  const value = (name: string) => typeof search[name] === "string" ? search[name] as string : ""
  const level = value("classLevel")
  const classLevel = classLevels.includes(level as ClassLevel) ? level : ""
  const subject = value("subject")
  const validSubjects: readonly string[] = classLevel
    ? tuitionSubjectsByClassLevel[classLevel as ClassLevel]
    : []
  const mode = value("mode")
  const status = value("approvalStatus")
  const filters = {
    classLevel,
    subject: validSubjects.includes(subject) ? subject : "",
    mode: mode === "Online" || mode === "Offline" ? mode : "",
    sort: value("sort") === "oldest" ? "oldest" : "newest",
    approvalStatus: status === "approved" || status === "rejected" || status === "all" ? status : "pending",
  }

  const params = new URLSearchParams()
  for (const name of ["classLevel", "subject", "mode", "sort"] as const) {
    if (filters[name]) params.set(name, filters[name])
  }

  let allTuitions: Tuition[]
  let tuitions: Tuition[]
  try {
    allTuitions = await getAdminTuitions(params.toString())
    if (filters.approvalStatus === "all") {
      tuitions = allTuitions
    } else {
      params.set("approvalStatus", filters.approvalStatus)
      tuitions = await getAdminTuitions(params.toString())
    }
  } catch {
    return <p className="dashboard-surface rounded-2xl border p-6 text-red-600">Could not load tuitions. Please try again.</p>
  }

  return <TuitionsTable tuitions={tuitions} allTuitions={allTuitions} filters={filters} />
}
