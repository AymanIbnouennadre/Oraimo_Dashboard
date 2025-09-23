"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, Trash2, Package, Eye } from "lucide-react"
import type { Product } from "@/lib/types"
import Image from "next/image"

interface ProductsGridProps {
  products: Product[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
}

export function ProductsGrid({ products, currentPage, totalPages, onPageChange, onView, onEdit, onDelete }: ProductsGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(price)
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-square relative bg-gray-50 overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.marketingName}
                    fill
                    className="object-contain p-4 hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm line-clamp-2">{product.marketingName}</h3>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                      onClick={() => onView(product)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-green-100"
                      onClick={() => onEdit(product)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-red-100"
                      onClick={() => onDelete(product.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Model: {product.model}</p>
                </div>

                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{product.category}</Badge>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Selling Price</span>
                    <span className="font-medium">{formatPrice(product.finalCustomerPrice)}</span>
                  </div>
                  {product.retailPrice !== product.finalCustomerPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Purchase Price</span>
                      <span className="text-xs text-muted-foreground">
                        {formatPrice(product.retailPrice)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium">Points by tier:</p>
                  <div className="flex gap-1">
                    <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 text-xs">
                      Gold: {product.pointsGold}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 text-xs">
                      Silver: {product.pointsSilver}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 text-xs">
                      Bronze: {product.pointsBronze}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) onPageChange(currentPage - 1)
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(page)
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) onPageChange(currentPage + 1)
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}
