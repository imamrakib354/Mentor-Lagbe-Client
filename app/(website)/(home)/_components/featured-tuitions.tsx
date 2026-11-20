import {
  ArrowRight,
  Atom,
  BookOpen,
  CodeXml,
  FlaskConical,
  GraduationCap,
  Sigma,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// UI preview only. Replace these records with approved, active backend listings.
const tuitions = [
  {
    title: "Higher Math Mastery Batch",
    subject: "Higher Math",
    classLevel: "HSC (XI–XII)",
    mode: "Online",
    fee: 2500,
    tutor: "Arif Hasan",
    initials: "AH",
    tutorTitle: "Math Tutor",
    icon: Sigma,
  },
  {
    title: "HSC Physics Intensive Batch",
    subject: "Physics",
    classLevel: "HSC (XI–XII)",
    mode: "Online",
    fee: 2900,
    tutor: "Nusrat Jahan",
    initials: "NJ",
    tutorTitle: "Physics Tutor",
    icon: Atom,
  },
  {
    title: "Programming Fundamentals",
    subject: "Programming",
    classLevel: "HSC & Admission",
    mode: "Online",
    fee: 3000,
    tutor: "Tanvir Rahman",
    initials: "TR",
    tutorTitle: "Programming Mentor",
    icon: CodeXml,
  },
  {
    title: "IELTS Preparation Batch",
    subject: "IELTS",
    classLevel: "Open",
    mode: "Online",
    fee: 4000,
    tutor: "Fariha Chowdhury",
    initials: "FC",
    tutorTitle: "IELTS Instructor",
    icon: GraduationCap,
  },
  {
    title: "HSC Chemistry Crash Course",
    subject: "Chemistry",
    classLevel: "HSC (XI–XII)",
    mode: "Offline",
    fee: 2800,
    tutor: "Mahmudul Karim",
    initials: "MK",
    tutorTitle: "Chemistry Tutor",
    icon: FlaskConical,
  },
  {
    title: "SSC Math Advance Batch",
    subject: "Mathematics",
    classLevel: "SSC (IX–X)",
    mode: "Offline",
    fee: 1800,
    tutor: "Sadia Akter",
    initials: "SA",
    tutorTitle: "Math Tutor",
    icon: BookOpen,
  },
]

export default function FeaturedTuitions() {
  return (
    <section
      aria-labelledby="featured-heading"
      className="rounded-3xl border border-blue-200 bg-white px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10"
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-blue-600 uppercase">
            Your next learning opportunity
          </p>
          <h2
            id="featured-heading"
            className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl"
          >
            Featured Tuitions
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Find a subject, a mentor, and a learning path that feels right for
            you.
          </p>
        </div>
        <Button
          disabled
          variant="secondary"
          className="h-10 w-fit rounded-xl bg-blue-100 text-blue-700 disabled:opacity-70"
        >
          Browse More Tuitions
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>

      <p className="mb-5 text-xs text-slate-500">
        Sample listings for this design preview. Live tuitions will appear here
        later.
      </p>

      <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tuitions.map((tuition) => (
          <Card
            key={tuition.title}
            className="h-full gap-5 rounded-2xl border border-blue-100 bg-white py-6 text-slate-900 shadow-sm ring-0 shadow-blue-950/3"
          >
            <CardContent className="flex h-full flex-col px-5 sm:px-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <tuition.icon aria-hidden="true" className="size-6" />
                </div>
                <Badge
                  variant="secondary"
                  className={
                    tuition.mode === "Online"
                      ? "border-sky-100 bg-sky-50 text-sky-700"
                      : "border-amber-100 bg-amber-50 text-amber-700"
                  }
                >
                  {tuition.mode}
                </Badge>
              </div>
              <h3 className="text-lg leading-7 font-bold text-blue-950">
                {tuition.title}
              </h3>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-slate-500">Subject</dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {tuition.subject}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Class level</dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {tuition.classLevel}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 mb-5 text-xl font-bold text-blue-700">
                ৳{tuition.fee.toLocaleString("en-US")}
                <span className="ml-1 text-xs font-normal text-slate-500">
                  / month
                </span>
              </p>
              <Separator className="mt-auto bg-blue-100" />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-blue-100 text-xs font-bold text-blue-700">
                      {tuition.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-blue-950">
                      {tuition.tutor}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {tuition.tutorTitle}
                    </p>
                  </div>
                </div>
                <Button
                  disabled
                  variant="secondary"
                  className="h-10 rounded-xl bg-blue-50 px-3 text-xs font-semibold text-blue-700 disabled:opacity-70"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
