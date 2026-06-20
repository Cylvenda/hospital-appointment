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
import { AlertCircleIcon, Calendar03Icon, Clock01Icon, UserCircleIcon, CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"

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
     
     const basePath = pathname.includes("receptionist-dashboard") 
          ? "/receptionist-dashboard/appointments" 
          : "/appointments"

     const isPending = appointment.status === "pending"
     const isAccepted = appointment.status === "accepted"
     const isPaymentComplete = appointment.paymentStatus === "completed"
     const statusMeta = getAppointmentStatusMeta(
          appointment.status,
          appointment.paymentStatus,
          "receptionist"
     )
     
     const statusConfig = {
          pending: { tone: "secondary", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
          accepted: { tone: "default", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          cancelled: { tone: "destructive", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
          declined: { tone: "destructive", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
          expired: { tone: "secondary", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
          completed: { tone: "secondary", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
     } as const

     const currentStatus = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending

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
                         "border-2 overflow-hidden rounded-md shadow-xl transition-all duration-300",
                         currentStatus.border,
                         "hover:shadow-2xl hover:border-primary/30"
                    )}
               >
                    <CardHeader className="p-8 pb-4">
                         <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex items-start gap-5">
                                   <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                                        <HugeiconsIcon icon={UserCircleIcon} className="w-9 h-9" />
                                   </div>
                                   <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black tracking-tight">
                                             {appointment.patient}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                             <span className="text-sm font-medium text-muted-foreground">{appointment.email}</span>
                                             <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                             <span className="text-xs font-black uppercase tracking-widest text-primary/60">{appointment.illnessCategory}</span>
                                        </div>
                                        {appointment.note && (
                                             <p className="text-sm text-muted-foreground mt-3 leading-relaxed bg-muted/30 p-4 rounded-2xl border border-muted/50 italic">
                                                  {appointment.note}
                                             </p>
                                        )}
                                   </div>
                              </div>

                              <div className="flex flex-col items-end gap-3">
                                   <Badge
                                        variant={currentStatus.tone}
                                        className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm", currentStatus.color, currentStatus.bg)}
                                   >
                                        {statusMeta.label}
                                   </Badge>
                                   <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/50">Payment Status</p>
                                        <p className={cn("text-sm font-bold", isPaymentComplete ? "text-emerald-600" : "text-amber-600")}>
                                             {isPaymentComplete ? "✓ Verified" : "⚠ Awaiting Payment"}
                                        </p>
                                   </div>
                              </div>
                         </div>

                         <div className="mt-8">
                              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                   <HugeiconsIcon icon={Calendar03Icon} className="w-4 h-4" /> Patient Preferences
                              </p>
                              <div className="flex flex-wrap gap-3">
                                   {[
                                        { label: "Choice 1", date: appointment.preferredDate },
                                        { label: "Choice 2", date: appointment.preferredDate2 },
                                        { label: "Choice 3", date: appointment.preferredDate3 },
                                   ].map((choice, i) => (
                                        <motion.div
                                             key={i}
                                             whileHover={choice.date && isPaymentComplete && !loading ? { scale: 1.05 } : {}}
                                             whileTap={choice.date && isPaymentComplete && !loading ? { scale: 0.95 } : {}}
                                             onClick={() => {
                                                  if (choice.date && isPaymentComplete && !loading) {
                                                       setAppointmentDate(choice.date)
                                                  }
                                             }}
                                             className={cn(
                                                  "px-5 py-3 rounded-2xl border-2 transition-all duration-300",
                                                  choice.date ? "cursor-pointer" : "opacity-30 cursor-not-allowed",
                                                  appointmentDate === choice.date
                                                       ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20"
                                                       : "bg-background border-muted hover:border-primary/50"
                                             )}
                                        >
                                             <p className={cn(
                                                  "text-[9px] uppercase font-black tracking-widest mb-1",
                                                  appointmentDate === choice.date ? "text-primary-foreground/70" : "text-muted-foreground"
                                             )}>
                                                  {choice.label}
                                             </p>
                                             <p className="text-sm font-black truncate">
                                                  {choice.date || "Not set"}
                                             </p>
                                        </motion.div>
                                   ))}
                              </div>
                         </div>
                    </CardHeader>

                    <CardContent className="p-8 pt-0 space-y-8">
                         <AnimatePresence>
                              {isPending && (
                                   <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-6 pt-6 border-t border-dashed border-muted"
                                   >
                                        <div className="flex flex-col gap-2">
                                             <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                                                  <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5 text-primary" />
                                                  Schedule Appointment Slot
                                             </h4>
                                             <p className="text-sm text-muted-foreground">
                                                  Select the appropriate medical professional and define the appointment window.
                                             </p>
                                        </div>

                                        {!isPaymentComplete && (
                                             <div className="flex items-center gap-4 rounded-[2rem] border-2 border-amber-200 bg-amber-50/50 p-6 text-amber-900 shadow-inner">
                                                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                                                       <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
                                                  </div>
                                                  <p className="text-sm font-medium leading-relaxed">
                                                       Scheduling is <span className="font-bold underline">locked</span> until payment is verified. Patients must complete their transaction before they can be assigned to a doctor.
                                                  </p>
                                             </div>
                                        )}

                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                             <div className="space-y-2">
                                                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                                       Assigned Doctor
                                                  </label>
                                                  <Select value={doctorId} onValueChange={setDoctorId}>
                                                       <SelectTrigger
                                                            className="h-14 rounded-2xl border-2 border-muted bg-background focus:border-primary transition-all text-sm font-bold px-6"
                                                            disabled={!isPaymentComplete || loading}
                                                       >
                                                            <SelectValue placeholder="Select Staff" />
                                                       </SelectTrigger>
                                                       <SelectContent className="rounded-2xl shadow-2xl border-2 border-muted">
                                                            {doctors.map((doc) => (
                                                                 <SelectItem key={doc.id} value={doc.id} className="rounded-xl my-1 mx-2">
                                                                      <div className="flex items-center gap-2">
                                                                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                                           <span className="font-bold">{doc.name}</span>
                                                                      </div>
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             </div>

                                             <div className="space-y-2">
                                                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                                       Slot Date
                                                  </label>
                                                  <DatePicker
                                                       value={appointmentDate}
                                                       onChange={setAppointmentDate}
                                                       className="h-14 rounded-2xl border-2 border-muted bg-background focus:border-primary transition-all text-sm font-bold text-center"
                                                       disabled={!isPaymentComplete || loading}
                                                  />
                                             </div>

                                             <div className="space-y-2">
                                                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                                       Start Time
                                                  </label>
                                                  <TimePicker
                                                       value={startTime}
                                                       onChange={setStartTime}
                                                       className="h-14 rounded-2xl border-2 border-muted bg-background focus:border-primary transition-all text-sm font-bold text-center"
                                                       disabled={!isPaymentComplete || loading}
                                                  />
                                             </div>

                                             <div className="space-y-2">
                                                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                                       End Time
                                                  </label>
                                                  <TimePicker
                                                       value={endTime}
                                                       onChange={setEndTime}
                                                       className="h-14 rounded-2xl border-2 border-muted bg-background focus:border-primary transition-all text-sm font-bold text-center"
                                                       disabled={!isPaymentComplete || loading}
                                                  />
                                             </div>
                                        </div>

                                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pt-4">
                                             <p className={cn(
                                                  "text-sm font-bold transition-all px-4 py-2 rounded-full",
                                                  canAssign ? "text-emerald-700 bg-emerald-100/50" : "text-muted-foreground bg-muted/50"
                                             )}>
                                                  {canAssign
                                                       ? "✓ Appointment is ready to be assigned."
                                                       : isPaymentComplete
                                                            ? "⚠ Please complete all required fields."
                                                            : "🔒 Waiting for payment verification."}
                                             </p>

                                             <div className="flex flex-col gap-4 sm:w-auto sm:flex-row">
                                                  <Button
                                                       onClick={handleAssign}
                                                       disabled={!canAssign}
                                                       className="h-14 rounded-md px-10 text-base font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                                  >
                                                       {loading ? "Processing..." : "Confirm & Assign Slot"}
                                                  </Button>

                                                  <Button
                                                       variant="outline"
                                                       className="h-14 rounded-md px-8 border-2 text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200 transition-all font-bold"
                                                       type="button"
                                                       onClick={handleCancel}
                                                       disabled={loading || !isPaymentComplete}
                                                  >
                                                       {loading ? "Processing..." : "Cancel Appointment"}
                                                  </Button>
                                             </div>
                                        </div>
                                   </motion.div>
                              )}

                              {isAccepted && (
                                   <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-dashed border-muted"
                                   >
                                        <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-6 h-6" />
                                             </div>
                                             <div>
                                                  <p className="font-bold text-foreground">Appointment Scheduled</p>
                                                  <p className="text-sm text-muted-foreground">The patient and doctor have been notified.</p>
                                             </div>
                                        </div>
                                        <Button
                                             variant="outline"
                                             className="h-14 rounded-md px-10 border-2 text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200 transition-all font-bold group"
                                             type="button"
                                             onClick={handleCancel}
                                             disabled={loading}
                                        >
                                             <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                                             {loading ? "Processing..." : "Revoke & Cancel"}
                                        </Button>
                                   </motion.div>
                              )}
                         </AnimatePresence>

                         {!hideViewDetails && (
                              <div className="flex justify-end pt-6 mt-6 border-t border-muted/30">
                                   <Button 
                                        variant="outline"
                                        onClick={() => router.push(`${basePath}/${appointment.id}`)}
                                        className="rounded-md font-bold shadow-sm"
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
