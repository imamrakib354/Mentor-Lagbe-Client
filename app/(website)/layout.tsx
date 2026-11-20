import { Footer } from "@/components/shared/footer"
import { Navbar } from "@/components/shared/navbar"

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-[#f0f7ff] text-slate-900 sm:gap-8">
      <Navbar />
      <main className="w-full flex-1 px-3 sm:px-5">{children}</main>
      <Footer />
    </div>
  )
}
