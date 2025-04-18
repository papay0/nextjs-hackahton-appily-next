"use client"

import React, { createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"

type AuthContextType = {
  user: ReturnType<typeof useUser>["user"]
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const login = async () => {
    router.push("/sign-in")
  }

  const logout = () => {
    signOut().then(() => {
      router.push("/")
    })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading: !isLoaded, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 