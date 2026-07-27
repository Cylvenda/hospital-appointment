"use client"

import { useTranslation } from "@/lib/i18n"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

export function AdminSearchHeader() {
  const { t } = useTranslation()
  const user = useAuthUserStore((state) => state.user)

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold">
        {t("workflowDashboard.adminWelcome", {
          name: user?.first_name || t("workflowDashboard.adminFallback"),
        })}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t("search.recordLookup")}
      </p>
    </div>
  )
}
