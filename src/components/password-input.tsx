"use client"

import * as React from "react"
import { Eye, EyeOff } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const { t } = useTranslation()
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <HugeiconsIcon
            icon={showPassword ? EyeOff : Eye}
            strokeWidth={1.8}
            className="h-4 w-4 text-muted-foreground"
          />
          <span className="sr-only">
            {showPassword
              ? t("accessibility.hidePassword")
              : t("accessibility.showPassword")}
          </span>
        </Button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
