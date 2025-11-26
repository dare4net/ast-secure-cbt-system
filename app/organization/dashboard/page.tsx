"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, ClipboardList, TrendingUp, Settings, Shield, DollarSign, BarChart3 } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import Link from "next/link"

export default function OrganizationDashboard() {
  const { user } = useAuth()

  const examiners = [
    { id: 1, name: "Dr. Sarah Smith", email: "sarah@astcbt.com", exams: 8, students: 125, status: "active" },
    { id: 2, name: "Prof. John Davis", email: "john@astcbt.com", exams: 12, students: 200, status: "active" },
    { id: 3, name: "Dr. Emma Wilson", email: "emma@astcbt.com", exams: 5, students: 80, status: "inactive" },
  ]

  const recentActivity = [
    { id: 1, action: "New examiner added", user: "Dr. Sarah Smith", time: "2 hours ago" },
    { id: 2, action: "Exam created", user: "Prof. John Davis", time: "5 hours ago" },
    { id: 3, action: "Configuration updated", user: "Admin", time: "1 day ago" },
  ]

  return (
    <AuthLayout requireAuth allowedRoles={["organization"]}>
      <div className="min-h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Organization Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/organization/manage">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Examiner
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Examiners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examiners.length}</div>
            <p className="text-xs text-muted-foreground">{examiners.filter(e => e.status === "active").length} active</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examiners.reduce((sum, e) => sum + e.students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all examiners</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examiners.reduce((sum, e) => sum + e.exams, 0)}
            </div>
            <p className="text-xs text-green-600">+3 this month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Examiners Management */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Examiners
            </CardTitle>
            <CardDescription>Manage your examination staff</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {examiners.map((examiner) => (
              <div key={examiner.id} className="rounded-xl border border-border/50 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{examiner.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        examiner.status === "active" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}>
                        {examiner.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{examiner.email}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{examiner.exams} exams</span>
                      <span>{examiner.students} students</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="rounded-full flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full flex-1">
                    Permissions
                  </Button>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/organization/manage">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Examiner
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 rounded-xl border border-border/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Platform Analytics */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Platform Analytics
              </CardTitle>
              <CardDescription>System-wide metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exam Completion Rate</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Student Satisfaction</span>
                  <span className="font-medium">88%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">System Uptime</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "99.9%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/organization/manage">Add Examiner</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/organization/manage">Manage Students</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/organization/reports">View Reports</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/organization/settings">
              <Settings className="h-4 w-4 mr-2" />
              Configure System
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
    </AuthLayout>
  )
}
