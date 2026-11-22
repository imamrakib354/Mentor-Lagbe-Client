import { getUsers } from "@/lib/actions/users"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import type { DirectoryUser } from "@/lib/types/user"
import { UsersTable } from "./_components/users-table"
import { UsersOverview } from "./_components/users-overview"

export default async function UsersPage() {
  const currentUser = await getCurrentUser()
  if (currentUser?.role !== "admin") {
    return <p className="dashboard-surface rounded-2xl border p-6 text-slate-600">Sign in as an admin to view users.</p>
  }

  let users: DirectoryUser[]
  let total: number
  let fetchedAt: number
  try {
    const result = await getUsers()
    total = result.total
    fetchedAt = result.fetchedAt
    users = result.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: user.role || "student",
      createdAt: new Date(user.createdAt).toISOString(),
      banned: user.banned ?? false,
    }))
  } catch {
    return <p className="dashboard-surface rounded-2xl border p-6 text-red-600">Could not load users. Please try again.</p>
  }

  return (
    <div className="space-y-6">
      <UsersOverview users={users} total={total} now={fetchedAt} />
      <UsersTable users={users} total={total} currentUserId={currentUser.id} />
    </div>
  )
}
