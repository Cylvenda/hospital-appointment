"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { getDashboardPath } from "@/lib/role-dashboard"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
     Calendar01Icon, 
     Clock01Icon, 
     UserGroupIcon, 
     CheckCircle
} from "@hugeicons/core-free-icons"
import { DoctorAppointmentCard } from "@/components/customs/doctor-appointment-card"
import { AppointmentWorkflowLegend } from "@/components/appointment-workflow-legend"

export default function DoctorDashboardPage() {
     const router = useRouter()
     const { user, checkAuth } = useAuthUserStore()
     const { appointments, loading, fetchAppointments } = useAppointmentStore()

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

     const pendingAssessment = useMemo(
          () => appointments.filter((appt) => appt.status === "accepted"),
          [appointments]
     )

     const stats = useMemo(() => {
          const completed = appointments.filter(a => a.status === "completed").length
          const upcoming = pendingAssessment.length
          const total = appointments.length
          return { completed, upcoming, total }
     }, [appointments, pendingAssessment])

     return (
          <div className="mx-auto w-full max-w-8xl space-y-10 p-4 md:p-8 animate-in fade-in duration-500">
               {/* HEADER */}
               <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-primary p-10 rounded-2xl text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <p className="text-secondary text-xs font-black uppercase tracking-widest">Active Practitioner</p>
                         </div>
                         <h1 className="text-5xl font-black tracking-tight">Dr. {user?.last_name}</h1>
                         <p className="text-secondary text-lg mt-2 font-medium">
                              You have <span className="text-white font-bold">{stats.upcoming}</span> appointments ready for review today.
                         </p>
                    </div>
                    <div className="flex gap-3 relative z-10">
                         <Button variant="default" className="rounded-md h-14 px-8 border-secondary text-white  bg-transparent font-bold" onClick={() => fetchAppointments()} disabled={loading}>
                              <HugeiconsIcon icon={Clock01Icon} className={cn("mr-2 h-5 w-5", loading && "animate-spin")} />
                              Sync Queue
                         </Button>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
               </div>

               {/* STATS GRID */}
               <div className="grid gap-6 sm:grid-cols-3">
                    {[
                         { label: "Ready for Review", value: stats.upcoming, icon: Clock01Icon, color: "text-amber-500", bg: "bg-amber-50/50", border: "border-amber-100" },
                         { label: "Completed Visits", value: stats.completed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100" },
                         { label: "Total Managed", value: stats.total, icon: UserGroupIcon, color: "text-blue-500", bg: "bg-blue-50/50", border: "border-blue-100" },
                    ].map((stat, i) => (
                         <div key={i} className={cn("p-8 rounded-2xl border-2 shadow-sm flex items-center justify-between group hover:scale-[1.02] transition-all", stat.bg, stat.border)}>
                              <div>
                                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{stat.label}</p>
                                   <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                              </div>
                              <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform", "bg-background shadow-sm")}>
                                   <HugeiconsIcon icon={stat.icon} className={cn("w-8 h-8", stat.color)} />
                              </div>
                         </div>
                    ))}
               </div>

               <div className="space-y-8">
                    <AppointmentWorkflowLegend />

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                              <div className="w-1.5 h-8 bg-primary rounded-full" />
                              <h2 className="text-3xl font-black tracking-tight italic">Active Appointment Queue</h2>
                         </div>
                         <div className="px-6 py-2 rounded-2xl bg-muted text-muted-foreground text-xs font-black uppercase tracking-widest">
                              Today
                         </div>
                    </div>

                    {loading ? (
                         <div className="grid gap-8">
                              {[1, 2].map((item) => (
                                   <div key={item} className="h-64 rounded-2xl bg-muted/40 animate-pulse border-2 border-dashed border-muted" />
                              ))}
                         </div>
                    ) : pendingAssessment.length === 0 ? (
                         <div className="rounded-[3.5rem] border-2 border-dashed border-muted bg-muted/5 p-32 text-center space-y-6">
                              <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                                   <HugeiconsIcon icon={Calendar01Icon} className="w-12 h-12 text-muted-foreground/30" />
                              </div>
                              <div className="space-y-2">
                                   <h3 className="text-2xl font-black tracking-tight text-muted-foreground">Queue is clear!</h3>
                                   <p className="text-muted-foreground/60 max-w-sm mx-auto font-medium">No active appointments are currently assigned for assessment.</p>
                              </div>
                         </div>
                    ) : (
                         <div className="grid gap-8">
                              {pendingAssessment.map((appointment) => (
                                   <DoctorAppointmentCard 
                                        key={appointment.id} 
                                        appointment={appointment} 
                                   />
                              ))}
                         </div>
                    )}
               </div>
          </div>
     )
}
