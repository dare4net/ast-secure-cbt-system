"use client"

import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, Plus, Users, ClipboardList, Send, Download, Calendar, Settings } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ExaminerDashboard() {
  const { user } = useAuth()
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmails, setInviteEmails] = useState("")

  const myExams = [
    { id: 1, title: "Mathematics Final Exam", students: 45, status: "active", date: "2025-10-15" },
    { id: 2, title: "Physics Midterm", students: 38, status: "draft", date: "2025-10-20" },
    { id: 3, title: "Chemistry Quiz", students: 42, status: "completed", date: "2025-09-28" },
  ]

  const pendingGrading = [
    { id: 1, student: "John Doe", exam: "Mathematics Final", submitted: "2 hours ago" },
    { id: 2, student: "Jane Smith", exam: "Physics Quiz", submitted: "5 hours ago" },
  ]

  return (
    <AuthLayout requireAuth allowedRoles={["examiner"]}>
      <div className="min-h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Examiner Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <Send className="h-4 w-4 mr-2" />
                Invite Students
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Students to Exam</DialogTitle>
                <DialogDescription>
                  Enter student emails (one per line) or upload a CSV file
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-select">Select Exam</Label>
                  <select
                    id="exam-select"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>Mathematics Final Exam</option>
                    <option>Physics Midterm</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emails">Student Emails</Label>
                  <Textarea
                    id="emails"
                    placeholder="student1@example.com&#10;student2@example.com&#10;student3@example.com"
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    rows={5}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="flex-1 border-t border-border" />
                </div>
                <Button variant="outline" className="w-full rounded-full">
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload CSV File
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInviteDialog(false)} className="rounded-full">
                  Cancel
                </Button>
                <Button onClick={() => setShowInviteDialog(false)} className="rounded-full">
                  Send Invitations
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button asChild className="rounded-full">
            <Link href="/examiner/create-exam">
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myExams.length}</div>
            <p className="text-xs text-muted-foreground">2 active</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">Across all exams</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGrading.length}</div>
            <p className="text-xs text-orange-600">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* My Exams */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Available Exams
            </CardTitle>
            <CardDescription>View and manage exams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "Exam Test 1",
                "Exam Test 2",
                "Mathematics Basics"
              ].map((examTitle, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium">{examTitle}</span>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8"
                  >
                    <Link href={`/exam/${examTitle.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Settings className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/examiner/create-exam">Show More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Grading */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Pending Grading
            </CardTitle>
            <CardDescription>Submissions awaiting review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingGrading.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{item.student}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.exam} • {item.submitted}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  Grade Now
                </Button>
              </div>
            ))}
            {pendingGrading.length === 0 && (
              <p className="text-center text-muted-foreground py-8">All caught up!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/examiner/create-exam">Create New Exam</Link>
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => setShowInviteDialog(true)}>
            Invite Students
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/examiner/results">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/examiner/dashboard">View Analytics</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
    </AuthLayout>
  )
}
