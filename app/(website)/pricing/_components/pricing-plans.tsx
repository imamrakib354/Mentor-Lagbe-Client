"use client"

import Link from "next/link"
import { Check, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CheckoutButton } from "@/components/shared/checkout-button"
import { useSession } from "@/lib/auth-client"
import { pricingPlans } from "@/lib/data/pricing-plans"
import { cn } from "@/lib/utils"

export function PricingPlans({ canceled }: { canceled: boolean }) {
  const { data: session, isPending } = useSession()
  const role = session?.user?.role

  return (
    <div className="min-h-full bg-gradient-to-br from-[#f5f8ff] via-[#edf3ff] to-blue-100 px-4 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="mb-5 h-1.5 w-16 rounded-full bg-blue-400" />
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">Plans for every journey</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">Pricing &amp; Plans</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Choose a plan that fits you. Start free, or explore Pro plans designed for tutors and students.</p>
        </div>

        {canceled && <p role="status" className="mt-9 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Checkout was canceled. You can try again whenever you are ready.</p>}
        <div className="mt-9 rounded-xl border border-blue-200 bg-white/70 px-4 py-3 text-sm leading-6 text-blue-950" aria-live="polite">
          {isPending ? "Checking your account..." : role === "tutor" || role === "student" ? `You are signed in as a ${role}. The ${role === "tutor" ? "Tutor" : "Student"} Pro plan is designed for your role.` : session?.user ? "Pro plans are designed for student and tutor accounts." : <>Sign in to see the plan for your role. <Link href="/sign-in" className="font-semibold text-blue-700 underline underline-offset-2">Sign in</Link></>}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.flatMap((group) => [group.free, group.pro].map((plan) => {
            const isPro = plan.price > 0
            const isMatchingRole = role === group.role
            return (
              <article key={plan.name} className={cn("flex h-full flex-col rounded-3xl border bg-white/85 p-6 shadow-lg shadow-blue-950/5", isPro ? "border-blue-500 bg-blue-50/70" : "border-blue-100")}>
                <div className="flex min-h-7 items-center justify-between gap-2">
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">{group.audience}</span>
                  {"badge" in plan && <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">{plan.badge}</span>}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-blue-950">{plan.name}</h2>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-600"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-blue-500" />{feature}</li>)}
                </ul>
                <div className="mt-7 border-t border-blue-100 pt-5">
                  <p className="text-3xl font-extrabold text-blue-950">${plan.price}<span className="ml-1 text-sm font-semibold text-slate-500">{isPro ? " · one-time" : " · free"}</span></p>
                  <div className="mt-5">
                    {isPro ? <CheckoutButton role={group.role} label="Upgrade Now" /> : <Button disabled variant="outline" className="h-11 w-full rounded-xl border-blue-200 bg-white font-bold text-blue-950 disabled:opacity-100">Get Started Free</Button>}
                  </div>
                  <p className="mt-3 min-h-5 text-center text-xs text-slate-500">{isPro && isMatchingRole ? "Your role’s plan" : isPro && role && !isMatchingRole ? `For ${group.audience.toLowerCase()} only` : !isPro ? "Free plan" : ""}</p>
                </div>
              </article>
            )
          }))}
        </div>
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/60 p-5 text-sm leading-6 text-slate-600">
          <Sparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <p>Pro plans are a one-time payment in USD. Some listed benefits are still in development, and payments do not yet activate premium access.</p>
        </div>
      </div>
    </div>
  )
}
