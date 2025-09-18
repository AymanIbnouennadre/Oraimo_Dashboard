"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, ShoppingCart, Award, TrendingUp, Download } from "lucide-react"
import { SectionTabs } from "@/components/layout/section-tabs"
import type { Product } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

import mockProductsData from "@/lib/mocks/products.json"

// Mock analytics data
const mockTopProductsOut = [
  { name: "FreePods 3", quantity: 245, points: 29400, revenue: 14695 },
  { name: "PowerBank 20K", quantity: 189, points: 15120, revenue: 7551 },
  { name: "SoundGo Speaker", quantity: 156, points: 21840, revenue: 10919 },
  { name: "SmartWatch Pro", quantity: 134, points: 26800, revenue: 13399 },
  { name: "USB-C Cable", quantity: 98, points: 2940, revenue: 1469 },
]

const mockTopProductsByPoints = [
  { name: "SmartWatch Pro", points: 26800, quantity: 134 },
  { name: "FreePods 3", points: 29400, quantity: 245 },
  { name: "SoundGo Speaker", points: 21840, quantity: 156 },
  { name: "PowerBank 20K", points: 15120, quantity: 189 },
  { name: "USB-C Cable", points: 2940, quantity: 98 },
]

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export default function ProductsAnalyticsPage() {
  const [products] = useState<Product[]>(mockProductsData as Product[])
  const [period, setPeriod] = useState("30d")

  // Calculate KPIs
  const totalSalesOut = mockTopProductsOut.reduce((sum, p) => sum + p.quantity, 0)
  const totalPurchasesIn = Math.floor(totalSalesOut * 1.2) // Mock: 20% more purchases than sales
  const totalPointsIssued = mockTopProductsOut.reduce((sum, p) => sum + p.points, 0)
  const totalRevenue = mockTopProductsOut.reduce((sum, p) => sum + p.revenue, 0)

  // Category distribution
  const categoryDistribution = products.reduce(
    (acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryData = Object.entries(categoryDistribution).map(([category, count]) => ({
    name: category,
    value: count,
  }))

  const exportCSV = () => {
    const csvContent = [
      ["Product", "Quantity OUT", "Points", "Estimated Revenue"],
      ...mockTopProductsOut.map((product) => [
        product.name,
        product.quantity.toString(),
        product.points.toString(),
        product.revenue.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products-analytics.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Analytics</h1>
          <p className="text-muted-foreground">Performance and sales analysis</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Section Tabs */}
      <SectionTabs section="products" />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales OUT</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSalesOut}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +15% vs previous period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases IN</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchasesIn}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8% vs previous period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalPointsIssued)}</div>
            <p className="text-xs text-muted-foreground">Points distributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Estimated from sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Product distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products OUT */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products (OUT)</CardTitle>
            <CardDescription>Best selling products</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockTopProductsOut} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="quantity" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products by Points */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Products by Points</CardTitle>
              <CardDescription>Products generating the most points</CardDescription>
            </div>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTopProductsByPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="points" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
