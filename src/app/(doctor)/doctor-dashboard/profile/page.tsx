"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

export default function DoctorProfilePage() {
  const { t } = useTranslation()
  const user = useAuthUserStore((state) => state.user)
  const updateProfile = useAuthUserStore((state) => state.updateProfile)
  const [draft, setDraft] = useState<{
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }>({})

  async function handleSave() {
    const updated = await updateProfile({
      first_name: draft.first_name ?? user?.first_name ?? "",
      last_name: draft.last_name ?? user?.last_name ?? "",
      email: draft.email ?? user?.email ?? "",
      phone: draft.phone ?? user?.phone ?? "",
    })

    if (updated) {
      setDraft({})
      toast.success(t("staffProfile.updated"))
      return
    }

    toast.error(t("staffProfile.updateError"))
  }

  return (
    <div className="w-full max-w-8xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("staffProfile.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("staffProfile.doctorDescription")}</p>
      </div>

      <div className="rounded-4xl border border-sidebar-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("staffProfile.firstName")}</label>
            <Input
              value={draft.first_name ?? user?.first_name ?? ""}
              onChange={(event) =>
                setDraft((current) => ({ ...current, first_name: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("staffProfile.lastName")}</label>
            <Input
              value={draft.last_name ?? user?.last_name ?? ""}
              onChange={(event) =>
                setDraft((current) => ({ ...current, last_name: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("staffProfile.email")}</label>
            <Input
              value={draft.email ?? user?.email ?? ""}
              onChange={(event) =>
                setDraft((current) => ({ ...current, email: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("staffProfile.phone")}</label>
            <Input
              value={draft.phone ?? user?.phone ?? ""}
              onChange={(event) =>
                setDraft((current) => ({ ...current, phone: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={() => void handleSave()}>{t("staffProfile.saveChanges")}</Button>
        </div>
      </div>
    </div>
  )
}
