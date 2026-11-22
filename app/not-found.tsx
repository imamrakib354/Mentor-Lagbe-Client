import Link from "next/link"
import { SearchX } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        <SearchX aria-hidden="true" className="mx-auto size-12 text-primary" />
        <p className="mt-6 text-sm font-bold tracking-widest text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The page you are looking for does not exist or may have moved.</p>
        <Link href="/" className={`${buttonVariants()} mt-7 rounded-xl`}>Back to home</Link>
      </div>
    </main>
  )
}
