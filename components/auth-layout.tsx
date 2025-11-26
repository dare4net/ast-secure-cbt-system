"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SiteHeader } from "./site-header"
import { SiteFooter } from "./site-footer"

interface AuthLayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: Array<"student" | "examiner" | "organization">
}

export function AuthLayout({ children, requireAuth = true, allowedRoles }: AuthLayoutProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      // Redirect to auth page if not authenticated
      router.push("/auth")
    } else if (requireAuth && allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect if user doesn't have the required role
      router.push("/")
    }
  }, [isAuthenticated, user, requireAuth, allowedRoles, router])

  if (requireAuth && !isAuthenticated) {
    return null // Show nothing while redirecting
  }

  return (
    <>
      <SiteHeader />
      <main className="h-[calc(100vh-64px-48px)] overflow-auto relative">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
