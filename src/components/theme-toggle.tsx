"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Moon01Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslation } from "@/lib/i18n"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === "dark"
  const nextTheme = t(`i18nAudit.${isDark ? "light" : "dark"}`)
  const switchLabel = t("i18nAudit.themeSwitch", { theme: nextTheme })

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      onClick={toggleTheme}
      aria-label={switchLabel}
      title={switchLabel}
      className="rounded-sm border-border/70 bg-background/80 backdrop-blur-sm hover:bg-accent"
    >
      {isDark ? (
        <HugeiconsIcon icon={Sun03Icon} strokeWidth={1.8} className="text-foreground" />
      ) : (
        <HugeiconsIcon icon={Moon01Icon} strokeWidth={1.8} className="text-foreground" />
      )}
    </Button>
  )
}
