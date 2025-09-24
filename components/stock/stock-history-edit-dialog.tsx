"use client"

import { useState, useEffect } from "react"
import { StockHistory } from "@/lib/types"
import { StockHistoryService, StockHistoryError } from "@/lib/services/stock-history"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Edit, AlertCircle, Clock } from "lucide-react"

interface StockHistoryEditDialogProps {
  movement: StockHistory | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function StockHistoryEditDialog({ 
  movement, 
  isOpen, 
  onClose,
  onSuccess 
}: StockHistoryEditDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    movementType: "",
    quantity: ""
  })

  // Initialize form data when movement changes
  useEffect(() => {
    if (movement) {
      setFormData({
        movementType: movement.movementType || "",
        quantity: movement.quantity?.toString() || ""
      })
      // Clear any previous errors when opening a new movement
      setError(null)
    }
  }, [movement])

  // Clear error when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movement) return

    // Clear previous errors
    setError(null)
    setLoading(true)
    
    try {
      // Validate form data
      if (!formData.movementType) {
        setError("Please select a movement type.")
        return
      }
      
      const quantity = parseInt(formData.quantity)
      if (!quantity || quantity <= 0) {
        setError("Please enter a valid quantity greater than 0.")
        return
      }

      const updateData = {
        movementType: formData.movementType as "Purchase" | "Sale",
        quantity: quantity
      }

      await StockHistoryService.updateStockHistory(movement.id, updateData)
      
      toast({
        title: "Success",
        description: "Stock movement updated successfully!",
        variant: "default",
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating stock movement:", error)
      
      // Handle different types of errors
      if (error instanceof StockHistoryError) {
        setError(error.message)
        
        // Show toast for specific errors
        if (error.status === 400 && error.message.includes('24-hour deadline')) {
          toast({
            title: "Update Not Allowed",
            description: "Cannot edit: 24-hour deadline expired - This movement can no longer be modified as it was created more than 24 hours ago.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Update Failed",
            description: `Update failed: ${error.message}`,
            variant: "destructive",
          })
        }
      } else {
        const errorMessage = "An unexpected error occurred while updating the stock movement."
        setError(errorMessage)
        toast({
          title: "Update Failed",
          description: `Update failed: ${errorMessage}`,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!movement) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Stock Movement #{movement.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.includes('24-hour deadline') ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Update Not Allowed</span>
                    </div>
                    <p className="text-sm">{error}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock movements can only be edited within 24 hours of creation for data integrity purposes.
                    </p>
                  </div>
                ) : (
                  error
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Movement Type */}
          <div className="space-y-2">
            <Label htmlFor="movementType">Movement Type</Label>
            <Select 
              value={formData.movementType} 
              onValueChange={(value) => {
                handleInputChange("movementType", value)
                // Clear error when user starts fixing the form
                if (error) setError(null)
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select movement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => {
                handleInputChange("quantity", e.target.value)
                // Clear error when user starts fixing the form
                if (error) setError(null)
              }}
              disabled={loading}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (error?.includes('24-hour deadline') || false)}
              variant={error?.includes('24-hour deadline') ? "secondary" : "default"}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {error?.includes('24-hour deadline') ? (
                <>Edit Not Allowed</>
              ) : (
                <>Update Movement</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}