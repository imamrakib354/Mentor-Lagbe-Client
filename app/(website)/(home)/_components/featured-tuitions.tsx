import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

import { getNewTuitions } from "@/lib/actions/home"

export default async function FeaturedTuitions() {
  const tuitions = await getNewTuitions().catch(() => null)
  const [latest, ...others] = tuitions ?? []

  return (
    <section className="rounded-3xl border border-blue-100 bg-white px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10">
      <p className="text-xs font-bold tracking-widest text-blue-600 uppercase">New opportunities</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950 sm:text-3xl">Featured Tuitions</h2>
      <p className="mt-2 text-sm text-slate-600">Discover the latest approved and active tuition listings.</p>
      {!tuitions ? (
        <p className="mt-6 text-sm text-slate-600">Could not load featured tuitions. Please try again later.</p>
      ) : !latest ? (
        <p className="mt-6 text-sm text-slate-600">No tuitions are available yet.</p>
      ) : (
        <>
          <article className="mt-6 grid gap-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-950 p-5 text-white sm:grid-cols-[14rem_1fr]">
            {/* Tutor-provided banners may use external image hosts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={latest.bannerImage} alt="" className="h-44 w-full rounded-xl object-cover" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold tracking-wider text-blue-100 uppercase">Latest tuition</span>
              <h3 className="mt-2 text-xl font-bold sm:text-2xl">{latest.title}</h3>
              <p className="mt-2 text-sm text-blue-100">{latest.subject} · {latest.classLevel} · {latest.mode}</p>
              <p className="mt-2 line-clamp-2 text-sm text-blue-100">{latest.description}</p>
              {latest.tutorName && <p className="mt-2 text-sm font-semibold">Tutor: {latest.tutorName}</p>}
              <p className="mt-2 text-sm font-bold">Monthly fee: ৳{Number(latest.monthlyFee).toLocaleString("en-US")}</p>
              <Link href={`/tuitions/${latest._id}`} className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">View Details →</Link>
            </div>
          </article>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {others.map((tuition) => (
              <article key={tuition._id} className="flex flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="rounded-xl bg-blue-50 p-3 text-blue-600"><BookOpen aria-hidden="true" className="size-5" /></span>
                  <div>
                    <h3 className="font-bold text-blue-950">{tuition.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{tuition.subject} · {tuition.classLevel} · {tuition.mode}</p>
                    <p className="mt-2 text-sm font-semibold text-blue-950">Monthly fee: ৳{Number(tuition.monthlyFee).toLocaleString("en-US")}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-blue-100 pt-3">
                  <span className="text-sm font-semibold text-blue-950">{tuition.tutorName || ""}</span>
                  <Link href={`/tuitions/${tuition._id}`} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100">View Details →</Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      <div className="mt-7 text-center">
        <Link href="/tuitions" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          Browse All Tuitions <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  )
}
