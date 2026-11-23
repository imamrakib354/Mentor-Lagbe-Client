import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToastContainer } from "@/components/theme-toast-container"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://mentor-lagbe-client-one.vercel.app"),
  title: { default: "MentorLagbe | Find Your Mentor", template: "%s | MentorLagbe" },
  description: "Discover tuition opportunities and connect with tutors and students across Bangladesh.",
  openGraph: {
    title: "MentorLagbe | Find Your Mentor",
    description: "Discover tuition opportunities and connect with tutors and students across Bangladesh.",
    type: "website",
    images: ["/preview/HomePage.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <ThemeToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
