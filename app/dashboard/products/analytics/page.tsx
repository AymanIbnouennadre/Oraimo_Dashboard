"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend 
} from "recharts"
import { 
  Package, ShoppingCart, Award, TrendingUp, TrendingDown, Download, Filter,
  Calendar, Package2, DollarSign, Target, ArrowUpRight, ArrowDownRight, Zap,
  Trophy
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionTabs } from "@/components/layout/section-tabs"

// Mock data for products analytics - Realistic September 2025 data
const mockProductsKPIs = {
  totalProducts: 847,
  salesOut: 3450,  // units sold
  purchasesIn: 4120, // units purchased
  pointsIssued: 187500,
  estimatedRevenue: 892450,
  averagePrice: 258.68,
  stockTurnover: 2.3,
  profitMargin: 24.5
}

const mockProductsTrends = [
  { month: "Jul 2025", salesOut: 2980, purchasesIn: 3650, points: 165800, revenue: 756200 },
  { month: "Aug 2025", salesOut: 3210, purchasesIn: 3890, points: 178300, revenue: 823150 }, // summer boost
  { month: "Sep 2025", salesOut: 3450, purchasesIn: 4120, points: 187500, revenue: 892450 }  // back to school peak
]

const mockCategoryDistribution = [
  { category: "Audio", products: 187, salesOut: 1240, points: 82500, revenue: 298000, color: "#3b82f6" },
  { category: "Power", products: 156, salesOut: 890, points: 45600, revenue: 185400, color: "#10b981" },
  { category: "Cables", products: 234, salesOut: 765, points: 18900, revenue: 82300, color: "#f59e0b" },
  { category: "Accessories", products: 143, salesOut: 345, points: 24800, revenue: 156200, color: "#ef4444" },
  { category: "Smart Devices", products: 89, salesOut: 165, points: 12400, revenue: 145600, color: "#8b5cf6" },
  { category: "Gaming", products: 38, salesOut: 45, points: 3300, revenue: 24950, color: "#06b6d4" }
]

const mockTopSalesOut = [
  { rank: 1, name: "FreePods 4 Pro", category: "Audio", quantity: 345, points: 27600, revenue: 89700, growth: +18.5, trend: "up" },
  { rank: 2, name: "PowerMax 30K", category: "Power", quantity: 289, points: 23120, revenue: 72450, growth: +12.3, trend: "up" },
  { rank: 3, name: "SoundWave Elite", category: "Audio", quantity: 234, points: 35100, revenue: 116850, growth: +8.7, trend: "up" },
  { rank: 4, name: "SmartWatch Ultra", category: "Smart Devices", quantity: 187, points: 37400, revenue: 149600, growth: -2.1, trend: "down" },
  { rank: 5, name: "Gaming Headset Pro", category: "Gaming", quantity: 156, points: 18720, revenue: 62400, growth: +25.4, trend: "up" },
  { rank: 6, name: "USB-C Hub Elite", category: "Accessories", quantity: 143, points: 17160, revenue: 57200, growth: +5.8, trend: "up" },
  { rank: 7, name: "PowerBank Slim", category: "Power", quantity: 134, points: 10720, revenue: 33550, growth: -1.2, trend: "down" },
  { rank: 8, name: "Lightning Cable Pro", category: "Cables", quantity: 123, points: 3690, revenue: 12300, growth: +15.2, trend: "up" }
]

const mockTopPurchasesIn = [
  { rank: 1, name: "PowerMax 30K", category: "Power", quantity: 420, points: 33600, cost: 52500, margin: 27.5 },
  { rank: 2, name: "FreePods 4 Pro", category: "Audio", quantity: 380, points: 30400, cost: 57000, margin: 36.8 },
  { rank: 3, name: "SoundWave Elite", category: "Audio", quantity: 340, points: 51000, cost: 85000, margin: 27.3 },
  { rank: 4, name: "SmartWatch Ultra", category: "Smart Devices", quantity: 245, points: 49000, cost: 98000, margin: 34.5 },
  { rank: 5, name: "Gaming Headset Pro", category: "Gaming", quantity: 198, points: 23760, cost: 39600, margin: 36.4 },
  { rank: 6, name: "USB-C Hub Elite", category: "Accessories", quantity: 167, points: 20040, cost: 33400, margin: 41.5 },
  { rank: 7, name: "PowerBank Slim", category: "Power", quantity: 156, points: 12480, cost: 23400, margin: 30.2 },
  { rank: 8, name: "Lightning Cable Pro", category: "Cables", quantity: 145, points: 4350, cost: 7250, margin: 41.0 }
]

const mockTopByPoints = [
  { rank: 1, name: "SoundWave Elite", category: "Audio", points: 51000, salesRatio: 68.8, revenue: 116850 },
  { rank: 2, name: "SmartWatch Ultra", category: "Smart Devices", points: 49000, salesRatio: 76.3, revenue: 149600 },
  { rank: 3, name: "FreePods 4 Pro", category: "Audio", points: 30400, salesRatio: 90.8, revenue: 89700 },
  { rank: 4, name: "PowerMax 30K", category: "Power", points: 33600, salesRatio: 68.8, revenue: 72450 },
  { rank: 5, name: "Gaming Headset Pro", category: "Gaming", points: 23760, salesRatio: 78.8, revenue: 62400 },
  { rank: 6, name: "USB-C Hub Elite", category: "Accessories", points: 20040, salesRatio: 85.6, revenue: 57200 },
  { rank: 7, name: "PowerBank Slim", category: "Power", points: 12480, salesRatio: 85.9, revenue: 33550 },
  { rank: 8, name: "Lightning Cable Pro", category: "Cables", points: 4350, salesRatio: 84.8, revenue: 12300 }
]

const mockTopByRevenue = [
  { rank: 1, name: "SmartWatch Ultra", category: "Smart Devices", revenue: 149600, quantity: 187, avgPrice: 800, roi: 52.7 },
  { rank: 2, name: "SoundWave Elite", category: "Audio", revenue: 116850, quantity: 234, avgPrice: 499, roi: 37.5 },
  { rank: 3, name: "FreePods 4 Pro", category: "Audio", revenue: 89700, quantity: 345, avgPrice: 260, roi: 57.4 },
  { rank: 4, name: "PowerMax 30K", category: "Power", revenue: 72450, quantity: 289, avgPrice: 250, roi: 38.0 },
  { rank: 5, name: "Gaming Headset Pro", category: "Gaming", revenue: 62400, quantity: 156, avgPrice: 400, roi: 57.6 },
  { rank: 6, name: "USB-C Hub Elite", category: "Accessories", revenue: 57200, quantity: 143, avgPrice: 400, roi: 71.3 },
  { rank: 7, name: "PowerBank Slim", category: "Power", revenue: 33550, quantity: 134, avgPrice: 250, roi: 43.4 },
  { rank: 8, name: "Lightning Cable Pro", category: "Cables", revenue: 12300, quantity: 123, avgPrice: 100, roi: 69.7 }
]

export default function ProductsAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState("2025-07-01")
  const [dateTo, setDateTo] = useState("2025-09-30")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [productFilter, setProductFilter] = useState("")
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
            Product Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Comprehensive product performance and sales intelligence</p>
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
            <Label htmlFor="category" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="power">Power</SelectItem>
                <SelectItem value="cables">Cables</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="smart">Smart Devices</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="product" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product ID</Label>
            <Input
              id="product"
              className="w-[160px] h-10"
              placeholder="Filter by ID"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <SectionTabs section="products" />

      {/* Main KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Products</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{mockProductsKPIs.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Products catalogued</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Sales OUT</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{mockProductsKPIs.salesOut.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(7.5)}
              <span className={`text-xs font-medium ${getTrendColor(7.5)}`}>
                +7.5% vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Purchases IN</CardTitle>
            <Package2 className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{mockProductsKPIs.purchasesIn.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(5.9)}
              <span className={`text-xs font-medium ${getTrendColor(5.9)}`}>
                +5.9% vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-700">Points Issued</CardTitle>
            <Award className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{mockProductsKPIs.pointsIssued.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From IN movements</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional KPIs Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-emerald-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-700">Estimated Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">${mockProductsKPIs.estimatedRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Final customer price × OUT</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-indigo-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-indigo-700">Average Price</CardTitle>
            <Target className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">${mockProductsKPIs.averagePrice}</div>
            <p className="text-xs text-muted-foreground mt-1">Per unit sold</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-rose-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-rose-700">Stock Turnover</CardTitle>
            <TrendingUp className="h-5 w-5 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-900">{mockProductsKPIs.stockTurnover}x</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(0.3)}
              <span className={`text-xs font-medium ${getTrendColor(0.3)}`}>
                +0.3 vs last quarter
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-teal-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-teal-700">Profit Margin</CardTitle>
            <Zap className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-900">{mockProductsKPIs.profitMargin}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(1.2)}
              <span className={`text-xs font-medium ${getTrendColor(1.2)}`}>
                +1.2% vs last quarter
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Performance Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Product Performance Trends</CardTitle>
                <CardDescription>Sales, purchases, points, and revenue evolution over time</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportCSV(mockProductsTrends, "product-trends")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={mockProductsTrends}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="salesOut" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" name="Sales OUT" />
                <Area type="monotone" dataKey="purchasesIn" stackId="2" stroke="#10b981" fillOpacity={1} fill="url(#colorPurchases)" name="Purchases IN" />
                <Line type="monotone" dataKey="points" stroke="#f59e0b" strokeWidth={3} name="Points Issued" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Category Distribution</CardTitle>
            <CardDescription>Products and sales breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-4">Sales Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCategoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="salesOut"
                    >
                      {mockCategoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Category Details</h4>
                <div className="space-y-3">
                  {mockCategoryDistribution.map((category) => (
                    <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold">{category.salesOut} units</div>
                        <div className="text-muted-foreground">{category.products} products</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Product Rankings & Performance</CardTitle>
          <CardDescription>Top performing products across different metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales-out" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales-out" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                By Sales OUT
              </TabsTrigger>
              <TabsTrigger value="purchases-in" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                By Purchases IN
              </TabsTrigger>
              <TabsTrigger value="points" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                By Points
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                By Revenue
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales-out" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Products by Sales OUT</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopSalesOut, "top-sales-out")}>
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
                    <TableHead>Sales (Qty)</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopSalesOut.map((product) => (
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
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getCategoryBadgeColor(product.category)} text-white`}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">{product.quantity}</TableCell>
                      <TableCell>{product.points.toLocaleString()} pts</TableCell>
                      <TableCell className="font-bold">${product.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          {product.trend === "up" ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                          )}
                          <span className={product.trend === "up" ? "text-green-600" : "text-red-600"}>
                            {product.growth > 0 ? "+" : ""}{product.growth}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="purchases-in" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Products by Purchases IN</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopPurchasesIn, "top-purchases-in")}>
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
                    <TableHead>Purchases (Qty)</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopPurchasesIn.map((product) => (
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
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getCategoryBadgeColor(product.category)} text-white`}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-purple-600">{product.quantity}</TableCell>
                      <TableCell>{product.points.toLocaleString()} pts</TableCell>
                      <TableCell className="font-bold">${product.cost.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{product.margin}%</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="points" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Products by Points Issued</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopByPoints, "top-by-points")}>
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
                    <TableHead>Points</TableHead>
                    <TableHead>Sales Ratio</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopByPoints.map((product) => (
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
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getCategoryBadgeColor(product.category)} text-white`}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">{product.points.toLocaleString()} pts</TableCell>
                      <TableCell>{product.salesRatio}%</TableCell>
                      <TableCell className="font-bold">${product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Products by Estimated Revenue</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopByRevenue, "top-by-revenue")}>
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
                    <TableHead>Revenue</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopByRevenue.map((product) => (
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
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getCategoryBadgeColor(product.category)} text-white`}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-emerald-600">${product.revenue.toLocaleString()}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>${product.avgPrice}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{product.roi}%</span>
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
