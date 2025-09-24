"use client"

import { useState, useEffect } from "react"
import { StockTable } from "@/components/stock/stock-table"
import { StockFilters } from "@/components/stock/stock-filters"
import { StockHistoryService } from "@/lib/services/stock-history"
import { enrichStockHistory } from "@/lib/utils/stock-utils"
import { useToast } from "@/hooks/use-toast"
import type { StockHistory, StockHistoryFilters, Product, User } from "@/lib/types"

export default function StockPage() {
  const [movements, setMovements] = useState<StockHistory[]>([])
  const [allMovements, setAllMovements] = useState<StockHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<StockHistoryFilters>({})

  const { toast } = useToast()

  // Load initial data once on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Load all stock history
        const historyResponse = await StockHistoryService.getAllStockHistory()
        const enrichedMovements = enrichStockHistory(historyResponse.content || [])
        
        // Store all movements for reference
        setAllMovements(enrichedMovements)
        setMovements(enrichedMovements)
        
      } catch (error) {
        console.error("Failed to load initial data:", error)
        setMovements([])
        setAllMovements([])
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Apply filters when filters change
  useEffect(() => {
    const applyFilters = async () => {
      if (Object.keys(filters).length === 0) {
        // No filters, show all data
        setMovements(allMovements)
        return
      }

      console.log('Applying filters:', filters) // Debug log
      try {
        // Apply filters via API
        const historyResponse = await StockHistoryService.searchStockHistory(filters)
        console.log('Filter response:', historyResponse) // Debug log
        const enrichedMovements = enrichStockHistory(historyResponse.content || [])
        setMovements(enrichedMovements)
      } catch (error) {
        console.error("Failed to apply filters via API:", error)
        console.log("Falling back to client-side filtering...")
        
        // Fallback: Client-side filtering
        let filteredMovements = [...allMovements]
        
        if (filters.userNameLike) {
          const searchTerm = filters.userNameLike.toLowerCase()
          filteredMovements = filteredMovements.filter(movement => 
            (movement.userName && movement.userName.toLowerCase().includes(searchTerm)) ||
            (movement.userPhone && movement.userPhone.toLowerCase().includes(searchTerm))
          )
        }
        
        if (filters.movementType) {
          filteredMovements = filteredMovements.filter(movement => 
            movement.movementType === filters.movementType
          )
        }
        
        if (filters.modelLike) {
          const searchTerm = filters.modelLike.toLowerCase()
          filteredMovements = filteredMovements.filter(movement => 
            movement.productModel && movement.productModel.toLowerCase().includes(searchTerm)
          )
        }
        
        if (filters.detectionId) {
          filteredMovements = filteredMovements.filter(movement => 
            movement.detectionId === filters.detectionId
          )
        }
        
        console.log('Client-side filtered results:', filteredMovements.length)
        setMovements(filteredMovements)
      }
    }

    // Only apply filters after initial data is loaded
    if (!loading && allMovements.length >= 0) {
      applyFilters()
    }
  }, [filters, allMovements, loading])

  const handleFiltersChange = (newFilters: StockHistoryFilters) => {
    setFilters(newFilters)
  }

  const handleEdit = (movement: StockHistory) => {
    console.log("Edit movement:", movement)
  }

  const handleDelete = async (id: number) => {
    try {
      await StockHistoryService.deleteStockHistory(id)
      setMovements(movements.filter((m) => m.id !== id))
      setAllMovements(allMovements.filter((m) => m.id !== id))
      toast({
        title: "Success",
        description: "Stock movement deleted successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to delete movement:", error)
      toast({
        title: "Error",
        description: "Failed to delete stock movement. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMovementUpdated = async () => {
    try {
      const historyResponse = await StockHistoryService.getAllStockHistory()
      const enrichedMovements = enrichStockHistory(historyResponse.content || [])
      setAllMovements(enrichedMovements)
      
      // Reapply current filters
      if (Object.keys(filters).length > 0) {
        const filteredResponse = await StockHistoryService.searchStockHistory(filters)
        const filteredEnrichedMovements = enrichStockHistory(filteredResponse.content || [])
        setMovements(filteredEnrichedMovements)
      } else {
        setMovements(enrichedMovements)
      }
    } catch (error) {
      console.error("Failed to reload stock data:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Stock Management</h1>
          <p className="text-lg text-muted-foreground">Track and manage inventory movements</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading stock data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
        <p className="text-muted-foreground">Track and manage inventory movements</p>
      </div>

      <div className="space-y-0">
        <StockFilters 
          onFiltersChange={handleFiltersChange}
        />
        
        <StockTable 
          movements={movements} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onMovementUpdated={handleMovementUpdated}
        />
      </div>
    </div>
  )
}