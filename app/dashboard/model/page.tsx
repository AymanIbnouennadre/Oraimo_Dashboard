"use client"

import { useState, useMemo } from "react"
import { DetectionTable } from "@/components/model/detection-table"
import { ModelFilters } from "@/components/model/model-filters"
import type { ModelDetection, Product, User } from "@/lib/types"

// Mock data imports
import detectionsData from "@/lib/mocks/detections.json"
import productsData from "@/lib/mocks/products.json"
import usersData from "@/lib/mocks/users.json"

export default function ModelPage() {
  const [detections, setDetections] = useState<ModelDetection[]>(detectionsData as ModelDetection[])
  const [products] = useState<Product[]>(productsData as Product[])
  const [users] = useState<User[]>(usersData as User[])
  const [filters, setFilters] = useState({
    search: "",
    success: "",
    product_id: "",
    user_id: "",
    model_version: "",
    min_confidence: "",
    max_confidence: "",
    date_from: "",
    date_to: "",
  })

  // Get unique model versions
  const modelVersions = useMemo(() => {
    const versions = [...new Set(detections.map((d) => d.model_version))]
    return versions.sort()
  }, [detections])

  // Filter detections based on current filters
  const filteredDetections = useMemo(() => {
    return detections.filter((detection) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !detection.product_name.toLowerCase().includes(searchLower) &&
          !detection.user_name.toLowerCase().includes(searchLower) &&
          !detection.id.toLowerCase().includes(searchLower) &&
          !detection.model_version.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Success filter
      if (filters.success && detection.success.toString() !== filters.success) {
        return false
      }

      // Product filter
      if (filters.product_id && detection.product_id !== filters.product_id) {
        return false
      }

      // User filter
      if (filters.user_id && detection.user_id !== filters.user_id) {
        return false
      }

      // Model version filter
      if (filters.model_version && detection.model_version !== filters.model_version) {
        return false
      }

      // Confidence range filter
      if (filters.min_confidence) {
        const minConf = Number.parseFloat(filters.min_confidence)
        if (detection.confidence < minConf) {
          return false
        }
      }

      if (filters.max_confidence) {
        const maxConf = Number.parseFloat(filters.max_confidence)
        if (detection.confidence > maxConf) {
          return false
        }
      }

      // Date range filter
      if (filters.date_from) {
        const detectionDate = new Date(detection.date)
        const fromDate = new Date(filters.date_from)
        if (detectionDate < fromDate) {
          return false
        }
      }

      if (filters.date_to) {
        const detectionDate = new Date(detection.date)
        const toDate = new Date(filters.date_to)
        toDate.setHours(23, 59, 59, 999) // End of day
        if (detectionDate > toDate) {
          return false
        }
      }

      return true
    })
  }, [detections, filters])

  const handleDelete = (id: string) => {
    setDetections(detections.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Model Management</h1>
        <p className="text-lg text-muted-foreground">AI detection history and model performance</p>
      </div>

      <ModelFilters onFiltersChange={setFilters} products={products} users={users} modelVersions={modelVersions} />

      <DetectionTable detections={filteredDetections} onDelete={handleDelete} />
    </div>
  )
}
