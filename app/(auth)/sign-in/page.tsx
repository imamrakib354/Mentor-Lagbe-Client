"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react"

import { AuthCard, GoogleSignInButton } from "../_components/auth-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

const inputClassName =
  "h-12 rounded-xl border-blue-200 bg-white pl-11 text-blue-950 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:bg-white"

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
      toast.error("Please enter your email and password.")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: formData.has("rememberMe"),
      })

      if (error) {
        toast.error(
          error.message ||
            "Could not sign in. Please check your email and password."
        )
        return
      }

      if (data) {
        toast.success("Signed in successfully!")
        form.reset()
        setShowPassword(false)
        router.replace("/")
        router.refresh()
      } else {
        toast.error("Could not sign in. Please try again.")
      }
    } catch {
      toast.error("Unable to reach the sign-in service.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      image="/images/sign_in.png"
      title="Ready to continue your learning journey?"
      description="Sign in to access your dashboard, manage tuitions, connect with mentors, and keep growing your skills."
    >
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
          Welcome back!
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Sign in to continue your learning journey.
        </p>
      </div>

      <form
        onSubmit={handleEmailLogin}
        aria-busy={isSubmitting}
        className="mt-7 space-y-5"
      >
        <div className="space-y-2.5">
          <Label htmlFor="signin-email" className="font-semibold text-blue-950">
            Email address
          </Label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              required
              className={inputClassName}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="signin-password"
            className="font-semibold text-blue-950"
          >
            Password
          </Label>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="signin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              className={`${inputClassName} pr-12`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-1.5 size-9 -translate-y-1/2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-5" />
              ) : (
                <Eye aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              name="rememberMe"
              className="border-blue-200 data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white"
            />
            <Label htmlFor="remember-me" className="text-sm text-slate-600">
              Remember me
            </Label>
          </div>
          <Button
            type="button"
            variant="link"
            disabled
            className="h-auto p-0 text-xs text-blue-600 disabled:opacity-65 sm:text-sm"
          >
            Forgot password?
          </Button>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full gap-3 rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
        >
          {isSubmitting ? (
            <Spinner className="size-5 motion-reduce:animate-none" />
          ) : (
            <LogIn aria-hidden="true" className="size-5" />
          )}
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <Separator className="min-w-0 flex-1 bg-blue-100" />
        <span className="shrink-0 text-xs text-slate-500 sm:text-sm">
          Or continue with
        </span>
        <Separator className="min-w-0 flex-1 bg-blue-100" />
      </div>
      <GoogleSignInButton label="Sign in with Google" />

      <p className="mt-6 rounded-xl bg-blue-50 px-3 py-4 text-center text-sm leading-6 text-slate-600">
        New to MentorLagbe?{" "}
        <Link
          href="/sign-up"
          className="rounded-sm font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Create account
        </Link>
      </p>
    </AuthCard>
  )
}
