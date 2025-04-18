import { motion } from "framer-motion"
import { MessageSquare, SendHorizontal, Settings, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Message } from "@/types/message"
import { GenerateResponse } from "@/types/generation"
import { CopyUrlButton } from "@/components/chat/copy-url-button"
import { ModelSelector } from "@/components/model-selector"
import { BackendSwitch } from "@/components/backend-switch"

interface ChatContentProps {
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
  className?: string
}

export function ChatContent({
  isMobile,
  chatMessages = [],
  messagesContainerRef,
  generationResponse,
  input,
  setInput,
  handleKeyDown,
  handleSendMessage,
  isGenerating,
  selectedModel,
  setSelectedModel,
  className
}: ChatContentProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Only show header when not in mobile view */}
      {!isMobile && (
        <motion.div 
          className="border-b px-4 py-3 bg-blue-50/50 dark:bg-blue-950/30 h-[72px] flex flex-col justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask questions about your project
          </p>
        </motion.div>
      )}
      
      {/* Chat messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-auto p-4 space-y-6">
        {chatMessages.length === 0 ? (
          <motion.div 
            className="flex h-full items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="text-center p-6 rounded-xl border border-blue-200/30 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/20 max-w-xs">
              <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3 opacity-75" />
              <p className="text-center text-muted-foreground mb-2">
                No messages yet. Start a conversation!
              </p>
              <p className="text-xs text-muted-foreground/70">
                Ask about your app idea or how to implement specific features.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {chatMessages.map((message, index) => {
              const isStatusUpdate = message.role === 'assistant' && message.type === 'status_update';

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : isStatusUpdate ? "justify-center" : "justify-start"
                  )}
                >
                  {/* Message bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-5 py-3.5 max-w-[90%] shadow-md overflow-hidden",
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border border-blue-400/30"
                        : isStatusUpdate
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 italic text-sm font-light max-w-[70%] text-center shadow-sm"
                          : "bg-background/80 border border-blue-100/80 dark:border-blue-800/40"
                    )}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed break-words overflow-auto">
                      {message.content}
                      {message.role === "assistant" && generationResponse?.deployUrl && (
                        <CopyUrlButton url={generationResponse.deployUrl} />
                      )}
                    </div>
                    {!isStatusUpdate && (
                      <div className={cn(
                        "text-xs mt-2 flex items-center",
                        message.role === "user" ? "text-blue-100" : "text-muted-foreground"
                      )}>
                        <span>{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {message.role === "user" && (
                          <motion.div 
                            className="ml-1.5 flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <span className="w-1 h-1 rounded-full bg-current mx-1 opacity-50" />
                            <span>You</span>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </>
        )}
      </div>
      
      {/* Input area */}
      <motion.div 
        className="border-t p-4 bg-blue-50/50 dark:bg-blue-950/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Settings className="h-3 w-3" />
              <span>Model:</span>
            </div>
            <div className="flex items-center gap-2 z-20">
              <BackendSwitch 
                variant="minimal" 
              />
              <ModelSelector 
                selectedModel={selectedModel} 
                onModelChange={setSelectedModel} 
                variant="minimal" 
              />
            </div>
          </div>
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[80px] max-h-[160px] pr-12 resize-none rounded-xl border-blue-200/70 dark:border-blue-700/40 focus-visible:ring-blue-500/40 bg-background/90 shadow-inner"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isGenerating}
              className="absolute bottom-2 right-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md border border-blue-400/30 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
          {!isMobile && (
            <div className="text-xs text-muted-foreground/70 text-center mt-1">
              Press Enter to send, Shift+Enter for a new line
            </div>
          )}
        </form>
      </motion.div>
    </div>
  )
}
