"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Package,
  Warehouse,
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const mockKPIs = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
    description: "Registered users",
  },
  {
    title: "Active Products",
    value: "156",
    change: "+3%",
    trend: "up" as const,
    icon: Package,
    description: "Products in catalog",
  },
  {
    title: "Stock Movements",
    value: "1,234",
    change: "-5%",
    trend: "down" as const,
    icon: Warehouse,
    description: "This month",
  },
  {
    title: "Model Detections",
    value: "8,921",
    change: "+18%",
    trend: "up" as const,
    icon: Brain,
    description: "Successful detections",
  },
]

const mockTopProducts = [
  { name: "Oraimo FreePods 3", quantity: 245, points: 29400 },
  { name: "PowerBank 20K", quantity: 189, points: 15120 },
  { name: "SoundGo Speaker", quantity: 156, points: 21840 },
  { name: "SmartWatch Pro", quantity: 134, points: 26800 },
  { name: "Câble USB-C", quantity: 98, points: 2940 },
]

const mockTopUsers = [
  { name: "Sophie Bernard", points: 3200, tier: "GOLD" },
  { name: "Jean Dupont", points: 2500, tier: "GOLD" },
  { name: "Marie Martin", points: 1200, tier: "SILVER" },
  { name: "Luc Moreau", points: 890, tier: "SILVER" },
  { name: "Pierre Durand", points: 450, tier: "BRONZE" },
]

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Overview of your Oraimo platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.map((kpi) => (
          <Card key={kpi.title} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-heading font-bold text-foreground">{kpi.value}</div>
              <div className="flex items-center gap-2 text-sm">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={kpi.trend === "up" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                  {kpi.change}
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
              <p className="text-sm text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Products OUT */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-heading">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              Top Products (Outbound)
            </CardTitle>
            <CardDescription className="text-base">Most shipped products this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {mockTopProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 p-0 flex items-center justify-center font-medium bg-primary/10 border-primary/20"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.quantity} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{product.points.toLocaleString()} pts</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full h-11 bg-transparent border-primary/20 hover:bg-primary/5"
              asChild
            >
              <Link href="/dashboard/products/analytics">
                View Products Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Top Users by Points */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-heading">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              Top Users (Points)
            </CardTitle>
            <CardDescription className="text-base">Users with the most points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {mockTopUsers.map((user, index) => (
                <div key={user.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 p-0 flex items-center justify-center font-medium bg-secondary/10 border-secondary/20"
                    >
                      {index + 1}
                    </Badge>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <Badge
                        variant={user.tier === "GOLD" ? "default" : user.tier === "SILVER" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {user.tier}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{user.points.toLocaleString()} pts</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full h-11 bg-transparent border-secondary/20 hover:bg-secondary/5"
              asChild
            >
              <Link href="/dashboard/users/analytics">
                View Users Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-heading">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            Quick Analytics Access
          </CardTitle>
          <CardDescription className="text-base">Jump directly to detailed analytics sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start h-12 bg-transparent border-border hover:bg-accent/5 hover:border-accent/20"
              asChild
            >
              <Link href="/dashboard/users/analytics">
                <Activity className="h-5 w-5 mr-3" />
                Users Analytics
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-12 bg-transparent border-border hover:bg-primary/5 hover:border-primary/20"
              asChild
            >
              <Link href="/dashboard/products/analytics">
                <Package className="h-5 w-5 mr-3" />
                Products Analytics
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-12 bg-transparent border-border hover:bg-secondary/5 hover:border-secondary/20"
              asChild
            >
              <Link href="/dashboard/stock/analytics">
                <Warehouse className="h-5 w-5 mr-3" />
                Stock Analytics
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-12 bg-transparent border-border hover:bg-accent/5 hover:border-accent/20"
              asChild
            >
              <Link href="/dashboard/model/analytics">
                <Brain className="h-5 w-5 mr-3" />
                Model Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
