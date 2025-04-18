"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "border border-blue-200/60 dark:border-blue-800/60 bg-background/90 backdrop-blur-sm",
        style: {
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  )
}
