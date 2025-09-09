"use client"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

interface SectionTabsProps {
  section: "users" | "products" | "stock" | "model"
}

export function SectionTabs({ section }: SectionTabsProps) {
  const pathname = usePathname()
  const isAnalytics = pathname.includes("/analytics")

  const basePath = `/dashboard/${section}`
  const analyticsPath = `${basePath}/analytics`

  return (
    <Tabs value={isAnalytics ? "analytics" : "management"} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="management" asChild>
          <Link href={basePath} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Gestion
          </Link>
        </TabsTrigger>
        <TabsTrigger value="analytics" asChild>
          <Link href={analyticsPath} className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
