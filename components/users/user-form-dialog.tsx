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
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    address?: string
  }>({})
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER", // Default role
    storeTiers: "GOLD" // API format - uppercase
  })

  // Convert API format (GOLD) to form format (Gold)
  const convertApiToForm = (tier: "GOLD" | "SILVER" | "BRONZE"): "Gold" | "Silver" | "Bronze" => {
    switch (tier) {
      case "GOLD": return "Gold"
      case "SILVER": return "Silver" 
      case "BRONZE": return "Bronze"
    }
  }

  // Convert form format (Gold) to API format (GOLD) for updates
  const convertFormToApi = (tier: "Gold" | "Silver" | "Bronze"): "GOLD" | "SILVER" | "BRONZE" => {
    switch (tier) {
      case "Gold": return "GOLD"
      case "Silver": return "SILVER"
      case "Bronze": return "BRONZE"
    }
  }

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role, // Keep existing role for editing
        storeTiers: user.storeTiers // Already in GOLD/SILVER/BRONZE format
      })
    } else {
      // Reset form for create
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        role: "CUSTOMER", // Default role for new users
        storeTiers: "GOLD" // Default to GOLD
      })
    }
    
    // Clear errors when dialog opens/closes or user changes
    setFieldErrors({})
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setFieldErrors({})
    
    // Validation
    const errors: typeof fieldErrors = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address"
      }
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    } else {
      // Phone format validation (Moroccan format)
      const phoneRegex = /^(0[5-7][0-9]{8}|(\+212|00212)[5-7][0-9]{8})$/
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = "Please enter a valid Moroccan phone number (e.g., 0612345678)"
      }
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }

    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
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
          role: formData.role, // Include role in update
          storeTiers: user.storeTiers // Already in correct format
        }
        
        await userService.update(user.id, updateData)
        toast.success("User updated successfully")
      } else {
        // Create new user
        console.log('Creating user with data:', formData)
        
        // Prepare data according to your API's CreateUserRequest
        const createRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          role: formData.role, // Include role in request
          storeTiers: formData.storeTiers // Already in GOLD/SILVER/BRONZE format
          // No password needed - generated by server
          // No status needed - defaults to APPROVED
        }
        
        const response = await userService.create(createRequest)
        console.log('User creation response:', response)
        toast.success("User created successfully! A welcome email has been sent with login details.")
      }
      
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error saving user:', error)
      
      // Clear any existing field errors first
      setFieldErrors({})
      
      if (error.message) {
        const errorText = error.message
        
        // Check for specific backend validation errors and map to fields
        if (errorText.includes('Email déjà utilisé')) {
          setFieldErrors({ email: 'This email address is already registered' })
          return // Don't show toast, field error is enough
        } else if (errorText.includes('Téléphone déjà utilisé')) {
          setFieldErrors({ phone: 'This phone number is already registered' })
          return // Don't show toast, field error is enough
        } else if (errorText.includes('API Error 500')) {
          // Extract the actual error message from server response
          try {
            const match = errorText.match(/"trace":"[^"]*IllegalArgumentException: ([^\\r\\n]*)/);
            if (match) {
              const serverError = match[1];
              if (serverError.includes('Email déjà utilisé')) {
                setFieldErrors({ email: 'This email address is already registered' })
                return
              } else if (serverError.includes('Téléphone déjà utilisé')) {
                setFieldErrors({ phone: 'This phone number is already registered' })
                return
              }
            }
          } catch (parseError) {
            // If parsing fails, fall through to general error
          }
        }
      }
      
      // General errors that don't map to specific fields
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} user`
      
      if (error.message) {
        const errorText = error.message
        if (errorText.includes('API Error 400')) {
          errorMessage = 'Invalid data provided. Please check all fields.'
        } else if (errorText.includes('Network Error') || errorText.includes('Failed to fetch')) {
          errorMessage = 'Connection error. Please check your internet connection.'
        } else {
          errorMessage = 'Server error occurred. Please try again.'
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof CreateUserRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
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
                className={fieldErrors.firstName ? "border-red-500" : ""}
                required
              />
              {fieldErrors.firstName && (
                <p className="text-sm text-red-600">{fieldErrors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Enter last name"
                className={fieldErrors.lastName ? "border-red-500" : ""}
                required
              />
              {fieldErrors.lastName && (
                <p className="text-sm text-red-600">{fieldErrors.lastName}</p>
              )}
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
              className={fieldErrors.email ? "border-red-500" : ""}
              required
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Enter phone number"
              className={fieldErrors.phone ? "border-red-500" : ""}
              required
            />
            {fieldErrors.phone && (
              <p className="text-sm text-red-600">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Enter address"
              className={fieldErrors.address ? "border-red-500" : ""}
              required
            />
            {fieldErrors.address && (
              <p className="text-sm text-red-600">{fieldErrors.address}</p>
            )}
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
                  <SelectItem value="GOLD">Gold</SelectItem>
                  <SelectItem value="SILVER">Silver</SelectItem>
                  <SelectItem value="BRONZE">Bronze</SelectItem>
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