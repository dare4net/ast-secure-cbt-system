"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SplashScreen } from "@/components/splash-screen"

export default function AuthPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
      if (user.role === "student") {
        router.push("/students/dashboard")
      } else if (user.role === "examiner") {
        router.push("/examiner/dashboard")
      } else if (user.role === "organization") {
        router.push("/organization/dashboard")
      }
    }
  }, [isAuthenticated, user, router])

  const handleComplete = () => {
    // After authentication, route to appropriate dashboard
    if (user?.role === "student") {
      router.push("/students/dashboard")
    } else if (user?.role === "examiner") {
      router.push("/examiner/dashboard")
    } else if (user?.role === "organization") {
      router.push("/organization/dashboard")
    } else {
      router.push("/")
    }
  }

  return <SplashScreen onComplete={handleComplete} duration={5000} />
}
