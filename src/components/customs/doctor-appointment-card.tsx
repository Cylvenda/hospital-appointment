"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
     Card,
     CardContent,
} from "@/components/ui/card"
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogDescription,
     DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import type { Appointment } from "@/store/appointments/appointment.types"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
     Clock01Icon, 
     Calendar03Icon, 
     UserIcon, 
     MedicineBottle01Icon, 
     Tick02Icon, 
     Cancel01Icon,
     Note01Icon,
     Doctor01Icon,
     InformationCircleIcon
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type Props = {
     appointment: Appointment
     hideViewDetails?: boolean
}

export const DoctorAppointmentCard = ({ appointment, hideViewDetails = false }: Props) => {
     const router = useRouter()
     const { updateAppointment } = useAppointmentStore()
     const [isCompleteOpen, setIsCompleteOpen] = useState(false)
     const [isCancelOpen, setIsCancelOpen] = useState(false)
     const [loading, setLoading] = useState(false)
     
     // Form states for completion
     const [diagnosis, setDiagnosis] = useState(appointment.diagnosis || "")
     const [clinicalNotes, setClinicalNotes] = useState(appointment.notes || "")

     const handleComplete = async () => {
          if (!diagnosis.trim()) {
               toast.error("Please provide a diagnosis before completing.")
               return
          }

          setLoading(true)
          try {
               await updateAppointment(appointment.id, {
                    status: "completed",
                    diagnosis: diagnosis.trim(),
                    notes: clinicalNotes.trim()
               })
               toast.success("Appointment marked as completed.")
               setIsCompleteOpen(false)
          } catch {
               toast.error("Failed to complete appointment.")
          } finally {
               setLoading(false)
          }
     }

     const handleCancel = async () => {
          setLoading(true)
          try {
               await updateAppointment(appointment.id, { status: "cancelled" })
               toast.success("Appointment cancelled.")
               setIsCancelOpen(false)
          } catch {
               toast.error("Failed to cancel appointment.")
          } finally {
               setLoading(false)
          }
     }

     const statusStyles = {
          pending: "bg-amber-100 text-amber-700 border-amber-200",
          accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
          completed: "bg-blue-100 text-blue-700 border-blue-200",
          cancelled: "bg-rose-100 text-rose-700 border-rose-200",
          declined: "bg-gray-100 text-gray-700 border-gray-200",
          expired: "bg-slate-100 text-slate-700 border-slate-200"
     }

     return (
          <motion.div
               layout
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
          >
               <Card className="rounded-md border-2 border-muted/40 shadow-sm overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                    <CardContent className="p-0">
                         <div className="flex flex-col md:flex-row">
                              {/* Left Side: Patient Info & Time */}
                              <div className="p-8 flex-1 space-y-6">
                                   <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                             <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                                  <HugeiconsIcon icon={UserIcon} className="w-7 h-7" />
                                             </div>
                                             <div>
                                                  <h3 className="text-2xl font-black tracking-tight">{appointment.patient}</h3>
                                                  <p className="text-muted-foreground font-medium">{appointment.email}</p>
                                             </div>
                                        </div>
                                        <div className={cn(
                                             "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                             statusStyles[appointment.status] || statusStyles.pending
                                        )}>
                                             {appointment.status === "accepted" ? "Action Required" : appointment.status}
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-2xl border border-muted-foreground/5">
                                             <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                                                  <HugeiconsIcon icon={Calendar03Icon} className="w-5 h-5 text-primary" />
                                             </div>
                                             <div>
                                                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground opacity-60 leading-none mb-1">Appointment Date</p>
                                                  <p className="font-bold text-sm">{appointment.date || "Not Scheduled"}</p>
                                             </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-2xl border border-muted-foreground/5">
                                             <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                                                  <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5 text-primary" />
                                             </div>
                                             <div>
                                                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground opacity-60 leading-none mb-1">Time Slot</p>
                                                  <p className="font-bold text-sm">{appointment.startTime || "--:--"} - {appointment.endTime || "--:--"}</p>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                             <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4 text-muted-foreground" />
                                             <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Patient Symptoms</p>
                                        </div>
                                        <p className="text-base font-medium leading-relaxed bg-primary/5 p-4 rounded-md border border-primary/10 italic">
                                             &quot;{appointment.note}&quot;
                                        </p>
                                   </div>

                                   {appointment.status === "completed" && (
                                        <div className="pt-4 mt-4 border-t-2 border-dashed border-muted space-y-4">
                                             <div className="space-y-2">
                                                  <div className="flex items-center gap-2">
                                                       <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 text-emerald-500" />
                                                       <p className="text-xs font-black uppercase tracking-widest text-emerald-600 opacity-60">Recorded Diagnosis</p>
                                                  </div>
                                                  <p className="text-sm font-bold text-emerald-900">{appointment.diagnosis}</p>
                                             </div>
                                             {appointment.notes && (
                                                  <div className="space-y-2">
                                                       <div className="flex items-center gap-2">
                                                            <HugeiconsIcon icon={Note01Icon} className="w-4 h-4 text-muted-foreground" />
                                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Clinical Notes</p>
                                                       </div>
                                                       <p className="text-sm text-muted-foreground leading-relaxed">{appointment.notes}</p>
                                                  </div>
                                             )}
                                        </div>
                                   )}
                              </div>

                              {/* Right Side: Actions */}
                              {(appointment.status === "accepted" || appointment.status === "pending") && (
                                   <div className="w-full md:w-64 bg-muted/20 border-l p-8 flex flex-col justify-center gap-4">
                                        {appointment.status === "pending" ? (
                                             <Button 
                                                  onClick={async () => {
                                                       setLoading(true)
                                                       try {
                                                            await updateAppointment(appointment.id, { status: "accepted" })
                                                            toast.success("Assignment accepted.")
                                                       } catch {
                                                            toast.error("Failed to accept assignment.")
                                                       } finally {
                                                            setLoading(false)
                                                       }
                                                  }}
                                                  disabled={loading}
                                                  className="h-14 rounded-md font-black bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all w-full"
                                             >
                                                  <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 mr-2" />
                                                  Accept Assignment
                                             </Button>
                                        ) : (
                                             <Button 
                                                  onClick={() => setIsCompleteOpen(true)}
                                                  className="h-14 rounded-md font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full"
                                             >
                                                  <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 mr-2" />
                                                  Finish Appointment
                                             </Button>
                                        )}
                                        <Button 
                                             variant="outline"
                                             onClick={() => setIsCancelOpen(true)}
                                             className="h-14 rounded-md border-2 font-bold text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200 transition-all w-full"
                                        >
                                             <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5 mr-2" />
                                             Cancel Visit
                                        </Button>
                                        {!hideViewDetails && (
                                             <Button 
                                                  variant="outline"
                                                  onClick={() => router.push(`/doctor-dashboard/appointments/${appointment.id}`)}
                                                  className="h-14 rounded-md border-2 font-bold shadow-sm hover:bg-muted/50 transition-all w-full mt-auto"
                                             >
                                                  View Details
                                             </Button>
                                        )}
                                   </div>
                              )}

                              {!(appointment.status === "accepted" || appointment.status === "pending") && !hideViewDetails && (
                                   <div className="w-full md:w-64 bg-muted/20 border-l p-8 flex flex-col justify-end gap-4">
                                        <Button 
                                             variant="outline"
                                             onClick={() => router.push(`/doctor-dashboard/appointments/${appointment.id}`)}
                                             className="h-14 rounded-md border-2 font-bold shadow-sm hover:bg-muted/50 transition-all w-full"
                                        >
                                             View Details
                                        </Button>
                                   </div>
                              )}
                         </div>
                    </CardContent>
               </Card>

               {/* Completion Dialog */}
               <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
                    <DialogContent className="sm:max-w-2xl rounded-md p-0 overflow-hidden border-none shadow-2xl">
                         <div className="bg-primary p-8 text-white">
                              <DialogHeader>
                                   <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
                                        <HugeiconsIcon icon={Doctor01Icon} className="w-6 h-6 text-white" />
                                   </div>
                                   <DialogTitle className="text-3xl font-black tracking-tight text-white">Clinical Assessment</DialogTitle>
                                   <DialogDescription className="text-white/80 font-medium text-lg">
                                        Record your findings for {appointment.patient}.
                                   </DialogDescription>
                              </DialogHeader>
                         </div>

                         <div className="p-8 space-y-6">
                              <div className="space-y-4">
                                   <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Primary Diagnosis</h3>
                                   </div>
                                   <div className="relative group">
                                        <HugeiconsIcon icon={MedicineBottle01Icon} className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                             type="text"
                                             value={diagnosis}
                                             onChange={(e) => setDiagnosis(e.target.value)}
                                             placeholder="e.g. Acute Pharyngitis"
                                             className="w-full h-14 rounded-md pl-14 pr-6 border-2 focus:border-primary transition-all bg-muted/20 focus:bg-background text-base font-bold outline-none"
                                        />
                                   </div>
                              </div>

                              <div className="space-y-4">
                                   <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Treatment & Clinical Notes</h3>
                                   </div>
                                   <div className="relative group">
                                        <HugeiconsIcon icon={Note01Icon} className="absolute left-5 top-5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Textarea
                                             value={clinicalNotes}
                                             onChange={(e) => setClinicalNotes(e.target.value)}
                                             placeholder="Prescribed treatment, follow-up advice, etc..."
                                             className="min-h-40 rounded-md pl-14 pt-5 border-2 border-secondary focus:border-primary transition-all bg-muted/20 focus:bg-background text-base font-medium resize-none outline-none"
                                        />
                                   </div>
                              </div>
                         </div>

                         <DialogFooter className="p-8 bg-muted/30 border-t flex items-center justify-between gap-4">
                              <Button variant="ghost" onClick={() => setIsCompleteOpen(false)} disabled={loading} className="rounded-md h-10 px-8 font-bold text-muted-foreground hover:text-foreground">
                                   Cancel
                              </Button>
                              <Button onClick={handleComplete} disabled={loading} className="rounded-md h-10 px-8 font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                                   <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 mr-2" />
                                   {loading ? "Recording..." : "Finalize & Complete"}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>

               {/* Cancellation Dialog */}
               <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                    <DialogContent className="sm:max-w-md rounded-md p-8 text-center">
                         <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6">
                              <HugeiconsIcon icon={Cancel01Icon} className="w-10 h-10" />
                         </div>
                         <DialogHeader>
                              <DialogTitle className="text-2xl font-black tracking-tight text-center">Cancel Appointment?</DialogTitle>
                              <DialogDescription className="text-lg font-medium text-center pt-2">
                                   Are you sure you want to cancel the visit with <span className="text-foreground font-bold">{appointment.patient}</span>?
                              </DialogDescription>
                         </DialogHeader>
                         <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-8 items-center justify-between ">
                              <Button variant="ghost" onClick={() => setIsCancelOpen(false)} disabled={loading} className="border-secondary rounded-md h-12 font-bold">
                                   Go Back
                              </Button>
                              <Button variant="destructive" onClick={handleCancel} disabled={loading} className="border-secondary rounded-md h-12 font-bold ">
                                   {loading ? "Cancelling..." : "Confirm Cancellation"}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </motion.div>
     )
}
