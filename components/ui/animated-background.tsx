"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

interface AnimatedBackgroundProps {
  particleCount?: number
  gridLineCount?: number
  className?: string
}

export function AnimatedBackground({
  particleCount = 25,
  gridLineCount = 8,
  className = "",
}: AnimatedBackgroundProps) {
  // Create particles for the background with different sizes and colors
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      color: i % 5 === 0 ? "rgba(56, 189, 248, 0.4)" : // sky blue
             i % 5 === 1 ? "rgba(59, 130, 246, 0.3)" : // blue
             i % 5 === 2 ? "rgba(99, 102, 241, 0.25)" : // indigo
             i % 5 === 3 ? "rgba(16, 185, 129, 0.2)" : // emerald
             "rgba(14, 165, 233, 0.35)" // light blue
    }))
  }, [particleCount])
  
  // Create grid lines for a subtle matrix effect
  const gridLines = useMemo(() => {
    return Array.from({ length: gridLineCount }).map((_, i) => ({
      id: i,
      isHorizontal: i % 2 === 0,
      position: 15 + (i * 10),
      opacity: 0.03 + (Math.random() * 0.04),
      delay: Math.random() * 2
    }))
  }, [gridLineCount])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated grid lines for matrix effect */}
      {gridLines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute bg-blue-400 z-0"
          style={{
            [line.isHorizontal ? 'height' : 'width']: '1px',
            [line.isHorizontal ? 'width' : 'height']: '100%',
            [line.isHorizontal ? 'top' : 'left']: `${line.position}%`,
            opacity: line.opacity
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: line.opacity }}
          transition={{ 
            duration: 3, 
            delay: line.delay,
            ease: "easeOut" 
          }}
        />
      ))}
      
      {/* Animated background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full z-0"
          style={{
            width: `${particle.size}rem`,
            height: `${particle.size}rem`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            filter: "blur(8px)"
          }}
          initial={{ opacity: 0 }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}
