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
import { Calendar01Icon, Clock01Icon, UserIcon, CheckCircle, Cancel01Icon, HourglassIcon, InformationCircleIcon, Tick02Icon, Note01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"

type Props = {
     appointment: Appointment
     onCancel?: (appointmentId: string) => void | Promise<void>
     hideViewDetails?: boolean
}

export default function AppointmentDisplay({
     appointment,
     onCancel,
     hideViewDetails = false,
}: Props) {
     const router = useRouter()
     const [loading, setLoading] = useState(false)

     const statusColors = {
          pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          declined: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          expired: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
          completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
     } as const

     const statusIcons = {
          pending: HourglassIcon,
          accepted: CheckCircle,
          cancelled: Cancel01Icon,
          declined: Cancel01Icon,
          expired: Cancel01Icon,
          completed: CheckCircle,
     } as const

     const canPay =
          appointment.status === "pending" &&
          appointment.paymentStatus === "pending"

     const canCancel =
          appointment.status === "pending" &&
          appointment.paymentStatus !== "completed"

     const canUpdate = 
          appointment.status === "pending" && 
          appointment.paymentStatus === "pending"

     const statusMeta = getAppointmentStatusMeta(
          appointment.status,
          appointment.paymentStatus,
          "patient"
     )

     return (
          <Card className={cn(
               "relative overflow-hidden border-2 transition-all hover:shadow-xl rounded-md",
               appointment.status === "pending" ? "border-amber-200/60 shadow-amber-500/5" : "border-muted/60"
          )}>
               {/* STATUS BAR */}
               <div className={cn("absolute top-0 left-0 w-1.5 h-full", 
                    appointment.status === "pending" ? "bg-amber-400" : 
                    appointment.status === "accepted" ? "bg-emerald-500" :
                    appointment.status === "cancelled" ? "bg-rose-500" : "bg-blue-500"
               )} />

               <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                         <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                   <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusColors[appointment.status])}>
                                        <HugeiconsIcon icon={statusIcons[appointment.status]} className="w-3 h-3 mr-1" />
                                        {statusMeta.label}
                                   </Badge>
                                   {appointment.paymentStatus === "completed" && (
                                        <Badge className="bg-emerald-500 text-white border-none rounded-lg text-[10px]">PAID</Badge>
                                   )}
                              </div>
                              <CardTitle className="text-xl font-bold mt-2">
                                   {appointment.illnessCategory}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 italic text-muted-foreground/80">
                                   {appointment.note}
                              </CardDescription>
                         </div>
                         <div className="text-right">
                              <p className="text-2xl font-black tracking-tight text-primary">
                                   {Number(appointment.fee).toLocaleString()} <span className="text-xs font-medium text-muted-foreground">TZS</span>
                              </p>
                         </div>
                    </div>
               </CardHeader>

               <CardContent className="space-y-6">
                    {/* CHOICES GRID */}
                    <div className="bg-muted/30 rounded-md p-4 border border-muted/60">
                         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
                              <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3" />
                              Your Preferred Dates
                         </p>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {[
                                   { label: "Choice 1", date: appointment.preferredDate },
                                   { label: "Choice 2", date: appointment.preferredDate2 },
                                   { label: "Choice 3", date: appointment.preferredDate3 },
                              ].map((choice, i) => (
                                   <div key={i} className="bg-background rounded-xl p-3 border border-muted-foreground/10 shadow-sm">
                                        <p className="text-[9px] font-bold text-primary/60 uppercase">{choice.label}</p>
                                        <p className="text-sm font-semibold mt-0.5">{choice.date || "---"}</p>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* ASSIGNED DETAILS */}
                    {(appointment.status === "accepted" || appointment.status === "completed") && (
                         <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-md p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                              <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <HugeiconsIcon icon={UserIcon} className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                   </div>
                                   <div>
                                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Assigned Doctor</p>
                                        <p className="text-sm font-bold text-foreground">{appointment.doctor}</p>
                                   </div>
                              </div>
                              <div className="flex gap-4">
                                   <div className="text-right">
                                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-left sm:text-right">Schedule</p>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2 justify-start sm:justify-end">
                                             <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                                             {appointment.date} @ {appointment.startTime}
                                        </p>
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* DOCTOR'S REVIEW (IF COMPLETED) */}
                    {appointment.status === "completed" && appointment.diagnosis && (
                         <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 space-y-4">
                              <div className="space-y-2">
                                   <div className="flex items-center gap-2">
                                        <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 opacity-80">Doctor&apos;s Diagnosis</p>
                                   </div>
                                   <p className="text-sm font-bold text-foreground">{appointment.diagnosis}</p>
                              </div>
                              {appointment.notes && (
                                   <div className="space-y-2 pt-3 border-t border-blue-500/10">
                                        <div className="flex items-center gap-2">
                                             <HugeiconsIcon icon={Note01Icon} className="w-4 h-4 text-muted-foreground" />
                                             <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-80">Clinical Notes</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{appointment.notes}</p>
                                   </div>
                              )}
                         </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-muted/40 mt-4">
                         <div className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-center">
                              <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" />
                              {statusMeta.summary}
                         </div>
                         <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
                              {!hideViewDetails && (
                                   <Button 
                                        variant="outline" 
                                        onClick={() => router.push(`/patient-dashboard/appointments/${appointment.id}`)}
                                        className="rounded-md font-semibold shadow-sm"
                                   >
                                        View Details
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
                                                  await onCancel?.(appointment.id)
                                                  console.log("Reason:", reason)
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
