"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, TrendingUp, TrendingDown, CheckCircle, XCircle, Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock analytics data
const mockKPIs = [
  {
    title: "Total Detections",
    value: "8,921",
    change: "+18%",
    trend: "up" as const,
    icon: Brain,
    description: "All time detections",
  },
  {
    title: "Success Rate",
    value: "92.3%",
    change: "+2.1%",
    trend: "up" as const,
    icon: Target,
    description: "Successful detections",
  },
  {
    title: "Avg Confidence",
    value: "87.4%",
    change: "+1.5%",
    trend: "up" as const,
    icon: TrendingUp,
    description: "Average confidence score",
  },
  {
    title: "Model Versions",
    value: "3",
    change: "0%",
    trend: "neutral" as const,
    icon: CheckCircle,
    description: "Active model versions",
  },
]

const mockSuccessRateData = [
  { date: "Jan 09", success: 88, failed: 12 },
  { date: "Jan 10", success: 91, failed: 9 },
  { date: "Jan 11", success: 89, failed: 11 },
  { date: "Jan 12", success: 94, failed: 6 },
  { date: "Jan 13", success: 92, failed: 8 },
  { date: "Jan 14", success: 95, failed: 5 },
  { date: "Jan 15", success: 93, failed: 7 },
]

const mockConfidenceData = [
  { range: "90-100%", count: 45, color: "#10b981" },
  { range: "80-89%", count: 28, color: "#3b82f6" },
  { range: "70-79%", count: 15, color: "#f59e0b" },
  { range: "60-69%", count: 8, color: "#ef4444" },
  { range: "0-59%", count: 4, color: "#6b7280" },
]

const mockTopModels = [
  { version: "v2.1.0", detections: 45, success_rate: 95.6, avg_confidence: 0.91 },
  { version: "v2.0.5", detections: 32, success_rate: 87.5, avg_confidence: 0.84 },
  { version: "v1.9.2", detections: 23, success_rate: 91.3, avg_confidence: 0.88 },
]

const mockRecentDetections = [
  {
    id: "det_001",
    product: "Oraimo FreePods 3",
    user: "Sophie Bernard",
    confidence: 0.95,
    success: true,
    date: "2024-01-15",
  },
  {
    id: "det_002",
    product: "PowerBank 20K",
    user: "Marie Martin",
    confidence: 0.88,
    success: true,
    date: "2024-01-14",
  },
  {
    id: "det_003",
    product: "SoundGo Speaker",
    user: "Luc Moreau",
    confidence: 0.92,
    success: true,
    date: "2024-01-13",
  },
  {
    id: "det_004",
    product: "SmartWatch Pro",
    user: "Sophie Bernard",
    confidence: 0.97,
    success: true,
    date: "2024-01-12",
  },
  {
    id: "det_006",
    product: "Oraimo FreePods 3",
    user: "Pierre Durand",
    confidence: 0.45,
    success: false,
    date: "2024-01-11",
  },
]

export default function ModelAnalyticsPage() {
  const exportData = () => {
    console.log("Exporting model analytics data...")
  }

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Model Analytics</h1>
          <p className="text-lg text-muted-foreground">AI model performance insights and detection trends</p>
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
                ) : kpi.trend === "down" ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span
                  className={
                    kpi.trend === "up"
                      ? "text-emerald-600 font-medium"
                      : kpi.trend === "down"
                        ? "text-red-600 font-medium"
                        : "text-muted-foreground font-medium"
                  }
                >
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
        {/* Success Rate Trend */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-heading">Success Rate Trend</CardTitle>
            <CardDescription>Daily detection success vs failure rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSuccessRateData}>
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
                    dataKey="success"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    name="Success %"
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={3}
                    name="Failed %"
                    dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-heading">Confidence Distribution</CardTitle>
            <CardDescription>Detection confidence score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockConfidenceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ range, count }) => `${range}: ${count}`}
                  >
                    {mockConfidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance & Recent Detections */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Model Versions */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-heading">Model Performance</CardTitle>
            <CardDescription>Performance metrics by model version</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopModels.map((model, index) => (
                <div key={model.version} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 p-0 flex items-center justify-center font-medium bg-primary/10 border-primary/20"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground font-mono">{model.version}</p>
                      <p className="text-sm text-muted-foreground">{model.detections} detections</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-foreground">{model.success_rate}% success</p>
                    <p className="text-sm text-muted-foreground">{formatConfidence(model.avg_confidence)} avg</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Detections */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-heading">Recent Detections</CardTitle>
            <CardDescription>Latest AI detection results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentDetections.map((detection) => (
                <div key={detection.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={detection.success ? "default" : "destructive"}
                      className={`gap-1 ${
                        detection.success
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {detection.success ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {formatConfidence(detection.confidence)}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{detection.product}</p>
                      <p className="text-sm text-muted-foreground">{detection.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{detection.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
