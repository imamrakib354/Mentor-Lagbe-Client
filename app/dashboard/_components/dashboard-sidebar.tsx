"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation"
import {
  BookOpen,
  Bookmark,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRound,
  Users,
  X,
} from "lucide-react"
import { toast } from "react-toastify"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

const menuItemsByRole = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: FileText,
    },
    {
      label: "Saved Tuitions",
      href: "/dashboard/student/saved-tuitions",
      icon: Bookmark,
    },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
    {
      label: "Post Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: Plus,
    },
    {
      label: "My Tuitions",
      href: "/dashboard/tutor/my-tuitions",
      icon: BookOpen,
    },
    { label: "Applicants", href: "/dashboard/tutor/applicants", icon: Users },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Tuitions",
      href: "/dashboard/admin/tuitions",
      icon: ClipboardList,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
  ],
}

type DashboardSidebarProps = {
  user: { name: string; role?: string | null; image?: string | null } | null
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const segment = useSelectedLayoutSegment()
  const router = useRouter()
  const { setOpenMobile } = useSidebar()
  const [isSigningOut, setIsSigningOut] = useState(false)
  // Route-based menus allow each workspace to be previewed before guards are added.
  const role =
    segment === "admin" || segment === "tutor" || segment === "student"
      ? segment
      : user?.role === "admin" || user?.role === "tutor"
        ? user.role
        : "student"
  const name = user?.name || "Guest"

  async function handleSignOut() {
    if (!user || isSigningOut) return
    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()
      if (error) {
        toast.error(error.message || "Could not sign out. Please try again.")
        return
      }

      toast.success("Signed out successfully!")
      setOpenMobile(false)
      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Unable to reach the sign-out service. Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="top-0 h-svh border-blue-100"
    >
      <SidebarHeader className="border-b border-blue-200/70 bg-gradient-to-br from-[#e4f3ff] to-[#dfe7ff] p-5">
        <Link href="/" aria-label="MentorLagbe home" className="mb-3 block w-44 max-w-full">
          <Image src="/images/Mentor_logo.png" alt="MentorLagbe" width={2172} height={724} sizes="176px" className="h-auto w-full" />
        </Link>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg">
            {user?.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback className="bg-blue-600 text-sm font-semibold text-white">
              {name.trim().charAt(0).toUpperCase() || "G"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p
              title={name}
              className="truncate text-sm font-semibold text-blue-950"
            >
              {name}
            </p>
            <Badge className="mt-1.5 bg-blue-50 text-[10px] text-blue-700 capitalize">
              {user?.role || `${role} preview`}
            </Badge>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close dashboard sidebar"
            onClick={() => setOpenMobile(false)}
            className="size-8 shrink-0 text-slate-500 hover:bg-blue-50 md:hidden"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-[#dfe7ff] via-[#e4eaff] to-[#d9ddfa]">
        <nav aria-label="Dashboard navigation">
          <SidebarGroup className="p-3">
            <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {menuItemsByRole[role].map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={pathname === item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => setOpenMobile(false)}
                      className="h-11 gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-500/30 active:bg-blue-100 active:text-blue-700 data-active:bg-blue-100 data-active:font-semibold data-active:text-blue-700"
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-3 pt-4">
            <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Preferences
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/dashboard/profile" />}
                    isActive={pathname === "/dashboard/profile"}
                    aria-current={
                      pathname === "/dashboard/profile" ? "page" : undefined
                    }
                    onClick={() => setOpenMobile(false)}
                    className="h-11 gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-500/30 active:bg-blue-100 active:text-blue-700 data-active:bg-blue-100 data-active:font-semibold data-active:text-blue-700"
                  >
                    <UserRound aria-hidden="true" />
                    <span>User Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-blue-200/70 bg-[#d9ddfa] p-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleSignOut}
          disabled={!user || isSigningOut}
          title={!user ? "Sign out is available when signed in" : undefined}
          className="h-11 w-full rounded-xl border-blue-100 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-100 dark:bg-white"
        >
          {isSigningOut ? (
            <Spinner className="motion-reduce:animate-none" />
          ) : (
            <LogOut aria-hidden="true" />
          )}
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
