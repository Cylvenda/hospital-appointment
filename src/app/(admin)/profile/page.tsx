"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const user = useAuthUserStore((state) => state.user)
  const updateProfile = useAuthUserStore((state) => state.updateProfile)
  const [draft, setDraft] = useState<{
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }>({})
  const roleLabel = useMemo(() => {
    if (!user?.role) return "User"
    return user.role.charAt(0).toUpperCase() + user.role.slice(1)
  }, [user?.role])

  async function handleSave() {
    const updated = await updateProfile({
      first_name: draft.first_name ?? user?.first_name ?? "",
      last_name: draft.last_name ?? user?.last_name ?? "",
      email: draft.email ?? user?.email ?? "",
      phone: draft.phone ?? user?.phone ?? "",
    })

    if (updated) {
      setDraft({})
      toast.success("Profile updated successfully.")
    } else {
      toast.error("Failed to update profile.")
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Review and update your admin profile, contact details, and permissions summary.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-4xl border border-sidebar-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-4xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={UserAccountIcon} strokeWidth={1.8} className="size-10" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Unnamed User"}</h2>
            <p className="text-sm text-muted-foreground">{roleLabel}</p>
          </div>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
              {user?.email || "No email available"}
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
              {user?.phone || "No phone available"}
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} strokeWidth={1.8} className="size-4" />
              User account
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={1.8} className="size-4" />
              {roleLabel}
            </p>
          </div>

          <div className="mt-6 rounded-3xl bg-muted/60 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} className="size-4 text-primary" />
              Access Level
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Full access to appointments, users, doctors, reception desks, and clinic configuration.
            </p>
          </div>
        </div>

        <div className="rounded-4xl border border-sidebar-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Update Profile</h2>
              <p className="text-sm text-muted-foreground">
                Keep your admin information current for notifications and audit logs.
              </p>
            </div>
            <Button className="rounded-2xl" onClick={() => void handleSave()}>
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} />
              Save Changes
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={draft.first_name ?? user?.first_name ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, first_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={draft.last_name ?? user?.last_name ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, last_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={draft.email ?? user?.email ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={draft.phone ?? user?.phone ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input value="Platform Access" readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input value={roleLabel} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
