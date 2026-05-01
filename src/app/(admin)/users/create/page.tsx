"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, UserPlusIcon, ArrowLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "react-toastify"
import Link from "next/link"
import { useAdminStore } from "@/store/admin/admin.store"

type UserRole = "user" | "receptionist" | "doctor"

interface FormErrors {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  password?: string
  confirm_password?: string
  license_number?: string
}

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  license_number: "",
  role: "" as UserRole,
}

export default function CreateUserPage() {
  const { createUser, createDoctor } = useAdminStore()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // First name validation
    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required"
    } else if (form.first_name.trim().length < 2) {
      newErrors.first_name = "First name must be at least 2 characters"
    } else if (!/^[a-zA-Z\s'-]+$/.test(form.first_name.trim())) {
      newErrors.first_name = "First name can only contain letters, spaces, hyphens, and apostrophes"
    }

    // Last name validation
    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    } else if (form.last_name.trim().length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters"
    } else if (!/^[a-zA-Z\s'-]+$/.test(form.last_name.trim())) {
      newErrors.last_name = "Last name can only contain letters, spaces, hyphens, and apostrophes"
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\d\s\-\+\(\)]+$/.test(form.phone.trim())) {
      newErrors.phone = "Phone number can only contain digits, spaces, and basic symbols"
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Phone number must contain at least 10 digits"
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
    } else if (!/(?=.*[A-Z])/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain at least one number"
    } else if (!/(?=.*[@$!%*?&])/.test(form.password)) {
      newErrors.password = "Password must contain at least one special character (@$!%*?&)"
    }

    // Confirm password validation
    if (!form.confirm_password) {
      newErrors.confirm_password = "Please confirm your password"
    } else if (form.password !== form.confirm_password) {
      newErrors.confirm_password = "Passwords do not match"
    }

    // Role validation
    if (!form.role) {
      newErrors.role = "Please select a user role"
    }

    // License number validation (only for doctors)
    if (form.role === "doctor") {
      if (!form.license_number.trim()) {
        newErrors.license_number = "License number is required for doctors"
      } else if (form.license_number.trim().length < 5) {
        newErrors.license_number = "License number must be at least 5 characters"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)

    try {
      if (form.role === "doctor") {
        await createDoctor({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          license_number: form.license_number.trim(),
          is_available: true,
        })
        toast.success("Doctor created successfully!")
      } else {
        await createUser({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: form.role,
          is_active: true,
        })
        toast.success(`${form.role.charAt(0).toUpperCase() + form.role.slice(1)} created successfully!`)
      }

      setForm(emptyForm)
      setErrors({})
    } catch (error) {
      toast.error(`Failed to create ${form.role}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: "", color: "" }
    
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[@$!%*?&]/.test(password)) score++

    if (score <= 2) return { score, label: "Weak", color: "text-red-500" }
    if (score <= 4) return { score, label: "Medium", color: "text-yellow-500" }
    return { score, label: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(form.password)

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/users">
            <HugeiconsIcon icon={ArrowLeftIcon} strokeWidth={1.8} />
            Back to Users
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New User</h1>
          <p className="text-muted-foreground">Add a new user, receptionist, or doctor to the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={UserPlusIcon} strokeWidth={1.8} />
            User Information
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Select value={form.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  className={errors.first_name ? "border-red-500" : ""}
                  placeholder="Enter first name"
                />
                {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  className={errors.last_name ? "border-red-500" : ""}
                  placeholder="Enter last name"
                />
                {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="user@example.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <HugeiconsIcon 
                      icon={showPassword ? EyeOffIcon : EyeIcon} 
                      strokeWidth={1.8} 
                      className="h-4 w-4 text-muted-foreground" 
                    />
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                {form.password && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength.score <= 2 ? "bg-red-500" :
                            passwordStrength.score <= 4 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirm_password}
                    onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                    className={errors.confirm_password ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="Confirm password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <HugeiconsIcon 
                      icon={showConfirmPassword ? EyeOffIcon : EyeIcon} 
                      strokeWidth={1.8} 
                      className="h-4 w-4 text-muted-foreground" 
                    />
                  </Button>
                </div>
                {errors.confirm_password && <p className="text-sm text-red-500">{errors.confirm_password}</p>}
              </div>
            </div>

            {/* License Number (only for doctors) */}
            {form.role === "doctor" && (
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number *</Label>
                <Input
                  id="license_number"
                  value={form.license_number}
                  onChange={(e) => handleInputChange("license_number", e.target.value)}
                  className={errors.license_number ? "border-red-500" : ""}
                  placeholder="Enter medical license number"
                />
                {errors.license_number && <p className="text-sm text-red-500">{errors.license_number}</p>}
              </div>
            )}

            {/* Password Requirements */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Password Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className={form.password.length >= 8 ? "text-green-500" : ""}>•</span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[a-z]/.test(form.password) ? "text-green-500" : ""}>•</span>
                  Contains lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[A-Z]/.test(form.password) ? "text-green-500" : ""}>•</span>
                  Contains uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className={/\d/.test(form.password) ? "text-green-500" : ""}>•</span>
                  Contains number
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[@$!%*?&]/.test(form.password) ? "text-green-500" : ""}>•</span>
                  Contains special character (@$!%*?&)
                </li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.role}
                className="flex-1"
              >
                {isSubmitting ? "Creating User..." : `Create ${form.role ? form.role.charAt(0).toUpperCase() + form.role.slice(1) : "User"}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(emptyForm)
                  setErrors({})
                }}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
