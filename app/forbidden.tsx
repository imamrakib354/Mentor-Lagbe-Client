import Link from "next/link"
import { ArrowLeft, Home, ShieldAlert } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f0f7ff] px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-lg shadow-blue-950/5 sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ShieldAlert aria-hidden="true" className="size-8" />
        </div>
        <p className="mt-6 text-sm font-bold tracking-widest text-blue-600">
          ERROR 403
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950">
          Access denied
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your account does not have permission to view this page. Please return
          to your dashboard or go back to the homepage.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className={cn(buttonVariants(), "h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700")}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            My dashboard
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl border-blue-100 bg-white px-5 font-semibold text-blue-950 hover:bg-blue-50")}
          >
            <Home aria-hidden="true" className="size-4" />
            Home
          </Link>
        </div>
      </section>
    </main>
  )
}
