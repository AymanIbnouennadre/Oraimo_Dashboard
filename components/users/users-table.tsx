"use client"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Edit, RotateCcw, Trash2, MoreHorizontal } from "lucide-react"
import type { User } from "@/lib/types"
import { UserViewDrawer } from "./user-view-drawer"

interface UsersTableProps {
  users: User[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onToggleEnabled: (userId: string, enabled: boolean) => void
  onEdit: (user: User) => void
  onResetPassword: (userId: string) => void
  onDelete: (userId: string) => void
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onToggleEnabled,
  onEdit,
  onResetPassword,
  onDelete,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDrawerOpen(true)
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "GOLD":
        return "default"
      case "SILVER":
        return "secondary"
      case "BRONZE":
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getTierBadgeVariant(user.tier)}>{user.tier}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.enabled}
                      onCheckedChange={(checked) => onToggleEnabled(user.id, checked)}
                      size="sm"
                    />
                    <span className="text-sm">{user.enabled ? "Activé" : "Désactivé"}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(user.created)}</TableCell>

                {/* Actions (3 points) */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    {/* ✅ pas de asChild : bouton natif => ref OK */}
                    <DropdownMenuTrigger
                      type="button"
                      aria-label="Actions"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 z-50">
                      <DropdownMenuItem onClick={() => handleViewUser(user)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(user.id)}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Réinitialiser mot de passe
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(user.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) onPageChange(currentPage - 1)
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(page)
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) onPageChange(currentPage + 1)
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* View User Drawer */}
      <UserViewDrawer user={selectedUser} open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen} />
    </>
  )
}
