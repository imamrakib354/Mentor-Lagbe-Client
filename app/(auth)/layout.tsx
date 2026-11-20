import Image from "next/image"

import { Footer } from "@/components/shared/footer"
import { Navbar } from "@/components/shared/navbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-[#f0f7ff] text-blue-950 sm:gap-8">
      <Navbar />
      <main className="relative isolate mx-3 flex flex-1 items-center justify-center overflow-hidden rounded-3xl border border-blue-100 bg-blue-50 px-4 py-8 sm:mx-5 sm:px-6 lg:px-10 lg:py-12">
        <Image
          src="/images/sign_background.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {children}
      </main>
      <Footer />
    </div>
  )
}
