import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/core/server"

export async function POST() {
  const userSession = await getSession()
  const user = userSession?.user

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in before upgrading." },
      { status: 401 }
    )
  }

  if (user.role !== "student" && user.role !== "tutor") {
    return NextResponse.json(
      { error: "This plan is only for students and tutors." },
      { status: 403 }
    )
  }

  try {
    // Select price according to logged-in user's role
    const priceId =
      user.role === "student"
        ? process.env.STRIPE_STUDENT_PRICE_ID
        : process.env.STRIPE_TUTOR_PRICE_ID

    if (!priceId) {
      throw new Error("Stripe Price ID is missing")
    }

    const origin = process.env.APP_URL ?? "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      mode: "payment",

      metadata: {
        userId: user.id,
        role: user.role,
        plan: "pro",
      },

      customer_email: user.email,

      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/pricing?canceled=1`,

      integration_identifier: "mentorlagbe_web_001",
    })

    if (!session.url) {
      throw new Error("Checkout URL is unavailable")
    }

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
