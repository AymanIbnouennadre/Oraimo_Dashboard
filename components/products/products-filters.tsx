"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import type { ProductFilter } from "@/lib/types"

interface ProductsFiltersProps {
  filters: ProductFilter
  onFiltersChange: (filters: ProductFilter) => void
  onReset: () => void
}

export function ProductsFilters({ filters, onFiltersChange, onReset }: ProductsFiltersProps) {
  const updateFilter = (key: keyof ProductFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== "" && value !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Name, model, class label..."
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => updateFilter("category", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Chargeurs">Chargers</SelectItem>
                <SelectItem value="Accessoires">Accessories</SelectItem>
                <SelectItem value="Wearables">Wearables</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min Price (MAD)</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              value={filters.minPrice || ""}
              onChange={(e) =>
                updateFilter("minPrice", e.target.value ? Number.parseFloat(e.target.value) : undefined)
              }
            />
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Price (MAD)</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="1000"
              min="0"
              step="0.01"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                updateFilter("maxPrice", e.target.value ? Number.parseFloat(e.target.value) : undefined)
              }
            />
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            {hasActiveFilters && (
              <Button variant="outline" onClick={onReset} size="sm" className="w-full bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
