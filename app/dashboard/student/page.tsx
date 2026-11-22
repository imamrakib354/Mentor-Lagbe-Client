import { CheckCircle2, Clock3, Crown, FileText } from "lucide-react"
import { getStudentApplications } from "@/lib/actions/application"
import { getPremiumById } from "@/lib/actions/premium"
import { getSavedTuitions } from "@/lib/actions/saved-tuitions"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { OverviewMotion } from "../_components/overview-motion"
import { ApplicationProgress, OverviewHeading, OverviewPanel, QuickLinks, StatCard } from "../_components/overview-ui"

export default async function StudentDashboardPage() {
  const user = await getCurrentUser()
  if (user?.role !== "student") return <p className="dashboard-surface rounded-2xl border p-6">Sign in as a student to view this overview.</p>

  const [listing, saved, premium] = await Promise.all([
    getStudentApplications(user.id).catch(() => null),
    getSavedTuitions(user.id).catch(() => null),
    getPremiumById(user.id).catch(() => null),
  ])
  const recent = listing?.applications.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4)

  return (
    <OverviewMotion>
      <OverviewHeading eyebrow="Student dashboard" title={`Welcome back, ${user.name}!`} description="Track your tuition applications, responses, and learning journey — all in one place." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total applications" value={listing?.counts.all ?? "—"} icon={FileText} accent="purple" detail={listing ? "All current applications" : "Could not load applications"} />
        <StatCard label="Accepted applications" value={listing?.counts.accepted ?? "—"} icon={CheckCircle2} accent="green" />
        <StatCard label="Pending applications" value={listing?.counts.pending ?? "—"} icon={Clock3} accent="amber" />
        <StatCard label="Current plan" value={premium === null ? "Unavailable" : premium ? "Pro" : "Free"} icon={Crown} detail={saved ? `${saved.length} saved tuitions` : "Saved tuitions unavailable"} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <OverviewPanel title="Application progress" description="Your current application statuses.">
          {listing ? <ApplicationProgress accepted={listing.counts.accepted} pending={listing.counts.pending} rejected={listing.counts.rejected} /> : <p className="text-sm text-slate-500">Application data is unavailable.</p>}
        </OverviewPanel>
        <OverviewPanel title="Recent applications" description="The latest applications and their current status.">
          {!recent ? <p className="text-sm text-slate-500">Applications are unavailable.</p> : recent.length === 0 ? <p className="text-sm text-slate-500">You haven’t applied to any tuitions yet.</p> : <ul className="divide-y divide-blue-100">{recent.map((item) => <li key={item._id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-blue-950">{item.tuitionTitle}</p><p className="text-xs text-slate-500">{item.tutorName}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 capitalize">{item.status}</span></li>)}</ul>}
        </OverviewPanel>
        <OverviewPanel title="Quick actions">
          <QuickLinks links={[{ href: "/dashboard/student/my-applications", label: "My Applications", description: "Track and manage submissions" }, { href: "/dashboard/student/saved-tuitions", label: "Saved Tuitions", description: "See your bookmarks" }, { href: "/tuitions", label: "Browse Tuitions", description: "Find your next mentor" }, ...(premium === false ? [{ href: "/pricing", label: "Explore Pro", description: "See premium plans" }] : [])]} />
        </OverviewPanel>
      </div>
    </OverviewMotion>
  )
}
