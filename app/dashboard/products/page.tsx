"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, Grid3X3 } from "lucide-react"
import { SectionTabs } from "@/components/layout/section-tabs"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductsFilters } from "@/components/products/products-filters"
import { ProductFormDialog } from "@/components/products/product-form-dialog"
import type { Product, FilterOptions } from "@/lib/types"

import mockProductsData from "@/lib/mocks/products.json"

const ITEMS_PER_PAGE = 12

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>(mockProductsData as Product[])
  const [filters, setFilters] = useState<FilterOptions>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)

  // Filter and paginate products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.marketing_name.toLowerCase().includes(searchLower) ||
          product.model.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower),
      )
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category)
    }

    // Apply price filters
    if (filters.min_price !== undefined) {
      filtered = filtered.filter((product) => product.final_price >= filters.min_price!)
    }

    if (filters.max_price !== undefined) {
      filtered = filtered.filter((product) => product.final_price <= filters.max_price!)
    }

    return filtered
  }, [products, filters])

  // Paginate filtered results
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  // Handlers - all static now
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setIsFormDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormDialogOpen(true)
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      // Update existing product
      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...p, ...productData } : p)))
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productData,
        created: new Date().toISOString(),
      } as Product

      setProducts((prev) => [newProduct, ...prev])
    }
  }

  const handleDeleteProduct = (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  // Calculate stats
  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.final_price, 0)
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0
  const categories = [...new Set(products.map((p) => p.category))].length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Manage your Oraimo product catalog</p>
        </div>
        <Button onClick={handleCreateProduct}>
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Button>
      </div>

      {/* Section Tabs */}
      <SectionTabs section="products" />

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Statistics
          </CardTitle>
          <CardDescription>Catalog overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{categories}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(avgPrice)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalValue)}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <ProductsFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
              <CardDescription>Available product catalog</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProductsGrid
            products={paginatedProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductFormDialog
        product={selectedProduct}
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
