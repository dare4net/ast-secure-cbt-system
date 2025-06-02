"use client"

import { useEffect, useCallback, useState } from "react"

interface SecurityOptions {
  enableTabSwitchDetection: boolean
  enableFullScreenMode: boolean
  enableCopyPasteProtection: boolean
  enableRightClickProtection: boolean
  onViolation: (violation: string) => void
}

export function useSecurity(options: SecurityOptions) {
  const [violations, setViolations] = useState<string[]>([])
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const addViolation = useCallback(
    (violation: string) => {
      setViolations((prev) => [...prev, violation])
      options.onViolation(violation)
    },
    [options],
  )

  // Tab switch detection
  useEffect(() => {
    if (!options.enableTabSwitchDetection) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1)
        addViolation(`Tab switched at ${new Date().toISOString()}`)
      }
    }

    const handleBlur = () => {
      addViolation(`Window lost focus at ${new Date().toISOString()}`)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [options.enableTabSwitchDetection, addViolation])

  // Full screen mode
  useEffect(() => {
    if (!options.enableFullScreenMode) return

    const enterFullScreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen()
          setIsFullScreen(true)
        }
      } catch (error) {
        addViolation("Failed to enter fullscreen mode - user gesture required")
      }
    }

    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement
      setIsFullScreen(isCurrentlyFullScreen)

      if (!isCurrentlyFullScreen && options.enableFullScreenMode) {
        addViolation("Exited fullscreen mode")
      }
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [options.enableFullScreenMode, addViolation])

  // Add method to manually trigger fullscreen
  const requestFullScreen = useCallback(async () => {
    if (options.enableFullScreenMode && !document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullScreen(true)
      } catch (error) {
        addViolation("Failed to enter fullscreen mode")
      }
    }
  }, [options.enableFullScreenMode, addViolation])

  // Copy/paste protection
  useEffect(() => {
    if (!options.enableCopyPasteProtection) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X, F12, etc.
      if (
        (e.ctrlKey && ["c", "v", "a", "x", "s"].includes(e.key.toLowerCase())) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J")
      ) {
        e.preventDefault()
        addViolation(`Attempted keyboard shortcut: ${e.key}`)
      }
    }

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      addViolation("Attempted to copy content")
    }

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      addViolation("Attempted to paste content")
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("copy", handleCopy)
    document.addEventListener("paste", handlePaste)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("paste", handlePaste)
    }
  }, [options.enableCopyPasteProtection, addViolation])

  // Right-click protection
  useEffect(() => {
    if (!options.enableRightClickProtection) return

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      addViolation("Attempted right-click")
    }

    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [options.enableRightClickProtection, addViolation])

  return {
    violations,
    tabSwitchCount,
    isFullScreen,
    addViolation,
    requestFullScreen,
  }
}
