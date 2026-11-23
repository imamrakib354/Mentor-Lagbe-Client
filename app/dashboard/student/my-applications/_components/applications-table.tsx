"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

import { Button, buttonVariants } from "@/components/ui/button"
import { ApplicationSearch } from "@/components/shared/application-search"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { saveTuition } from "@/lib/actions/saved-tuitions"
import type { ApplicationListing, ApplicationStatus } from "@/lib/types/application"
import { cn } from "@/lib/utils"

const statuses = ["all", "accepted", "pending", "rejected"] as const

export function ApplicationsTable({ listing, savedIds, studentId, search, status }: {
  listing: ApplicationListing
  savedIds: string[]
  studentId: string
  search: string
  status: string
}) {
  const router = useRouter()
  const [savingId, setSavingId] = useState<string | null>(null)

  async function handleSave(tuitionId: string) {
    if (savingId) return
    setSavingId(tuitionId)
    try {
      const result = await saveTuition(studentId, tuitionId)
      toast.success(result.alreadySaved ? "Tuition already saved." : "Tuition saved successfully.")
      router.push("/dashboard/student/saved-tuitions")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save tuition.")
    } finally {
      setSavingId(null)
    }
  }

  function statusClass(value: ApplicationStatus) {
    if (value === "accepted") return "bg-emerald-50 text-emerald-700"
    if (value === "rejected") return "bg-red-50 text-red-700"
    return "bg-amber-50 text-amber-700"
  }

  return (
    <div>
      <header className="dashboard-surface mb-6 rounded-3xl border p-6 sm:p-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Applications</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">My Applications</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Keep track of the tuitions you have applied for and their current status.</p>
      </header>

      <section className="dashboard-surface rounded-3xl border p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => {
              const params = new URLSearchParams({ status: item })
              if (search) params.set("search", search)
              return (
              <Link key={item} href={`/dashboard/student/my-applications?${params}`}
                aria-current={status === item ? "page" : undefined}
                className={cn(buttonVariants(), status === item ? "h-10 rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700" : "h-10 rounded-full bg-blue-50 px-4 text-blue-700 hover:bg-blue-100")}>
                <span className="capitalize">{item}</span>
                {listing.counts[item]}
              </Link>
            )})}
          </div>
          <ApplicationSearch search={search} status={status} />
        </div>

        {listing.applications.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="font-semibold text-blue-950">No matching applications</h2>
            <p className="mt-2 text-sm text-slate-500">Try a different search or status, or browse available tuitions.</p>
            <Link href="/tuitions" className="mt-4 inline-block font-semibold text-blue-600">Browse tuitions</Link>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="min-w-64">Tuition</TableHead>
                  <TableHead className="min-w-48">Tutor</TableHead>
                  <TableHead className="min-w-28">Monthly fee</TableHead>
                  <TableHead className="min-w-32">Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-36">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listing.applications.map((application) => (
                  <TableRow key={application._id} className="border-blue-100">
                    <TableCell className="whitespace-normal">
                      <div className="flex items-center gap-3">
                        {/* Application banners can use tutor-provided URLs. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={application.bannerImage} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                        <div><p className="font-semibold text-blue-950">{application.tuitionTitle}</p><p className="mt-1 text-xs text-slate-500">{application.subject} · {application.classLevel}</p></div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal"><p className="font-semibold text-blue-950">{application.tutorName}</p><p className="mt-1 break-all text-xs text-slate-500">{application.tutorEmail}</p></TableCell>
                    <TableCell className="font-semibold text-blue-950">৳{Number(application.monthlyFee).toLocaleString("en-US")}</TableCell>
                    <TableCell>{new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Dhaka" })}</TableCell>
                    <TableCell><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(application.status)}`}>{application.status}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button nativeButton={false} render={<Link href={`/tuitions/${application.tuitionId}`} />} variant="outline" className="border-blue-100 text-blue-700">View</Button>
                        {savedIds.includes(application.tuitionId) ? (
                          <Button nativeButton={false} render={<Link href="/dashboard/student/saved-tuitions" />} variant="outline" size="icon" aria-label={`View saved ${application.tuitionTitle}`} title="Already saved" className="border-blue-100 text-blue-700">
                            <Bookmark aria-hidden="true" fill="currentColor" />
                          </Button>
                        ) : (
                          <Button type="button" variant="outline" size="icon" disabled={savingId !== null} onClick={() => handleSave(application.tuitionId)} aria-label={`Save ${application.tuitionTitle}`} title="Save tuition" className="border-blue-100 text-blue-700">
                            <Bookmark aria-hidden="true" />
                          </Button>
                        )}
                        {application.status === "pending" && (
                          <DeleteConfirmationDialog kind="application" id={application._id} name={application.tuitionTitle} />
                        )}
                      </div>
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
