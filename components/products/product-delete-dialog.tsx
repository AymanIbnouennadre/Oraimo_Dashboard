"use client"
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
import { Trash2 } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductDeleteDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (productId: number) => void
  isLoading?: boolean
}

export function ProductDeleteDialog({ 
  product, 
  open, 
  onOpenChange, 
  onConfirm, 
  isLoading = false 
}: ProductDeleteDialogProps) {
  if (!product) return null

  const handleConfirm = () => {
    onConfirm(product.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the product{" "}
            <strong>{product.marketingName}</strong>?
            <br />
            <br />
            <span className="text-sm text-muted-foreground">
              • ID: {product.id}
              <br />
              • Model: {product.model}
              <br />
              • Class Label: {product.classLabel}
            </span>
            <br />
            <br />
            This action is <strong>irreversible</strong> and will permanently delete this product
            from your catalog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}