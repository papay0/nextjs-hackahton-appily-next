"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronDown } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

export interface ModelOption {
  id: string
  name: string
  description: string
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    description: "Anthropic's most powerful model with exceptional reasoning"
  },
  {
    id: "openai/chatgpt-4o-latest",
    name: "GPT-4o",
    description: "OpenAI's most advanced multimodal model"
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Faster, more efficient version of GPT-4o"
  },
  {
    id: "openai/o3-mini-high",
    name: "OpenAI o3-mini",
    description: "Compact, efficient model for quick responses"
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    description: "Fast responses with Google's latest tech"
  },
  {
    id: "google/gemini-2.5-pro-preview-03-25",
    name: "Gemini 2.5 Pro",
    description: "Google's most advanced model"
  },
  {
    id: "deepseek/deepseek-r1-distill-llama-70b:free",
    name: "DeepSeek Distill 70B",
    description: "Powerful open-source model with 70B parameters"
  },
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat",
    description: "Chat with DeepSeek"
  },
  {
    id: "meta-llama/llama-4-scout",
    name: "Llama 4 Scout",
    description: "MetaAI's latest smaller model"
  },
  {
    id: "meta-llama/llama-4-maverick",
    name: "Llama 4 Maverick",
    description: "MetaAI's latest medium model"
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  variant?: "minimal" | "full"
  className?: string
}

export function ModelSelector({
  selectedModel = "anthropic/claude-3.7-sonnet",
  onModelChange,
  variant = "full",
  className
}: ModelSelectorProps) {
  // Simple dropdown state
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Get the current model option based on the selectedModel prop
  const currentOption = MODEL_OPTIONS.find(option => option.id === selectedModel) || MODEL_OPTIONS.find(option => option.id === "anthropic/claude-3.7-sonnet") || MODEL_OPTIONS[0]
  
  // Handle selecting a model
  const handleSelectModel = (modelId: string) => {
    if (onModelChange) {
      onModelChange(modelId)
    }
    // Save to localStorage for consistency across screens
    localStorage.setItem('appily-selected-model', modelId);
    setIsOpen(false)
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return
    
    const handleClickOutside = () => {
      setIsOpen(false)
    }
    
    // Use a timeout to allow the click event to complete first
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)
    
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])
  
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Button to open/close dropdown */}
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-200",
          variant === "minimal" ? "py-1.5 pl-3 pr-2 text-sm" : "py-2 pl-3 pr-2.5",
          "hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
        )}
      >
        <div className="flex flex-col">
          <span className={cn(
            "font-medium leading-none",
            variant === "minimal" ? "text-xs" : "text-sm"
          )}>
            {currentOption.name}
          </span>
          {variant === "full" && (
            <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {currentOption.description}
            </span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200 ml-1",
          isOpen && "rotate-180"
        )} />
      </button>
      
      {/* Dropdown menu - using portal to avoid being cut off by parent containers */}
      {isOpen && mounted && buttonRef.current && createPortal(
        <div 
          className="fixed z-[9999] w-[280px] overflow-hidden rounded-xl border border-blue-200/70 dark:border-blue-800/40 bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm"
          style={{
            bottom: window.innerHeight - buttonRef.current.getBoundingClientRect().top + 5,
            left: variant === "minimal" 
              ? buttonRef.current.getBoundingClientRect().right - 280 
              : buttonRef.current.getBoundingClientRect().left
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[320px] overflow-y-auto py-1">
            {MODEL_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectModel(option.id)
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 transition-colors",
                  currentOption.id === option.id && "bg-blue-50/80 dark:bg-blue-900/30"
                )}
              >
                <div className="flex flex-col items-start flex-1 text-left">
                  <span className="font-medium text-sm">{option.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {option.description}
                  </span>
                </div>
                {currentOption.id === option.id && (
                  <Check className="h-4 w-4 text-blue-500 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
