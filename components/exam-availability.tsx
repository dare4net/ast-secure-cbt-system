"use client"
import { useExamSchedule } from "@/hooks/use-exam-schedule"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Timer } from "lucide-react"
import type { ExamSchedule } from "@/types/cbt"

interface ExamAvailabilityProps {
  schedule?: ExamSchedule
  examTitle: string
}

export function ExamAvailability({ schedule, examTitle }: ExamAvailabilityProps) {
  const { availability, formatTimeRemaining } = useExamSchedule(schedule)

  const getStatusIcon = () => {
    switch (availability.status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "not-started":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "late-submission":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "ended":
      case "closed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Timer className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (availability.status) {
      case "active":
        return "default"
      case "not-started":
        return "secondary"
      case "late-submission":
        return "destructive"
      case "ended":
      case "closed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getProgressValue = () => {
    if (!schedule) return 100

    const now = new Date()
    const start = new Date(schedule.startDate)
    const end = new Date(schedule.endDate)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()

    if (elapsed < 0) return 0
    if (elapsed > total) return 100

    return (elapsed / total) * 100
  }

  if (!schedule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {examTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Exam is available anytime</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {examTitle}
          </div>
          <Badge variant={getStatusColor() as any}>{availability.status.replace("-", " ").toUpperCase()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <AlertDescription>{availability.message}</AlertDescription>
          </div>
        </Alert>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Start Time:</strong>
              <br />
              {new Date(schedule.startDate).toLocaleString()}
            </div>
            <div>
              <strong>End Time:</strong>
              <br />
              {new Date(schedule.endDate).toLocaleString()}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Exam Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(getProgressValue())}%</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>

          {availability.timeUntilStart !== undefined && availability.timeUntilStart > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Starts in: {formatTimeRemaining(availability.timeUntilStart)}</span>
            </div>
          )}

          {availability.timeUntilEnd !== undefined && availability.timeUntilEnd > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4" />
              <span>Ends in: {formatTimeRemaining(availability.timeUntilEnd)}</span>
            </div>
          )}

          {availability.timeUntilClosure !== undefined && availability.timeUntilClosure > 0 && (
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Late submission closes in: {formatTimeRemaining(availability.timeUntilClosure)}</span>
            </div>
          )}

          {availability.penaltyPercentage !== undefined && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Late submission penalty: {availability.penaltyPercentage}% will be deducted from your final score.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <strong>Early Start:</strong> {schedule.allowEarlyStart ? "Allowed" : "Not Allowed"}
          </div>
          <div>
            <strong>Late Submission:</strong> {schedule.allowLateSubmission ? "Allowed" : "Not Allowed"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
