"use client"

import * as React from "react"
import { DetectionTable } from "@/components/model/detection-table"
import { ModelFilters } from "@/components/model/model-filters"
import { ModelDetailDialog } from "@/components/model/model-detail-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  AlertCircle,
  Activity
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  ModelHistory, 
  ModelHistoryService, 
  ModelHistoryFilters,
  ModelHistoryError 
} from "@/lib/services/model-history-service"
import { userService } from "@/lib/services/user-service"
import { productService } from "@/lib/services/product-service"
import { StockHistoryService } from "@/lib/services/stock-history"
import { formatNumber } from "@/lib/utils"

// Extend the ModelHistory type to include user and product
interface EnrichedModelHistory extends ModelHistory {
  user: {
    name: string;
    phone: string;
    email: string;
    avatarUrl: string;
  };
  product: {
    model: string;
    marketingName: string;
    retailPrice: number;
    imageUrl: string;
  };
}

interface ModelStats {
  totalDetections: number
  successfulDetections: number
  failedDetections: number
  averageConfidence: number
  successRate: number
}

export default function ModelPage() {
  const [detections, setDetections] = React.useState<ModelHistory[]>([])
  const [filteredDetections, setFilteredDetections] = React.useState<ModelHistory[]>([])
  const [stats, setStats] = React.useState<ModelStats>({
    totalDetections: 0,
    successfulDetections: 0,
    failedDetections: 0,
    averageConfidence: 0,
    successRate: 0
  })
  const [filters, setFilters] = React.useState<ModelHistoryFilters>({})
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSearching, setIsSearching] = React.useState(false)
  const [selectedDetection, setSelectedDetection] = React.useState<EnrichedModelHistory | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const { toast } = useToast()

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [totalElements, setTotalElements] = React.useState(0)
  const PAGE_SIZE = 10

  // Load initial data
  React.useEffect(() => {
    loadDetections()
    loadStats()
  }, [])

  // Enrichit une détection avec user, produit et mouvement stock
  const enrichDetection = async (detection: ModelHistory) => {
    let user = null
    let product = null
    let stockMovement = null
    try {
      user = await userService.getById(detection.userId)
    } catch {}
    try {
      product = await productService.getById(detection.productId)
    } catch {}
    try {
      // On suppose qu'il n'y a qu'un seul mouvement stock lié à une détection
      const stockResp = await StockHistoryService.searchStockHistory({ detectionId: detection.id })
      stockMovement = stockResp.content && stockResp.content.length > 0 ? stockResp.content[0] : null
    } catch {}
    return {
      ...detection,
      user,
      product,
      stockMovement
    }
  }

  const loadDetections = async (page = 0) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await ModelHistoryService.getAllModelHistory(
        page, 
        PAGE_SIZE, 
        "createdAt", 
        "DESC"
      )
      // Enrichir chaque détection
      const enriched = await Promise.all(response.content.map(enrichDetection))
      setDetections(enriched)
      setFilteredDetections(enriched)
      setCurrentPage(response.number)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Error loading detections:", error)
      const errorMessage = error instanceof ModelHistoryError 
        ? error.message 
        : "Failed to load model detections"
      setError(errorMessage)
      toast({
        title: "Error",
        description: `Failed to load detections: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await ModelHistoryService.getModelHistoryStats()
      setStats(statsData)
    } catch (error) {
      console.error("Error loading stats:", error)
      // Don't show error toast for stats, as it's not critical
    }
  }

  const searchDetections = async (searchFilters: ModelHistoryFilters) => {
    setIsSearching(true)
    setError(null)
    try {
      const response = await ModelHistoryService.searchModelHistory(
        searchFilters,
        0,
        PAGE_SIZE,
        "createdAt",
        "DESC"
      )
      // Enrichir chaque détection
      const enriched = await Promise.all(response.content.map(enrichDetection))
      setFilteredDetections(enriched)
      setCurrentPage(response.number)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
      toast({
        title: "Success",
        description: `Found ${response.totalElements} detection(s)`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error searching detections:", error)
      const errorMessage = error instanceof ModelHistoryError 
        ? error.message 
        : "Failed to search detections"
      setError(errorMessage)
      toast({
        title: "Error",
        description: `Search failed: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleFiltersChange = (newFilters: ModelHistoryFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    searchDetections(filters)
  }

  const handleDetectionDeleted = () => {
    // Refresh the current page
    if (Object.keys(filters).some(key => filters[key as keyof ModelHistoryFilters])) {
      searchDetections(filters)
    } else {
      loadDetections(currentPage)
    }
    loadStats() // Update stats after deletion
  }

  const handleViewDetails = async (detection: ModelHistory) => {
    try {
      const userResponse = await userService.getById(detection.userId);
      const productResponse = await productService.getById(detection.productId);

      const user = {
        name: `${userResponse.firstName} ${userResponse.lastName}`,
        phone: userResponse.phone || "N/A",
        email: userResponse.email || "N/A",
        avatarUrl: "placeholder-user.jpg", // Placeholder for avatar
      };

      const product = {
        model: productResponse.model || "Unknown Model",
        marketingName: productResponse.marketingName || "Unknown Product",
        retailPrice: productResponse.retailPrice || 0,
        imageUrl: productResponse.image || "placeholder-product.jpg", // Placeholder for image
      };

      setSelectedDetection({ ...detection, user, product });
    } catch (error) {
      console.error("Error enriching detection:", error);
      toast({
        title: "Error",
        description: "Failed to load additional details.",
        variant: "destructive",
      });
    }
  }

  const handleRefresh = () => {
    setFilters({})
    loadDetections(0)
    loadStats()
    toast({
      title: "Success",
      description: "Data refreshed",
      variant: "default",
    })
  }

  const handlePageChange = (page: number) => {
    if (Object.keys(filters).some(key => filters[key as keyof ModelHistoryFilters])) {
      // If filters are active, search with pagination
      setIsSearching(true)
      ModelHistoryService.searchModelHistory(
        filters,
        page,
        PAGE_SIZE,
        "createdAt",
        "DESC"
      ).then(response => {
        setFilteredDetections(response.content)
        setCurrentPage(response.number)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      }).catch(error => {
        console.error("Error changing page:", error)
        toast({
          title: "Error",
          description: "Failed to load page",
          variant: "destructive",
        })
      }).finally(() => {
        setIsSearching(false)
      })
    } else {
      // No filters, regular pagination
      loadDetections(page)
    }
  }

  const testAPI = async () => {
    try {
      toast({
        title: "Info",
        description: "Testing API connection...",
        variant: "default",
      })
      const testResult = await ModelHistoryService.getAllModelHistory(0, 1)
      toast({
        title: "Success",
        description: `API Test Success! Found ${testResult.totalElements} records`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `API Test Failed: ${error instanceof ModelHistoryError ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Model Detection History</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor AI model detection results and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={testAPI} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Test API
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" disabled={filteredDetections.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center space-x-2 pt-6">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Error loading data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setError(null)
                handleRefresh()
              }}
              className="ml-auto"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <ModelFilters
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        isLoading={isSearching || isLoading}
      />

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <span>Total: {formatNumber(totalElements)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <span>Page: {currentPage + 1} of {totalPages || 1}</span>
          </Badge>
        </div>
        
        {Object.keys(filters).some(key => filters[key as keyof ModelHistoryFilters]) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setFilters({})
              loadDetections(0)
            }}
            disabled={isLoading || isSearching}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Detection Table */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <DetectionTable
          detections={filteredDetections}
          onDetectionDeleted={handleDetectionDeleted}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || isSearching}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isSearching}
                >
                  {pageNum + 1}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || isSearching}
          >
            Next
          </Button>
        </div>
      )}

      {/* Model Detail Dialog */}
      <ModelDetailDialog
        detection={selectedDetection}
        user={selectedDetection?.user!}
        product={selectedDetection?.product!}
        isOpen={!!selectedDetection}
        onClose={() => setSelectedDetection(null)}
      />
    </div>
  )
}