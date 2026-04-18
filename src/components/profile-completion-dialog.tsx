"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function isMissingName(value?: string | null) {
  return !value || value.trim().length === 0
}

export function ProfileCompletionDialog() {
  const user = useAuthUserStore((state) => state.user)
  const updateProfile = useAuthUserStore((state) => state.updateProfile)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFirstName(user?.first_name ?? "")
    setLastName(user?.last_name ?? "")
  }, [user?.first_name, user?.last_name])

  const profileIncomplete = useMemo(() => {
    if (!user) return false
    return isMissingName(user.first_name) || isMissingName(user.last_name)
  }, [user])

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0 && !saving

  if (!user) {
    return null
  }

  return (
    <Dialog open={profileIncomplete} onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        className="max-w-2xl! rounded-md border border-border bg-card p-0"
      >
        <div className="border-b border-border bg-primary/8 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl">Complete your profile</DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Before continuing, please enter your first name and last name. This is required for every account type.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.role}</span>. Your account needs full name details before you can continue using the system.
          </div>

          <div className="space-y-2">
            <label htmlFor="required-first-name" className="text-sm font-medium">
              First name
            </label>
            <Input
              id="required-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Enter your first name"
              autoComplete="given-name"
              disabled={saving}
              className="rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="required-last-name" className="text-sm font-medium">
              Last name
            </label>
            <Input
              id="required-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Enter your last name"
              autoComplete="family-name"
              disabled={saving}
              className="rounded-md"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-border px-6 py-5">
          <Button
            className="w-full sm:w-auto rounded-md"
            disabled={!canSubmit}
            onClick={async () => {
              setSaving(true)
              try {
                const updated = await updateProfile({
                  first_name: firstName.trim(),
                  last_name: lastName.trim(),
                })

                if (!updated) {
                  toast.error("We could not save your profile right now.")
                  return
                }

                toast.success("Profile updated successfully.")
              } catch {
                toast.error("We could not save your profile right now.")
              } finally {
                setSaving(false)
              }
            }}
          >
            {saving ? "Saving..." : "Save and continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
