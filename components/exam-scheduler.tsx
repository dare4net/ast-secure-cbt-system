"use client"

import { useState } from "react"
import type { ExamSchedule } from "@/types/cbt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, CheckCircle } from "lucide-react"

interface ExamSchedulerProps {
  schedule?: ExamSchedule
  onScheduleChange: (schedule: ExamSchedule | undefined) => void
}

export function ExamScheduler({ schedule, onScheduleChange }: ExamSchedulerProps) {
  const [isEnabled, setIsEnabled] = useState(!!schedule)
  const [formData, setFormData] = useState<Partial<ExamSchedule>>(
    schedule || {
      startDate: "",
      endDate: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      allowEarlyStart: false,
      allowLateSubmission: true,
      lateSubmissionPenalty: 10,
      maxLateMinutes: 30,
      isActive: true,
    },
  )

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Kolkata",
    "Australia/Sydney",
    "Pacific/Auckland",
  ]

  const handleSave = () => {
    if (!isEnabled) {
      onScheduleChange(undefined)
      return
    }

    if (!formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields")
      return
    }

    const startDate = new Date(formData.startDate!)
    const endDate = new Date(formData.endDate!)

    if (startDate >= endDate) {
      alert("End date must be after start date")
      return
    }

    const newSchedule: ExamSchedule = {
      id: schedule?.id || `schedule-${Date.now()}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timezone: formData.timezone!,
      allowEarlyStart: formData.allowEarlyStart!,
      allowLateSubmission: formData.allowLateSubmission!,
      lateSubmissionPenalty: formData.lateSubmissionPenalty!,
      maxLateMinutes: formData.maxLateMinutes!,
      isActive: formData.isActive!,
      createdAt: schedule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onScheduleChange(newSchedule)
  }

  const getLocalDateTime = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toISOString().slice(0, 16) // Format for datetime-local input
  }

  const setLocalDateTime = (field: "startDate" | "endDate", value: string) => {
    if (!value) {
      setFormData({ ...formData, [field]: "" })
      return
    }
    const date = new Date(value)
    setFormData({ ...formData, [field]: date.toISOString() })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Exam Scheduling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="enableScheduling">Enable Exam Scheduling</Label>
          <Switch
            id="enableScheduling"
            checked={isEnabled}
            onCheckedChange={(checked) => {
              setIsEnabled(checked)
              if (!checked) {
                onScheduleChange(undefined)
              }
            }}
          />
        </div>

        {isEnabled && (
          <div className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                When scheduling is enabled, students can only access the exam during the specified time window.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={getLocalDateTime(formData.startDate || "")}
                  onChange={(e) => setLocalDateTime("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={getLocalDateTime(formData.endDate || "")}
                  onChange={(e) => setLocalDateTime("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Advanced Options</h4>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowEarlyStart">Allow Early Start</Label>
                  <p className="text-sm text-muted-foreground">Students can start before the official start time</p>
                </div>
                <Switch
                  id="allowEarlyStart"
                  checked={formData.allowEarlyStart}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowEarlyStart: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowLateSubmission">Allow Late Submission</Label>
                  <p className="text-sm text-muted-foreground">Students can submit after the end time with penalty</p>
                </div>
                <Switch
                  id="allowLateSubmission"
                  checked={formData.allowLateSubmission}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowLateSubmission: checked })}
                />
              </div>

              {formData.allowLateSubmission && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor="lateSubmissionPenalty">Late Submission Penalty (%)</Label>
                    <Input
                      id="lateSubmissionPenalty"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.lateSubmissionPenalty}
                      onChange={(e) =>
                        setFormData({ ...formData, lateSubmissionPenalty: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLateMinutes">Max Late Minutes</Label>
                    <Input
                      id="maxLateMinutes"
                      type="number"
                      min="1"
                      value={formData.maxLateMinutes}
                      onChange={(e) => setFormData({ ...formData, maxLateMinutes: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}
            </div>

            {formData.startDate && formData.endDate && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Schedule Preview
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Start:</strong> {new Date(formData.startDate).toLocaleString()} ({formData.timezone})
                  </p>
                  <p>
                    <strong>End:</strong> {new Date(formData.endDate).toLocaleString()} ({formData.timezone})
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {Math.round(
                      (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 60000,
                    )}{" "}
                    minutes
                  </p>
                  {formData.allowLateSubmission && (
                    <p>
                      <strong>Late submission until:</strong>{" "}
                      {new Date(
                        new Date(formData.endDate).getTime() + (formData.maxLateMinutes || 0) * 60000,
                      ).toLocaleString()}{" "}
                      (with {formData.lateSubmissionPenalty}% penalty)
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button onClick={handleSave} className="w-full">
              Save Schedule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
