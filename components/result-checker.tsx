"use client"

import type React from "react"

import { useState } from "react"
import type { ExamData, StudentAnswerData, ExamReport, Question } from "@/types/cbt"
import { ComprehensiveReport } from "./comprehensive-report"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react"

export function ResultChecker() {
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [studentData, setStudentData] = useState<StudentAnswerData | null>(null)
  const [report, setReport] = useState<ExamReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExamUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data: ExamData = JSON.parse(e.target?.result as string)
        setExamData(data)
        setError(null)

        // If we already have student data, generate report
        if (studentData) {
          generateReport(data, studentData)
        }
      } catch (error) {
        setError("Invalid exam file format")
      }
    }
    reader.readAsText(file)
  }

  const handleStudentAnswerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data: StudentAnswerData = JSON.parse(e.target?.result as string)
        setStudentData(data)
        setError(null)

        // If we already have exam data, generate report
        if (examData) {
          generateReport(examData, data)
        }
      } catch (error) {
        setError("Invalid student answer file format")
      }
    }
    reader.readAsText(file)
  }

  const generateReport = (exam: ExamData, student: StudentAnswerData) => {
    try {
      const detailedAnswers = exam.questions.map((question) => {
        const studentAnswer = student.attempt.answers[question.id] || ""
        const isCorrect = checkAnswer(question, studentAnswer)

        return {
          questionId: question.id,
          question: question.question,
          studentAnswer,
          correctAnswer: question.correctAnswer || "",
          isCorrect,
          points: question.points,
          earnedPoints: isCorrect ? question.points : 0,
        }
      })

      const summary = {
        totalQuestions: exam.questions.length,
        answeredQuestions: Object.keys(student.attempt.answers).length,
        correctAnswers: detailedAnswers.filter((a) => a.isCorrect).length,
        totalPoints: exam.questions.reduce((sum, q) => sum + q.points, 0),
        earnedPoints: detailedAnswers.reduce((sum, a) => sum + a.earnedPoints, 0),
        percentage: 0,
        passed: false,
        timeSpent: student.attempt.endTime
          ? Math.floor(
              (new Date(student.attempt.endTime).getTime() - new Date(student.attempt.startTime).getTime()) / 1000,
            )
          : 0,
        violations: student.attempt.violations,
        tabSwitchCount: student.attempt.tabSwitchCount,
      }

      summary.percentage = Math.round((summary.earnedPoints / summary.totalPoints) * 100)
      summary.passed = summary.percentage >= exam.config.passingScore

      const examReport: ExamReport = {
        studentInfo: student.studentInfo,
        examConfig: exam.config,
        attempt: student.attempt,
        questions: exam.questions,
        detailedAnswers,
        summary,
      }

      setReport(examReport)
    } catch (error) {
      setError("Error generating report. Please check your files.")
    }
  }

  const checkAnswer = (question: Question, studentAnswer: string | string[]): boolean => {
    if (!question.correctAnswer || !studentAnswer) return false

    if (Array.isArray(question.correctAnswer)) {
      // For matching questions
      if (!Array.isArray(studentAnswer)) return false
      return (
        question.correctAnswer.length === studentAnswer.length &&
        question.correctAnswer.every((ans) => studentAnswer.includes(ans))
      )
    } else {
      // For single answer questions
      const correct = question.correctAnswer.toString().toLowerCase().trim()
      const student = studentAnswer.toString().toLowerCase().trim()
      return correct === student
    }
  }

  if (report) {
    return (
      <div className="min-h-full bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setReport(null)
                setExamData(null)
                setStudentData(null)
              }}
            >
              ← Back to Upload
            </Button>
          </div>
          <ComprehensiveReport report={report} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Result Checker</h1>
          <p className="text-lg text-muted-foreground">
            Upload exam questions and student answers to generate comprehensive reports
          </p>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Exam File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Exam Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload the original exam JSON file containing questions and configuration.
              </p>

              <div className="space-y-2">
                <Label htmlFor="exam-file">Exam File (.json)</Label>
                <Input id="exam-file" type="file" accept=".json" onChange={handleExamUpload} />
              </div>

              {examData && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Exam loaded: {examData.config.title}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Answer Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Student Answers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload the student's answer file generated after exam submission.
              </p>

              <div className="space-y-2">
                <Label htmlFor="answer-file">Answer File (.json)</Label>
                <Input id="answer-file" type="file" accept=".json" onChange={handleStudentAnswerUpload} />
              </div>

              {studentData && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Answers loaded: {studentData.studentInfo.name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {examData && studentData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Ready to Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Exam:</strong> {examData.config.title}
                </div>
                <div>
                  <strong>Student:</strong> {studentData.studentInfo.name}
                </div>
                <div>
                  <strong>Questions:</strong> {examData.questions.length}
                </div>
                <div>
                  <strong>Submitted:</strong> {new Date(studentData.submissionTime).toLocaleString()}
                </div>
              </div>

              <Button onClick={() => generateReport(examData, studentData)} className="w-full mt-4" size="lg">
                Generate Comprehensive Report
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                1
              </div>
              <p>Upload the original exam JSON file (created in the admin panel)</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                2
              </div>
              <p>Upload the student's answer JSON file (generated after exam submission)</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                3
              </div>
              <p>Click "Generate Report" to create a comprehensive analysis</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                4
              </div>
              <p>Download the report as an image for record keeping</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
