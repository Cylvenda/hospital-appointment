"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight02Icon,
  CheckCircle,
  Calendar03Icon,
  Doctor01Icon,
  HourglassIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  appointmentWorkflowSteps,
  getAppointmentStatusMeta,
} from "@/lib/appointment-workflow"

type Props = {
  className?: string
}

const legendStatuses = [
  { status: "pending" as const, audience: "default" as const },
  { status: "accepted" as const, audience: "doctor" as const },
  { status: "completed" as const, audience: "default" as const },
  { status: "cancelled" as const, audience: "default" as const },
]

const toneClasses = {
  amber: "bg-amber-500/10 text-amber-700 border-amber-200",
  emerald: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  blue: "bg-blue-500/10 text-blue-700 border-blue-200",
  rose: "bg-rose-500/10 text-rose-700 border-rose-200",
  slate: "bg-slate-500/10 text-slate-700 border-slate-200",
} as const

export function AppointmentWorkflowLegend({ className }: Props) {
  return (
    <Card className={cn("rounded-3xl border-primary/10 bg-card/90 shadow-sm", className)}>
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Appointment Workflow
            </p>
            <h3 className="text-xl font-black tracking-tight">
              One status flow for all roles
            </h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Patients create a request, the payment is verified, reception assigns the visit, and the doctor closes the case.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {legendStatuses.map(({ status, audience }) => {
              const meta = getAppointmentStatusMeta(status, status === "pending" ? "pending" : null, audience)
              return (
                <Badge
                  key={`${status}-${audience}`}
                  variant="outline"
                  className={cn(
                    "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                    toneClasses[meta.tone]
                  )}
                >
                  {meta.label}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {appointmentWorkflowSteps.map((step, index) => {
            const icon = [Calendar03Icon, HourglassIcon, UserGroupIcon, Doctor01Icon][index] || CheckCircle
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-muted/60 bg-muted/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background shadow-sm">
                    <HugeiconsIcon icon={icon} className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Step {index + 1}
                    </p>
                    <h4 className="text-sm font-bold">{step.title}</h4>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.summary}
                </p>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-muted/70 bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <HugeiconsIcon icon={ArrowRight02Icon} className="h-4 w-4 text-primary" />
            <span>Payment completed is the gate that moves a request from waiting to assignable.</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Same state, role-specific wording
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
