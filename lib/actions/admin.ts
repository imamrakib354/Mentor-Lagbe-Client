"use server"

import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { authFetch } from "@/lib/core/server"
import type { ApprovalStatus, Tuition } from "@/lib/types/tuition"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

// Fetches admin tuition listings using the selected filters.
export async function getAdminTuitions(query = ""): Promise<Tuition[]> {
  const user = await getCurrentUser()
  if (user?.role !== "admin") throw new Error("Only admins can view tuitions.")

  const response = await authFetch(
    `${API_BASE_URL}/admin/tuitions${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  )
  if (!response.ok) throw new Error("Could not load tuitions.")

  return response.json()
}

// Updates a tuition's approval status through the backend.
export async function updateTuitionApproval(
  id: string,
  approvalStatus: ApprovalStatus
) {
  const user = await getCurrentUser()
  if (user?.role !== "admin") throw new Error("Only admins can update tuitions.")

  const response = await authFetch(`${API_BASE_URL}/tuitions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ approvalStatus }),
  })
  if (!response.ok) throw new Error("Could not update tuition status.")

  const result = await response.json()
  if (result.matchedCount === 0) throw new Error("Tuition not found.")
}
