"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserPlus,
  UserRound,
  GraduationCap,
  Presentation,
  ShieldCheck,
} from "lucide-react"

import { AuthCard, GoogleSignInButton } from "../_components/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

const inputClassName =
  "h-12 rounded-xl border-blue-200 bg-white pl-11 text-blue-950 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:bg-white"

// Development only: secure admin registration before deployment.
const roleOptions = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "tutor", label: "Tutor", icon: Presentation },
  { value: "admin", label: "Admin", icon: ShieldCheck },
] as const

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")
    const role = String(formData.get("role") ?? "student")

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please complete all required fields.")
      return
    }

    if (role !== "student" && role !== "tutor" && role !== "admin") {
      toast.error("Please select a valid role.")
      return
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      setPasswordError(true)
      return
    }

    setPasswordError(false)

    if (password !== confirmPassword) {
      setConfirmPasswordError(true)
      return
    }

    setConfirmPasswordError(false)
    setIsSubmitting(true)

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
        callbackURL: "/",
      })

      if (error) {
        toast.error(error.message || "Could not create your account.")
        return
      }

      if (!data) {
        toast.error("Could not create your account. Please try again.")
        return
      }

      toast.success("Account created successfully!")
      form.reset()
      setShowPassword(false)
      setShowConfirmPassword(false)
      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Unable to reach the sign-up service. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      image="/images/sign_up.png"
      title="Your next chapter starts with the right mentor."
      description="Join a community of students and tutors. Find your next tuition batch or share your knowledge with learners."
    >
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Learn, teach, and grow with MentorLagbe.
        </p>
      </div>

      <form
        onSubmit={handleEmailSignUp}
        aria-busy={isSubmitting}
        className="mt-7 space-y-5"
      >
        <fieldset className="space-y-3" disabled={isSubmitting}>
          <legend className="mb-3 text-sm font-semibold text-blue-950">
            I am joining as
          </legend>
          <RadioGroup
            name="role"
            defaultValue="student"
            aria-label="Choose your account role"
            disabled={isSubmitting}
            className="grid grid-cols-3 gap-2 sm:gap-3"
          >
            {roleOptions.map(({ value, label, icon: Icon }) => (
              <div key={value} className="relative">
                <RadioGroupItem
                  id={`signup-role-${value}`}
                  value={value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`signup-role-${value}`}
                  className="flex min-h-28 cursor-pointer flex-col justify-center gap-3 rounded-2xl border border-blue-100 bg-slate-50 px-2 py-4 text-xs font-semibold text-slate-600 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40 peer-data-checked:border-blue-500 peer-data-checked:bg-blue-50 peer-data-checked:text-blue-700 peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-60 hover:border-blue-200 hover:bg-blue-50 sm:text-sm"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>

        <div className="space-y-2.5">
          <Label htmlFor="signup-name" className="font-semibold text-blue-950">
            Full name
          </Label>
          <div className="relative">
            <UserRound
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="signup-name"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              required
              className={inputClassName}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="signup-email" className="font-semibold text-blue-950">
            Email address
          </Label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="signup-email"
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
            htmlFor="signup-password"
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
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              required
              aria-invalid={passwordError}
              aria-describedby={
                passwordError ? "signup-password-error" : "signup-password-help"
              }
              onChange={() => {
                setPasswordError(false)
                setConfirmPasswordError(false)
              }}
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
          {passwordError ? (
            <p
              id="signup-password-error"
              role="alert"
              className="text-xs leading-5 text-red-600"
            >
              Use at least 8 characters, including an uppercase and a lowercase
              letter.
            </p>
          ) : (
            <p
              id="signup-password-help"
              className="text-xs leading-5 text-slate-500"
            >
              Use 8+ characters with uppercase and lowercase letters.
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="signup-confirm-password"
            className="font-semibold text-blue-950"
          >
            Confirm password
          </Label>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="signup-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              required
              aria-invalid={confirmPasswordError}
              aria-describedby={
                confirmPasswordError
                  ? "signup-confirm-password-error"
                  : undefined
              }
              onChange={() => setConfirmPasswordError(false)}
              className={`${inputClassName} pr-12`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-1.5 size-9 -translate-y-1/2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
            >
              {showConfirmPassword ? (
                <EyeOff aria-hidden="true" className="size-5" />
              ) : (
                <Eye aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
          {confirmPasswordError && (
            <p
              id="signup-confirm-password-error"
              role="alert"
              className="text-xs leading-5 text-red-600"
            >
              Passwords do not match.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full gap-3 rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
        >
          {isSubmitting ? (
            <Spinner className="size-5 motion-reduce:animate-none" />
          ) : (
            <UserPlus aria-hidden="true" className="size-5" />
          )}
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <Separator className="min-w-0 flex-1 bg-blue-100" />
        <span className="shrink-0 text-xs text-slate-500 sm:text-sm">
          Or continue with
        </span>
        <Separator className="min-w-0 flex-1 bg-blue-100" />
      </div>
      <GoogleSignInButton label="Sign up with Google" />

      <p className="mt-6 rounded-xl bg-blue-50 px-3 py-4 text-center text-sm leading-6 text-slate-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="rounded-sm font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
