import type { CSSProperties } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  if (user.roleSelectionRequired) redirect("/choose-role")

  const dashboardUser = { name: user.name, email: user.email, image: user.image, role: user.role }

  return (
    <SidebarProvider
      className="min-h-dvh bg-background text-foreground"
      style={
        {
          "--sidebar-width": "16rem",
        } as CSSProperties
      }
    >
      <DashboardSidebar user={dashboardUser} />
      <div
        className="dashboard-background relative min-w-0 flex-1 overflow-hidden"
      >
        <div className="relative">
          <DashboardHeader user={dashboardUser} />
          <main className="min-w-0 px-4 pb-10 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
