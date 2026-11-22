import type { CSSProperties } from "react"
import { redirect } from "next/navigation"

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
  if (!user) redirect("/sign-in")

  const dashboardUser = { name: user.name, email: user.email, image: user.image, role: user.role }

  return (
    <SidebarProvider
      className="min-h-dvh bg-[#dceeff] text-blue-950"
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar": "#e0eaff",
          "--sidebar-foreground": "#475569",
          "--sidebar-accent": "#eff6ff",
          "--sidebar-accent-foreground": "#1d4ed8",
          "--sidebar-border": "#dbeafe",
          "--sidebar-ring": "#3b82f6",
        } as CSSProperties
      }
    >
      <DashboardSidebar user={dashboardUser} />
      <div
        className="relative min-w-0 flex-1 overflow-hidden bg-[#d8eaff]"
        style={{
          backgroundImage: "radial-gradient(ellipse at 4% 3%, #fff8ef 0%, transparent 31%), radial-gradient(ellipse at 82% 4%, #a4dfff 0%, transparent 48%), radial-gradient(ellipse at 47% 67%, #ffffff 0%, transparent 35%), radial-gradient(ellipse at 96% 94%, #aeb7fa 0%, transparent 55%), linear-gradient(135deg, #b9e9f5 0%, #d6e8ff 52%, #c0c8fb 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative">
          <DashboardHeader user={dashboardUser} />
          <main className="min-w-0 px-4 pb-10 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
