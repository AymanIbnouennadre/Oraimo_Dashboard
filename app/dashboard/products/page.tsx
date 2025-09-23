"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, Grid3X3, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductsFilters } from "@/components/products/products-filters"
import { ProductFormDialog } from "@/components/products/product-form-dialog"
import { ProductViewDrawer } from "@/components/products/product-view-drawer"
import { ProductDeleteDialog } from "@/components/products/product-delete-dialog"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import type { Product, ProductFilter } from "@/lib/types"
import { productService } from "@/lib/services/product-service"

const ITEMS_PER_PAGE = 12

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<ProductFilter>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Load products from API
  const loadProducts = async () => {
    try {
      setError(null)
      const result = await productService.filter(
        filters,
        currentPage - 1,
        ITEMS_PER_PAGE,
      )
      
      setProducts(result.content)
      setTotalCount(result.totalElements)
      setTotalPages(result.totalPages)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Error loading products')
      setProducts([])
      setTotalCount(0)
      setTotalPages(0)
    }
  }

  // Load products on component mount 
  useEffect(() => {
    setIsLoading(true)
    loadProducts().finally(() => setIsLoading(false))
  }, [])

  // Load products when filters/page change without loading spinner
  useEffect(() => {
    if (currentPage > 1 || Object.keys(filters).length > 0) {
      loadProducts()
    }
  }, [filters, currentPage])

  // Handlers
  const handleFiltersChange = (newFilters: ProductFilter) => {
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

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDrawerOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormDialogOpen(true)
  }

  const handleDeleteProduct = (productId: number) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setProductToDelete(product)
      setIsDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = async (productId: number) => {
    try {
      setIsDeleting(true)
      await productService.delete(productId)
      await loadProducts()
      setProductToDelete(null)
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('Error deleting product')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await productService.update(selectedProduct.id, productData)
      } else {
        // Create new product - convert to CreateProductRequest format
        const createRequest = {
          classLabel: productData.classLabel || '',
          model: productData.model || '',
          marketingName: productData.marketingName || '',
          category: productData.category || '',
          retailPrice: productData.retailPrice || 0,
          finalCustomerPrice: productData.finalCustomerPrice || 0,
          image: productData.image || '',
          seuil: productData.seuil || 0,
          pointsGold: productData.pointsGold || 0,
          pointsSilver: productData.pointsSilver || 0,
          pointsBronze: productData.pointsBronze || 0,
        }
        await productService.create(createRequest)
      }
      
      // Reload products to show changes
      await loadProducts()
    } catch (err) {
      console.error('Error saving product:', err)
      throw new Error('Error saving product')
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay show={isLoading} />}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Manage your Oraimo product catalog</p>
        </div>
        <Button onClick={handleCreateProduct} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Products Grid with integrated filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products ({totalCount})</CardTitle>
              <CardDescription>Available product catalog</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filters integrated in card header */}
          <div className="pt-4">
            <ProductsFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 && !isLoading && !error ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {Object.keys(filters).length > 0 ? "Try modifying your filters" : "Start by adding your first product"}
              </p>
              {Object.keys(filters).length === 0 && (
                <Button onClick={handleCreateProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <ProductsGrid
              products={products}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductFormDialog
        product={selectedProduct}
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveProduct}
      />

      {/* Product View Drawer */}
      <ProductViewDrawer
        product={selectedProduct}
        open={isViewDrawerOpen}
        onOpenChange={setIsViewDrawerOpen}
        onEdit={handleEditProduct}
      />

      {/* Product Delete Dialog */}
      <ProductDeleteDialog
        product={productToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
