// User Management API Service
import type { 
  User, 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserFilter, 
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

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API Error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  return data
}

export const userService = {
  // 1. Get all users
  async getAll(): Promise<UserResponse[]> {
    return apiRequest<UserResponse[]>("/api/users")
  },

  // 2. Get user by ID
  async getById(id: number): Promise<UserResponse> {
    return apiRequest<UserResponse>(`/api/users/${id}`)
  },

  // 3. Create new user
  async create(userData: CreateUserRequest): Promise<UserResponse> {
    // Log the data being sent to match your API format
    console.log("Creating user with data:", JSON.stringify(userData, null, 2))
    
    const response = await apiRequest<UserResponse>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    
    console.log("User creation response:", JSON.stringify(response, null, 2))
    return response
  },

  // 4. Update user
  async update(id: number, userData: UpdateUserRequest): Promise<UserResponse> {
    return apiRequest<UserResponse>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },

  // 5. Delete user
  async delete(id: number): Promise<void> {
    await fetch(`${BACKEND_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
  },

  // 6. Search users with pagination and filters
  async search(
    filters: UserFilter = {},
    page: number = 0,
    size: number = 20,
    sort: string = "createdAt,desc"
  ): Promise<PaginatedResponse<UserResponse>> {
    try {
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("size", size.toString())
      params.append("sort", sort)
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const searchUrl = `/api/users/search?${params.toString()}`
      
      return await apiRequest<PaginatedResponse<UserResponse>>(searchUrl)
    } catch (error) {
      // Fallback: get all users and filter client-side
      try {
        const allUsersResponse = await apiRequest<any>('/api/users')
        
        // Handle different response structures
        let allUsers: UserResponse[] = []
        if (Array.isArray(allUsersResponse)) {
          allUsers = allUsersResponse
        } else if (allUsersResponse && Array.isArray(allUsersResponse.content)) {
          allUsers = allUsersResponse.content
        } else if (allUsersResponse && Array.isArray(allUsersResponse.users)) {
          allUsers = allUsersResponse.users
        } else {
          throw new Error('No valid user data found in API response')
        }
        
        // Apply client-side filtering
        let filteredUsers = allUsers
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          filteredUsers = filteredUsers.filter(user => 
            user.firstName?.toLowerCase().includes(searchTerm) ||
            user.lastName?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm) ||
            user.phone?.toLowerCase().includes(searchTerm)
          )
        }
        
        if (filters.role) {
          filteredUsers = filteredUsers.filter(user => user.role === filters.role)
        }
        
        if (filters.status) {
          filteredUsers = filteredUsers.filter(user => user.status === filters.status)
        }
        
        if (filters.storeTiers) {
          filteredUsers = filteredUsers.filter(user => user.storeTiers === filters.storeTiers)
        }
        
        // Return all filtered users (client-side pagination)
        return {
          content: filteredUsers,
          totalElements: filteredUsers.length,
          totalPages: 1,
          size: filteredUsers.length,
          number: 0,
          first: true,
          last: true
        }
      } catch (fallbackError) {
        throw new Error('Unable to load users from API')
      }
    }
  },

  // 7. Check if email exists
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/check-email?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  },

  // 8. Check if phone exists
  async checkPhoneExists(phone: string): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/check-phone?phone=${encodeURIComponent(phone)}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  },
}

// Export types for convenience
export type {
  User,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilter,
  PaginatedResponse,
}
