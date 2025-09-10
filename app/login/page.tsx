// app/login/page.tsx
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Phone } from "lucide-react"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"
const MA_PHONE_REGEX = /^0[67]\d{8}$/ // 06/07 + 8 chiffres

type FormErrors = { phone?: string; password?: string; general?: string }

const MSG = {
  INVALID_CREDENTIALS: "Identifiants invalides.",
  PHONE_NOT_FOUND: "Numéro introuvable.",
  PASSWORD_BAD: "Mot de passe incorrect.",
  ACCESS_DENIED: "Accès réservé aux administrateurs.",
  ACCOUNT_LOCKED: "Compte verrouillé ou désactivé. Contactez l’administrateur.",
  TOO_MANY: "Trop de tentatives. Réessayez plus tard.",
  SERVER: "Service temporairement indisponible. Réessayez plus tard.",
  NETWORK: "Problème de connexion. Vérifiez votre réseau.",
  TIMEOUT: "Délai dépassé. Réessayez.",
  TOKEN_INVALID: "Réponse invalide du serveur (token manquant).",
  PHONE_FORMAT: "Le numéro doit commencer par 06 ou 07 et contenir exactement 10 chiffres.",
  PHONE_REQUIRED: "Veuillez saisir votre numéro de téléphone.",
  PASSWORD_REQUIRED: "Veuillez saisir votre mot de passe.",
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${value}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`
}

// --- Helpers JWT (pour vérifier ADMIN côté UI)
function decodeJwt(token: string): any | null {
  try {
    const payload = token.split(".")[1]
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(json)
  } catch {
    return null
  }
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

// --- Convertit la réponse backend en erreurs "propres"
async function toFriendlyErrors(res: Response): Promise<FormErrors> {
  let data: any = undefined
  let text = ""
  try { data = await res.clone().json() } catch { try { text = await res.text() } catch {} }

  const collected: FormErrors = {}
  const fieldArrays = [data?.fieldErrors, data?.errors].filter(Boolean) as any[][]
  if (fieldArrays.length) {
    for (const arr of fieldArrays) {
      for (const fe of arr) {
        const field = String(fe.field || "").toLowerCase()
        if (field.includes("phone")) collected.phone = fe.defaultMessage || MSG.PHONE_NOT_FOUND
        if (field.includes("password")) collected.password = fe.defaultMessage || MSG.PASSWORD_BAD
      }
    }
    if (collected.phone || collected.password) return collected
  }

  const raw = String(data?.message || text || "").toLowerCase()
  if (raw.includes("phone not found") || raw.includes("user not found") || raw.includes("unknown phone"))
    collected.phone = MSG.PHONE_NOT_FOUND
  if (raw.includes("bad password") || raw.includes("invalid password") || raw.includes("wrong password"))
    collected.password = MSG.PASSWORD_BAD
  if (collected.phone || collected.password) return collected

  if (res.status === 401) return { general: MSG.INVALID_CREDENTIALS }
  if (res.status === 403) return { general: MSG.ACCESS_DENIED }
  if (res.status === 423) return { general: MSG.ACCOUNT_LOCKED }
  if (res.status === 429) return { general: MSG.TOO_MANY }
  if (res.status >= 500) return { general: MSG.SERVER }
  return { general: MSG.INVALID_CREDENTIALS }
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ phone: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})

  function validateAll(): boolean {
    const e: FormErrors = {}
    const phone = formData.phone.trim()

    if (!phone) e.phone = MSG.PHONE_REQUIRED
    else if (!MA_PHONE_REGEX.test(phone)) e.phone = MSG.PHONE_FORMAT

    if (!formData.password) e.password = MSG.PASSWORD_REQUIRED

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validateAll()) return

    setIsLoading(true)
    setErrors({})

    const ac = new AbortController()
    const t = setTimeout(() => ac.abort(), 10_000)

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, password: formData.password }),
        signal: ac.signal,
      })

      if (!res.ok) {
        const friendly = await toFriendlyErrors(res)
        if (friendly.phone || friendly.password) setErrors((prev) => ({ ...prev, ...friendly, general: undefined }))
        else setErrors(friendly)
        return
      }

      let body: any = {}
      try { body = await res.json() } catch { body = {} }
      const token: string =
        body.token ?? body.access_token ?? body.jwt ?? (typeof body === "string" ? body : "")

      if (!token || token.split(".").length !== 3) {
        setErrors({ general: MSG.TOKEN_INVALID })
        return
      }

      const role = extractRole(decodeJwt(token))
      if (role !== "ADMIN") {
        setErrors({ general: MSG.ACCESS_DENIED })
        return
      }

      setCookie("oraimo_token", token, 60 * 60 * 24 * 7)
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setErrors({ general: err?.name === "AbortError" ? MSG.TIMEOUT : MSG.NETWORK })
    } finally {
      clearTimeout(t)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* 🔥 Overlay plein écran pendant login */}
      <LoadingOverlay show={isLoading} label="Signing in…" />

      <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto mb-2 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-heading font-bold text-2xl">O</span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-heading font-bold text-foreground">Oraimo Admin</CardTitle>
            <CardDescription className="text-muted-foreground">Sign in to your admin dashboard</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {errors.general && (
              <Alert variant="destructive" className="border-destructive/20" role="alert" aria-live="polite">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="username"
                  placeholder="06(07) xx xx xx xx"
                  value={formData.phone}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setFormData((p) => ({ ...p, phone: onlyDigits }))
                    if (errors.phone && MA_PHONE_REGEX.test(onlyDigits)) {
                      setErrors((prev) => ({ ...prev, phone: undefined }))
                    }
                  }}
                  onBlur={() => {
                    const v = formData.phone.trim()
                    if (!v) setErrors((prev) => ({ ...prev, phone: MSG.PHONE_REQUIRED }))
                    else if (!MA_PHONE_REGEX.test(v)) setErrors((prev) => ({ ...prev, phone: MSG.PHONE_FORMAT }))
                  }}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  disabled={isLoading}
                  className={`pl-10 h-12 bg-input border-border focus:border-primary focus:ring-primary ${
                    errors.phone ? "border-destructive focus:ring-destructive" : ""
                  }`}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-xs text-destructive">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    const v = e.target.value
                    setFormData((p) => ({ ...p, password: v }))
                    if (errors.password && v) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  onBlur={() => {
                    if (!formData.password) setErrors((prev) => ({ ...prev, password: MSG.PASSWORD_REQUIRED }))
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  disabled={isLoading}
                  className={`pr-12 h-12 bg-input border-border focus:border-primary focus:ring-primary ${
                    errors.password ? "border-destructive focus:ring-destructive" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary"
                onClick={() => router.push("/forgot-password")}
                disabled={isLoading}
              >
                Forgot your password?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
