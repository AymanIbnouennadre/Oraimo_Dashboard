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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Edit, MoreHorizontal } from "lucide-react"
import type { User } from "@/lib/types"
import { UserViewDrawer } from "./user-view-drawer"

interface UsersTableProps {
  users: User[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onToggleStatus: (userId: number, currentStatus: string) => void
  onEdit: (user: User) => void
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onToggleStatus,
  onEdit,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDrawerOpen(true)
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "GOLD":
        return "default" // Or you could create custom classes for gold color
      case "SILVER":
        return "secondary"
      case "BRONZE":
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Phone</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Tier</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-center">{user.firstName} {user.lastName}</TableCell>
                <TableCell className="text-center">{user.phone}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} 
                         className={user.role === "ADMIN" ? "text-gray-800 hover:opacity-80" : "text-white hover:opacity-80"}
                         style={{
                           backgroundColor: user.role === "ADMIN" ? "#BBDCE5" : "#9B7EBD"
                         }}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={getTierBadgeVariant(user.storeTiers)}
                    className={
                      user.storeTiers === 'GOLD' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300' :
                      user.storeTiers === 'SILVER' ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300' :
                      user.storeTiers === 'BRONZE' ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300' : ''
                    }
                  >
                    {user.storeTiers}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Switch
                      checked={user.status === 'APPROVED'}
                      onCheckedChange={() => onToggleStatus(user.id, user.status)}
                      className={`${
                        user.status === 'APPROVED' 
                          ? '!bg-green-500 data-[state=checked]:!bg-green-500 [&>span]:!bg-white' 
                          : '!bg-red-600 data-[state=unchecked]:!bg-red-600 [&>span]:!bg-white'
                      }`}
                    />
                    <Badge 
                      variant={user.status === 'APPROVED' ? 'default' : 'destructive'}
                      className={`${
                        user.status === 'APPROVED' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-600 text-white hover:bg-red-700'
                      } border-none`}
                    >
                      {user.status === 'APPROVED' ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </TableCell>

                {/* Actions (3 points) */}
                <TableCell className="text-center">
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
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
