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

export default function PatientDashboardPage() {
     const router = useRouter()
     const { user, checkAuth, logout } = useAuthUserStore()
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
          const pending = appointments.filter((item) => item.status === "pending").length
          const approved = appointments.filter((item) => item.status === "approved").length
          const cancelled = appointments.filter((item) => item.status === "cancelled").length

          return { pending, approved, cancelled }
     }, [appointments])

     return (
          <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
               <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                         <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
                         <p className="text-sm text-muted-foreground">
                              Track your appointments and review current status.
                         </p>
                    </div>
                    <Button
                         variant="outline"
                         onClick={async () => {
                              await logout()
                              router.replace("/login")
                         }}
                    >
                         Logout
                    </Button>
               </div>

               <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                         <CardContent className="p-5">
                              <p className="text-sm text-muted-foreground">Pending</p>
                              <p className="mt-2 text-3xl font-semibold">{stats.pending}</p>
                         </CardContent>
                    </Card>
                    <Card>
                         <CardContent className="p-5">
                              <p className="text-sm text-muted-foreground">Approved</p>
                              <p className="mt-2 text-3xl font-semibold">{stats.approved}</p>
                         </CardContent>
                    </Card>
                    <Card>
                         <CardContent className="p-5">
                              <p className="text-sm text-muted-foreground">Cancelled</p>
                              <p className="mt-2 text-3xl font-semibold">{stats.cancelled}</p>
                         </CardContent>
                    </Card>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>My Appointments</CardTitle>
                         <CardDescription>
                              {loading
                                   ? "Loading your appointments..."
                                   : "Live appointments from your account."}
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {error ? (
                              <p className="text-sm text-red-600">{error}</p>
                         ) : appointments.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                   You do not have any appointments yet.
                              </p>
                         ) : (
                              <div className="space-y-3">
                                   {appointments.map((appointment) => (
                                        <div
                                             key={appointment.id}
                                             className="rounded-2xl border p-4"
                                        >
                                             <p className="font-medium">{appointment.illnessCategory}</p>
                                             <p className="text-sm text-muted-foreground">
                                                  Date: {appointment.date} | Status: {appointment.status}
                                             </p>
                                             <p className="text-sm text-muted-foreground">
                                                  Time: {appointment.startTime || "--:--"} -{" "}
                                                  {appointment.endTime || "--:--"}
                                             </p>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </CardContent>
               </Card>
          </div>
     )
}
