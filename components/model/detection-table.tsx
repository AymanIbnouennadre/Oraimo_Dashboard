"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Eye, Trash2, CheckCircle, XCircle, ImageIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ModelDetection } from "@/lib/types"

interface DetectionTableProps {
  detections: ModelDetection[]
  onDelete: (id: string) => void
}

export function DetectionTable({ detections, onDelete }: DetectionTableProps) {
  const [selectedDetection, setSelectedDetection] = useState<ModelDetection | null>(null)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const formatConfidence = (confidence: number) => `${(confidence * 100).toFixed(1)}%`

  return (
    <>
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-heading">Detection History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-medium">Product</TableHead>
                  <TableHead className="font-medium">User</TableHead>
                  <TableHead className="font-medium">Model Version</TableHead>
                  <TableHead className="font-medium">Confidence</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Image</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {detections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No detections found
                    </TableCell>
                  </TableRow>
                ) : (
                  detections.map((detection) => (
                    <TableRow key={detection.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{detection.product_name}</TableCell>
                      <TableCell>{detection.user_name}</TableCell>

                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {detection.model_version}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                detection.confidence >= 0.8
                                  ? "bg-emerald-500"
                                  : detection.confidence >= 0.6
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${detection.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{formatConfidence(detection.confidence)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={detection.success ? "default" : "destructive"}
                          className={`gap-1 ${
                            detection.success
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {detection.success ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {detection.success ? "Success" : "Failed"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground">{formatDate(detection.date)}</TableCell>

                      <TableCell>
                        {detection.image_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDetection(detection)}
                            className="h-8 w-8 p-0"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          {/* ✅ PAS de `asChild` : le Trigger rend un <button> natif qui supporte ref */}
                          <DropdownMenuTrigger
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label="Row actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-40 z-50">
                            <DropdownMenuItem
                              onClick={() => setSelectedDetection(detection)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(detection.id)}
                              className="gap-2 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detection Details Dialog */}
      <Dialog open={!!selectedDetection} onOpenChange={() => setSelectedDetection(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detection Details</DialogTitle>
          </DialogHeader>

          {selectedDetection && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Detection ID</label>
                    <p className="font-mono text-sm">{selectedDetection.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Product</label>
                    <p className="font-medium">{selectedDetection.product_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User</label>
                    <p className="font-medium">{selectedDetection.user_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Model Version</label>
                    <Badge variant="outline" className="font-mono">
                      {selectedDetection.model_version}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Confidence Score</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            selectedDetection.confidence >= 0.8
                              ? "bg-emerald-500"
                              : selectedDetection.confidence >= 0.6
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${selectedDetection.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-medium">{formatConfidence(selectedDetection.confidence)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div>
                      <Badge variant={selectedDetection.success ? "default" : "destructive"} className="gap-1">
                        {selectedDetection.success ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {selectedDetection.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="font-medium">{formatDate(selectedDetection.date)}</p>
                  </div>
                </div>
              </div>

              {selectedDetection.image_url && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Detection Image</label>
                  <div className="mt-2 border border-border rounded-lg overflow-hidden">
                    <img
                      src={selectedDetection.image_url || "/placeholder.svg"}
                      alt="Detection"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
