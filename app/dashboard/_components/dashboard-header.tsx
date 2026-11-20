"use client"

import Image from "next/image"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { Moon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type DashboardHeaderProps = {
  user: { name: string; role?: string | null } | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const segment = useSelectedLayoutSegment()
  const role =
    segment === "admin" || segment === "tutor" || segment === "student"
      ? segment
      : user?.role === "admin" || user?.role === "tutor"
        ? user.role
        : "student"
  const name = user?.name || "Guest"

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full shrink-0 items-center border-b border-blue-100 bg-white">
      <div className="flex h-full w-36 shrink-0 items-center px-3 sm:w-52 sm:px-5 md:w-(--sidebar-width)">
        <Link
          href="/"
          aria-label="MentorLagbe home"
          className="flex h-12 w-full max-w-48 items-center overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <Image
            src="/images/Mentor_logo.png"
            alt="MentorLagbe"
            width={2172}
            height={724}
            sizes="(min-width: 768px) 192px, (min-width: 640px) 168px, 120px"
            className="h-auto w-full"
          />
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden truncate text-base font-semibold text-blue-950 capitalize sm:block">
            {role} Workspace
          </span>
          <span className="sr-only sm:hidden">{role} Workspace</span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            aria-label="Toggle color theme (coming soon)"
            title="Theme switching coming soon"
            className="size-9 rounded-xl text-blue-700 disabled:opacity-70"
          >
            <Moon aria-hidden="true" className="size-5" />
          </Button>
          <Separator
            orientation="vertical"
            className="hidden h-6 self-center bg-blue-100 sm:block"
          />
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/dashboard/profile" />}
            aria-label="Open user profile"
            className="h-14 gap-2 rounded-xl px-1 text-blue-950 hover:bg-blue-50 sm:px-2"
          >
            <Avatar size="lg">
              <AvatarFallback className="bg-blue-600 font-semibold text-white">
                {name.trim().charAt(0).toUpperCase() || "G"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 text-left lg:block">
              <span
                title={name}
                className="block max-w-32 truncate text-sm font-semibold text-blue-950"
              >
                {name}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 capitalize">
                {user?.role || "Guest"}
              </span>
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
