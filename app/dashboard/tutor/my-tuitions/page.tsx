"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getTutorTuitions } from "@/lib/actions/tuitions"
import { useSession } from "@/lib/auth-client"
import type { ApprovalStatus, Tuition } from "@/lib/types/tuition"

function approvalStatusClass(status: ApprovalStatus) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700"
  if (status === "rejected") return "bg-red-50 text-red-700"
  return "bg-amber-50 text-amber-700"
}

export default function MyTuitionsPage() {
  const { data: session, isPending: isSessionPending } = useSession()
  const [tuitions, setTuitions] = useState<Tuition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTuitions() {
      if (isSessionPending) return

      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const tutorTuitions = await getTutorTuitions(session.user.id)
        setTuitions(tutorTuitions)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not load your tuitions."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadTuitions()
  }, [isSessionPending, session?.user?.id])

  function toggleActiveStatus(tuitionId: string, isActive: boolean) {
    setTuitions((currentTuitions) =>
      currentTuitions.map((tuition) =>
        tuition._id === tuitionId ? { ...tuition, isActive } : tuition
      )
    )
  }

  return (
    <div>
      <header className="mb-6 rounded-3xl border border-blue-100 bg-white px-5 py-7 shadow-sm shadow-blue-950/5 sm:px-7 sm:py-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-blue-600 uppercase">
              Tuition management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950">
              My Tuitions
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage your created tuition listings and toggle their availability.
            </p>
          </div>
          <Button
            render={<Link href="/dashboard/tutor/post-tuition" />}
            className="h-10 w-fit bg-blue-600 px-4 text-white hover:bg-blue-700"
          >
            <Plus aria-hidden="true" />
            Post New Tuition
          </Button>
        </div>
      </header>

      <section className="rounded-3xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-950/5 sm:p-4">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-600">
            <Loader2 aria-hidden="true" className="size-5 animate-spin text-blue-600" />
            Loading your tuitions...
          </div>
        ) : tuitions.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BookOpen aria-hidden="true" className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-blue-950">
              No tuitions posted yet
            </h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">
              Create your first tuition listing to start reaching students.
            </p>
            <Button
              render={<Link href="/dashboard/tutor/post-tuition" />}
              className="mt-5 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus aria-hidden="true" />
              Post New Tuition
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50/70">
                <TableRow className="border-blue-100 hover:bg-blue-50/70">
                  <TableHead className="min-w-55 px-4 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                    Tuition
                  </TableHead>
                  <TableHead className="min-w-44 px-4 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                    Subject & level
                  </TableHead>
                  <TableHead className="min-w-28 px-4 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                    Monthly fee
                  </TableHead>
                  <TableHead className="min-w-35 px-4 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                    Approval status
                  </TableHead>
                  <TableHead className="min-w-32 px-4 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                    Active status
                  </TableHead>
                  <TableHead className="min-w-31 px-4 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tuitions.map((tuition) => (
                  <TableRow
                    key={tuition._id}
                    className="border-blue-100 hover:bg-blue-50/30"
                  >
                    <TableCell className="px-4 py-4 whitespace-normal">
                      <p className="font-semibold text-blue-950">{tuition.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {tuition.location}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-normal">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {tuition.subject}
                      </span>
                      <p className="mt-2 text-xs text-slate-500">
                        Class {tuition.classLevel}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-semibold text-blue-950">
                      ৳{Number(tuition.monthlyFee).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${approvalStatusClass(tuition.approvalStatus)}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {tuition.approvalStatus}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <Switch
                          checked={tuition.isActive}
                          onCheckedChange={(isActive) =>
                            toggleActiveStatus(tuition._id, isActive)
                          }
                          aria-label={`Mark ${tuition.title} as ${tuition.isActive ? "closed" : "active"}`}
                          className="data-checked:bg-emerald-500 data-unchecked:bg-slate-300"
                        />
                        <span
                          className={
                            tuition.isActive
                              ? "text-xs font-semibold text-emerald-600"
                              : "text-xs font-semibold text-rose-600"
                          }
                        >
                          {tuition.isActive ? "Active" : "Closed"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          render={<Link href={`/tuitions/${tuition._id}`} />}
                          size="sm"
                          variant="secondary"
                          aria-label={`View ${tuition.title}`}
                          className="bg-blue-50 text-blue-700"
                        >
                          <Eye aria-hidden="true" />
                          <span className="hidden lg:inline">View</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled
                          title="Edit will be added later"
                          aria-label={`Edit ${tuition.title}`}
                          className="bg-blue-50 text-blue-700"
                        >
                          <Pencil aria-hidden="true" />
                          <span className="hidden lg:inline">Edit</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled
                          title="Delete will be added later"
                          aria-label={`Delete ${tuition.title}`}
                        >
                          <Trash2 aria-hidden="true" />
                          <span className="hidden lg:inline">Delete</span>
                        </Button>
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
