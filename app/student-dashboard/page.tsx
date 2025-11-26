"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Award, BarChart3, FileText, AlertCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import Link from "next/link"

export default function StudentDashboard() {
  const { user } = useAuth()

  const upcomingExams = [
    { id: 1, title: "Mathematics Final Exam", date: "2025-10-15", duration: "2 hours", status: "upcoming" },
    { id: 2, title: "Physics Midterm", date: "2025-10-20", duration: "1.5 hours", status: "upcoming" },
  ]

  const recentResults = [
    { id: 1, title: "Chemistry Quiz", score: 85, maxScore: 100, date: "2025-09-28" },
    { id: 2, title: "English Essay", score: 92, maxScore: 100, date: "2025-09-25" },
  ]

  return (
    <AuthLayout requireAuth allowedRoles={["student"]}>
      <div className="min-h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard">Browse Exams</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground">Next: Oct 15</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-green-600">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Awaiting results</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Exams */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Upcoming Exams
            </CardTitle>
            <CardDescription>Your scheduled exams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{exam.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {exam.date} • {exam.duration}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  View Details
                </Button>
              </div>
            ))}
            {upcomingExams.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No upcoming exams</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest exam scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentResults.map((result) => (
              <div key={result.id} className="rounded-xl border border-border/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{result.title}</p>
                  <span className="text-lg font-semibold text-primary">
                    {result.score}/{result.maxScore}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{result.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard">Browse All Exams</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/result-checker">View All Results</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard">Download Certificate</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
    </AuthLayout>
  )
}
