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
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
     UserGroupIcon, 
     CheckCircle, 
     HourglassIcon,
     PlusSignIcon,
     RefreshIcon,
     Doctor01Icon,
     Person,
     UserPlus,
     Settings01Icon
} from "@hugeicons/core-free-icons"

export default function ReceptionistDashboardPage() {
     const router = useRouter()
     const { user, checkAuth } = useAuthUserStore()
     const { appointments, loading, error, fetchAppointments } = useAppointmentStore()
     const { overview, fetchOverview, fetchDoctors, doctors } = useAdminStore()

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

               await Promise.all([fetchOverview(), fetchAppointments(), fetchDoctors()])
          })()
     }, [checkAuth, fetchAppointments, fetchOverview, fetchDoctors, router])

     const pending = useMemo(
          () => appointments.filter((item) => item.status === "pending"),
          [appointments]
     )

     const assignedToday = useMemo(
          () => appointments.filter((item) => item.status === "accepted" && item.date === new Date().toISOString().split('T')[0]),
          [appointments]
     )

     return (
          <div className="mx-auto w-full max-w-8xl space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
               {/* HEADER */}
               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                         <h1 className="text-3xl font-bold tracking-tight">Receptionist Dashboard</h1>
                         <p className="text-muted-foreground mt-1">
                              Managing patient flow and doctor assignments.
                         </p>
                    </div>

                    <div className="flex gap-3">
                         <Button 
                              className="rounded-2xl" 
                              onClick={() => router.push("/admin/users/create")}
                         >
                              <HugeiconsIcon icon={UserPlus} className="mr-2 h-4 w-4" />
                              Register Patient
                         </Button>
                         <Button
                              className="rounded-2xl"
                              variant="outline"
                              onClick={() => { fetchOverview(); fetchAppointments(); }}
                              disabled={loading}
                         >
                              <HugeiconsIcon icon={RefreshIcon} className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                              Refresh
                         </Button>
                    </div>
               </div>

               {/* STATS GRID */}
               <div className="grid gap-4 sm:grid-cols-4">
                    {[
                         { label: "Total Patients", value: overview?.total_patients ?? 0, icon: Person, color: "text-blue-500", bg: "bg-blue-50" },
                         { label: "Waiting Room", value: pending.length, icon: HourglassIcon, color: "text-amber-500", bg: "bg-amber-50" },
                         { label: "Assigned Today", value: assignedToday.length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                         { label: "Active Doctors", value: doctors.filter(d => d.is_available).length, icon: Doctor01Icon, color: "text-indigo-500", bg: "bg-indigo-50" },
                    ].map((stat, i) => (
                         <Card key={i} className="border shadow-sm rounded-2xl">
                              <CardContent className="p-5 flex items-center gap-4">
                                   <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
                                        <HugeiconsIcon icon={stat.icon} className={cn("w-6 h-6", stat.color)} />
                                   </div>
                                   <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                                   </div>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               <div className="grid gap-8 lg:grid-cols-3">
                    {/* WAITING ROOM (PENDING) */}
                    <Card className="lg:col-span-2 rounded-3xl shadow-sm border-muted/60 overflow-hidden">
                         <CardHeader className="border-b bg-amber-50/30">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <CardTitle className="text-xl flex items-center gap-2 text-amber-900">
                                             <HugeiconsIcon icon={HourglassIcon} className="w-5 h-5" />
                                             Waiting Room
                                        </CardTitle>
                                        <CardDescription>Patients awaiting assignment or confirmation.</CardDescription>
                                   </div>
                              </div>
                         </CardHeader>
                         <CardContent className="p-0">
                              {loading ? (
                                   <div className="p-8 text-center animate-pulse text-muted-foreground">Loading queue...</div>
                              ) : pending.length === 0 ? (
                                   <div className="p-12 text-center text-muted-foreground">
                                        No patients waiting in the queue.
                                   </div>
                              ) : (
                                   <div className="divide-y divide-muted/60">
                                        {pending.map((appointment) => (
                                             <div key={appointment.id} className="p-5 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                                  <div className="flex items-center gap-4">
                                                       <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                            <HugeiconsIcon icon={Person} className="w-5 h-5 text-muted-foreground" />
                                                       </div>
                                                       <div>
                                                            <p className="font-bold">{appointment.patient}</p>
                                                            <p className="text-xs text-muted-foreground">{appointment.illnessCategory}</p>
                                                       </div>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                       <div className="text-right hidden sm:block mr-4">
                                                            <p className="text-xs font-medium text-muted-foreground">Preferred Date</p>
                                                            <p className="text-sm font-semibold">{appointment.preferredDate}</p>
                                                       </div>
                                                       <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50"
                                                            onClick={() => router.push(`/receptionist-dashboard/appointments/pending`)}
                                                       >
                                                            Assign Doctor
                                                       </Button>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </CardContent>
                    </Card>

                    {/* DOCTOR AVAILABILITY */}
                    <div className="space-y-6">
                         <Card className="rounded-3xl shadow-sm border-muted/60">
                              <CardHeader>
                                   <CardTitle className="text-lg flex items-center gap-2">
                                        <HugeiconsIcon icon={Doctor01Icon} className="w-5 h-5 text-primary" />
                                        Medical Staff
                                   </CardTitle>
                                   <CardDescription>Real-time availability status</CardDescription>
                              </CardHeader>
                              <CardContent className="px-2">
                                   <div className="space-y-1">
                                        {doctors.length > 0 ? (
                                             doctors.map((doctor) => (
                                                  <div key={doctor.uuid} className="p-3 flex items-center justify-between rounded-2xl hover:bg-muted/50 transition-colors">
                                                       <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                      {doctor.name.split(' ').map(n => n[0]).join('')}
                                                                 </div>
                                                                 <div className={cn(
                                                                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                                                                      doctor.is_available ? "bg-emerald-500" : "bg-rose-500"
                                                                 )} />
                                                            </div>
                                                            <div>
                                                                 <p className="text-sm font-bold truncate max-w-[120px]">{doctor.name}</p>
                                                                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                                                                      {doctor.is_available ? "Available" : "On Duty / Out"}
                                                                 </p>
                                                            </div>
                                                       </div>
                                                       <div className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                                            ID: {doctor.license_number.slice(0, 6)}
                                                       </div>
                                                  </div>
                                             ))
                                        ) : (
                                             <div className="py-10 text-center text-sm text-muted-foreground">
                                                  No doctor records found.
                                             </div>
                                        )}
                                   </div>
                                   <Button variant="ghost" className="w-full mt-4 rounded-xl text-xs" onClick={() => router.push("/receptionist-dashboard/doctors")}>
                                        Manage Doctors
                                   </Button>
                              </CardContent>
                         </Card>

                         {/* QUICK NAVIGATION */}
                         <div className="grid grid-cols-2 gap-3">
                              <Button 
                                   variant="outline" 
                                   className="h-auto py-4 flex-col rounded-3xl border-muted/60 hover:bg-muted/20 gap-2"
                                   onClick={() => router.push("/receptionist-dashboard/illness-categories")}
                              >
                                   <div className="bg-indigo-50 p-2 rounded-xl">
                                        <HugeiconsIcon icon={Settings01Icon} className="w-4 h-4 text-indigo-600" />
                                   </div>
                                   <span className="text-xs font-bold">Categories</span>
                              </Button>
                              <Button 
                                   variant="outline" 
                                   className="h-auto py-4 flex-col rounded-3xl border-muted/60 hover:bg-muted/20 gap-2"
                                   onClick={() => router.push("/receptionist-dashboard/profile")}
                              >
                                   <div className="bg-rose-50 p-2 rounded-xl">
                                        <HugeiconsIcon icon={Settings01Icon} className="w-4 h-4 text-rose-600" />
                                   </div>
                                   <span className="text-xs font-bold">Settings</span>
                              </Button>
                         </div>
                    </div>
               </div>
          </div>
     )
}
