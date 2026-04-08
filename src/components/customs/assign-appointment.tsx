"use client"

import { useState } from "react"
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
import { cn } from "@/lib/utils"

type Doctor = {
     id: string
     name: string
}

type Appointment = {
     id: string
     patient: string
     illnessCategory: string
     status: "pending" | "approved" | "cancelled"
     doctor?: string | null
     startTime?: string | null
     endTime?: string | null
     note: string
}

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
     const [status, setStatus] = useState(appointment.status)
     const [assignedDoctor, setAssignedDoctor] = useState(appointment.doctor ?? "")
     const [assignedStartTime, setAssignedStartTime] = useState(appointment.startTime ?? "")
     const [assignedEndTime, setAssignedEndTime] = useState(appointment.endTime ?? "")
     const [doctorId, setDoctorId] = useState("")
     const [startTime, setStartTime] = useState("")
     const [endTime, setEndTime] = useState("")
     const [loading, setLoading] = useState(false)

     const isPending = status === "pending"
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
     const canAssign = Boolean(doctorId && startTime && endTime && !loading)
     const isApproved = status === "approved"

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

               const selectedDoctor = doctors.find((doc) => doc.id === doctorId)
               setAssignedDoctor(selectedDoctor?.name ?? doctorId)
               setAssignedStartTime(startTime)
               setAssignedEndTime(endTime)
               setStatus("approved")
          } finally {
               setLoading(false)
          }
     }

     const handleCancel = async () => {
          setLoading(true)

          try {
               await onCancel?.(appointment.id)
               setStatus("cancelled")
          } finally {
               setLoading(false)
          }
     }

     return (
          <Card
               className={cn(
                    "border bg-linear-to-br from-background via-background to-muted/20 shadow-sm transition-shadow hover:shadow-md"
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
                              variant={statusTone[status]}
                              className="capitalize self-start px-3 py-1"
                         >
                              {status}
                         </Badge>
                    </div>
               </CardHeader>

               <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                         <div className={`rounded-2xl border bg-muted/30 p-4 ${statusBorder[status]} `}>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   Category
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {appointment.illnessCategory}
                              </p>
                         </div>

                         <div className={`rounded-2xl border bg-muted/30 p-4 ${statusBorder[status]} `}>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   Doctor
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {assignedDoctor || "Unassigned"}
                              </p>
                         </div>

                         <div className={`rounded-2xl border  bg-muted/30 p-4 ${statusBorder[status]} `}>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   Start
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {assignedStartTime || "--:--"}
                              </p>
                         </div>

                         <div className={`rounded-2xl border  bg-muted/30 p-4 ${statusBorder[status]}`} >
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                   End
                              </p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                   {assignedEndTime || "--:--"}
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

                              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
                                   <div className="space-y-2 w-full">
                                        <label className="text-sm font-medium text-foreground">
                                             Assign Doctor
                                        </label>

                                        <Select onValueChange={setDoctorId}>
                                             <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-background w-full">
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
                                             onChange={(e) => setStartTime(e.target.value)}
                                             className="h-11 rounded-2xl border-border/70 bg-background"
                                        />
                                   </div>

                                   <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                             End Time
                                        </label>
                                        <Input
                                             type="time"
                                             value={endTime}
                                             onChange={(e) => setEndTime(e.target.value)}
                                             className="h-11 rounded-2xl border-border/70 bg-background"
                                        />
                                   </div>
                              </div>

                              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                   <p
                                        className={cn(
                                             "text-sm transition-colors",
                                             canAssign
                                                  ? "text-emerald-600"
                                                  : "text-muted-foreground"
                                        )}
                                   >
                                        {canAssign
                                             ? "Ready to confirm this appointment."
                                             : "Choose a doctor, start time, and end time to continue."}
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
                                             disabled={loading}
                                        >
                                             Cancel Appointment
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
