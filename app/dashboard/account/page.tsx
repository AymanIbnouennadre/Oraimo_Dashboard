"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, User, Lock, CheckCircle, Shield } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"
const MA_PHONE_REGEX = /^0[67]\d{8}$/ // 06/07 + 8 digits = 10 total

type UserDto = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  status: string
  storeTiers: string
  role: string
}

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined
  return document.cookie.split("; ").find((r) => r.startsWith(name + "="))?.split("=")[1]
}

function decodeJwt(token: string): any | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function getUserIdFromToken(token: string): number | null {
  const payload = decodeJwt(token)
  
  // Votre backend met l'ID dans le claim 'uid'
  const uid = payload?.uid
  
  if (uid !== undefined && uid !== null) {
    // Si uid est déjà un nombre
    if (typeof uid === "number" && !Number.isNaN(uid)) {
      return uid
    }
    // Si uid est une string, essayer de la convertir
    if (typeof uid === "string") {
      const numericId = Number(uid)
      if (!Number.isNaN(numericId)) {
        return numericId
      }
    }
  }
  
  // Fallback sur 'sub' si 'uid' n'est pas présent
  const sub = payload?.sub
  if (sub !== undefined && sub !== null) {
    const numericId = Number(sub)
    if (!Number.isNaN(numericId)) {
      return numericId
    }
  }
  
  return null
}

export default function AccountPage() {
  const { session } = useAuth()

  const [isFetching, setIsFetching] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [error, setError] = useState("")

  const [user, setUser] = useState<UserDto | null>(null)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // ---- Charger l'utilisateur courant via GET /api/users/{id}
  useEffect(() => {
    const token = getCookie("oraimo_token")
    
    if (!token) {
      setIsFetching(false)
      setError("Invalid session. Please log in again.")
      return
    }
    
    const id = getUserIdFromToken(token)
    
    if (!id) {
      setIsFetching(false)
      setError("Invalid session. Unable to extract user ID from token.")
      return
    }

    ;(async () => {
      try {
        const url = `${BACKEND_URL}/api/users/${id}`
        
        const res = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })
        
        if (!res.ok) {
          const t = await res.text()
          setError(t || `HTTP Error ${res.status}: Unable to retrieve your profile.`)
          return
        }
        
        const u: UserDto = await res.json()
        
        setUser(u)
        setProfileData({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
        })
      } catch (err) {
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError(`Unable to connect to server. Please check if the server is running.`)
        } else {
          setError(`Network error while loading profile.`)
        }
      } finally {
        setIsFetching(false)
      }
    })()
  }, [])

  // ---- Save profile via PUT /api/users/{id}
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setProfileSuccess(false)

    // Validation du téléphone
    const phone = profileData.phone.replace(/\D/g, "")
    if (phone && !MA_PHONE_REGEX.test(phone)) {
      setError("Phone number must start with 06/07 and contain exactly 10 digits.")
      return
    }

    // Validation email
    if (!profileData.email.trim()) {
      setError("Email is required.")
      return
    }

    if (!user) return
    const token = getCookie("oraimo_token")
    if (!token) {
      setError("Session expired. Please log in again.")
      return
    }

    setIsLoadingProfile(true)
    try {
      const payload = {
        id: user.id,
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        email: profileData.email.trim(),
        phone: phone,
        address: profileData.address.trim(),
        status: user.status,
        storeTiers: user.storeTiers,
        role: user.role,
      }
      
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        const t = await res.text()
        setError(t || `HTTP Error ${res.status}: Failed to save profile.`)
        return
      }
      
      const updatedUser = await res.json()
      setUser(updatedUser)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError(`Unable to connect to server for saving.`)
      } else {
        setError(`Erreur réseau lors de la sauvegarde.`)
      }
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // ---- Password (simulation until endpoint exists)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPasswordSuccess(false)

    if (!passwordData.currentPassword.trim()) {
      setError("Current password is required.")
      return
    }

    if (!passwordData.newPassword.trim()) {
      setError("New password is required.")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must contain at least 6 characters.")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoadingPassword(true)
    // Simulation - remplacer par un vrai appel API quand disponible
    await new Promise((r) => setTimeout(r, 800))
    setIsLoadingPassword(false)
    setPasswordSuccess(true)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  if (!session) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information and security</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Information */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-card">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isFetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading profile...</span>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Première ligne : First Name, Last Name, Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                    disabled={isLoadingProfile}
                    className="h-11"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                    disabled={isLoadingProfile}
                    className="h-11"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={isLoadingProfile}
                    className="h-11"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Deuxième ligne : Phone, Address, Role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    maxLength={10}
                    inputMode="numeric"
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10)
                      setProfileData((prev) => ({ ...prev, phone: onlyDigits }))
                    }}
                    disabled={isLoadingProfile}
                    className="h-11"
                    placeholder="0600000002"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-foreground">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                    disabled={isLoadingProfile}
                    className="h-11"
                    placeholder="Enter your address"
                  />
                </div>
                {/* Role - Read Only */}
                {user && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-foreground">
                      Role
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="role"
                        value={user.role}
                        disabled
                        className="h-11 bg-muted flex-1"
                      />
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs">Read only</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isLoadingProfile} className="h-11 px-6">
                  {isLoadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                {profileSuccess && (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Profile updated successfully</span>
                  </div>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-card">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                Current Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                disabled={isLoadingPassword}
                className="h-11"
                placeholder="Enter your current password"
                required
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  disabled={isLoadingPassword}
                  className="h-11"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm New Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  disabled={isLoadingPassword}
                  className="h-11"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isLoadingPassword} className="h-11 px-6">
                {isLoadingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
              {passwordSuccess && (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Password updated successfully</span>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}