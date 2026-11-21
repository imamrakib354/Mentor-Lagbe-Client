import type { DirectoryUser } from "@/lib/types/user"

export function UsersOverview({ users, total, now }: { users: DirectoryUser[]; total: number; now: number }) {
  const lastDay = now - 24 * 60 * 60 * 1000
  const recent = users.filter((user) => {
    const createdAt = new Date(user.createdAt).getTime()
    return createdAt >= lastDay && createdAt <= now
  })
  const cards = [
    { label: "Total users", count: total, description: "Registered accounts" },
    { label: "Suspended users", count: users.filter((user) => user.banned).length, description: "Accounts currently suspended" },
    { label: "New students", count: recent.filter((user) => user.role === "student").length, description: "Joined in the last 24 hours" },
    { label: "New tutors", count: recent.filter((user) => user.role === "tutor").length, description: "Joined in the last 24 hours" },
  ]

  return (
    <section aria-label="User overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-950/5">
          <h2 className="text-xs font-semibold tracking-wide text-blue-700 uppercase">{card.label}</h2>
          <p className="mt-3 text-3xl font-bold text-blue-950">{card.count}</p>
          <p className="mt-2 text-sm text-slate-500">{card.description}</p>
        </div>
      ))}
    </section>
  )
}
