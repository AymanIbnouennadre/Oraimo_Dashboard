"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
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
  Target,
  Zap,
  DollarSign,
  ShoppingCart,
  Eye,
  Download
} from "lucide-react"
import Link from "next/link"
import { formatPoints } from "@/lib/utils"

// Helper function to get color classes based on KPI color
const getKPIColorClasses = (color: string) => {
  switch (color) {
    case "blue":
      return {
        border: "border-l-blue-500",
        bg: "bg-blue-500/10",
        title: "text-blue-700",
        icon: "text-blue-600",
        value: "text-blue-900"
      }
    case "green":
      return {
        border: "border-l-green-500",
        bg: "bg-green-500/10",
        title: "text-green-700",
        icon: "text-green-600",
        value: "text-green-900"
      }
    case "purple":
      return {
        border: "border-l-purple-500",
        bg: "bg-purple-500/10",
        title: "text-purple-700",
        icon: "text-purple-600",
        value: "text-purple-900"
      }
    case "orange":
      return {
        border: "border-l-orange-500",
        bg: "bg-orange-500/10",
        title: "text-orange-700",
        icon: "text-orange-600",
        value: "text-orange-900"
      }
    default:
      return {
        border: "border-l-blue-500",
        bg: "bg-blue-500/10",
        title: "text-blue-700",
        icon: "text-blue-600",
        value: "text-blue-900"
      }
  }
}

// Mock data for comprehensive analytics summary
const mockAnalyticsSummary = {
  users: {
    total: 2847,
    newThisMonth: 156,
    active: 1892,
    growth: 12.3
  },
  products: {
    total: 847,
    active: 156,
    salesOut: 3450,
    revenue: 892450
  },
  stock: {
    currentStock: 15678,
    movements: 1234,
    purchasesIn: 4120,
    salesOut: 3450
  },
  model: {
    totalDetections: 24867,
    successRate: 92.31,
    activeUsers: 342,
    avgConfidence: 87.4
  }
}

const mockKPIs = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
    description: "Registered users",
    color: "blue"
  },
  {
    title: "Active Products",
    value: "156",
    change: "+3%",
    trend: "up" as const,
    icon: Package,
    description: "Products in catalog",
    color: "green"
  },
  {
    title: "Stock Movements",
    value: "1,234",
    change: "-5%",
    trend: "down" as const,
    icon: Warehouse,
    description: "This month",
    color: "purple"
  },
  {
    title: "Model Detections",
    value: "24,867",
    change: "+18%",
    trend: "up" as const,
    icon: Brain,
    description: "Successful detections",
    color: "orange"
  },
]

const mockTopProducts = [
  { name: "Oraimo FreePods 3", quantity: 245, points: 29400, revenue: 89700 },
  { name: "PowerBank 20K", quantity: 189, points: 15120, revenue: 72450 },
  { name: "SoundGo Speaker", quantity: 156, points: 21840, revenue: 116850 },
  { name: "SmartWatch Pro", quantity: 134, points: 26800, revenue: 149600 },
  { name: "USB-C Cable", quantity: 98, points: 2940, revenue: 12300 },
]

const mockTopUsers = [
  { name: "Sophie Bernard", points: 3200, tier: "GOLD", detections: 567 },
  { name: "Jean Dupont", points: 2500, tier: "GOLD", detections: 489 },
  { name: "Marie Martin", points: 1200, tier: "SILVER", detections: 423 },
  { name: "Luc Moreau", points: 890, tier: "SILVER", detections: 356 },
  { name: "Pierre Durand", points: 450, tier: "BRONZE", detections: 298 },
]

const mockQuickStats = [
  { 
    label: "New Users (30d)", 
    value: "156", 
    change: "+23%", 
    trend: "up" as const,
    icon: Users,
    color: "blue"
  },
  { 
    label: "Products Sold (30d)", 
    value: "3,450", 
    change: "+7.5%", 
    trend: "up" as const,
    icon: Package,
    color: "green"
  },
  { 
    label: "Stock Turnover", 
    value: "2.3x", 
    change: "+0.3", 
    trend: "up" as const,
    icon: Warehouse,
    color: "purple"
  },
  { 
    label: "Model Accuracy", 
    value: "92.3%", 
    change: "+1.2%", 
    trend: "up" as const,
    icon: Brain,
    color: "orange"
  },
]

// Global Analytics Trends Data - Time series for the last 12 months
const mockGlobalTrends = [
  { month: "Oct 2024", users: 2156, products: 723, stockMovements: 987, revenue: 678900, detections: 18945, accuracy: 88.5 },
  { month: "Nov 2024", users: 2234, products: 745, stockMovements: 1023, revenue: 712300, detections: 19567, accuracy: 89.2 },
  { month: "Dec 2024", users: 2312, products: 756, stockMovements: 1156, revenue: 745600, detections: 20123, accuracy: 89.8 },
  { month: "Jan 2025", users: 2389, products: 768, stockMovements: 1089, revenue: 778900, detections: 20876, accuracy: 90.1 },
  { month: "Feb 2025", users: 2456, products: 789, stockMovements: 1234, revenue: 812300, detections: 21543, accuracy: 90.7 },
  { month: "Mar 2025", users: 2523, products: 801, stockMovements: 1267, revenue: 845600, detections: 22201, accuracy: 91.2 },
  { month: "Apr 2025", users: 2590, products: 812, stockMovements: 1410, revenue: 878900, detections: 22876, accuracy: 91.5 },
  { month: "May 2025", users: 2657, products: 823, stockMovements: 1356, revenue: 912300, detections: 23543, accuracy: 91.8 },
  { month: "Jun 2025", users: 2724, products: 834, stockMovements: 1503, revenue: 945600, detections: 24201, accuracy: 92.1 },
  { month: "Jul 2025", users: 2791, products: 845, stockMovements: 1449, revenue: 978900, detections: 24876, accuracy: 92.3 },
  { month: "Aug 2025", users: 2823, products: 847, stockMovements: 1391, revenue: 1012300, detections: 25543, accuracy: 92.4 },
  { month: "Sep 2025", users: 2847, products: 847, stockMovements: 1234, revenue: 1045600, detections: 24867, accuracy: 92.31 }
]

// Revenue and Sales Trends
const mockRevenueTrends = [
  { month: "Oct 2024", revenue: 678900, sales: 2980, purchases: 3650 },
  { month: "Nov 2024", revenue: 712300, sales: 3120, purchases: 3780 },
  { month: "Dec 2024", revenue: 745600, sales: 3250, purchases: 3910 },
  { month: "Jan 2025", revenue: 778900, sales: 3380, purchases: 4040 },
  { month: "Feb 2025", revenue: 812300, sales: 3510, purchases: 4170 },
  { month: "Mar 2025", revenue: 845600, sales: 3640, purchases: 4300 },
  { month: "Apr 2025", revenue: 878900, sales: 3770, purchases: 4430 },
  { month: "May 2025", revenue: 912300, sales: 3900, purchases: 4560 },
  { month: "Jun 2025", revenue: 945600, sales: 4030, purchases: 4690 },
  { month: "Jul 2025", revenue: 978900, sales: 4160, purchases: 4820 },
  { month: "Aug 2025", revenue: 1012300, sales: 4290, purchases: 4950 },
  { month: "Sep 2025", revenue: 1045600, sales: 4420, purchases: 5080 }
]

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Comprehensive overview of your Oraimo platform performance</p>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockQuickStats.map((stat) => {
          const colorClasses = getKPIColorClasses(stat.color)
          return (
            <Card key={stat.label} className={`relative overflow-hidden border-l-4 ${colorClasses.border} hover:shadow-lg transition-shadow`}>
              <div className={`absolute top-0 right-0 w-16 h-16 ${colorClasses.bg} rounded-full -mr-8 -mt-8`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-semibold ${colorClasses.title}`}>{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${colorClasses.icon}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${colorClasses.value}`}>{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.map((kpi) => {
          const colorClasses = getKPIColorClasses(kpi.color)
          return (
            <Card key={kpi.title} className={`relative overflow-hidden border-l-4 ${colorClasses.border} hover:shadow-lg transition-shadow`}>
              <div className={`absolute top-0 right-0 w-16 h-16 ${colorClasses.bg} rounded-full -mr-8 -mt-8`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-semibold ${colorClasses.title}`}>{kpi.title}</CardTitle>
                <kpi.icon className={`h-5 w-5 ${colorClasses.icon}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${colorClasses.value}`}>{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {kpi.change} vs last month
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Platform Growth Trends</CardTitle>
            <CardDescription>Monthly growth across all metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockGlobalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="products" stroke="#10b981" strokeWidth={2} name="Products" />
                <Line type="monotone" dataKey="stockMovements" stroke="#8b5cf6" strokeWidth={2} name="Stock Movements" />
                <Line type="monotone" dataKey="detections" stroke="#f59e0b" strokeWidth={2} name="AI Detections" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Revenue & Sales Trends</CardTitle>
            <CardDescription>Monthly revenue and transaction volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockRevenueTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                <Bar dataKey="sales" fill="#10b981" name="Sales" />
                <Bar dataKey="purchases" fill="#8b5cf6" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview Tabs */}
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-heading">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            Platform Overview
          </CardTitle>
          <CardDescription className="text-base">Key metrics across all platform areas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="operations" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Operations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Platform Users</p>
                        <p className="text-2xl font-bold">{mockAnalyticsSummary.users.total.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">+{mockAnalyticsSummary.users.growth}% growth</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                        <p className="text-2xl font-bold">{mockAnalyticsSummary.products.active}</p>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">of {mockAnalyticsSummary.products.total} total</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                        <p className="text-2xl font-bold">${mockAnalyticsSummary.products.revenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">from product sales</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">AI Accuracy</p>
                        <p className="text-2xl font-bold">{mockAnalyticsSummary.model.successRate}%</p>
                      </div>
                      <Target className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{mockAnalyticsSummary.model.totalDetections.toLocaleString()} detections</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">User Statistics</h3>
                  <div className="grid gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.users.total.toLocaleString()}</p>
                          </div>
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.users.active.toLocaleString()}</p>
                          </div>
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.users.newThisMonth}</p>
                          </div>
                          <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Users by Points</h3>
                  <div className="space-y-3">
                    {mockTopUsers.slice(0, 5).map((user, index) => (
                      <div key={user.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {user.tier}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPoints(user.points)}</p>
                          <p className="text-xs text-muted-foreground">{user.detections} detections</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/users/analytics">
                      View Full Users Analytics
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Performance</h3>
                  <div className="grid gap-4">
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.products.total}</p>
                          </div>
                          <Package className="h-6 w-6 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Units Sold (30d)</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.products.salesOut.toLocaleString()}</p>
                          </div>
                          <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                            <p className="text-xl font-bold">${mockAnalyticsSummary.products.revenue.toLocaleString()}</p>
                          </div>
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Products by Revenue</h3>
                  <div className="space-y-3">
                    {mockTopProducts.slice(0, 5).map((product, index) => (
                      <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.quantity} units</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{formatPoints(product.points)} pts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/products/analytics">
                      View Full Products Analytics
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Stock & Operations</h3>
                  <div className="grid gap-4">
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.stock.currentStock.toLocaleString()}</p>
                          </div>
                          <Warehouse className="h-6 w-6 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Stock Movements</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.stock.movements.toLocaleString()}</p>
                          </div>
                          <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">AI Model Users</p>
                            <p className="text-xl font-bold">{mockAnalyticsSummary.model.activeUsers}</p>
                          </div>
                          <Brain className="h-6 w-6 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start h-12" asChild>
                      <Link href="/dashboard/stock/analytics">
                        <Warehouse className="h-5 w-5 mr-3" />
                        View Stock Analytics
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-12" asChild>
                      <Link href="/dashboard/model/analytics">
                        <Brain className="h-5 w-5 mr-3" />
                        View Model Analytics
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-12" asChild>
                      <Link href="/dashboard/users/analytics">
                        <Users className="h-5 w-5 mr-3" />
                        View Users Analytics
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-12" asChild>
                      <Link href="/dashboard/products/analytics">
                        <Package className="h-5 w-5 mr-3" />
                        View Products Analytics
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Analytics Access */}
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-heading">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            Detailed Analytics
          </CardTitle>
          <CardDescription className="text-base">Access comprehensive analytics for each area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start h-12 bg-transparent border-border hover:bg-accent/5 hover:border-accent/20"
              asChild
            >
              <Link href="/dashboard/users/analytics">
                <Users className="h-5 w-5 mr-3" />
                Users Analytics
                <ArrowRight className="h-4 w-4 ml-auto" />
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
                <ArrowRight className="h-4 w-4 ml-auto" />
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
                <ArrowRight className="h-4 w-4 ml-auto" />
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
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
