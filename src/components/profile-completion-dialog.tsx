"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
import { HugeiconsIcon } from "@hugeicons/react"
import { Book02Icon, UserIcon } from "@hugeicons/core-free-icons"

function isMissingName(value?: string | null) {
  return !value || value.trim().length === 0
}

export function ProfileCompletionDialog() {
  const router = useRouter()
  const user = useAuthUserStore((state) => state.user)
  const updateProfile = useAuthUserStore((state) => state.updateProfile)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [saving, setSaving] = useState(false)
  
  // Track if patient has temporarily dismissed the dialog
  const [hasClosed, setHasClosed] = useState(false)

  const pathname = typeof window !== "undefined" ? window.location.pathname : ""

  useEffect(() => {
    setFirstName(user?.first_name ?? "")
    setLastName(user?.last_name ?? "")
  }, [user?.first_name, user?.last_name])

  const profileIncomplete = useMemo(() => {
    if (!user) return false
    
    // For patients, check if patient_profile is complete
    if (user.role === "patient") {
      if (pathname === "/patient-dashboard/profile") return false
      return !user.patient_profile?.is_profile_complete
    }
    
    // For other roles, just check first/last name
    return isMissingName(user.first_name) || isMissingName(user.last_name)
  }, [user, pathname])

  const showDialog = profileIncomplete && !hasClosed

  const handleClose = () => {
    setHasClosed(true)
  }

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0 && !saving

  if (!user) {
    return null
  }

  // Render Patient-specific incomplete profile dialog
  if (user.role === "patient" && !user.patient_profile?.is_profile_complete) {
    return (
      <Dialog open={showDialog} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent
          showCloseButton={true}
          onEscapeKeyDown={() => handleClose()}
          onPointerDownOutside={() => handleClose()}
          className="max-w-md rounded-3xl border border-border bg-card p-0 overflow-hidden shadow-2xl"
        >
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 px-6 py-8 text-center border-b border-border">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-pulse">
              <HugeiconsIcon icon={Book02Icon} className="h-8 w-8" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-black text-foreground">
                Clinical Profile Setup
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
                Please provide your clinical registration details so our care team can prepare for your visits and appointments.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div className="bg-muted/40 border border-border/60 rounded-2xl p-4 text-xs leading-relaxed text-muted-foreground">
              Under current clinical guidelines, patients must complete their background, residence, and next-of-kin details before scheduling appointments.
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-0 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-1/2 rounded-xl h-12 font-bold"
              onClick={handleClose}
            >
              Remind Me Later
            </Button>
            <Button
              className="w-full sm:w-1/2 rounded-xl h-12 font-bold shadow-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2"
              onClick={() => {
                handleClose()
                router.push("/patient-dashboard/profile")
              }}
            >
              <HugeiconsIcon icon={UserIcon} className="h-5 w-5" />
              Complete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={showDialog} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        showCloseButton={true}
        onEscapeKeyDown={() => handleClose()}
        onPointerDownOutside={() => handleClose()}
        className="max-w-2xl rounded-md border border-border bg-card p-0"
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

        <DialogFooter className="border-t border-border px-6 py-5 flex justify-between gap-4">
          <Button
            variant="outline"
            className="rounded-md"
            onClick={handleClose}
          >
            Cancel
          </Button>
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
                handleClose()
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
