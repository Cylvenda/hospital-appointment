"use client"

import { useState } from "react"
import type { Appointment } from "@/store/appointments/appointment.types"
import { Badge } from "@/components/ui/badge"
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

type Props = {
     appointment: Appointment
     onCancel?: (appointmentId: string) => void | Promise<void>
}

export default function AppointmentDisplay({
     appointment,
     onCancel,
}: Props) {
     const [loading, setLoading] = useState(false)

     const statusTone = {
          pending: "ghost",
          accepted: "default",
          cancelled: "destructive",
          completed: "secondary",
     } as const

     const statusBorder = {
          pending: "border-amber-300/80",
          accepted: "border-emerald-300/80",
          cancelled: "border-red-300/80",
          completed: "border-slate-300/80",
     } as const

     const canPay =
          appointment.status === "pending" &&
          appointment.paymentStatus === "pending"

     const canCancel =
          appointment.status === "pending" &&
          appointment.paymentStatus !== "completed"

     const infoCards = [
          { label: "Category", value: appointment.illnessCategory },
          { label: "Your Doctor", value: appointment.doctor || "Unassigned" },
          { label: "Date", value: appointment.date },
          { label: "Start", value: appointment.startTime || "--:--" },
          { label: "End", value: appointment.endTime || "--:--" },
     ]
     
     return (
          <Card
               className={cn(
                    "group border shadow-sm transition-all hover:shadow-md bg-linear-to-br from-background via-background to-muted/20",
                    statusBorder[appointment.status]
               )}
          >
               {/* HEADER */}
               <CardHeader className="space-y-4 border-b border-border/40">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                         <div>
                              <CardTitle className="text-lg font-semibold">
                                   {appointment.patient}{" "}
                                   <span className="text-sm text-muted-foreground font-normal">
                                        {appointment.email}
                                   </span>
                              </CardTitle>

                              <CardDescription className="mt-1 leading-6">
                                   {appointment.note}
                              </CardDescription>
                         </div>

                         <Badge
                              variant={statusTone[appointment.status]}
                              className={cn(
                                   "capitalize px-3 py-1",
                                   appointment.status === "pending" && "bg-yellow-400"
                              )}
                         >
                              {appointment.status}
                         </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                         Preferred Date:{" "}
                         <span className="font-medium text-foreground">
                              {appointment.preferredDate}
                         </span>
                    </p>
               </CardHeader>

               {/* CONTENT */}
               <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                         {infoCards.map((item, idx) => (
                              <div
                                   key={idx}
                                   className={cn(
                                        "rounded-2xl border bg-muted/30 p-4",
                                        statusBorder[appointment.status]
                                   )}
                              >
                                   <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                        {item.label}
                                   </p>
                                   <p className="mt-2 text-sm font-semibold text-foreground">
                                        {item.value}
                                   </p>
                              </div>
                         ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-2">
                         {canPay && (
                              <PayingForAppointment
                                   appointmentId={appointment.id}
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
               </CardContent>
          </Card>
     )
}