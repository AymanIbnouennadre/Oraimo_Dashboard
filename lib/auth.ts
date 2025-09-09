// Authentication utilities and session management for Oraimo Admin
import type { User } from "./types"

export interface AuthSession {
  user: User
  token: string
  expires: string
}

export interface LoginCredentials {
  phone: string // Changed from email to phone
  password: string
}

export interface AuthResponse {
  success: boolean
  session?: AuthSession
  message?: string
}

// Mock authentication for development
export const mockAuth = {
  // Mock admin user for testing
  adminUser: {
    id: "admin-1",
    name: "Admin Oraimo",
    phone: "+33123456789",
    email: "admin@oraimo.com",
    role: "ADMIN" as const,
    tier: "GOLD" as const,
    enabled: true,
    points_total: 0,
    last_activity: new Date().toISOString(),
    created: "2023-01-01T00:00:00Z",
  },

  // Simulate login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.phone === "+212 600 000 000" && credentials.password === "admin123") {
      const session: AuthSession = {
        user: this.adminUser,
        token: "mock-jwt-token-" + Date.now(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      }

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("oraimo-session", JSON.stringify(session))
      }

      return { success: true, session }
    }

    return { success: false, message: "Phone number or password incorrect" } // Updated error message
  },

  // Get current session
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem("oraimo-session")
    if (!stored) return null

    try {
      const session: AuthSession = JSON.parse(stored)

      // Check if session is expired
      if (new Date(session.expires) < new Date()) {
        localStorage.removeItem("oraimo-session")
        return null
      }

      return session
    } catch {
      localStorage.removeItem("oraimo-session")
      return null
    }
  },

  // Logout
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("oraimo-session")
    }
  },

  // Check if user is admin and enabled
  isAuthorized(session: AuthSession | null): boolean {
    return session?.user?.role === "ADMIN" && session?.user?.enabled === true
  },
}
