"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface BackendSwitchProps {
  className?: string
  variant?: "minimal" | "full"
}

export function BackendSwitch({
  className,
  variant = "full"
}: BackendSwitchProps) {
  const [isLocalBackend, setIsLocalBackend] = useState(false)
  const [isDev, setIsDev] = useState(false)
  
  useEffect(() => {
    // Check if we're in development mode
    setIsDev(process.env.NODE_ENV === 'development')
    
    // Load saved preference from localStorage
    const savedPreference = localStorage.getItem('appily-local-backend')
    if (savedPreference) {
      setIsLocalBackend(savedPreference === 'true')
    }
  }, [])
  
  const handleToggle = (checked: boolean) => {
    setIsLocalBackend(checked)
    localStorage.setItem('appily-local-backend', checked.toString())
  }
  
  // Only render in development mode
  if (!isDev) return null
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "flex rounded-lg border border-blue-200/50 dark:border-blue-800/50 overflow-hidden",
          variant === "minimal" ? "text-xs" : "text-sm"
        )}
      >
        <button
          onClick={() => handleToggle(false)}
          className={cn(
            "px-2 py-1 transition-all duration-200",
            !isLocalBackend 
              ? "bg-blue-500/90 text-white font-medium" 
              : "bg-white/80 dark:bg-gray-900/80 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          )}
        >
          Prod
        </button>
        <button
          onClick={() => handleToggle(true)}
          className={cn(
            "px-2 py-1 transition-all duration-200",
            isLocalBackend 
              ? "bg-blue-500/90 text-white font-medium" 
              : "bg-white/80 dark:bg-gray-900/80 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          )}
        >
          Local
        </button>
      </div>
    </div>
  )
}
