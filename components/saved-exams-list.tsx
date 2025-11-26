"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ExamData } from "@/types/cbt"
import { loadAvailableExams } from "@/lib/exam-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Copy, Eye, Trash2 } from "lucide-react"

interface SavedExamsListProps {
  onExamLoad?: (exam: ExamData) => void
  onExamDelete?: (exam: ExamData) => void
  showEditButton?: boolean
  showCloneButton?: boolean
  showViewButton?: boolean
  showDeleteButton?: boolean
  maxHeight?: string
}

export function SavedExamsList({
  onExamLoad,
  onExamDelete,
  showEditButton = true,
  showCloneButton = true,
  showViewButton = false,
  showDeleteButton = false,
  maxHeight = "calc(100vh-250px)",
}: SavedExamsListProps) {
  const router = useRouter()
  const [savedExams, setSavedExams] = useState<ExamData[]>([])

  useEffect(() => {
    const exams = loadAvailableExams()
    setSavedExams(exams)
  }, [])

  const handleEdit = (exam: ExamData) => {
    const examId = exam.config.title.toLowerCase().replace(/\s+/g, "-")
    router.push(`/exam/${examId}`)
  }

  const handleClone = (exam: ExamData) => {
    if (onExamLoad) {
      onExamLoad(exam)
    }
  }

  const handleView = (exam: ExamData) => {
    // Navigate to preview or detail view
    const examId = exam.config.title.toLowerCase().replace(/\s+/g, "-")
    router.push(`/exam/${examId}`)
  }

  const handleDelete = (exam: ExamData) => {
    if (onExamDelete) {
      onExamDelete(exam)
    }
  }

  return (
    <div className="space-y-4" style={{ maxHeight, overflowY: "auto" }}>
      {savedExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedExams.map((exam, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{exam.config.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exam.config.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Duration:</span> {exam.config.timeLimit} min
                  </div>
                  <div>
                    <span className="font-medium">Questions:</span> {exam.questions.length}
                  </div>
                  <div>
                    <span className="font-medium">Passing:</span> {exam.config.passingScore}%
                  </div>
                  <div>
                    <span className="font-medium">Attempts:</span> {exam.config.maxAttempts}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exam.config.enableTabSwitchDetection && (
                    <Badge variant="secondary" className="text-xs">
                      Tab Detection
                    </Badge>
                  )}
                  {exam.config.allowCalculator && (
                    <Badge variant="secondary" className="text-xs">
                      Calculator
                    </Badge>
                  )}
                  {exam.config.enableFullScreenMode && (
                    <Badge variant="secondary" className="text-xs">
                      Full Screen
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  {showEditButton && (
                    <Button
                      onClick={() => handleEdit(exam)}
                      className="flex-1"
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {showCloneButton && (
                    <Button
                      onClick={() => handleClone(exam)}
                      className="flex-1"
                      variant="secondary"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Clone
                    </Button>
                  )}
                  {showViewButton && (
                    <Button
                      onClick={() => handleView(exam)}
                      className="flex-1"
                      variant="default"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                  {showDeleteButton && (
                    <Button
                      onClick={() => handleDelete(exam)}
                      className="flex-1"
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          No saved exams available. Create or import exams to get started.
        </div>
      )}
    </div>
  )
}
