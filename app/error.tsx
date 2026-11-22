"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        <AlertTriangle aria-hidden="true" className="mx-auto size-12 text-primary" />
        <h1 className="mt-6 text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">We couldn&apos;t load this page. Please try again.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()} className="rounded-xl">Try again</Button>
          <Link href="/" className={`${buttonVariants({ variant: "outline" })} rounded-xl`}>Back to home</Link>
        </div>
      </div>
    </main>
  )
}
