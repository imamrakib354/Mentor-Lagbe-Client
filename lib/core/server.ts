import "server-only"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

// 1. Get BetterAuth session
export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
}

// 2. Get JWT token (UPDATED)
export const getToken = async (): Promise<string> => {
  const session = await getSession()

  if (!session?.user) throw new Error("Please sign in to continue.")

  const { token } = await auth.api.getToken({ headers: await headers() })
  if (!token) throw new Error("Could not obtain an authentication token.")
  return token
}

// 3. Fetch protected APIs using JWT
export const authFetch = async (
  api: string,
  options: RequestInit = {}
) => {
  const token = await getToken()

  const requestHeaders = new Headers(options.headers)

  requestHeaders.set("Authorization", `Bearer ${token}`)

  const res = await fetch(api, {
    ...options,
    headers: requestHeaders,
    cache: "no-store",
  })

  if (res.status === 401) throw new Error("Your session has expired. Please sign in again.")
  if (res.status === 403) throw new Error("You do not have permission to perform this action.")
  return res
}

// 4. Verify role for Next.js pages
export const requireRole = async (
  role: "student" | "tutor" | "admin"
) => {
  const session = await getSession()

  if (!session || session.user.role !== role) {
    redirect("/unauthorized")
  }

  return session
}
