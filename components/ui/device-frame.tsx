"use client"

import React from "react"

interface DeviceFrameProps {
  children: React.ReactNode
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 h-full w-full">
        <div className="w-full h-full rounded-lg border border-border shadow-sm overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
