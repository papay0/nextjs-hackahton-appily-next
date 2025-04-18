"use client"

import { Code, Eye, FileCode, Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { ResizablePanel } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { LogDisplay } from "@/components/log-display"
import { GenerateResponse } from "@/types/generation"
import { Log } from "@/types/logs"
import { DeviceFrame } from "@/components/ui/device-frame"
import { Message } from "@/types/message"
import { CodeFilesFeed } from "./code-files-feed"

interface CodePreviewPanelProps {
  activeTab: "code" | "preview" | "logs" | "chat"
  setActiveTab: (tab: "code" | "preview" | "logs" | "chat") => void
  generationResponse: GenerateResponse | null
  logs: Log[]
  chatMessages?: Message[]
  isLoading: boolean
  error?: string | null
  isMobile: boolean
  chatContent?: React.ReactNode
  projectId?: string | null
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

export function CodePreviewPanel({
  activeTab,
  setActiveTab,
  generationResponse,
  logs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chatMessages,
  isLoading,
  error,
  isMobile,
  chatContent,
  projectId,
  defaultSize = 70,
  minSize = 60,
  maxSize = 75
}: CodePreviewPanelProps) {
  return (
    <ResizablePanel defaultSize={defaultSize} minSize={minSize} maxSize={maxSize}>
      <div className="flex h-full flex-col">
        <motion.div 
          className="border-b px-4 py-3 bg-blue-50/50 dark:bg-blue-950/30 h-[72px] flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              {/* Chat tab first when on mobile */}
              {isMobile && (
                <button
                  onClick={() => setActiveTab("chat")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                    activeTab === "chat"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
                  )}
                >
                  <Code className="h-4 w-4" />
                  <span>Chat</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab("code")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  activeTab === "code"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
                )}
              >
                <FileCode className="h-4 w-4" />
                <span>Code</span>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  activeTab === "preview"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
                )}
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  activeTab === "logs"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
                )}
              >
                <Terminal className="h-4 w-4" />
                <span>Live Logs</span>
              </button>
            </div>
            {/* Only show generation summary on desktop */}
            {!isMobile && generationResponse?.generationSummary && (
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold">{generationResponse.generationSummary.fileCount}</span> files
                <span className="mx-1.5">•</span>
                <span className="font-semibold">{generationResponse.generationSummary.modelKey}</span>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Code/Preview/Logs area */}
        <div className="flex-1 h-full p-4 overflow-hidden">
          {activeTab === "chat" && isMobile && chatContent && (
            /* Chat view for mobile */
            <div className="h-full">
              {chatContent}
            </div>
          )}
          
          {activeTab === "code" && (
            <div className="h-full">
              {projectId ? (
                <CodeFilesFeed projectId={projectId} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 rounded-xl border border-blue-200/30 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/20 max-w-md">
                    <Code className="h-10 w-10 text-blue-500 mx-auto mb-4 opacity-75" />
                    <p className="text-muted-foreground text-center mb-3 font-medium">
                      Code will appear here as you build your project
                    </p>
                    <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto">
                      Describe your app idea in the chat and watch as your code is generated in real-time with beautiful syntax highlighting.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "preview" && (
            /* Preview view */
            <div className="h-full">
              {generationResponse?.deployUrl ? (
                isMobile ? (
                  <iframe 
                    src={generationResponse.deployUrl} 
                    className="w-full h-full border-0"
                    title="App Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full">
                    <DeviceFrame>
                      <iframe 
                        src={generationResponse.deployUrl} 
                        title="App Preview"
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        loading="lazy"
                      />
                    </DeviceFrame>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 rounded-xl border border-blue-200/30 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/20 max-w-md">
                    <Eye className="h-10 w-10 text-blue-500 mx-auto mb-4 opacity-75" />
                    <p className="text-muted-foreground text-center mb-3 font-medium">
                      {isLoading ? "Generating preview..." : "Preview will appear here once generation is complete"}
                    </p>
                    {error && (
                       <p className="text-sm text-red-500 dark:text-red-400 mt-2">Error: {error}</p>
                    )}
                     {!isLoading && !error && (
                      <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto">
                        Describe your app idea in the chat and watch as your app is deployed with a live interactive preview.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "logs" && (
            /* Logs view */
            <div className="h-full">
              <LogDisplay logs={logs} isLoading={isLoading} error={error} />
            </div>
          )}
        </div>
      </div>
    </ResizablePanel>
  )
}
