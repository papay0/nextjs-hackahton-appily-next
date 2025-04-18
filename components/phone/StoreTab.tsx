"use client"

import { useState } from "react"
import { Search, ArrowLeft, Download, Star, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface App {
  id: string
  name: string
  developer: string
  bgColor: string
  letter: string
  rating: number
  description: string
  category: string
  size: string
  version: string
}

interface StoreTabProps {
  onAppClick?: () => void;
}

export function StoreTab({ onAppClick }: StoreTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({})
  const [downloadComplete, setDownloadComplete] = useState<Record<string, boolean>>({})
  
  // Filter apps based on search query
  const filteredFeaturedApps = featuredApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.developer.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const filteredPopularApps = popularApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.developer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openAppDetails = (app: App) => {
    setSelectedApp(app)
    if (onAppClick) {
      onAppClick()
    }
  }

  const handleBack = () => {
    setSelectedApp(null)
  }

  const handleDownload = (appId: string) => {
    setIsDownloading(prev => ({ ...prev, [appId]: true }))
    
    // Simulate download completion after 2 seconds
    setTimeout(() => {
      setIsDownloading(prev => ({ ...prev, [appId]: false }))
      setDownloadComplete(prev => ({ ...prev, [appId]: true }))
    }, 2000)
  }

  // App Detail View
  if (selectedApp) {
    return (
      <div className="h-full flex flex-col select-none touch-manipulation">
        {/* Fixed header with back button */}
        <div className="flex items-center p-2 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black">
          <Button variant="ghost" size="icon" className="h-6 w-6 mr-2" onClick={handleBack}>
            <ArrowLeft size={14} />
          </Button>
          <h2 className="text-sm font-medium">App Details</h2>
        </div>
        
        {/* Scrollable content */}
        <div 
          className="flex-1 overflow-auto overscroll-contain p-3 bg-white dark:bg-black"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* App header */}
          <div className="flex items-center mb-4">
            <div className={`w-16 h-16 rounded-xl ${selectedApp.bgColor} flex items-center justify-center mr-3 shadow-sm`}>
              <span className="text-white font-semibold text-xl">{selectedApp.letter}</span>
            </div>
            <div>
              <h3 className="font-semibold">{selectedApp.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{selectedApp.developer}</p>
              
              {/* Download button */}
              <div className="mt-1">
                {downloadComplete[selectedApp.id] ? (
                  <Button className="h-7 text-xs gap-1 bg-green-500 hover:bg-green-600" disabled>
                    Installed
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleDownload(selectedApp.id)} 
                    className="h-7 text-xs gap-1"
                    disabled={isDownloading[selectedApp.id]}
                  >
                    {isDownloading[selectedApp.id] ? 'Downloading...' : 'Get App'}
                    {!isDownloading[selectedApp.id] && <Download size={12} />}
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Rest of content */}
          <div className="space-y-4">
            {/* Rating */}
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={12} 
                    className={star <= Math.round(selectedApp.rating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-zinc-300"} 
                  />
                ))}
              </div>
              <span className="text-xs ml-1">{selectedApp.rating.toFixed(1)}</span>
            </div>
            
            {/* App metadata */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Size</p>
                <p className="text-xs font-medium">{selectedApp.size}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Category</p>
                <p className="text-xs font-medium">{selectedApp.category}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Version</p>
                <p className="text-xs font-medium">{selectedApp.version}</p>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h4 className="text-xs font-medium mb-1">About this app</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">{selectedApp.description}</p>
            </div>
            
            {/* Screenshots with horizontal scrolling */}
            <div>
              <h4 className="text-xs font-medium mb-2">Screenshots</h4>
              <div 
                className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollSnapType: 'x mandatory' 
                }}
              >
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div 
                    key={index} 
                    className="min-w-[160px] h-32 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Screenshot {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional content */}
            <div>
              <h4 className="text-xs font-medium mb-1">What&apos;s New</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Latest version includes performance improvements and bug fixes.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium mb-1">Reviews</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-2">
                    <div className="flex items-center mb-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={10} 
                            className={star <= 5 - i 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-zinc-300"} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] ml-1 text-zinc-500">User{i}</span>
                    </div>
                    <p className="text-xs">This app is great for {i === 1 ? 'productivity' : i === 2 ? 'staying organized' : 'quick tasks'}!</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Store Home View
  return (
    <div className="h-full flex flex-col p-3 select-none touch-manipulation">
      <h2 className="text-lg font-semibold mb-3">Appily Store</h2>

      <div className="relative mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-400" size={14} />
        <Input 
          className="pl-7 h-8 text-xs pr-7" 
          placeholder="Search apps" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400" 
            onClick={() => setSearchQuery("")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div 
        className="flex-1 overflow-auto overscroll-contain bg-white dark:bg-black" 
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {filteredFeaturedApps.length > 0 && (
          <>
            <h3 className="text-sm font-medium mb-2">Featured Apps</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {filteredFeaturedApps.map((app) => (
                <AppCard 
                  key={app.id} 
                  app={app} 
                  onClick={() => openAppDetails(app)}
                  isDownloading={isDownloading[app.id]}
                  isDownloaded={downloadComplete[app.id]} 
                />
              ))}
            </div>
          </>
        )}

        {filteredPopularApps.length > 0 && (
          <>
            <h3 className="text-sm font-medium mb-2">Popular Apps</h3>
            <div className="space-y-2">
              {filteredPopularApps.map((app) => (
                <AppListItem 
                  key={app.id} 
                  app={app} 
                  onClick={() => openAppDetails(app)}
                  onDownload={() => handleDownload(app.id)}
                  isDownloading={isDownloading[app.id]}
                  isDownloaded={downloadComplete[app.id]}
                />
              ))}
            </div>
          </>
        )}

        {filteredFeaturedApps.length === 0 && filteredPopularApps.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-zinc-400 mb-2">
              <Search size={24} />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No apps found for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  )
}

const featuredApps: App[] = [
  {
    id: "weather1",
    name: "Weather",
    developer: "Appily",
    bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    letter: "W",
    rating: 4.8,
    description: "Check accurate weather forecasts for your location and around the world. Features hourly, daily, and weekly forecasts with beautiful visualizations.",
    category: "Utilities",
    size: "12 MB",
    version: "2.1.0"
  },
  {
    id: "tasks1",
    name: "Tasks",
    developer: "Appily Pro",
    bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    letter: "T",
    rating: 4.5,
    description: "A simple and effective task manager to help you stay organized. Create to-do lists, set reminders, and track your productivity.",
    category: "Productivity",
    size: "8 MB",
    version: "1.5.2"
  },
  {
    id: "notes1",
    name: "Notes",
    developer: "Appily",
    bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    letter: "N",
    rating: 4.7,
    description: "Take notes, create checklists, and organize your thoughts. Supports rich text formatting and cloud sync.",
    category: "Productivity",
    size: "15 MB",
    version: "3.0.1"
  },
  {
    id: "calc1",
    name: "Calculator",
    developer: "Appily Math",
    bgColor: "bg-gradient-to-br from-green-400 to-green-600",
    letter: "C",
    rating: 4.2,
    description: "A powerful calculator with scientific functions, unit conversion, and history tracking.",
    category: "Utilities",
    size: "5 MB",
    version: "1.2.0"
  },
  {
    id: "photos1",
    name: "Photos",
    developer: "Appily",
    bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
    letter: "P",
    rating: 4.9,
    description: "Organize and edit your photos with powerful yet easy-to-use tools. Includes filters, cropping, and basic adjustments.",
    category: "Photography",
    size: "24 MB",
    version: "2.3.5"
  },
  {
    id: "calendar1",
    name: "Calendar",
    developer: "Appily Time",
    bgColor: "bg-gradient-to-br from-red-400 to-red-600",
    letter: "C",
    rating: 4.6,
    description: "Keep track of your schedule with this intuitive calendar app. Set events, reminders, and recurring appointments.",
    category: "Productivity",
    size: "10 MB",
    version: "1.7.3"
  },
]

const popularApps: App[] = [
  {
    id: "photo-editor1",
    name: "Photo Editor",
    developer: "Appily Creative",
    bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
    letter: "P",
    rating: 4.9,
    description: "Professional photo editing tools in your pocket. Adjust colors, apply filters, add text, and create stunning compositions.",
    category: "Photography",
    size: "32 MB",
    version: "3.1.4"
  },
  {
    id: "music1",
    name: "Music Player",
    developer: "Appily Audio",
    bgColor: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    letter: "M",
    rating: 4.6,
    description: "Play your music with this elegant and feature-rich music player. Supports playlists, equalizer, and background playback.",
    category: "Music",
    size: "18 MB",
    version: "2.4.0"
  },
  {
    id: "fitness1",
    name: "Fitness Tracker",
    developer: "Appily Health",
    bgColor: "bg-gradient-to-br from-green-400 to-green-600",
    letter: "F",
    rating: 4.4,
    description: "Track your workouts, monitor your progress, and reach your fitness goals. Includes running, cycling, and strength training.",
    category: "Health & Fitness",
    size: "22 MB",
    version: "2.0.3"
  },
]

interface AppCardProps {
  app: App
  onClick: () => void
  isDownloading?: boolean
  isDownloaded?: boolean
}

function AppCard({ app, onClick, isDownloading, isDownloaded }: AppCardProps) {
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div className={`w-12 h-12 rounded-xl ${app.bgColor} flex items-center justify-center mb-1 shadow-sm`}>
        <span className="text-white font-semibold">{app.letter}</span>
      </div>
      <h3 className="text-[9px] font-medium text-center truncate w-full">{app.name}</h3>
      <p className="text-[8px] text-zinc-500 dark:text-zinc-400 truncate w-full text-center">{app.developer}</p>
      {isDownloaded && (
        <div className="text-[8px] text-green-500 mt-0.5">Installed</div>
      )}
      {isDownloading && (
        <div className="w-8 h-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-blue-500 w-1/2 animate-pulse"></div>
        </div>
      )}
    </button>
  )
}

interface AppListItemProps {
  app: App
  onClick: () => void
  onDownload: () => void
  isDownloading?: boolean
  isDownloaded?: boolean
}

function AppListItem({ app, onClick, onDownload, isDownloading, isDownloaded }: AppListItemProps) {
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload()
  }

  return (
    <div 
      className="flex items-center p-2 bg-white dark:bg-black rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-xl ${app.bgColor} flex items-center justify-center mr-2 shadow-sm`}>
        <span className="text-white font-semibold">{app.letter}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-medium truncate">{app.name}</h3>
        <p className="text-[9px] text-zinc-500 dark:text-zinc-400 truncate">{app.developer}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center">
          <span className="text-[9px] mr-1">{app.rating}</span>
          <span className="text-yellow-400 text-[9px]">★</span>
        </div>
        
        {isDownloaded ? (
          <div className="text-[8px] text-green-500">Installed</div>
        ) : (
          <Button 
            size="sm" 
            className="h-6 px-2 text-[9px]"
            onClick={handleDownloadClick}
            disabled={isDownloading}
          >
            {isDownloading ? '...' : 'Get'}
          </Button>
        )}
      </div>
    </div>
  )
}