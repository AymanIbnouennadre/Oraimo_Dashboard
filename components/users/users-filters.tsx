"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, User, Shield, RefreshCw } from "lucide-react"
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

  const removeFilter = (key: keyof UserFilter) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const getActiveFilters = () => {
    const active: Array<{ key: keyof UserFilter; label: string; value: any }> = []
    
    if (filters.search) {
      active.push({ key: "search", label: "Search", value: filters.search })
    }
    if (filters.email) {
      active.push({ key: "email", label: "Email", value: filters.email })
    }
    if (filters.phone) {
      active.push({ key: "phone", label: "Phone", value: filters.phone })
    }
    if (filters.status) {
      active.push({ key: "status", label: "Status", value: filters.status === 'APPROVED' ? 'Approved' : 'Disabled' })
    }
    if (filters.storeTiers) {
      active.push({ key: "storeTiers", label: "Tier", value: filters.storeTiers })
    }
    if (filters.role) {
      active.push({ key: "role", label: "Role", value: filters.role })
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
              placeholder="Name, email, phone..."
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Email Filter */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Filter by email..."
            value={filters.email || ""}
            onChange={(e) => updateFilter("email", e.target.value)}
            className="h-10"
          />
        </div>

        {/* Phone Filter */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Phone
          </Label>
          <Input
            id="phone"
            placeholder="Filter by phone..."
            value={filters.phone || ""}
            onChange={(e) => updateFilter("phone", e.target.value)}
            className="h-10"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Shield className="inline h-3 w-3 mr-1" />
            Status
          </Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value as "APPROVED" | "DISABLED")}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="DISABLED">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Store Tier Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Store Tier
          </Label>
          <Select
            value={filters.storeTiers || "all"}
            onValueChange={(value) => updateFilter("storeTiers", value === "all" ? undefined : value as "GOLD" | "SILVER" | "BRONZE")}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="GOLD">Gold</SelectItem>
              <SelectItem value="SILVER">Silver</SelectItem>
              <SelectItem value="BRONZE">Bronze</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <User className="inline h-3 w-3 mr-1" />
            Role
          </Label>
          <Select
            value={filters.role || "all"}
            onValueChange={(value) => updateFilter("role", value === "all" ? undefined : value as "ADMIN" | "CUSTOMER")}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
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
