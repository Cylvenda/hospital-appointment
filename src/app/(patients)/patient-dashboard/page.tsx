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
import { cn } from "@/lib/utils"

export default function PatientDashboardPage() {
     const router = useRouter()
     const { user, checkAuth } = useAuthUserStore()
     const { appointments, loading, error, fetchAppointments } = useAppointmentStore()

     useEffect(() => {
          void (async () => {
               const authenticated = await checkAuth()
               if (!authenticated) {
                    router.replace("/login")
                    return
               }

               const resolvedRole = useAuthUserStore.getState().user?.role
               if (resolvedRole !== "patient") {
                    router.replace(getDashboardPath(resolvedRole))
                    return
               }

               await fetchAppointments()
          })()
     }, [checkAuth, fetchAppointments, router, user?.role])

     const stats = useMemo(() => {
          const pending = appointments.filter((i) => i.status === "pending").length
          const approved = appointments.filter((i) => i.status === "accepted").length
          const cancelled = appointments.filter((i) => i.status === "cancelled").length

          return { pending, approved, cancelled }
     }, [appointments])

     return (
          <div className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-6">
               {/* HEADER */}
               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                         <h1 className="text-2xl font-semibold">
                              Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
                         </h1>
                         <p className="text-sm text-muted-foreground">
                              Manage your appointments and track updates in real-time.
                         </p>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="flex gap-2">
                         <Button className="rounded-md" onClick={() => router.push("/patient/appointments")}>
                              + Book Appointment
                         </Button>

                         <Button
                              className="rounded-md"
                              variant="outline"
                              onClick={() => fetchAppointments()}
                         >
                              Refresh
                         </Button>
                    </div>
               </div>

               {/* STATS */}
               <div className="grid gap-4 sm:grid-cols-3">
                    {[
                         {
                              label: "Pending",
                              value: stats.pending,
                              hint: "Awaiting approval",
                              style: "border-yellow-300",
                         },
                         {
                              label: "Approved",
                              value: stats.approved,
                              hint: "Ready for visit",
                              style: "border-green-300",
                         },
                         {
                              label: "Cancelled",
                              value: stats.cancelled,
                              hint: "Past cancellations",
                              style: "border-red-300",
                         },
                    ].map((stat, i) => (
                         <Card key={i} className={cn("border-l-4 shadow-sm", stat.style)}>
                              <CardContent className="p-5">
                                   <p className="text-sm text-muted-foreground">{stat.label}</p>
                                   <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
                                   <p className="text-xs text-muted-foreground mt-1">
                                        {stat.hint}
                                   </p>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               {/* RECENT APPOINTMENTS */}
               <Card>
                    <CardHeader>
                         <CardTitle>Recent Appointments</CardTitle>
                         <CardDescription>
                              {loading
                                   ? "Loading..."
                                   : "Your latest appointment activity."}
                         </CardDescription>
                    </CardHeader>

                    <CardContent>
                         {error ? (
                              <p className="text-sm text-red-600">{error}</p>
                         ) : appointments.length === 0 ? (
                              <div className="text-center py-10 space-y-2">
                                   <p className="text-sm text-muted-foreground">
                                        No appointments yet.
                                   </p>
                                   <Button
                                        size="sm"
                                        onClick={() => router.push("/patient-dashboard/appointments")}
                                   >
                                        Book your first appointment
                                   </Button>
                              </div>
                         ) : (
                              <div className="space-y-3">
                                   {appointments.slice(0, 5).map((appt) => (
                                        <div
                                             key={appt.id}
                                             className="flex items-center justify-between rounded-xl border p-4 hover:shadow-sm transition"
                                        >
                                             <div>
                                                  <p className="font-medium">{appt.illnessCategory}</p>
                                                  <p className="text-xs text-muted-foreground">
                                                       {appt.date} • {appt.startTime || "--:--"}
                                                  </p>
                                             </div>

                                             <span
                                                  className={cn(
                                                       "text-xs px-2 py-1 rounded-full capitalize",
                                                       appt.status === "pending" &&
                                                       "bg-yellow-100 text-yellow-700",
                                                       appt.status === "accepted" &&
                                                       "bg-green-100 text-green-700",
                                                       appt.status === "cancelled" &&
                                                       "bg-red-100 text-red-700"
                                                  )}
                                             >
                                                  {appt.status}
                                             </span>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </CardContent>
               </Card>
          </div>
     )
}