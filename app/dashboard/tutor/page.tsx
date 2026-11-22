import { BookOpen, CheckCircle2, Crown, Users } from "lucide-react"
import { getTutorApplications } from "@/lib/actions/application"
import { getPremiumById } from "@/lib/actions/premium"
import { getTutorTuitions } from "@/lib/actions/tuitions"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { OverviewMotion } from "../_components/overview-motion"
import { OverviewHeading, OverviewPanel, QuickLinks, StatCard, StatusList } from "../_components/overview-ui"

export default async function TutorDashboardPage() {
  const user = await getCurrentUser()
  if (user?.role !== "tutor") return <p className="dashboard-surface rounded-2xl border p-6">Sign in as a tutor to view this overview.</p>

  const [tuitions, listing, premium] = await Promise.all([
    getTutorTuitions(user.id).catch(() => null),
    getTutorApplications(user.id).catch(() => null),
    getPremiumById(user.id).catch(() => null),
  ])
  const recent = listing?.applications.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4)

  return (
    <OverviewMotion>
      <OverviewHeading eyebrow="Tutor dashboard" title={`Welcome back, ${user.name}!`} description="Manage your tuition listings, respond to applicants, and grow your reach." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tuitions posted" value={tuitions?.length ?? "—"} icon={BookOpen} accent="purple" detail={tuitions ? "All current listings" : "Could not load listings"} />
        <StatCard label="Approved tuitions" value={tuitions?.filter((item) => item.approvalStatus === "approved").length ?? "—"} icon={CheckCircle2} accent="green" />
        <StatCard label="Total applicants" value={listing?.counts.all ?? "—"} icon={Users} accent="amber" detail={listing ? "Applications received" : "Could not load applicants"} />
        <StatCard label="Current plan" value={premium === null ? "Unavailable" : premium ? "Pro" : "Free"} icon={Crown} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <OverviewPanel title="Recent applicants" description="Latest applications for your tuitions.">
          {!recent ? <p className="text-sm text-slate-500">Applicants are unavailable.</p> : recent.length === 0 ? <p className="text-sm text-slate-500">No applications received yet.</p> : <ul className="divide-y divide-blue-100">{recent.map((item) => <li key={item._id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-blue-950">{item.applicantName}</p><p className="truncate text-xs text-slate-500">{item.tuitionTitle}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 capitalize">{item.status}</span></li>)}</ul>}
        </OverviewPanel>
        <OverviewPanel title="Tuition status" description="A snapshot of your listings.">
          {tuitions ? <StatusList items={[{ label: "Total", value: tuitions.length }, { label: "Approved", value: tuitions.filter((item) => item.approvalStatus === "approved").length }, { label: "Pending", value: tuitions.filter((item) => item.approvalStatus === "pending").length }, { label: "Rejected", value: tuitions.filter((item) => item.approvalStatus === "rejected").length }]} /> : <p className="text-sm text-slate-500">Tuition data is unavailable.</p>}
        </OverviewPanel>
        <OverviewPanel title="Quick actions">
          <QuickLinks links={[{ href: "/dashboard/tutor/post-tuition", label: "Post New Tuition", description: "Create a new tuition listing" }, { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", description: "Manage your listings" }, { href: "/dashboard/tutor/applicants", label: "Manage Applicants", description: "Review and respond to applications" }, ...(premium === false ? [{ href: "/pricing", label: "Explore Pro", description: "See premium plans" }] : [])]} />
        </OverviewPanel>
      </div>
    </OverviewMotion>
  )
}
