"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, Package, TrendingUp, TrendingDown, Download } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mock analytics data
const mockKPIs = [
  {
    title: "Total IN",
    value: "225",
    change: "+15%",
    trend: "up" as const,
    icon: ArrowUpCircle,
    description: "Units received",
  },
  {
    title: "Total OUT",
    value: "8",
    change: "+8%",
    trend: "up" as const,
    icon: ArrowDownCircle,
    description: "Units shipped",
  },
  {
    title: "Current Stock",
    value: "217",
    change: "+7%",
    trend: "up" as const,
    icon: Package,
    description: "Available units",
  },
  {
    title: "Points Issued",
    value: "16,955",
    change: "+12%",
    trend: "up" as const,
    icon: TrendingUp,
    description: "Total points",
  },
]

const mockTrendData = [
  { date: "Jan 10", in: 0, out: 0 },
  { date: "Jan 11", in: 100, out: 3 },
  { date: "Jan 12", in: 20, out: 1 },
  { date: "Jan 13", in: 25, out: 1 },
  { date: "Jan 14", in: 30, out: 1 },
  { date: "Jan 15", in: 50, out: 2 },
]

const mockTopProducts = [
  { name: "Câble USB-C", inbound: 100, outbound: 3, net: 97 },
  { name: "Oraimo FreePods 3", inbound: 50, outbound: 2, net: 48 },
  { name: "PowerBank 20K", inbound: 30, outbound: 1, net: 29 },
  { name: "SoundGo Speaker", inbound: 25, outbound: 1, net: 24 },
  { name: "SmartWatch Pro", inbound: 20, outbound: 1, net: 19 },
]

const mockRecentMovements = [
  { id: "1", product: "Oraimo FreePods 3", type: "IN", quantity: 50, user: "Jean Dupont", date: "2024-01-15" },
  { id: "2", product: "Oraimo FreePods 3", type: "OUT", quantity: 2, user: "Sophie Bernard", date: "2024-01-15" },
  { id: "3", product: "PowerBank 20K", type: "IN", quantity: 30, user: "Jean Dupont", date: "2024-01-14" },
  { id: "4", product: "PowerBank 20K", type: "OUT", quantity: 1, user: "Marie Martin", date: "2024-01-14" },
  { id: "5", product: "SoundGo Speaker", type: "IN", quantity: 25, user: "Jean Dupont", date: "2024-01-13" },
]

export default function StockAnalyticsPage() {
  const exportData = () => {
    // TODO: Implement CSV export
    console.log("Exporting stock analytics data...")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Stock Analytics</h1>
          <p className="text-lg text-muted-foreground">Inventory insights and movement trends</p>
        </div>
        <Button onClick={exportData} variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* KPI Cards */}
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

      {/* Charts Row */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* IN vs OUT Trend */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-heading">IN vs OUT Trend</CardTitle>
            <CardDescription>Daily inventory movements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="in"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    name="IN"
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="out"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    name="OUT"
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products by Movement */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-heading">Top Products by Movement</CardTitle>
            <CardDescription>Products with highest inventory activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTopProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-muted-foreground" />
                  <YAxis dataKey="name" type="category" width={120} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="net" fill="hsl(var(--chart-1))" name="Net Stock" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements Table */}
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-heading">Recent Movements</CardTitle>
          <CardDescription>Latest inventory transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-4">
                  <Badge
                    variant={movement.type === "IN" ? "default" : "secondary"}
                    className={`gap-1 ${
                      movement.type === "IN"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-orange-100 text-orange-800 border-orange-200"
                    }`}
                  >
                    {movement.type === "IN" ? (
                      <ArrowUpCircle className="h-3 w-3" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3" />
                    )}
                    {movement.type}
                  </Badge>
                  <div>
                    <p className="font-medium text-foreground">{movement.product}</p>
                    <p className="text-sm text-muted-foreground">
                      {movement.quantity} units • {movement.user}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
