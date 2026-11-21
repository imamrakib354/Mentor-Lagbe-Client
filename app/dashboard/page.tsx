import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) redirect("/sign-in")
  if (user.role === "admin") redirect("/dashboard/admin")
  if (user.role === "tutor") redirect("/dashboard/tutor")
  if (user.role === "student") redirect("/dashboard/student")

  redirect("/")
}
