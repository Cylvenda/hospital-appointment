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
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
     Calendar01Icon, 
     Clock01Icon, 
     UserGroupIcon, 
     CheckCircle, 
     Cancel01Icon, 
     HourglassIcon,
     Doctor01Icon,
     Person,
     ArrowRight02Icon
} from "@hugeicons/core-free-icons"

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
     }, [checkAuth, fetchAppointments, router])

     const handleStatusUpdate = async (appointmentId: string, status: string) => {
          try {
               await updateAppointment(appointmentId, { status })
               toast.success(`Appointment marked as ${status}`)
          } catch {
               toast.error(`Failed to update appointment to ${status}`)
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

     const stats = useMemo(() => {
          const completed = todaysAppointments.filter(a => a.status === "completed").length
          const upcoming = todaysAppointments.filter(a => a.status === "accepted").length
          const total = todaysAppointments.length
          return { completed, upcoming, total }
     }, [todaysAppointments])

     return (
          <div className="mx-auto w-full max-w-8xl space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
               {/* HEADER */}
               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                         <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
                         <p className="text-muted-foreground mt-1">
                              Welcome back, Dr. {user?.last_name}. You have {stats.upcoming} upcoming appointments today.
                         </p>
                    </div>
                    <Button variant="outline" className="rounded-2xl" onClick={() => fetchAppointments()} disabled={loading}>
                         <HugeiconsIcon icon={Clock01Icon} className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                         Sync Schedule
                    </Button>
               </div>

               {/* STATS GRID */}
               <div className="grid gap-4 sm:grid-cols-4">
                    {[
                         { label: "Today's Total", value: stats.total, icon: UserGroupIcon, color: "text-blue-500", bg: "bg-blue-50" },
                         { label: "Upcoming", value: stats.upcoming, icon: Clock01Icon, color: "text-emerald-500", bg: "bg-emerald-50" },
                         { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-indigo-500", bg: "bg-indigo-50" },
                         { label: "Pending Actions", value: pendingAppointments.length, icon: HourglassIcon, color: "text-amber-500", bg: "bg-amber-50" },
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
                    {/* TODAY'S QUEUE */}
                    <Card className="lg:col-span-2 rounded-3xl shadow-sm border-muted/60 overflow-hidden">
                         <CardHeader className="border-b bg-muted/30">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <CardTitle className="text-xl">Today&apos;s Patient Queue</CardTitle>
                                        <CardDescription>Your schedule for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</CardDescription>
                                   </div>
                                   <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                        {todaysAppointments.length} Total
                                   </div>
                              </div>
                         </CardHeader>
                         <CardContent className="p-0">
                              {loading ? (
                                   <div className="p-8 text-center animate-pulse text-muted-foreground">Loading queue...</div>
                              ) : todaysAppointments.length === 0 ? (
                                   <div className="p-12 text-center space-y-4">
                                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                             <HugeiconsIcon icon={Calendar01Icon} className="w-8 h-8 text-muted-foreground/40" />
                                        </div>
                                        <p className="text-muted-foreground">No appointments scheduled for today.</p>
                                   </div>
                              ) : (
                                   <div className="divide-y divide-muted/60">
                                        {todaysAppointments.map((appointment) => (
                                             <div key={appointment.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                                                  <div className="flex items-center gap-4">
                                                       <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                                                            <HugeiconsIcon icon={Person} className="w-6 h-6 text-muted-foreground" />
                                                       </div>
                                                       <div>
                                                            <p className="font-bold text-lg">{appointment.patient}</p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                 <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                      <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                                                                      {appointment.startTime || "--:--"} - {appointment.endTime || "--:--"}
                                                                 </span>
                                                                 <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                                 <span className="text-xs font-medium text-primary">{appointment.illnessCategory}</span>
                                                            </div>
                                                       </div>
                                                  </div>

                                                  <div className="flex items-center gap-3">
                                                       <span className={cn(
                                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                            appointment.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                                                            appointment.status === "completed" ? "bg-blue-100 text-blue-700" :
                                                            appointment.status === "pending" ? "bg-amber-100 text-amber-700" :
                                                            "bg-rose-100 text-rose-700"
                                                       )}>
                                                            {appointment.status}
                                                       </span>
                                                       
                                                       <div className="flex gap-2">
                                                            {appointment.status === "accepted" && (
                                                                 <Button 
                                                                      size="sm" 
                                                                      className="rounded-xl bg-primary hover:bg-primary/90"
                                                                      onClick={() => handleStatusUpdate(appointment.id, "completed")}
                                                                 >
                                                                      Complete
                                                                 </Button>
                                                            )}
                                                            <Button size="icon" variant="ghost" className="rounded-xl" onClick={() => router.push(`/doctor-dashboard/appointments/${appointment.id}`)}>
                                                                 <HugeiconsIcon icon={ArrowRight02Icon} className="w-4 h-4" />
                                                            </Button>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </CardContent>
                    </Card>

                    {/* PENDING REQUESTS */}
                    <div className="space-y-6">
                         <Card className="rounded-3xl shadow-sm border-muted/60">
                              <CardHeader>
                                   <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Pending Requests</CardTitle>
                                        {pendingAppointments.length > 0 && (
                                             <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        )}
                                   </div>
                                   <CardDescription>Requests awaiting your confirmation</CardDescription>
                              </CardHeader>
                              <CardContent className="px-2">
                                   <div className="space-y-1">
                                        {pendingAppointments.length > 0 ? (
                                             pendingAppointments.map((appt) => (
                                                  <div key={appt.id} className="p-4 rounded-2xl border border-transparent hover:border-muted hover:bg-muted/30 transition-all group">
                                                       <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                 <p className="font-semibold text-sm">{appt.patient}</p>
                                                                 <p className="text-xs text-muted-foreground">{appt.illnessCategory}</p>
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded">
                                                                 {appt.preferredDate}
                                                            </div>
                                                       </div>
                                                       <div className="flex gap-2">
                                                            <Button 
                                                                 size="sm" 
                                                                 className="flex-1 rounded-xl h-8 text-xs" 
                                                                 onClick={() => handleStatusUpdate(appt.id, "accepted")}
                                                            >
                                                                 Accept
                                                            </Button>
                                                            <Button 
                                                                 size="sm" 
                                                                 variant="outline" 
                                                                 className="flex-1 rounded-xl h-8 text-xs"
                                                                 onClick={() => handleStatusUpdate(appt.id, "declined")}
                                                            >
                                                                 Decline
                                                            </Button>
                                                       </div>
                                                  </div>
                                             ))
                                        ) : (
                                             <div className="py-8 text-center text-sm text-muted-foreground px-4">
                                                  All caught up! No pending requests.
                                             </div>
                                        )}
                                   </div>
                              </CardContent>
                         </Card>

                         {/* DOCTOR TIP / MOTIVATION */}
                         <Card className="rounded-3xl bg-slate-900 text-white overflow-hidden border-none shadow-xl">
                              <CardContent className="p-6">
                                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                        <HugeiconsIcon icon={Doctor01Icon} className="w-5 h-5 text-white" />
                                   </div>
                                   <h4 className="font-bold text-lg mb-2">Did you know?</h4>
                                   <p className="text-sm text-white/70 leading-relaxed">
                                        Proper documentation of patient history leads to 30% better long-term health outcomes. Keep up the great work!
                                   </p>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          </div>
     )
}