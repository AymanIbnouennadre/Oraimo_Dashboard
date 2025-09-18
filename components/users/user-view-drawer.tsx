"use client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatPoints } from "@/lib/utils"
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
    return new Date(dateString).toLocaleDateString("en-US", {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "DISABLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] user-drawer-content">
        <SheetHeader className="user-drawer-section">
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </SheetTitle>
          <SheetDescription>Complete information about the selected user</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 user-drawer-section">
          {/* Identity Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Identity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-muted-foreground">Full name</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={user.role === "ADMIN" ? "default" : "outline"}
                       className={user.role === "ADMIN" ? "text-gray-800 hover:opacity-80" : "text-white hover:opacity-80"}
                       style={{
                         backgroundColor: user.role === "ADMIN" ? "#BBDCE5" : "#9B7EBD"
                       }}>
                  {user.role}
                </Badge>
                <Badge 
                  variant={getTierBadgeVariant(user.storeTiers)}
                  className={
                    user.storeTiers === 'GOLD' ? 'badge-gold' :
                    user.storeTiers === 'SILVER' ? 'badge-silver' :
                    user.storeTiers === 'BRONZE' ? 'badge-bronze' : ''
                  }
                >
                  {user.storeTiers}
                </Badge>
                <Badge 
                  variant={user.status === "APPROVED" ? "default" : "destructive"}
                  className={user.status === "APPROVED" 
                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                    : "bg-red-600 text-white hover:bg-red-700"
                  }
                >
                  {user.status === "APPROVED" ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Email address</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.phone}</p>
                  <p className="text-sm text-muted-foreground">Phone number</p>
                </div>
              </div>

              {user.address && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{user.address}</p>
                    <p className="text-sm text-muted-foreground">Address</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {user.created ? formatDate(user.created) : 
                     user.updatedAt ? `Updated: ${formatDate(user.updatedAt)}` :
                     'Date not available'}
                  </p>
                  <p className="text-sm text-muted-foreground">Account created</p>
                </div>
              </div>

              {user.updatedAt && (
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatDate(user.updatedAt)}</p>
                    <p className="text-sm text-muted-foreground">Last updated</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
