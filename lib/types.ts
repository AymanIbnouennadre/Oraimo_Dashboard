// Core data types for Oraimo Admin

export interface User {
  id: string
  name: string
  phone: string
  email: string
  role: "ADMIN" | "CUSTOMER"
  tier: "GOLD" | "SILVER" | "BRONZE"
  enabled: boolean
  points_total: number
  last_activity: string
  created: string
}

export interface Product {
  id: string
  sku: string
  model: string
  marketing_name: string
  category: string
  retail_price: number
  final_price: number
  points_gold: number
  points_silver: number
  points_bronze: number
  image_url?: string
  created: string
}

export interface StockMovement {
  id: string
  date: string
  user_id: string
  user_name: string
  product_id: string
  product_name: string
  type: "IN" | "OUT"
  quantity: number
  points: number
  detection_id?: string
}

export interface ModelDetection {
  id: string
  date: string
  user_id: string
  user_name: string
  product_id: string
  product_name: string
  model_version: string
  confidence: number
  success: boolean
  image_url?: string
}

export interface KPI {
  label: string
  value: number | string
  change?: number
  trend?: "up" | "down" | "neutral"
}

export interface FilterOptions {
  search?: string
  role?: string
  tier?: string
  enabled?: boolean
  category?: string
  min_price?: number
  max_price?: number
  type?: "IN" | "OUT"
  success?: boolean
  min_confidence?: number
  max_confidence?: number
  date_from?: string
  date_to?: string
  user_id?: string
  product_id?: string
  model_version?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: "asc" | "desc"
}
