// middleware.ts
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Decode JWT (Edge runtime, sans Buffer)
function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split(".")[1]
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(base64)
    return JSON.parse(decodeURIComponent(Array.prototype.map.call(json, (c: string) =>
      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join("")))
  } catch {
    return null
  }
}
function getRole(payload: any): string {
  const r =
    payload?.role ??
    (Array.isArray(payload?.authorities) ? payload.authorities[0] : undefined) ??
    (Array.isArray(payload?.roles) ? payload.roles[0] : undefined) ??
    ""
  return String(r).toUpperCase().replace(/^ROLE_/, "")
}
function isValidAdmin(token?: string | null) {
  if (!token) return { ok: false }
  const p = decodeJwtPayload(token)
  if (!p) return { ok: false }
  const expMs = p?.exp ? p.exp * 1000 : undefined
  if (expMs && Date.now() > expMs) return { ok: false, expired: true }
  return { ok: getRole(p) === "ADMIN" }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("oraimo_token")?.value
  const check = isValidAdmin(token)

  // Pages d'auth: si déjà connecté ADMIN -> aller direct au dashboard
  if (pathname === "/login" || pathname === "/forgot-password") {
    if (check.ok) return NextResponse.redirect(new URL("/dashboard", req.url))
    return NextResponse.next()
  }

  // Protéger "/" et tout le dashboard AVANT rendu → pas de flash
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    if (!check.ok) {
      const res = NextResponse.redirect(new URL("/login", req.url))
      if (check.expired) res.cookies.delete("oraimo_token")
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  // On applique seulement où c'est utile
  matcher: ["/", "/dashboard/:path*", "/login", "/forgot-password"],
}
