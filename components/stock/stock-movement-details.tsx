"use client"

import * as React from "react"
import Image from "next/image"
import { formatNumber } from "@/lib/utils"
import { User, Package, Activity, Phone, MapPin, CheckCircle, XCircle, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { StockHistory, Detection } from '@/lib/types'
import { ModelHistoryService } from '@/lib/services/model-history-service'
import { StockHistoryService } from '@/lib/services/stock-history'
import { productService } from '@/lib/services/product-service'
import { userService } from '@/lib/services/user-service'
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  movementId: number
}

interface DetailedMovement extends StockHistory {
  productMarketingName?: string
  productImage?: string
  productRetailPrice?: number
  productFinalCustomerPrice?: number
  productPoints?: number
  pointsStoreTier?: string
  userName?: string
  userFullName?: string
  userEmail?: string
  userAddress?: string
  userTier?: string
  detection?: Detection
}

export function StockMovementDetails({ movementId }: Props) {
  const [movement, setMovement] = React.useState<DetailedMovement | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadMovementDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const stockMovement = await StockHistoryService.getStockHistoryById(movementId)
        const user = await userService.getById(stockMovement.userId)
        const product = await productService.getById(stockMovement.productId)
        
        // Fetch product points based on user tier
        let productPoints: number | undefined
        let pointsStoreTier: string | undefined
        try {
          // Get auth token from cookies like other services
          const getAuthToken = (): string | null => {
            if (typeof document === "undefined") return null
            return document.cookie
              .split("; ")
              .find((row) => row.startsWith("oraimo_token="))
              ?.split("=")[1] ?? null
          }

          const token = getAuthToken()
          const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net"
          
          const pointsResponse = await fetch(`${BACKEND_URL}/api/products/users/${stockMovement.userId}/products/${stockMovement.productId}/points`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` }),
            },
          })
          
          console.log("Points API status:", pointsResponse.status)
          if (pointsResponse.ok) {
            const pointsData = await pointsResponse.json()
            console.log("Points API response:", pointsData)
            productPoints = pointsData.points
            pointsStoreTier = pointsData.storeTier
            console.log("Extracted points:", productPoints, "storeTier:", pointsStoreTier)
          } else {
            console.error("Points API error:", pointsResponse.status, await pointsResponse.text())
          }
        } catch (pointsError) {
          console.error("Could not load product points:", pointsError)
        }
        
        let detection: Detection | undefined
        if (stockMovement.detectionId) {
          try {
            detection = await ModelHistoryService.getModelHistoryById(stockMovement.detectionId)
          } catch (detectionError) {
            console.warn("Could not load detection details:", detectionError)
          }
        }

        const enrichedMovement: DetailedMovement = {
          ...stockMovement,
          productMarketingName: product.marketingName,
          productImage: product.image,
          productRetailPrice: product.retailPrice,
          productFinalCustomerPrice: product.finalCustomerPrice,
          productPoints: productPoints,
          pointsStoreTier: pointsStoreTier,
          userName: `${user.firstName} ${user.lastName}`,
          userFullName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userAddress: user.address,
          userTier: user.storeTiers,
          detection
        }

        setMovement(enrichedMovement)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data")
      } finally {
        setLoading(false)
      }
    }

    loadMovementDetails()
  }, [movementId])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Loading Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!movement) {
    return (
      <div className="p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Movement Not Found</h3>
          <p className="text-gray-500">No data available for this movement</p>
        </div>
      </div>
    )
  }

  const isPurchase = movement.movementType === "Purchase"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case "GOLD": return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "SILVER": return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case "BRONZE": return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full space-y-3 p-3 bg-white">
      {/* Transaction */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Transaction</h2>
          </div>
          <Badge className={isPurchase ? "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm font-medium" : "bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-sm font-medium"}>
            {movement.movementType}
          </Badge>
        </div>
        
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Quantity</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(movement.quantity)}</p>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1 whitespace-nowrap">
              {isPurchase ? "Points Per Unit" : "Final Customer Price"}
            </p>
            {isPurchase ? (
              <div>
                <p className="text-lg font-bold text-blue-600">{formatNumber(movement.productPoints || 0)}</p>
                <p className="text-xs font-medium text-blue-600">pts</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold text-orange-600">{formatNumber(movement.productFinalCustomerPrice || 0)}</p>
                <p className="text-xs font-medium text-orange-600">MAD</p>
              </div>
            )}
          </div>
          
          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 uppercase font-medium mb-1 whitespace-nowrap">Total Gain</p>
            {isPurchase ? (
              <div>
                <p className="text-lg font-bold text-green-700">{formatNumber((movement.productPoints || 0) * movement.quantity)}</p>
                <p className="text-xs font-medium text-green-600">pts</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold text-green-700">{formatNumber((movement.productFinalCustomerPrice || 0) * movement.quantity)}</p>
                <p className="text-xs font-medium text-green-600">MAD</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">{formatDate(movement.createdAt)}</p>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
          </div>
          <Badge className={`${getTierBadgeClass(movement.userTier || '')} px-3 py-1 text-sm font-medium`}>
            {movement.userTier}
          </Badge>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${movement.userName}`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                {movement.userName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-2 md:space-y-0">
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Full Name</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm ml-3">{movement.userFullName}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm ml-4">{movement.userPhone}</p>
                </div>
              </div>
              
              {(movement.userEmail || movement.userAddress) && (
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-2 md:space-y-0">
                  {movement.userEmail && (
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-gray-500 text-xs font-bold">@</span>
                        <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm ml-3 truncate">{movement.userEmail}</p>
                    </div>
                  )}
                  
                  {movement.userAddress && (
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <p className="text-xs text-gray-500 uppercase font-medium">Address</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm ml-4">{movement.userAddress}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center mb-4">
          <Package className="w-5 h-5 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Product</h2>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {movement.productImage ? (
                <Image
                  src={movement.productImage.startsWith('/') ? movement.productImage : `/${movement.productImage}`}
                  alt={movement.productMarketingName || 'Product'}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                  sizes="80px"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <Package className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Marketing Name</p>
                <p className="text-lg font-bold text-gray-900">{movement.productMarketingName}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Model</p>
                <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-md">
                  <p className="text-sm text-gray-600 font-mono">{movement.productModel}</p>
                </div>
              </div>
            </div>
            
            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Price - Retail for Purchase or Final Customer for Sale */}
              <div>
                {isPurchase && movement.productRetailPrice && (
                  <>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Retail Price</p>
                    <p className="text-lg font-bold text-green-600">{formatNumber(movement.productRetailPrice)} MAD</p>
                  </>
                )}
                {!isPurchase && movement.productFinalCustomerPrice && (
                  <>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Final Customer Price</p>
                    <p className="text-lg font-bold text-orange-600">{formatNumber(movement.productFinalCustomerPrice)} MAD</p>
                  </>
                )}
              </div>

              {/* Product Points */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Points</p>
                  <div className={`px-2 py-0.5 text-xs font-medium rounded ${getTierBadgeClass(movement.pointsStoreTier || movement.userTier || '')}`}>
                    {movement.pointsStoreTier || movement.userTier || 'N/A'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-bold text-blue-600">{formatNumber(movement.productPoints || 0)}</p>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Detection */}
      {movement.detection && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">AI Detection</h2>
            </div>
            <Badge variant={movement.detection.success ? "default" : "destructive"} className="px-3 py-1 text-sm font-medium">
              {movement.detection.success ? "Success" : "Failed"}
            </Badge>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="text-center">
                {movement.detection.success ? (
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600 mx-auto" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Confidence Level</p>
                  <div className="space-y-2">
                    <span className={`text-2xl font-bold ${getConfidenceColor(movement.detection.confidence)}`}>
                      {Math.round(movement.detection.confidence * 100)}%
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          movement.detection.confidence >= 0.9 ? "bg-green-500" :
                          movement.detection.confidence >= 0.7 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${movement.detection.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {movement.detection.model_version && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Model Version</p>
                      <p className="font-semibold text-gray-900 text-sm">{movement.detection.model_version}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Detection ID</p>
                    <div className="inline-flex items-center bg-gray-100 px-2 py-1 rounded">
                      <p className="font-semibold text-gray-900 text-sm">#{movement.detectionId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4 p-4 bg-white">
      {/* Transaction Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
        <div className="text-right">
          <Skeleton className="h-4 w-32 ml-auto" />
        </div>
      </div>
      
      {/* Customer Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex items-start space-x-4">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-5 mr-2" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-start space-x-4">
          <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
