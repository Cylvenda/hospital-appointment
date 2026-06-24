"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n"
import {
  Briefcase01Icon,
  CallIcon,
  Edit02Icon,
  Location01Icon,
  Mail01Icon,
  Shield01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { toast } from "react-toastify"

export default function ProfilePage() {
  const { t } = useTranslation()
  const user = useAuthUserStore((state) => state.user)
  const updateProfile = useAuthUserStore((state) => state.updateProfile)
  const [draft, setDraft] = useState<{
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }>({})
  const roleLabel = useMemo(() => {
    if (!user?.role) return t("adminProfile.user")
    return user.role.charAt(0).toUpperCase() + user.role.slice(1)
  }, [user?.role, t])

  async function handleSave() {
    const updated = await updateProfile({
      first_name: draft.first_name ?? user?.first_name ?? "",
      last_name: draft.last_name ?? user?.last_name ?? "",
      email: draft.email ?? user?.email ?? "",
      phone: draft.phone ?? user?.phone ?? "",
    })

    if (updated) {
      setDraft({})
      toast.success(t("adminProfile.profileUpdatedSuccess"))
    } else {
      toast.error(t("adminProfile.profileUpdateFailed"))
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">{t("adminProfile.profile")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("adminProfile.profileDesc")}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-4xl border border-sidebar-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-4xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={UserAccountIcon} strokeWidth={1.8} className="size-10" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || t("adminProfile.unnamedUser")}</h2>
            <p className="text-sm text-muted-foreground">{roleLabel}</p>
          </div>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
              {user?.email || t("adminProfile.noEmailAvailable")}
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
              {user?.phone || t("adminProfile.noPhoneAvailable")}
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} strokeWidth={1.8} className="size-4" />
              {t("adminProfile.userAccount")}
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={1.8} className="size-4" />
              {roleLabel}
            </p>
          </div>

          <div className="mt-6 rounded-3xl bg-muted/60 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} className="size-4 text-primary" />
              {t("adminProfile.accessLevel")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("adminProfile.accessLevelDesc")}
            </p>
          </div>
        </div>

        <div className="rounded-4xl border border-sidebar-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{t("adminProfile.updateProfile")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("adminProfile.updateProfileDesc")}
              </p>
            </div>
            <Button className="rounded-md" onClick={() => void handleSave()}>
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} />
              {t("adminProfile.saveChanges")}
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminProfile.firstName")}</label>
              <Input
                value={draft.first_name ?? user?.first_name ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, first_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminProfile.lastName")}</label>
              <Input
                value={draft.last_name ?? user?.last_name ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, last_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminProfile.email")}</label>
              <Input
                value={draft.email ?? user?.email ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminProfile.phoneNumber")}</label>
              <Input
                value={draft.phone ?? user?.phone ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminProfile.department")}</label>
              <Input value={t("adminProfile.platformAccess")} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("adminProfile.role")}</label>
              <Input value={roleLabel} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
