"use client"

import * as React from "react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Target,
  User,
  Package,
  Calendar,
  Phone,
  TrendingUp
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ModelHistory, ModelHistoryService, ModelHistoryError } from "@/lib/services/model-history-service"
import { formatNumber } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface DetectionTableProps {
  detections: ModelHistory[]
  onDetectionDeleted: () => void
  onViewDetails: (detection: ModelHistory) => void
}

export function DetectionTable({ 
  detections, 
  onDetectionDeleted,
  onViewDetails 
}: DetectionTableProps) {
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deletingDetection, setDeletingDetection] = React.useState<ModelHistory | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDeleteClick = (detection: ModelHistory) => {
    setDeletingDetection(detection)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingDetection) return

    setIsDeleting(true)
    try {
      await ModelHistoryService.deleteModelHistory(deletingDetection.id)
      toast({
        title: "Success",
        description: "Detection deleted successfully!",
        variant: "default",
      })
      onDetectionDeleted()
    } catch (error) {
      console.error("Error deleting detection:", error)
      if (error instanceof ModelHistoryError) {
        toast({
          title: "Delete Failed",
          description: `Delete failed: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete detection",
          variant: "destructive",
        })
      }
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setDeletingDetection(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600 bg-green-50"
    if (confidence >= 0.7) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 0.9) return "default"
    if (confidence >= 0.7) return "secondary"
    return "destructive"
  }

  if (detections.length === 0) {
    return (
      <div className="border rounded-lg p-12">
        <div className="text-center">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">No detections found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No model detection entries match your current filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="shadow-md rounded-lg">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-12 text-center">ID</TableHead>
                <TableHead className="text-center">User</TableHead>
                <TableHead className="text-center">Product</TableHead>
                <TableHead className="text-center">Confidence</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="w-12 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detections.map((detection) => (
                <TableRow key={detection.id} className="hover:bg-muted/50 text-center">
                  <TableCell className="font-medium text-center">#{detection.id}</TableCell>

                  {/* User Info */}
                  <TableCell className="text-center">
                    <div>
                      <p className="font-medium">{detection.userPhone}</p>
                    </div>
                  </TableCell>

                  {/* Product Info */}
                  <TableCell className="text-center">
                    <div>
                      <p className="font-medium">{detection.productModel}</p>
                    </div>
                  </TableCell>

                  {/* Confidence */}
                  <TableCell className="text-center">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className={`text-sm font-semibold ${getConfidenceColor(detection.confidence).split(' ')[0]}`}>
                          {Math.round(detection.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            detection.confidence >= 0.9 ? "bg-green-500" :
                            detection.confidence >= 0.7 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${detection.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Result */}
                  <TableCell className="text-center">
                    <Badge variant={detection.success ? "default" : "destructive"}>
                      {detection.success ? "Success" : "Failed"}
                    </Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-center">
                    <p className="text-sm text-muted-foreground">{formatDate(detection.createdAt)}</p>
                  </TableCell>

                  {/* Details */}
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(detection)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Detection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete detection #{deletingDetection?.id}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}