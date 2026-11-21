"use server"

import { auth } from "../auth";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { UserRole } from "@/lib/types/user"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getUsers = async () => {
    const requestHeaders = await headers()
    const users: Awaited<ReturnType<typeof auth.api.listUsers>>["users"] = []
    let total = 0

    do {
        const result: Awaited<ReturnType<typeof auth.api.listUsers>> = await auth.api.listUsers({
            query: {
                sortBy: "name",
                sortDirection: "desc",
                limit: 100,
                offset: users.length,
            },
            headers: requestHeaders,
        })
        total = result.total
        users.push(...result.users)
        if (result.users.length === 0) break
    } while (users.length < total)

    return { users, total, fetchedAt: Date.now() }
}

// Updates a user's role through the external backend.
export async function updateUserRole(userId: string, role: UserRole) {
    const user = await getCurrentUser()
    if (user?.role !== "admin") throw new Error("Only admins can change roles.")
    if (!["student", "tutor", "admin"].includes(role)) {
        throw new Error("Please select a valid role.")
    }

    const response = await fetch(`${BASE_URL.replace(/\/$/, "")}/users/${encodeURIComponent(userId)}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        cache: "no-store",
    })

    if (!response.ok) throw new Error("Could not update the user's role.")
    const result = await response.json()
    if (result.matchedCount === 0) throw new Error("User not found.")
    return result
}

// Suspends a user and revokes their active sessions.
export async function suspendUser(userId: string) {
    await auth.api.banUser({
        body: { userId },
        headers: await headers(),
    })
}

// Reactivates a suspended user.
export async function activateUser(userId: string) {
    await auth.api.unbanUser({
        body: { userId },
        headers: await headers(),
    })
}
