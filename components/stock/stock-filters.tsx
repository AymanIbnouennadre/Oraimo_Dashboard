"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X, Search, Calendar, Package, User, RefreshCw, TrendingUp, DollarSign, Hash } from "lucide-react"

interface StockFiltersProps {
  onFiltersChange: (filters: any) => void
}

interface FilterValues {
  movementType?: "Purchase" | "Sale"
  createdFrom?: string
  createdTo?: string
  minPrice?: number
  maxPrice?: number
  minQuantity?: number
  maxQuantity?: number
  modelLike?: string
  detectionId?: number
  userNameLike?: string
}

export function StockFilters({ onFiltersChange }: StockFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({})

  const handleFilterChange = (key: keyof FilterValues, value: string | number | undefined) => {
    const newFilters = { ...filters }
    
    if (value === "" || value === undefined || value === "ALL") {
      delete newFilters[key]
    } else {
      if (key === 'detectionId' || key === 'minPrice' || key === 'maxPrice' || key === 'minQuantity' || key === 'maxQuantity') {
        newFilters[key] = Number(value)
      } else {
        newFilters[key] = value as any
      }
    }
    
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const removeFilter = (key: keyof FilterValues) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const getActiveFilters = () => {
    const active: Array<{ key: keyof FilterValues; label: string; value: any }> = []
    
    if (filters.userNameLike) {
      active.push({ key: "userNameLike", label: "User", value: filters.userNameLike })
    }
    if (filters.movementType) {
      active.push({ key: "movementType", label: "Type", value: filters.movementType })
    }
    if (filters.modelLike) {
      active.push({ key: "modelLike", label: "Product Model", value: filters.modelLike })
    }
    if (filters.detectionId) {
      active.push({ key: "detectionId", label: "Detection", value: `#${filters.detectionId}` })
    }
    if (filters.minPrice) {
      active.push({ key: "minPrice", label: "Min Price", value: `$${filters.minPrice}` })
    }
    if (filters.maxPrice) {
      active.push({ key: "maxPrice", label: "Max Price", value: `$${filters.maxPrice}` })
    }
    if (filters.minQuantity) {
      active.push({ key: "minQuantity", label: "Min Qty", value: filters.minQuantity })
    }
    if (filters.maxQuantity) {
      active.push({ key: "maxQuantity", label: "Max Qty", value: filters.maxQuantity })
    }
    if (filters.createdFrom) {
      active.push({ key: "createdFrom", label: "From", value: new Date(filters.createdFrom).toLocaleDateString() })
    }
    if (filters.createdTo) {
      active.push({ key: "createdTo", label: "To", value: new Date(filters.createdTo).toLocaleDateString() })
    }
    
    return active
  }

  const activeFilters = getActiveFilters()
  const hasActiveFilters = activeFilters.length > 0

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Première ligne de filtres */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* User Search */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <User className="inline h-3 w-3 mr-1" />
              User Search
            </Label>
            <Input
              placeholder="User name or phone..."
              className="h-9"
              value={filters.userNameLike || ""}
              onChange={(e) => handleFilterChange("userNameLike", e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Movement Type
            </Label>
            <Select 
              value={filters.movementType || "ALL"} 
              onValueChange={(value) => handleFilterChange("movementType", value === "ALL" ? undefined : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Detection ID */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Hash className="inline h-3 w-3 mr-1" />
              Detection ID
            </Label>
            <Input
              type="number"
              placeholder="Detection ID..."
              className="h-9"
              value={filters.detectionId || ""}
              onChange={(e) => handleFilterChange("detectionId", e.target.value)}
            />
          </div>

          {/* Model Search */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Search className="inline h-3 w-3 mr-1" />
              Model Like
            </Label>
            <Input
              placeholder="Model search..."
              className="h-9"
              value={filters.modelLike || ""}
              onChange={(e) => handleFilterChange("modelLike", e.target.value)}
            />
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <DollarSign className="inline h-3 w-3 mr-1" />
              Min Price
            </Label>
            <Input
              type="number"
              placeholder="0.00"
              className="h-9"
              min="0"
              step="0.01"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
          </div>
        </div>

        {/* Deuxième ligne de filtres */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Max Price */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Max Price
            </Label>
            <Input
              type="number"
              placeholder="9999.99"
              className="h-9"
              min="0"
              step="0.01"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>

          {/* Min Quantity */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Min Quantity
            </Label>
            <Input
              type="number"
              placeholder="0"
              className="h-9"
              min="0"
              value={filters.minQuantity || ""}
              onChange={(e) => handleFilterChange("minQuantity", e.target.value)}
            />
          </div>

          {/* Max Quantity */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Max Quantity
            </Label>
            <Input
              type="number"
              placeholder="999999"
              className="h-9"
              min="0"
              value={filters.maxQuantity || ""}
              onChange={(e) => handleFilterChange("maxQuantity", e.target.value)}
            />
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Calendar className="inline h-3 w-3 mr-1" />
              Created From
            </Label>
            <Input
              type="datetime-local"
              className="h-9"
              value={filters.createdFrom || ""}
              onChange={(e) => handleFilterChange("createdFrom", e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Created To
            </Label>
            <Input
              type="datetime-local"
              className="h-9"
              value={filters.createdTo || ""}
              onChange={(e) => handleFilterChange("createdTo", e.target.value)}
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <Filter className="inline h-3 w-3 mr-1" />
                Active Filters ({activeFilters.length})
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-3 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(({ key, label, value }) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-default"
                >
                  <span className="font-medium">{label}:</span>
                  <span className="ml-1">{value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(key)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-blue-200 text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}