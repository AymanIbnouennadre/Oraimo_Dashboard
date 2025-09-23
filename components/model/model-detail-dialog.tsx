"use client"

import * as React from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ModelHistory } from "@/lib/services/model-history-service"

function formatDate(dateString?: string): string {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface ModelDetailDialogProps {
  detection: ModelHistory | null
  user: {
    name: string
    phone: string
    email: string
    avatarUrl: string
  }
  product: {
    model: string
    marketingName: string
    retailPrice: number
    imageUrl: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ModelDetailDialog({ 
  detection, 
  user, 
  product, 
  isOpen, 
  onClose 
}: ModelDetailDialogProps) {
  if (!detection) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <span>Detection Details</span>
            <span className="text-muted-foreground">(ID: #{detection.id})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* AI Detection */}
          <Card>
            <CardHeader>
              <CardTitle>AI Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Detection Status</p>
                  <Badge variant={detection.success ? "default" : "destructive"}>
                    {detection.success ? "Success" : "Failed"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confidence Level</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getConfidenceColor(detection.confidence).split(' ')[0]}`}>
                        {(detection.confidence * 100).toFixed(2)}%
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User</CardTitle>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">Phone: {user.phone}</p>
                    <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product</CardTitle>
            </CardHeader>
            <CardContent>
              {product && (
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={product.imageUrl} alt={product.model} />
                    <AvatarFallback>{product.model[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">{product.marketingName}</p>
                    <p className="text-sm text-muted-foreground">Model: {product.model}</p>
                    <p className="text-sm text-muted-foreground">Retail Price: {product.retailPrice} MAD</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return "text-green-600"
  if (confidence >= 0.7) return "text-yellow-600"
  return "text-red-600"
}