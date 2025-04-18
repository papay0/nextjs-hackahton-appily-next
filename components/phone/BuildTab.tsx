"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatInterface } from "./ChatInterface"

interface BuildTabProps {
  onCreateClick?: () => void;
}

export function BuildTab({ onCreateClick }: BuildTabProps) {
  const [prompt, setPrompt] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerationComplete, setIsGenerationComplete] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsChatOpen(true)
    simulateGeneration()
    if (onCreateClick) {
      onCreateClick()
    }
  }

  const simulateGeneration = () => {
    setIsGenerating(true)
    // Simulate generation process with a delay
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerationComplete(true)
    }, 5000)
  }

  const openChat = () => {
    setIsChatOpen(true)
    simulateGeneration()
    if (onCreateClick) {
      onCreateClick()
    }
  }

  const resetChat = () => {
    setIsChatOpen(false)
    setPrompt("")
    setIsGenerating(false)
    setIsGenerationComplete(false)
  }

  if (isChatOpen) {
    return (
      <ChatInterface 
        prompt={prompt} 
        isGenerating={isGenerating} 
        isComplete={isGenerationComplete} 
        onBack={resetChat} 
      />
    )
  }

  return (
    <div className="h-full flex flex-col p-3">
      <h2 className="text-lg font-semibold mb-3">What do you want to build?</h2>

      <div className="flex-1 overflow-auto mb-3">
        <div className="space-y-2">
          <IdeaCard
            title="Todo App"
            description="A simple todo app"
            onClick={() => {
              setPrompt("Build a todo app")
              openChat()
            }}
          />
          <IdeaCard
            title="Weather App"
            description="Check weather forecasts"
            onClick={() => {
              setPrompt("Build a weather app")
              openChat()
            }}
          />
          <IdeaCard
            title="Note Taking App"
            description="Simple notes with categories"
            onClick={() => {
              setPrompt("Build a note taking app")
              openChat()
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your app idea..."
          className="flex-1 text-xs h-8"
        />
        <Button type="submit" size="icon" className="h-8 w-8 shrink-0">
          <Send size={14} />
        </Button>
      </form>
    </div>
  )
}

interface IdeaCardProps {
  title: string
  description: string
  onClick: () => void
}

function IdeaCard({ title, description, onClick }: IdeaCardProps) {
  return (
    <button
      className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 text-left hover:shadow-md transition-shadow w-full"
      onClick={onClick}
    >
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-xs">{description}</p>
    </button>
  )
} 