"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LayoutDashboard, LogOut, Menu, Moon } from "lucide-react"
import { toast } from "react-toastify"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { authClient, useSession } from "@/lib/auth-client"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const visibleNavLinks = navLinks.filter(
    (link) => link.href !== "/dashboard" || (!isPending && user)
  )
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()
      if (error) {
        toast.error(error.message || "Could not sign out. Please try again.")
        return
      }

      toast.success("Signed out successfully!")
      setIsMenuOpen(false)
      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Unable to reach the sign-out service. Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white shadow-sm shadow-blue-950/5">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[auto_1fr_auto]">
        <Link
          href="/"
          aria-label="MentorLagbe home"
          className="flex h-12 w-48 shrink-0 items-center overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <Image
            src="/images/Mentor_logo.png"
            alt="MentorLagbe"
            width={2172}
            height={724}
            sizes="192px"
            className="h-auto w-48 shrink-0"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden justify-self-center lg:block"
        >
          <ul className="flex items-center gap-1">
            {visibleNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(`${link.href}/`))
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-11 rounded-xl px-3 font-semibold text-blue-950 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-500/40 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-800"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          {isPending ? (
            <Skeleton
              aria-label="Checking account"
              className="h-12 w-44 rounded-xl bg-blue-100 motion-reduce:animate-none"
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Open account menu for ${user.name}`}
                render={
                  <Button
                    variant="ghost"
                    className="h-14 gap-2 rounded-xl px-2 hover:bg-blue-50"
                  />
                }
              >
                <UserSummary name={user.name} role={user.role} image={user.image} />
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 text-blue-600"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-52 rounded-xl border border-blue-100 bg-white p-2 text-blue-950 ring-0 [--accent-foreground:var(--color-blue-700)] [--accent:var(--color-blue-50)]"
              >
                <DropdownMenuItem
                  render={<Link href="/dashboard" />}
                  className="rounded-lg px-3 py-2.5"
                >
                  <LayoutDashboard aria-hidden="true" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-blue-100" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  closeOnClick={false}
                  className="rounded-lg px-3 py-2.5"
                >
                  {isSigningOut ? (
                    <Spinner className="motion-reduce:animate-none" />
                  ) : (
                    <LogOut aria-hidden="true" />
                  )}
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 rounded-xl border-blue-100 bg-white px-5 font-semibold text-blue-950 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-100 dark:bg-white"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
                )}
              >
                Sign Up
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled
            aria-label="Toggle color theme (coming soon)"
            title="Theme switching coming soon"
            className="size-11 rounded-xl text-blue-800 disabled:opacity-70"
          >
            <Moon aria-hidden="true" className="size-5" />
          </Button>
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-11 rounded-xl border-blue-100 bg-white text-blue-950 hover:bg-blue-50 lg:hidden dark:border-blue-100 dark:bg-white"
              />
            }
            aria-label="Open navigation menu"
          >
            <Menu aria-hidden="true" className="size-5" />
          </SheetTrigger>
          <SheetContent className="border-blue-100 bg-white text-blue-950 data-[side=right]:w-[min(22rem,90vw)]">
            <SheetHeader className="px-6 pt-12">
              <SheetTitle className="text-lg font-bold text-blue-950">
                Explore MentorLagbe
              </SheetTitle>
              <SheetDescription className="mt-1 text-slate-500">
                Your next learning opportunity starts here.
              </SheetDescription>
            </SheetHeader>
            <Separator className="bg-blue-100" />
            <nav aria-label="Mobile navigation" className="px-4">
              <ul className="space-y-2">
                {visibleNavLinks.map((link) => (
                  <li key={link.href}>
                    <SheetClose
                      nativeButton={false}
                      render={<Link href={link.href} />}
                      aria-current={
                        pathname === link.href ||
                        (link.href !== "/" &&
                          pathname.startsWith(`${link.href}/`))
                          ? "page"
                          : undefined
                      }
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-12 w-full justify-start rounded-xl px-4 font-semibold text-blue-950 hover:bg-blue-50 hover:text-blue-700 focus-visible:border-blue-300 focus-visible:ring-blue-500/25 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-800"
                      )}
                    >
                      {link.label}
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto p-5">
              {isPending ? (
                <Skeleton
                  aria-label="Checking account"
                  className="h-12 w-full rounded-xl bg-blue-100 motion-reduce:animate-none"
                />
              ) : user ? (
                <div className="space-y-4 border-t border-blue-100 pt-5">
                  <div className="flex items-center gap-3">
                    <UserSummary name={user.name} role={user.role} image={user.image} />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="h-11 w-full rounded-xl border-blue-100 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-100 dark:bg-white"
                  >
                    {isSigningOut ? (
                      <Spinner className="motion-reduce:animate-none" />
                    ) : (
                      <LogOut aria-hidden="true" />
                    )}
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                  <SheetClose
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 rounded-xl border-blue-100 bg-white text-blue-950 hover:bg-blue-50 dark:border-blue-100 dark:bg-white"
                    )}
                  >
                    Sign In
                  </SheetClose>
                  <SheetClose
                    nativeButton={false}
                    render={<Link href="/sign-up" />}
                    className={cn(
                      buttonVariants(),
                      "h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    Sign Up
                  </SheetClose>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    disabled
                    aria-label="Toggle color theme (coming soon)"
                    title="Theme switching coming soon"
                    className="size-10 rounded-xl text-blue-800 disabled:opacity-70"
                  >
                    <Moon aria-hidden="true" className="size-5" />
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function UserSummary({ name, role, image }: { name: string; role?: string; image?: string | null }) {
  return (
    <>
      <Avatar size="lg">
        {image && <AvatarImage src={image} alt="" />}
        <AvatarFallback className="bg-blue-600 text-sm font-semibold text-white">
          {name.trim().charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 text-left">
        <span
          title={name}
          className="block max-w-28 truncate text-sm font-semibold text-blue-950"
        >
          {name}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500 capitalize">
          {role || "Member"}
        </span>
      </span>
    </>
  )
}
