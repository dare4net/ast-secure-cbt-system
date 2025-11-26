"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, Shield, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const getNavItemsForRole = (role?: string) => {
  if (role === "student") {
    return [
      { href: "/students/dashboard", label: "Dashboard" },
      { href: "/students/exams", label: "Exams" },
      { href: "/students/results", label: "Results" },
    ]
  } else if (role === "examiner") {
    return [
      { href: "/examiner/dashboard", label: "Dashboard" },
      { href: "/examiner/create-exam", label: "Create Exam" },
      { href: "/examiner/results", label: "Results" },
    ]
  } else if (role === "organization") {
    return [
      { href: "/organization/dashboard", label: "Dashboard" },
      { href: "/organization/manage", label: "Manage" },
      { href: "/organization/reports", label: "Reports" },
    ]
  }
  return [
    { href: "/", label: "Home" },
    { href: "/students/exams", label: "Exams" },
    { href: "/students/results", label: "Results" },
  ]
}

export function SiteHeader() {
  const pathname = usePathname()
  
  // Safe auth hook usage with error handling
  let user = null
  let isAuthenticated = false
  let logout = () => {}
  
  try {
    const auth = useAuth()
    user = auth.user
    isAuthenticated = auth.isAuthenticated
    logout = auth.logout
  } catch (error) {
    // Auth context not available yet
  }

  const navItems = getNavItemsForRole(user?.role)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">AST Secure CBT</span>
          </Link>
          <nav className="ml-2 hidden gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                  pathname === item.href && "text-foreground bg-primary/10"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link href={
                  user?.role === "student" ? "/students/exams" :
                  user?.role === "examiner" ? "/examiner/create-exam" :
                  "/students/exams"
                }>
                  {user?.role === "examiner" ? "Create Exam" : "Start Exam"}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={
                      user?.role === "student" ? "/students/dashboard" :
                      user?.role === "examiner" ? "/examiner/dashboard" :
                      user?.role === "organization" ? "/organization/dashboard" :
                      "/students/exams"
                    }>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={
                      user?.role === "student" ? "/students/results" :
                      user?.role === "examiner" ? "/examiner/results" :
                      user?.role === "organization" ? "/organization/reports" :
                      "/students/results"
                    }>
                      {user?.role === "organization" ? "Reports" : "Results"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="rounded-full shadow-sm">
              <Link href="/">Sign In</Link>
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      pathname === item.href && "text-foreground bg-primary/10"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button asChild className="mt-2 rounded-full">
                  <Link href={
                    user?.role === "student" ? "/students/exams" :
                    user?.role === "examiner" ? "/examiner/create-exam" :
                    "/students/exams"
                  }>
                    {user?.role === "examiner" ? "Create Exam" : "Start Exam"}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}


