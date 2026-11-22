import { BadgeCheck, BookOpen, CreditCard, Users } from "lucide-react"
import { getAdminTuitions } from "@/lib/actions/admin"
import { getPayments } from "@/lib/actions/payments"
import { getUsers } from "@/lib/actions/users"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { OverviewCharts } from "../_components/overview-charts"
import { OverviewMotion } from "../_components/overview-motion"
import { OverviewHeading, OverviewPanel, QuickLinks, StatCard, StatusList } from "../_components/overview-ui"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (user?.role !== "admin") return <p className="dashboard-surface rounded-2xl border p-6">Sign in as an admin to view this overview.</p>

  const [directory, tuitions, payments] = await Promise.all([
    getUsers().catch(() => null),
    getAdminTuitions().catch(() => null),
    getPayments().catch(() => null),
  ])
  const paid = payments?.filter((payment) => payment.status?.toLowerCase() === "paid" && payment.currency?.toLowerCase() === "usd")
  const revenue = paid?.reduce((total, payment) => total + (payment.amount ?? 0), 0)
  const completeUsers = directory && directory.users.length === directory.total
  const completePaymentDates = paid?.every((payment) => payment.paidDate && !Number.isNaN(new Date(payment.paidDate).getTime()) && payment.amount != null)
  const now = new Date()
  const chartData = Array.from({ length: 6 }, (_, index) => {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1))
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 4 + index, 1))
    return {
      month: start.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      users: completeUsers ? directory.users.filter((item) => new Date(item.createdAt) < end).length : null,
      revenue: paid && completePaymentDates ? paid.filter((item) => item.paidDate && new Date(item.paidDate) >= start && new Date(item.paidDate) < end).reduce((total, item) => total + (item.amount ?? 0), 0) / 100 : null,
    }
  })
  const recent = payments?.slice().sort((a, b) => (b.paidDate || "").localeCompare(a.paidDate || "")).slice(0, 5)

  return (
    <OverviewMotion>
      <OverviewHeading eyebrow="System administration" title="Admin Overview" description="Platform metrics, tuition moderation, user roles, and recorded payments." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={directory?.total ?? "—"} icon={Users} accent="purple" detail={directory ? "Registered accounts" : "Could not load users"} />
        <StatCard label="Total tutors" value={completeUsers ? directory.users.filter((item) => item.role === "tutor").length : "—"} icon={BadgeCheck} accent="green" />
        <StatCard label="Pending tuitions" value={tuitions?.filter((item) => item.approvalStatus === "pending").length ?? "—"} icon={BookOpen} accent="amber" detail={tuitions ? `${tuitions.length} total listings` : "Could not load listings"} />
        <StatCard label="Recorded USD revenue" value={revenue == null ? "—" : `$${(revenue / 100).toFixed(2)}`} icon={CreditCard} detail={payments ? "Paid transactions only" : "Could not load payments"} />
      </div>
      <div className="mt-5"><OverviewCharts data={chartData} /></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <OverviewPanel title="Tuition moderation" description="Current status of tuition listings.">
          {tuitions ? <StatusList items={[{ label: "Total", value: tuitions.length }, { label: "Approved", value: tuitions.filter((item) => item.approvalStatus === "approved").length }, { label: "Pending", value: tuitions.filter((item) => item.approvalStatus === "pending").length }, { label: "Rejected", value: tuitions.filter((item) => item.approvalStatus === "rejected").length }]} /> : <p className="text-sm text-slate-500">Tuition data is unavailable.</p>}
        </OverviewPanel>
        <OverviewPanel title="Recent transactions" description="Latest recorded payments.">
          {!recent ? <p className="text-sm text-slate-500">Transactions are unavailable.</p> : recent.length === 0 ? <p className="text-sm text-slate-500">No transactions recorded yet.</p> : <ul className="divide-y divide-blue-100">{recent.map((item) => <li key={item._id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-blue-950">{item.userName || "Unknown user"}</p><p className="text-xs text-slate-500">{item.plan || "Plan unavailable"}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 capitalize">{item.status || "Unknown"}</span></li>)}</ul>}
        </OverviewPanel>
        <OverviewPanel title="Quick actions">
          <QuickLinks links={[{ href: "/dashboard/admin/users", label: "Manage Users", description: "Review accounts and roles" }, { href: "/dashboard/admin/tuitions", label: "Moderate Tuitions", description: "Review tuition listings" }, { href: "/dashboard/admin/transactions", label: "Transactions", description: "View recorded payments" }]} />
        </OverviewPanel>
      </div>
    </OverviewMotion>
  )
}
