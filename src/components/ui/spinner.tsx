"use client"

import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { useTranslation } from "@/lib/i18n"

function Spinner({ className, strokeWidth, ...props }: React.ComponentProps<"svg">) {
  const { t } = useTranslation()
  return (
    <HugeiconsIcon icon={Loading03Icon} strokeWidth={strokeWidth ? Number(strokeWidth) : 2} role="status" aria-label={t("accessibility.loading")} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
