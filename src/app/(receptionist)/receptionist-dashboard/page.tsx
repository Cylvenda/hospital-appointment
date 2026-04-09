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
import { useAdminStore } from "@/store/admin/admin.store"
import { getDashboardPath } from "@/lib/role-dashboard"

export default function ReceptionistDashboardPage() {
     const router = useRouter()
     const { user, checkAuth, logout } = useAuthUserStore()
     const { appointments, loading, error, fetchAppointments } = useAppointmentStore()
     const { overview, fetchOverview } = useAdminStore()

     useEffect(() => {
          void (async () => {
               const authenticated = await checkAuth()
               if (!authenticated) {
                    router.replace("/login")
                    return
               }

               const resolvedRole = useAuthUserStore.getState().user?.role
               if (resolvedRole !== "receptionist") {
                    router.replace(getDashboardPath(resolvedRole))
                    return
               }

               await Promise.all([fetchOverview(), fetchAppointments()])
          })()
     }, [checkAuth, fetchAppointments, fetchOverview, router, user?.role])

     const pending = useMemo(
          () => appointments.filter((item) => item.status === "pending"),
          [appointments]
     )

     const unassignedPending = useMemo(
          () => pending.filter((item) => !item.doctorId),
          [pending]
     )

     return (
          <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
               <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                         <h1 className="text-2xl font-semibold">Receptionist Dashboard</h1>
                         <p className="text-sm text-muted-foreground">
                              Front-desk view for today&apos;s queue and pending assignments.
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
                              <p className="text-sm text-muted-foreground">Pending Queue</p>
                              <p className="mt-2 text-3xl font-semibold">
                                   {overview?.pending_appointments ?? pending.length}
                              </p>
                         </CardContent>
                    </Card>
                    <Card>
                         <CardContent className="p-5">
                              <p className="text-sm text-muted-foreground">Approved Today</p>
                              <p className="mt-2 text-3xl font-semibold">
                                   {overview?.approved_appointments ?? 0}
                              </p>
                         </CardContent>
                    </Card>
                    <Card>
                         <CardContent className="p-5">
                              <p className="text-sm text-muted-foreground">Unassigned Pending</p>
                              <p className="mt-2 text-3xl font-semibold">{unassignedPending.length}</p>
                         </CardContent>
                    </Card>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Pending Appointments</CardTitle>
                         <CardDescription>
                              {loading
                                   ? "Loading queue..."
                                   : "Appointments waiting for front-desk action."}
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {error ? (
                              <p className="text-sm text-red-600">{error}</p>
                         ) : pending.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                   No pending appointments right now.
                              </p>
                         ) : (
                              <div className="space-y-3">
                                   {pending.map((appointment) => (
                                        <div key={appointment.id} className="rounded-2xl border p-4">
                                             <p className="font-medium">{appointment.patient}</p>
                                             <p className="text-sm text-muted-foreground">
                                                  Category: {appointment.illnessCategory}
                                             </p>
                                             <p className="text-sm text-muted-foreground">
                                                  Assigned doctor: {appointment.doctor || "Unassigned"}
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
