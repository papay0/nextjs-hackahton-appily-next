"use client"

import { useState, useCallback, useRef } from "react"
import { MobileFrame } from "@/components/phone/MobileFrame"
import { Tabs } from "@/components/phone/Tabs"
import { HomeScreen } from "@/components/phone/HomeScreen"
import { BuildTab } from "@/components/phone/BuildTab"
import { StoreTab } from "@/components/phone/StoreTab"
import { useMobile } from "@/components/phone/useMobile"
import { useInteractiveLabel } from "@/components/phone/useInteractiveLabel"

interface InteractivePhoneProps {
  onScreenChange?: (labelText: string) => void;
}

export function InteractivePhone({ onScreenChange }: InteractivePhoneProps) {
  const [activeTab, setActiveTab] = useState("home")
  const isMobile = useMobile()
  const { setActiveScreen } = useInteractiveLabel()
  const initialMountRef = useRef(true)
  
  // Update label when tab changes - directly pass the new label text
  const handleTabChange = useCallback((tab: string) => {
    // If this is the initial mount, don't update the label
    if (initialMountRef.current) {
      initialMountRef.current = false
      setActiveTab(tab)
      return
    }
    
    setActiveTab(tab)
    setActiveScreen(tab as "home" | "build" | "store")
    
    // Directly set the label text based on the tab
    if (onScreenChange) {
      let newLabelText = "Interact with me";
      
      switch(tab) {
        case "home":
          newLabelText = "Browse your Appily apps";
          break;
        case "build":
          newLabelText = "Create new apps here";
          break;
        case "store":
          newLabelText = "Discover apps in the Appily Store";
          break;
        default:
          newLabelText = "Interact with me";
      }
      
      onScreenChange(newLabelText);
    }
  }, [setActiveTab, setActiveScreen, onScreenChange])
  
  // Called when WebView is opened
  const handleWebView = useCallback(() => {
    setActiveScreen("todoApp")
    if (onScreenChange) {
      onScreenChange("Todo app - Add tasks to your list")
    }
  }, [setActiveScreen, onScreenChange])
  
  return (
    <div className={isMobile ? "scale-110 origin-center transform mx-auto pb-16" : "pb-6"}>
      <MobileFrame>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            {activeTab === "home" && <HomeScreen 
              onAppClick={() => {
                setActiveScreen("homeApp")
                if (onScreenChange) onScreenChange("Open any app you've installed")
              }}
              onWebViewOpen={handleWebView}
            />}
            {activeTab === "build" && <BuildTab onCreateClick={() => {
              setActiveScreen("buildApp")
              if (onScreenChange) onScreenChange("Design your app with AI")
            }} />}
            {activeTab === "store" && <StoreTab onAppClick={() => {
              setActiveScreen("storeApp")
              if (onScreenChange) onScreenChange("Tap to install new apps")
            }} />}
          </div>
          <Tabs activeTab={activeTab} onChange={handleTabChange} />
        </div>
      </MobileFrame>
    </div>
  )
} 