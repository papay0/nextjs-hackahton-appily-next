"use client"

import React, { useState, useTransition, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GlowEffects } from "@/components/ui/glow-effects"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { ModelSelector } from "@/components/model-selector"
import { BackendSwitch } from "@/components/backend-switch"
import { EnhancePromptSwitch } from "@/components/enhance-prompt-switch"

// Memoized components to prevent unnecessary re-renders
const MemoizedAnimatedBackground = React.memo(AnimatedBackground);
const MemoizedGlowEffects = React.memo(GlowEffects);

const HomePageTitle = React.memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="text-center relative"
  >
    {/* Animated sparkle effect */}
    <motion.div 
      className="absolute -left-16 -top-12 text-primary"
      animate={{ 
        rotate: [0, 15, -5, 0],
        scale: [1, 1.2, 0.9, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <Sparkles size={24} />
    </motion.div>
    <motion.div 
      className="absolute right-0 top-0 text-primary"
      animate={{ 
        rotate: [0, -10, 5, 0],
        scale: [1, 0.9, 1.1, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
    >
      <Sparkles size={20} />
    </motion.div>
    
    <AnimatedGradientText className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
      What do you want to build?
    </AnimatedGradientText>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="text-muted-foreground text-xl max-w-md mx-auto"
    >
      Prompt, run, edit, and deploy your mobile web app.
    </motion.p>
  </motion.div>
));
HomePageTitle.displayName = 'HomePageTitle';

interface HomePageControlsProps {
  enhancePrompt: boolean;
  onEnhancePromptChange: (value: boolean) => void;
  selectedModel: string;
  onModelChange: (value: string) => void;
}

const HomePageControls = React.memo(({ 
  enhancePrompt, 
  onEnhancePromptChange, 
  selectedModel, 
  onModelChange 
}: HomePageControlsProps) => (
  <div className="flex items-center justify-between mb-2 px-1">
    <div className="text-sm text-muted-foreground font-medium">Model</div>
    <div className="flex items-center gap-4 z-20">
      <EnhancePromptSwitch
        value={enhancePrompt}
        onChange={onEnhancePromptChange}
        variant="minimal"
      />
      <BackendSwitch 
        variant="minimal" 
      />
      <ModelSelector 
        selectedModel={selectedModel} 
        onModelChange={onModelChange} 
        variant="minimal" 
      />
    </div>
  </div>
));
HomePageControls.displayName = 'HomePageControls';

export default function HomePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3.7-sonnet")
  const [enhancePrompt, setEnhancePrompt] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  // Load saved model and enhance prompt setting from localStorage on component mount
  useEffect(() => {
    const savedModel = localStorage.getItem('appily-selected-model');
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    const savedEnhancePrompt = localStorage.getItem('appily-enhance-prompt');
    if (savedEnhancePrompt !== null) {
      setEnhancePrompt(savedEnhancePrompt === 'true');
    }
  }, [])
  
  // Memoize handlePromptSubmit to prevent unnecessary re-renders of components using it
  const handlePromptSubmit = useCallback(() => {
    if (!prompt.trim()) return
    
    const uuid = uuidv4()
    
    // Store the prompt, selected model, and enhance prompt setting in localStorage
    localStorage.setItem(`appily-prompt-${uuid}`, prompt)
    localStorage.setItem(`appily-model-${uuid}`, selectedModel)
    localStorage.setItem(`appily-enhance-prompt-${uuid}`, enhancePrompt.toString())
    localStorage.setItem('appily-enhance-prompt', enhancePrompt.toString()) // Save the global setting too
    
    // Animate transition and then navigate
    startTransition(() => {
      router.push(`/home/app-editor/${uuid}`)
    })
  }, [prompt, selectedModel, enhancePrompt, router, startTransition]); // Add dependencies

  // Memoize state setters passed down to avoid re-renders if HomePage itself re-renders for other reasons
  const handleEnhancePromptChange = useCallback((value: boolean) => {
    setEnhancePrompt(value);
    localStorage.setItem('appily-enhance-prompt', value.toString()) // Save the global setting too
  }, []);

  const handleModelChange = useCallback((value: string) => {
    setSelectedModel(value);
    localStorage.setItem('appily-selected-model', value); // Save the selected model
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-blue-950/5">
      {/* Animated background components - Memoized */}
      <MemoizedAnimatedBackground />
      <MemoizedGlowEffects />
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full flex flex-col items-center gap-8"
        >
          {/* Memoized Title Section */}
          <HomePageTitle />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-2xl relative"
          >
            <motion.div 
              className="flex flex-col gap-2 relative bg-background/60 backdrop-blur-sm rounded-xl border border-blue-500/20 shadow-lg p-3 overflow-hidden"
              whileHover={{ boxShadow: "0 0 25px rgba(59, 130, 246, 0.25)" }}
              animate={{ boxShadow: ["0 0 10px rgba(59, 130, 246, 0.1)", "0 0 15px rgba(59, 130, 246, 0.2)", "0 0 10px rgba(59, 130, 246, 0.1)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Subtle highlight effect */}
              {/* Ambient glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-sky-400/10 to-blue-600/15 pointer-events-none"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ zIndex: 0 }}
              />
              
              {/* Shimmer effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ zIndex: 0 }}
              />
              {/* Memoized Controls Section */}
              <HomePageControls 
                enhancePrompt={enhancePrompt}
                onEnhancePromptChange={handleEnhancePromptChange}
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
              />
              <div className="relative flex-grow z-10">
                <Textarea
                  className="text-lg sm:text-xl py-4 min-h-[60px] max-h-[200px] border-0 shadow-none focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground/70 placeholder:font-light resize-none overflow-auto rounded-lg"
                  style={{
                    background: "linear-gradient(180deg, rgba(59, 130, 246, 0.01), transparent)",
                    caretColor: "#3b82f6"
                  }}
                  placeholder="Describe your app idea..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handlePromptSubmit();
                    }
                  }}
                  disabled={isPending}
                  rows={Math.min(4, Math.max(1, prompt.split('\n').length))}
                />
              </div>
              
              {/* Typing indicator - appears when user is typing */}
              {prompt && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 z-10"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  layoutId="typing-indicator"
                />
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-2 sm:mt-0 ml-auto z-10">
                <Button 
                  onClick={handlePromptSubmit}
                  disabled={!prompt.trim() || isPending}
                  className="shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 shadow-md relative overflow-hidden border border-blue-400/30"
                  size="icon"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <ArrowRight size={22} />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
} 