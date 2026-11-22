"use client"

import Link from "next/link"
import { Moon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader({ user }: { user: { name: string; email: string; image?: string | null } }) {
  return (
    <header className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <SidebarTrigger aria-label="Toggle dashboard sidebar" className="size-10 rounded-xl border border-blue-100 bg-white/80 text-blue-700" />
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" disabled aria-label="Theme switching coming soon" title="Theme switching coming soon" className="text-blue-700 disabled:opacity-70"><Moon aria-hidden="true" /></Button>
        <Link href="/dashboard/profile" aria-label="Open user profile" className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/55 p-1.5 pr-3 shadow-sm shadow-blue-900/5 transition-colors hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <Avatar size="lg">
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback className="bg-blue-600 font-semibold text-white">{user.name.trim().charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 text-left">
            <span className="block max-w-28 truncate text-sm font-bold text-blue-950 sm:max-w-48">{user.name}</span>
            <span className="block max-w-28 truncate text-xs text-slate-600 sm:max-w-48">{user.email}</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
