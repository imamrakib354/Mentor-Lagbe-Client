import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"
import type { SavedTuition } from "@/lib/types/saved-tuition"

export function SavedTuitionCard({ saved }: { saved: SavedTuition }) {
  const tuition = saved.tuition
  const available = tuition?.approvalStatus === "approved" && tuition.isActive

  return (
    <article className="dashboard-surface flex flex-col rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none">
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
      <div className="mt-auto flex items-center justify-end gap-2 border-t border-blue-200/70 pt-4">
        {available && (
          <Button nativeButton={false} render={<Link href={`/tuitions/${saved.tuitionId}`} />} variant="outline" className="border-blue-100 text-blue-700">
            View Details
          </Button>
        )}
        <DeleteConfirmationDialog kind="saved" id={saved._id} name={tuition?.title || "this tuition"} />
      </div>
    </article>
  )
}
