"use client"

import { motion } from "framer-motion"

interface GlowEffectsProps {
  className?: string
  intensity?: number
}

export function GlowEffects({ className = "", intensity = 1 }: GlowEffectsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main glow */}
      <motion.div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] z-0" 
        style={{ opacity: 0.3 * intensity }}
        animate={{
          scale: [1, 1.05, 0.95, 1],
          opacity: [0.2 * intensity, 0.3 * intensity, 0.2 * intensity]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary glow */}
      <motion.div 
        className="absolute top-2/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-400/15 rounded-full opacity-20 blur-[80px] z-0" 
        animate={{
          scale: [1, 0.9, 1.1, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 10,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Tertiary glow */}
      <motion.div 
        className="absolute top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full opacity-25 blur-[60px] z-0" 
        animate={{
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 12,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
