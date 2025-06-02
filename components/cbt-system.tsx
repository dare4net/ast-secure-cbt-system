"use client"

import { useState, useEffect, useCallback } from "react"
import type { ExamData, ExamAttempt, Question } from "@/types/cbt"
import { useSecurity } from "@/hooks/use-security"
import { useTimer } from "@/hooks/use-timer"
import { QuestionRenderer } from "./question-renderer"
import { Calculator } from "./calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CalculatorIcon, Clock, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight, Save } from "lucide-react"
import { StudentNameInput } from "./student-name-input"
import type { StudentInfo, StudentAnswerData } from "@/types/cbt"
import { useExamSchedule } from "@/hooks/use-exam-schedule"
import { ExamAvailability } from "./exam-availability"

interface CBTSystemProps {
  examData: ExamData
  onExamComplete: (attempt: ExamAttempt, studentAnswerData: StudentAnswerData) => void
}

export function CBTSystem({ examData, onExamComplete }: CBTSystemProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [examStarted, setExamStarted] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | null>(null)
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)

  // Randomize questions if enabled
  const [questions, setQuestions] = useState<Question[]>([])

  const { availability } = useExamSchedule(examData.config.schedule)
  console.log("cbt system");

  useEffect(() => {
    let processedQuestions = [...examData.questions]

    if (examData.config.randomizeQuestions) {
      processedQuestions = processedQuestions.sort(() => Math.random() - 0.5)
    }

    if (examData.config.randomizeOptions) {
      processedQuestions = processedQuestions.map((q) => ({
        ...q,
        options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : q.options,
      }))
    }

    setQuestions(processedQuestions.slice(0, examData.config.totalQuestions))
  }, [examData])

  useEffect(() => {
    console.log("we are in use effect");
    console.log(availability);
    //console.log(examAttempt);
  }, [availability ,questions, currentQuestionIndex, answers, examStarted, showCalculator, warnings, examAttempt, studentInfo])

  const handleViolation = useCallback(
    (violation: string) => {
      setWarnings((prev) => [...prev, violation])
      if (examAttempt) {
        setExamAttempt((prev) =>
          prev
            ? {
                ...prev,
                violations: [...prev.violations, violation],
                tabSwitchCount: violation.includes("Tab switched") ? prev.tabSwitchCount + 1 : prev.tabSwitchCount,
              }
            : null,
        )
      }
    },
    [examAttempt],
  )

  const security = useSecurity({
    enableTabSwitchDetection: examData.config.enableTabSwitchDetection,
    enableFullScreenMode: examData.config.enableFullScreenMode,
    enableCopyPasteProtection: examData.config.enableCopyPasteProtection,
    enableRightClickProtection: examData.config.enableRightClickProtection,
    onViolation: handleViolation,
  })

  const handleTimeUp = useCallback(() => {
    if (examData.config.autoSubmitOnTimeExpiry) {
      // Use a function reference to avoid dependency issues
      completeExam()
    }
  }, [examData.config.autoSubmitOnTimeExpiry])

  const handleTimeWarning = useCallback(
    (timeLeft: number) => {
      if (examData.config.showTimeWarnings) {
        const minutes = Math.floor(timeLeft / 60)
        setWarnings((prev) => [...prev, `${minutes} minute${minutes !== 1 ? "s" : ""} remaining!`])
      }
    },
    [examData.config.showTimeWarnings],
  )

  const handleAutoSave = useCallback(() => {
    // Auto-save logic here
    console.log("Auto-saving answers...", answers)
  }, [answers])

  const timer = useTimer({
    totalTime: examData.config.timeLimit * 60,
    warningIntervals: examData.config.timeWarningIntervals.map((m) => m * 60),
    onTimeUp: handleTimeUp,
    onWarning: handleTimeWarning,
    autoSaveInterval: examData.config.enableAutoSave ? examData.config.autoSaveInterval : undefined,
    onAutoSave: examData.config.enableAutoSave ? handleAutoSave : undefined,
  })

  const startExam = () => {
    const attempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      examId: examData.config.title,
      studentId: studentInfo?.id || "unknown",
      startTime: new Date(),
      answers: {},
      status: "in-progress",
      tabSwitchCount: 0,
      violations: [],
    }

    setExamAttempt(attempt)
    setExamStarted(true)
    timer.start()

    // Request fullscreen after user gesture
    /*if (examData.config.enableFullScreenMode) {
      security.requestFullScreen()
    }*/
  }

  const completeExam = () => {
    if (!examAttempt || !studentInfo) return

    let finalScore = calculateScore()
    let isLateSubmission = false
    let penaltyApplied = 0

    // Check if this is a late submission
    if (availability.status === "late-submission" && availability.penaltyPercentage) {
      isLateSubmission = true
      penaltyApplied = availability.penaltyPercentage
      finalScore = Math.max(0, finalScore - penaltyApplied)
    }

    const completedAttempt: ExamAttempt = {
      ...examAttempt,
      endTime: new Date(),
      answers,
      status: "completed",
      score: finalScore,
      isLateSubmission,
      penaltyApplied,
    }

    // Create student answer data for serialization
    const studentAnswerData: StudentAnswerData = {
      studentInfo,
      examTitle: examData.config.title,
      examId: examData.config.title,
      attempt: completedAttempt,
      questions: questions,
      submissionTime: new Date().toISOString(),
    }

    // Download student answers as JSON
    const blob = new Blob([JSON.stringify(studentAnswerData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${studentInfo.name.replace(/\s+/g, "_")}_answers_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    timer.pause()
    onExamComplete(completedAttempt, studentAnswerData)
    console.log(completedAttempt);
  }

  const calculateScore = () => {
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]

      if (userAnswer && question.correctAnswer) {
        if (Array.isArray(question.correctAnswer)) {
          // For matching questions
          if (
            Array.isArray(userAnswer) &&
            userAnswer.length === question.correctAnswer.length &&
            userAnswer.every((ans) => question.correctAnswer!.includes(ans))
          ) {
            earnedPoints += question.points
          }
        } else {
          // For single answer questions
          if (userAnswer === question.correctAnswer) {
            earnedPoints += question.points
          }
        }
      }
    })

    return Math.round((earnedPoints / totalPoints) * 100)
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  if (!studentInfo) {
    return <StudentNameInput onSubmit={setStudentInfo} examTitle={examData.config.title} />
  }

  if (!examStarted) {
    // Check if exam is available
    if (!availability.canStart) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-2xl">
            <ExamAvailability schedule={examData.config.schedule} examTitle={examData.config.title} />
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{examData.config.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">{examData.config.description}</p>

            {/* Show availability status */}
            {examData.config.schedule && (
              <div className="mb-4">
                <ExamAvailability schedule={examData.config.schedule} examTitle={examData.config.title} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Time Limit:</span>
                  <span className="font-medium">{examData.config.timeLimit} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-medium">{examData.config.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passing Score:</span>
                  <span className="font-medium">{examData.config.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Attempts:</span>
                  <span className="font-medium">{examData.config.maxAttempts}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Calculator:</span>
                  <Badge variant={examData.config.allowCalculator ? "default" : "secondary"}>
                    {examData.config.allowCalculator ? "Allowed" : "Not Allowed"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Back Navigation:</span>
                  <Badge variant={examData.config.allowBackNavigation ? "default" : "secondary"}>
                    {examData.config.allowBackNavigation ? "Allowed" : "Not Allowed"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto Submit:</span>
                  <Badge variant={examData.config.autoSubmitOnTimeExpiry ? "destructive" : "secondary"}>
                    {examData.config.autoSubmitOnTimeExpiry ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>

            {examData.config.enableFullScreenMode && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This exam will run in fullscreen mode. Exiting fullscreen will be recorded as a violation.
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={startExam} className="w-full" size="lg">
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b shadow-sm z-40 p-4 mb-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{examData.config.title}</h1>
            <Badge variant="outline">
              {answeredQuestions}/{questions.length} Answered
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {examData.config.allowCalculator && (
              <Button variant="outline" size="sm" onClick={() => setShowCalculator(true)}>
                <CalculatorIcon className="h-4 w-4 mr-2" />
                Calculator
              </Button>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{timer.formatTime()}</span>
            </div>

            {security.tabSwitchCount > 0 && <Badge variant="destructive">{security.tabSwitchCount} violations</Badge>}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="max-w-6xl mx-auto mb-4">
          {warnings.slice(-3).map((warning, index) => (
            <Alert key={index} className="mb-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <QuestionRenderer
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ""}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </div>

        {/* Navigation Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0 || !examData.config.allowBackNavigation}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {examData.config.enableAutoSave && (
                <Button variant="outline" size="sm" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Auto-save enabled
                </Button>
              )}

              <Button onClick={() => completeExam()} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Exam
              </Button>
            </CardContent>
          </Card>

          {/* Question Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentQuestionIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToQuestion(index)}
                    className={`aspect-square p-0 ${
                      answers[questions[index].id] ? "bg-green-100 border-green-300" : ""
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calculator Modal */}
      <Calculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
    </div>
  )
}
