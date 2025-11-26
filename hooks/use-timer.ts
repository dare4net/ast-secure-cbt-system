"use client"

import { useState, useEffect, useCallback } from "react"

interface TimerOptions {
  totalTime: number // in seconds
  warningIntervals: number[] // in seconds
  onTimeUp: () => void
  onWarning: (timeLeft: number) => void
  autoSaveInterval?: number
  onAutoSave?: () => void
}

export function useTimer(options: TimerOptions) {
  const [timeLeft, setTimeLeft] = useState(options.totalTime)
  const [isRunning, setIsRunning] = useState(false)
  const [warningsShown, setWarningsShown] = useState<Set<number>>(new Set())
  const [latestWarning, setLatestWarning] = useState<string>("")

  type WarningLevel = "normal" | "warn" | "danger"
  const computeWarningLevel = useCallback(
    (t: number): WarningLevel => {
      // Derive thresholds: use the smallest configured warning as warn, and 60s as danger
      const sorted = [...options.warningIntervals].sort((a, b) => a - b)
      const warnThreshold = sorted.length > 0 ? sorted[0] : Math.max(300, Math.floor(options.totalTime * 0.1))
      const dangerThreshold = Math.min(60, warnThreshold)
      if (t <= dangerThreshold) return "danger"
      if (t <= warnThreshold) return "warn"
      return "normal"
    },
    [options.warningIntervals, options.totalTime],
  )
  const [warningLevel, setWarningLevel] = useState<WarningLevel>(computeWarningLevel(timeLeft))

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(options.totalTime)
    setIsRunning(false)
    setWarningsShown(new Set())
    setLatestWarning("")
    setWarningLevel(computeWarningLevel(options.totalTime))
  }, [options.totalTime])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1

        // Check for warnings
        options.warningIntervals.forEach((warningTime) => {
          if (newTime === warningTime && !warningsShown.has(warningTime)) {
            options.onWarning(newTime)
            setLatestWarning(`${Math.floor(newTime / 60)} minute${newTime / 60 !== 1 ? "s" : ""} remaining!`)
            setWarningsShown((prev) => new Set([...prev, warningTime]))
          }
        })

        // Check if time is up
        if (newTime <= 0) {
          setIsRunning(false)
          options.onTimeUp()
          return 0
        }

        // Update warning level reactively
        setWarningLevel(computeWarningLevel(newTime))
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, options, warningsShown, computeWarningLevel])

  // Auto-save functionality
  useEffect(() => {
    if (!isRunning || !options.autoSaveInterval || !options.onAutoSave) return

    const interval = setInterval(() => {
      options.onAutoSave()
    }, options.autoSaveInterval * 1000)

    return () => clearInterval(interval)
  }, [isRunning, options.autoSaveInterval, options.onAutoSave])

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }, [])

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    formatTime: () => formatTime(timeLeft),
    isTimeUp: timeLeft <= 0,
    warningLevel,
    latestWarning,
  }
}
