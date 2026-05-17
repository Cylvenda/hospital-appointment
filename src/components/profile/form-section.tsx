"use client"

import { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  subtitle?: string
  icon: any
  children: ReactNode
  className?: string
}

export function FormSection({
  title,
  subtitle,
  icon,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6 pt-6 first:pt-0", className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary/20">
          <HugeiconsIcon icon={icon} className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="pl-0 md:pl-16">
        <div className="grid gap-6">
          {children}
        </div>
      </div>
      <Separator className="mt-8 opacity-50" />
    </div>
  )
}
