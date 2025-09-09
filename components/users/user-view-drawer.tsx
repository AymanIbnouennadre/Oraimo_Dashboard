"use client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Calendar, Award, Activity } from "lucide-react"
import type { User as UserType } from "@/lib/types"

interface UserViewDrawerProps {
  user: UserType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserViewDrawer({ user, open, onOpenChange }: UserViewDrawerProps) {
  if (!user) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "GOLD":
        return "default"
      case "SILVER":
        return "secondary"
      case "BRONZE":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de l'utilisateur
          </SheetTitle>
          <SheetDescription>Informations complètes sur l'utilisateur sélectionné</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Identity Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Identité</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                <Badge variant={getTierBadgeVariant(user.tier)}>{user.tier}</Badge>
                <Badge variant={user.enabled ? "default" : "destructive"}>
                  {user.enabled ? "Activé" : "Désactivé"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Coordonnées</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Adresse email</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.phone}</p>
                  <p className="text-sm text-muted-foreground">Numéro de téléphone</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity & Points */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Activité & Points</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.points_total.toLocaleString()} points</p>
                  <p className="text-sm text-muted-foreground">Total des points accumulés</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatDate(user.last_activity)}</p>
                  <p className="text-sm text-muted-foreground">Dernière activité</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatDate(user.created)}</p>
                  <p className="text-sm text-muted-foreground">Compte créé le</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
