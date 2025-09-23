"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, X, Edit } from "lucide-react"
import type { Product } from "@/lib/types"
import Image from "next/image"

interface ProductViewDrawerProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (product: Product) => void
}

export function ProductViewDrawer({ product, open, onOpenChange, onEdit }: ProductViewDrawerProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(price)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">{product.marketingName}</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {product.model} • ID #{product.id}
                  </p>
                </div>
              </div>
              <Button onClick={() => onEdit(product)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Product Image */}
              <div className="lg:col-span-1">
                <div className="sticky top-0">
                  <div className="aspect-square relative bg-white rounded-xl overflow-hidden border shadow-sm">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.marketingName}
                        fill
                        className="object-contain p-6 hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-20 w-20 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Package className="h-5 w-5 text-primary" />
                    Product Information
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Class Label</label>
                        <p className="text-sm font-medium mt-1">{product.classLabel}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</label>
                        <div className="mt-1">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stock Threshold</label>
                        <p className="text-sm mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {product.seuil} units minimum
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Points Gold Tier</label>
                        <div className="mt-1">
                          <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 text-sm px-3 py-1">
                            {product.pointsGold} points
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Points Silver Tier</label>
                        <div className="mt-1">
                          <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 text-sm px-3 py-1">
                            {product.pointsSilver} points
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Points Bronze Tier</label>
                        <div className="mt-1">
                          <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 text-sm px-3 py-1">
                            {product.pointsBronze} points
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Package className="h-5 w-5 text-primary" />
                    Pricing Details
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <label className="text-xs font-medium text-green-700 uppercase tracking-wide">Final Customer Price</label>
                      <p className="text-xl font-semibold text-green-800 mt-1">{formatPrice(product.finalCustomerPrice)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Retail Price</label>
                      <p className="text-xl font-semibold text-gray-800 mt-1">{formatPrice(product.retailPrice)}</p>
                    </div>
                  </div>
                </div>



                {/* Metadata */}
                {(product.createdAt || product.updatedAt) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <Package className="h-5 w-5 text-primary" />
                        Timeline
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 text-sm">
                        {product.createdAt && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</label>
                            <p className="mt-1 font-mono text-muted-foreground">{formatDate(product.createdAt)}</p>
                          </div>
                        )}
                        {product.updatedAt && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Modified</label>
                            <p className="mt-1 font-mono text-muted-foreground">{formatDate(product.updatedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}