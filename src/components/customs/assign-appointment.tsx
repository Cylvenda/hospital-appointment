"use client"

import { useState } from "react"
import type { Appointment, Doctor } from "@/store/appointments/appointment.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

type Props = {
     appointment: Appointment
     doctors: Doctor[]
     onAssign?: (data: {
          appointmentId: string
          doctorId: string
          startTime: string
          endTime: string
     }) => void | Promise<void>
     onCancel?: (appointmentId: string) => void | Promise<void>
}

export default function AssignAppointment({
     appointment,
     doctors,
     onAssign,
     onCancel,
}: Props) {
     const [doctorId, setDoctorId] = useState(appointment.doctorId ?? "")
     const [startTime, setStartTime] = useState(appointment.startTime ?? "")
     const [endTime, setEndTime] = useState(appointment.endTime ?? "")
     const [loading, setLoading] = useState(false)

     const isPending = appointment.status === "pending"
     const isApproved = appointment.status === "approved"
     const isPaymentComplete = appointment.paymentStatus === "completed"
     const statusTone = {
          pending: "secondary",
          approved: "default",
          cancelled: "destructive",
     } as const
     const statusBorder = {
          pending: "border-amber-300/80",
          approved: "border-emerald-300/80",
          cancelled: "border-red-300/80",
     } as const
     const canAssign = Boolean(
          doctorId && startTime && endTime && isPaymentComplete && !loading
     )

     const handleAssign = async () => {
          if (!doctorId || !startTime || !endTime) return

          setLoading(true)

          try {
               await onAssign?.({
                    appointmentId: appointment.id,
                    doctorId,
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
          <Card
               className={cn(
                    "border bg-linear-to-br from-background via-background to-muted/20 shadow-sm transition-shadow hover:shadow-md",
                    statusBorder[appointment.status]
               )}
          >
               <CardHeader className="gap-4 border-b border-border/50 pb-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                         <div className="space-y-1">
                              <CardTitle className="text-lg font-semibold">
                                   {appointment.patient}
                              </CardTitle>
                              <CardDescription className="max-w-2xl leading-6">
                                   {appointment.note}
                              </CardDescription>
                         </div>

                         <Badge
                              variant={statusTone[appointment.status]}
                              className="capitalize self-start px-3 py-1"
                         >
                              {appointment.status}
                         </Badge>
                    </div>
               </CardHeader>

               <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                         <div className={cn("rounded-2xl border bg-muted/30 p-4", statusBorder[appointment.status])}>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   Category
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {appointment.illnessCategory}
                              </p>
                         </div>

                         <div className={cn("rounded-2xl border bg-muted/30 p-4", statusBorder[appointment.status])}>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   Doctor
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {appointment.doctor || "Unassigned"}
                              </p>
                         </div>

                         <div className={cn("rounded-2xl border bg-muted/30 p-4", statusBorder[appointment.status])}>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   Start
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {appointment.startTime || "--:--"}
                              </p>
                         </div>

                         <div className={cn("rounded-2xl border bg-muted/30 p-4", statusBorder[appointment.status])}>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   End
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {appointment.endTime || "--:--"}
                              </p>
                         </div>
                    </div>

                    {isPending && (
                         <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-4 sm:p-5">
                              <div className="mb-4 flex flex-col gap-1">
                                   <h4 className="text-sm font-semibold text-foreground">
                                        Assign appointment slot
                                   </h4>
                                   <p className="text-sm text-muted-foreground">
                                        Select a doctor and define the consultation window.
                                   </p>
                              </div>

                              {!isPaymentComplete && (
                                   <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-amber-800">
                                       <HugeiconsIcon
                                            icon={AlertCircleIcon}
                                            strokeWidth={1.8}
                                            className="mt-0.5 size-4 shrink-0"
                                       />
                                        <p className="text-sm">
                                             This appointment is still awaiting payment. It can be
                                             assigned or cancelled from this admin flow only after
                                             payment is completed.
                                        </p>
                                   </div>
                              )}

                              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
                                   <div className="w-full space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                             Assign Doctor
                                        </label>

                                        <Select value={doctorId} onValueChange={setDoctorId}>
                                             <SelectTrigger
                                                  className="h-11 w-full rounded-2xl border-border/70 bg-background"
                                                  disabled={!isPaymentComplete || loading}
                                             >
                                                  <SelectValue placeholder="Select doctor" />
                                             </SelectTrigger>

                                             <SelectContent>
                                                  {doctors.map((doc) => (
                                                       <SelectItem key={doc.id} value={doc.id}>
                                                            {doc.name}
                                                       </SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                   </div>

                                   <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                             Start Time
                                        </label>
                                        <Input
                                             type="time"
                                             value={startTime}
                                             onChange={(event) => setStartTime(event.target.value)}
                                             className="h-11 rounded-2xl border-border/70 bg-background"
                                             disabled={!isPaymentComplete || loading}
                                        />
                                   </div>

                                   <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                             End Time
                                        </label>
                                        <Input
                                             type="time"
                                             value={endTime}
                                             onChange={(event) => setEndTime(event.target.value)}
                                             className="h-11 rounded-2xl border-border/70 bg-background"
                                             disabled={!isPaymentComplete || loading}
                                        />
                                   </div>
                              </div>

                              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                   <p
                                        className={cn(
                                             "text-sm transition-colors",
                                             canAssign ? "text-emerald-600" : "text-muted-foreground"
                                        )}
                                   >
                                        {canAssign
                                             ? "Ready to confirm this appointment."
                                             : isPaymentComplete
                                               ? "Choose a doctor, start time, and end time to continue."
                                               : "Waiting for payment before scheduling can continue."}
                                   </p>

                                   <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                        <Button
                                             onClick={handleAssign}
                                             disabled={!canAssign}
                                             className="h-11 rounded-2xl px-6"
                                        >
                                             {loading ? "Assigning..." : "Assign Appointment"}
                                        </Button>

                                        <Button
                                             variant="destructive"
                                             className="h-11 rounded-2xl px-6 sm:min-w-40"
                                             type="button"
                                             onClick={handleCancel}
                                             disabled={loading || !isPaymentComplete}
                                        >
                                             {loading ? "Cancelling..." : "Cancel Appointment"}
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    )}

                    {isApproved && (
                         <div className="flex justify-end">
                              <Button
                                   variant="destructive"
                                   className="h-11 rounded-2xl px-6 sm:min-w-40"
                                   type="button"
                                   onClick={handleCancel}
                                   disabled={loading}
                              >
                                   {loading ? "Cancelling..." : "Cancel Appointment"}
                              </Button>
                         </div>
                    )}
               </CardContent>
          </Card>
     )
}
