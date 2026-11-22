import { Footer } from "@/components/shared/footer"
import { Navbar } from "@/components/shared/navbar"

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col text-foreground">
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  )
}
