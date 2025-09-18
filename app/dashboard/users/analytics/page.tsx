"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Users, UserPlus, Activity, UserCheck, Download, TrendingUp } from "lucide-react"
import { SectionTabs } from "@/components/layout/section-tabs"
import type { User } from "@/lib/types"
import { formatPoints } from "@/lib/utils"

import mockUsersData from "@/lib/mocks/users.json"

// Mock analytics data
const mockChartData = [
  { date: "01/01", new: 12, active: 45 },
  { date: "02/01", new: 8, active: 52 },
  { date: "03/01", new: 15, active: 48 },
  { date: "04/01", new: 10, active: 61 },
  { date: "05/01", new: 18, active: 55 },
  { date: "06/01", new: 14, active: 67 },
  { date: "07/01", new: 22, active: 72 },
]

const mockTopUsers = [
  { user: "Sophie Bernard", points: 3200, salesQty: 45, lastActivity: "2024-01-15T12:00:00Z" },
  { user: "Jean Dupont", points: 2500, salesQty: 38, lastActivity: "2024-01-15T10:30:00Z" },
  { user: "Marie Martin", points: 1200, salesQty: 22, lastActivity: "2024-01-14T16:45:00Z" },
  { user: "Luc Moreau", points: 890, salesQty: 18, lastActivity: "2024-01-13T14:20:00Z" },
  { user: "Pierre Durand", points: 450, salesQty: 12, lastActivity: "2024-01-10T08:15:00Z" },
]

export default function UsersAnalyticsPage() {
  const [users] = useState<User[]>(mockUsersData as User[])
  const [period, setPeriod] = useState("7d")

  // Calculate KPIs
  const totalUsers = users.length
  const enabledUsers = users.filter((u) => u.enabled).length
  const disabledUsers = totalUsers - enabledUsers
  const newUsers = Math.floor(totalUsers * 0.15) // Mock: 15% are new
  const activeUsers = Math.floor(totalUsers * 0.65) // Mock: 65% are active

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const exportCSV = () => {
    const csvContent = [
      ["User", "Points", "Sales (Qty)", "Last Activity"],
      ...mockTopUsers.map((user) => [
        user.user,
        user.points.toString(),
        user.salesQty.toString(),
        formatDate(user.lastActivity),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "top-users-analytics.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
          <p className="text-muted-foreground">Detailed analysis of user activity</p>
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
      <SectionTabs section="users" />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newUsers}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% vs previous period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8% vs previous period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enabled</span>
                <Badge variant="default">{enabledUsers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Disabled</span>
                <Badge variant="destructive">{disabledUsers}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Evolution</CardTitle>
          <CardDescription>New users vs active users</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="new" stroke="hsl(var(--primary))" strokeWidth={2} name="New" />
              <Line type="monotone" dataKey="active" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Active" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top 10 Customers by Points</CardTitle>
              <CardDescription>Ranking of most active users</CardDescription>
            </div>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Sales (Qty)</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTopUsers.map((user, index) => (
                <TableRow key={user.user}>
                  <TableCell>
                    <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{user.user}</TableCell>
                  <TableCell>{formatPoints(user.points)}</TableCell>
                  <TableCell>{user.salesQty}</TableCell>
                  <TableCell>{formatDate(user.lastActivity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
