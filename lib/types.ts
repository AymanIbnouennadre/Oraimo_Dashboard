// Core data types for Oraimo Admin

// User Management Types (matching backend DTOs)
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  status: "APPROVED" | "DISABLED"
  storeTiers: "GOLD" | "SILVER" | "BRONZE"
  role: "ADMIN" | "CUSTOMER"
  created?: string  // L'API renvoie 'created' pas 'createdAt'
  updatedAt?: string
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  role?: "ADMIN" | "CUSTOMER"  // Optional, defaults to CUSTOMER on server
  storeTiers: "GOLD" | "SILVER" | "BRONZE"  // API expects uppercase format
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  status?: "APPROVED" | "DISABLED"
  storeTiers?: "GOLD" | "SILVER" | "BRONZE"
  role?: "ADMIN" | "CUSTOMER"
}

export interface UserResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  status: string
  storeTiers: string
  role: string
  created?: string  // L'API renvoie 'created'
  updatedAt?: string
}

export interface UserFilter {
  search?: string
  email?: string
  phone?: string
  status?: "APPROVED" | "DISABLED"
  storeTiers?: "GOLD" | "SILVER" | "BRONZE"
  role?: "ADMIN" | "CUSTOMER"
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Legacy User type (to be removed gradually)
export interface LegacyUser {
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

// Product Management Types (matching backend API)
export interface Product {
  id: number
  classLabel: string
  model: string
  marketingName: string
  category: string
  retailPrice: number
  finalCustomerPrice: number
  image: string
  seuil: number
  pointsGold: number
  pointsSilver: number
  pointsBronze: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductRequest {
  classLabel: string
  model: string
  marketingName: string
  category: string
  retailPrice: number
  finalCustomerPrice: number
  image?: string
  seuil: number
  pointsGold: number
  pointsSilver: number
  pointsBronze: number
}

export interface UpdateProductRequest {
  classLabel?: string
  model?: string
  marketingName?: string
  category?: string
  retailPrice?: number
  finalCustomerPrice?: number
  image?: string
  seuil?: number
  pointsGold?: number
  pointsSilver?: number
  pointsBronze?: number
}

export interface ProductFilter {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minSeuil?: number
  maxSeuil?: number
  sortBy?: "name" | "price_asc" | "price_desc" | "points" | "created"
  groupBy?: "category" | "price_range" | "none"
}

// Legacy Product type (to be removed gradually)
export interface LegacyProduct {
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

// Stock History Management Types (matching real backend API structure)
export interface StockHistory {
  id: number
  userId: number
  userPhone: string
  productId: number
  productModel: string
  movementType: "Purchase" | "Sale"
  quantity: number
  points: number
  detectionId: number
  createdAt: string
  updatedAt: string | null
  price: number
  // Extended fields for UI (populated from relations)
  userName?: string
  productMarketingName?: string
  productImage?: string
  productRetailPrice?: number
  productFinalCustomerPrice?: number
  productPoints?: number
  pointsStoreTier?: string
  userTier?: string
}

export interface CreateStockHistoryRequest {
  userId: number
  productId: number
  movementType: "Purchase" | "Sale"
  quantity: number
  price: number
  detectionId?: number
}

export interface UpdateStockHistoryRequest {
  userId?: number
  productId?: number
  movementType?: "Purchase" | "Sale"
  quantity?: number
  price?: number
  detectionId?: number
}

export interface StockHistoryFilters {
  movementType?: "Purchase" | "Sale"
  createdFrom?: string
  createdTo?: string
  minPrice?: number
  maxPrice?: number
  minQuantity?: number
  maxQuantity?: number
  modelLike?: string
  detectionId?: number
  userNameLike?: string
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

// Detection data from model history API (matching backend structure)
export interface Detection {
  id: number
  confidence: number
  success: boolean
  model_version?: string
  image_url?: string
  createdAt?: string
  updatedAt?: string
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

// Authentication related types
export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  success: boolean
  message?: string
}

export interface ResetPasswordRequest {
  email: string
  code: string  
  newPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message?: string
}

// Code verification types for new workflow (matching backend DTO)
export interface VerifyOtpRequest {
  email: string
  code: string
}

export interface VerifyOtpResponse {
  success: boolean
  message?: string
  resetToken?: string // Token temporaire pour l'étape suivante
}
