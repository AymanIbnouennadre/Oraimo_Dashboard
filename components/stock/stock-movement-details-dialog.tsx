"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StockMovementDetails } from "./stock-movement-details"

interface StockMovementDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movementId: number | null
}

export function StockMovementDetailsDialog({
  open,
  onOpenChange,
  movementId,
}: StockMovementDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Détails du mouvement stock</DialogTitle>
        </DialogHeader>
        {movementId && (
          <StockMovementDetails movementId={movementId} />
        )}
      </DialogContent>
    </Dialog>
  )
}
