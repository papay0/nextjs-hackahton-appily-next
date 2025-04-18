"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppilyLogo } from "@/components/appily-logo"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()

  // Redirect to the Clerk sign-in page
  useEffect(() => {
    router.push("/sign-in")
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="container z-10 flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative size-8 overflow-hidden rounded-[12px] bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-center shadow-sm border border-blue-400/30 dark:border-blue-500/20">
            <AppilyLogo width={24} height={24} />
          </div>
          <span className="font-medium">Appily</span>
        </Link>
        
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </header>

      {/* Main content - loading spinner */}
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container flex justify-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Appily. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 