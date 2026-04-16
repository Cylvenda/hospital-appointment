"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BellDotIcon,
  CalendarSetting01Icon,
  ComputerSettingsIcon,
  Edit02Icon,
  Mail01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAdminStore } from "@/store/admin/admin.store"
import { toast } from "react-toastify"

export default function SettingsPage() {
  const { settings, fetchSettings, updateSettings } = useAdminStore()
  const [appointmentFee, setAppointmentFee] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    if (!settings) return
    setAppointmentFee(settings.appointment_fee)
  }, [settings])

  const notificationSettings = [
    settings?.patient_confirmation_emails
      ? "Patient confirmation emails enabled"
      : "Patient confirmation emails disabled",
    settings?.secure_sessions
      ? "Secure session cookies enabled"
      : "Secure session cookies disabled",
    `Default time slot is ${settings?.default_time_slot ?? "not configured"}`,
  ]

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure clinic preferences, notifications, and operational defaults.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={ComputerSettingsIcon} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-semibold">Clinic Profile</h2>
              <p className="text-sm text-muted-foreground">
                Main details used across appointments and notifications.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Clinic Name</label>
              <Input value={settings?.clinic_name ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Support Email</label>
              <Input value={settings?.support_email ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Clinic Hours</label>
              <Input value={settings?.clinic_hours ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Time Slot</label>
              <Input value={settings?.default_time_slot ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment Fee</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={appointmentFee}
                onChange={(event) => setAppointmentFee(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              className="rounded-2xl"
              disabled={!appointmentFee || saving}
              onClick={async () => {
                setSaving(true)
                try {
                  await updateSettings({ appointment_fee: appointmentFee })
                  toast.success("Appointment fee updated.")
                } catch {
                  toast.error("Failed to update appointment fee.")
                } finally {
                  setSaving(false)
                }
              }}
            >
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} />
              {saving ? "Saving..." : "Save Profile"}
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => setAppointmentFee(settings?.appointment_fee ?? "")}
              disabled={saving}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={BellDotIcon} strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Manage how the system alerts staff and patients.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {notificationSettings.map((item) => (
                <div
                  key={item}
                  className="flex items-start justify-between gap-4 rounded-3xl bg-muted/60 p-4"
                >
                  <p className="text-sm text-muted-foreground">{item}</p>
                  <div className="h-6 w-11 rounded-full bg-primary/20 p-1">
                    <div className="ml-auto h-4 w-4 rounded-full bg-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Security & Scheduling</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} className="size-4" />
                Two-step verification required for admin access
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={CalendarSetting01Icon} strokeWidth={1.8} className="size-4" />
                Auto-close missed appointments after 30 minutes
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                Patient confirmation emails enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
