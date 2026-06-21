"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Appointment, Doctor } from "@/store/appointments/appointment.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
     Card,
     CardContent,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Clock01Icon, UserCircleIcon, CheckmarkCircle02Icon, Cancel01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"
import { hasAppointmentStatus } from "@/lib/appointment-queues"

type Props = {
     appointment: Appointment
     doctors: Doctor[]
     onAssign?: (data: {
          appointmentId: string
          doctorId: string
          appointmentDate: string
          startTime: string
          endTime: string
     }) => void | Promise<void>
     onCancel?: (appointmentId: string) => void | Promise<void>
     hideViewDetails?: boolean
}

export default function AssignAppointment({
     appointment,
     doctors,
     onAssign,
     onCancel,
     hideViewDetails = false,
}: Props) {
     const [doctorId, setDoctorId] = useState(appointment.doctorId ?? "")
     const [startTime, setStartTime] = useState(appointment.startTime ?? "")
     const [endTime, setEndTime] = useState(appointment.endTime ?? "")
     const [appointmentDate, setAppointmentDate] = useState(appointment.date ?? "")
     const [loading, setLoading] = useState(false)
     const router = useRouter()
     const pathname = usePathname()

     const isPending = hasAppointmentStatus(appointment, "pending")
     const isAccepted = hasAppointmentStatus(appointment, "accepted")
     const isPaymentComplete = appointment.paymentStatus === "completed"
     const basePath = pathname.includes("receptionist-dashboard")
          ? "/receptionist-dashboard/appointments"
          : "/appointments"
     const statusMeta = getAppointmentStatusMeta(
          appointment.status,
          appointment.paymentStatus,
          "receptionist"
     )
     const toneStyles = {
          amber: { tone: "secondary", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
          emerald: { tone: "default", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          blue: { tone: "default", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
          rose: { tone: "destructive", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
          slate: { tone: "secondary", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
     } as const
     
     const currentStatus = toneStyles[statusMeta.tone]

     const canAssign = Boolean(
          doctorId && appointmentDate && startTime && endTime && isPaymentComplete && !loading
     )

     const handleAssign = async () => {
          if (!doctorId || !appointmentDate || !startTime || !endTime) return

          setLoading(true)

          try {
               await onAssign?.({
                    appointmentId: appointment.id,
                    doctorId,
                    appointmentDate,
                    startTime,
                    endTime,
               })
          } finally {
               setLoading(false)
          }
     }

     const handleCancel = async () => {
          setLoading(true)

          try {
               await onCancel?.(appointment.id)
          } finally {
               setLoading(false)
          }
     }

     return (
          <motion.div
               layout
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.3 }}
          >
               <Card
                    className={cn(
                         "group overflow-hidden rounded-[1.25rem] border border-border/60 bg-card/95 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
                         currentStatus.border,
                    )}
               >
                    <div className="h-0.5 bg-gradient-to-r from-primary via-amber-400 to-emerald-500" />

                    <CardHeader className="p-0">
                         <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_16rem]">
                              <div className="p-4 sm:p-5">
                                   <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                             <div className="min-w-0 flex-1">
                                                  <div className="flex flex-wrap items-center gap-2">
                                                       <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.22em]", currentStatus.color, currentStatus.bg)}>
                                                            {statusMeta.label}
                                                       </Badge>
                                                       <Badge className={cn("rounded-full border-0 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.22em]", isPaymentComplete ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                                                            {isPaymentComplete ? "Payment verified" : "Awaiting payment"}
                                                       </Badge>
                                                  </div>

                                                  <div className="mt-3 flex items-start gap-3">
                                                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
                                                            <HugeiconsIcon icon={UserCircleIcon} className="h-6 w-6" />
                                                       </div>
                                                       <div className="min-w-0">
                                                            <CardTitle className="truncate text-xl font-black tracking-tight sm:text-2xl">
                                                                 {appointment.patient}
                                                            </CardTitle>
                                                            <p className="mt-1 text-sm text-muted-foreground">{appointment.email}</p>
                                                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary/60">
                                                                 {appointment.illnessCategory}
                                                            </p>
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="grid gap-2 sm:grid-cols-2 lg:w-[16rem]">
                                                  <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 shadow-sm">
                                                       <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Preferred</p>
                                                       <p className="mt-1 text-sm font-bold text-foreground">{appointmentDate || "Pick a date"}</p>
                                                       <p className="mt-1 text-[11px] text-muted-foreground">
                                                            {startTime || "--:--"} - {endTime || "--:--"}
                                                       </p>
                                                  </div>
                                                  <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 shadow-sm">
                                                       <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">State</p>
                                                       <p className="mt-1 text-sm font-bold text-foreground">{isPending ? "Waiting on front desk" : "Scheduling complete"}</p>
                                                       <p className="mt-1 text-[11px] text-muted-foreground">{appointment.doctor || "No doctor yet"}</p>
                                                  </div>
                                             </div>
                                        </div>

                                        {appointment.note && (
                                             <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-sm">
                                                  <div className="flex items-start gap-2">
                                                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm ring-1 ring-border/60">
                                                            <HugeiconsIcon icon={InformationCircleIcon} className="h-3.5 w-3.5" />
                                                       </div>
                                                       <div className="min-w-0">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Patient Note</p>
                                                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{appointment.note}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                        )}

                                        <div className="grid gap-2 md:grid-cols-3">
                                             {[
                                                  { label: "Choice 1", date: appointment.preferredDate },
                                                  { label: "Choice 2", date: appointment.preferredDate2 },
                                                  { label: "Choice 3", date: appointment.preferredDate3 },
                                             ].map((choice, i) => (
                                                  <motion.button
                                                       key={i}
                                                       type="button"
                                                       whileHover={choice.date && isPaymentComplete && !loading ? { scale: 1.02 } : {}}
                                                       whileTap={choice.date && isPaymentComplete && !loading ? { scale: 0.98 } : {}}
                                                       onClick={() => {
                                                            if (choice.date && isPaymentComplete && !loading) {
                                                                 setAppointmentDate(choice.date)
                                                            }
                                                       }}
                                                       className={cn(
                                                            "rounded-xl border p-3 text-left transition-all duration-300",
                                                            choice.date ? "cursor-pointer" : "cursor-not-allowed opacity-40",
                                                            appointmentDate === choice.date
                                                                 ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                                                                 : "border-border/60 bg-card hover:border-primary/40"
                                                       )}
                                                  >
                                                       <p className={cn(
                                                            "text-[9px] font-black uppercase tracking-[0.22em]",
                                                            appointmentDate === choice.date ? "text-primary-foreground/70" : "text-muted-foreground"
                                                       )}>
                                                            {choice.label}
                                                       </p>
                                                       <p className="mt-1.5 text-sm font-bold truncate">{choice.date || "Not set"}</p>
                                                  </motion.button>
                                             ))}
                                        </div>
                                   </div>
                              </div>

                              <div className="border-t border-border/60 bg-muted/20 p-4 lg:border-l lg:border-t-0 lg:p-4">
                                   <div className="flex h-full flex-col justify-between gap-4">
                                        <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
                                             <div className="flex items-center gap-2">
                                                  <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 text-primary" />
                                                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Action Status</p>
                                             </div>
                                             <p className="mt-1.5 text-sm font-medium leading-5 text-muted-foreground">
                                                  {isPaymentComplete
                                                       ? "This request can be scheduled once the required fields are filled."
                                                       : "Scheduling stays locked until payment is verified."}
                                             </p>
                                        </div>

                                        <div className="space-y-3">
                                             <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                                  <div className="space-y-2">
                                                       <label className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                                            Assigned Doctor
                                                       </label>
                                                       <Select value={doctorId} onValueChange={setDoctorId}>
                                                            <SelectTrigger
                                                                 className="h-11 rounded-xl border-2 border-border/60 bg-background px-3.5 text-sm font-semibold transition-all focus:border-primary"
                                                                 disabled={!isPaymentComplete || loading}
                                                            >
                                                                 <SelectValue placeholder="Select doctor" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-2 border-border/60 shadow-2xl">
                                                                 {doctors.map((doc) => (
                                                                      <SelectItem key={doc.id} value={doc.id} className="rounded-xl my-1 mx-2">
                                                                           <div className="flex items-center gap-2">
                                                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                                <span className="font-semibold">{doc.name}</span>
                                                                           </div>
                                                                      </SelectItem>
                                                                 ))}
                                                            </SelectContent>
                                                       </Select>
                                                  </div>

                                                  <div className="space-y-2">
                                                       <label className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                                            Slot Date
                                                       </label>
                                                       <DatePicker
                                                            value={appointmentDate}
                                                            onChange={setAppointmentDate}
                                                            className="h-11 rounded-xl border-2 border-border/60 bg-background px-3.5 text-sm font-semibold transition-all focus:border-primary"
                                                            disabled={!isPaymentComplete || loading}
                                                       />
                                                  </div>

                                                  <div className="space-y-2">
                                                       <label className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                                            Start Time
                                                       </label>
                                                       <TimePicker
                                                            value={startTime}
                                                            onChange={setStartTime}
                                                            className="h-11 rounded-xl border-2 border-border/60 bg-background px-3.5 text-sm font-semibold transition-all focus:border-primary"
                                                            disabled={!isPaymentComplete || loading}
                                                       />
                                                  </div>

                                                  <div className="space-y-2">
                                                       <label className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                                            End Time
                                                       </label>
                                                       <TimePicker
                                                            value={endTime}
                                                            onChange={setEndTime}
                                                            className="h-11 rounded-xl border-2 border-border/60 bg-background px-3.5 text-sm font-semibold transition-all focus:border-primary"
                                                            disabled={!isPaymentComplete || loading}
                                                       />
                                                  </div>
                                             </div>

                                             <div className={cn(
                                                  "rounded-xl px-3.5 py-2.5 text-sm font-semibold",
                                                  canAssign ? "bg-emerald-500/10 text-emerald-700" : "bg-muted/50 text-muted-foreground"
                                             )}>
                                                  {canAssign
                                                       ? "Appointment is ready to be assigned."
                                                       : isPaymentComplete
                                                            ? "Complete the fields above to assign."
                                                            : "Waiting for payment verification."}
                                             </div>
                                        </div>

                                        <div className="space-y-3">
                                             <Button
                                                  onClick={handleAssign}
                                                  disabled={!canAssign}
                                                  className="h-11 w-full rounded-full bg-primary font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
                                             >
                                                  {loading ? "Processing..." : "Confirm & Assign"}
                                             </Button>

                                             <Button
                                                  variant="outline"
                                                  className="h-11 w-full rounded-full border-2 border-rose-200 font-bold text-rose-600 transition-all hover:bg-rose-50"
                                                  type="button"
                                                  onClick={handleCancel}
                                                  disabled={loading || !isPaymentComplete}
                                             >
                                                  {loading ? "Processing..." : "Cancel Appointment"}
                                             </Button>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </CardHeader>

                    <CardContent className="border-t border-border/60 px-5 py-4 sm:px-6">
                         <AnimatePresence>
                              {isAccepted && (
                                   <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                                   >
                                        <div className="flex items-center gap-3">
                                             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4.5 w-4.5" />
                                             </div>
                                             <div>
                                                  <p className="text-sm font-bold text-foreground">Appointment scheduled</p>
                                                  <p className="text-sm text-muted-foreground">The patient and doctor have been notified.</p>
                                             </div>
                                        </div>
                                        <Button
                                             variant="outline"
                                             className="h-10 rounded-full border-2 border-rose-200 px-4 font-bold text-rose-600 transition-all hover:bg-rose-50"
                                             type="button"
                                             onClick={handleCancel}
                                             disabled={loading}
                                        >
                                             <HugeiconsIcon icon={Cancel01Icon} className="mr-2 h-4 w-4" />
                                             {loading ? "Processing..." : "Revoke & Cancel"}
                                        </Button>
                                   </motion.div>
                              )}
                         </AnimatePresence>

                         {!hideViewDetails && (
                              <div className="flex justify-end pt-3 mt-3 border-t border-border/60">
                                   <Button 
                                        variant="outline"
                                        onClick={() => router.push(`${basePath}/${appointment.id}`)}
                                        className="h-10 rounded-full border-border/70 px-4 font-semibold shadow-sm"
                                   >
                                        View Details
                                   </Button>
                              </div>
                         )}
                    </CardContent>
               </Card>
          </motion.div>
     )
}
