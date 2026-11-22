import "server-only"
import { authFetch } from "@/lib/core/server"
import type { Payment } from "@/lib/types/payment"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

// Asks the backend to record a paid checkout and activate premium.
export async function checkoutVerify(sessionId: string): Promise<boolean> {
  const response = await authFetch(`${API_BASE_URL}/payments/checkout-verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId }),
    cache: "no-store",
  })

  if (!response.ok) return false
  const result = await response.json()
  return result.success === true
}

// Fetches recorded payment transactions from the backend.
export async function getPayments(): Promise<Payment[]> {
  const response = await authFetch(`${API_BASE_URL}/payments`, { cache: "no-store" })
  if (!response.ok) throw new Error("Could not load transactions.")
  return response.json()
}
