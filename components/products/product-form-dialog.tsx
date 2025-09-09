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
    sku: "",
    model: "",
    marketing_name: "",
    category: "",
    retail_price: "",
    final_price: "",
    points_gold: "",
    points_silver: "",
    points_bronze: "",
    image_url: "",
  })

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        // Edit mode
        setFormData({
          sku: product.sku,
          model: product.model,
          marketing_name: product.marketing_name,
          category: product.category,
          retail_price: product.retail_price.toString(),
          final_price: product.final_price.toString(),
          points_gold: product.points_gold.toString(),
          points_silver: product.points_silver.toString(),
          points_bronze: product.points_bronze.toString(),
          image_url: product.image_url || "",
        })
      } else {
        // Create mode
        setFormData({
          sku: "",
          model: "",
          marketing_name: "",
          category: "",
          retail_price: "",
          final_price: "",
          points_gold: "",
          points_silver: "",
          points_bronze: "",
          image_url: "",
        })
      }
      setError("")
    }
  }, [open, product])

  const validateForm = () => {
    if (!formData.sku.trim()) return "Le SKU est requis"
    if (!formData.model.trim()) return "Le modèle est requis"
    if (!formData.marketing_name.trim()) return "Le nom marketing est requis"
    if (!formData.category) return "La catégorie est requise"

    const retailPrice = Number.parseFloat(formData.retail_price)
    const finalPrice = Number.parseFloat(formData.final_price)
    const pointsGold = Number.parseInt(formData.points_gold)
    const pointsSilver = Number.parseInt(formData.points_silver)
    const pointsBronze = Number.parseInt(formData.points_bronze)

    if (isNaN(retailPrice) || retailPrice < 0) return "Le prix conseillé doit être un nombre positif"
    if (isNaN(finalPrice) || finalPrice < 0) return "Le prix de vente doit être un nombre positif"
    if (isNaN(pointsGold) || pointsGold < 0) return "Les points Gold doivent être un nombre positif"
    if (isNaN(pointsSilver) || pointsSilver < 0) return "Les points Silver doivent être un nombre positif"
    if (isNaN(pointsBronze) || pointsBronze < 0) return "Les points Bronze doivent être un nombre positif"

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
        sku: formData.sku.trim(),
        model: formData.model.trim(),
        marketing_name: formData.marketing_name.trim(),
        category: formData.category,
        retail_price: Number.parseFloat(formData.retail_price),
        final_price: Number.parseFloat(formData.final_price),
        points_gold: Number.parseInt(formData.points_gold),
        points_silver: Number.parseInt(formData.points_silver),
        points_bronze: Number.parseInt(formData.points_bronze),
        image_url: formData.image_url.trim() || undefined,
      }

      if (product) {
        productData.id = product.id
      }

      await onSave(productData)
      onOpenChange(false)
    } catch (err) {
      setError("Une erreur est survenue lors de la sauvegarde")
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
          <DialogTitle>{product ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifiez les informations du produit" : "Créez un nouveau produit dans le catalogue"}
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
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                placeholder="ORA-XXX-001"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modèle *</Label>
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
            <Label htmlFor="marketing_name">Nom marketing *</Label>
            <Input
              id="marketing_name"
              value={formData.marketing_name}
              onChange={(e) => updateField("marketing_name", e.target.value)}
              placeholder="Oraimo FreePods 3 - Écouteurs Sans Fil"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Chargeurs">Chargeurs</SelectItem>
                <SelectItem value="Accessoires">Accessoires</SelectItem>
                <SelectItem value="Wearables">Wearables</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="retail_price">Prix conseillé (€) *</Label>
              <Input
                id="retail_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.retail_price}
                onChange={(e) => updateField("retail_price", e.target.value)}
                placeholder="79.99"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="final_price">Prix de vente (€) *</Label>
              <Input
                id="final_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.final_price}
                onChange={(e) => updateField("final_price", e.target.value)}
                placeholder="59.99"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="points_gold">Points Gold *</Label>
              <Input
                id="points_gold"
                type="number"
                min="0"
                value={formData.points_gold}
                onChange={(e) => updateField("points_gold", e.target.value)}
                placeholder="120"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points_silver">Points Silver *</Label>
              <Input
                id="points_silver"
                type="number"
                min="0"
                value={formData.points_silver}
                onChange={(e) => updateField("points_silver", e.target.value)}
                placeholder="100"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points_bronze">Points Bronze *</Label>
              <Input
                id="points_bronze"
                type="number"
                min="0"
                value={formData.points_bronze}
                onChange={(e) => updateField("points_bronze", e.target.value)}
                placeholder="80"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de l'image</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => updateField("image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
