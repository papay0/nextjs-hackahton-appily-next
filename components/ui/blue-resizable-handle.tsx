"use client"

import { ResizableHandle } from "@/components/ui/resizable"

export function BlueResizableHandle() {
  return (
    <ResizableHandle 
      withHandle 
      className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors" 
    />
  )
}
