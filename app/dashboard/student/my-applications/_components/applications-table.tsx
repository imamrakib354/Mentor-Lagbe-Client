"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Application, ApplicationStatus } from "@/lib/types/application"

const statuses = ["all", "accepted", "pending", "rejected"] as const

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [status, setStatus] = useState<(typeof statuses)[number]>("all")
  const [search, setSearch] = useState("")
  const filtered = applications.filter((application) =>
    (status === "all" || application.status === status) &&
    `${application.tuitionTitle} ${application.tutorName} ${application.subject}`
      .toLowerCase().includes(search.trim().toLowerCase())
  )

  function statusClass(value: ApplicationStatus) {
    if (value === "accepted") return "bg-emerald-50 text-emerald-700"
    if (value === "rejected") return "bg-red-50 text-red-700"
    return "bg-amber-50 text-amber-700"
  }

  return (
    <div>
      <header className="mb-6 rounded-3xl border border-blue-100 bg-gradient-to-r from-white to-blue-100 p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Applications</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">My Applications</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Keep track of the tuitions you have applied for and their current status.</p>
      </header>

      <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <Button key={item} type="button" onClick={() => setStatus(item)}
                aria-pressed={status === item}
                className={status === item ? "h-10 rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700" : "h-10 rounded-full bg-blue-50 px-4 text-blue-700 hover:bg-blue-100"}>
                <span className="capitalize">{item}</span>
                {item === "all" ? applications.length : applications.filter((application) => application.status === item).length}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input aria-label="Search applications" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications..." className="h-10 rounded-xl border-blue-100 pl-9" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="font-semibold text-blue-950">{applications.length ? "No matching applications" : "No applications yet"}</h2>
            <p className="mt-2 text-sm text-slate-500">{applications.length ? "Try a different search or status." : "Browse tuitions to find your next learning opportunity."}</p>
            {!applications.length && <Link href="/tuitions" className="mt-4 inline-block font-semibold text-blue-600">Browse tuitions</Link>}
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
                {filtered.map((application) => (
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
                    <TableCell>{new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                    <TableCell><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(application.status)}`}>{application.status}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button nativeButton={false} render={<Link href={`/tuitions/${application.tuitionId}`} />} variant="outline" className="border-blue-100 text-blue-700">View</Button>
                        {application.status === "pending" && <Button type="button" disabled title="Cancellation coming soon" variant="outline">Cancel</Button>}
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
