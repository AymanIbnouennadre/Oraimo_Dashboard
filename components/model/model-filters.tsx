"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Filter, 
  X, 
  Search, 
  Calendar, 
  Package, 
  User, 
  Target, 
  RefreshCw, 
  CheckCircle,
  XCircle,
  Phone,
  TrendingUp
} from "lucide-react"
import { ModelHistoryFilters } from "@/lib/services/model-history-service"

interface ModelFiltersProps {
  onFiltersChange: (filters: ModelHistoryFilters) => void
  onSearch: () => void
  isLoading?: boolean
}

export function ModelFilters({ 
  onFiltersChange, 
  onSearch,
  isLoading = false 
}: ModelFiltersProps) {
  const [filters, setFilters] = React.useState<ModelHistoryFilters>({
    userId: undefined,
    productId: undefined,
    success: undefined,
    userPhone: "",
    productModel: "",
    confidenceMin: undefined,
    confidenceMax: undefined,
    createdFrom: "",
    createdTo: ""
  })

  const [activeFiltersCount, setActiveFiltersCount] = React.useState(0)

  const updateFilters = (newFilters: Partial<ModelHistoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Count active filters
    const count = Object.values(updatedFilters).filter(value => {
      if (typeof value === 'string') return value.trim() !== ''
      if (typeof value === 'number') return value !== undefined
      if (typeof value === 'boolean') return value !== undefined
      return false
    }).length
    
    setActiveFiltersCount(count)
    onFiltersChange(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: ModelHistoryFilters = {
      userId: undefined,
      productId: undefined,
      success: undefined,
      userPhone: "",
      productModel: "",
      confidenceMin: undefined,
      confidenceMax: undefined,
      createdFrom: "",
      createdTo: ""
    }
    setFilters(clearedFilters)
    setActiveFiltersCount(0)
    onFiltersChange(clearedFilters)
  }

  const handleSearch = () => {
    onSearch()
  }

  // Quick filter presets
  const quickFilters = [
    {
      name: "Successful Only",
      icon: CheckCircle,
      color: "bg-green-100 text-green-700 border-green-200",
      filters: { success: true }
    },
    {
      name: "Failed Only", 
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-200",
      filters: { success: false }
    },
    {
      name: "High Confidence",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      filters: { confidenceMin: 0.9 }
    },
    {
      name: "Today",
      icon: Calendar,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      filters: { createdFrom: new Date().toISOString().split('T')[0] }
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={activeFiltersCount === 0 || isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Filters */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((quickFilter) => (
              <Button
                key={quickFilter.name}
                variant="outline"
                size="sm"
                className={`${quickFilter.color} hover:opacity-80`}
                onClick={() => updateFilters(quickFilter.filters)}
                disabled={isLoading}
              >
                <quickFilter.icon className="w-4 h-4 mr-2" />
                {quickFilter.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User ID Filter */}
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-1" />
              User ID
            </Label>
            <Input
              id="userId"
              type="number"
              placeholder="e.g., 123"
              value={filters.userId || ""}
              onChange={(e) => updateFilters({ 
                userId: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              disabled={isLoading}
            />
          </div>

          {/* User Phone Filter */}
          <div className="space-y-2">
            <Label htmlFor="userPhone" className="text-sm font-medium flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              User Phone
            </Label>
            <Input
              id="userPhone"
              placeholder="e.g., 0600000001"
              value={filters.userPhone}
              onChange={(e) => updateFilters({ userPhone: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Product ID Filter */}
          <div className="space-y-2">
            <Label htmlFor="productId" className="text-sm font-medium flex items-center">
              <Package className="w-4 h-4 mr-1" />
              Product ID
            </Label>
            <Input
              id="productId"
              type="number"
              placeholder="e.g., 1"
              value={filters.productId || ""}
              onChange={(e) => updateFilters({ 
                productId: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              disabled={isLoading}
            />
          </div>

          {/* Product Model Filter */}
          <div className="space-y-2">
            <Label htmlFor="productModel" className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Product Model
            </Label>
            <Input
              id="productModel"
              placeholder="e.g., OTW-330S"
              value={filters.productModel}
              onChange={(e) => updateFilters({ productModel: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Success Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Detection Result
            </Label>
            <Select
              value={filters.success === undefined ? "all" : filters.success.toString()}
              onValueChange={(value) => updateFilters({ 
                success: value === "all" ? undefined : value === "true" 
              })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="true">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Success Only
                  </div>
                </SelectItem>
                <SelectItem value="false">
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                    Failed Only
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Confidence Min Filter */}
          <div className="space-y-2">
            <Label htmlFor="confidenceMin" className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Min Confidence
            </Label>
            <Select
              value={filters.confidenceMin?.toString() || "none"}
              onValueChange={(value) => updateFilters({ 
                confidenceMin: value === "none" ? undefined : parseFloat(value) 
              })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any Confidence</SelectItem>
                <SelectItem value="0.9">90%+ (Excellent)</SelectItem>
                <SelectItem value="0.8">80%+ (Very Good)</SelectItem>
                <SelectItem value="0.7">70%+ (Good)</SelectItem>
                <SelectItem value="0.6">60%+ (Fair)</SelectItem>
                <SelectItem value="0.5">50%+ (Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Confidence Max Filter */}
          <div className="space-y-2">
            <Label htmlFor="confidenceMax" className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Max Confidence
            </Label>
            <Select
              value={filters.confidenceMax?.toString() || "none"}
              onValueChange={(value) => updateFilters({ 
                confidenceMax: value === "none" ? undefined : parseFloat(value) 
              })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any Confidence</SelectItem>
                <SelectItem value="1.0">100%</SelectItem>
                <SelectItem value="0.9">90%</SelectItem>
                <SelectItem value="0.8">80%</SelectItem>
                <SelectItem value="0.7">70%</SelectItem>
                <SelectItem value="0.6">60%</SelectItem>
                <SelectItem value="0.5">50%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From Filter */}
          <div className="space-y-2">
            <Label htmlFor="createdFrom" className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Date From
            </Label>
            <Input
              id="createdFrom"
              type="date"
              value={filters.createdFrom}
              onChange={(e) => updateFilters({ createdFrom: e.target.value })}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.userId && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>User: {filters.userId}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ userId: undefined })}
                  />
                </Badge>
              )}
              {filters.userPhone && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>Phone: {filters.userPhone}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ userPhone: "" })}
                  />
                </Badge>
              )}
              {filters.productId && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Package className="w-3 h-3" />
                  <span>Product: {filters.productId}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ productId: undefined })}
                  />
                </Badge>
              )}
              {filters.productModel && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>Model: {filters.productModel}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ productModel: "" })}
                  />
                </Badge>
              )}
              {filters.success !== undefined && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  {filters.success ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-600" />
                  )}
                  <span>{filters.success ? "Success" : "Failed"}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ success: undefined })}
                  />
                </Badge>
              )}
              {filters.confidenceMin && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Min: {Math.round(filters.confidenceMin * 100)}%</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ confidenceMin: undefined })}
                  />
                </Badge>
              )}
              {filters.confidenceMax && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Max: {Math.round(filters.confidenceMax * 100)}%</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ confidenceMax: undefined })}
                  />
                </Badge>
              )}
              {filters.createdFrom && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>From: {filters.createdFrom}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => updateFilters({ createdFrom: "" })}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}