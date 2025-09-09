"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type AuthSession, mockAuth } from "@/lib/auth"

interface AuthContextType {
  session: AuthSession | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session
    const currentSession = mockAuth.getSession()
    setSession(currentSession)
    setIsLoading(false)

    // Redirect logic
    const isAuthPage = pathname === "/login" || pathname === "/forgot-password"
    const isDashboardPage = pathname.startsWith("/dashboard") || pathname === "/"

    if (!currentSession && isDashboardPage) {
      // No session and trying to access dashboard - redirect to login
      router.push("/login")
    } else if (currentSession && isAuthPage) {
      // Has session and on auth page - redirect to dashboard
      router.push("/dashboard")
    } else if (currentSession && !mockAuth.isAuthorized(currentSession)) {
      // Has session but not authorized (not admin or disabled)
      mockAuth.logout()
      setSession(null)
      router.push("/login")
    }
  }, [pathname, router])

  const logout = () => {
    mockAuth.logout()
    setSession(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ session, isLoading, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
