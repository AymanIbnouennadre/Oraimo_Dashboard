"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts"
import { 
  Users, UserPlus, Activity, UserCheck, Download, TrendingUp, TrendingDown, 
  Calendar, Filter, Trophy, ShoppingCart, Package, Target, Star
} from "lucide-react"
import { SectionTabs } from "@/components/layout/section-tabs"
import type { User } from "@/lib/types"
import { formatPoints } from "@/lib/utils"

// Mock data for comprehensive analytics
const mockKPIs = {
  totalUsers: 3347,
  newUsers: 137,
  activeUsers: 2123,
  enabledUsers: 3135,
  disabledUsers: 212,
  growth: {
    totalGrowth: 4.3,
    newUsersGrowth: 5.4,
    activeUsersGrowth: 4.6,
    enabledGrowth: 4.5
  }
}

const mockUserEvolution = [
  { month: "Jul 2025", total: 1285, new: 85, active: 956 },
  { month: "Aug 2025", total: 1342, new: 57, active: 923 }, // summer slowdown
  { month: "Sep 2025", total: 1413, new: 71, active: 1089 }  // back to school boost
]

const mockUserActivity = [
  { day: "Mon", logins: 512, activities: 398, detections: 234 },
  { day: "Tue", logins: 456, activities: 376, detections: 189 }, // typical Tuesday dip
  { day: "Wed", logins: 534, activities: 445, detections: 267 }, // mid-week peak
  { day: "Thu", logins: 489, activities: 412, detections: 201 }, // slight decline
  { day: "Fri", logins: 578, activities: 489, detections: 289 }, // Friday high activity
  { day: "Sat", logins: 298, activities: 234, detections: 145 }, // weekend low
  { day: "Sun", logins: 234, activities: 187, detections: 123 }  // Sunday lowest
]

const mockUsersByRole = [
  { name: "Customer", value: 3289, color: "#9B7EBD" },
  { name: "Admin", value: 58, color: "#BBDCE5" }
]

const mockTopUsersByPoints = [
  { 
    rank: 1, 
    user: "Sophie Bernard", 
    role: "CUSTOMER",
    points: 12750, 
    salesQty: 245, 
    purchasesQty: 87,
    movements: 189,
    detections: 256,
    lastActivity: "2025-09-18T14:30:00Z",
    storeTier: "GOLD" 
  },
  { 
    rank: 2, 
    user: "Jean Dupont", 
    role: "CUSTOMER",
    points: 10230, 
    salesQty: 198, 
    purchasesQty: 72,
    movements: 156,
    detections: 234,
    lastActivity: "2025-09-18T11:45:00Z",
    storeTier: "SILVER" 
  },
  { 
    rank: 3, 
    user: "Marie Martin", 
    role: "CUSTOMER",
    points: 9890, 
    salesQty: 178, 
    purchasesQty: 109,
    movements: 194,
    detections: 267,
    lastActivity: "2025-09-17T16:20:00Z",
    storeTier: "GOLD" 
  },
  { 
    rank: 4, 
    user: "Luc Moreau", 
    role: "CUSTOMER",
    points: 8670, 
    salesQty: 158, 
    purchasesQty: 65,
    movements: 127,
    detections: 203,
    lastActivity: "2025-09-17T09:15:00Z",
    storeTier: "SILVER" 
  },
  { 
    rank: 5, 
    user: "Pierre Durand", 
    role: "CUSTOMER",
    points: 7520, 
    salesQty: 137, 
    purchasesQty: 54,
    movements: 96,
    detections: 178,
    lastActivity: "2025-09-16T13:40:00Z",
    storeTier: "BRONZE" 
  }
]

const mockTotalMetrics = [
  { month: "Jul 2025", totalSales: 2380, totalPurchases: 1240 },
  { month: "Aug 2025", totalSales: 2280, totalPurchases: 1180 }, // summer slowdown
  { month: "Sep 2025", totalSales: 2850, totalPurchases: 1420 }  // back to school/work boost
]

const mockTopUsersByPurchases = [
  { rank: 1, user: "Marie Martin", role: "CUSTOMER", storeTier: "GOLD", purchasesQty: 209, purchaseValue: 41800, lastPurchase: "2025-09-18T10:30:00Z" },
  { rank: 2, user: "Sophie Bernard", role: "CUSTOMER", storeTier: "GOLD", purchasesQty: 187, purchaseValue: 37400, lastPurchase: "2025-09-17T14:20:00Z" },
  { rank: 3, user: "Jean Dupont", role: "CUSTOMER", storeTier: "SILVER", purchasesQty: 172, purchaseValue: 34400, lastPurchase: "2025-09-17T09:15:00Z" },
  { rank: 4, user: "Luc Moreau", role: "CUSTOMER", storeTier: "SILVER", purchasesQty: 165, purchaseValue: 33000, lastPurchase: "2025-09-16T16:45:00Z" },
  { rank: 5, user: "Pierre Durand", role: "CUSTOMER", storeTier: "BRONZE", purchasesQty: 154, purchaseValue: 30800, lastPurchase: "2025-09-16T11:30:00Z" }
]

const mockTopUsersBySales = [
  { rank: 1, user: "Marie Martin", role: "CUSTOMER", storeTier: "GOLD", salesQty: 334, revenue: 67800 },
  { rank: 2, user: "Sophie Bernard", role: "CUSTOMER", storeTier: "GOLD", salesQty: 298, revenue: 59600 },
  { rank: 3, user: "Jean Dupont", role: "CUSTOMER", storeTier: "SILVER", salesQty: 267, revenue: 53400 },
  { rank: 4, user: "Luc Moreau", role: "CUSTOMER", storeTier: "SILVER", salesQty: 245, revenue: 49000 },
  { rank: 5, user: "Pierre Durand", role: "CUSTOMER", storeTier: "BRONZE", salesQty: 223, revenue: 44600 }
]

const mockTopUsersByActivity = [
  { rank: 1, user: "Sophie Bernard", totalActivity: 445, movements: 189, detections: 256 },
  { rank: 2, user: "Marie Martin", totalActivity: 431, movements: 194, detections: 237 },
  { rank: 3, user: "Jean Dupont", totalActivity: 390, movements: 156, detections: 234 },
  { rank: 4, user: "Luc Moreau", totalActivity: 330, movements: 127, detections: 203 },
  { rank: 5, user: "Pierre Durand", totalActivity: 274, movements: 96, detections: 178 }
]

export default function UsersAnalyticsPage() {
  const [period, setPeriod] = useState("30d")
  const [role, setRole] = useState("CUSTOMER")
  const [storeTier, setStoreTier] = useState("ALL")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const exportCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map(item => Object.values(item).join(",")).join("\n")
    const csvContent = headers + "\n" + rows

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}-${period}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    )
  }

  const getTrendColor = (value: number) => {
    return value > 0 ? "text-green-600" : "text-red-600"
  }

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "GOLD":
        return "default"
      case "SILVER":
        return "secondary" 
      case "BRONZE":
      default:
        return "outline"
    }
  }

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case "GOLD":
        return "badge-gold"
      case "SILVER":
        return "badge-silver"
      case "BRONZE":
        return "badge-bronze"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            User Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Comprehensive insights into user behavior and performance</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="space-y-1">
            <Label htmlFor="period" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px] h-10">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="role" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[160px] h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="tier" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Store Tier</Label>
            <Select value={storeTier} onValueChange={setStoreTier}>
              <SelectTrigger className="w-[160px] h-10">
                <Star className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Tiers</SelectItem>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="SILVER">Silver</SelectItem>
                <SelectItem value="BRONZE">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <SectionTabs section="users" />

      {/* Main KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{mockKPIs.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(mockKPIs.growth.totalGrowth)}
              <span className={`text-xs font-medium ${getTrendColor(mockKPIs.growth.totalGrowth)}`}>
                +{mockKPIs.growth.totalGrowth}% vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">New Users</CardTitle>
            <UserPlus className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{mockKPIs.newUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(mockKPIs.growth.newUsersGrowth)}
              <span className={`text-xs font-medium ${getTrendColor(mockKPIs.growth.newUsersGrowth)}`}>
                +{mockKPIs.growth.newUsersGrowth}% vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Active Users</CardTitle>
            <Activity className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{mockKPIs.activeUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(mockKPIs.growth.activeUsersGrowth)}
              <span className={`text-xs font-medium ${getTrendColor(mockKPIs.growth.activeUsersGrowth)}`}>
                +{mockKPIs.growth.activeUsersGrowth}% vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-700">Account Status</CardTitle>
            <UserCheck className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enabled</span>
                <Badge variant="default" className="bg-green-500">{mockKPIs.enabledUsers.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disabled</span>
                <Badge variant="destructive">{mockKPIs.disabledUsers.toLocaleString()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Evolution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">User Evolution Trends</CardTitle>
                <CardDescription>Monthly growth patterns and user engagement</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportCSV(mockUserEvolution, "user-evolution")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={mockUserEvolution}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="total" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" name="Total Users" />
                <Area type="monotone" dataKey="active" stackId="2" stroke="#10b981" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                <Line type="monotone" dataKey="new" stroke="#f59e0b" strokeWidth={3} name="New Users" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Weekly Activity Pattern</CardTitle>
            <CardDescription>User engagement throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockUserActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="logins" fill="#3b82f6" name="Logins" radius={[4, 4, 0, 0]} />
                <Bar dataKey="activities" fill="#10b981" name="Activities" radius={[4, 4, 0, 0]} />
                <Bar dataKey="detections" fill="#f59e0b" name="Detections" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Company Sales & Purchases Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Company Performance Overview</CardTitle>
            <CardDescription>Total sales and purchases evolution across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Total Sales Evolution */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Total Sales Evolution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mockTotalMetrics}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      formatter={(value: any) => [value.toLocaleString(), "Total Sales"]}
                    />
                    <Area type="monotone" dataKey="totalSales" stroke="#10b981" strokeWidth={3} fill="url(#salesGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Total Purchases Evolution */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Total Purchases Evolution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mockTotalMetrics}>
                    <defs>
                      <linearGradient id="purchasesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      formatter={(value: any) => [value.toLocaleString(), "Total Purchases"]}
                    />
                    <Area type="monotone" dataKey="totalPurchases" stroke="#8b5cf6" strokeWidth={3} fill="url(#purchasesGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">User Rankings & Performance</CardTitle>
          <CardDescription>Top performers across different metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="points" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="points" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                By Points
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                By Sales
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                By Purchases
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                By Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="points" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Users by Points</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopUsersByPoints, "top-users-points")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Store Tier</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Sales (Qty)</TableHead>
                    <TableHead>Purchases (Qty)</TableHead>
                    <TableHead>Detections</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersByPoints.map((user) => (
                    <TableRow key={user.rank} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge 
                          variant={user.rank <= 3 ? "default" : "outline"} 
                          className={`w-8 h-8 p-0 flex items-center justify-center ${
                            user.rank === 1 ? "bg-yellow-500" : 
                            user.rank === 2 ? "bg-gray-400" : 
                            user.rank === 3 ? "bg-orange-600" : ""
                          }`}
                        >
                          {user.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getTierBadgeVariant(user.storeTier)}
                          className={`text-xs ${getTierBadgeClass(user.storeTier)}`}
                        >
                          {user.storeTier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">{formatPoints(user.points)}</TableCell>
                      <TableCell>{user.salesQty}</TableCell>
                      <TableCell>{user.purchasesQty}</TableCell>
                      <TableCell>{user.detections}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.lastActivity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sales" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Top Users by Sales Volume</h3>
                  <p className="text-sm text-muted-foreground">Users with highest sales quantities (OUT movements)</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopUsersBySales, "top-users-sales")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Store Tier</TableHead>
                    <TableHead>Sales (Qty)</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Avg per Sale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersBySales.map((user) => (
                    <TableRow key={user.rank} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge 
                          variant={user.rank <= 3 ? "default" : "outline"} 
                          className={`w-8 h-8 p-0 flex items-center justify-center ${
                            user.rank === 1 ? "bg-yellow-500 text-yellow-900" : 
                            user.rank === 2 ? "bg-gray-400 text-gray-900" : 
                            user.rank === 3 ? "bg-orange-600 text-white" : ""
                          }`}
                        >
                          {user.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ backgroundColor: "#9B7EBD", color: "white" }}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getTierBadgeVariant(user.storeTier)}
                          className={`text-xs ${getTierBadgeClass(user.storeTier)}`}
                        >
                          {user.storeTier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">{user.salesQty}</TableCell>
                      <TableCell className="font-bold">${user.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">${Math.round(user.revenue / user.salesQty)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="purchases" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Top Users by Purchase Volume</h3>
                  <p className="text-sm text-muted-foreground">Users with highest purchase quantities (IN movements)</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopUsersByPurchases, "top-users-purchases")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Store Tier</TableHead>
                    <TableHead>Purchases (Qty)</TableHead>
                    <TableHead>Purchase Value</TableHead>
                    <TableHead>Last Purchase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersByPurchases.map((user) => (
                    <TableRow key={user.rank} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge 
                          variant={user.rank <= 3 ? "default" : "outline"} 
                          className={`w-8 h-8 p-0 flex items-center justify-center ${
                            user.rank === 1 ? "bg-yellow-500 text-yellow-900" : 
                            user.rank === 2 ? "bg-gray-400 text-gray-900" : 
                            user.rank === 3 ? "bg-orange-600 text-white" : ""
                          }`}
                        >
                          {user.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ backgroundColor: "#9B7EBD", color: "white" }}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getTierBadgeVariant(user.storeTier)}
                          className={`text-xs ${getTierBadgeClass(user.storeTier)}`}
                        >
                          {user.storeTier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-purple-600">{user.purchasesQty}</TableCell>
                      <TableCell className="font-bold">${user.purchaseValue.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.lastPurchase)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Most Active Users</h3>
                  <p className="text-sm text-muted-foreground">Users with highest activity score (movements + detections)</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopUsersByActivity, "top-users-activity")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Total Activity</TableHead>
                    <TableHead>Movements</TableHead>
                    <TableHead>Detections</TableHead>
                    <TableHead>Activity Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersByActivity.map((user) => (
                    <TableRow key={user.rank} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge 
                          variant={user.rank <= 3 ? "default" : "outline"} 
                          className={`w-8 h-8 p-0 flex items-center justify-center ${
                            user.rank === 1 ? "bg-yellow-500 text-yellow-900" : 
                            user.rank === 2 ? "bg-gray-400 text-gray-900" : 
                            user.rank === 3 ? "bg-orange-600 text-white" : ""
                          }`}
                        >
                          {user.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell className="font-bold text-orange-600">{user.totalActivity}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {user.movements}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {user.detections}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {((user.detections / user.totalActivity) * 100).toFixed(0)}% Detection
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
