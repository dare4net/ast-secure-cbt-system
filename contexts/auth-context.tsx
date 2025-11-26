"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "examiner" | "organization"
  organizationId?: string // For examiners and students
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGithub: () => Promise<void>
  loginAsMockUser: (role: "student" | "examiner" | "organization") => Promise<void>
  signup: (name: string, email: string, password: string, role: "student" | "examiner" | "organization") => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Predefined mock accounts for easy testing
const MOCK_ACCOUNTS = {
  student: {
    id: "student-001",
    name: "John Doe",
    email: "student@astcbt.com",
    avatar: "/placeholder-user.jpg",
    role: "student" as const,
    organizationId: "org-001",
    permissions: ["take_exam", "view_results"]
  },
  examiner: {
    id: "examiner-001",
    name: "Dr. Sarah Smith",
    email: "examiner@astcbt.com",
    avatar: "/placeholder-user.jpg",
    role: "examiner" as const,
    organizationId: "org-001",
    permissions: ["create_exam", "edit_exam", "view_submissions", "grade_exam", "invite_students", "import_students"]
  },
  organization: {
    id: "org-001",
    name: "AST Education Institute",
    email: "admin@astcbt.com",
    avatar: "/placeholder-user.jpg",
    role: "organization" as const,
    permissions: ["manage_examiners", "manage_students", "view_analytics", "configure_settings", "billing"]
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const savedUser = localStorage.getItem("ast-cbt-user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call - Accept ANY credentials (mock authentication)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Generate mock user from email
      const username = email.split("@")[0] || "User"
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        name: username.charAt(0).toUpperCase() + username.slice(1), // Capitalize first letter
        email,
        role: "student",
        avatar: "/placeholder-user.jpg",
      }
      
      setUser(mockUser)
      localStorage.setItem("ast-cbt-user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Simulate OAuth flow - Mock Google authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Generate random mock user data
      const randomId = Math.random().toString(36).substring(7)
      const mockUser: User = {
        id: randomId,
        name: `Student ${randomId.substring(0, 4).toUpperCase()}`,
        email: `student${randomId.substring(0, 4)}@gmail.com`,
        avatar: "/placeholder-user.jpg",
        role: "student",
      }
      
      setUser(mockUser)
      localStorage.setItem("ast-cbt-user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Google login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGithub = async () => {
    setIsLoading(true)
    try {
      // Simulate OAuth flow - Mock GitHub authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Generate random mock user data
      const randomId = Math.random().toString(36).substring(7)
      const mockUser: User = {
        id: randomId,
        name: `Dev ${randomId.substring(0, 4).toUpperCase()}`,
        email: `dev${randomId.substring(0, 4)}@users.github.com`,
        avatar: "/placeholder-user.jpg",
        role: "student",
      }
      
      setUser(mockUser)
      localStorage.setItem("ast-cbt-user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("GitHub login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsMockUser = async (role: "student" | "examiner" | "organization") => {
    setIsLoading(true)
    try {
      // Quick login with predefined mock account
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const mockUser = MOCK_ACCOUNTS[role]
      setUser(mockUser)
      localStorage.setItem("ast-cbt-user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Mock login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: "student" | "examiner" | "organization") => {
    setIsLoading(true)
    try {
      // Simulate API call - Accept ANY signup data (mock authentication)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        name: name || email.split("@")[0],
        email,
        role,
        avatar: "/placeholder-user.jpg",
        organizationId: role !== "organization" ? "org-001" : undefined,
        permissions: role === "student" ? ["take_exam", "view_results"] :
                     role === "examiner" ? ["create_exam", "edit_exam", "view_submissions", "grade_exam"] :
                     ["manage_examiners", "manage_students", "view_analytics", "configure_settings"]
      }
      
      setUser(mockUser)
      localStorage.setItem("ast-cbt-user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ast-cbt-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        loginWithGithub,
        loginAsMockUser,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
