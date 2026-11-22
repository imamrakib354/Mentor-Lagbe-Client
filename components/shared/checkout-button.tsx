"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
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
  const className = "h-11 w-full rounded-xl bg-blue-600 font-bold text-white"

  if (!isPending && !session?.user) {
    return (
      <Link href="/sign-in" className={cn(buttonVariants(), className)}>
        Sign in to upgrade
      </Link>
    )
  }

  return (
    <form action="/api/checkout_sessions" method="POST">
      <Button type="submit" disabled={isPending || session?.user?.role !== role} className={className}>
        {label}
      </Button>
    </form>
  )
}
