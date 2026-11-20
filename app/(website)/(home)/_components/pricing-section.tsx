import {
  ArrowUpRight,
  Check,
  Crown,
  GraduationCap,
  Presentation,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const plans = [
  {
    audience: "Tutors",
    description: "Share what you know. Help more students find their way.",
    icon: Presentation,
    price: 15,
    freeFeatures: [
      "Create up to 2 tuition posts",
      "Build your tutor profile",
      "Receive and manage applications",
    ],
    proFeatures: [
      "Create unlimited tuition posts",
      "Everything in the Free plan",
      "Pro tutor badge",
    ],
  },
  {
    audience: "Students",
    description: "Find your next mentor and take learning a little further.",
    icon: GraduationCap,
    price: 10,
    freeFeatures: [
      "Browse approved tuitions",
      "Apply for tuition batches",
      "Track your application status",
    ],
    proFeatures: ["Everything in the Free plan", "Priority booking"],
  },
]

export default function PricingSection() {
  return (
    <section
      id="plans"
      aria-labelledby="pricing-heading"
      className="rounded-3xl border border-blue-200 bg-linear-to-br from-blue-100 to-sky-100 px-5 py-8 shadow-md shadow-blue-950/5 sm:p-8 lg:p-10"
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold tracking-widest text-blue-600 uppercase">
          Room to grow
        </p>
        <h2
          id="pricing-heading"
          className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl"
        >
          Pricing & Plans
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start for free. Go Pro when you are ready to teach or learn more.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.audience}
            className="rounded-2xl border border-blue-200/70 bg-white/45 p-4 sm:p-5"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <plan.icon aria-hidden="true" className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-950">
                  For {plan.audience}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="h-full rounded-2xl border border-blue-100 bg-white py-6 text-slate-900 shadow-sm ring-0 shadow-blue-950/3">
                <CardContent className="flex h-full flex-col px-5">
                  <h4 className="text-lg font-bold text-blue-950">Free Plan</h4>
                  <p className="mt-4 text-4xl font-bold tracking-tight text-blue-950">
                    $0
                    <span className="ml-2 text-xs font-normal tracking-normal text-slate-500">
                      USD
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    A simple place to start
                  </p>
                  <Separator className="my-5 bg-blue-100" />
                  <ul className="mb-7 space-y-3">
                    {plan.freeFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-1 size-4 shrink-0 text-blue-600"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    disabled
                    variant="secondary"
                    className="mt-auto h-11 w-full rounded-xl bg-slate-100 text-slate-600 disabled:opacity-80"
                  >
                    Free Plan
                  </Button>
                </CardContent>
              </Card>

              <Card className="h-full rounded-2xl border border-blue-300 bg-white py-6 text-slate-900 shadow-md ring-0 shadow-blue-600/5">
                <CardContent className="flex h-full flex-col px-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-blue-950">
                      <Crown
                        aria-hidden="true"
                        className="size-5 text-amber-500"
                      />
                      Pro Plan
                    </h4>
                    <Badge className="bg-blue-100 text-blue-700">
                      Go further
                    </Badge>
                  </div>
                  <p className="mt-4 text-4xl font-bold tracking-tight text-blue-700">
                    ${plan.price}
                    <span className="ml-2 text-xs font-normal tracking-normal text-slate-500">
                      USD
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    More possibilities with Pro
                  </p>
                  <Separator className="my-5 bg-blue-100" />
                  <ul className="mb-7 space-y-3">
                    {plan.proFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-1 size-4 shrink-0 text-blue-600"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    disabled
                    className="mt-auto h-11 w-full rounded-xl bg-blue-600 text-white disabled:opacity-65"
                  >
                    Upgrade Plan
                    <ArrowUpRight aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-xs leading-6 text-slate-500">
        Plan preview only. Upgrades and Stripe Checkout will be available later.
      </p>
    </section>
  )
}
