"use client"

import { StockHistory } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Package, 
  TrendingUp, 
  Hash, 
  Phone, 
  Calendar, 
  Star,
  Eye,
  Tag
} from "lucide-react"

interface StockHistoryViewDialogProps {
  movement: StockHistory | null
  isOpen: boolean
  onClose: () => void
}

export function StockHistoryViewDialog({ 
  movement, 
  isOpen, 
  onClose 
}: StockHistoryViewDialogProps) {
  if (!movement) return null

  const totalAmount = movement.quantity * movement.price

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Stock Movement Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">#{movement.id}</span>
              </div>
              <Badge 
                variant="secondary"
                className={
                  movement.movementType === "Purchase"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                }
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {movement.movementType}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${formatNumber(totalAmount)}</div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <User className="h-5 w-5" />
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <div className="font-mono">{movement.userId}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {movement.userPhone}
                </div>
              </div>
              {movement.userName && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="font-medium">{movement.userName}</div>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Package className="h-5 w-5" />
              Product Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Product ID</label>
                <div className="font-mono">{movement.productId}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Model</label>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {movement.productModel}
                </div>
              </div>
              {movement.productMarketingName && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Marketing Name</label>
                  <div className="font-medium">{movement.productMarketingName}</div>
                </div>
              )}
            </div>
          </div>

          {/* Movement Details */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <TrendingUp className="h-5 w-5" />
              Movement Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                <div className="text-2xl font-bold">{formatNumber(movement.quantity)}</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Unit Price</label>
                <div className="text-2xl font-bold">${formatNumber(movement.price)}</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Points</label>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{formatNumber(movement.points)}</span>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Detection ID</label>
                <div className="font-mono text-lg">#{movement.detectionId}</div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Calendar className="h-5 w-5" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <div className="font-mono">
                  {new Date(movement.createdAt).toLocaleString()}
                </div>
              </div>
              {movement.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                  <div className="font-mono">
                    {new Date(movement.updatedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}