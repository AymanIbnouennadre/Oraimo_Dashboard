"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import type { UserFilter } from "@/lib/types"

interface UsersFiltersProps {
  filters: UserFilter
  onFiltersChange: (filters: UserFilter) => void
  onReset: () => void
}

export function UsersFilters({ filters, onFiltersChange, onReset }: UsersFiltersProps) {
  const updateFilter = (key: keyof UserFilter, value: any) => {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Name, email..."
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={filters.role || "all"} onValueChange={(value) => updateFilter("role", value === "all" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tier Filter */}
          <div className="space-y-2">
            <Label>Tier</Label>
            <Select value={filters.storeTiers || "all"} onValueChange={(value) => updateFilter("storeTiers", value === "all" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="SILVER">Silver</SelectItem>
                <SelectItem value="BRONZE">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="APPROVED">Enabled</SelectItem>
                <SelectItem value="DISABLED">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters & Reset */}
        {hasActiveFilters && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                {filters.search && (
                  <Button variant="secondary" size="sm" onClick={() => updateFilter("search", "")}>
                    Search: "{filters.search}"
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
                {filters.role && (
                  <Button variant="secondary" size="sm" onClick={() => updateFilter("role", undefined)}>
                    Role: {filters.role}
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
                {filters.storeTiers && (
                  <Button variant="secondary" size="sm" onClick={() => updateFilter("storeTiers", undefined)}>
                    Tier: {filters.storeTiers}
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
                {filters.status && (
                  <Button variant="secondary" size="sm" onClick={() => updateFilter("status", undefined)}>
                    Status: {filters.status === 'APPROVED' ? 'Enabled' : 'Disabled'}
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={onReset} size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
