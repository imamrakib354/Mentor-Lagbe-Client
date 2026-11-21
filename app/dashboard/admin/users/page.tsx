import { getUsers } from "@/lib/helpers/users"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { DirectoryUser } from "@/lib/types/user"
import { UsersTable } from "./_components/users-table"

export default async function UsersPage() {
  const currentUser = await getCurrentUser()
  if (currentUser?.role !== "admin") {
    return <p className="rounded-2xl bg-white p-6 text-slate-600">Sign in as an admin to view users.</p>
  }

  let users: DirectoryUser[]
  let total: number
  try {
    const result = await getUsers()
    total = result.total
    users = result.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: user.role || "student",
      createdAt: new Date(user.createdAt).toISOString(),
    }))
  } catch {
    return <p className="rounded-2xl bg-white p-6 text-red-600">Could not load users. Please try again.</p>
  }

  return <UsersTable users={users} total={total} />
}
