import Link from "next/link"
import { getPlatformStats } from "@/lib/actions/home"

export default async function CommunitySection() {
  const stats = await getPlatformStats().catch(() => null)

  return (
    <section className="grid gap-5 md:grid-cols-2" aria-label="Platform activity">
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-blue-950">Top Subjects</h2>
        <p className="mt-2 text-sm text-slate-600">Explore the most in-demand tuition categories.</p>
        {!stats ? <p className="mt-5 text-sm text-slate-500">Subjects are unavailable right now.</p> :
          stats.topSubjects.length === 0 ? <p className="mt-5 text-sm text-slate-500">No application data yet.</p> :
          <div className="mt-5 flex flex-wrap gap-2">
            {stats.topSubjects.map(({ subject }) => (
              <Link key={subject} href={`/tuitions?subject=${encodeURIComponent(subject)}`} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950 hover:bg-blue-100">{subject}</Link>
            ))}
          </div>}
      </div>
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-blue-950">Platform Statistics</h2>
        <p className="mt-2 text-sm text-slate-600">A growing learning community.</p>
        {!stats ? <p className="mt-5 text-sm text-slate-500">Statistics are unavailable right now.</p> :
          <dl className="mt-5 grid grid-cols-3 gap-2">
            {[{ label: "Students", value: stats.students }, { label: "Tutors", value: stats.tutors }, { label: "Active Tuitions", value: stats.tuitions }].map((item) => (
              <div key={item.label} className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
                <dd className="text-xl font-bold text-blue-700 sm:text-2xl">{item.value.toLocaleString("en-US")}</dd>
                <dt className="mt-1 text-xs text-slate-600">{item.label}</dt>
              </div>
            ))}
          </dl>}
      </div>
    </section>
  )
}
