"use client"

import { ResultChecker } from "@/components/result-checker"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ExaminerResultsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <ResultChecker />
      </main>
      <SiteFooter />
    </div>
  )
}
