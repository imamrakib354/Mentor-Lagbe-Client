import { Atom, CodeXml, GraduationCap, Quote, Sigma, Star } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const subjects = [
  { name: "Math", icon: Sigma },
  { name: "Physics", icon: Atom },
  { name: "Programming", icon: CodeXml },
  { name: "IELTS", icon: GraduationCap },
]

// Example content for the UI, not verified platform activity or real reviews.
const statistics = [
  { value: "25K+", label: "Students" },
  { value: "3.5K+", label: "Tutors" },
  { value: "6.8K+", label: "Tuitions" },
]

const testimonials = [
  {
    name: "Rafi Islam",
    role: "HSC Student",
    initials: "RI",
    quote:
      "Finding a physics tutor felt simple. The batch details helped me choose a learning path that suited me.",
  },
  {
    name: "Drishti Rahman",
    role: "Tutor",
    initials: "DR",
    quote:
      "A dedicated place to share my batches and connect with students makes teaching feel more organized.",
  },
]

export default function CommunitySection() {
  return (
    <section
      aria-labelledby="community-heading"
      className="rounded-3xl border border-blue-200 bg-sky-100 px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10"
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold tracking-widest text-blue-600 uppercase">
          Learn, teach, belong
        </p>
        <h2
          id="community-heading"
          className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl"
        >
          A Community Built for Learning
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Great subjects. Shared goals. A little inspiration for your journey.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_0.9fr_1.15fr]">
        <Card className="gap-5 rounded-2xl border border-blue-100 bg-white py-6 text-slate-900 shadow-sm ring-0 shadow-blue-950/3">
          <CardHeader className="px-5 sm:px-6">
            <h3 className="text-lg font-bold text-blue-950">Top Subjects</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              A world of possibilities, one subject at a time.
            </p>
          </CardHeader>
          <CardContent className="px-5 sm:px-6">
            <ul className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <li key={subject.name}>
                  <Badge
                    variant="outline"
                    className="h-auto min-h-14 w-full flex-wrap gap-2 rounded-xl border-blue-100 bg-blue-50/60 px-2 py-3 text-xs font-semibold text-blue-800"
                  >
                    <subject.icon aria-hidden="true" />
                    {subject.name}
                  </Badge>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-6 text-slate-500">
              Preview categories. Available subjects will come from live tuition
              listings.
            </p>
          </CardContent>
        </Card>

        <Card className="gap-5 rounded-2xl border border-blue-100 bg-white py-6 text-slate-900 shadow-sm ring-0 shadow-blue-950/3">
          <CardHeader className="px-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-blue-950">
                Platform Statistics
              </h3>
              <Badge className="bg-blue-50 text-blue-600">Preview</Badge>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              A glimpse of a growing learning community.
            </p>
          </CardHeader>
          <CardContent className="px-5 sm:px-6">
            <dl className="grid grid-cols-3 gap-2">
              {statistics.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-blue-100 bg-blue-50/60 px-1 py-5 text-center"
                >
                  <dt className="text-[11px] text-slate-500">{stat.label}</dt>
                  <dd className="mt-2 text-xl font-bold tracking-tight text-blue-600 sm:text-2xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-6 text-slate-500">
              Example figures for this design only, not live platform totals.
            </p>
          </CardContent>
        </Card>

        <Card className="gap-5 rounded-2xl border border-blue-100 bg-white py-6 text-slate-900 shadow-sm ring-0 shadow-blue-950/3 md:col-span-2 xl:col-span-1">
          <CardHeader className="px-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-blue-950">Testimonials</h3>
              <Badge className="bg-blue-50 text-blue-600">
                Sample feedback
              </Badge>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Stories to inspire the next step.
            </p>
          </CardHeader>
          <CardContent className="space-y-3 px-5 sm:px-6">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="rounded-xl border border-blue-100 bg-blue-50/40 p-4"
              >
                <Quote
                  aria-hidden="true"
                  className="mb-2 size-4 text-blue-400"
                />
                <blockquote className="text-sm leading-6 text-slate-600">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <p className="font-semibold text-blue-950">
                        {testimonial.name}
                      </p>
                      <p className="mt-0.5 text-slate-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <span
                    role="img"
                    aria-label="Sample rating: 5 out of 5 stars"
                    className="flex gap-0.5 text-amber-400"
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        aria-hidden="true"
                        className="size-3 fill-current"
                      />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
