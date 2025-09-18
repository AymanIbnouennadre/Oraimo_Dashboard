// Authentication utilities and session management for Oraimo Admin
import type { User, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, VerifyOtpRequest, VerifyOtpResponse } from "./types"

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
    id: 1,
    firstName: "Admin",
    lastName: "Oraimo",
    phone: "+33123456789",
    email: "admin@oraimo.com",
    address: "Admin Address",
    status: "APPROVED" as const,
    storeTiers: "GOLD" as const,
    role: "ADMIN" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
        return session?.user?.role === "ADMIN" && session?.user?.status === "APPROVED"
  },
}

// Forgot Password Service
export const forgotPasswordService = {
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await fetch('http://localhost:8080/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email } as ForgotPasswordRequest),
      })

      if (response.ok) {
        return {
          success: true,
          message: 'Verification code has been sent to your email address'
        }
      } else {
        // Handle different error status codes
        let errorMessage = 'An error occurred. Please try again'
        
        try {
          // Try to extract error message from backend response
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (parseError) {
          // If we can't parse JSON, use default messages based on status code
          if (response.status === 404) {
            errorMessage = 'No account found with this email address'
          } else if (response.status === 403) {
            errorMessage = 'Password reset is only available for administrator accounts'
          } else if (response.status === 429) {
            errorMessage = 'Too many attempts. Please try again later'
          }
        }
        
        // Override with English messages for specific status codes
        if (response.status === 404) {
          errorMessage = 'No account found with this email address'
        } else if (response.status === 403) {
          errorMessage = 'Password reset is only available for administrator accounts'
        } else if (response.status === 429) {
          errorMessage = 'Too many attempts. Please try again later'
        }
        
        return {
          success: false,
          message: errorMessage
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return {
        success: false,
        message: 'Connection error. Please check your internet connection'
      }
    }
  }
}

// Verify OTP Service (Step 2)
export const verifyOtpService = {
  async verifyCode(email: string, code: string): Promise<VerifyOtpResponse> {
    try {
      const response = await fetch('http://localhost:8080/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, code } as VerifyOtpRequest),
      })

      if (response.ok) {
        return {
          success: true,
          message: 'Code verified successfully',
          resetToken: 'verified' // Pas de token réel, juste indication de succès
        }
      } else {
        // Handle different error status codes
        let errorMessage = 'An error occurred. Please try again'
        
        try {
          // Try to extract error message from backend response
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (parseError) {
          // If we can't parse JSON, use default messages based on status code
        }
        
        // Override with English messages for specific status codes
        if (response.status === 400) {
          errorMessage = 'Invalid or expired verification code'
        } else if (response.status === 404) {
          // Check if it's the endpoint not found vs no reset request
          try {
            const errorText = await response.text()
            if (errorText.includes('Cannot') || errorText.includes('Not Found')) {
              errorMessage = 'Backend service unavailable. Please contact support.'
            } else {
              errorMessage = 'No reset request found for this email'
            }
          } catch {
            errorMessage = 'No reset request found for this email'
          }
        } else if (response.status === 410) {
          // Code expired (if backend uses 410 for expired codes)
          errorMessage = 'Verification code has expired. Please request a new code.'
        } else if (response.status === 429) {
          errorMessage = 'Too many attempts. Please try again later'
        } else if (response.status === 422) {
          // Invalid code format or incorrect code
          errorMessage = 'Invalid verification code. Please check and try again.'
        }
        
        return {
          success: false,
          message: errorMessage
        }
      }
    } catch (error) {
      console.error('Verify code error:', error)
      return {
        success: false,
        message: 'Connection error. Please check your internet connection'
      }
    }
  }
}

// Reset Password Service
export const resetPasswordService = {
  async resetPassword(email: string, code: string, newPassword: string): Promise<ResetPasswordResponse> {
    try {
      const response = await fetch('http://localhost:8080/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword } as ResetPasswordRequest),
      })

      if (response.ok) {
        return {
          success: true,
          message: 'Password reset successfully'
        }
      } else {
        // Handle different error status codes
        if (response.status === 400) {
          return {
            success: false,
            message: 'Invalid or expired reset token'
          }
        } else if (response.status === 404) {
          return {
            success: false,
            message: 'Reset token not found'
          }
        } else {
          return {
            success: false,
            message: 'An error occurred. Please try again'
          }
        }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return {
        success: false,
        message: 'Connection error. Please check your internet connection'
      }
    }
  }
}
