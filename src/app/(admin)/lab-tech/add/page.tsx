"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeftIcon, UserPlus, CheckCircle, RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "react-toastify"
import Link from "next/link"
import { useAdminStore } from "@/store/admin/admin.store"
import { PasswordInput } from "@/components/password-input"
import { getBackendFieldErrors } from "@/lib/backend-errors"

type FormErrors = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  password?: string
}

export default function AddLabTechPage() {
  const router = useRouter()
  const { createUser } = useAdminStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await createUser({
        ...form,
        role: "lab_tech",
        is_active: true,
      })
      toast.success("Lab technician created successfully!")
      router.push("/lab-tech")
    } catch (error: unknown) {
      const backendErrors = getBackendFieldErrors(error, [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password",
      ])

      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors)
      } else {
        toast.error(
          "Failed to create lab technician. Please check your details.",
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/lab-tech">
            <HugeiconsIcon icon={ArrowLeftIcon} strokeWidth={1.8} />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Lab Technician
          </h1>
          <p className="text-muted-foreground text-sm">
            Create a new laboratory staff account.
          </p>
        </div>
      </div>

      <Card className="rounded-3xl shadow-xl border-muted/60 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={UserPlus} className="w-5 h-5 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>
            Fill in the details to set up a new lab technician profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="e.g. John"
                  className={
                    errors.first_name
                      ? "rounded-xl h-11 border-red-500"
                      : "rounded-xl h-11"
                  }
                  required
                  value={form.first_name}
                  onChange={(e) => {
                    setForm({ ...form, first_name: e.target.value })
                    if (errors.first_name) {
                      setErrors((prev) => ({ ...prev, first_name: undefined }))
                    }
                  }}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="e.g. Doe"
                  className={
                    errors.last_name
                      ? "rounded-xl h-11 border-red-500"
                      : "rounded-xl h-11"
                  }
                  required
                  value={form.last_name}
                  onChange={(e) => {
                    setForm({ ...form, last_name: e.target.value })
                    if (errors.last_name) {
                      setErrors((prev) => ({ ...prev, last_name: undefined }))
                    }
                  }}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="labtech@clinic.com"
                className={
                  errors.email
                    ? "rounded-xl h-11 border-red-500"
                    : "rounded-xl h-11"
                }
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value })
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }))
                  }
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+255 734 567 890"
                className={
                  errors.phone
                    ? "rounded-xl h-11 border-red-500"
                    : "rounded-xl h-11"
                }
                required
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value })
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: undefined }))
                  }
                }}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <PasswordInput
                id="password"
                placeholder="Minimum 8 characters"
                className={
                  errors.password
                    ? "rounded-xl h-11 border-red-500"
                    : "rounded-xl h-11"
                }
                required
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value })
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }
                }}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-md bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      className="w-5 h-5 animate-spin"
                    />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckCircle} className="w-5 h-5" />
                    Register Lab Technician
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
