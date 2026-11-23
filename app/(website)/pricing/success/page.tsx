import Link from "next/link"
import { redirect } from "next/navigation"
import { CircleCheck, Info } from "lucide-react"
import type Stripe from "stripe"
import type { Metadata } from "next"

import { buttonVariants } from "@/components/ui/button"
import { checkoutVerify } from "@/lib/actions/payments"
import { getSession } from "@/lib/core/server"
import { stripe } from "@/lib/stripe"

export const metadata: Metadata = {
  title: "Payment Confirmation",
  robots: { index: false, follow: false },
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  if (!session_id) redirect("/pricing")

  const userSession = await getSession()
  if (!userSession?.user) {
    redirect("/sign-in")
  }

  let checkout: Stripe.Checkout.Session | null = null
  try {
    checkout = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    })
  } catch {
    // Show a neutral message if Stripe cannot be reached or the session is invalid.
  }
  if (checkout && checkout.metadata?.userId !== userSession.user.id) redirect("/pricing")

  const paid = checkout?.status === "complete" && checkout.payment_status === "paid"
  let activated = false
  if (paid) {
    try {
      activated = await checkoutVerify(session_id)
    } catch {
      // Keep the receipt visible if the backend is unavailable.
    }
  }

  const transactionId = typeof checkout?.payment_intent === "string"
    ? checkout.payment_intent
    : checkout?.payment_intent?.id
  const amount = checkout?.amount_total == null
    ? "Unavailable"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: checkout.currency || "usd",
      }).format(checkout.amount_total / 100)

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-xl shadow-blue-950/5 sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {paid ? <CircleCheck aria-hidden="true" className="size-8" /> : <Info aria-hidden="true" className="size-8" />}
        </span>
        <h1 className="mt-6 text-3xl font-bold text-blue-950">{activated ? "Upgrade successful!" : paid ? "Payment received" : checkout ? "Payment not completed" : "Could not check payment"}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {activated ? "Your payment was recorded and premium access is active." : paid ? "Your payment was received, but we could not confirm premium activation. Refresh this page to try again. You do not need to pay again." : checkout ? "Stripe has not confirmed this payment. Please check your payment status before trying again." : "We could not check your payment with Stripe. Please try again later before making another payment."}
        </p>
        {paid && checkout && (
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-left">
            <h2 className="font-bold text-blue-950">Payment details</h2>
            <dl className="mt-3 divide-y divide-blue-100 text-sm">
              {[
                ["Plan", checkout.line_items?.data[0]?.description || "Pro Plan"],
                ["Amount paid", amount],
                ["Checkout date (UTC)", new Date(checkout.created * 1000).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })],
                ["Email", checkout.customer_details?.email || checkout.customer_email || userSession.user.email],
                ["Transaction ID", transactionId || "Unavailable"],
                ["Checkout session", checkout.id],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="break-all text-slate-800 sm:text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <Link href={activated ? "/dashboard" : "/pricing"} className={`${buttonVariants()} mt-8 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700`}>{activated ? "Go to dashboard" : "Back to pricing"}</Link>
      </section>
    </div>
  )
}
