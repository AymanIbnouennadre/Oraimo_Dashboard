// Product Management API Service
import type { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductFilter, 
  PaginatedResponse 
} from "@/lib/types"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"

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

export const productService = {
  // 1. Get all products
  async getAll(): Promise<Product[]> {
    return apiRequest<Product[]>("/api/products")
  },

  // 2. Get product by ID
  async getById(id: number): Promise<Product> {
    return apiRequest<Product>(`/api/products/${id}`)
  },

  // 3. Create new product
  async create(productData: CreateProductRequest): Promise<Product> {
    console.log("Creating product with data:", JSON.stringify(productData, null, 2))
    
    const response = await apiRequest<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
    
    console.log("Product creation response:", JSON.stringify(response, null, 2))
    return response
  },

  // 4. Update product
  async update(id: number, productData: UpdateProductRequest): Promise<Product> {
    return apiRequest<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  },

  // 5. Delete product
  async delete(id: number): Promise<void> {
    await apiRequest<void>(`/api/products/${id}`, {
      method: "DELETE",
    })
  },

  // 6. Filter products with pagination
  async filter(
    filters: ProductFilter = {},
    page: number = 0,
    size: number = 20,
    sort: string = "createdAt,desc"
  ): Promise<PaginatedResponse<Product>> {
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

      const filterUrl = `/api/products/filter?${params.toString()}`
      
      return await apiRequest<PaginatedResponse<Product>>(filterUrl)
    } catch (error) {
      // Fallback: get all products and filter client-side
      try {
        const allProductsResponse = await apiRequest<any>('/api/products')
        
        // Handle different response structures
        let allProducts: Product[] = []
        if (Array.isArray(allProductsResponse)) {
          allProducts = allProductsResponse
        } else if (allProductsResponse && Array.isArray(allProductsResponse.content)) {
          allProducts = allProductsResponse.content
        } else if (allProductsResponse && Array.isArray(allProductsResponse.products)) {
          allProducts = allProductsResponse.products
        } else {
          throw new Error('No valid product data found in API response')
        }
        
        // Apply client-side filtering
        let filteredProducts = allProducts
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          filteredProducts = filteredProducts.filter(product => 
            product.classLabel?.toLowerCase().includes(searchTerm) ||
            product.model?.toLowerCase().includes(searchTerm) ||
            product.marketingName?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm)
          )
        }
        
        if (filters.category) {
          filteredProducts = filteredProducts.filter(product => 
            product.category === filters.category
          )
        }
        
        if (filters.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.retailPrice >= filters.minPrice!
          )
        }
        
        if (filters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.retailPrice <= filters.maxPrice!
          )
        }
        
        if (filters.minSeuil !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.seuil >= filters.minSeuil!
          )
        }
        
        if (filters.maxSeuil !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.seuil <= filters.maxSeuil!
          )
        }
        
        // Return all filtered products (client-side pagination)
        return {
          content: filteredProducts,
          totalElements: filteredProducts.length,
          totalPages: 1,
          size: filteredProducts.length,
          number: 0,
          first: true,
          last: true
        }
      } catch (fallbackError) {
        throw new Error('Unable to load products from API')
      }
    }
  },
}

// Export types for convenience
export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilter,
  PaginatedResponse,
}