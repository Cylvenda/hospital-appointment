"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTranslation } from "@/lib/i18n"
import type { AdminDoctor } from "@/store/admin/admin.types"
import { useAdminStore } from "@/store/admin/admin.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function DoctorProfileManager({ doctor }: { doctor: AdminDoctor }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { illnessCategories, fetchIllnessCategories, updateDoctor } =
    useAdminStore()
  const [form, setForm] = useState({
    first_name: doctor.first_name,
    last_name: doctor.last_name,
    email: doctor.email,
    phone: doctor.phone,
    license_number: doctor.license_number,
    is_available: doctor.is_available,
    category_uuids: doctor.category_uuids,
  })

  useEffect(() => {
    if (!open) return
    setForm({
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      email: doctor.email,
      phone: doctor.phone,
      license_number: doctor.license_number,
      is_available: doctor.is_available,
      category_uuids: doctor.category_uuids,
    })
    void fetchIllnessCategories()
  }, [doctor, fetchIllnessCategories, open])

  const toggleDepartment = (uuid: string) => {
    setForm((current) => ({
      ...current,
      category_uuids: current.category_uuids.includes(uuid)
        ? current.category_uuids.filter((item) => item !== uuid)
        : [...current.category_uuids, uuid],
    }))
  }

  const save = async () => {
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.license_number.trim()
    ) {
      toast.error(t("sharedAudit.doctorDetailsRequired"))
      return
    }
    setSaving(true)
    try {
      await updateDoctor(doctor.uuid, {
        ...form,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        license_number: form.license_number.trim(),
      })
      toast.success(t("sharedAudit.doctorProfileUpdated"))
      setOpen(false)
    } catch {
      toast.error(t("sharedAudit.doctorProfileUpdateError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button className="rounded-md" onClick={() => setOpen(true)}>
        {t("sharedAudit.editProfile")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("sharedAudit.editDoctorProfile")}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [t("staffProfile.firstName"), "first_name"],
              [t("staffProfile.lastName"), "last_name"],
              [t("staffProfile.email"), "email"],
              [t("staffProfile.phone"), "phone"],
              [t("sharedAudit.licenseNumber"), "license_number"],
            ].map(([label, field]) => (
              <div
                key={field}
                className={cn(
                  "space-y-2",
                  field === "license_number" && "sm:col-span-2"
                )}
              >
                <Label>{label}</Label>
                <Input
                  type={field === "email" ? "email" : "text"}
                  value={form[field as keyof typeof form] as string}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-semibold">{t("sharedAudit.activeForBooking")}</p>
              <p className="text-sm text-muted-foreground">
                {t("sharedAudit.inactiveDoctorHelp")}
              </p>
            </div>
            <Switch
              checked={form.is_available}
              onCheckedChange={(checked) =>
                setForm((current) => ({ ...current, is_available: checked }))
              }
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label>{t("nav.departments")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("sharedAudit.departmentSelectionHelp")}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {illnessCategories.map((category) => {
                const selected = form.category_uuids.includes(category.uuid)
                return (
                  <button
                    key={category.uuid}
                    type="button"
                    onClick={() => toggleDepartment(category.uuid)}
                    className={cn(
                      "rounded-xl border p-3 text-left text-sm transition",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <span className="font-semibold">{category.name}</span>
                    {category.description && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {category.description}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <Button onClick={save} disabled={saving}>
            {saving
              ? t("sharedAudit.saving")
              : t("sharedAudit.saveDoctorProfile")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
