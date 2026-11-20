import { Footer } from "@/components/shared/footer"
import { Navbar } from "@/components/shared/navbar"

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-[#f0f7ff] p-3 text-slate-900 sm:gap-8 sm:p-5">
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  )
}
