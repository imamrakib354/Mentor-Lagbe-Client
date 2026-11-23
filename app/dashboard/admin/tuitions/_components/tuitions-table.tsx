"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { updateTuitionApproval } from "@/lib/actions/admin"
import { classLevels, tuitionSubjectsByClassLevel, type ClassLevel } from "@/lib/data/tuition-options"
import type { ApprovalStatus, Tuition } from "@/lib/types/tuition"

type Filters = {
  classLevel: string
  subject: string
  mode: string
  sort: string
  approvalStatus: string
}

const tabs = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All Tuitions" },
] as const

const selectClass = "h-11 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400"

export function TuitionsTable({
  tuitions,
  allTuitions,
  filters,
}: {
  tuitions: Tuition[]
  allTuitions: Tuition[]
  filters: Filters
}) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  function updateFilter(name: keyof Filters, value: string) {
    const next = { ...filters, [name]: value }
    if (name === "classLevel") next.subject = ""
    const params = new URLSearchParams()
    for (const [key, item] of Object.entries(next)) {
      if (item) params.set(key, item)
    }
    router.push(`/dashboard/admin/tuitions?${params.toString()}`)
  }

  async function changeStatus(id: string, status: ApprovalStatus) {
    if (updatingId) return
    setUpdatingId(id)
    try {
      await updateTuitionApproval(id, status)
      toast.success(status === "approved" ? "Tuition approved." : "Tuition rejected.")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update tuition.")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <header className="dashboard-surface rounded-3xl border px-5 py-7 sm:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Tuition management</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">Manage Tuitions</h1>
        <p className="mt-2 text-sm text-slate-600">Review tuition listings and manage their approval status.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count = tab.value === "all" ? allTuitions.length : allTuitions.filter((item) => item.approvalStatus === tab.value).length
          return (
            <Button key={tab.value} type="button" aria-pressed={filters.approvalStatus === tab.value}
              onClick={() => updateFilter("approvalStatus", tab.value)}
              className={filters.approvalStatus === tab.value ? "h-10 rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700" : "h-10 rounded-full bg-white px-4 text-blue-700 hover:bg-blue-50"}>
              {tab.label} <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{count}</span>
            </Button>
          )
        })}
      </div>

      <section className="dashboard-surface rounded-3xl border p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-blue-950">
            {filters.approvalStatus === "all"
              ? "All Tuitions"
              : `${tabs.find((tab) => tab.value === filters.approvalStatus)?.label} Tuitions`}
          </h2>
          <p className="text-xs text-slate-500">Counts reflect the selected filters.</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <select aria-label="Filter by class level" value={filters.classLevel} onChange={(event) => updateFilter("classLevel", event.target.value)} className={selectClass}>
            <option value="">All levels</option>
            {classLevels.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
          <select aria-label="Filter by subject" value={filters.subject} disabled={!filters.classLevel} onChange={(event) => updateFilter("subject", event.target.value)} className={selectClass}>
            <option value="">{filters.classLevel ? "All subjects" : "Select a class level first"}</option>
            {filters.classLevel && tuitionSubjectsByClassLevel[filters.classLevel as ClassLevel].map((subject) => <option key={subject} value={subject}>{subject}</option>)}
          </select>
          <select aria-label="Filter by mode" value={filters.mode} onChange={(event) => updateFilter("mode", event.target.value)} className={selectClass}>
            <option value="">All modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
          <select aria-label="Sort tuitions" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)} className={selectClass}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {tuitions.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">No tuitions found for these filters.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow className="border-blue-100">
                  <TableHead className="min-w-44 px-3">Tuition</TableHead>
                  <TableHead className="min-w-24 px-3">Subject</TableHead>
                  <TableHead className="min-w-36 px-3">Tutor</TableHead>
                  <TableHead className="min-w-24 px-3">Monthly fee</TableHead>
                  <TableHead className="min-w-24 px-3">Approval</TableHead>
                  <TableHead className="min-w-20 px-3">Active</TableHead>
                  <TableHead className="min-w-28 px-3">Created</TableHead>
                  <TableHead className="min-w-24 px-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tuitions.map((tuition) => (
                  <TableRow key={tuition._id} className="border-blue-100">
                    <TableCell className="px-4 py-4 whitespace-normal"><p className="font-semibold text-blue-950">{tuition.title}</p><p className="mt-1 text-xs text-slate-500">{tuition.mode} · {tuition.classLevel}</p></TableCell>
                    <TableCell className="px-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">{tuition.subject}</span></TableCell>
                    <TableCell className="px-4 whitespace-normal"><p className="font-semibold text-blue-950">{tuition.tutorName}</p><p className="mt-1 break-all text-xs text-slate-500">{tuition.tutorEmail}</p></TableCell>
                    <TableCell className="px-4 font-semibold text-blue-950">৳{Number(tuition.monthlyFee).toLocaleString("en-US")}</TableCell>
                    <TableCell className="px-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tuition.approvalStatus === "approved" ? "bg-emerald-50 text-emerald-700" : tuition.approvalStatus === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{tuition.approvalStatus}</span></TableCell>
                    <TableCell className="px-4"><span className={tuition.isActive ? "text-emerald-700" : "text-slate-500"}>{tuition.isActive ? "Active" : "Closed"}</span></TableCell>
                    <TableCell className="px-4 text-slate-600">{new Date(tuition.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Dhaka" })}</TableCell>
                    <TableCell className="px-4">
                      <div className="flex flex-col items-stretch gap-1.5">
                        {tuition.approvalStatus === "pending" && (
                          <>
                            <Button type="button" disabled={updatingId !== null} onClick={() => changeStatus(tuition._id, "approved")} className="bg-emerald-600 text-white hover:bg-emerald-700">Approve</Button>
                            <Button type="button" disabled={updatingId !== null} onClick={() => changeStatus(tuition._id, "rejected")} className="bg-red-600 text-white hover:bg-red-700">Reject</Button>
                          </>
                        )}
                        {tuition.approvalStatus === "approved" && <Button type="button" variant="outline" disabled={updatingId !== null} onClick={() => changeStatus(tuition._id, "rejected")} className="border-amber-200 text-amber-700">Revoke</Button>}
                        {tuition.approvalStatus === "rejected" && <Button type="button" variant="outline" disabled={updatingId !== null} onClick={() => changeStatus(tuition._id, "approved")} className="border-blue-100 text-blue-700">Reinstate</Button>}
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
