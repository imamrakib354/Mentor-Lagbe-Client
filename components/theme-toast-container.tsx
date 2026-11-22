"use client"

import { useTheme } from "next-themes"
import { ToastContainer } from "react-toastify"

export function ThemeToastContainer() {
  const { resolvedTheme } = useTheme()

  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar
      newestOnTop
      closeOnClick
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  )
}
