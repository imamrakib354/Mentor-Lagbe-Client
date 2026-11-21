import Link from "next/link"
import { BookmarkX } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SavedTuition } from "@/lib/types/saved-tuition"

export function SavedTuitionCard({ saved }: { saved: SavedTuition }) {
  const tuition = saved.tuition
  const available = tuition?.approvalStatus === "approved" && tuition.isActive

  return (
    <article className="flex flex-col rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5">
      {tuition ? (
        <>
          <div className="aspect-[16/9] overflow-hidden rounded-xl bg-blue-50">
            {/* Banners may use arbitrary tutor-provided URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tuition.bannerImage} alt={`${tuition.title} banner`} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{tuition.subject}</span>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{tuition.classLevel}</span>
          </div>
          <h2 className="mt-3 text-lg font-bold text-blue-950">{tuition.title}</h2>
          <p className="mt-2 text-sm text-slate-600">Mode: {tuition.mode} · Monthly fee: ৳{Number(tuition.monthlyFee).toLocaleString("en-US")}</p>
          <p className="mt-3 text-sm font-medium text-blue-950">{tuition.tutorName}</p>
          {!available && <p className="mt-2 text-xs font-semibold text-amber-700">Tuition currently unavailable</p>}
        </>
      ) : (
        <div className="flex min-h-48 flex-col justify-center">
          <h2 className="text-lg font-bold text-blue-950">Tuition unavailable</h2>
          <p className="mt-2 text-sm text-slate-500">This tuition is no longer available.</p>
        </div>
      )}
      <div className="mt-auto flex items-center justify-end gap-2 border-t border-blue-100 pt-4">
        {available && (
          <Button nativeButton={false} render={<Link href={`/tuitions/${saved.tuitionId}`} />} variant="outline" className="border-blue-100 text-blue-700">
            View Details
          </Button>
        )}
        <Button type="button" variant="outline" disabled title="Removing saved tuitions is coming soon" aria-label="Remove from saved (coming soon)" className="border-blue-100">
          <BookmarkX aria-hidden="true" /> Remove
        </Button>
      </div>
    </article>
  )
}
