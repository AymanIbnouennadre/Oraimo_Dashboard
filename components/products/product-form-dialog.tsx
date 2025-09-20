"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormDialogProps {
  product?: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: Partial<Product>) => Promise<void>
}

export function ProductFormDialog({ product, open, onOpenChange, onSave }: ProductFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    classLabel: "",
    model: "",
    marketingName: "",
    category: "",
    retailPrice: "",
    finalCustomerPrice: "",
    pointsGold: "",
    pointsSilver: "",
    pointsBronze: "",
    image: "",
    seuil: "",
  })

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        // Edit mode
        setFormData({
          classLabel: product.classLabel,
          model: product.model,
          marketingName: product.marketingName,
          category: product.category,
          retailPrice: product.retailPrice.toString(),
          finalCustomerPrice: product.finalCustomerPrice.toString(),
          pointsGold: product.pointsGold.toString(),
          pointsSilver: product.pointsSilver.toString(),
          pointsBronze: product.pointsBronze.toString(),
          image: product.image || "",
          seuil: product.seuil.toString(),
        })
      } else {
        // Create mode
        setFormData({
          classLabel: "",
          model: "",
          marketingName: "",
          category: "",
          retailPrice: "",
          finalCustomerPrice: "",
          pointsGold: "",
          pointsSilver: "",
          pointsBronze: "",
          image: "",
          seuil: "",
        })
      }
      setError("")
    }
  }, [open, product])

  const validateForm = () => {
    if (!formData.classLabel.trim()) return "Class Label is required"
    if (!formData.model.trim()) return "Model is required"
    if (!formData.marketingName.trim()) return "Marketing name is required"
    if (!formData.category) return "Category is required"

    const retailPrice = Number.parseFloat(formData.retailPrice)
    const finalPrice = Number.parseFloat(formData.finalCustomerPrice)
    const pointsGold = Number.parseInt(formData.pointsGold)
    const pointsSilver = Number.parseInt(formData.pointsSilver)
    const pointsBronze = Number.parseInt(formData.pointsBronze)
    const seuil = Number.parseInt(formData.seuil)

    if (isNaN(retailPrice) || retailPrice < 0) return "Retail price must be a positive number"
    if (isNaN(finalPrice) || finalPrice < 0) return "Selling price must be a positive number"
    if (isNaN(pointsGold) || pointsGold < 0) return "Gold points must be a positive number"
    if (isNaN(pointsSilver) || pointsSilver < 0) return "Silver points must be a positive number"
    if (isNaN(pointsBronze) || pointsBronze < 0) return "Bronze points must be a positive number"
    if (isNaN(seuil) || seuil < 0) return "Threshold must be a positive number"

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const productData: Partial<Product> = {
        classLabel: formData.classLabel.trim(),
        model: formData.model.trim(),
        marketingName: formData.marketingName.trim(),
        category: formData.category,
        retailPrice: Number.parseFloat(formData.retailPrice),
        finalCustomerPrice: Number.parseFloat(formData.finalCustomerPrice),
        pointsGold: Number.parseInt(formData.pointsGold),
        pointsSilver: Number.parseInt(formData.pointsSilver),
        pointsBronze: Number.parseInt(formData.pointsBronze),
        image: formData.image.trim() || undefined,
        seuil: Number.parseInt(formData.seuil),
      }

      if (product) {
        productData.id = product.id
      }

      await onSave(productData)
      onOpenChange(false)
    } catch (err) {
      setError("An error occurred while saving")
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Edit product information" : "Create a new product in the catalog"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="classLabel">Class Label *</Label>
              <Input
                id="classLabel"
                value={formData.classLabel}
                onChange={(e) => updateField("classLabel", e.target.value)}
                placeholder="ORA-XXX-001"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => updateField("model", e.target.value)}
                placeholder="FreePods 3"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketingName">Marketing Name *</Label>
            <Input
              id="marketingName"
              value={formData.marketingName}
              onChange={(e) => updateField("marketingName", e.target.value)}
              placeholder="Oraimo FreePods 3 - Wireless Earbuds"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Chargeurs">Chargers</SelectItem>
                <SelectItem value="Accessoires">Accessories</SelectItem>
                <SelectItem value="Wearables">Wearables</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="retailPrice">Retail Price (MAD) *</Label>
              <Input
                id="retailPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.retailPrice}
                onChange={(e) => updateField("retailPrice", e.target.value)}
                placeholder="79.99"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalCustomerPrice">Selling Price (MAD) *</Label>
              <Input
                id="finalCustomerPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.finalCustomerPrice}
                onChange={(e) => updateField("finalCustomerPrice", e.target.value)}
                placeholder="59.99"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="pointsGold">Points Gold *</Label>
              <Input
                id="pointsGold"
                type="number"
                min="0"
                value={formData.pointsGold}
                onChange={(e) => updateField("pointsGold", e.target.value)}
                placeholder="120"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsSilver">Points Silver *</Label>
              <Input
                id="pointsSilver"
                type="number"
                min="0"
                value={formData.pointsSilver}
                onChange={(e) => updateField("pointsSilver", e.target.value)}
                placeholder="100"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsBronze">Points Bronze *</Label>
              <Input
                id="pointsBronze"
                type="number"
                min="0"
                value={formData.pointsBronze}
                onChange={(e) => updateField("pointsBronze", e.target.value)}
                placeholder="80"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seuil">Seuil *</Label>
            <Input
              id="seuil"
              type="number"
              min="0"
              value={formData.seuil}
              onChange={(e) => updateField("seuil", e.target.value)}
              placeholder="10"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL {!product && "*"}</Label>
            <Input
              id="image"
              type="text"
              value={formData.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="https://example.com/image.jpg (optionnel)"
              disabled={isLoading}
              required={!product && !formData.image}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
