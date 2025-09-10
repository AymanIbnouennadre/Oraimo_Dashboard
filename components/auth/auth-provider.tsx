// components/auth/auth-provider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type AuthSession = { user: { role: string | null } } | null
type Ctx = { session: AuthSession; isLoading: boolean; logout: () => void }
const AuthContext = createContext<Ctx>({ session: null, isLoading: true, logout: () => {} })

function getCookie(name: string) {
  return document.cookie.split("; ").find(r => r.startsWith(name + "="))?.split("=")[1]
}
function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`
}
function decodeJwt(token: string): any | null {
  try {
    const p = token.split(".")[1]
    const json = decodeURIComponent(
      atob(p.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(json)
  } catch { return null }
}
function extractRole(payload: any): string | null {
  let role =
    payload?.role ??
    (Array.isArray(payload?.authorities) ? payload.authorities[0] : undefined) ??
    (Array.isArray(payload?.roles) ? payload.roles[0] : undefined)
  if (!role) return null
  role = String(role).toUpperCase()
  if (role.startsWith("ROLE_")) role = role.slice(5)
  return role
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = getCookie("oraimo_token")
    if (!token) {
      setSession(null)
      setIsLoading(false)
      if (pathname === "/" || pathname.startsWith("/dashboard")) router.replace("/login")
      return
    }

    const payload = decodeJwt(token)
    const expMs = payload?.exp ? payload.exp * 1000 : undefined
    if (expMs && Date.now() > expMs) {
      deleteCookie("oraimo_token")
      setSession(null)
      setIsLoading(false)
      if (pathname !== "/login") router.replace("/login")
      return
    }

    const role = extractRole(payload)
    setSession({ user: { role } })
    setIsLoading(false)

    const isAuthPage = pathname === "/login" || pathname === "/forgot-password"
    const isDashboard = pathname === "/" || pathname.startsWith("/dashboard")

    if (isDashboard && role !== "ADMIN") {
      deleteCookie("oraimo_token")
      router.replace("/login")
    } else if (isAuthPage && role === "ADMIN") {
      router.replace("/dashboard")
    }
  }, [pathname, router])

  const logout = () => {
    deleteCookie("oraimo_token")
    setSession(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ session, isLoading, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
