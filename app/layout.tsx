import { Geist, Geist_Mono } from "next/font/google"
import { ToastContainer } from "react-toastify"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar
            newestOnTop
            closeOnClick
            theme="light"
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
