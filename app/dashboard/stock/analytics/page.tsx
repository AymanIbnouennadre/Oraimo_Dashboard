"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts"
import { 
  Package, ShoppingCart, TrendingUp, TrendingDown, Download, Filter, AlertTriangle,
  Calendar, Users, Activity, Target, Star, Trophy, Zap, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, PackageX, Warehouse
} from "lucide-react"

// Mock data for comprehensive stock analytics - Realistic September 2025 data
const mockStockKPIs = {
  currentStock: 15847,      // IN - OUT total current
  purchasesIn: 6420,        // units purchased in period
  salesOut: 4850,           // units sold in period
  pointsIssued: 245600,     // total points from IN movements
  netVariation: 1570,       // IN - OUT = +1570 positive growth
  totalMovements: 3456,     // number of transactions
  activeUsers: 287,         // users who made movements
  activeProducts: 142,      // products with movements
  lowStockItems: 23,        // items below threshold
  stockoutItems: 5          // items with 0 stock
}

const mockStockTrends = [
  { month: "Jul 2025", stockLevel: 14200, purchasesIn: 5980, salesOut: 4320, netFlow: 1660 },
  { month: "Aug 2025", stockLevel: 14700, salesOut: 4650, purchasesIn: 5150, netFlow: 500 }, // summer slowdown
  { month: "Sep 2025", stockLevel: 15847, purchasesIn: 6420, salesOut: 4850, netFlow: 1570 }  // back to school boost
]

const mockStockDistribution = [
  { name: "IN Stock", value: mockStockKPIs.currentStock, color: "#10b981" },
  { name: "Low Stock", value: mockStockKPIs.lowStockItems, color: "#f59e0b" },
  { name: "Stock Out", value: mockStockKPIs.stockoutItems, color: "#ef4444" }
]

const mockActivityMetrics = [
  { week: "Week 1", movements: 890, users: 76, products: 34 },
  { week: "Week 2", movements: 756, users: 68, products: 29 }, // typical dip
  { week: "Week 3", movements: 945, users: 82, products: 41 }, // recovery
  { week: "Week 4", movements: 865, users: 79, products: 38 }  // stabilizing
]

const mockTopProductsSold = [
  { rank: 1, product: "FreePods 4 Pro", category: "Audio", quantityOut: 456, revenue: 118560, stockRemaining: 234 },
  { rank: 2, product: "PowerMax 30K", category: "Power", quantityOut: 398, revenue: 99500, stockRemaining: 187 },
  { rank: 3, product: "SoundWave Elite", category: "Audio", quantityOut: 324, revenue: 161676, stockRemaining: 156 },
  { rank: 4, product: "SmartWatch Ultra", category: "Smart Devices", quantityOut: 287, revenue: 229600, stockRemaining: 98 },
  { rank: 5, product: "Gaming Headset Pro", category: "Gaming", quantityOut: 245, revenue: 98000, stockRemaining: 123 },
  { rank: 6, product: "USB-C Hub Elite", category: "Accessories", quantityOut: 189, revenue: 75600, stockRemaining: 67 },
  { rank: 7, product: "PowerBank Slim", category: "Power", quantityOut: 167, revenue: 41750, stockRemaining: 234 },
  { rank: 8, product: "Lightning Cable Pro", category: "Cables", quantityOut: 145, revenue: 14500, stockRemaining: 345 }
]

const mockTopProductsPurchased = [
  { rank: 1, product: "PowerMax 30K", category: "Power", quantityIn: 620, cost: 77500, stockLevel: 585 },
  { rank: 2, product: "FreePods 4 Pro", category: "Audio", quantityIn: 580, cost: 87000, stockLevel: 690 },
  { rank: 3, product: "SoundWave Elite", category: "Audio", quantityIn: 480, cost: 120000, stockLevel: 480 },
  { rank: 4, product: "SmartWatch Ultra", category: "Smart Devices", quantityIn: 385, cost: 154000, stockLevel: 385 },
  { rank: 5, product: "Gaming Headset Pro", category: "Gaming", quantityIn: 345, cost: 69000, stockLevel: 368 },
  { rank: 6, product: "USB-C Hub Elite", category: "Accessories", quantityIn: 256, cost: 51200, stockLevel: 256 },
  { rank: 7, product: "PowerBank Slim", category: "Power", quantityIn: 234, cost: 35100, stockLevel: 401 },
  { rank: 8, product: "Lightning Cable Pro", category: "Cables", quantityIn: 189, cost: 9450, stockLevel: 534 }
]

const mockTopUsersSales = [
  { rank: 1, user: "Marie Martin", role: "CUSTOMER", tier: "GOLD", quantityOut: 445, transactions: 89, revenue: 89000 },
  { rank: 2, user: "Sophie Bernard", role: "CUSTOMER", tier: "GOLD", quantityOut: 398, transactions: 76, revenue: 79600 },
  { rank: 3, user: "Jean Dupont", role: "CUSTOMER", tier: "SILVER", quantityOut: 356, transactions: 67, revenue: 71200 },
  { rank: 4, user: "Luc Moreau", role: "CUSTOMER", tier: "SILVER", quantityOut: 289, transactions: 54, revenue: 57800 },
  { rank: 5, user: "Pierre Durand", role: "CUSTOMER", tier: "BRONZE", quantityOut: 245, transactions: 48, revenue: 49000 }
]

const mockTopUsersPurchases = [
  { rank: 1, user: "Marie Martin", role: "CUSTOMER", tier: "GOLD", quantityIn: 567, transactions: 45, cost: 113400 },
  { rank: 2, user: "Sophie Bernard", role: "CUSTOMER", tier: "GOLD", quantityIn: 489, transactions: 42, cost: 97800 },
  { rank: 3, user: "Jean Dupont", role: "CUSTOMER", tier: "SILVER", quantityIn: 445, transactions: 38, cost: 89000 },
  { rank: 4, user: "Luc Moreau", role: "CUSTOMER", tier: "SILVER", quantityIn: 398, transactions: 35, cost: 79600 },
  { rank: 5, user: "Pierre Durand", role: "CUSTOMER", tier: "BRONZE", quantityIn: 356, transactions: 32, cost: 71200 }
]

const mockTopThroughputProducts = [
  { rank: 1, product: "FreePods 4 Pro", category: "Audio", totalThroughput: 1036, inQty: 580, outQty: 456, turnover: 4.2 },
  { rank: 2, product: "PowerMax 30K", category: "Power", totalThroughput: 1018, inQty: 620, outQty: 398, turnover: 3.8 },
  { rank: 3, product: "SoundWave Elite", category: "Audio", totalThroughput: 804, inQty: 480, outQty: 324, turnover: 3.1 },
  { rank: 4, product: "SmartWatch Ultra", category: "Smart Devices", totalThroughput: 672, inQty: 385, outQty: 287, turnover: 2.9 },
  { rank: 5, product: "Gaming Headset Pro", category: "Gaming", totalThroughput: 590, inQty: 345, outQty: 245, turnover: 2.4 }
]

const mockTopThroughputUsers = [
  { rank: 1, user: "Marie Martin", tier: "GOLD", totalThroughput: 1012, inQty: 567, outQty: 445, transactions: 134 },
  { rank: 2, user: "Sophie Bernard", tier: "GOLD", totalThroughput: 887, inQty: 489, outQty: 398, transactions: 118 },
  { rank: 3, user: "Jean Dupont", tier: "SILVER", totalThroughput: 801, inQty: 445, outQty: 356, transactions: 105 },
  { rank: 4, user: "Luc Moreau", tier: "SILVER", totalThroughput: 687, inQty: 398, outQty: 289, transactions: 89 },
  { rank: 5, user: "Pierre Durand", tier: "BRONZE", totalThroughput: 601, inQty: 356, outQty: 245, transactions: 80 }
]

const mockStockAlerts = [
  { type: "low", product: "SmartWatch Ultra", currentStock: 98, threshold: 100, category: "Smart Devices" },
  { type: "low", product: "USB-C Hub Elite", currentStock: 67, threshold: 100, category: "Accessories" },
  { type: "low", product: "Gaming Controller Pro", currentStock: 23, threshold: 50, category: "Gaming" },
  { type: "stockout", product: "Wireless Charger Pad", currentStock: 0, threshold: 25, category: "Accessories" },
  { type: "stockout", product: "Bluetooth Speaker Mini", currentStock: 0, threshold: 30, category: "Audio" }
]

export default function StockAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState("2025-07-01")
  const [dateTo, setDateTo] = useState("2025-09-30")
  const [userFilter, setUserFilter] = useState("")
  const [productFilter, setProductFilter] = useState("")
  const [storeTier, setStoreTier] = useState("ALL")
  const [period, setPeriod] = useState("30d")

  const exportCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(",")
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(","))
    ].join("\n")

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
      case "GOLD": return "default"
      case "SILVER": return "secondary" 
      case "BRONZE": default: return "outline"
    }
  }

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case "GOLD": return "badge-gold"
      case "SILVER": return "badge-silver"
      case "BRONZE": return "badge-bronze"
      default: return ""
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Audio": return "bg-blue-500"
      case "Power": return "bg-green-500"
      case "Cables": return "bg-yellow-500"
      case "Accessories": return "bg-red-500"
      case "Smart Devices": return "bg-purple-500"
      case "Gaming": return "bg-cyan-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Stock Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Comprehensive inventory insights and stock management analytics</p>
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

          <div className="space-y-1">
            <Label htmlFor="user" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User Filter</Label>
            <Input
              id="user"
              className="w-[160px] h-10"
              placeholder="Filter by user"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {mockStockAlerts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{mockStockKPIs.lowStockItems} products</strong> are running low on stock and need attention.
            </AlertDescription>
          </Alert>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{mockStockKPIs.stockoutItems} products</strong> are currently out of stock.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Current Stock</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{mockStockKPIs.currentStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available units (IN - OUT)</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Purchases IN</CardTitle>
            <Warehouse className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{mockStockKPIs.purchasesIn.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(8.5)}
              <span className={`text-xs font-medium ${getTrendColor(8.5)}`}>
                +8.5% vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Sales OUT</CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{mockStockKPIs.salesOut.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(6.2)}
              <span className={`text-xs font-medium ${getTrendColor(6.2)}`}>
                +6.2% vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-700">Net Variation</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">+{mockStockKPIs.netVariation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">IN - OUT this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional KPIs Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-emerald-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-700">Points Issued</CardTitle>
            <Zap className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{mockStockKPIs.pointsIssued.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From IN movements</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-indigo-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-indigo-700">Total Movements</CardTitle>
            <Activity className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">{mockStockKPIs.totalMovements.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Transactions this period</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-rose-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-rose-700">Active Users</CardTitle>
            <Users className="h-5 w-5 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-900">{mockStockKPIs.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Users with movements</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-teal-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-teal-700">Active Products</CardTitle>
            <Target className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-900">{mockStockKPIs.activeProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Products with movements</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Level Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Stock Level Trends</CardTitle>
                <CardDescription>Stock levels, purchases, and sales evolution over time</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportCSV(mockStockTrends, "stock-trends")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={mockStockTrends}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="stockLevel" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStock)" name="Stock Level" />
                <Area type="monotone" dataKey="purchasesIn" stackId="2" stroke="#10b981" fillOpacity={1} fill="url(#colorPurchases)" name="Purchases IN" />
                <Line type="monotone" dataKey="salesOut" stroke="#ef4444" strokeWidth={3} name="Sales OUT" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Weekly Activity Pattern</CardTitle>
            <CardDescription>Movements, users, and products activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockActivityMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" />
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
                <Bar dataKey="movements" fill="#3b82f6" name="Movements" radius={[4, 4, 0, 0]} />
                <Bar dataKey="users" fill="#10b981" name="Active Users" radius={[4, 4, 0, 0]} />
                <Bar dataKey="products" fill="#f59e0b" name="Active Products" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Stock Status Distribution</CardTitle>
            <CardDescription>Current stock status across all products</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockStockDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? ((percent as number) * 100).toFixed(1) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockStockDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Stock Alerts</CardTitle>
          <CardDescription>Products requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStockAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                alert.type === 'stockout' ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
              }`}>
                <div className="flex items-center gap-3">
                  {alert.type === 'stockout' ? (
                    <PackageX className="h-5 w-5 text-red-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  )}
                  <div>
                    <h4 className="font-semibold">{alert.product}</h4>
                    <p className="text-sm text-muted-foreground">{alert.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    alert.type === 'stockout' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {alert.currentStock} units
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Threshold: {alert.threshold}
                  </div>
                </div>
              </div>
            )).slice(0, 10)}
          </div>
        </CardContent>
      </Card>

      {/* Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Stock Performance Rankings</CardTitle>
          <CardDescription>Top performers across different stock metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products-sold" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="products-sold" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Products Sold
              </TabsTrigger>
              <TabsTrigger value="products-purchased" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products IN
              </TabsTrigger>
              <TabsTrigger value="users-sales" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users Sales
              </TabsTrigger>
              <TabsTrigger value="users-purchases" className="flex items-center gap-2">
                <Warehouse className="h-4 w-4" />
                Users Purchases
              </TabsTrigger>
              <TabsTrigger value="throughput" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Throughput
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products-sold" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Products by Sales OUT</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity OUT</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Stock Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopProductsSold.map((product) => (
                    <TableRow key={product.rank} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge 
                          variant={product.rank <= 3 ? "default" : "outline"} 
                          className={`w-8 h-8 p-0 flex items-center justify-center ${
                            product.rank === 1 ? "bg-yellow-500 text-yellow-900" : 
                            product.rank === 2 ? "bg-gray-400 text-gray-900" : 
                            product.rank === 3 ? "bg-orange-600 text-white" : ""
                          }`}
                        >
                          {product.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.product}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-purple-600">{product.quantityOut}</TableCell>
                      <TableCell className="font-bold">${product.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${product.stockRemaining < 100 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.stockRemaining}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="products-purchased" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Products by Purchases IN</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity IN</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Stock Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopProductsPurchased.map((product) => (
                    <TableRow key={product.rank} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge 
                          variant={product.rank <= 3 ? "default" : "outline"} 
                          className={`w-8 h-8 p-0 flex items-center justify-center ${
                            product.rank === 1 ? "bg-yellow-500 text-yellow-900" : 
                            product.rank === 2 ? "bg-gray-400 text-gray-900" : 
                            product.rank === 3 ? "bg-orange-600 text-white" : ""
                          }`}
                        >
                          {product.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.product}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">{product.quantityIn}</TableCell>
                      <TableCell className="font-bold">${product.cost.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{product.stockLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="users-sales" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Users by Sales Volume</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Quantity OUT</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersSales.map((user) => (
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
                          className={`text-xs ${user.tier === 'GOLD' ? 'badge-gold' : user.tier === 'SILVER' ? 'badge-silver' : 'badge-bronze'}`}
                        >
                          {user.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-purple-600">{user.quantityOut}</TableCell>
                      <TableCell>{user.transactions}</TableCell>
                      <TableCell className="font-bold">${user.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="users-purchases" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Users by Purchase Volume</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Quantity IN</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersPurchases.map((user) => (
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
                          className={`text-xs ${user.tier === 'GOLD' ? 'badge-gold' : user.tier === 'SILVER' ? 'badge-silver' : 'badge-bronze'}`}
                        >
                          {user.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">{user.quantityIn}</TableCell>
                      <TableCell>{user.transactions}</TableCell>
                      <TableCell className="font-bold">${user.cost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="throughput" className="mt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Top Products by Throughput (IN + OUT)</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Total Throughput</TableHead>
                        <TableHead>IN Quantity</TableHead>
                        <TableHead>OUT Quantity</TableHead>
                        <TableHead>Turnover</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTopThroughputProducts.map((product) => (
                        <TableRow key={product.rank} className="hover:bg-muted/50">
                          <TableCell>
                            <Badge 
                              variant={product.rank <= 3 ? "default" : "outline"} 
                              className={`w-8 h-8 p-0 flex items-center justify-center ${
                                product.rank === 1 ? "bg-yellow-500 text-yellow-900" : 
                                product.rank === 2 ? "bg-gray-400 text-gray-900" : 
                                product.rank === 3 ? "bg-orange-600 text-white" : ""
                              }`}
                            >
                              {product.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{product.product}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-blue-600">{product.totalThroughput}</TableCell>
                          <TableCell className="text-green-600">{product.inQty}</TableCell>
                          <TableCell className="text-purple-600">{product.outQty}</TableCell>
                          <TableCell className="font-medium">{product.turnover}x</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Top Users by Throughput (IN + OUT)</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Total Throughput</TableHead>
                        <TableHead>IN Quantity</TableHead>
                        <TableHead>OUT Quantity</TableHead>
                        <TableHead>Transactions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTopThroughputUsers.map((user) => (
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
                              className={`text-xs ${user.tier === 'GOLD' ? 'badge-gold' : user.tier === 'SILVER' ? 'badge-silver' : 'badge-bronze'}`}
                            >
                              {user.tier}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-blue-600">{user.totalThroughput}</TableCell>
                          <TableCell className="text-green-600">{user.inQty}</TableCell>
                          <TableCell className="text-purple-600">{user.outQty}</TableCell>
                          <TableCell>{user.transactions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
