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
const MA_PHONE_REGEX = /^0[67]\d{8}$/ // 06/07 + 8 chiffres = 10 au total

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
  console.log("Payload décodé:", payload) // Pour debug
  
  // Votre backend met l'ID dans le claim 'uid'
  const uid = payload?.uid
  
  if (uid !== undefined && uid !== null) {
    // Si uid est déjà un nombre
    if (typeof uid === "number" && !Number.isNaN(uid)) {
      console.log("UID trouvé comme nombre:", uid)
      return uid
    }
    // Si uid est une string, essayer de la convertir
    if (typeof uid === "string") {
      const numericId = Number(uid)
      if (!Number.isNaN(numericId)) {
        console.log("UID trouvé comme string et converti:", numericId)
        return numericId
      }
    }
  }
  
  // Fallback sur 'sub' si 'uid' n'est pas présent
  const sub = payload?.sub
  if (sub !== undefined && sub !== null) {
    const numericId = Number(sub)
    if (!Number.isNaN(numericId)) {
      console.log("SUB trouvé et converti:", numericId)
      return numericId
    }
  }
  
  console.error("Impossible d'extraire l'ID utilisateur du token. Payload:", payload)
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
    console.log("Token trouvé:", token ? "Oui" : "Non")
    console.log("Backend URL:", BACKEND_URL)
    
    if (!token) {
      setIsFetching(false)
      setError("Session invalide. Veuillez vous reconnecter.")
      return
    }
    
    // Décodez le token pour voir son contenu
    const payload = decodeJwt(token)
    console.log("Contenu du token:", payload)
    
    const id = getUserIdFromToken(token)
    console.log("ID utilisateur extrait:", id)
    
    if (!id) {
      setIsFetching(false)
      setError("Session invalide. Impossible d'extraire l'ID utilisateur du token.")
      return
    }

    ;(async () => {
      try {
        console.log(`Tentative de récupération de l'utilisateur ${id}...`)
        const url = `${BACKEND_URL}/api/users/${id}`
        console.log("URL de l'API:", url)
        
        const res = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })
        
        console.log("Statut de la réponse:", res.status)
        console.log("Headers de réponse:", Object.fromEntries(res.headers))
        
        if (!res.ok) {
          const t = await res.text()
          console.error("Erreur de l'API:", t)
          setError(t || `Erreur HTTP ${res.status}: Impossible de récupérer votre profil.`)
          return
        }
        
        const u: UserDto = await res.json()
        console.log("Données utilisateur reçues:", u)
        
        setUser(u)
        setProfileData({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
        })
      } catch (err) {
        console.error("Erreur détaillée:", err)
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError(`Impossible de se connecter au serveur (${BACKEND_URL}). Vérifiez que le serveur est démarré.`)
        } else {
          setError(`Erreur réseau lors du chargement du profil: ${err}`)
        }
      } finally {
        setIsFetching(false)
      }
    })()
  }, [])

  // ---- Sauvegarder le profil via PUT /api/users/{id}
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setProfileSuccess(false)

    // Validation du téléphone
    const phone = profileData.phone.replace(/\D/g, "")
    if (phone && !MA_PHONE_REGEX.test(phone)) {
      setError("Le numéro doit commencer par 06/07 et contenir exactement 10 chiffres.")
      return
    }

    // Validation email
    if (!profileData.email.trim()) {
      setError("L'email est requis.")
      return
    }

    if (!user) return
    const token = getCookie("oraimo_token")
    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.")
      return
    }

    setIsLoadingProfile(true)
    try {
      console.log("Sauvegarde du profil pour l'utilisateur:", user.id)
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
      console.log("Payload envoyé:", payload)
      
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("Statut de sauvegarde:", res.status)
      
      if (!res.ok) {
        const t = await res.text()
        console.error("Erreur de sauvegarde:", t)
        setError(t || `Erreur HTTP ${res.status}: Échec de la sauvegarde du profil.`)
        return
      }
      
      const updatedUser = await res.json()
      console.log("Utilisateur mis à jour:", updatedUser)
      setUser(updatedUser)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err) {
      console.error("Erreur de sauvegarde:", err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError(`Impossible de se connecter au serveur pour la sauvegarde.`)
      } else {
        setError(`Erreur réseau lors de la sauvegarde: ${err}`)
      }
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // ---- Mot de passe (simulation tant que l'endpoint n'existe pas)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPasswordSuccess(false)

    if (!passwordData.currentPassword.trim()) {
      setError("Le mot de passe actuel est requis.")
      return
    }

    if (!passwordData.newPassword.trim()) {
      setError("Le nouveau mot de passe est requis.")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
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

      {/* Informations de debug */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-800">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-yellow-700">
            <p>Backend URL: {BACKEND_URL}</p>
            <p>User ID: {user?.id || 'Non chargé'}</p>
            <p>Token présent: {getCookie("oraimo_token") ? 'Oui' : 'Non'}</p>
            <p>Payload JWT: {JSON.stringify(decodeJwt(getCookie("oraimo_token") || ""), null, 2)}</p>
          </CardContent>
        </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex items-center gap-3">
                    <Input
                      id="role"
                      value={user.role}
                      disabled
                      className="h-11 bg-muted"
                    />
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Read only</span>
                    </div>
                  </div>
                </div>
              )}

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