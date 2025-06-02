"use client"

import type React from "react"

import { useState } from "react"
import type { ExamData } from "@/types/cbt"
import { useExamSchedule } from "@/hooks/use-exam-schedule"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, FileText, Upload, User, AlertTriangle } from "lucide-react"

interface ExamDashboardProps {
  onExamSelect: (examData: ExamData) => void
}

export function ExamDashboard({ onExamSelect }: ExamDashboardProps) {
  const [examFiles, setExamFiles] = useState<ExamData[]>([])
  const [studentName, setStudentName] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const examData: ExamData = JSON.parse(e.target?.result as string)
          setExamFiles((prev) => {
            // Avoid duplicates
            const exists = prev.some((exam) => exam.config.title === examData.config.title)
            if (exists) return prev
            return [...prev, examData]
          })
        } catch (error) {
          alert(`Invalid exam file: ${file.name}`)
        }
      }
      reader.readAsText(file)
    })
  }

  const ExamCard = ({ exam }: { exam: ExamData }) => {
    const { availability, formatTimeRemaining } = useExamSchedule(exam.config.schedule)

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{exam.config.title}</span>
            <Badge variant={availability.canStart ? "default" : "secondary"}>
              {availability.status.replace("-", " ").toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">{exam.config.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Duration:</strong> {exam.config.timeLimit} minutes
            </div>
            <div>
              <strong>Questions:</strong> {exam.config.totalQuestions}
            </div>
            <div>
              <strong>Passing Score:</strong> {exam.config.passingScore}%
            </div>
            <div>
              <strong>Attempts:</strong> {exam.config.maxAttempts}
            </div>
          </div>

          {exam.config.schedule && (
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Scheduled:</strong>
                <br />
                {new Date(exam.config.schedule.startDate).toLocaleString()} -{" "}
                {new Date(exam.config.schedule.endDate).toLocaleString()}
              </div>

              {availability.timeUntilStart !== undefined && availability.timeUntilStart > 0 && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span>Starts in: {formatTimeRemaining(availability.timeUntilStart)}</span>
                </div>
              )}

              {availability.timeUntilEnd !== undefined && availability.timeUntilEnd > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Ends in: {formatTimeRemaining(availability.timeUntilEnd)}</span>
                </div>
              )}

              {availability.status === "late-submission" && (
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Late submission: {availability.penaltyPercentage}% penalty</span>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={() => onExamSelect(exam)}
            disabled={!availability.canStart}
            className="w-full"
            variant={availability.canStart ? "default" : "outline"}
          >
            {availability.canStart ? "Start Exam" : availability.message}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Student Exam Dashboard</h1>
          <p className="text-xl text-muted-foreground">View and access your scheduled exams</p>
        </div>

        {/* Student Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">Current Time: {new Date().toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Exams */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Exam Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Upload exam JSON files provided by your instructor. You can upload multiple files at once.
              </p>
              <input
                type="file"
                accept=".json"
                multiple
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Available Exams */}
        {examFiles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Available Exams ({examFiles.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examFiles.map((exam, index) => (
                <ExamCard key={index} exam={exam} />
              ))}
            </div>
          </div>
        )}

        {examFiles.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Exams Available</h3>
              <p className="text-muted-foreground">Upload exam files to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
