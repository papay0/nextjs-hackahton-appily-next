"use client"

import { useState, useRef } from "react"
import { Settings, Clock, ShoppingBag, PlusCircle, MessageSquare, Phone, Camera, Globe } from "lucide-react"
import { WebView } from "./WebView"

interface HomeScreenProps {
  onAppClick?: () => void;
  onWebViewOpen?: () => void;
}

export function HomeScreen({ onAppClick, onWebViewOpen }: HomeScreenProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAppOpen, setIsAppOpen] = useState(false)
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const totalPages = 3
  
  const openApp = () => {
    setIsAppOpen(true)
    if (onAppClick) {
      onAppClick()
    }
  }

  const handleBack = () => {
    setIsAppOpen(false)
    if (onAppClick) {
      onAppClick()
    }
  }

  // Add scroll event listener to update currentPage based on scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Clear any existing timers
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current)
    }
    
    const scrollLeft = e.currentTarget.scrollLeft;
    const pageWidth = e.currentTarget.clientWidth;
    const newPage = Math.round(scrollLeft / pageWidth);
    
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      
      // Update label with slight delay to avoid too many updates
      scrollTimerRef.current = setTimeout(() => {
        if (onAppClick) {
          onAppClick();
        }
      }, 100)
    }
  }

  if (isAppOpen) {
    return <WebView onBack={handleBack} onView={onWebViewOpen} />
  }

  return (
    <div className="h-full flex flex-col p-2 select-none touch-manipulation">
      {/* Page indicators - moved outside of scroll container */}
      <div className="flex justify-center gap-1 mb-1 pt-2 z-10">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1 w-4 rounded-full ${i === currentPage ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'} cursor-pointer`}
            onClick={() => {
              // Programmatically scroll to the selected page
              const scrollContainer = document.querySelector('.scroll-container');
              if (scrollContainer) {
                scrollContainer.scrollTo({
                  left: i * scrollContainer.clientWidth,
                  behavior: 'smooth'
                });
              }
              setCurrentPage(i);
            }}
          />
        ))}
      </div>
      
      {/* App pages with horizontal snap scrolling */}
      <div 
        className="flex-1 overflow-x-auto overscroll-contain relative scroll-container scrollbar-hide"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          display: 'flex',
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none'    /* Firefox */
        }}
        onScroll={handleScroll}
      >
        {/* CSS to hide scrollbar in WebKit browsers */}
        <style jsx>{`
          .scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Page 1 */}
        <div 
          className="min-w-full flex-shrink-0 grid grid-cols-4 gap-x-2 gap-y-3 px-2 pt-2"
          style={{ scrollSnapAlign: 'start', touchAction: 'pan-x' }}
        >
          <AppIcon onClick={openApp} icon={<PlusCircle size={16} className="text-white" />} label="Build" bgColor="bg-blue-500" />
          <AppIcon onClick={openApp} icon={<ShoppingBag size={16} className="text-white" />} label="Store" bgColor="bg-blue-500" />
          <AppIcon onClick={openApp} icon={<Settings size={16} className="text-white" />} label="Settings" bgColor="bg-gray-500" />
          <AppIcon onClick={openApp} icon={<Clock size={16} className="text-white" />} label="History" bgColor="bg-gray-500" />

          {/* First 12 apps */}
          {Array.from({ length: 12 }).map((_, index) => (
            <AppIcon
              key={index}
              onClick={openApp}
              icon={
                <div className="flex items-center justify-center text-white font-semibold text-[10px]">
                  {String.fromCharCode(65 + index)}
                </div>
              }
              label={`App ${index + 1}`}
              bgColor={getRandomColor(index)}
            />
          ))}
        </div>

        {/* Page 2 */}
        <div 
          className="min-w-full flex-shrink-0 grid grid-cols-4 gap-x-2 gap-y-3 px-2"
          style={{ scrollSnapAlign: 'start', touchAction: 'pan-x' }}
        >
          {Array.from({ length: 16 }).map((_, index) => (
            <AppIcon
              key={index}
              onClick={openApp}
              icon={
                <div className="flex items-center justify-center text-white font-semibold text-[10px]">
                  {String.fromCharCode(65 + index + 16)}
                </div>
              }
              label={`App ${index + 17}`}
              bgColor={getRandomColor(index + 16)}
            />
          ))}
        </div>

        {/* Page 3 */}
        <div 
          className="min-w-full flex-shrink-0 grid grid-cols-4 gap-x-2 gap-y-3 px-2"
          style={{ scrollSnapAlign: 'start', touchAction: 'pan-x' }}
        >
          {Array.from({ length: 16 }).map((_, index) => (
            <AppIcon
              key={index}
              onClick={openApp}
              icon={
                <div className="flex items-center justify-center text-white font-semibold text-[10px]">
                  {String.fromCharCode(65 + (index + 36) % 26)}
                </div>
              }
              label={`App ${index + 37}`}
              bgColor={getRandomColor(index + 36)}
            />
          ))}
        </div>
      </div>

      {/* Dock */}
      <div className="flex justify-around items-center p-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl mt-auto">
        <AppIcon onClick={openApp} icon={<Phone size={16} className="text-white" />} label="Phone" bgColor="bg-green-500" />
        <AppIcon onClick={openApp} icon={<MessageSquare size={16} className="text-white" />} label="Messages" bgColor="bg-blue-500" />
        <AppIcon onClick={openApp} icon={<Camera size={16} className="text-white" />} label="Camera" bgColor="bg-purple-500" />
        <AppIcon onClick={openApp} icon={<Globe size={16} className="text-white" />} label="Browser" bgColor="bg-red-500" />
      </div>
    </div>
  )
}

// Helper function to get different colors for app icons
function getRandomColor(index: number) {
  const colors = [
    "bg-blue-500", 
    "bg-indigo-500", 
    "bg-purple-500", 
    "bg-pink-500", 
    "bg-red-500", 
    "bg-orange-500", 
    "bg-yellow-500", 
    "bg-green-500"
  ]
  return colors[index % colors.length]
}

interface AppIconProps {
  icon: React.ReactNode
  label: string
  bgColor: string
  onClick: () => void
}

function AppIcon({ icon, label, bgColor, onClick }: AppIconProps) {
  return (
    <button onClick={onClick} className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center mb-1 shadow-sm`}>
        {icon}
      </div>
      <span className="text-[8px] text-center truncate w-full">{label}</span>
    </button>
  )
} 