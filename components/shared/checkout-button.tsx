"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { getPremiumById } from "@/lib/actions/premium"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function CheckoutButton({
  role,
  label,
}: {
  role: "student" | "tutor"
  label: string
}) {
  const { data: session, isPending } = useSession()
  const userId = session?.user?.id
  const matchesRole = session?.user?.role === role
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    userId: string
    attempt: number
    status: "premium" | "free" | "error"
  } | null>(null)
  const className = "h-11 w-full rounded-xl bg-blue-600 font-bold text-white"

  useEffect(() => {
    if (isPending || !userId || !matchesRole) return

    let active = true
    getPremiumById(userId).then(
      (premium) => {
        if (active) setResult({ userId, attempt, status: premium ? "premium" : "free" })
      },
      () => {
        if (active) setResult({ userId, attempt, status: "error" })
      }
    )
    return () => { active = false }
  }, [userId, matchesRole, isPending, attempt])

  if (!isPending && !session?.user) {
    return (
      <Link href="/sign-in" className={cn(buttonVariants(), className)}>
        Sign in to upgrade
      </Link>
    )
  }

  const status = result && result.userId === userId && result.attempt === attempt
    ? result.status
    : "checking"

  if (!isPending && matchesRole && status === "error") {
    return (
      <div className="space-y-2 text-center">
        <p role="status" className="text-xs text-red-600">
          Could not check your plan. Checkout is unavailable until it can be verified.
        </p>
        <Button type="button" variant="outline" className="h-11 w-full rounded-xl" onClick={() => setAttempt((value) => value + 1)}>
          Retry plan check
        </Button>
      </div>
    )
  }

  return (
    <form action="/api/checkout_sessions" method="POST">
      <Button type="submit" disabled={isPending || !matchesRole || status !== "free"} className={className}>
        {matchesRole && status === "premium" ? "Already Pro" : matchesRole && status === "checking" ? "Checking your plan..." : label}
      </Button>
    </form>
  )
}
