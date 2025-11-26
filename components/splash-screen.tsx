"use client"

import { useEffect, useState } from "react"
import { Shield, CheckCircle, Lock, MonitorCheck, Mail, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export function SplashScreen({ onComplete, duration = 5000 }: SplashScreenProps) {
  const { isAuthenticated, user, login, loginWithGoogle, loginWithGithub, loginAsMockUser, signup } = useAuth()
  const [progress, setProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const stages = [
    { icon: Shield, text: "Initializing security protocols" },
    { icon: Lock, text: "Verifying exam integrity" },
    { icon: MonitorCheck, text: "Preparing exam environment" },
    { icon: CheckCircle, text: "Ready to begin" },
  ]

  useEffect(() => {
    const stageInterval = duration / stages.length
    const progressInterval = 50

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + (100 / (duration / progressInterval))
      })
    }, progressInterval)

    const stageTimer = setInterval(() => {
      setLoadingStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(stageTimer)
          return prev
        }
        return prev + 1
      })
    }, stageInterval)

    return () => {
      clearInterval(progressTimer)
      clearInterval(stageTimer)
    }
  }, [duration, stages.length])

  const CurrentIcon = stages[loadingStage]?.icon || Shield
  const isComplete = progress >= 100

  const handleContinue = () => {
    setIsExiting(true)
    setTimeout(() => {
      onComplete()
    }, 500)
  }

  const handleShowAuth = () => {
    setShowAuth(true)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthLoading(true)
    try {
      if (authMode === "login") {
        await login(email, password)
      } else {
        await signup(name, email, password, "student")
      }
      // After successful auth, proceed
      handleContinue()
    } catch (error) {
      console.error("Auth failed:", error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsAuthLoading(true)
    try {
      if (provider === "google") {
        await loginWithGoogle()
      } else {
        await loginWithGithub()
      }
      // After successful auth, proceed
      handleContinue()
    } catch (error) {
      console.error("Social login failed:", error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleMockLogin = async (role: "student" | "examiner" | "organization") => {
    setIsAuthLoading(true)
    try {
      await loginAsMockUser(role)
      // After successful auth, proceed
      handleContinue()
    } catch (error) {
      console.error("Mock login failed:", error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 transition-opacity duration-500",
        isExiting && "opacity-0"
      )}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 15 + 20}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-6 text-center">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 shadow-2xl">
            <CurrentIcon className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            AST Secure CBT
          </h1>
          <p className="text-sm text-muted-foreground">Computer Based Testing System</p>
        </div>

        {/* Loading stage text */}
        {!isComplete && (
          <div className="h-6 min-w-[300px]">
            <p className="text-sm font-medium text-primary-foreground animate-pulse">
              {stages[loadingStage]?.text}
            </p>
          </div>
        )}

        {/* Progress bar */}
        {!isComplete && (
          <div className="w-full max-w-md space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50 backdrop-blur-sm">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>
        )}

        {/* Auth or Continue Section */}
        {isComplete && (
          <div className="w-full max-w-md">
            {/* If authenticated - show continue button */}
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Welcome back!</p>
                  <p className="text-lg font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role} Account
                  </p>
                </div>
                <button
                  onClick={handleContinue}
                  className="w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Continue to Dashboard
                </button>
              </div>
            ) : (
              /* If not authenticated - show auth options */
              <div className="space-y-4">
                {!showAuth ? (
                  /* Initial auth prompt */
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-foreground text-center">
                      Welcome! Please sign in to continue
                    </p>
                    
                    {/* Quick Login - Mock Accounts */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground text-center mb-2">Quick Login (Demo Accounts)</p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleMockLogin("student")}
                          disabled={isAuthLoading}
                          className="flex flex-col items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-3 text-xs font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-300 disabled:opacity-50"
                        >
                          <Shield className="h-5 w-5" />
                          Student
                        </button>
                        <button
                          onClick={() => handleMockLogin("examiner")}
                          disabled={isAuthLoading}
                          className="flex flex-col items-center gap-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 px-3 py-3 text-xs font-medium text-purple-900 dark:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all duration-300 disabled:opacity-50"
                        >
                          <CheckCircle className="h-5 w-5" />
                          Examiner
                        </button>
                        <button
                          onClick={() => handleMockLogin("organization")}
                          disabled={isAuthLoading}
                          className="flex flex-col items-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-3 py-3 text-xs font-medium text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-300 disabled:opacity-50"
                        >
                          <MonitorCheck className="h-5 w-5" />
                          Organization
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => handleSocialLogin("google")}
                        disabled={isAuthLoading}
                        className="w-full flex items-center justify-center gap-3 rounded-full bg-white border border-border px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </button>
                      <button
                        onClick={() => handleSocialLogin("github")}
                        disabled={isAuthLoading}
                        className="w-full flex items-center justify-center gap-3 rounded-full bg-foreground border border-border px-6 py-3 text-sm font-medium text-background shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50"
                      >
                        <Github className="h-5 w-5" />
                        Continue with GitHub
                      </button>
                      <button
                        onClick={handleShowAuth}
                        className="w-full flex items-center justify-center gap-3 rounded-full bg-card border border-border px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                      >
                        <Mail className="h-5 w-5" />
                        Continue with Email
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Email auth form */
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="text-center mb-4">
                      <button
                        type="button"
                        onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                        className="text-sm text-primary hover:underline"
                      >
                        {authMode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
                      </button>
                    </div>
                    
                    {authMode === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="rounded-xl"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAuth(false)}
                        className="flex-1 rounded-full bg-muted px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/80 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isAuthLoading}
                        className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                      >
                        {isAuthLoading ? "Loading..." : authMode === "login" ? "Log In" : "Sign Up"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stage indicators */}
        <div className="flex items-center gap-2">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                index <= loadingStage
                  ? "bg-primary scale-110"
                  : "bg-muted/50 scale-100"
              )}
            />
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <span>Secure & Encrypted</span>
      </div>
    </div>
  )
}
