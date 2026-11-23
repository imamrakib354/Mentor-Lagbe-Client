"use server"

import { authFetch } from "@/lib/core/server"
import type { Review, ReviewListing } from "@/lib/types/review"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

// Fetches public reviews and the overall rating for a tuition.
export async function getReviews(tuitionId: string, page = 1, sort = "newest"): Promise<ReviewListing> {
  const query = new URLSearchParams({ page: String(page), sort })
  const response = await fetch(`${API_BASE_URL}/reviews/${encodeURIComponent(tuitionId)}?${query}`)
  if (!response.ok) throw new Error("Could not load reviews.")
  return response.json()
}

// Fetches the signed-in student's review, if one exists.
export async function getMyReview(tuitionId: string): Promise<Review | null> {
  const response = await authFetch(`${API_BASE_URL}/reviews/${encodeURIComponent(tuitionId)}/mine`)
  if (!response.ok) throw new Error("Could not load your review.")
  return response.json()
}

// Submits a student's rating and comment using their authenticated session.
export async function createReview(tuitionId: string, rating: number, comment: string): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tuitionId, rating, comment }),
  })
  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.message || "Could not submit your review.")
  }
}

// Deletes the authenticated student's review.
export async function deleteReview(reviewId: string): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/reviews/${encodeURIComponent(reviewId)}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.message || "Could not delete your review.")
  }
}
