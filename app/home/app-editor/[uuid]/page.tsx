"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ResizablePanelGroup } from "@/components/ui/resizable"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GlowEffects } from "@/components/ui/glow-effects"
import { triggerGeneration } from "@/utils/api"
import { useProjectUpdates } from "@/hooks/useProjectUpdates"
import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatContent } from "@/components/chat/chat-content"
import { BlueResizableHandle } from "@/components/ui/blue-resizable-handle"
import { CodePreviewPanel } from "@/components/code/code-preview-panel"
import { toast } from "sonner"

// Memoize static/heavy components
const MemoizedAnimatedBackground = React.memo(AnimatedBackground)
const MemoizedGlowEffects = React.memo(GlowEffects)
const MemoizedChatPanel = React.memo(ChatPanel)
const MemoizedCodePreviewPanel = React.memo(CodePreviewPanel)

export default function AppEditorPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const [input, setInput] = useState("")
  const [selectedModel, setSelectedModel] = useState(() => {
    // Initialize from localStorage or default
    const savedModel = typeof window !== 'undefined' 
      ? localStorage.getItem('appily-selected-model') 
      : null
    return savedModel || "anthropic/claude-3.7-sonnet"
  })
  
  // Initialize enhancePrompt from localStorage, with specific project value taking precedence
  const [enhancePrompt, setEnhancePrompt] = useState(() => {
    if (typeof window === 'undefined') return true
    
    // First try project-specific enhance setting
    const projectEnhanceSetting = localStorage.getItem(`appily-enhance-prompt-${uuid}`)
    if (projectEnhanceSetting !== null) {
      return projectEnhanceSetting === 'true'
    }
    
    // Then try global enhance setting
    const globalEnhanceSetting = localStorage.getItem('appily-enhance-prompt')
    if (globalEnhanceSetting !== null) {
      return globalEnhanceSetting === 'true'
    }
    
    // Default to true if nothing found
    return true
  })
  
  const [initialPromptProcessed, setInitialPromptProcessed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "logs" | "chat">("code")

  // Log enhancePrompt value whenever it changes and save to localStorage
  useEffect(() => {
    console.log('enhancePrompt value:', enhancePrompt)
    // Save to localStorage when it changes
    localStorage.setItem('appily-enhance-prompt', enhancePrompt.toString())
  }, [enhancePrompt])
  
  // Listen for changes to global enhancePrompt setting
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appily-enhance-prompt') {
        const newValue = e.newValue === 'true'
        console.log('Global enhancePrompt changed:', newValue)
        setEnhancePrompt(newValue)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const { 
    logs, 
    projectStatus, 
    result,
    loading: projectLoading,
    error: projectError,
    initialCheckStatus,
    initialCheckError,
    chatMessages
  } = useProjectUpdates(uuid)

  // Derive generating state directly from project status
  const isGenerating = projectStatus === 'pending' || projectStatus === 'running';

  const activeAssistantMessageIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (isMobile) {
      setActiveTab("chat")
    } else {
      setActiveTab("code")
    }
  }, [isMobile])
  
  const messagesContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  
  const triggerGenerationRef = useRef<(prompt: string) => Promise<void>>(null!)
  
  const handleSendMessage = useCallback(async (messageText: string = input) => {
    if (!messageText.trim() || isGenerating) return
    
    // const userMessage: Message = {
    //   id: crypto.randomUUID(),
    //   role: "user",
    //   content: messageText,
    //   timestamp: new Date()
    // }
    
    setInput("")
    
    triggerGenerationRef.current(messageText)
  }, [input, isGenerating])
  
  triggerGenerationRef.current = async (prompt: string) => {
    try {
      // Backend will now send the "Okay, starting work..." message via the chat collection
      const apiResponse = await triggerGeneration(
        prompt,
        selectedModel,
        uuid,
        enhancePrompt
      )
      
      console.log(`Generation triggered successfully for ${apiResponse.projectId}. Initial status: ${apiResponse.initialStatus}. Listener is already active.`)
      
    } catch (error) {
      console.error('Error triggering generation:', error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while starting the generation."
      activeAssistantMessageIdRef.current = null
      toast.error(`Failed to start generation: ${errorMessage}`)
    }
  }

  // useEffect for handling project errors and showing toasts (separated from isGenerating logic)
  useEffect(() => {
    if (projectError) {
      console.error("Project update error state:", { projectError, initialCheckStatus, initialCheckError });

      if (initialCheckStatus === 'timed_out') {
        toast.error(`Project generation timed out for ${uuid}.`);
      } else if (initialCheckStatus === 'error' && initialCheckError) {
        toast.error(`Error checking project status: ${initialCheckError.message}`);
      } else if (projectError.message.includes('not found') || projectError.message.includes('deleted')) {
        toast.error(`Project ${uuid} not found or was deleted.`);
      } else if (projectError) {
        if (!['error', 'not_found', 'timed_out'].includes(initialCheckStatus)) {
          toast.error(`Error listening for project updates: ${projectError.message}`);
        }
      }
      // Maybe reset active assistant message if an error occurs during listening
      // activeAssistantMessageIdRef.current = null; 
      // Do not return here, allow the next effect to potentially update messages
    }
  }, [projectError, initialCheckStatus, initialCheckError, uuid]);

  useEffect(() => {
    const activeMessageId = activeAssistantMessageIdRef.current;

    if (!activeMessageId || (projectStatus !== 'complete' && projectStatus !== 'error')) {
      return; 
    }

    let finalContent = "";

    if (projectStatus === 'complete') {
      if (result && result.generationSummary) {
        const summary = result.generationSummary;
        finalContent = "✅ Code generation complete! Here's a summary:\n\n";
        
        if (result.deployUrl) {
          finalContent += `🌐 **Preview URL**: [${result.deployUrl}](${result.deployUrl})\n\n`;
          setActiveTab("preview"); 
        }
        
        finalContent += `📊 **Generation Summary**:\n`;
        finalContent += `- Success: ${summary.success ? '✅' : '❌'}\n`;
        finalContent += `- Files generated: ${summary.fileCount}\n`;
        finalContent += `- Generation time: ${(summary.totalDurationMs / 1000).toFixed(2)}s\n`;
        finalContent += `- Model used: ${summary.modelKey}\n`;
        finalContent += `- Tokens: ${summary.inputTokens} in / ${summary.outputTokens} out\n`;
        finalContent += `- Speed: ${summary.outputTokensPerSecond.toFixed(2)} tokens/sec\n`;
        
        if (!summary.success || summary.lintError || summary.buildError) {
          finalContent += `\n⚠️ **Potential Issues Detected:**\n`;
          if (!summary.success) finalContent += `- Generation process reported failure.\n`;
          if (summary.lintError) finalContent += `- Lint errors detected. Check logs.\n`;
          if (summary.buildError) finalContent += `- Build errors detected. Check logs.\n`;
        }
        toast.success("Generation completed!");
      } else if (result && !result.generationSummary) {
        finalContent = "✅ Generation process finished, but the summary details are missing.";
        if (result.deployUrl) { 
            finalContent += `\n\n🌐 **Preview URL**: [${result.deployUrl}](${result.deployUrl})`;
            setActiveTab("preview");
        }
        toast.warning("Generation finished but summary details missing.");
      } else { 
        console.warn("Project status is complete, but result data is not yet available. Waiting for result listener...");
        return;
      }
    } else if (projectStatus === 'error') {
      finalContent = "❌ Generation failed. Check the logs for more details.";
      if (projectError) {
        finalContent += `\nListener error: ${projectError.message}`;
      }
      toast.error("Generation failed. Please check the logs.");
    }

    if (finalContent && (projectStatus === 'complete' || projectStatus === 'error')) {
      console.log("Generation finished. Backend should send final chat message.");
      activeAssistantMessageIdRef.current = null;
    }

  }, [projectStatus, result, projectError]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isGenerating) {
        handleSendMessage()
      }
    }
  }, [isGenerating, handleSendMessage])
  
  const [shouldAutoScrollChat, setShouldAutoScrollChat] = useState(true)
  const prevMessagesLengthRef = useRef(0)
  
  const handleChatScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setShouldAutoScrollChat(isAtBottom)
    }
  }, [])
  
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleChatScroll)
      return () => container.removeEventListener('scroll', handleChatScroll)
    }
  }, [handleChatScroll])
  
  useEffect(() => {
    const hasNewMessages = chatMessages.length > prevMessagesLengthRef.current
    prevMessagesLengthRef.current = chatMessages.length
    
    if (shouldAutoScrollChat && hasNewMessages && messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 0)
    }
  }, [chatMessages, shouldAutoScrollChat])
  
  useEffect(() => {
    if (!initialPromptProcessed) {
      const savedModel = localStorage.getItem('appily-selected-model')
      if (savedModel) {
        setSelectedModel(savedModel)
      }
    }
  }, [initialPromptProcessed])
  
  useEffect(() => {
    localStorage.setItem('appily-selected-model', selectedModel)
  }, [selectedModel])
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    if (initialPromptProcessed || !uuid) return
    
    const storedPrompt = localStorage.getItem(`appily-prompt-${uuid}`)
    const storedModel = localStorage.getItem(`appily-model-${uuid}`)
    
    if (storedModel) {
      setSelectedModel(storedModel)
      localStorage.setItem('appily-selected-model', storedModel)
    }
    
    const storedEnhancePrompt = localStorage.getItem(`appily-enhance-prompt-${uuid}`)
    if (storedEnhancePrompt !== null) {
      setEnhancePrompt(storedEnhancePrompt === 'true')
    }
    
    if (storedPrompt) {
      handleSendMessage(storedPrompt)
      localStorage.removeItem(`appily-prompt-${uuid}`)
      localStorage.removeItem(`appily-model-${uuid}`)
      localStorage.removeItem(`appily-enhance-prompt-${uuid}`)
    }
    
    setInitialPromptProcessed(true)
  }, [uuid, initialPromptProcessed, handleSendMessage])
  
  return (
    <div className="fixed inset-0 pt-16 bg-gradient-to-b from-background/90 via-background/80 to-blue-950/20">
      <MemoizedAnimatedBackground particleCount={25} />
      <MemoizedGlowEffects intensity={0.7} />
      
      <div className="absolute inset-x-0 top-16 bottom-0 px-4 py-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          <ResizablePanelGroup
            direction={isMobile ? "vertical" : "horizontal"}
            className="h-full rounded-xl border border-blue-500/30 shadow-lg backdrop-blur-sm bg-background/50 w-full overflow-hidden"
          >
          {isMobile ? (
              <MemoizedCodePreviewPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                generationResponse={result}
                logs={logs}
                chatMessages={chatMessages}
                isLoading={projectLoading || isGenerating}
                error={projectError?.message}
                isMobile={isMobile}
                chatContent={
                  <div className="h-full">
                    <ChatContent
                      isMobile={isMobile}
                      chatMessages={chatMessages}
                      messagesContainerRef={messagesContainerRef}
                      generationResponse={result}
                      input={input}
                      setInput={setInput}
                      handleKeyDown={handleKeyDown}
                      handleSendMessage={handleSendMessage}
                      isGenerating={isGenerating}
                      selectedModel={selectedModel}
                      setSelectedModel={setSelectedModel}
                    />
                  </div>
                }
                projectId={uuid}
                defaultSize={10}
                minSize={10}
                maxSize={70}
              />
          ) : (
            <>
              <MemoizedChatPanel 
                isMobile={isMobile}
                {...{ // Pass props as an object for memoization consistency
                  chatMessages,
                  messagesContainerRef,
                  generationResponse: result,
                  input,
                  setInput,
                  handleKeyDown,
                  handleSendMessage,
                  isGenerating, // Pass derived state
                  selectedModel,
                  setSelectedModel
                }}
                defaultSize={30}
                minSize={25}
                maxSize={40}
              />
              
              <BlueResizableHandle />
              
              <MemoizedCodePreviewPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                generationResponse={result}
                logs={logs}
                chatMessages={chatMessages}
                isLoading={projectLoading || isGenerating}
                error={projectError?.message}
                isMobile={isMobile}
                projectId={uuid}
                defaultSize={70}
                minSize={60}
                maxSize={75}
              />
            </>
          )}
          </ResizablePanelGroup>
        </motion.div>
      </div>
    </div>
  )
}
