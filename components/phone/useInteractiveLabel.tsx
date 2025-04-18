"use client"

import { useState, useEffect, useCallback } from "react"

// Define screen/app types
type ScreenType = "home" | "build" | "store" | "homeApp" | "storeApp" | "buildApp" | "todoApp"

export function useInteractiveLabel() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("home")
  const [labelText, setLabelText] = useState("Interact with me")

  // Create a function to update label text that can be called from outside effects
  const updateLabelText = useCallback((screen: ScreenType) => {
    switch (screen) {
      case "home":
        setLabelText("Browse your Appily apps")
        break
      case "build":
        setLabelText("Create new apps here")
        break
      case "store":
        setLabelText("Discover apps in the Appily Store")
        break
      case "homeApp":
        setLabelText("Open any app you've installed")
        break
      case "storeApp":
        setLabelText("Tap to install new apps")
        break
      case "buildApp":
        setLabelText("Design your app with AI")
        break
      case "todoApp":
        setLabelText("Todo app - Add tasks to your list")
        break
      default:
        setLabelText("Interact with me")
    }
  }, [])

  // Update label text based on active screen
  useEffect(() => {
    updateLabelText(activeScreen)
  }, [activeScreen, updateLabelText])

  const setActiveScreenWithUpdate = useCallback((screen: ScreenType) => {
    setActiveScreen(screen);
    updateLabelText(screen);
  }, [updateLabelText]);

  return {
    labelText,
    setActiveScreen: setActiveScreenWithUpdate,
    activeScreen,
  }
} 