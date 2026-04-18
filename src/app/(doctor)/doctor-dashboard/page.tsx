"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { getDashboardPath } from "@/lib/role-dashboard"
import { toast } from "react-toastify"

export default function DoctorDashboardPage() {
     const router = useRouter()
     const { user, checkAuth } = useAuthUserStore()
     const { appointments, loading, error, fetchAppointments, updateAppointment } = useAppointmentStore()

     useEffect(() => {
          void (async () => {
               const authenticated = await checkAuth()
               if (!authenticated) {
                    router.replace("/login")
                    return
               }

               const resolvedRole = useAuthUserStore.getState().user?.role
               if (resolvedRole !== "doctor") {
                    router.replace(getDashboardPath(resolvedRole))
                    return
               }

               await fetchAppointments()
          })()
     }, [checkAuth, fetchAppointments, router, user?.role])

     const handleAcceptAppointment = async (appointmentId: string) => {
          try {
               await updateAppointment(appointmentId, { status: "accepted" })
               toast.success("Appointment accepted successfully")
          } catch {
               toast.error("Failed to accept appointment")
          }
     }

     const handleDeclineAppointment = async (appointmentId: string) => {
          try {
               await updateAppointment(appointmentId, { status: "declined" })
               toast.success("Appointment declined")
          } catch {
               toast.error("Failed to decline appointment")
          }
     }

     const handleCompleteAppointment = async (appointmentId: string) => {
          try {
               await updateAppointment(appointmentId, { status: "completed" })
               toast.success("Appointment marked as completed")
          } catch {
               toast.error("Failed to complete appointment")
          }
     }

     const today = useMemo(() => new Date().toISOString().split('T')[0], [])

     const todaysAppointments = useMemo(
          () => appointments.filter((appt) => appt.date === today),
          [appointments, today]
     )

     const pendingAppointments = useMemo(
          () => appointments.filter((appt) => appt.status === "pending"),
          [appointments]
     )

     const completedToday = useMemo(
          () => todaysAppointments.filter((appt) => appt.status === "completed").length,
          [todaysAppointments]
     )

     return (
          <div className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-6">
               <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                         <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
                         <p className="text-sm text-muted-foreground">
                              Manage your appointments and patient schedule.
                         </p>
                    </div>
               </div>

               <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                         <CardContent className="p-5">
                               <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
                              <p className="mt-2 text-3xl font-semibold">
                                   {todaysAppointments.length}
                              </p>
                         </CardContent>
                    </Card>
                    <Card>
                         <CardContent className="p-5">
                              <p className="text-sm text-muted-foreground">Pending Confirmations</p>
                              <p className="mt-2 text-3xl font-semibold">
                                   {pendingAppointments.length}
                              </p>
                         </CardContent>
                    </Card>
                    <Card>
                         <CardContent className="p-5">
                              <p className="text-sm text-muted-foreground">Completed Today</p>
                              <p className="mt-2 text-3xl font-semibold">{completedToday}</p>
                         </CardContent>
                    </Card>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Today&apos;s Appointments</CardTitle>
                         <CardDescription>
                              {loading
                                   ? "Loading appointments..."
                                   : "Your scheduled appointments for today."}
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {error ? (
                              <p className="text-sm text-red-600">{error}</p>
                         ) : todaysAppointments.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                   No appointments scheduled for today.
                              </p>
                         ) : (
                              <div className="space-y-3">
                                   {todaysAppointments.map((appointment) => (
                                        <div key={appointment.id} className="rounded-2xl border p-4">
                                             <div className="flex justify-between items-start">
                                                  <div>
                                                       <p className="font-medium">{appointment.patient}</p>
                                                       <p className="text-sm text-muted-foreground">
                                                            {appointment.illnessCategory}
                                                       </p>
                                                       <p className="text-sm text-muted-foreground">
                                                            {appointment.startTime} - {appointment.endTime}
                                                       </p>
                                                       <p className="text-xs text-muted-foreground">
                                                            Fee: ${appointment.fee}
                                                       </p>
                                                  </div>
                                                  <div className="flex flex-col items-end gap-2">
                                                       <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                                            appointment.status === "accepted" ? "bg-green-100 text-green-700" :
                                                            appointment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                            appointment.status === "completed" ? "bg-blue-100 text-blue-700" :
                                                            "bg-red-100 text-red-700"
                                                       }`}>
                                                            {appointment.status}
                                                       </span>
                                                       {appointment.status === "accepted" && (
                                                            <Button size="sm" variant="outline" onClick={() => handleCompleteAppointment(appointment.id)}>
                                                                 Complete
                                                            </Button>
                                                       )}
                                                  </div>
                                             </div>
                                             {appointment.note && (
                                                  <p className="text-sm mt-2">{appointment.note}</p>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         )}
                    </CardContent>
               </Card>

               <Card>
                    <CardHeader>
                         <CardTitle>Pending Appointments</CardTitle>
                         <CardDescription>
                              Appointments waiting for your confirmation.
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {pendingAppointments.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                   No pending appointments.
                              </p>
                         ) : (
                              <div className="space-y-3">
                                   {pendingAppointments.map((appointment) => (
                                        <div key={appointment.id} className="rounded-2xl border p-4">
                                             <p className="font-medium">{appointment.patient}</p>
                                             <p className="text-sm text-muted-foreground">
                                                  {appointment.illnessCategory}
                                             </p>
                                             <p className="text-sm text-muted-foreground">
                                                  Preferred: {appointment.preferredDate} • {appointment.startTime || "TBD"}
                                             </p>
                                             <div className="flex gap-2 mt-3">
                                                  <Button size="sm" onClick={() => handleAcceptAppointment(appointment.id)}>
                                                       Accept
                                                  </Button>
                                                  <Button size="sm" variant="outline" onClick={() => handleDeclineAppointment(appointment.id)}>
                                                       Decline
                                                  </Button>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </CardContent>
               </Card>
          </div>
     )
}