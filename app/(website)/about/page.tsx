import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react"

import HowItWorks from "../(home)/_components/how-it-works"
import { buttonVariants } from "@/components/ui/button"

const values = [
  { icon: GraduationCap, title: "For students", description: "Explore tuition listings and find a learning experience that fits your goals." },
  { icon: BookOpen, title: "For tutors", description: "Share your expertise, create tuition listings, and manage applications." },
  { icon: ShieldCheck, title: "Reviewed listings", description: "Tuition posts are reviewed by an admin before appearing in the public browse page." },
]

export default function AboutPage() {
  return (
    <div className="bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl space-y-12">
        <section className="max-w-3xl">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">About MentorLagbe</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Better connections for brighter learning.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            MentorLagbe brings students and tutors together in one place. Discover tuition opportunities, share your knowledge, and take the next step in your learning journey.
          </p>
          <Link href="/tuitions" className={`${buttonVariants()} mt-7 rounded-xl`}>
            Browse tuitions <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
              <Icon aria-hidden="true" className="size-7 text-primary" />
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>

        <HowItWorks />

        <section className="rounded-3xl bg-secondary p-7 text-secondary-foreground sm:p-10">
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-sm leading-6">Find your next tuition or share what you know with students.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/tuitions" className={`${buttonVariants()} rounded-xl`}>Browse tuitions</Link>
            <Link href="/sign-up" className={`${buttonVariants({ variant: "outline" })} rounded-xl`}>Create an account</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
