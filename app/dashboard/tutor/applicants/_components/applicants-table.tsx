"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

import { Button, buttonVariants } from "@/components/ui/button"
import { ApplicationSearch } from "@/components/shared/application-search"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { updateApplicationStatus } from "@/lib/actions/application"
import type { ApplicationListing } from "@/lib/types/application"
import { cn } from "@/lib/utils"
import { NoteDialog } from "./note-dialog"

const tabs = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All Applications" },
] as const

export function ApplicantsTable({
  listing,
  status,
  search,
}: {
  listing: ApplicationListing
  status: string
  search: string
}) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function changeStatus(id: string, nextStatus: "accepted" | "rejected") {
    if (updatingId) return
    setUpdatingId(id)
    try {
      await updateApplicationStatus(id, nextStatus)
      toast.success(`Application ${nextStatus}.`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the application.")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-blue-100 bg-gradient-to-r from-white to-blue-100 px-5 py-7 sm:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Tutor workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">Manage Applicants</h1>
        <p className="mt-2 text-sm text-slate-600">Review students who have applied to your tuitions.</p>
      </header>

      <nav aria-label="Application status" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count = listing.counts[tab.value]
          const params = new URLSearchParams({ status: tab.value })
          if (search) params.set("search", search)
          return (
            <Link
              key={tab.value}
              href={`/dashboard/tutor/applicants?${params}`}
              aria-current={status === tab.value ? "page" : undefined}
              className={cn(
                buttonVariants(),
                "h-10 gap-2 rounded-full px-4",
                status === tab.value ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-blue-700 hover:bg-blue-50"
              )}
            >
              {tab.label}
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{count}</span>
            </Link>
          )
        })}
      </nav>

      <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-blue-950">
          {status === "all" ? "All Applications" : `${tabs.find((tab) => tab.value === status)?.label} Applications`}
        </h2>
        <ApplicationSearch search={search} status={status} />
        </div>
        {listing.applications.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">No applications in this section yet.</p>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow className="border-blue-100">
                  <TableHead className="min-w-44 px-3">Student</TableHead>
                  <TableHead className="min-w-32 px-3">Phone</TableHead>
                  <TableHead className="min-w-44 px-3">Tuition</TableHead>
                  <TableHead className="min-w-40 px-3">Preferred schedule</TableHead>
                  <TableHead className="min-w-24 px-3">Note</TableHead>
                  <TableHead className="min-w-28 px-3">Applied</TableHead>
                  <TableHead className="min-w-24 px-3">Status</TableHead>
                  <TableHead className="min-w-24 px-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listing.applications.map((application) => (
                  <TableRow key={application._id} className="border-blue-100">
                    <TableCell className="px-3 py-4 whitespace-normal">
                      <p className="font-semibold text-blue-950">{application.applicantName}</p>
                      <p className="mt-1 break-all text-xs text-slate-500">{application.applicantEmail}</p>
                    </TableCell>
                    <TableCell className="px-3">{application.phone}</TableCell>
                    <TableCell className="px-3 whitespace-normal font-medium text-blue-950">{application.tuitionTitle}</TableCell>
                    <TableCell className="px-3 whitespace-normal text-slate-600">{application.preferredSchedule}</TableCell>
                    <TableCell className="px-3 text-slate-600">
                      {application.learningNote?.trim() ? (
                        <NoteDialog name={application.applicantName} note={application.learningNote} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="px-3 text-slate-600">{new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                    <TableCell className="px-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${application.status === "accepted" ? "bg-emerald-50 text-emerald-700" : application.status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-3">
                      <div className="flex flex-col items-stretch gap-1.5">
                        {application.status !== "accepted" && (
                          <Button type="button" disabled={updatingId !== null} onClick={() => changeStatus(application._id, "accepted")} className="bg-emerald-600 text-white hover:bg-emerald-700">
                            Accept
                          </Button>
                        )}
                        {application.status !== "rejected" && (
                          <Button type="button" disabled={updatingId !== null} onClick={() => changeStatus(application._id, "rejected")} className="bg-red-600 text-white hover:bg-red-700">
                            Reject
                          </Button>
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
