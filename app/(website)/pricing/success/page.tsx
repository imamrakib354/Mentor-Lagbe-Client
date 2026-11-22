import Link from "next/link"
import { redirect } from "next/navigation"
import { CircleCheck, Info } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getSession } from "@/lib/core/server"
import { stripe } from "@/lib/stripe"

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

  let paid = false
  let couldCheck = false
  let checkoutUserId: string | undefined
  try {
    const checkout = await stripe.checkout.sessions.retrieve(session_id)
    checkoutUserId = checkout.metadata?.userId
    couldCheck = true
    paid = checkout.status === "complete" && checkout.payment_status === "paid"
  } catch {
    // Show a neutral message if Stripe cannot be reached or the session is invalid.
  }
  if (couldCheck && checkoutUserId !== userSession.user.id) redirect("/pricing")

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-xl shadow-blue-950/5 sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {paid ? <CircleCheck aria-hidden="true" className="size-8" /> : <Info aria-hidden="true" className="size-8" />}
        </span>
        <h1 className="mt-6 text-3xl font-bold text-blue-950">{paid ? "Payment successful!" : couldCheck ? "Payment not completed" : "Could not check payment"}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {paid ? "Your payment was successful. Premium access is not activated yet." : couldCheck ? "Stripe has not confirmed this payment. Please check your payment status before trying again." : "We could not check your payment with Stripe. Please try again later before making another payment."}
        </p>
        <Link href="/pricing" className={`${buttonVariants()} mt-8 w-full rounded-xl bg-blue-600 text-white`}>Back to pricing</Link>
      </section>
    </div>
  )
}
