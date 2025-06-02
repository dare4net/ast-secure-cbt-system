"use client"

import { useState, useEffect, useCallback } from "react"
import type { ExamSchedule, ExamAvailability } from "@/types/cbt"

export function useExamSchedule(schedule?: ExamSchedule) {
  const [availability, setAvailability] = useState<ExamAvailability>({
    isAvailable: false,
    status: "not-started",
    message: "Exam not scheduled",
    canStart: false,
    canSubmit: false,
  })

  const checkAvailability = useCallback(() => {
    if (!schedule) {
      setAvailability({
        isAvailable: true,
        status: "active",
        message: "Exam is available",
        canStart: true,
        canSubmit: true,
      })
      return
    }

    const now = new Date()
    const startDate = new Date(schedule.startDate)
    const endDate = new Date(schedule.endDate)
    const lateEndDate = new Date(endDate.getTime() + schedule.maxLateMinutes * 60 * 1000)

    const timeUntilStart = Math.max(0, Math.floor((startDate.getTime() - now.getTime()) / 1000))
    const timeUntilEnd = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / 1000))
    const timeUntilClosure = Math.max(0, Math.floor((lateEndDate.getTime() - now.getTime()) / 1000))

    let newAvailability: ExamAvailability

    if (now < startDate) {
      // Exam hasn't started yet
      newAvailability = {
        isAvailable: false,
        status: "not-started",
        message: `Exam will be available on ${startDate.toLocaleString()}`,
        timeUntilStart,
        canStart: schedule.allowEarlyStart,
        canSubmit: false,
      }
    } else if (now >= startDate && now <= endDate) {
      // Exam is active
      newAvailability = {
        isAvailable: true,
        status: "active",
        message: "Exam is currently available",
        timeUntilEnd,
        canStart: true,
        canSubmit: true,
      }
    } else if (now > endDate && now <= lateEndDate && schedule.allowLateSubmission) {
      // Late submission period
      newAvailability = {
        isAvailable: true,
        status: "late-submission",
        message: `Late submission period. ${schedule.lateSubmissionPenalty}% penalty will be applied.`,
        timeUntilClosure,
        canStart: false,
        canSubmit: true,
        penaltyPercentage: schedule.lateSubmissionPenalty,
      }
    } else {
      // Exam is closed
      newAvailability = {
        isAvailable: false,
        status: "closed",
        message: "Exam submission period has ended",
        canStart: false,
        canSubmit: false,
      }
    }

    setAvailability(newAvailability)
  }, [schedule])

  useEffect(() => {
    checkAvailability()
    const interval = setInterval(checkAvailability, 30000) // Update every second

    return () => clearInterval(interval)
  }, [checkAvailability])

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return "00:00:00"

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return {
    availability,
    formatTimeRemaining,
    checkAvailability,
  }
}
