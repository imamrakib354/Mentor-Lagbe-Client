import Link from "next/link"

import { getSavedTuitions } from "@/lib/actions/saved-tuitions"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { SavedTuition } from "@/lib/types/saved-tuition"
import { SavedTuitionCard } from "./_components/saved-tuition-card"

export default async function SavedTuitionsPage() {
  const user = await getCurrentUser()
  if (user?.role !== "student") {
    return <p className="rounded-2xl bg-white p-6 text-slate-600">Sign in as a student to view saved tuitions.</p>
  }

  let saved: SavedTuition[]
  try {
    saved = await getSavedTuitions(user.id)
  } catch {
    return <p className="rounded-2xl bg-white p-6 text-red-600">Could not load saved tuitions. Please try again.</p>
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-blue-100 bg-gradient-to-r from-white to-blue-100 p-6 sm:p-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Saved list</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">Saved Tuitions</h1>
        <p className="mt-2 text-sm text-slate-600">Review the tuition opportunities you bookmarked for later.</p>
      </header>
      {saved.length === 0 ? (
        <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center">
          <h2 className="font-semibold text-blue-950">No saved tuitions yet</h2>
          <p className="mt-2 text-sm text-slate-500">Save a tuition from your applications to see it here.</p>
          <Link href="/dashboard/student/my-applications" className="mt-4 inline-block font-semibold text-blue-600">My applications</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {saved.map((item) => <SavedTuitionCard key={item._id} saved={item} />)}
        </div>
      )}
    </div>
  )
}
