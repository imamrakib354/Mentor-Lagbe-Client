import "server-only"

import { authFetch } from "@/lib/core/server"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { PublicTuition } from "@/lib/types/tuition"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000"

// Fetches public featured listings, including tutor names for signed-in users.
export async function getNewTuitions(): Promise<(PublicTuition & { tutorName?: string })[]> {
  const user = await getCurrentUser()
  const url = `${API_BASE_URL}/new-tuitions`
  const response = user && !user.roleSelectionRequired
    ? await authFetch(url)
    : await fetch(url, { cache: "no-store" })
  if (!response.ok) throw new Error("Could not load featured tuitions.")
  return response.json()
}

// Fetches public aggregate counts and the most-applied subjects.
export async function getPlatformStats(): Promise<{
  topSubjects: { subject: string; applicationCount: number }[]
  students: number
  tutors: number
  tuitions: number
}> {
  const response = await fetch(`${API_BASE_URL}/platform-stats`, { cache: "no-store" })
  if (!response.ok) throw new Error("Could not load platform statistics.")
  return response.json()
}
