import type { SavedTuition } from "@/lib/types/saved-tuition"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

// Saves a tuition for a student or returns the existing bookmark.
export async function saveTuition(studentId: string, tuitionId: string) {
  const response = await fetch(`${API_BASE_URL}/saved-tuitions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ studentId, tuitionId }),
  })

  if (!response.ok) throw new Error("Could not save this tuition.")
  return response.json() as Promise<{ saved: boolean; alreadySaved: boolean }>
}

// Fetches a student's saved tuitions and their current tuition details.
export async function getSavedTuitions(studentId: string): Promise<SavedTuition[]> {
  const response = await fetch(
    `${API_BASE_URL}/saved-tuitions/student/${encodeURIComponent(studentId)}`,
    { cache: "no-store" }
  )
  if (!response.ok) throw new Error("Could not load saved tuitions.")
  return response.json()
}

// Removes a saved tuition bookmark by its ID.
export async function removeSavedTuition(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/saved-tuitions/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Could not remove saved tuition.")
  const result = await response.json()
  if (result.deletedCount !== 1) throw new Error("Saved tuition was not found.")
}
