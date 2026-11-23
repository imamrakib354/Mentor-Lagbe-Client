import { PricingPlans } from "./_components/pricing-plans"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Explore free and one-time Pro plans for students and tutors.",
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams
  return <PricingPlans canceled={canceled === "1"} />
}
