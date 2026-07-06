"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Appointment } from "@/store/appointments/appointment.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CancelAppointment } from "./popup-cancel"
import { PayingForAppointment } from "./popup-payment"
import { UpdateAppointmentDialog } from "./update-appointment"
import { Calendar01Icon, Clock01Icon, UserIcon, CheckCircle, Cancel01Icon, HourglassIcon, InformationCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"
import { hasAppointmentStatus } from "@/lib/appointment-queues"
import { useTranslation } from "@/lib/i18n"

type Props = {
     appointment: Appointment
     onCancel?: (appointmentId: string, reason?: string) => void | Promise<void>
     hideViewDetails?: boolean
}

export default function AppointmentDisplay({
     appointment,
     onCancel,
     hideViewDetails = false,
}: Props) {
     const { t } = useTranslation()
     const router = useRouter()
     const [loading, setLoading] = useState(false)

     const statusMeta = getAppointmentStatusMeta(
          appointment.status,
          appointment.paymentStatus,
          "patient"
     )
     const toneStyles = {
          amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          slate: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
     } as const
     const statusBarStyles = {
          amber: "bg-amber-400",
          emerald: "bg-emerald-500",
          blue: "bg-blue-500",
          rose: "bg-rose-500",
          slate: "bg-slate-500",
     } as const
     const statusIcon = {
          amber: HourglassIcon,
          emerald: CheckCircle,
          blue: CheckCircle,
          rose: Cancel01Icon,
          slate: Cancel01Icon,
     } as const
     const isPending = hasAppointmentStatus(appointment, "pending")
     const isAssigned = hasAppointmentStatus(
          appointment,
          "confirmed",
          "checked_in",
          "waiting_in_queue",
          "in_consultation",
          "waiting_for_laboratory",
          "laboratory_in_progress",
          "laboratory_results_ready",
          "back_to_doctor",
          "completed"
     )
     const isCompleted = hasAppointmentStatus(appointment, "completed")
     const hasDoctor = Boolean(appointment.doctor)
     const canPay =
          isPending &&
          appointment.paymentStatus === "pending"

     const canCancel =
          isPending &&
          appointment.paymentStatus !== "completed"

     const canUpdate = 
          isPending && 
          appointment.paymentStatus === "pending"

     return (
          <Card className={cn(
               "group relative overflow-hidden rounded-[1.25rem] border border-border/60 bg-card/95 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]",
               isPending ? "border-amber-200/60 shadow-amber-500/5" : "border-muted/60"
          )}>
               <div className={cn("absolute inset-x-0 top-0 h-1", isPending ? statusBarStyles.amber : hasAppointmentStatus(appointment, "confirmed", "back_to_doctor") ? statusBarStyles.emerald : hasAppointmentStatus(appointment, "cancelled", "no_show") ? statusBarStyles.rose : statusBarStyles.blue)} />

               <CardHeader className="relative p-0">
                     <div className={cn(
                         "flex flex-col gap-4 p-4 sm:p-5",
                         isPending ? "bg-gradient-to-br from-amber-50/80 via-background to-background" : "bg-gradient-to-br from-background via-background to-muted/20"
                    )}>
                         <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0 flex-1">
                                   <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="rounded-full border-border/70 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                             {t("patientCard.appointmentId", {
                                                  id: appointment.appointmentId ?? t("appointments.pending"),
                                             })}
                                        </Badge>
                                        <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]", toneStyles[statusMeta.tone])}>
                                             <HugeiconsIcon icon={statusIcon[statusMeta.tone]} className="mr-1.5 h-3 w-3" />
                                             {statusMeta.label}
                                        </Badge>
                                        {appointment.paymentStatus === "completed" && (
                                             <Badge className="rounded-full border-0 bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                                  {t("staffAppointmentCard.paid")}
                                             </Badge>
                                        )}
                                        {hasDoctor && (
                                             <Badge variant="outline" className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                                                  {t("patientCard.doctorAssigned")}
                                             </Badge>
                                        )}
                                        {appointment.queueNumber && (
                                             <Badge className="rounded-full bg-blue-600 text-white">
                                                  {t("patientCard.queueNumber", { number: appointment.queueNumber })}
                                             </Badge>
                                        )}
                                   </div>
                                   <div className="mt-2.5 flex items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
                                             <HugeiconsIcon icon={Calendar01Icon} className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0">
                                             <CardTitle className="truncate text-[1.5rem] font-black tracking-tight sm:text-[1.7rem]">
                                                  {appointment.illnessCategory}
                                             </CardTitle>
                                             <CardDescription className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-muted-foreground/80 sm:text-sm">
                                                  {appointment.note}
                                             </CardDescription>
                                        </div>
                                   </div>
                              </div>

                              <div className="grid gap-2 sm:grid-cols-2 lg:w-[15rem]">
                                   <div className="rounded-2xl border border-border/60 bg-card px-3 py-2.5 shadow-sm">
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">{t("patientCard.fee")}</p>
                                        <p className="mt-1 text-xl font-black tracking-tight text-primary">
                                             {Number(appointment.fee).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-medium text-muted-foreground">{t("patientCard.tzs")}</p>
                                   </div>
                              <div className="rounded-2xl border border-border/60 bg-card px-3 py-2.5 shadow-sm">
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">{t("patientCard.visit")}</p>
                                        <p className="mt-1 text-xs font-bold text-foreground">
                                             {appointment.date || t("patientCard.notScheduled")}
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                             {appointment.startTime || "--:--"} - {appointment.endTime || "--:--"}
                                        </p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </CardHeader>

               <CardContent className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
                    <div className="grid gap-2.5 md:grid-cols-3">
                         <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-sm">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                   {t("doctorCard.doctor")}
                              </p>
                              <p className="mt-2 text-sm font-semibold">
                                   {appointment.doctor || t("patientCard.awaitingDoctor")}
                              </p>
                         </div>
                         <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-sm">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                   {t("patientCard.confirmedSlot")}
                              </p>
                              <p className="mt-2 text-sm font-semibold">
                                   {appointment.date || t("patientCard.notConfirmed")} · {appointment.startTime || "--:--"}
                              </p>
                         </div>
                         <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-sm">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                   {t("patientCard.dailyQueue")}
                              </p>
                              <p className="mt-2 text-sm font-semibold">
                                   {appointment.queueNumber
                                        ? t("patientCard.queueNumber", { number: appointment.queueNumber })
                                        : t("patientCard.assignedAtCheckIn")}
                              </p>
                         </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
                         <div className="rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm">
                              <div className="flex items-center gap-2">
                                   <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <HugeiconsIcon icon={InformationCircleIcon} className="h-3.5 w-3.5" />
                                   </div>
                                   <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">{t("patientCard.journeySummary")}</p>
                                        <p className="text-xs font-medium leading-5 text-muted-foreground">{statusMeta.summary}</p>
                                   </div>
                              </div>
                         </div>

                         {isAssigned && (
                              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 shadow-sm">
                                   <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                             <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                                                  <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
                                             </div>
                                             <div>
                                                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700/70">{t("patientCard.assignedDoctor")}</p>
                                                  <p className="text-sm font-bold text-foreground">{appointment.doctor}</p>
                                             </div>
                                        </div>
                                        <div className="text-right">
                                             <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700/70">{t("patientCard.schedule")}</p>
                                             <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                  <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5 text-emerald-700" />
                                                  {appointment.date} {t("patientCard.at")} {appointment.startTime}
                                             </p>
                                        </div>
                                   </div>
                              </div>
                         )}
                    </div>

                    {isCompleted && appointment.diagnosis && (
                         <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-3.5 shadow-sm">
                              <div className="flex items-start justify-between gap-4">
                                   <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                             <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700">
                                                  <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" />
                                             </div>
                                             <div>
                                                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700/70">{t("patientCard.doctorDiagnosis")}</p>
                                                  <p className="text-sm font-bold text-foreground">{appointment.diagnosis}</p>
                                             </div>
                                        </div>
                                   </div>
                                   {appointment.notes && (
                                        <div className="max-w-sm rounded-2xl border border-dashed border-blue-500/20 bg-background/70 p-2.5">
                                             <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">{t("search.clinicalNotes")}</p>
                                             <p className="mt-1 text-xs leading-5 text-muted-foreground">{appointment.notes}</p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}

                    <div className="flex flex-col gap-3 border-t border-border/60 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                              <HugeiconsIcon icon={InformationCircleIcon} className="h-3.5 w-3.5" />
                              <span>{isPending ? t("patientCard.awaitingAction") : t("patientCard.appointmentUpdated")}</span>
                         </div>
                         <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                              {!hideViewDetails && (
                                   <Button
                                        variant="outline"
                                        onClick={() => router.push(`/patient-dashboard/appointments/${appointment.id}`)}
                                        className="h-10 rounded-full border-border/70 px-4 text-sm font-semibold shadow-sm"
                                   >
                                        {t("doctorCard.viewDetails")}
                                   </Button>
                              )}

                              {canUpdate && (
                                   <UpdateAppointmentDialog appointment={appointment} />
                              )}

                              {canPay && (
                                   <PayingForAppointment
                                        appointmentId={appointment.id}
                                        fee={appointment.fee}
                                        disabled={loading}
                                   />
                              )}

                              {canCancel && (
                                   <CancelAppointment
                                        onConfirm={async (reason) => {
                                             setLoading(true)
                                             try {
                                                  await onCancel?.(appointment.id, reason)
                                             } finally {
                                                  setLoading(false)
                                             }
                                        }}
                                   />
                              )}
                         </div>
                    </div>
               </CardContent>
          </Card>
     )
}
