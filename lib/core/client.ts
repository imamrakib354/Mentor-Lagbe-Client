import { authClient } from "@/lib/auth-client"

// 1. Get JWT token
export const getClientToken = async () => {
  const { data, error } = await authClient.token()

  if (error || !data?.token) {
    throw new Error("Unauthorized")
  }

  return data.token
}

// 2. Fetch protected API using JWT
export const clientAuthFetch = async (
  api: string,
  options: RequestInit = {}
) => {
  const token = await getClientToken()

  const requestHeaders = new Headers(options.headers)

  requestHeaders.set(
    "Authorization",
    `Bearer ${token}`
  )

  const res = await fetch(api, {
    ...options,
    headers: requestHeaders,
  })

  return res
}