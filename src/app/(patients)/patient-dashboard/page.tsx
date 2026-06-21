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
import { AppointmentWorkflowLegend } from "@/components/appointment-workflow-legend"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"
import { filterAppointmentsForQueue } from "@/lib/appointment-queues"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon, Clock01Icon, UserIcon, CheckCircle, Cancel01Icon, HourglassIcon, PlusSignIcon, RefreshIcon } from "@hugeicons/core-free-icons"
import { toast } from "react-toastify"

export default function PatientDashboardPage() {
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
               if (resolvedRole !== "patient") {
                    router.replace(getDashboardPath(resolvedRole))
                    return
               }

               await fetchAppointments()
          })()
     }, [checkAuth, fetchAppointments, router])

     const stats = useMemo(() => {
          const pending = filterAppointmentsForQueue(appointments, "patient", "upcoming").filter(
               (appointment) => appointment.paymentStatus === "pending"
          ).length
          const approved = filterAppointmentsForQueue(appointments, "patient", "upcoming").filter(
               (appointment) => Boolean(appointment.doctorId)
          ).length
          const cancelled = filterAppointmentsForQueue(appointments, "patient", "cancelled").length
          const completed = filterAppointmentsForQueue(appointments, "patient", "completed").length

          return { pending, approved, cancelled, completed }
     }, [appointments])

     const nextAppointment = useMemo(() => {
          const now = new Date()
          return filterAppointmentsForQueue(appointments, "patient", "upcoming")
               .filter(a => Boolean(a.doctorId) && a.date && new Date(a.date) >= now)
               .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
     }, [appointments])

     const nextAppointmentMeta = nextAppointment
          ? getAppointmentStatusMeta(nextAppointment.status, nextAppointment.paymentStatus, "patient")
          : null

     const recentHistory = useMemo(() => {
          return filterAppointmentsForQueue(appointments, "patient", "completed")
               .filter(a => a !== nextAppointment)
               .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
               .slice(0, 4)
     }, [appointments, nextAppointment])

     return (
          <div className="mx-auto w-full max-w-8xl space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
               {/* HEADER */}
               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6 rounded-3xl border border-primary/10">
                    <div>
                         <h1 className="text-3xl font-bold tracking-tight">
                              Good day{user?.first_name ? `, ${user.first_name}` : ""}!
                         </h1>
                         <p className="text-muted-foreground mt-1">
                              Here&apos;s an overview of your healthcare journey.
                         </p>
                    </div>

                    <div className="flex gap-3">
                         <Button 
                              className="rounded-2xl px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95" 
                              onClick={() => {
                                   if (!user?.patient_profile?.is_profile_complete) {
                                        toast.warning("Clinical Profile Incomplete: Please complete your registration details to activate scheduling options.")
                                        router.push("/patient-dashboard/profile")
                                   } else {
                                        router.push("/patient-dashboard/appointments")
                                   }
                              }}
                         >
                              <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
                              Book Appointment
                         </Button>

                         <Button
                              className="rounded-2xl"
                              variant="outline"
                              onClick={() => fetchAppointments()}
                              disabled={loading}
                         >
                              <HugeiconsIcon icon={RefreshIcon} className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                              Refresh
                         </Button>
                    </div>
               </div>

               {/* MAIN GRID */}
               <div className="grid gap-8 lg:grid-cols-3">
                    {/* LEFT COLUMN: STATS & NEXT APPOINTMENT */}
                    <div className="lg:col-span-2 space-y-8">
                         <AppointmentWorkflowLegend />

                         {/* STATS */}
                         <div className="grid gap-4 sm:grid-cols-4">
                              {[
                                   {
                                        label: "Pending",
                                        value: stats.pending,
                                        icon: HourglassIcon,
                                        color: "text-amber-500",
                                        bg: "bg-amber-50",
                                        border: "border-amber-100",
                                   },
                                   {
                                        label: "Upcoming",
                                        value: stats.approved,
                                        icon: Calendar01Icon,
                                        color: "text-emerald-500",
                                        bg: "bg-emerald-50",
                                        border: "border-emerald-100",
                                   },
                                   {
                                        label: "Completed",
                                        value: stats.completed,
                                        icon: CheckCircle,
                                        color: "text-blue-500",
                                        bg: "bg-blue-50",
                                        border: "border-blue-100",
                                   },
                                   {
                                        label: "Cancelled",
                                        value: stats.cancelled,
                                        icon: Cancel01Icon,
                                        color: "text-rose-500",
                                        bg: "bg-rose-50",
                                        border: "border-rose-100",
                                   },
                              ].map((stat, i) => (
                                   <Card key={i} className={cn("border shadow-sm rounded-2xl overflow-hidden", stat.border)}>
                                        <CardContent className="p-5">
                                             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                                                  <HugeiconsIcon icon={stat.icon} className={cn("w-5 h-5", stat.color)} />
                                             </div>
                                             <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                             <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
                                        </CardContent>
                                   </Card>
                              ))}
                         </div>

                         {/* NEXT APPOINTMENT HERO */}
                         <Card className="rounded-3xl border-2 border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
                              <CardHeader className="bg-primary/5 rounded-none py-4 border-b border-primary/10">
                                   <div className="flex items-center justify-between">
                                        <div>
                                             <CardTitle className="text-xl">Your Next Visit</CardTitle>
                                             <CardDescription>Stay prepared for your upcoming appointment.</CardDescription>
                                        </div>
                                        <div className="bg-primary/10 p-2 rounded-full">
                                             <HugeiconsIcon icon={Calendar01Icon} className="w-6 h-6 text-primary" />
                                        </div>
                                   </div>
                              </CardHeader>
                              <CardContent className="p-6">
                                   {nextAppointment ? (
                                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                             <div className="space-y-4">
                                                  <div className="flex items-center gap-3">
                                                       <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                            <HugeiconsIcon icon={UserIcon} className="w-6 h-6 text-primary" />
                                                       </div>
                                                       <div>
                                                            <p className="text-sm text-muted-foreground font-medium">Practitioner</p>
                                                            <p className="text-lg font-semibold">{nextAppointment.doctor || "TBD"}</p>
                                                       </div>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-6">
                                                       <div className="flex items-center gap-2">
                                                            <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-sm font-medium">{nextAppointment.date}</span>
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-sm font-medium">{nextAppointment.startTime || "--:--"}</span>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="flex flex-col items-start md:items-end gap-2">
                                                  <div className={cn(
                                                       "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                                       nextAppointmentMeta?.tone === "amber" && "bg-amber-100 text-amber-700",
                                                       nextAppointmentMeta?.tone === "emerald" && "bg-emerald-100 text-emerald-700",
                                                       nextAppointmentMeta?.tone === "blue" && "bg-blue-100 text-blue-700",
                                                       nextAppointmentMeta?.tone === "rose" && "bg-rose-100 text-rose-700",
                                                       nextAppointmentMeta?.tone === "slate" && "bg-slate-100 text-slate-700"
                                                  )}>
                                                       {nextAppointmentMeta?.label}
                                                  </div>
                                                  <p className="text-sm font-medium text-primary">{nextAppointment.illnessCategory}</p>
                                                  <Button variant="outline" className="mt-2 rounded-md" onClick={() => router.push(`/patient-dashboard/appointments/${nextAppointment.id}`)}>
                                                       View Details
                                                  </Button>
                                             </div>
                                        </div>
                                   ) : (
                                        <div className="py-8 text-center space-y-4">
                                             <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                                  <HugeiconsIcon icon={Calendar01Icon} className="w-8 h-8 text-muted-foreground" />
                                             </div>
                                             <div>
                                                  <p className="font-medium text-muted-foreground">No upcoming appointments scheduled.</p>
                                                  <p className="text-sm text-muted-foreground/60">Regular check-ups are key to staying healthy!</p>
                                             </div>
                                             <Button onClick={() => {
                                                  if (!user?.patient_profile?.is_profile_complete) {
                                                       toast.warning("Clinical Profile Incomplete: Please complete your registration details to activate scheduling options.")
                                                       router.push("/patient-dashboard/profile")
                                                  } else {
                                                       router.push("/patient-dashboard/appointments")
                                                  }
                                             }}>
                                                  Schedule Now
                                             </Button>
                                        </div>
                                   )}
                              </CardContent>
                         </Card>
                    </div>

                    {/* RIGHT COLUMN: HISTORY & QUICK TIPS */}
                    <div className="space-y-8">
                         <Card className="rounded-3xl shadow-sm border-muted/60 h-full">
                              <CardHeader>
                                   <CardTitle className="text-lg">Recent Activity</CardTitle>
                                   <CardDescription>Your latest visit history.</CardDescription>
                              </CardHeader>
                              <CardContent className="px-2">
                                   <div className="space-y-1">
                                        {recentHistory.length > 0 ? (
                                             recentHistory.map((appt) => {
                                                  const statusMeta = getAppointmentStatusMeta(appt.status, appt.paymentStatus, "patient")
                                                  const isCompleted = statusMeta.label === "Completed"

                                                  return (
                                                       <div
                                                            key={appt.id}
                                                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer group"
                                                            onClick={() => router.push(`/patient-dashboard/appointments/${appt.id}`)}
                                                       >
                                                            <div className={cn(
                                                                 "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                                                 isCompleted ? "bg-blue-100" : "bg-rose-100"
                                                            )}>
                                                                 <HugeiconsIcon
                                                                      icon={isCompleted ? CheckCircle : Cancel01Icon}
                                                                      className={cn("w-5 h-5", isCompleted ? "text-blue-600" : "text-rose-600")}
                                                                 />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                 <p className="text-sm font-semibold truncate">{appt.illnessCategory}</p>
                                                                 <p className="text-xs text-muted-foreground">{appt.date}</p>
                                                            </div>
                                                            <span className={cn(
                                                                 "text-[10px] font-bold uppercase px-2 py-0.5 rounded-md",
                                                                 statusMeta.tone === "amber" && "bg-amber-50 text-amber-700",
                                                                 statusMeta.tone === "emerald" && "bg-emerald-50 text-emerald-700",
                                                                 statusMeta.tone === "blue" && "bg-blue-50 text-blue-700",
                                                                 statusMeta.tone === "rose" && "bg-rose-50 text-rose-700",
                                                                 statusMeta.tone === "slate" && "bg-slate-50 text-slate-700"
                                                            )}>
                                                                 {statusMeta.label}
                                                            </span>
                                                       </div>
                                                  )
                                             })
                                        ) : (
                                             <div className="py-10 text-center text-sm text-muted-foreground px-4">
                                                  No recent history to display.
                                             </div>
                                        )}
                                   </div>
                                   {appointments.length > 0 && (
                                        <div className="mt-4 p-4">
                                             <Button variant="ghost" className="w-full rounded-md text-sm" onClick={() => router.push("/patient-dashboard/appointments/all")}>
                                                  View All History
                                             </Button>
                                        </div>
                                   )}
                              </CardContent>
                         </Card>

                         {/* PROMO / TIP CARD */}
                         <Card className="rounded-3xl bg-primary text-primary-foreground overflow-hidden relative border-none">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                              <CardContent className="p-6 relative z-10">
                                   <h4 className="font-bold text-lg mb-2">Health Tip of the Day</h4>
                                   <p className="text-sm text-primary-foreground/90 leading-relaxed">
                                        Drinking enough water throughout the day can improve your energy levels and focus. Aim for at least 8 glasses!
                                   </p>
                                   <div className="mt-4 flex justify-end">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                             <HugeiconsIcon icon={CheckCircle} className="w-4 h-4" />
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          </div>
     )
}
