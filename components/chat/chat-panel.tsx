"use client"

import { ResizablePanel } from "@/components/ui/resizable"
import { Message } from "@/types/message"
import { GenerateResponse } from "@/types/generation"
import { ChatContent } from "./chat-content"

interface ChatPanelProps {
  isMobile: boolean
  chatMessages?: Message[]
  messagesContainerRef: React.RefObject<HTMLDivElement>
  generationResponse: GenerateResponse | null
  input: string
  setInput: (value: string) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleSendMessage: (messageText?: string) => Promise<void>
  isGenerating: boolean
  selectedModel: string
  setSelectedModel: (model: string) => void
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

export function ChatPanel({
  isMobile,
  chatMessages,
  messagesContainerRef,
  generationResponse,
  input,
  setInput,
  handleKeyDown,
  handleSendMessage,
  isGenerating,
  selectedModel,
  setSelectedModel,
  defaultSize = isMobile ? 100 : 30,
  minSize = 25,
  maxSize = isMobile ? 100 : 40
}: ChatPanelProps) {
  return (
    <ResizablePanel defaultSize={defaultSize} minSize={minSize} maxSize={maxSize}>
      <ChatContent
        isMobile={isMobile}
        chatMessages={chatMessages}
        messagesContainerRef={messagesContainerRef}
        generationResponse={generationResponse}
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        handleSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </ResizablePanel>
  )
}
