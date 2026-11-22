import Link from "next/link"
import { BookOpen, MapPin, Video } from "lucide-react"

import type { PublicTuition } from "@/lib/types/tuition"

type TuitionCardProps = {
  tuition: PublicTuition
}

export function TuitionCard({ tuition }: TuitionCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-blue-50">
        {/* Tuition banners are supplied by tutors and can use arbitrary public URLs. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tuition.bannerImage}
          alt={`${tuition.title} banner`}
          className="h-full w-full object-cover"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {tuition.mode === "Online" ? (
            <Video aria-hidden="true" className="size-3" />
          ) : (
            <MapPin aria-hidden="true" className="size-3" />
          )}
          {tuition.mode === "Online" ? "Online" : tuition.location}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          {tuition.subject}
        </span>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
          {tuition.classLevel}
        </span>
      </div>

      <h2 className="mt-3 line-clamp-2 min-h-12 text-lg font-bold text-blue-950">
        {tuition.title}
      </h2>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        <span>
          <strong className="text-blue-950">Mode:</strong> {tuition.mode}
        </span>
        <span>
          <strong className="text-blue-950">Monthly fee:</strong> ৳
          {Number(tuition.monthlyFee).toLocaleString("en-US")}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-blue-100 pt-3">
        <span className="text-sm text-slate-500">View tuition details</span>

        <Link
          href={`/tuitions/${tuition._id}`}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
        >
          <BookOpen aria-hidden="true" className="size-4" />
          Details
        </Link>
      </div>
    </article>
  )
}
