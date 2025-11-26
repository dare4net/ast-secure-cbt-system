"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "./splash-screen"

interface AppWithSplashProps {
  children: React.ReactNode
  disableSplash?: boolean
  alwaysShow?: boolean // For development/testing
}

export function AppWithSplash({ children, disableSplash = false, alwaysShow = false }: AppWithSplashProps) {
  const [showSplash, setShowSplash] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted to avoid hydration mismatch
    setIsMounted(true)
    
    if (disableSplash) {
      return
    }

    // If alwaysShow is true, always display splash (useful for development)
    if (alwaysShow) {
      setShowSplash(true)
      return
    }
    
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splash-shown")
    if (!splashShown) {
      setShowSplash(true)
    }
  }, [disableSplash, alwaysShow])

  const handleSplashComplete = () => {
    setShowSplash(false)
    if (!alwaysShow) {
      sessionStorage.setItem("splash-shown", "true")
    }
  }

  // Always render children on server and during initial mount
  // Only show splash after client-side mount
  if (!isMounted || !showSplash) {
    return <>{children}</>
  }

  return <SplashScreen onComplete={handleSplashComplete} duration={5000} />
}
