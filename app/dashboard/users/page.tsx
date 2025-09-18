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
      // Ne pas montrer le loading pour les filtres, seulement au chargement initial
      if (users.length === 0) {
        setLoading(true)
      }
      const response = await userService.search(
        filters,
        currentPage - 1, // Backend uses 0-based pagination
        ITEMS_PER_PAGE,
        "created,desc"  // Correspond au nom de champ de l'API
      )
      
      // Stocker tous les utilisateurs de la réponse API
      const allUsersFromAPI = response.content as User[]
      setAllUsers(allUsersFromAPI)
      
      // Filtrer pour exclure l'utilisateur connecté
      const currentUserId = session?.user?.userId
      const filteredUsers = currentUserId 
        ? allUsersFromAPI.filter(user => user.id?.toString() !== currentUserId?.toString())
        : allUsersFromAPI
      
      // Si on utilise le fallback (toutes les données d'un coup), faire la pagination côté client
      if (response.totalPages === 1 && response.size === filteredUsers.length) {
        // Mode fallback : pagination côté client
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
        
        setUsers(paginatedUsers)
        setTotalUsers(filteredUsers.length)
      } else {
        // Mode normal : pagination côté serveur
        setUsers(filteredUsers)
        setTotalUsers(filteredUsers.length)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount and when filters/page change
  useEffect(() => {
    loadUsers()
  }, [currentPage, filters])

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
    await loadUsers()
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
        <Button onClick={handleNewUser}>
          <Plus className="h-4 w-4 mr-2" />
          New User
        </Button>
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
