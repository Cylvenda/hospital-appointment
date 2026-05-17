"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
     RefreshIcon,
     Doctor01Icon,
     Person,
     UserPlus,
     Settings01Icon,
     Calendar03Icon,
     UserCircleIcon,
     ArrowRight01Icon,
     SearchIcon,
     Notification01Icon,
     Medicine01Icon
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

     const containerVariants = {
          hidden: { opacity: 0 },
          visible: {
               opacity: 1,
               transition: {
                    staggerChildren: 0.1
               }
          }
     }

     const itemVariants = {
          hidden: { y: 20, opacity: 0 },
          visible: {
               y: 0,
               opacity: 1
          }
     }

     return (
          <motion.div 
               className="mx-auto w-full max-w-8xl space-y-8 p-4 md:p-8"
               initial="hidden"
               animate="visible"
               variants={containerVariants}
          >
               {/* HERO SECTION */}
               <motion.div 
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-md bg-primary p-8 text-white shadow-2xl"
               >
                    
                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                         <div className="space-y-2">
                              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                   Welcome back, {user?.first_name?.split(' ')[0] || "Receptionist"}!
                              </h1>
                              <p className="text-primary-foreground/80 max-w-md text-lg">
                                   You have <span className="font-bold text-white">{pending.length} patients</span> waiting in the queue. Let's get them assigned!
                              </p>
                         </div>

                         <div className="flex flex-wrap gap-3">
                              <Button 
                                   size="lg"
                                   className="rounded-md bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95" 
                                   onClick={() => router.push("/admin/users/create")}
                              >
                                   <HugeiconsIcon icon={UserPlus} className="mr-2 h-5 w-5" />
                                   Register Patient
                              </Button>
                              <Button
                                   size="lg"
                                   variant="outline"
                                   className="rounded-md border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all"
                                   onClick={() => { fetchOverview(); fetchAppointments(); }}
                                   disabled={loading}
                              >
                                   <HugeiconsIcon icon={RefreshIcon} className={cn("mr-2 h-5 w-5", loading && "animate-spin")} />
                                   Sync Data
                              </Button>
                         </div>
                    </div>
               </motion.div>

               {/* BENTO GRID */}
               <div className="grid gap-6 lg:grid-cols-4 lg:grid-rows-2">
                    
                    {/* STATS SECTION (Row 1) */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                         <Card className="h-full rounded-md border-none bg-blue-50/50 dark:bg-blue-900/10 shadow-sm transition-all hover:shadow-md">
                              <CardContent className="p-6 flex flex-col justify-between h-full">
                                   <div className="w-12 h-12 rounded-md bg-blue-500/10 flex items-center justify-center mb-4">
                                        <HugeiconsIcon icon={Person} className="w-6 h-6 text-blue-600" />
                                   </div>
                                   <div>
                                        <p className="text-sm font-semibold text-blue-600/70 uppercase tracking-wider">Total Patients</p>
                                        <p className="text-4xl font-black text-blue-900 dark:text-blue-100">{overview?.total_patients ?? 0}</p>
                                        <p className="text-xs text-blue-600/60 mt-1 flex items-center gap-1">
                                             <HugeiconsIcon icon={CheckCircle} className="w-3 h-3" /> System Wide
                                        </p>
                                   </div>
                              </CardContent>
                         </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-1">
                         <Card className="h-full rounded-md border-none bg-amber-50/50 dark:bg-amber-900/10 shadow-sm transition-all hover:shadow-md">
                              <CardContent className="p-6 flex flex-col justify-between h-full">
                                   <div className="w-12 h-12 rounded-md bg-amber-500/10 flex items-center justify-center mb-4">
                                        <HugeiconsIcon icon={HourglassIcon} className="w-6 h-6 text-amber-600" />
                                   </div>
                                   <div>
                                        <p className="text-sm font-semibold text-amber-600/70 uppercase tracking-wider">Waiting Room</p>
                                        <p className="text-4xl font-black text-amber-900 dark:text-amber-100">{pending.length}</p>
                                        <p className="text-xs text-amber-600/60 mt-1 flex items-center gap-1">
                                             <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" /> Needs Attention
                                        </p>
                                   </div>
                              </CardContent>
                         </Card>
                    </motion.div>

                    {/* WAITING ROOM (Large Bento Box) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2">
                         <Card className="h-full rounded-md border-muted/40 shadow-xl overflow-hidden flex flex-col">
                              <CardHeader className="bg-muted/30 pb-4">
                                   <div className="flex items-center justify-between">
                                        <div>
                                             <CardTitle className="text-xl font-bold flex items-center gap-2">
                                                  <HugeiconsIcon icon={Medicine01Icon} className="w-6 h-6 text-primary" />
                                                  Priority Queue
                                             </CardTitle>
                                             <CardDescription>Patients awaiting assignment</CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm" className="rounded-md text-primary font-bold" onClick={() => router.push("/receptionist-dashboard/appointments/pending")}>
                                             View All <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 w-4 h-4" />
                                        </Button>
                                   </div>
                              </CardHeader>
                              <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
                                   {loading ? (
                                        <div className="p-12 text-center flex flex-col items-center gap-3">
                                             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                             <p className="text-muted-foreground font-medium">Refreshing queue...</p>
                                        </div>
                                   ) : pending.length === 0 ? (
                                        <div className="p-12 text-center flex flex-col items-center gap-4">
                                             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                  <HugeiconsIcon icon={CheckCircle} className="w-8 h-8" />
                                             </div>
                                             <p className="text-muted-foreground font-medium text-lg">All caught up!</p>
                                             <p className="text-sm text-muted-foreground/60 max-w-[200px]">No pending appointments at the moment.</p>
                                        </div>
                                   ) : (
                                        <div className="divide-y divide-muted/40">
                                             <AnimatePresence mode="popLayout">
                                                  {pending.slice(0, 5).map((appointment, idx) => (
                                                       <motion.div 
                                                            key={appointment.id} 
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="p-5 flex items-center justify-between hover:bg-primary/[0.02] transition-colors group"
                                                       >
                                                            <div className="flex items-center gap-4">
                                                                 <div className="relative">
                                                                      <div className="w-12 h-12 rounded-md bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                                           <HugeiconsIcon icon={UserCircleIcon} className="w-6 h-6 text-primary/60" />
                                                                      </div>
                                                                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                                                           {idx + 1}
                                                                      </div>
                                                                 </div>
                                                                 <div>
                                                                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{appointment.patient}</p>
                                                                      <div className="flex items-center gap-2 mt-0.5">
                                                                           <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold uppercase tracking-wider">{appointment.illnessCategory}</span>
                                                                           <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                                                                                <HugeiconsIcon icon={Calendar03Icon} className="w-3 h-3" /> {appointment.preferredDate}
                                                                           </span>
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                            <Button 
                                                                 size="sm" 
                                                                 variant="ghost" 
                                                                 className="rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all px-4"
                                                                 onClick={() => router.push(`/receptionist-dashboard/appointments/pending`)}
                                                            >
                                                                 Assign <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 w-4 h-4" />
                                                            </Button>
                                                       </motion.div>
                                                  ))}
                                             </AnimatePresence>
                                             {pending.length > 5 && (
                                                  <div className="p-4 text-center bg-muted/10">
                                                       <p className="text-xs font-semibold text-muted-foreground">+ {pending.length - 5} more patients waiting</p>
                                                  </div>
                                             )}
                                        </div>
                                   )}
                              </CardContent>
                         </Card>
                    </motion.div>

                    {/* STATS SECTION (Row 2) */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                         <Card className="h-full rounded-md border-none bg-emerald-50/50 dark:bg-emerald-900/10 shadow-sm transition-all hover:shadow-md">
                              <CardContent className="p-6 flex flex-col justify-between h-full">
                                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                        <HugeiconsIcon icon={CheckCircle} className="w-6 h-6 text-emerald-600" />
                                   </div>
                                   <div>
                                        <p className="text-sm font-semibold text-emerald-600/70 uppercase tracking-wider">Assigned Today</p>
                                        <p className="text-4xl font-black text-emerald-900 dark:text-emerald-100">{assignedToday.length}</p>
                                        <p className="text-xs text-emerald-600/60 mt-1 flex items-center gap-1">
                                             <HugeiconsIcon icon={Calendar03Icon} className="w-3 h-3" /> Scheduled
                                        </p>
                                   </div>
                              </CardContent>
                         </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-1">
                         <Card className="h-full rounded-md border-none bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm transition-all hover:shadow-md">
                              <CardContent className="p-6 flex flex-col justify-between h-full">
                                   <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                                        <HugeiconsIcon icon={Doctor01Icon} className="w-6 h-6 text-indigo-600" />
                                   </div>
                                   <div>
                                        <p className="text-sm font-semibold text-indigo-600/70 uppercase tracking-wider">Active Doctors</p>
                                        <p className="text-4xl font-black text-indigo-900 dark:text-indigo-100">{doctors.filter(d => d.is_available).length}</p>
                                        <p className="text-xs text-indigo-600/60 mt-1 flex items-center gap-1">
                                             <div className="w-2 h-2 rounded-full bg-emerald-500" /> Online Now
                                        </p>
                                   </div>
                              </CardContent>
                         </Card>
                    </motion.div>

                    {/* STAFF STATUS & QUICK NAV (Row 3) */}
                    <div className="lg:col-span-4 grid gap-6 md:grid-cols-2">
                         {/* STAFF PANEL */}
                         <motion.div variants={itemVariants}>
                              <Card className="rounded-md border-muted/40 shadow-lg overflow-hidden h-full">
                                   <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                             <CardTitle className="text-lg font-bold">Medical Staff</CardTitle>
                                             <CardDescription>Live availability status</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-md px-4" onClick={() => router.push("/receptionist-dashboard/doctors")}>
                                             Manage
                                        </Button>
                                   </CardHeader>
                                   <CardContent className="px-6 pb-6">
                                        <div className="grid grid-cols-2 gap-3">
                                             {doctors.slice(0, 4).map((doctor) => (
                                                  <div key={doctor.uuid} className="p-3 rounded-md bg-muted/30 border border-muted/50 flex items-center gap-3 group hover:bg-muted/50 transition-all cursor-pointer">
                                                       <div className="relative">
                                                            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary font-bold shadow-sm">
                                                                 {doctor.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div className={cn(
                                                                 "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm",
                                                                 doctor.is_available ? "bg-emerald-500" : "bg-rose-500"
                                                            )} />
                                                       </div>
                                                       <div className="min-w-0">
                                                            <p className="text-sm font-bold truncate">{doctor.name}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-60">
                                                                 {doctor.is_available ? "Available" : "On Duty"}
                                                            </p>
                                                       </div>
                                                  </div>
                                             ))}
                                             {doctors.length > 4 && (
                                                  <div className="col-span-2 text-center p-2">
                                                       <p className="text-xs text-muted-foreground font-medium">and {doctors.length - 4} other staff members</p>
                                                  </div>
                                             )}
                                        </div>
                                   </CardContent>
                              </Card>
                         </motion.div>

                         {/* QUICK NAVIGATION */}
                         <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                              <Card className="rounded-md border-none bg-rose-50/50 dark:bg-rose-900/10 shadow-sm transition-all hover:scale-[1.02] cursor-pointer group" onClick={() => router.push("/receptionist-dashboard/illness-categories")}>
                                   <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                                             <HugeiconsIcon icon={Medicine01Icon} className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                             <p className="font-bold text-rose-950 dark:text-rose-100">Care Categories</p>
                                             <p className="text-[10px] text-rose-900/50 dark:text-rose-100/50 font-medium uppercase tracking-widest">Medical Services</p>
                                        </div>
                                   </CardContent>
                              </Card>
                              
                              <Card className="rounded-md border-none bg-purple-50/50 dark:bg-purple-900/10 shadow-sm transition-all hover:scale-[1.02] cursor-pointer group" onClick={() => router.push("/receptionist-dashboard/profile")}>
                                   <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                                             <HugeiconsIcon icon={Settings01Icon} className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                             <p className="font-bold text-purple-950 dark:text-purple-100">Settings</p>
                                             <p className="text-[10px] text-purple-900/50 dark:text-purple-100/50 font-medium uppercase tracking-widest">System Preferences</p>
                                        </div>
                                   </CardContent>
                              </Card>

                              <div className="col-span-2">
                                   <Card className="rounded-md border-none bg-slate-900 dark:bg-slate-800 text-white shadow-xl overflow-hidden relative group">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all" />
                                        <CardContent className="p-6 flex items-center justify-between">
                                             <div className="flex items-center gap-4">
                                                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                                       <HugeiconsIcon icon={Notification01Icon} className="w-6 h-6 text-white" />
                                                  </div>
                                                  <div>
                                                       <p className="font-bold text-lg">Notifications</p>
                                                       <p className="text-white/60 text-xs">Stay updated with latest alerts</p>
                                                  </div>
                                             </div>
                                             <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/20 text-white" onClick={() => router.push("/receptionist-dashboard/notifications")}>
                                                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
                                             </Button>
                                        </CardContent>
                                   </Card>
                              </div>
                         </motion.div>
                    </div>
               </div>
          </motion.div>
     )
}
