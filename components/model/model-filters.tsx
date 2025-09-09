"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, X, Search, Calendar, Package, User, Brain, Target } from "lucide-react"

interface ModelFiltersProps {
  onFiltersChange: (filters: any) => void
  products: Array<{ id: string; marketing_name: string }>
  users: Array<{ id: string; name: string }>
  modelVersions: string[]
}

export function ModelFilters({ onFiltersChange, products, users, modelVersions }: ModelFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    success: "ALL",
    product_id: "ALL",
    user_id: "ALL",
    model_version: "ALL",
    min_confidence: "",
    max_confidence: "",
    date_from: "",
    date_to: "",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)

    // Update active filters
    const active = Object.entries(newFilters)
      .filter(([_, v]) => v !== "" && v !== "ALL")
      .map(([k, _]) => k)
    setActiveFilters(active)
  }

  const clearFilter = (key: string) => {
    const defaultValue =
      key === "success" || key === "product_id" || key === "user_id" || key === "model_version" ? "ALL" : ""
    handleFilterChange(key, defaultValue)
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      search: "",
      success: "ALL",
      product_id: "ALL",
      user_id: "ALL",
      model_version: "ALL",
      min_confidence: "",
      max_confidence: "",
      date_from: "",
      date_to: "",
    }
    setFilters(emptyFilters)
    setActiveFilters([])
    onFiltersChange(emptyFilters)
  }

  return (
    <Card className="border-0 shadow-sm bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-heading">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search detections..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Success Status</Label>
            <Select value={filters.success} onValueChange={(value) => handleFilterChange("success", value)}>
              <SelectTrigger>
                <Target className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="true">Successful</SelectItem>
                <SelectItem value="false">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Product</Label>
            <Select value={filters.product_id} onValueChange={(value) => handleFilterChange("product_id", value)}>
              <SelectTrigger>
                <Package className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.marketing_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">User</Label>
            <Select value={filters.user_id} onValueChange={(value) => handleFilterChange("user_id", value)}>
              <SelectTrigger>
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Model Version</Label>
            <Select value={filters.model_version} onValueChange={(value) => handleFilterChange("model_version", value)}>
              <SelectTrigger>
                <Brain className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All versions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All versions</SelectItem>
                {modelVersions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_confidence" className="text-sm font-medium">
              Min Confidence
            </Label>
            <Input
              id="min_confidence"
              type="number"
              min="0"
              max="1"
              step="0.01"
              placeholder="0.0"
              value={filters.min_confidence}
              onChange={(e) => handleFilterChange("min_confidence", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_confidence" className="text-sm font-medium">
              Max Confidence
            </Label>
            <Input
              id="max_confidence"
              type="number"
              min="0"
              max="1"
              step="0.01"
              placeholder="1.0"
              value={filters.max_confidence}
              onChange={(e) => handleFilterChange("max_confidence", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_from" className="text-sm font-medium">
              From Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="date_from"
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange("date_from", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {activeFilters.map((filterKey) => (
              <Badge key={filterKey} variant="secondary" className="gap-1">
                {filterKey.replace("_", " ")}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => clearFilter(filterKey)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
