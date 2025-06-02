"use client"

import type React from "react"

import { useState } from "react"
import type { ExamData, ExamAttempt } from "@/types/cbt"
import { CBTSystem } from "@/components/cbt-system"
import { AdminPanel } from "@/components/admin-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, FileText, Upload, User, CheckCircle, XCircle, Calendar } from "lucide-react"
import { ResultChecker } from "@/components/result-checker"
import type { StudentAnswerData } from "@/types/cbt"
import { ExamDashboard } from "@/components/exam-dashboard"

export default function HomePage() {
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([])
  const [currentView, setCurrentView] = useState<
    "home" | "admin" | "exam" | "results" | "result-checker" | "dashboard"
  >("home")
  const [studentId] = useState("student-" + Math.random().toString(36).substr(2, 9))

  const handleExamUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data: ExamData = JSON.parse(e.target?.result as string)
        setExamData(data)
        setCurrentView("exam")
      } catch (error) {
        alert("Invalid exam file")
      }
    }
    reader.readAsText(file)
  }

  const handleExamComplete = (attempt: ExamAttempt, studentAnswerData: StudentAnswerData) => {
    setExamAttempts((prev) => [...prev, attempt])
    setCurrentView("results")
  }

  const renderResults = () => {
    if (examAttempts.length === 0) return null

    const latestAttempt = examAttempts[examAttempts.length - 1]
    const passed = (latestAttempt.score || 0) >= (examData?.config.passingScore || 70)

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {passed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Exam Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{latestAttempt.score}%</div>
                  <div className="text-muted-foreground">Final Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {Math.floor((latestAttempt.endTime!.getTime() - latestAttempt.startTime.getTime()) / 60000)}
                  </div>
                  <div className="text-muted-foreground">Minutes Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{latestAttempt.tabSwitchCount}</div>
                  <div className="text-muted-foreground">Violations</div>
                </div>
              </div>

              <div className="text-center">
                <Badge variant={passed ? "default" : "destructive"} className="text-lg px-4 py-2">
                  {passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>

              {latestAttempt.violations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Security Violations</h3>
                  <div className="space-y-1">
                    {latestAttempt.violations.map((violation, index) => (
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {violation}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={() => setCurrentView("home")}>Back to Home</Button>
                {examData && examAttempts.length < examData.config.maxAttempts && (
                  <Button variant="outline" onClick={() => setCurrentView("exam")}>
                    Retake Exam
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "admin") {
    return <AdminPanel />
  }

  if (currentView === "exam" && examData) {
    return <CBTSystem examData={examData} studentId={studentId} onExamComplete={handleExamComplete} />
  }

  if (currentView === "results") {
    return renderResults()
  }

  if (currentView === "result-checker") {
    return <ResultChecker />
  }

  if (currentView === "dashboard") {
    return (
      <ExamDashboard
        onExamSelect={(examData) => {
          setExamData(examData)
          setCurrentView("exam")
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Advanced CBT System</h1>
          <p className="text-xl text-muted-foreground">Secure Computer-Based Testing with Advanced Features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("admin")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create and manage exam questions, configure security settings, and export exam files.
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Question Builder</Badge>
                <Badge variant="outline">Security Config</Badge>
                <Badge variant="outline">JSON Export</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Take Exam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload an exam file and start taking the test with full security monitoring.
              </p>
              <input type="file" accept=".json" onChange={handleExamUpload} className="hidden" id="exam-upload" />
              <Button onClick={() => document.getElementById("exam-upload")?.click()} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Exam File
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView("result-checker")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Result Checker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload exam questions and student answers to generate comprehensive reports and check violations.
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Answer Analysis</Badge>
                <Badge variant="outline">Violation Reports</Badge>
                <Badge variant="outline">Downloadable Reports</Badge>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView("dashboard")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Student Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View scheduled exams, check availability, and access time-based exam sessions.
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Exam Scheduling</Badge>
                <Badge variant="outline">Time Windows</Badge>
                <Badge variant="outline">Availability Status</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Current session information and exam history.</p>
              <div className="space-y-2 text-sm">
                <div>Student ID: {studentId}</div>
                <div>Attempts: {examAttempts.length}</div>
                <div>Status: Ready</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Security Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tab switching detection</li>
                  <li>• Full-screen mode enforcement</li>
                  <li>• Copy/paste prevention</li>
                  <li>• Right-click protection</li>
                  <li>• Screenshot prevention</li>
                  <li>• Violation tracking</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Question Types</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multiple choice</li>
                  <li>• True/False</li>
                  <li>• Fill in the blank</li>
                  <li>• Essay questions</li>
                  <li>• Matching questions</li>
                  <li>• Image-based questions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Advanced Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Built-in calculator</li>
                  <li>• Flexible timer system</li>
                  <li>• Auto-save functionality</li>
                  <li>• Question randomization</li>
                  <li>• Mobile responsive design</li>
                  <li>• Real-time monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {examAttempts.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Exam Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {examAttempts
                  .slice(-5)
                  .reverse()
                  .map((attempt, index) => (
                    <div key={attempt.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{attempt.examId}</div>
                        <div className="text-sm text-muted-foreground">
                          {attempt.startTime.toLocaleDateString()} at {attempt.startTime.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={attempt.status === "completed" ? "default" : "secondary"}>
                          {attempt.status}
                        </Badge>
                        {attempt.score !== undefined && <div className="text-lg font-semibold">{attempt.score}%</div>}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
