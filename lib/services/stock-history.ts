// Stock History Management API Service
import type { 
  StockHistory,
  CreateStockHistoryRequest,
  UpdateStockHistoryRequest,
  StockHistoryFilters,
  PaginatedResponse 
} from "@/lib/types"

const BACKEND_URL = ""

// Helper function to get auth token from cookies
function getAuthToken(): string | null {
  if (typeof document === "undefined") return null
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("oraimo_token="))
    ?.split("=")[1] ?? null
}

// Custom error class for API errors
export class StockHistoryError extends Error {
  constructor(
    message: string,
    public status: number,
    public originalError?: any
  ) {
    super(message)
    this.name = 'StockHistoryError'
  }
}

// Helper function to parse error messages
function parseErrorMessage(status: number, errorData: any): string {
  // Handle different error scenarios with English messages
  if (status === 400) {
    // Check for specific error patterns from the backend
    if (typeof errorData === 'string') {
      if (errorData.includes('délai de 24h') || errorData.includes('24h')) {
        return 'Update denied: The 24-hour deadline after creation has expired.'
      }
      if (errorData.includes('refusée') || errorData.includes('refused')) {
        return 'Update request denied by the server.'
      }
    }
    
    if (errorData?.message) {
      const msg = errorData.message.toLowerCase()
      if (msg.includes('délai de 24h') || msg.includes('24h')) {
        return 'Update denied: The 24-hour deadline after creation has expired.'
      }
      if (msg.includes('refusée') || msg.includes('refused')) {
        return 'Update request denied by the server.'
      }
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
    return 'Stock movement not found.'
  }
  
  if (status === 409) {
    return 'Conflict: The stock movement conflicts with existing data.'
  }
  
  if (status >= 500) {
    return 'Server error: Please try again later or contact support.'
  }
  
  return `Request failed with status ${status}. Please try again.`
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
      throw new StockHistoryError(errorMessage, response.status, errorData)
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  } catch (error) {
    // Re-throw StockHistoryError as is
    if (error instanceof StockHistoryError) {
      throw error
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new StockHistoryError(
        'Network error: Please check your connection and try again.',
        0,
        error
      )
    }
    
    // Handle other errors
    throw new StockHistoryError(
      'An unexpected error occurred. Please try again.',
      0,
      error
    )
  }
}

export class StockHistoryService {
  private static readonly BASE_PATH = "/api/history-stock"

  /**
   * Create a new stock history entry
   * POST /api/history-stock
   */
  static async createStockHistory(data: CreateStockHistoryRequest): Promise<StockHistory> {
    return apiRequest<StockHistory>(this.BASE_PATH, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  /**
   * Retrieve a stock history entry by ID
   * GET /api/history-stock/{id}
   */
  static async getStockHistoryById(id: number): Promise<StockHistory> {
    return apiRequest<StockHistory>(`${this.BASE_PATH}/${id}`)
  }

  /**
   * List all stock history with optional pagination
   * GET /api/history-stock
   */
  static async getAllStockHistory(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: "ASC" | "DESC"
  ): Promise<PaginatedResponse<StockHistory>> {
    const params = new URLSearchParams()
    
    if (page !== undefined) params.append("page", page.toString())
    if (size !== undefined) params.append("size", size.toString())
    if (sortBy) params.append("sortBy", sortBy)
    if (sortDirection) params.append("sortDirection", sortDirection)

    const queryString = params.toString()
    const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH

    return apiRequest<PaginatedResponse<StockHistory>>(endpoint)
  }

  /**
   * Update an existing stock history entry
   * PUT /api/history-stock/{id}
   */
  static async updateStockHistory(id: number, data: UpdateStockHistoryRequest): Promise<StockHistory> {
    return apiRequest<StockHistory>(`${this.BASE_PATH}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  /**
   * Delete a stock history entry
   * DELETE /api/history-stock/{id}
   */
  static async deleteStockHistory(id: number): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${id}`, {
      method: "DELETE",
    })
  }

  /**
   * Search with advanced filters
   * GET /api/history-stock/search
   */
  static async searchStockHistory(
    filters: StockHistoryFilters,
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: "ASC" | "DESC"
  ): Promise<PaginatedResponse<StockHistory>> {
    const params = new URLSearchParams()

    // Add filters
    if (filters.movementType) params.append("movementType", filters.movementType)
    if (filters.createdFrom) params.append("createdFrom", filters.createdFrom)
    if (filters.createdTo) params.append("createdTo", filters.createdTo)
    if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString())
    if (filters.minQuantity !== undefined) params.append("minQuantity", filters.minQuantity.toString())
    if (filters.maxQuantity !== undefined) params.append("maxQuantity", filters.maxQuantity.toString())
    if (filters.modelLike) params.append("modelLike", filters.modelLike)
    if (filters.detectionId !== undefined) params.append("detectionId", filters.detectionId.toString())
    if (filters.userNameLike) params.append("userNameLike", filters.userNameLike)

    // Add pagination and sorting parameters
    if (page !== undefined) params.append("page", page.toString())
    if (size !== undefined) params.append("size", size.toString())
    if (sortBy) params.append("sortBy", sortBy)
    if (sortDirection) params.append("sortDirection", sortDirection)

    const queryString = params.toString()
    const endpoint = queryString ? `${this.BASE_PATH}/search?${queryString}` : `${this.BASE_PATH}/search`

    return apiRequest<PaginatedResponse<StockHistory>>(endpoint)
  }

  /**
   * Helper method to get stock history statistics
   */
  static async getStockHistoryStats(): Promise<{
    totalMovements: number
    totalPurchases: number
    totalSales: number
    totalAmount: number
  }> {
    // This method could be implemented with a dedicated statistics API
    // For now, we simulate by retrieving all data
    const response = await this.getAllStockHistory(0, 1000)
    const movements = response.content

    const stats = {
      totalMovements: movements.length,
      totalPurchases: movements.filter(m => m.movementType === "Purchase").length,
      totalSales: movements.filter(m => m.movementType === "Sale").length,
      totalAmount: movements.reduce((sum, m) => sum + (m.price * m.quantity), 0)
    }

    return stats
  }

  /**
   * Helper method to get recent stock movements
   */
  static async getRecentMovements(limit: number = 10): Promise<StockHistory[]> {
    const response = await this.getAllStockHistory(0, limit, "createdAt", "DESC")
    return response.content
  }


}