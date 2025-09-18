"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { User, CreateUserRequest, UpdateUserRequest } from "@/lib/types"
import { userService } from "@/lib/services/user-service"

interface UserFormDialogProps {
  user?: User | null // null for create, User for edit
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserFormDialog({ user, open, onOpenChange, onSuccess }: UserFormDialogProps) {
  const isEdit = !!user
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    storeTiers: "BRONZE",
    password: ""
  })

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        storeTiers: user.storeTiers,
        password: "" // Password is not pre-filled for security
      })
    } else {
      // Reset form for create
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        role: "CUSTOMER",
        storeTiers: "BRONZE",
        password: ""
      })
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.firstName.trim()) {
      toast.error("First name is required")
      return
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required")
      return
    }
    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required")
      return
    }
    if (!formData.address.trim()) {
      toast.error("Address is required")
      return
    }
    if (!isEdit && !formData.password.trim()) {
      toast.error("Password is required for new users")
      return
    }

    setLoading(true)
    
    try {
      if (isEdit && user) {
        // Update existing user
        const updateData: UpdateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          role: formData.role,
          storeTiers: formData.storeTiers
        }
        
        await userService.update(user.id, updateData)
        toast.success("User updated successfully")
      } else {
        // Create new user
        await userService.create(formData)
        toast.success("User created successfully")
      }
      
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error saving user:', error)
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} user`)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof CreateUserRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {isEdit && "(leave blank to keep current password)"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder={isEdit ? "Enter new password (optional)" : "Enter password"}
              required={!isEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => updateField("role", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Store Tier</Label>
              <Select
                value={formData.storeTiers}
                onValueChange={(value) => updateField("storeTiers", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRONZE">Bronze</SelectItem>
                  <SelectItem value="SILVER">Silver</SelectItem>
                  <SelectItem value="GOLD">Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex">
                <Badge 
                  variant={user?.status === "APPROVED" ? "default" : "destructive"}
                  className={user?.status === "APPROVED" 
                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                    : "bg-red-600 text-white hover:bg-red-700"
                  }
                >
                  {user?.status === "APPROVED" ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (isEdit ? "Update User" : "Create User")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}