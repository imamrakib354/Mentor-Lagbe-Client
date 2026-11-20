"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="w-full rounded-2xl border border-blue-100 bg-white">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
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

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href={link.href} />}
                  aria-current={
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(`${link.href}/`))
                      ? "page"
                      : undefined
                  }
                  className="h-11 rounded-xl px-4 font-semibold text-blue-950 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-500/40 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-800"
                >
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/sign-in" />}
            className="h-11 rounded-xl border-blue-100 bg-white px-5 font-semibold text-blue-950 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-100 dark:bg-white"
          >
            Sign In
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/sign-up" />}
            className="h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
          >
            Sign Up
          </Button>
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

        <Sheet>
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
                {navLinks.map((link) => (
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
            <div className="mt-auto grid grid-cols-[1fr_1fr_auto] items-center gap-2 p-5">
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
