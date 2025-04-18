"use client"

import { useState } from "react"
import { Home, LogOut, Menu, X, Settings, Code } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { AppilyLogo } from "./appily-logo"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"


export function AppNavbar() {
  const { user } = useUser()
  const { logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Determine if we're in an app editor context (inside /home/app-editor/[uuid])
  const isInAppContext = pathname?.includes('/home/app-editor/')
  
  // Navigation items - can be expanded as new pages are added
  const navigationItems = [
    { 
      name: "Home", 
      href: "/home", 
      icon: Home, 
      current: pathname === '/home' 
    },
    { 
      name: "App Editor", 
      href: "#", // This is dynamic and set by the current URL
      icon: Code, 
      current: isInAppContext,
      dynamic: true,
      hideWhenNotInApp: true
    }
  ]
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile menu button - moved to left */}
          <div className="flex md:hidden items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground rounded-full size-10 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60 bg-background/90 shadow-sm"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            
            {/* Logo and brand */}
            <Link href="/home" className="flex items-center gap-2">
              <div className="relative size-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-center shadow-sm border border-blue-400/30 dark:border-blue-500/20">
                <AppilyLogo width={24} height={24} />
              </div>
              <span className="font-medium text-lg hidden sm:inline-block">Appily</span>
            </Link>
          </div>
          
          {/* Logo and brand - desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/home" className="flex items-center gap-2">
              <div className="relative size-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-center shadow-sm border border-blue-400/30 dark:border-blue-500/20">
                <AppilyLogo width={24} height={24} />
              </div>
              <span className="font-medium text-lg">Appily</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems
              .filter(item => !isInAppContext ? !item.hideWhenNotInApp : true)
              .map((item) => {
                // For app editor, use the current path
                const href = item.dynamic && isInAppContext ? pathname : item.href;
                // All items are already filtered properly
                
                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                      item.current 
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.current && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })
            }
          </nav>
          
          {/* Removed duplicate mobile menu button */}
          
          {/* User profile and theme toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-10 p-0 rounded-full">
                    <Avatar className="size-10 border">
                      {user.imageUrl ? (
                        <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.fullName?.[0] || user.username?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="size-10 border">
                      {user.imageUrl ? (
                        <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.fullName?.[0] || user.username?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        {user.fullName || user.username || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.emailAddresses?.[0]?.emailAddress || ""}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/home/profile" className="cursor-pointer flex w-full">
                      <Avatar className="mr-2 h-4 w-4">
                        <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
                          {user.fullName?.[0] || user.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

      </header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-x-0 top-16 z-30 bg-background/95 backdrop-blur-sm border-b"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container py-4">
              <nav className="flex flex-col space-y-1">
                {navigationItems
                  .filter(item => !isInAppContext ? !item.hideWhenNotInApp : true)
                  .map((item) => {
                    // For app editor, use the current path
                    const href = item.dynamic && isInAppContext ? pathname : item.href;
                    // All items are already filtered properly
                    
                    return (
                      <Link
                        key={item.name}
                        href={href}
                        className={`flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md ${
                          item.current 
                            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })
                }
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
