"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import { SectionTabs } from "@/components/layout/section-tabs"
import { UsersTable } from "@/components/users/users-table"
import { UsersFilters } from "@/components/users/users-filters"
import { UserFormDialog } from "@/components/users/user-form-dialog"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import type { User, UserFilter, PaginatedResponse } from "@/lib/types"
import { userService } from "@/lib/services/user-service"

const ITEMS_PER_PAGE = 10

export default function UsersManagementPage() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([]) // Tous les utilisateurs de l'API
  const [totalUsers, setTotalUsers] = useState(0)
  const [filters, setFilters] = useState<UserFilter>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // Load users data
  const loadUsers = async () => {
    try {
      if (users.length === 0) {
        setLoading(true)
      }
      
      // First try to get all users using the fallback method
      let allUsersResponse;
      try {
        // Try search endpoint with large page size to get all users
        allUsersResponse = await userService.search(
          {},  // No filters initially
          0,   // First page
          999999, // Very large page size to get all users
          "createdAt,desc"
        )
        console.log('Got users from search:', allUsersResponse)
      } catch (error) {
        // If search fails, try direct API call
        const directResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/users`)
        
        if (directResponse.ok) {
          const data = await directResponse.json()
          allUsersResponse = {
            content: Array.isArray(data) ? data : (data.content || []),
            totalElements: Array.isArray(data) ? data.length : (data.totalElements || 0)
          }
        } else {
          throw new Error('Failed to load users')
        }
      }
      
      const allUsersFromAPI = allUsersResponse.content as User[]
      
      if (!Array.isArray(allUsersFromAPI)) {
        throw new Error('Invalid API response format')
      }
      
      setAllUsers(allUsersFromAPI)
      
      // Filter out current user
      const currentUserId = session?.user?.userId
      let filteredUsers = currentUserId 
        ? allUsersFromAPI.filter(user => user.id?.toString() !== currentUserId?.toString())
        : allUsersFromAPI
      
      // Apply search and filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower)
        )
      }
      
      if (filters.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status)
      }
      
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role)
      }
      
      if (filters.storeTiers) {
        filteredUsers = filteredUsers.filter(user => 
          Array.isArray(user.storeTiers) 
            ? user.storeTiers.includes(filters.storeTiers)
            : user.storeTiers === filters.storeTiers
        )
      }
      
      // Client-side pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
      
      setUsers(paginatedUsers)
      setTotalUsers(filteredUsers.length)
      
      console.log('Final users set:', paginatedUsers.length, 'of', filteredUsers.length, 'total')
      
    } catch (error) {
      setUsers([])
      setAllUsers([])
      setTotalUsers(0)
      toast.error('Failed to load users from database. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount and when filters/page change
  useEffect(() => {
    loadUsers()
  }, [currentPage, filters, session?.user?.userId]) // Add userId to dependencies

  // Handlers
  const handleFiltersChange = (newFilters: UserFilter) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'APPROVED' ? 'DISABLED' : 'APPROVED'
      await userService.update(userId, { status: newStatus })
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
      
      toast.success(`User ${newStatus.toLowerCase()} successfully`)
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormDialogOpen(true)
  }

  const handleFormSuccess = async () => {
    console.log('Form success called, reloading users...')
    await loadUsers()
    console.log('Users reloaded successfully')
  }

  const handleNewUser = () => {
    setSelectedUser(null)
    setFormDialogOpen(true)
  }

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE)

  // Reset à la page 1 si on est sur une page qui n'existe plus après filtrage
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  if (loading && users.length === 0) {
    return <LoadingOverlay show={true} />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewUser}>
            <Plus className="h-4 w-4 mr-2" />
            New User
          </Button>
        </div>
      </div>

      {/* Section Tabs */}
      <SectionTabs section="users" />

      {/* Users Management Card - Filters + Table Combined */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({totalUsers})</CardTitle>
          <CardDescription>User list with management options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <UsersFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />
          
          {/* Users Table */}
          {loading ? (
            <LoadingOverlay show={true} />
          ) : (
            <UsersTable
              users={users}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEdit}
            />
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <UserFormDialog
        user={selectedUser}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
