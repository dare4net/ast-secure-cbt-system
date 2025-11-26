"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, FileText, CheckCircle, Calendar, Shield, Clock, MonitorCheck, BarChart3, Sparkles } from "lucide-react"
import { AmbientParticles } from "@/components/ambient-particles"
import { AuthLayout } from "@/components/auth-layout"
import Link from "next/link"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (!isAuthenticated) {
      router.push("/auth")
    } else if (user) {
      // Redirect to appropriate dashboard if authenticated
      if (user.role === "student") {
        router.push("/students/dashboard")
      } else if (user.role === "examiner") {
        router.push("/examiner/dashboard")
      } else if (user.role === "organization") {
        router.push("/organization/dashboard")
      }
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) {
    return null // Show nothing while redirecting
  }

  return (
    <AuthLayout requireAuth={false}>
      <div className="h-full">
      {/* Single-screen hero, no scroll */}
      <section className="relative h-full">
        <AmbientParticles count={20} />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 py-8">
          <div className="grid w-full items-center gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                <Shield className="h-3.5 w-3.5" /> Secure-by-default
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl leading-tight">
                  Computer Based Testing
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Proctored exams with full-screen enforcement, randomized questions, and instant analytics.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <Link href="/students/exams">Start Exam</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/examiner/create-exam">Admin Panel</Link>
                </Button>
              </div>
              <div className="grid max-w-md grid-cols-3 gap-4 pt-4">
                <div className="rounded-2xl bg-card/50 backdrop-blur-sm p-4 text-center border border-border/50">
                  <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-primary-foreground">
                    <Clock className="h-5 w-5 text-primary" />99.9%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Uptime</div>
                </div>
                <div className="rounded-2xl bg-card/50 backdrop-blur-sm p-4 text-center border border-border/50">
                  <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-primary-foreground">
                    <MonitorCheck className="h-5 w-5 text-primary" />50k+
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Exams</div>
                </div>
                <div className="rounded-2xl bg-card/50 backdrop-blur-sm p-4 text-center border border-border/50">
                  <div className="flex items-center justify-center gap-1 text-xl font-semibold text-primary-foreground">
                    <BarChart3 className="h-5 w-5 text-primary" />AES
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Encrypted</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-card/80 backdrop-blur-md p-6 shadow-xl border border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base font-medium">Admin Panel</CardTitle>
                      <Settings className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">Create and schedule exams</p>
                      <Button asChild className="w-full rounded-full" size="sm">
                        <Link href="/examiner/create-exam">Open</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base font-medium">Dashboard</CardTitle>
                      <Calendar className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">Manage your sessions</p>
                      <Button asChild className="w-full rounded-full" size="sm">
                        <Link href="/students/exams">Open</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base font-medium">Take Exam</CardTitle>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">Start proctored test</p>
                      <Button asChild className="w-full rounded-full" size="sm">
                        <Link href="/students/exams">Start</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base font-medium">Results</CardTitle>
                      <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">View your reports</p>
                      <Button asChild variant="outline" className="w-full rounded-full" size="sm">
                        <Link href="/students/results">Check</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </AuthLayout>
  )
}
