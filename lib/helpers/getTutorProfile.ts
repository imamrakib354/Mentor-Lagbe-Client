import "server-only"

import { authFetch } from "@/lib/core/server"
import type { TutorDetails } from "@/lib/types/tuition"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

// Fetches the mentor profile for a public tuition using the signed-in session.
export async function getTutorProfile(tuitionId: string): Promise<TutorDetails> {
  const response = await authFetch(
    `${API_BASE_URL}/tuitions/${encodeURIComponent(tuitionId)}/mentor`
  )
  if (!response.ok) throw new Error("Could not load the mentor profile.")
  return response.json()
}
