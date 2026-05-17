"use client"

import Link from "next/link"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"

export function ProfileWarningBanner() {
  const user = useAuthUserStore((state) => state.user)
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""

  if (!user || user.role !== "patient") return null
  if (user.patient_profile?.is_profile_complete) return null
  if (pathname === "/patient-dashboard/profile") return null

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center justify-between gap-4 text-amber-800 dark:text-amber-300 text-sm animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-2 font-medium">
        <HugeiconsIcon icon={Alert02Icon} className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-bounce shrink-0" />
        <span>
          <strong>Clinical Profile Incomplete:</strong> Please complete your registration details so the care team can prepare for your visits and activate scheduling options.
        </span>
      </div>
      <Link
        href="/patient-dashboard/profile"
        className="font-bold underline hover:text-amber-700 dark:hover:text-amber-200 shrink-0 flex items-center gap-1 transition-all"
      >
        Complete Profile &rarr;
      </Link>
    </div>
  )
}
