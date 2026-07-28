"use client"

import Link from "next/link"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"
import { useTranslation } from "@/lib/i18n"
import { usePathname } from "next/navigation"

export function ProfileWarningBanner() {
  const user = useAuthUserStore((state) => state.user)
  const pathname = usePathname()
  const { t } = useTranslation()

  if (!user || user.role !== "patient") return null
  if (user.patient_profile?.is_profile_complete) return null
  if (pathname === "/patient-dashboard/profile") return null

  return (
    <div className="animate-in border-b border-amber-500/20 bg-amber-500/10 px-3 py-3 text-sm text-amber-800 duration-500 slide-in-from-top dark:text-amber-300 sm:px-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-2.5 font-medium sm:items-center">
          <HugeiconsIcon
            icon={Alert02Icon}
            className="mt-0.5 h-5 w-5 shrink-0 animate-bounce text-amber-600 dark:text-amber-400 sm:mt-0"
          />
          <p className="min-w-0 leading-5 sm:leading-6">
            <strong className="block sm:inline">
              {t("profile.incompleteBannerTitle")}
            </strong>{" "}
            <span className="wrap-break-word">
              {t("profile.incompleteBannerDescription")}
            </span>
          </p>
        </div>
        <Link
          href="/patient-dashboard/profile"
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl border border-amber-600/25 bg-amber-500/10 px-4 py-2 font-bold transition-colors hover:bg-amber-500/20 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:hover:text-amber-200 sm:w-auto"
        >
          {t("profile.completeProfile")}
          <span aria-hidden="true" className="ml-1">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  )
}
