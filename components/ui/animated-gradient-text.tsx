"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedGradientTextProps {
  children: ReactNode
  className?: string
  from?: string
  via?: string
  to?: string
  duration?: number
}

export function AnimatedGradientText({
  children,
  className = "",
  from = "blue-500",
  via = "primary",
  to = "sky-400",
  duration = 15
}: AnimatedGradientTextProps) {
  return (
    <motion.h1 
      className={`bg-clip-text text-transparent bg-gradient-to-br from-${from} via-${via} to-${to} ${className}`}
      animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
      transition={{ duration, repeat: Infinity, repeatType: "reverse" }}
      style={{ backgroundSize: '200% 200%' }}
    >
      {children}
    </motion.h1>
  )
}
