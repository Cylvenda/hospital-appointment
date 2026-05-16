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
import { ArrowLeftIcon, Person, CheckCircle, RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "react-toastify"
import Link from "next/link"
import { useAdminStore } from "@/store/admin/admin.store"
import { PasswordInput } from "@/components/password-input"

export default function AddPatientPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createUser({
        ...form,
        role: "patient",
        is_active: true,
      })
      toast.success("Patient registered successfully!")
      router.push("/admin/patients")
    } catch (error) {
      toast.error("Failed to register patient. Please check your details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/admin/patients">
            <HugeiconsIcon icon={ArrowLeftIcon} strokeWidth={1.8} />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Register Patient</h1>
          <p className="text-muted-foreground text-sm">Add a new patient record to the clinic database.</p>
        </div>
      </div>

      <Card className="rounded-3xl shadow-xl border-muted/60 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Person} className="w-5 h-5 text-primary" />
            Patient Details
          </CardTitle>
          <CardDescription>
            Enter the patient&apos;s contact and account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="e.g. Michael"
                  className="rounded-xl h-11"
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="e.g. Jordan"
                  className="rounded-xl h-11"
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@gmail.com"
                className="rounded-xl h-11"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 234 567 890"
                className="rounded-xl h-11"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <PasswordInput
                id="password"
                placeholder="Minimum 8 characters"
                className="rounded-xl h-11"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon icon={RefreshIcon} className="w-5 h-5 animate-spin" />
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckCircle} className="w-5 h-5" />
                    Add Patient Record
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
