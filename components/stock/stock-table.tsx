"use client"

import * as React from "react"
import { formatNumber } from "@/lib/utils"
import { MoreHorizontal, Pencil, Trash2, Eye, Phone, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { StockHistory } from '@/lib/types'
import { StockMovementDetailsDialog } from './stock-movement-details-dialog'
import { StockHistoryEditDialog } from './stock-history-edit-dialog'
import { productService } from '@/lib/services/product-service'
import { userService } from '@/lib/services/user-service'

type Props = {
  movements: StockHistory[]
  onEdit: (movement: StockHistory) => void
  onDelete: (id: number) => void
  onMovementUpdated?: () => void
}

// Types for enriched data
interface EnrichedMovement extends Omit<StockHistory, 'productModel'> {
  productMarketingName?: string
  productModel?: string
  userName?: string
  isLoadingProduct?: boolean
  isLoadingUser?: boolean
}

export function StockTable({ movements, onEdit, onDelete, onMovementUpdated }: Props) {
  const [selectedMovementId, setSelectedMovementId] = React.useState<number | null>(null)
  const [selectedMovement, setSelectedMovement] = React.useState<StockHistory | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [deleteMovementId, setDeleteMovementId] = React.useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [enrichedMovements, setEnrichedMovements] = React.useState<EnrichedMovement[]>([])

  // Enrich movements with product and user data
  React.useEffect(() => {
    const enrichMovements = async () => {
      const enriched = await Promise.all(
        movements.map(async (movement) => {
          const enrichedMovement: EnrichedMovement = {
            ...movement,
            isLoadingProduct: true,
            isLoadingUser: true,
          }

          // Fetch product data
          try {
            const product = await productService.getById(movement.productId)
            enrichedMovement.productMarketingName = product.marketingName
            enrichedMovement.productModel = product.model
            enrichedMovement.isLoadingProduct = false
          } catch (error) {
            console.error('Error fetching product:', error)
            enrichedMovement.isLoadingProduct = false
          }

          // Fetch user data
          try {
            const user = await userService.getById(movement.userId)
            enrichedMovement.userName = `${user.firstName} ${user.lastName}`
            enrichedMovement.isLoadingUser = false
          } catch (error) {
            console.error('Error fetching user:', error)
            enrichedMovement.isLoadingUser = false
          }

          return enrichedMovement
        })
      )
      setEnrichedMovements(enriched)
    }

    if (movements.length > 0) {
      enrichMovements()
    } else {
      setEnrichedMovements([])
    }
  }, [movements])

  const handleView = (movement: EnrichedMovement) => {
    setSelectedMovementId(movement.id)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (movement: EnrichedMovement) => {
    // Convertir EnrichedMovement vers StockHistory pour le dialog
    const stockHistory: StockHistory = {
      id: movement.id,
      userId: movement.userId,
      productId: movement.productId,
      movementType: movement.movementType,
      quantity: movement.quantity,
      price: movement.price,
      points: movement.points,
      detectionId: movement.detectionId,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
      userPhone: movement.userPhone,
      productModel: movement.productModel || ''
    }
    setSelectedMovement(stockHistory)
    setIsEditDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
    setSelectedMovementId(null)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedMovement(null)
  }

  const handleEditSuccess = () => {
    handleCloseEditDialog()
    if (onMovementUpdated) {
      onMovementUpdated()
    }
  }

  const handleDeleteClick = (id: number) => {
    setDeleteMovementId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deleteMovementId) {
      onDelete(deleteMovementId)
    }
    setIsDeleteDialogOpen(false)
    setDeleteMovementId(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setDeleteMovementId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movements</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID Movement</TableHead>
              <TableHead className="text-center">User</TableHead>
              <TableHead className="text-center">Product</TableHead>
              <TableHead className="text-center">Movement Type</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Gains</TableHead>
              <TableHead className="text-center">ID Detection</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {enrichedMovements.map((movement) => (
              <TableRow key={movement.id} className="hover:bg-accent/40">
                {/* ID Movement */}
                <TableCell className="text-center">
                  <span className="font-mono text-sm font-medium">{movement.id}</span>
                </TableCell>
                
                {/* User */}
                <TableCell className="text-center">
                  <div className="text-center">
                    <div className="font-medium text-sm">{movement.userName || `User ${movement.userId}`}</div>
                    <div className="text-xs text-gray-500">{movement.userPhone}</div>
                  </div>
                </TableCell>
                
                {/* Product */}
                <TableCell className="text-center">
                  {movement.isLoadingProduct ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="font-medium text-sm">{movement.productMarketingName || `Product ${movement.productId}`}</div>
                      <div className="text-xs text-gray-500">{movement.productModel || '-'}</div>
                    </div>
                  )}
                </TableCell>
                
                {/* Movement Type */}
                <TableCell className="text-center">
                  <Badge variant={movement.movementType === "Purchase" ? "default" : "secondary"}
                         className={movement.movementType === "Purchase" 
                           ? "bg-blue-500 hover:bg-blue-600 text-white" 
                           : "bg-orange-500 hover:bg-orange-600 text-white"}>
                    {movement.movementType}
                  </Badge>
                </TableCell>
                
                {/* Quantity */}
                <TableCell className="text-center">
                  {movement.quantity}
                </TableCell>
                
                {/* Gains */}
                <TableCell className="text-center">
                  {movement.movementType === "Purchase" ? (
                    movement.points ? (
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                        {formatNumber(movement.points)} pts
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        - pts
                      </Badge>
                    )
                  ) : (
                    movement.price ? (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                        {formatNumber(movement.price)} MAD
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        - MAD
                      </Badge>
                    )
                  )}
                </TableCell>
                
                {/* ID Detection */}
                <TableCell className="text-center">
                  {movement.detectionId ? (
                    <span className="font-mono text-sm font-medium">#{movement.detectionId}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                
                {/* Date */}
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-sm">
                      {new Date(movement.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(movement.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </TableCell>
                
                {/* Actions */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      type="button"
                      aria-label="Actions"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-50">
                      <DropdownMenuItem 
                        onClick={() => handleView(movement)}
                        className="cursor-pointer hover:bg-accent"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleEdit(movement)}
                        className="cursor-pointer hover:bg-accent"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(movement.id)}
                        className="text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {enrichedMovements.length === 0 && movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                  No stock movements found.
                </TableCell>
              </TableRow>
            )}
            
            {enrichedMovements.length === 0 && movements.length > 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading movement data...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <StockMovementDetailsDialog
        movementId={selectedMovementId}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <StockHistoryEditDialog
        movement={selectedMovement}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stock Movement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this stock movement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}