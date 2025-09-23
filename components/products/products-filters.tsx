"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, SortAsc, Group, RefreshCw } from "lucide-react"
import type { ProductFilter } from "@/lib/types"

interface ProductsFiltersProps {
  filters: ProductFilter
  onFiltersChange: (filters: ProductFilter) => void
  onReset: () => void
}

// Vraies catégories basées sur le JSON des produits
const CATEGORIES = [
  "Charger",
  "Cable", 
  "Smart Watch",
  "TWS",
  "Earphone",
  "Head phone"
]

const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "points", label: "Points (High to Low)" },
  { value: "created", label: "Newest First" }
]

const GROUP_OPTIONS = [
  { value: "none", label: "No Grouping" },
  { value: "category", label: "By Category" },
  { value: "price_range", label: "By Price Range" }
]

export function ProductsFilters({ filters, onFiltersChange, onReset }: ProductsFiltersProps) {
  const updateFilter = (key: keyof ProductFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const removeFilter = (key: keyof ProductFilter) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const getActiveFilters = () => {
    const active: Array<{ key: keyof ProductFilter; label: string; value: any }> = []
    
    if (filters.search) {
      active.push({ key: "search", label: "Search", value: filters.search })
    }
    if (filters.category) {
      active.push({ key: "category", label: "Category", value: filters.category })
    }
    if (filters.minPrice !== undefined) {
      active.push({ key: "minPrice", label: "Min Price", value: `${filters.minPrice} MAD` })
    }
    if (filters.maxPrice !== undefined) {
      active.push({ key: "maxPrice", label: "Max Price", value: `${filters.maxPrice} MAD` })
    }
    if (filters.sortBy && filters.sortBy !== "name") {
      const sortLabel = SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label
      active.push({ key: "sortBy", label: "Sort", value: sortLabel })
    }
    if (filters.groupBy && filters.groupBy !== "none") {
      const groupLabel = GROUP_OPTIONS.find(opt => opt.value === filters.groupBy)?.label
      active.push({ key: "groupBy", label: "Group", value: groupLabel })
    }
    
    return active
  }

  const activeFilters = getActiveFilters()
  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className="space-y-4">
      {/* Main Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Name, model, class..."
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Category
          </Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => updateFilter("category", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Price */}
        <div className="space-y-2">
          <Label htmlFor="minPrice" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Min Price (MAD)
          </Label>
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
            className="h-10"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-2">
          <Label htmlFor="maxPrice" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Max Price (MAD)
          </Label>
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
            className="h-10"
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <SortAsc className="inline h-3 w-3 mr-1" />
            Sort By
          </Label>
          <Select
            value={filters.sortBy || "name"}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Group By */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Group className="inline h-3 w-3 mr-1" />
            Group By
          </Label>
          <Select
            value={filters.groupBy || "none"}
            onValueChange={(value) => updateFilter("groupBy", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GROUP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters History */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Filter className="inline h-3 w-3 mr-1" />
              Active Filters ({activeFilters.length})
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
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
    </div>
  )
}
