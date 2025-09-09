"use client"

import { useState, useMemo } from "react"
import { StockTable } from "@/components/stock/stock-table"
import { StockFilters } from "@/components/stock/stock-filters"
import type { StockMovement, Product, User } from "@/lib/types"

// Mock data imports
import stockData from "@/lib/mocks/stock.json"
import productsData from "@/lib/mocks/products.json"
import usersData from "@/lib/mocks/users.json"

export default function StockPage() {
  const [movements, setMovements] = useState<StockMovement[]>(stockData as StockMovement[])
  const [products] = useState<Product[]>(productsData as Product[])
  const [users] = useState<User[]>(usersData as User[])
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    product_id: "",
    user_id: "",
    date_from: "",
    date_to: "",
  })

  // Filter movements based on current filters
  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !movement.product_name.toLowerCase().includes(searchLower) &&
          !movement.user_name.toLowerCase().includes(searchLower) &&
          !movement.id.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Type filter
      if (filters.type && movement.type !== filters.type) {
        return false
      }

      // Product filter
      if (filters.product_id && movement.product_id !== filters.product_id) {
        return false
      }

      // User filter
      if (filters.user_id && movement.user_id !== filters.user_id) {
        return false
      }

      // Date range filter
      if (filters.date_from) {
        const movementDate = new Date(movement.date)
        const fromDate = new Date(filters.date_from)
        if (movementDate < fromDate) {
          return false
        }
      }

      if (filters.date_to) {
        const movementDate = new Date(movement.date)
        const toDate = new Date(filters.date_to)
        toDate.setHours(23, 59, 59, 999) // End of day
        if (movementDate > toDate) {
          return false
        }
      }

      return true
    })
  }, [movements, filters])

  const handleEdit = (movement: StockMovement) => {
    // TODO: Implement edit functionality
    console.log("Edit movement:", movement)
  }

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    setMovements(movements.filter((m) => m.id !== id))
  }

  const handleAdd = () => {
    // TODO: Implement add functionality
    console.log("Add new movement")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Stock Management</h1>
        <p className="text-lg text-muted-foreground">Track and manage inventory movements</p>
      </div>

      <StockFilters onFiltersChange={setFilters} products={products} users={users} />

      <StockTable movements={filteredMovements} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
    </div>
  )
}
