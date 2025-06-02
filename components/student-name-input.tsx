"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail } from "lucide-react"
import type { StudentInfo } from "@/types/cbt"

interface StudentNameInputProps {
  onSubmit: (studentInfo: StudentInfo) => void
  examTitle: string
}

export function StudentNameInput({ onSubmit, examTitle }: StudentNameInputProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    const studentInfo: StudentInfo = {
      name: name.trim(),
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: email.trim() || undefined,
    }

    // Simulate a brief loading state
    setTimeout(() => {
      onSubmit(studentInfo)
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Student Information</CardTitle>
          <p className="text-muted-foreground">Please enter your details before starting the exam</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900">{examTitle}</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="studentName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email (Optional)
              </Label>
              <Input
                id="studentEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Processing..." : "Continue to Exam"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
