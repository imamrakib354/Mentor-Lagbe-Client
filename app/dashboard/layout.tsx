import type { CSSProperties } from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const dashboardUser = user ? { name: user.name, role: user.role } : null

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
        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}
