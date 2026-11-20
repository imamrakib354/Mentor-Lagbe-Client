"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon } from "lucide-react"

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
                <Link
                  href={link.href}
                  aria-current={
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(`${link.href}/`))
                      ? "page"
                      : undefined
                  }
                  className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold text-blue-950 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-blue-100 px-5 text-sm font-semibold text-blue-950 transition-colors hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            Sign Up
          </Link>
          <button
            type="button"
            disabled
            aria-label="Toggle color theme (coming soon)"
            title="Theme switching coming soon"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-blue-800"
          >
            <Moon aria-hidden="true" className="size-5" />
          </button>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-xl border border-blue-100 text-blue-950 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Navigation menu</span>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute top-14 right-0 z-20 w-64 rounded-2xl border border-blue-100 bg-white p-3 shadow-xl shadow-blue-950/10"
          >
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={
                      pathname === link.href ||
                      (link.href !== "/" &&
                        pathname.startsWith(`${link.href}/`))
                        ? "page"
                        : undefined
                    }
                    className="block rounded-lg px-3 py-3 text-sm font-semibold text-blue-950 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-800"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-[1fr_1fr_auto] items-center gap-2 border-t border-blue-100 pt-3">
              <Link
                href="/sign-in"
                className="rounded-lg border border-blue-100 px-3 py-3 text-center text-sm font-semibold text-blue-950 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign Up
              </Link>
              <button
                type="button"
                disabled
                aria-label="Toggle color theme (coming soon)"
                title="Theme switching coming soon"
                className="flex size-10 items-center justify-center rounded-lg text-blue-800"
              >
                <Moon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </nav>
        </details>
      </div>
    </header>
  )
}
