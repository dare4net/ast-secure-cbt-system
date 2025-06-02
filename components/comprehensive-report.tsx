"use client"
import { useRef } from "react"
import type { ExamReport } from "@/types/cbt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, CheckCircle, XCircle, AlertTriangle, User, FileText } from "lucide-react"

interface ComprehensiveReportProps {
  report: ExamReport
}

export function ComprehensiveReport({ report }: ComprehensiveReportProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  // Helper function to safely convert any date format to a Date object
  const toDate = (date: Date | string): Date => {
    if (date instanceof Date) return date
    return new Date(date)
  }

  const downloadReport = () => {
    // Create a detailed JSON report
    const reportData = {
      studentInfo: report.studentInfo,
      examConfig: report.examConfig,
      attempt: {
        ...report.attempt,
        startTime:
          typeof report.attempt.startTime === "string"
            ? report.attempt.startTime
            : report.attempt.startTime.toISOString(),
        endTime: report.attempt.endTime
          ? typeof report.attempt.endTime === "string"
            ? report.attempt.endTime
            : report.attempt.endTime.toISOString()
          : undefined,
      },
      detailedAnswers: report.detailedAnswers,
      summary: report.summary,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `${report.studentInfo.name.replace(/\s+/g, "_")}_comprehensive_report_${new Date().toISOString().split("T")[0]}.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadPrintableReport = () => {
    // Create a printable HTML version
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Exam Report - ${report.studentInfo.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .success { background-color: #d4edda; color: #155724; }
            .danger { background-color: #f8d7da; color: #721c24; }
            .warning { background-color: #fff3cd; color: #856404; }
            .question { margin-bottom: 15px; padding: 10px; border-left: 4px solid #007bff; }
            .correct { border-left-color: #28a745; }
            .incorrect { border-left-color: #dc3545; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Exam Report</h1>
            <h2>${report.examConfig.title}</h2>
            <p>Student: ${report.studentInfo.name}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Summary</h3>
            <div class="grid">
              <div class="card">
                <h4>Score: ${report.summary.percentage}%</h4>
                <p>Status: <span class="badge ${report.summary.passed ? "success" : "danger"}">${report.summary.passed ? "PASSED" : "FAILED"}</span></p>
                <p>Correct Answers: ${report.summary.correctAnswers}/${report.summary.totalQuestions}</p>
                <p>Time Spent: ${Math.floor(report.summary.timeSpent / 60)} minutes</p>
              </div>
              <div class="card">
                <h4>Security</h4>
                <p>Tab Switches: ${report.summary.tabSwitchCount}</p>
                <p>Violations: ${report.summary.violations.length}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Detailed Answers</h3>
            ${report.detailedAnswers
              .map(
                (answer, index) => `
              <div class="question ${answer.isCorrect ? "correct" : "incorrect"}">
                <h4>Question ${index + 1} (${answer.points} points)</h4>
                <p><strong>Question:</strong> ${answer.question}</p>
                <p><strong>Student Answer:</strong> ${Array.isArray(answer.studentAnswer) ? answer.studentAnswer.join(", ") : answer.studentAnswer}</p>
                <p><strong>Correct Answer:</strong> ${Array.isArray(answer.correctAnswer) ? answer.correctAnswer.join(", ") : answer.correctAnswer}</p>
                <p><strong>Result:</strong> <span class="badge ${answer.isCorrect ? "success" : "danger"}">${answer.isCorrect ? "Correct" : "Incorrect"}</span></p>
                <p><strong>Points Earned:</strong> ${answer.earnedPoints}/${answer.points}</p>
              </div>
            `,
              )
              .join("")}
          </div>

          ${
            report.summary.violations.length > 0
              ? `
            <div class="section">
              <h3>Security Violations</h3>
              ${report.summary.violations
                .map(
                  (violation) => `
                <div class="card">
                  <p class="badge warning">${violation}</p>
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Comprehensive Exam Report</h1>
        <div className="flex gap-2">
          <Button onClick={downloadPrintableReport} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Print Report
          </Button>
          <Button onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Name:</strong> {report.studentInfo.name}
                </p>
                <p>
                  <strong>ID:</strong> {report.studentInfo.id}
                </p>
                {report.studentInfo.email && (
                  <p>
                    <strong>Email:</strong> {report.studentInfo.email}
                  </p>
                )}
              </div>
              <div>
                <p>
                  <strong>Exam:</strong> {report.examConfig.title}
                </p>
                <p>
                  <strong>Date:</strong> {toDate(report.attempt.startTime).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {toDate(report.attempt.startTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-blue-600">{report.summary.percentage}%</div>
                <div className="text-muted-foreground">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-green-600">{report.summary.correctAnswers}</div>
                <div className="text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-orange-600">
                  {Math.floor(report.summary.timeSpent / 60)}
                </div>
                <div className="text-muted-foreground">Minutes Taken</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-red-600">{report.summary.tabSwitchCount}</div>
                <div className="text-muted-foreground">Tab Switches</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Progress</span>
                  <span>
                    {report.summary.correctAnswers}/{report.summary.totalQuestions}
                  </span>
                </div>
                <Progress value={(report.summary.correctAnswers / report.summary.totalQuestions) * 100} />
              </div>

              <div className="text-center">
                <Badge variant={report.summary.passed ? "default" : "destructive"} className="text-lg px-6 py-2">
                  {report.summary.passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Answers */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Answer Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.detailedAnswers.map((answer, index) => (
                <div key={answer.questionId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">Question {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                        {answer.earnedPoints}/{answer.points} pts
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Question:</strong> {answer.question}
                    </div>
                    <div>
                      <strong>Your Answer:</strong>
                      <span className={answer.isCorrect ? "text-green-600" : "text-red-600"}>
                        {Array.isArray(answer.studentAnswer)
                          ? answer.studentAnswer.join(", ")
                          : answer.studentAnswer || "No answer provided"}
                      </span>
                    </div>
                    <div>
                      <strong>Correct Answer:</strong>
                      <span className="text-green-600">
                        {Array.isArray(answer.correctAnswer) ? answer.correctAnswer.join(", ") : answer.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Violations */}
        {report.summary.violations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Security Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report.summary.violations.map((violation, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">{violation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exam Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Time Limit:</strong> {report.examConfig.timeLimit} minutes
                </p>
                <p>
                  <strong>Total Questions:</strong> {report.examConfig.totalQuestions}
                </p>
                <p>
                  <strong>Passing Score:</strong> {report.examConfig.passingScore}%
                </p>
                <p>
                  <strong>Max Attempts:</strong> {report.examConfig.maxAttempts}
                </p>
              </div>
              <div>
                <p>
                  <strong>Calculator Allowed:</strong> {report.examConfig.allowCalculator ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Back Navigation:</strong> {report.examConfig.allowBackNavigation ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Tab Detection:</strong> {report.examConfig.enableTabSwitchDetection ? "Enabled" : "Disabled"}
                </p>
                <p>
                  <strong>Full Screen:</strong> {report.examConfig.enableFullScreenMode ? "Required" : "Optional"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
