// components/layouts/dashboard-layout.tsx (ou l'emplacement actuel)
"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Users, Package, Warehouse, Brain, Settings, LogOut, User, ChevronRight } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import Link from "next/link"
import { userService } from "@/lib/services/user-service"
import type { UserResponse } from "@/lib/types"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { session, logout } = useAuth()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null)
  const [userLoading, setUserLoading] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: "Users",
      icon: Users,
      isActive: pathname.startsWith("/dashboard/users"),
      items: [
        { title: "Management", href: "/dashboard/users", isActive: pathname === "/dashboard/users" },
        { title: "Analytics", href: "/dashboard/users/analytics", isActive: pathname === "/dashboard/users/analytics" },
      ],
    },
    {
      title: "Products",
      icon: Package,
      isActive: pathname.startsWith("/dashboard/products"),
      items: [
        { title: "Management", href: "/dashboard/products", isActive: pathname === "/dashboard/products" },
        { title: "Analytics", href: "/dashboard/products/analytics", isActive: pathname === "/dashboard/products/analytics" },
      ],
    },
    {
      title: "Stock",
      icon: Warehouse,
      isActive: pathname.startsWith("/dashboard/stock"),
      items: [
        { title: "Management", href: "/dashboard/stock", isActive: pathname === "/dashboard/stock" },
        { title: "Analytics", href: "/dashboard/stock/analytics", isActive: pathname === "/dashboard/stock/analytics" },
      ],
    },
    {
      title: "Model",
      icon: Brain,
      isActive: pathname.startsWith("/dashboard/model"),
      items: [
        { title: "History", href: "/dashboard/model", isActive: pathname === "/dashboard/model" },
        { title: "Analytics", href: "/dashboard/model/analytics", isActive: pathname === "/dashboard/model/analytics" },
      ],
    },
  ]

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load current user information
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (session?.user?.userId && mounted) {
        setUserLoading(true)
        try {
          const userData = await userService.getById(Number(session.user.userId))
          setCurrentUser(userData)
        } catch (error) {
          console.error("Failed to load current user:", error)
          // Fallback: keep current user as null, will show default values
        } finally {
          setUserLoading(false)
        }
      }
    }

    loadCurrentUser()
  }, [session?.user?.userId, mounted])

  // Set open sections based on current path
  useEffect(() => {
    const newOpen: Record<string, boolean> = {}
    navigationItems.forEach(item => {
      if (item.items) {
        newOpen[item.title] = false
      }
    })
    setOpenSections(newOpen)
  }, [pathname])

  if (!mounted) {
    return null // or a loader
  }

  return (
    <SidebarProvider>
      {/* Full screen overlay during logout */}
      <LoadingOverlay show={signingOut} label="Signing out…" />

      <div className="flex min-h-screen w-full bg-background">
        {/* Main Sidebar */}
        <Sidebar className="border-r border-border">
                    <SidebarHeader className="border-b border-border bg-card">
            <div className="flex items-center justify-center px-4 py-8">
              <Image
                src="/logo.png"
                alt="Oraimo Logo"
                width={170}
                height={170}
                className="object-contain"
                priority
              />
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-card">
            <SidebarMenu className="px-2 py-4">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1">
                  {item.items ? (
                    <Collapsible open={openSections[item.title] || false} onOpenChange={(open) => setOpenSections(prev => ({...prev, [item.title]: open}))}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="h-11 rounded-lg font-medium transition-all hover:bg-accent hover:text-accent-foreground">
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm">{item.title}</span>
                          <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${openSections[item.title] ? 'rotate-90' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 mt-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                                className="h-9 rounded-md font-medium transition-all hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                              >
                                <Link href={subItem.href} className="flex items-center gap-3 px-3">
                                  <span className="text-sm">{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      className="h-11 rounded-lg font-medium transition-all hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <Link href={item.href!} className="flex items-center gap-3 px-3">
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-border bg-card">
            <SidebarMenu className="p-2">
              <SidebarMenuItem>
                <DropdownMenu>
                  {/* Native trigger (better compatibility) */}
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex h-12 items-center gap-3 rounded-lg px-3 hover:bg-accent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                          {userLoading 
                            ? "..." 
                            : currentUser 
                              ? `${currentUser.firstName?.charAt(0) || ""}${currentUser.lastName?.charAt(0) || ""}`.toUpperCase() || "A"
                              : session?.user?.role?.charAt(0) || "A"
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-left flex-1">
                        <span className="text-sm font-medium text-foreground">
                          {userLoading 
                            ? "Loading..." 
                            : currentUser 
                              ? `${currentUser.firstName} ${currentUser.lastName}` 
                              : "Admin User"
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">{session?.user?.role}</span>
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/account" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Sign Out with overlay + anti double-click */}
                    <DropdownMenuItem
                      onSelect={() => {
                        if (signingOut) return
                        setSigningOut(true)
                        // let the menu close + render the overlay, then start logout
                        requestAnimationFrame(() => {
                          setTimeout(() => {
                            logout() // remove cookie + push("/login")
                          }, 100) // 80–120ms is enough
                        })
                      }}
                      className={`flex items-center gap-2 text-destructive ${signingOut ? "opacity-60 pointer-events-none" : ""}`}
                    >
                      <span
                        aria-hidden
                        className={`h-4 w-4 rounded-full border-2 ${signingOut ? "animate-spin border-current border-t-transparent" : "border-transparent"
                          }`}
                      />
                      {signingOut ? "Signing out…" : (
                        <>
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </>
                      )}
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center gap-4 px-6">
                <SidebarTrigger className="h-8 w-8" />
                <div className="flex-1" />
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-6 bg-muted/30">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
