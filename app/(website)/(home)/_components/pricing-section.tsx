import Link from "next/link"
import { ArrowRight, Check, Crown, GraduationCap, Headphones, ShieldCheck, UserRound, Zap } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { CheckoutButton } from "@/components/shared/checkout-button"
import { pricingPlans } from "@/lib/data/pricing-plans"
import { cn } from "@/lib/utils"

export default function PricingSection() {
  return (
    <section id="plans" aria-labelledby="pricing-heading" className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-[#edf3ff] to-blue-100 px-4 py-12 sm:px-8 sm:py-14 lg:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-200/30 blur-2xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-9 text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase">Pricing</p>
          <h2 id="pricing-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">Choose Your Plan</h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">Flexible plans for students and tutors on MentorLagbe.</p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {pricingPlans.map((group) => {
            const Icon = group.role === "tutor" ? UserRound : GraduationCap
            return (
              <div key={group.role} className="rounded-3xl border border-white/80 bg-white/60 p-4 shadow-lg shadow-blue-900/5 sm:p-5">
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"><Icon aria-hidden="true" className="size-6" /></span>
                  <div>
                    <h3 className="text-xl font-bold text-blue-950 sm:text-2xl">For {group.audience}</h3>
                    <p className="mt-1 text-sm text-slate-600">{group.description}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[group.free, group.pro].map((plan) => {
                    const isPro = plan.price > 0
                    return (
                      <div key={plan.name} className={cn("flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm", isPro ? "border-blue-500 bg-blue-50/70" : "border-blue-100")}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{plan.name}</span>
                          {"badge" in plan && <span className="flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white"><Crown aria-hidden="true" className="size-3" />{plan.badge}</span>}
                        </div>
                        <p className="mt-4 text-3xl font-extrabold text-blue-950">${plan.price}<span className="ml-1 text-sm font-semibold text-slate-500">{isPro ? " · one-time" : " · free"}</span></p>
                        <ul className="mt-5 mb-7 flex-1 space-y-2.5">
                          {plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-5 text-slate-700"><Check aria-hidden="true" className="size-4 shrink-0 text-blue-500" />{feature}</li>)}
                        </ul>
                        {isPro ? (
                          <CheckoutButton role={group.role} label="Pay with Stripe" />
                        ) : (
                          <Button disabled variant="outline" className="h-11 w-full rounded-xl border-blue-200 bg-white font-bold text-blue-950 disabled:opacity-100">Get Started Free</Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-600">
          <span className="flex items-center gap-2"><ShieldCheck aria-hidden="true" className="size-5 text-blue-600" /> Secure Stripe checkout</span>
          <span className="flex items-center gap-2"><Zap aria-hidden="true" className="size-5 text-blue-600" /> Flexible plans</span>
          <span className="flex items-center gap-2"><Headphones aria-hidden="true" className="size-5 text-blue-600" /> Support for tutors and students</span>
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">Some listed plan features are coming soon. Payments do not yet activate premium access.</p>
        <div className="mt-4 text-center">
          <Link href="/pricing" className={cn(buttonVariants({ variant: "link" }), "font-semibold text-blue-700")}>Explore all plans <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}
