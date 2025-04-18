"use client"

import { ReactNode } from "react"

interface MobileFrameProps {
  children: ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="relative w-[250px] h-[500px] bg-gradient-to-b from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 rounded-[2.5rem] p-[3px] shadow-xl overflow-hidden border-[3px] border-zinc-300 dark:border-zinc-700">
      {/* Ultra-thin notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-black dark:bg-black rounded-b-lg z-20"></div>
      
      {/* Screen */}
      <div className="w-full h-full rounded-[2.3rem] bg-white dark:bg-black overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-6 w-full flex justify-between items-center px-5 pt-1.5">
          <div className="text-xs font-medium">9:41</div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-current rounded-sm"></div>
            <div className="w-3 h-2.5 border border-current rounded-sm"></div>
            <div className="w-3 h-2.5 bg-current rounded-sm"></div>
          </div>
        </div>
        
        {/* App content - increased height by reducing padding and home indicator height */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
        
        {/* Home indicator - smaller height, positioned at the bottom */}
        <div className="h-1.5 flex items-center justify-center mb-1">
          <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
        </div>
      </div>
    </div>
  )
} 