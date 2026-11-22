import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Send,
  Star,
  UserRound,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ApplicationDialog } from "./_components/application-dialog"
import { SaveTuitionButton } from "./_components/save-tuition-button"
import { getStudentApplications } from "@/lib/actions/application"
import { getSavedTuitions } from "@/lib/actions/saved-tuitions"
import { getTuitionById } from "@/lib/actions/tuitions"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { getTutorProfile } from "@/lib/helpers/getTutorProfile"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const details = await getTuitionById(id)

  if (!details) notFound()

  const { tuition } = details
  const currentUser = await getCurrentUser()
  const tutor = currentUser ? await getTutorProfile(tuition._id).catch(() => null) : null
  const canApply = currentUser?.role === "student"
  let hasApplied = false
  let applicationCheckFailed = false
  let bookmarkId: string | null | undefined
  if (canApply && currentUser) {
    try {
      const listing = await getStudentApplications(currentUser.id)
      hasApplied = listing.applications.some((application) => application.tuitionId === tuition._id)
    } catch {
      applicationCheckFailed = true
    }
    try {
      const saved = await getSavedTuitions(currentUser.id)
      bookmarkId = saved.find((item) => item.tuitionId === tuition._id)?._id ?? null
    } catch {
      bookmarkId = undefined
    }
  }
  const tutorName = tutor?.name || "your mentor"
  const tutorEmail = tutor?.email
  const tutorInitial = tutorName.trim().charAt(0).toUpperCase() || "T"
  const applicationMessage = currentUser
    ? "Only student accounts can apply for a tuition."
    : "Sign in with a student account to apply."

  return (
    <div className="min-h-screen bg-[#f0f7ff] px-3 py-6 sm:px-5 sm:py-8">
    <div className="mx-auto max-w-7xl">
      <Link
        href="/tuitions"
        className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to All Tuitions
      </Link>

      <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5">
            <div className="aspect-[16/8] bg-blue-50">
              {/* Tuition banners use tutor-provided public URLs. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tuition.bannerImage}
                alt={`${tuition.title} banner`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {tuition.subject}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {tuition.classLevel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                  {tuition.approvalStatus}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-blue-950 sm:text-4xl">
                {tuition.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {tutor?.name && <span className="inline-flex items-center gap-1.5">
                  <UserRound aria-hidden="true" className="size-4 text-blue-600" />
                  Tutor: <strong className="text-blue-950">{tutorName}</strong>
                </span>}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-4 text-blue-600" />
                  {tuition.daysPerWeek} days per week
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 aria-hidden="true" className="size-4 text-blue-600" />
                  Posted {formatDate(tuition.createdAt)}
                </span>
              </div>

              <div className="mt-6 border-t border-blue-100 pt-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BookOpen aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      About This Tuition
                    </h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {tuition.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-950/5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Star aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-blue-950">
                  Student Feedback & Reviews
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Reviews are coming soon. Students with approved applications
                  will be able to share their experience.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled
              className="mt-5 border-blue-100 text-blue-700"
            >
              <Star aria-hidden="true" />
              Write a review
            </Button>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6">
              <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                Monthly tuition fee
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-3xl font-bold text-blue-950">
                  ৳{Number(tuition.monthlyFee).toLocaleString("en-US")}
                  <span className="ml-1 text-base font-medium text-slate-600">
                    / month
                  </span>
                </p>
                {canApply && currentUser && (
                  <SaveTuitionButton studentId={currentUser.id} tuitionId={tuition._id} bookmarkId={bookmarkId} />
                )}
              </div>
            </div>

            <dl className="divide-y divide-blue-100 p-5">
              <DetailRow icon={<BookOpen />} label="Subject" value={tuition.subject} />
              <DetailRow
                icon={<UserRound />}
                label="Class level"
                value={tuition.classLevel}
              />
              <DetailRow
                icon={<Monitor />}
                label="Delivery mode"
                value={tuition.mode}
              />
              <DetailRow
                icon={<MapPin />}
                label="Location"
                value={tuition.location}
              />
              <DetailRow
                icon={<CalendarDays />}
                label="Weekly classes"
                value={`${tuition.daysPerWeek} days / week`}
              />
            </dl>

            <div className="border-t border-blue-100 p-5">
              {canApply && currentUser && !hasApplied && !applicationCheckFailed ? (
                <ApplicationDialog tuition={tuition} student={currentUser} tutorName={tutorName} />
              ) : (
                <Button type="button" disabled className="h-12 w-full bg-blue-600 text-base font-semibold text-white">
                  <Send aria-hidden="true" />
                  {hasApplied ? "Already Applied" : "Apply Now"}
                </Button>
              )}
              {applicationCheckFailed && (
                <p className="mt-3 text-center text-xs leading-5 text-red-600">
                  Could not check your applications. Please refresh and try again.
                </p>
              )}
              {!canApply && (
                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                  {applicationMessage}
                </p>
              )}
              <p className="mt-4 border-t border-blue-100 pt-4 text-center text-xs leading-5 text-slate-500">
                Applications are reviewed by MentorLagbe before approval.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-950/5">
            <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">
              Your mentor
            </p>
            {!currentUser ? (
              <p className="mt-4 text-sm text-slate-600">
                <Link href="/sign-in" className="font-semibold text-blue-700 hover:underline">Sign in</Link> to view the mentor&apos;s profile.
              </p>
            ) : !tutor ? (
              <p className="mt-4 text-sm text-slate-600">Could not load the mentor profile. Please try again later.</p>
            ) : (
              <>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="size-14">
                {tutor?.image && (
                  <AvatarImage src={tutor.image} alt={tutorName} />
                )}
                <AvatarFallback className="bg-blue-600 text-lg font-bold text-white">
                  {tutorInitial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-blue-950">
                  {tutorName}
                </h2>
                <p className="text-sm text-slate-500">Tutor</p>
              </div>
            </div>
            {tutorEmail && <div className="mt-5 flex items-center gap-2 border-t border-blue-100 pt-4 text-sm text-slate-600">
              <Mail aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
              <span className="truncate">{tutorEmail}</span>
            </div>}
            {tutor?.phone && (
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <Phone aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
                {tutor.phone}
              </p>
            )}
            {tutor?.bio && <p className="mt-4 border-t border-blue-100 pt-4 text-sm leading-6 whitespace-pre-line text-slate-600">{tutor.bio}</p>}
            {(tutor?.education || tutor?.experience || tutor?.expertise) && (
              <div className="mt-4 space-y-2 border-t border-blue-100 pt-4 text-sm text-slate-600">
                {tutor?.education && <p>{tutor.education}</p>}
                {tutor?.experience && <p>{tutor.experience}</p>}
                {tutor?.expertise && <p>{tutor.expertise}</p>}
              </div>
            )}
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="text-blue-600">{icon}</span>
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="ml-auto text-right text-sm font-semibold text-blue-950">
        {value}
      </dd>
    </div>
  )
}
