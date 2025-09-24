// Model History Service for Model Detection History
import type { Detection, PaginatedResponse } from "@/lib/types"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"

// Enhanced ModelHistory type based on the provided example
export interface ModelHistory {
  id: number
  userId: number
  userPhone: string
  productId: number
  productModel: string
  modelVersion?: string // Will be ignored as requested
  imageUrl?: string
  success: boolean
  createdAt: string
  confidence: number
}

// Request types for ModelHistory
export interface CreateModelHistoryRequest {
  userId: number
  productId: number
  success: boolean
  confidence: number
  imageUrl?: string
}

export interface ModelHistoryFilters {
  userId?: number
  productId?: number
  success?: boolean
  userPhone?: string
  productModel?: string
  confidenceMin?: number
  confidenceMax?: number
  createdFrom?: string
  createdTo?: string
}

// Custom error class for API errors
export class ModelHistoryError extends Error {
  constructor(
    message: string,
    public status: number,
    public originalError?: any
  ) {
    super(message)
    this.name = 'ModelHistoryError'
  }
}

// Helper function to parse error messages
function parseErrorMessage(status: number, errorData: any): string {
  if (status === 400) {
    if (errorData?.message) {
      const msg = errorData.message.toLowerCase()
      if (msg.includes('validation')) {
        return 'Validation error: Please check your input data.'
      }
    }
    return 'Bad request: Please check your input data.'
  }
  
  if (status === 401) {
    return 'Authentication failed: Please log in again.'
  }
  
  if (status === 403) {
    return 'Access denied: You do not have permission to perform this action.'
  }
  
  if (status === 404) {
    return 'Model history entry not found.'
  }
  
  if (status === 409) {
    return 'Conflict: The model history entry conflicts with existing data.'
  }
  
  if (status >= 500) {
    return 'Server error: Please try again later or contact support.'
  }
  
  return `Request failed with status ${status}. Please try again.`
}

// Helper function to get auth token from cookies
function getAuthToken(): string | null {
  if (typeof document === "undefined") return null
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("oraimo_token="))
    ?.split("=")[1] ?? null
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      let errorData: any
      const contentType = response.headers.get('content-type')
      
      try {
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json()
        } else {
          errorData = await response.text()
        }
      } catch {
        errorData = 'Unknown error occurred'
      }
      
      const errorMessage = parseErrorMessage(response.status, errorData)
      throw new ModelHistoryError(errorMessage, response.status, errorData)
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  } catch (error) {
    // Re-throw ModelHistoryError as is
    if (error instanceof ModelHistoryError) {
      throw error
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ModelHistoryError(
        'Network error: Please check your connection and try again.',
        0,
        error
      )
    }
    
    // Handle other errors
    throw new ModelHistoryError(
      'An unexpected error occurred. Please try again.',
      0,
      error
    )
  }
}

export class ModelHistoryService {
  private static readonly BASE_PATH = "/api/history-model"

  /**
   * Creates a new model history entry
   * POST /api/history-model
   */
  static async createModelHistory(data: CreateModelHistoryRequest): Promise<ModelHistory> {
    return apiRequest<ModelHistory>(this.BASE_PATH, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  /**
   * Retrieve a detection by ID from model history
   * GET /api/history-model/{id}
   */
  static async getModelHistoryById(id: number): Promise<ModelHistory> {
    return apiRequest<ModelHistory>(`${this.BASE_PATH}/${id}`)
  }

  /**
   * Lists all model history entries with optional pagination
   * GET /api/history-model
   */
  static async getAllModelHistory(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: "ASC" | "DESC"
  ): Promise<PaginatedResponse<ModelHistory>> {
    const params = new URLSearchParams()
    
    if (page !== undefined) params.append("page", page.toString())
    if (size !== undefined) params.append("size", size.toString())
    if (sortBy) params.append("sortBy", sortBy)
    if (sortDirection) params.append("sortDirection", sortDirection)

    const queryString = params.toString()
    const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH

    return apiRequest<PaginatedResponse<ModelHistory>>(endpoint)
  }

  /**
   * Deletes a model history entry
   * DELETE /api/history-model/{id}
   */
  static async deleteModelHistory(id: number): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${id}`, {
      method: "DELETE",
    })
  }

  /**
   * Search with advanced filters using GET
   * GET /api/history-model/search
   */
  static async searchModelHistory(
    filters: ModelHistoryFilters,
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: "ASC" | "DESC"
  ): Promise<PaginatedResponse<ModelHistory>> {
    const params = new URLSearchParams()

    // Add filters
    if (filters.userId !== undefined) params.append("userId", filters.userId.toString())
    if (filters.productId !== undefined) params.append("productId", filters.productId.toString())
    if (filters.success !== undefined) params.append("success", filters.success.toString())
    if (filters.userPhone) params.append("userPhone", filters.userPhone)
    if (filters.productModel) params.append("productModel", filters.productModel)
    if (filters.confidenceMin !== undefined) params.append("confidenceMin", filters.confidenceMin.toString())
    if (filters.confidenceMax !== undefined) params.append("confidenceMax", filters.confidenceMax.toString())
    if (filters.createdFrom) params.append("createdFrom", filters.createdFrom)
    if (filters.createdTo) params.append("createdTo", filters.createdTo)

    // Add pagination and sorting
    if (page !== undefined) params.append("page", page.toString())
    if (size !== undefined) params.append("size", size.toString())
    if (sortBy) params.append("sortBy", sortBy)
    if (sortDirection) params.append("sortDirection", sortDirection)

    const queryString = params.toString()
    const endpoint = queryString ? `${this.BASE_PATH}/search?${queryString}` : `${this.BASE_PATH}/search`

    return apiRequest<PaginatedResponse<ModelHistory>>(endpoint)
  }

  /**
   * Search with JSON body
   * POST /api/history-model/search
   */
  static async searchModelHistoryWithBody(
    filters: ModelHistoryFilters & {
      page?: number
      size?: number
      sortBy?: string
      sortDirection?: "ASC" | "DESC"
    }
  ): Promise<PaginatedResponse<ModelHistory>> {
    return apiRequest<PaginatedResponse<ModelHistory>>(`${this.BASE_PATH}/search`, {
      method: "POST",
      body: JSON.stringify(filters),
    })
  }

  /**
   * Helper method to get model history statistics
   */
  static async getModelHistoryStats(): Promise<{
    totalDetections: number
    successfulDetections: number
    failedDetections: number
    averageConfidence: number
    successRate: number
  }> {
    const response = await this.getAllModelHistory(0, 1000)
    const detections = response.content

    const totalDetections = detections.length
    const successfulDetections = detections.filter(d => d.success).length
    const failedDetections = totalDetections - successfulDetections
    const averageConfidence = detections.length > 0 
      ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length 
      : 0
    const successRate = totalDetections > 0 ? (successfulDetections / totalDetections) * 100 : 0

    return {
      totalDetections,
      successfulDetections,
      failedDetections,
      averageConfidence,
      successRate
    }
  }

  /**
   * Helper method to get recent detections
   */
  static async getRecentDetections(limit: number = 10): Promise<ModelHistory[]> {
    const response = await this.getAllModelHistory(0, limit, "createdAt", "DESC")
    return response.content
  }
}