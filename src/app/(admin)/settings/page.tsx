"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n"
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
  const { t } = useTranslation()
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
      ? t("adminSettings.patientConfirmationEmailsEnabled")
      : t("adminSettings.patientConfirmationEmailsDisabled"),
    settings?.secure_sessions
      ? t("adminSettings.secureSessionCookiesEnabled")
      : t("adminSettings.secureSessionCookiesDisabled"),
    `${t("adminSettings.defaultTimeSlotIs")} ${settings?.default_time_slot ?? t("adminSettings.notConfigured")}`,
  ]

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">{t("adminSettings.settings")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("adminSettings.settingsDesc")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={ComputerSettingsIcon} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-semibold">{t("adminSettings.clinicProfile")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("adminSettings.clinicProfileDesc")}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminSettings.clinicName")}</label>
              <Input value={settings?.clinic_name ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminSettings.supportEmail")}</label>
              <Input value={settings?.support_email ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminSettings.clinicHours")}</label>
              <Input value={settings?.clinic_hours ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminSettings.defaultTimeSlot")}</label>
              <Input value={settings?.default_time_slot ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminSettings.appointmentFee")}</label>
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
                  toast.success(t("adminSettings.appointmentFeeUpdated"))
                } catch {
                  toast.error(t("adminSettings.appointmentFeeUpdateFailed"))
                } finally {
                  setSaving(false)
                }
              }}
            >
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} />
              {saving ? t("adminSettings.saving") : t("adminSettings.saveProfile")}
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => setAppointmentFee(settings?.appointment_fee ?? "")}
              disabled={saving}
            >
              {t("adminSettings.reset")}
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
                <h2 className="font-semibold">{t("adminSettings.notifications")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("adminSettings.notificationsDesc")}
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
            <h2 className="font-semibold">{t("adminSettings.securityAndScheduling")}</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} className="size-4" />
                {t("adminSettings.twoStepVerification")}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={CalendarSetting01Icon} strokeWidth={1.8} className="size-4" />
                {t("adminSettings.autoCloseMissedAppointments")}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                {t("adminSettings.patientConfirmationEmailsEnabledDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
