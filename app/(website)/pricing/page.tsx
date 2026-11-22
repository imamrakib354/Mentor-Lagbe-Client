import { PricingPlans } from "./_components/pricing-plans"

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams
  return <PricingPlans canceled={canceled === "1"} />
}
