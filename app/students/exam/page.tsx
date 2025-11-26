"use client"

import { useEffect, useState } from "react"
import { CBTSystem } from "@/components/cbt-system"
import type { ExamAttempt, ExamData, StudentAnswerData } from "@/types/cbt"
import { useRouter } from "next/navigation"

export default function StudentExamPage() {
  const router = useRouter()
  const [examData, setExamData] = useState<ExamData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem("selectedExamData")
    if (raw) {
      try {
        setExamData(JSON.parse(raw))
      } catch {
        router.replace("/students/exams")
      }
    } else {
      router.replace("/students/exams")
    }
  }, [router])

  const handleComplete = (attempt: ExamAttempt, _studentAnswerData: StudentAnswerData) => {
    sessionStorage.removeItem("selectedExamData")
    router.push("/students/results")
  }

  if (!examData) return null

  return <CBTSystem examData={examData} onExamComplete={handleComplete} />
}
