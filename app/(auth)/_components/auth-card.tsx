"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

type AuthCardProps = {
  image: string
  title: string
  description: string
  children: React.ReactNode
}

export function AuthCard({
  image,
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="grid w-full max-w-7xl gap-0 overflow-hidden rounded-3xl border border-white bg-white py-0 text-blue-950 shadow-2xl ring-0 shadow-blue-900/15 lg:grid-cols-2">
      <aside className="relative hidden min-h-176 overflow-hidden bg-blue-700 lg:block">
        <Image
          src={image}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1360px) 640px, 50vw"
          className="object-cover object-bottom"
        />
        <div className="relative z-10 p-10 xl:p-12">
          <h2 className="max-w-lg text-3xl leading-tight font-bold tracking-tight text-white xl:text-4xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-blue-50 xl:text-lg">
            {description}
          </p>
        </div>
      </aside>

      <div className="min-w-0 px-5 py-8 sm:px-10 sm:py-10 xl:px-14">
        <Link
          href="/"
          aria-label="MentorLagbe home"
          className="brand-logo flex h-14 w-56 max-w-full items-center overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <Image
            src="/images/Mentor_logo.png"
            alt="MentorLagbe"
            width={2172}
            height={724}
            sizes="224px"
            className="h-auto w-56 shrink-0"
          />
        </Link>
        {children}
      </div>
    </Card>
  )
}

export function GoogleSignInButton({ label }: { label: string }) {
  const [isSigningIn, setIsSigningIn] = useState(false)

  async function handleGoogleSignIn() {
    if (isSigningIn) return
    setIsSigningIn(true)
    try {
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl")
      const callbackURL = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") && !callbackUrl.includes("\\")
        ? callbackUrl : "/"
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `/choose-role?next=${encodeURIComponent(callbackURL)}`,
        newUserCallbackURL: "/choose-role",
      })
      if (error) {
        toast.error(error.message || "Could not start Google sign-in.")
        setIsSigningIn(false)
      }
    } catch {
      toast.error("Unable to reach the sign-in service.")
      setIsSigningIn(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isSigningIn}
      onClick={handleGoogleSignIn}
      className="h-12 w-full gap-3 rounded-xl border-blue-200 bg-white text-sm font-semibold text-blue-950 disabled:opacity-65 sm:text-base dark:border-blue-200 dark:bg-white"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          fill="#4285F4"
          d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.99-4.3 2.99-7.36Z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 4.96-.9 6.61-2.41l-3.23-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"
        />
        <path
          fill="#FBBC05"
          d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.92V7.49H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.51l3.34-2.59Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.96c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96Z"
        />
      </svg>
      {isSigningIn ? "Connecting to Google..." : label}
    </Button>
  )
}
