import Link from "next/link"

import { getStudentApplications } from "@/lib/actions/application"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { Application } from "@/lib/types/application"
import { ApplicationsTable } from "./_components/applications-table"

export default async function MyApplicationsPage() {
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

  let applications: Application[]
  try {
    applications = await getStudentApplications(user.id)
  } catch {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8">
        <h1 className="text-2xl font-bold text-blue-950">My Applications</h1>
        <p className="mt-3 text-red-600">Could not load your applications. Please refresh and try again.</p>
      </div>
    )
  }

  return <ApplicationsTable applications={applications} />
}
