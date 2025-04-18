"use client"

import { Home, LogOut, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { AppilyLogo } from "./appily-logo"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppSidebar() {
  const { user } = useUser()
  const { logout } = useAuth()
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative size-10 overflow-hidden rounded-[14px] bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-center shadow-sm border border-blue-400/30 dark:border-blue-500/20">
              <AppilyLogo width={30} height={30} />
            </div>
            <span className="font-medium text-lg">Appily</span>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/home">
                <Home className="size-5" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto">
        <div className="p-2">
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent/50 transition-colors cursor-pointer w-full">
                  <Avatar className="h-8 w-8 border">
                    {user.imageUrl ? (
                      <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.fullName?.[0] || user.username?.[0] || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.fullName || user.username || "User"}
                    </p>
                  </div>
                  <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
