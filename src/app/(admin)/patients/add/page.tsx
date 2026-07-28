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
import { useTranslation } from "@/lib/i18n"

export default function AddPatientPage() {
  const { t } = useTranslation()
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
      toast.success(t("accountCreation.patientCreated"))
      router.push("/admin/patients")
    } catch {
      toast.error(t("accountCreation.patientCreateError"))
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
          <h1 className="text-3xl font-bold tracking-tight">{t("accountCreation.patientTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("accountCreation.patientDescription")}</p>
        </div>
      </div>

      <Card className="rounded-3xl shadow-xl border-muted/60 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Person} className="w-5 h-5 text-primary" />
            {t("accountCreation.patientDetails")}
          </CardTitle>
          <CardDescription>
            {t("accountCreation.patientDetailsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t("accountCreation.firstName")}</Label>
                <Input
                  id="first_name"
                  placeholder={t("accountCreation.firstNameExample")}
                  className="rounded-xl h-11"
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{t("accountCreation.lastName")}</Label>
                <Input
                  id="last_name"
                  placeholder={t("accountCreation.lastNameExample")}
                  className="rounded-xl h-11"
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("accountCreation.email")}</Label>
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
              <Label htmlFor="phone">{t("accountCreation.phone")}</Label>
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
              <Label htmlFor="password">{t("accountCreation.password")}</Label>
              <PasswordInput
                id="password"
                placeholder={t("accountCreation.minimumPassword")}
                className="rounded-xl h-11"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-md bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon icon={RefreshIcon} className="w-5 h-5 animate-spin" />
                    {t("accountCreation.registering")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckCircle} className="w-5 h-5" />
                    {t("accountCreation.addPatient")}
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
