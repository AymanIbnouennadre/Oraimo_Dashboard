"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import { SectionTabs } from "@/components/layout/section-tabs"
import { UsersTable } from "@/components/users/users-table"
import { UsersFilters } from "@/components/users/users-filters"
import type { User, FilterOptions } from "@/lib/types"

import mockUsersData from "@/lib/mocks/users.json"

const ITEMS_PER_PAGE = 10

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsersData as User[])
  const [filters, setFilters] = useState<FilterOptions>({})
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    let filtered = [...users]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.toLowerCase().includes(searchLower),
      )
    }

    // Apply role filter
    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role)
    }

    // Apply tier filter
    if (filters.tier) {
      filtered = filtered.filter((user) => user.tier === filters.tier)
    }

    // Apply enabled filter
    if (filters.enabled !== undefined) {
      filtered = filtered.filter((user) => user.enabled === filters.enabled)
    }

    return filtered
  }, [users, filters])

  // Paginate filtered results
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)

  // Handlers - all static now
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const handleToggleEnabled = (userId: string, enabled: boolean) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, enabled } : user)))
  }

  const handleEdit = (user: User) => {
    console.log("Edit user:", user)
  }

  const handleResetPassword = (userId: string) => {
    console.log("Reset password for user:", userId)
  }

  const handleDelete = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New User
        </Button>
      </div>

      {/* Section Tabs */}
      <SectionTabs section="users" />

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Statistics
          </CardTitle>
          <CardDescription>User overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{users.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{users.filter((u) => u.enabled).length}</div>
              <div className="text-sm text-muted-foreground">Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "ADMIN").length}</div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{users.filter((u) => u.tier === "GOLD").length}</div>
              <div className="text-sm text-muted-foreground">Gold</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <UsersFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>User list with management options</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={paginatedUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onToggleEnabled={handleToggleEnabled}
            onEdit={handleEdit}
            onResetPassword={handleResetPassword}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
