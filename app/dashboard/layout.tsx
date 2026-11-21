import type { CSSProperties } from "react"
import { redirect } from "next/navigation"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const dashboardUser = { name: user.name, role: user.role }

  return (
    <SidebarProvider
      className="min-h-dvh flex-col bg-[#f0f7ff] text-blue-950"
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar": "#ffffff",
          "--sidebar-foreground": "#475569",
          "--sidebar-accent": "#eff6ff",
          "--sidebar-accent-foreground": "#1d4ed8",
          "--sidebar-border": "#dbeafe",
          "--sidebar-ring": "#3b82f6",
        } as CSSProperties
      }
    >
      <DashboardHeader user={dashboardUser} />
      <div className="flex min-h-0 flex-1">
        <DashboardSidebar user={dashboardUser} />
        <SidebarTrigger
          aria-label="Toggle dashboard sidebar"
          title="Open or close sidebar"
          className="fixed top-28 left-2 z-30 size-8 rounded-full border border-blue-100 bg-white text-blue-700 shadow-sm transition-[left] duration-200 ease-linear hover:bg-blue-50 hover:text-blue-800 md:left-[calc(var(--sidebar-width)-1rem)] md:peer-data-[state=collapsed]:left-2"
        />
        <main className="min-w-0 flex-1 p-5 pt-16 sm:p-6 sm:pt-16 md:pt-6 md:peer-data-[state=collapsed]:pt-16 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
