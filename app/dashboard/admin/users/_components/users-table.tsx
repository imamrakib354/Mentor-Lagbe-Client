"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { toast } from "react-toastify"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { activateUser, updateUserRole } from "@/lib/actions/users"
import type { DirectoryUser, UserRole } from "@/lib/types/user"
import { SuspendUserDialog } from "./suspend-user-dialog"

const roles = ["student", "tutor", "admin"] as const
const filters = ["all", ...roles] as const

function roleStyle(role: string) {
  if (role === "admin") return "bg-amber-50 text-amber-700"
  if (role === "tutor") return "bg-violet-50 text-violet-700"
  return "bg-blue-50 text-blue-700"
}

export function UsersTable({ users, total, currentUserId }: { users: DirectoryUser[]; total: number; currentUserId: string }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<(typeof filters)[number]>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const filteredUsers = users.filter((user) =>
    (filter === "all" || user.role === filter) &&
    `${user.name} ${user.email}`.toLowerCase().includes(search.trim().toLowerCase())
  )

  async function handleRoleChange(userId: string, role: UserRole) {
    setUpdatingId(userId)
    try {
      await updateUserRole(userId, role)
      toast.success("User role updated successfully.")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the user's role.")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleActivate(userId: string) {
    setActivatingId(userId)
    try {
      await activateUser(userId)
      toast.success("Account reactivated successfully.")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reactivate this account.")
    } finally {
      setActivatingId(null)
    }
  }

  return (
    <div className="dashboard-surface overflow-hidden rounded-3xl border">
      <header className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-7 sm:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">User directory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">Manage Users</h1>
        <p className="mt-2 text-sm text-slate-600">View registered users and manage their roles.</p>
      </header>
      <section className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}
                className={filter === item ? "h-10 rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700" : "h-10 rounded-full bg-blue-50 px-4 text-blue-700 hover:bg-blue-100"}>
                {item === "all" ? "All Users" : `${item.charAt(0).toUpperCase()}${item.slice(1)}s`}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email..." className="h-10 rounded-xl border-blue-100 bg-white pl-9" />
          </div>
        </div>
        {users.length < total && (
          <p className="mt-4 text-sm text-amber-700">Showing {users.length} of {total} users. Some users could not be loaded.</p>
        )}
        {filteredUsers.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            {users.length ? "No users match your search or filter." : "No users found."}
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow className="border-blue-100">
                  <TableHead className="min-w-48 px-4">User</TableHead>
                  <TableHead className="min-w-52 px-4">Email</TableHead>
                  <TableHead className="min-w-28 px-4">Role</TableHead>
                  <TableHead className="min-w-28 px-4">Status</TableHead>
                  <TableHead className="min-w-32 px-4">Joined</TableHead>
                  <TableHead className="min-w-36 px-4">Change role</TableHead>
                  <TableHead className="min-w-32 px-4">Account</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-blue-100">
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.image && <AvatarImage src={user.image} alt={user.name} />}
                          <AvatarFallback className="bg-blue-100 font-semibold text-blue-700">{user.name.trim().charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-blue-950">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-slate-600">{user.email}</TableCell>
                    <TableCell className="px-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleStyle(user.role)}`}>{user.role}</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.banned ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {user.banned ? "Suspended" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Dhaka" })}
                    </TableCell>
                    <TableCell className="px-4">
                      <select
                        aria-label={`Change role for ${user.name}`}
                        value={user.role}
                        disabled={updatingId !== null}
                        onChange={(event) => handleRoleChange(user.id, event.target.value as UserRole)}
                        className="h-10 rounded-lg border border-blue-100 bg-white px-3 text-sm capitalize text-blue-950 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                      >
                        {!roles.includes(user.role as UserRole) && <option value={user.role}>{user.role}</option>}
                        {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                      </select>
                    </TableCell>
                    <TableCell className="px-4">
                      {user.banned ? (
                        <Button type="button" variant="outline" disabled={activatingId !== null} onClick={() => handleActivate(user.id)} className="border-emerald-100 text-emerald-700 hover:bg-emerald-50">
                          {activatingId === user.id ? "Activating..." : "Activate"}
                        </Button>
                      ) : (
                        <SuspendUserDialog userId={user.id} userName={user.name} disabled={user.id === currentUserId} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  )
}
