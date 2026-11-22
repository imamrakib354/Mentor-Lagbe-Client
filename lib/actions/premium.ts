const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

// Gets the current premium status of a user.
export async function getPremiumById(id: string): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/users/${encodeURIComponent(id)}/premium`,
    { cache: "no-store" }
  )

  if (!response.ok) throw new Error("Could not check your premium status.")
  const result = await response.json()
  if (typeof result.premium !== "boolean") {
    throw new Error("Could not check your premium status.")
  }
  return result.premium
}
