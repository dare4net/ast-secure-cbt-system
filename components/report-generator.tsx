"use client"

import type React from "react"
import { useRef } from "react"
import type { Report } from "@/types"
// import { htmlToCanvas } from "@/utils/html-to-canvas"

interface ReportGeneratorProps {
  report: Report
  onDownload?: () => void
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ report, onDownload }) => {
  const reportRef = useRef<HTMLDivElement>(null)

  const downloadReport = async () => {
    if (!reportRef.current) return

    try {
      // Create a comprehensive text report
      const reportData = {
        studentInfo: report.studentInfo,
        examResults: report.examResults,
        overallScore: report.overallScore,
        timestamp: new Date().toISOString(),
        summary: {
          totalQuestions: report.examResults.length,
          correctAnswers: report.examResults.filter((r) => r.isCorrect).length,
          incorrectAnswers: report.examResults.filter((r) => !r.isCorrect).length,
          percentage: report.overallScore,
        },
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `${report.studentInfo.name.replace(/\s+/g, "_")}_exam_report_${new Date().toISOString().split("T")[0]}.json`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)

      onDownload?.()
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Failed to generate report. Please try again.")
    }
  }

  return (
    <div>
      <div ref={reportRef}>
        <h1>Exam Report</h1>
        <h2>Student Information</h2>
        <p>Name: {report.studentInfo.name}</p>
        <p>ID: {report.studentInfo.id}</p>

        <h2>Exam Results</h2>
        <ul>
          {report.examResults.map((result, index) => (
            <li key={index}>
              Question {result.questionNumber}: {result.isCorrect ? "Correct" : "Incorrect"}
            </li>
          ))}
        </ul>

        <h2>Overall Score</h2>
        <p>Score: {report.overallScore}%</p>
      </div>

      <button onClick={downloadReport}>Download Report (JSON)</button>
    </div>
  )
}

export default ReportGenerator
