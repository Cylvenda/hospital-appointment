"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { useLanguageStore } from "@/store/language/language.store"
import { Globe02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguageStore()
  const { t } = useTranslation()
  const isSwahili = language === "sw"
  const nextLanguageLabel = isSwahili
    ? t("language.english")
    : t("language.swahili")

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t("language.switchTo", { language: nextLanguageLabel })}
      title={t("language.switchTo", { language: nextLanguageLabel })}
      className="rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} className="text-primary h-4 w-4" />
        <span className="text-sm font-bold text-primary">{isSwahili ? "SW" : "EN"}</span>
      </div>
    </Button>
  )
}
