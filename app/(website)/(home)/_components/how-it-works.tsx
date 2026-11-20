import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const workflows = [
  {
    audience: "Students",
    title: "Find your next learning opportunity",
    icon: GraduationCap,
    steps: [
      {
        title: "Browse",
        description: "Find tuitions by subject, class, or learning mode.",
        icon: Search,
      },
      {
        title: "Explore",
        description: "Read the details and get to know your tutor.",
        icon: FileText,
      },
      {
        title: "Apply",
        description: "Share your schedule and learning goals.",
        icon: Send,
      },
      {
        title: "Track & learn",
        description: "Follow your application and get ready to learn.",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    audience: "Tutors",
    title: "Turn your knowledge into opportunity",
    icon: Users,
    steps: [
      {
        title: "Create profile",
        description: "Sign up as a tutor and introduce yourself.",
        icon: UserRound,
      },
      {
        title: "Post tuition",
        description: "Add your subject, schedule, and batch details.",
        icon: BookOpen,
      },
      {
        title: "Get approved",
        description: "An admin reviews your post before it goes live.",
        icon: ShieldCheck,
      },
      {
        title: "Meet students",
        description: "Review applications and accept your learners.",
        icon: Users,
      },
    ],
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="rounded-3xl border border-blue-200 bg-white px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10"
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold tracking-widest text-blue-600 uppercase">
          A clear path forward
        </p>
        <h2
          id="how-heading"
          className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl"
        >
          How MentorLagbe Works
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A few simple steps to bring the right students and tutors together.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {workflows.map((workflow) => (
          <Card
            key={workflow.audience}
            className="gap-0 rounded-2xl border border-blue-100 bg-white py-0 text-slate-900 shadow-sm ring-0 shadow-blue-950/3"
          >
            <CardHeader className="flex flex-row items-center gap-3 border-b border-blue-100 bg-blue-50/80 p-5 sm:p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <workflow.icon aria-hidden="true" className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-950">
                  For {workflow.audience}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {workflow.title}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <ol className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-6">
                {workflow.steps.map((step, index) => (
                  <li key={step.title} className="relative text-center">
                    <div className="relative mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <step.icon aria-hidden="true" className="size-6" />
                      <Badge className="absolute -right-1 -bottom-1 size-5 rounded-full bg-blue-600 p-0 text-[10px] text-white">
                        {index + 1}
                      </Badge>
                    </div>
                    {index < workflow.steps.length - 1 && (
                      <ArrowRight
                        aria-hidden="true"
                        className="absolute top-5 -right-5 hidden size-4 text-blue-300 sm:block"
                      />
                    )}
                    <h4 className="text-sm font-bold text-blue-950">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
