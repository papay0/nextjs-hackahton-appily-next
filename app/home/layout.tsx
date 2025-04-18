"use client"

import { AppNavbar } from "@/components/app-navbar"
import { FirebaseAuthProvider } from "@/lib/firebase-auth"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FirebaseAuthProvider>
      <div className="min-h-screen w-full">
        <AppNavbar />
        
        <main className="pt-16">
          {children}
        </main>
      </div>
    </FirebaseAuthProvider>
  )
}
