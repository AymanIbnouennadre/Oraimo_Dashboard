'use client'

import { useState } from "react"
import { 
  Calendar, 
  Brain, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  XCircle,
  Users,
  Package,
  Activity,
  Download,
  Trophy,
  AlertTriangle,
  Filter,
  Eye,
  Zap,
  BarChart3,
  Clock,
  Image
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts"

// Mock data for comprehensive model analytics - Realistic September 2025 data
const mockModelKPIs = {
  totalDetections: 24867,       // total AI detections performed
  successCount: 22956,          // successful detections
  failureCount: 1911,           // failed detections
  successRate: 92.31,           // success percentage
  avgConfidence: 87.4,          // average confidence score
  activeUsers: 342,             // distinct users using model
  activeProducts: 186,          // distinct products detected
  avgProcessingTime: 1.2        // average processing time in seconds
}
// Time series data for charts
const mockDetectionTrends = [
  { date: "2025-07-01", totalDetections: 820, successRate: 89.2, avgConfidence: 85.4 },
  { date: "2025-07-08", totalDetections: 945, successRate: 90.7, avgConfidence: 86.1 },
  { date: "2025-07-15", totalDetections: 876, successRate: 91.3, avgConfidence: 86.8 },
  { date: "2025-07-22", totalDetections: 1023, successRate: 88.9, avgConfidence: 85.9 },
  { date: "2025-07-29", totalDetections: 1156, successRate: 92.1, avgConfidence: 87.2 },
  { date: "2025-08-05", totalDetections: 1089, successRate: 91.8, avgConfidence: 86.9 },
  { date: "2025-08-12", totalDetections: 967, successRate: 90.4, avgConfidence: 86.5 },
  { date: "2025-08-19", totalDetections: 1245, successRate: 93.2, avgConfidence: 88.1 },
  { date: "2025-08-26", totalDetections: 1334, successRate: 92.7, avgConfidence: 87.8 },
  { date: "2025-09-02", totalDetections: 1456, successRate: 94.1, avgConfidence: 88.9 },
  { date: "2025-09-09", totalDetections: 1567, successRate: 93.8, avgConfidence: 88.7 },
  { date: "2025-09-16", totalDetections: 1389, successRate: 92.3, avgConfidence: 87.4 }
]

// Confidence score distribution
const mockConfidenceDistribution = [
  { range: "90-100%", count: 8945, color: "#10b981" },
  { range: "80-89%", count: 7823, color: "#3b82f6" },
  { range: "70-79%", count: 4567, color: "#f59e0b" },
  { range: "60-69%", count: 2234, color: "#f97316" },
  { range: "50-59%", count: 1098, color: "#ef4444" },
  { range: "<50%", count: 200, color: "#991b1b" }
]

// Top users by detections
const mockTopUsersByDetections = [
  { rank: 1, user: "Ahmed Benali", tier: "GOLD", detections: 567, successRate: 94.2, avgConfidence: 89.1 },
  { rank: 2, user: "Sarah Johnson", tier: "GOLD", detections: 489, successRate: 93.8, avgConfidence: 88.7 },
  { rank: 3, user: "Mohamed Alami", tier: "SILVER", detections: 423, successRate: 91.5, avgConfidence: 87.2 },
  { rank: 4, user: "Lisa Chen", tier: "GOLD", detections: 398, successRate: 95.1, avgConfidence: 90.3 },
  { rank: 5, user: "Omar Kabbaj", tier: "SILVER", detections: 356, successRate: 89.6, avgConfidence: 86.4 },
  { rank: 6, user: "Emma Wilson", tier: "BRONZE", detections: 298, successRate: 92.3, avgConfidence: 87.8 },
  { rank: 7, user: "Youssef Maroc", tier: "SILVER", detections: 276, successRate: 90.9, avgConfidence: 86.9 },
  { rank: 8, user: "Alex Rodriguez", tier: "BRONZE", detections: 245, successRate: 88.2, avgConfidence: 85.6 },
  { rank: 9, user: "Fatima Zahra", tier: "GOLD", detections: 223, successRate: 93.7, avgConfidence: 88.4 },
  { rank: 10, user: "David Park", tier: "BRONZE", detections: 198, successRate: 91.4, avgConfidence: 87.1 }
]

// Top users by success (minimum 50 detections)
const mockTopUsersBySuccess = [
  { rank: 1, user: "Lisa Chen", tier: "GOLD", detections: 398, successes: 378, successRate: 95.1, avgConfidence: 90.3 },
  { rank: 2, user: "Ahmed Benali", tier: "GOLD", detections: 567, successes: 534, successRate: 94.2, avgConfidence: 89.1 },
  { rank: 3, user: "Sarah Johnson", tier: "GOLD", detections: 489, successes: 459, successRate: 93.8, avgConfidence: 88.7 },
  { rank: 4, user: "Fatima Zahra", tier: "GOLD", detections: 223, successes: 209, successRate: 93.7, avgConfidence: 88.4 },
  { rank: 5, user: "Emma Wilson", tier: "BRONZE", detections: 298, successes: 275, successRate: 92.3, avgConfidence: 87.8 },
  { rank: 6, user: "Mohamed Alami", tier: "SILVER", detections: 423, successes: 387, successRate: 91.5, avgConfidence: 87.2 },
  { rank: 7, user: "David Park", tier: "BRONZE", detections: 198, successes: 181, successRate: 91.4, avgConfidence: 87.1 },
  { rank: 8, user: "Youssef Maroc", tier: "SILVER", detections: 276, successes: 251, successRate: 90.9, avgConfidence: 86.9 },
  { rank: 9, user: "Omar Kabbaj", tier: "SILVER", detections: 356, successes: 319, successRate: 89.6, avgConfidence: 86.4 },
  { rank: 10, user: "Alex Rodriguez", tier: "BRONZE", detections: 245, successes: 216, successRate: 88.2, avgConfidence: 85.6 }
]

// Top recognized products (highest success rate)
const mockTopRecognizedProducts = [
  { rank: 1, product: "FreePods Pro", category: "Earphones", detections: 1245, successes: 1201, successRate: 96.5, avgConfidence: 91.2 },
  { rank: 2, product: "Smart Watch Elite", category: "Wearables", detections: 892, successes: 856, successRate: 95.9, avgConfidence: 90.7 },
  { rank: 3, product: "Power Bank 20000", category: "Chargers", detections: 1156, successes: 1104, successRate: 95.5, avgConfidence: 89.8 },
  { rank: 4, product: "Wireless Charger", category: "Chargers", detections: 734, successes: 698, successRate: 95.1, avgConfidence: 89.4 },
  { rank: 5, product: "Gaming Headset", category: "Audio", detections: 567, successes: 538, successRate: 94.9, avgConfidence: 88.9 },
  { rank: 6, product: "Bluetooth Speaker", category: "Audio", detections: 823, successes: 777, successRate: 94.4, avgConfidence: 88.6 },
  { rank: 7, product: "USB-C Hub", category: "Accessories", detections: 445, successes: 419, successRate: 94.2, avgConfidence: 88.1 },
  { rank: 8, product: "FreeBuds Basic", category: "Earphones", detections: 689, successes: 648, successRate: 94.1, avgConfidence: 87.9 },
  { rank: 9, product: "Car Charger Pro", category: "Chargers", detections: 378, successes: 355, successRate: 93.9, avgConfidence: 87.5 },
  { rank: 10, product: "Phone Stand", category: "Accessories", detections: 298, successes: 279, successRate: 93.6, avgConfidence: 87.2 }
]

// Poorly recognized products (low success rate, minimum 100 detections)
const mockPoorlyRecognizedProducts = [
  { rank: 1, product: "Cable Organizer", category: "Accessories", detections: 234, successes: 187, successRate: 79.9, avgConfidence: 74.2 },
  { rank: 2, product: "Phone Grip", category: "Accessories", detections: 189, successes: 152, successRate: 80.4, avgConfidence: 75.1 },
  { rank: 3, product: "Screen Protector", category: "Protection", detections: 345, successes: 281, successRate: 81.4, avgConfidence: 76.3 },
  { rank: 4, product: "Memory Card", category: "Storage", detections: 156, successes: 128, successRate: 82.1, avgConfidence: 77.8 },
  { rank: 5, product: "USB Drive", category: "Storage", detections: 123, successes: 102, successRate: 82.9, avgConfidence: 78.4 },
  { rank: 6, product: "Phone Case", category: "Protection", detections: 267, successes: 223, successRate: 83.5, avgConfidence: 79.1 },
  { rank: 7, product: "Tablet Stand", category: "Accessories", detections: 198, successes: 166, successRate: 83.8, avgConfidence: 79.6 },
  { rank: 8, product: "Laptop Stand", category: "Accessories", detections: 145, successes: 123, successRate: 84.8, avgConfidence: 80.2 },
  { rank: 9, product: "Wireless Mouse", category: "Tech", detections: 112, successes: 96, successRate: 85.7, avgConfidence: 81.3 },
  { rank: 10, product: "Keyboard", category: "Tech", detections: 134, successes: 116, successRate: 86.6, avgConfidence: 82.1 }
]

// Recent detections table data
const mockRecentDetections = [
  { 
    id: "DET_2025091901", 
    created_at: "2025-09-19 14:32:15", 
    user: "Ahmed Benali", 
    product: "FreePods Pro", 
    confidence: 94.2, 
    success: true, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091902", 
    created_at: "2025-09-19 14:28:43", 
    user: "Sarah Johnson", 
    product: "Smart Watch Elite", 
    confidence: 91.7, 
    success: true, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091903", 
    created_at: "2025-09-19 14:25:12", 
    user: "Mohamed Alami", 
    product: "Power Bank 20000", 
    confidence: 89.3, 
    success: true, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091904", 
    created_at: "2025-09-19 14:21:56", 
    user: "Lisa Chen", 
    product: "Cable Organizer", 
    confidence: 67.4, 
    success: false, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091905", 
    created_at: "2025-09-19 14:18:27", 
    user: "Omar Kabbaj", 
    product: "Gaming Headset", 
    confidence: 92.8, 
    success: true, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091906", 
    created_at: "2025-09-19 14:15:03", 
    user: "Emma Wilson", 
    product: "Wireless Charger", 
    confidence: 88.6, 
    success: true, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091907", 
    created_at: "2025-09-19 14:12:41", 
    user: "Youssef Maroc", 
    product: "Phone Grip", 
    confidence: 72.1, 
    success: false, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091908", 
    created_at: "2025-09-19 14:09:18", 
    user: "Alex Rodriguez", 
    product: "Bluetooth Speaker", 
    confidence: 90.4, 
    success: true, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091909", 
    created_at: "2025-09-19 14:05:55", 
    user: "Fatima Zahra", 
    product: "USB-C Hub", 
    confidence: 86.7, 
    success: true, 
    image_url: "/placeholder.jpg" 
  },
  { 
    id: "DET_2025091910", 
    created_at: "2025-09-19 14:02:32", 
    user: "David Park", 
    product: "Screen Protector", 
    confidence: 75.8, 
    success: false, 
    image_url: "/placeholder.jpg" 
  }
]

export default function ModelAnalyticsPage() {
  const [period, setPeriod] = useState("30d")
  const [dateFrom, setDateFrom] = useState("2025-07-01")
  const [dateTo, setDateTo] = useState("2025-09-19")
  const [userFilter, setUserFilter] = useState("")
  const [productFilter, setProductFilter] = useState("")

  // Helper functions
  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'GOLD':
        return 'badge-gold'
      case 'SILVER':
        return 'badge-silver'
      case 'BRONZE':
        return 'badge-bronze'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Earphones': 'bg-blue-500',
      'Chargers': 'bg-green-500',
      'Audio': 'bg-purple-500',
      'Wearables': 'bg-pink-500',
      'Accessories': 'bg-orange-500',
      'Protection': 'bg-red-500',
      'Storage': 'bg-yellow-500',
      'Tech': 'bg-indigo-500',
      'Gaming': 'bg-teal-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const exportCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',')
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Model Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2">AI model performance insights and detection analytics</p>
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
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="user" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User Filter</Label>
            <Input 
              id="user"
              placeholder="Filter by user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-[160px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="product" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Filter</Label>
            <Input 
              id="product"
              placeholder="Filter by product..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-[160px] h-10"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Detections */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Detections</CardTitle>
            <Brain className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{mockModelKPIs.totalDetections.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">AI model usage</p>
          </CardContent>
        </Card>

        {/* Success Count */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Successful</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{mockModelKPIs.successCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Correct detections</p>
          </CardContent>
        </Card>

        {/* Failure Count */}
        <Card className="relative overflow-hidden border-l-4 border-l-red-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-red-700">Failed</CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">{mockModelKPIs.failureCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Incorrect detections</p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Success Rate</CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{mockModelKPIs.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Accuracy percentage</p>
          </CardContent>
        </Card>

        {/* Average Confidence */}
        <Card className="relative overflow-hidden border-l-4 border-l-amber-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-700">Avg Confidence</CardTitle>
            <Zap className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{mockModelKPIs.avgConfidence}%</div>
            <p className="text-xs text-muted-foreground mt-1">Average score</p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="relative overflow-hidden border-l-4 border-l-rose-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-rose-700">Active Users</CardTitle>
            <Users className="h-5 w-5 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-900">{mockModelKPIs.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Distinct users</p>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className="relative overflow-hidden border-l-4 border-l-teal-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-teal-700">Active Products</CardTitle>
            <Package className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-900">{mockModelKPIs.activeProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Detected products</p>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-700">Avg Processing Time</CardTitle>
            <Clock className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{mockModelKPIs.avgProcessingTime}s</div>
            <p className="text-xs text-muted-foreground mt-1">Per detection</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detection Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Detection Trends Over Time</CardTitle>
                <CardDescription>Total detections, success rate, and confidence evolution</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportCSV(mockDetectionTrends, "detection-trends")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={mockDetectionTrends}>
                <defs>
                  <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-muted-foreground"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalDetections"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDetections)"
                  name="Total Detections"
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Success Rate %"
                />
                <Line
                  type="monotone"
                  dataKey="avgConfidence"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  name="Avg Confidence %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Confidence Score Distribution</CardTitle>
            <CardDescription>Distribution of detection confidence ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockConfidenceDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="range" 
                  className="text-muted-foreground"
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Performance Rankings</CardTitle>
          <CardDescription>Top performers across different metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="top-users-detections" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="top-users-detections" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Users - Detections
              </TabsTrigger>
              <TabsTrigger value="top-users-success" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Users - Success
              </TabsTrigger>
              <TabsTrigger value="top-products" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Top Products
              </TabsTrigger>
              <TabsTrigger value="poor-products" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Poor Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="top-users-detections" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Users by Detection Count</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopUsersByDetections, "top-users-detections")}>
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
                    <TableHead>Detections</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersByDetections.map((user) => (
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
                        <Badge className={`text-xs ${getTierBadgeClass(user.tier)}`}>
                          {user.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">{user.detections}</TableCell>
                      <TableCell className="font-medium">{user.successRate}%</TableCell>
                      <TableCell className="font-medium">{user.avgConfidence}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="top-users-success" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Users by Success Rate (Min. 50 detections)</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopUsersBySuccess, "top-users-success")}>
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
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Successes</TableHead>
                    <TableHead>Total Detections</TableHead>
                    <TableHead>Avg Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopUsersBySuccess.map((user) => (
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
                        <Badge className={`text-xs ${getTierBadgeClass(user.tier)}`}>
                          {user.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">{user.successRate}%</TableCell>
                      <TableCell className="font-medium">{user.successes}</TableCell>
                      <TableCell>{user.detections}</TableCell>
                      <TableCell className="font-medium">{user.avgConfidence}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="top-products" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Best Recognized Products</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockTopRecognizedProducts, "top-recognized-products")}>
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
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Successes</TableHead>
                    <TableHead>Total Detections</TableHead>
                    <TableHead>Avg Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopRecognizedProducts.map((product) => (
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
                        <Badge variant="outline" className={`text-xs ${getCategoryBadgeColor(product.category)} text-white`}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">{product.successRate}%</TableCell>
                      <TableCell className="font-medium">{product.successes}</TableCell>
                      <TableCell>{product.detections}</TableCell>
                      <TableCell className="font-medium">{product.avgConfidence}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="poor-products" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Poorly Recognized Products (Min. 100 detections)</h3>
                <Button variant="outline" size="sm" onClick={() => exportCSV(mockPoorlyRecognizedProducts, "poorly-recognized-products")}>
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
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Successes</TableHead>
                    <TableHead>Total Detections</TableHead>
                    <TableHead>Avg Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPoorlyRecognizedProducts.map((product) => (
                    <TableRow key={product.rank} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
                          {product.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.product}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getCategoryBadgeColor(product.category)} text-white`}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-orange-600">{product.successRate}%</TableCell>
                      <TableCell className="font-medium">{product.successes}</TableCell>
                      <TableCell>{product.detections}</TableCell>
                      <TableCell className="font-medium">{product.avgConfidence}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Detections Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Detections</CardTitle>
              <CardDescription>Latest AI detection results with detailed information</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => exportCSV(mockRecentDetections, "recent-detections")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detection ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentDetections.map((detection) => (
                <TableRow key={detection.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{detection.id}</TableCell>
                  <TableCell className="text-sm">{detection.created_at}</TableCell>
                  <TableCell className="font-medium">{detection.user}</TableCell>
                  <TableCell className="font-medium">{detection.product}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      detection.confidence >= 90 ? 'text-green-600' : 
                      detection.confidence >= 80 ? 'text-blue-600' : 
                      detection.confidence >= 70 ? 'text-orange-600' : 
                      'text-red-600'
                    }`}>
                      {detection.confidence}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={detection.success ? "default" : "destructive"}
                      className={`gap-1 ${
                        detection.success
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {detection.success ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {detection.success ? 'Success' : 'Failed'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
