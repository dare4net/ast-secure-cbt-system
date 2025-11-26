"use client"

import { ExamDashboard } from "@/components/exam-dashboard"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { ExamData } from "@/types/cbt"
import { useRouter } from "next/navigation"

export default function StudentExamsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader />
      <main className="flex-1 overflow-y-auto">
        <ExamDashboard
          onExamSelect={(examData: ExamData) => {
            sessionStorage.setItem("selectedExamData", JSON.stringify(examData))
            router.push("/students/exam")
          }}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
