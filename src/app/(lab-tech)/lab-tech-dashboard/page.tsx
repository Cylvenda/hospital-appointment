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
import { useLaboratoryStore } from "@/store/laboratory/laboratory.store"
import { getDashboardPath } from "@/lib/role-dashboard"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
     Medicine01Icon,
     CheckCircle, 
     HourglassIcon,
     RefreshIcon,
     Settings01Icon,
     Calendar03Icon,
     UserCircleIcon,
     ArrowRight01Icon,
     Notification01Icon,
     File01Icon
} from "@hugeicons/core-free-icons"

export default function LabTechDashboardPage() {
     const router = useRouter()
     const { user, checkAuth, exportMyReport } = useAuthUserStore()
     const { requests, results, loading, initialize, initialized } = useLaboratoryStore()

     useEffect(() => {
          void (async () => {
               const authenticated = await checkAuth()
               if (!authenticated) {
                    router.replace("/login")
                    return
               }

               const resolvedRole = useAuthUserStore.getState().user?.role
               if (resolvedRole !== "lab_tech") {
                    router.replace(getDashboardPath(resolvedRole))
                    return
               }

               if (!initialized) {
                    await initialize()
               }
          })()
     }, [checkAuth, router, initialize, initialized])

     const pendingRequests = useMemo(() => {
          return requests.filter((r) => r.status === "pending" || r.status === "processing")
     }, [requests])

     const completedRequests = useMemo(() => {
          return requests.filter((r) => r.status === "completed")
     }, [requests])

     const criticalAlerts = useMemo(() => {
          return results.filter((r) => r.remarks?.toLowerCase().includes("critical") || false).length
     }, [results])

     const handleRefresh = async () => {
          await initialize()
     }

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
                                   Welcome back, {user?.first_name?.split(' ')[0] || "Lab Technician"}!
                              </h1>
                              <p className="text-primary-foreground/80 max-w-md text-lg">
                                   You have <span className="font-bold text-white">{pendingRequests.length} lab requests</span> pending. Let&apos;s process them!
                              </p>
                         </div>

                         <div className="flex flex-wrap gap-3">
                              <Button
                                   size="lg"
                                   variant="outline"
                                   className="rounded-md border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all"
                                   onClick={handleRefresh}
                                   disabled={loading}
                              >
                                   <HugeiconsIcon icon={RefreshIcon} className={cn("mr-2 h-5 w-5", loading && "animate-spin")} />
                                   Refresh Queue
                              </Button>
                              <Button
                                   size="lg"
                                   variant="outline"
                                   className="rounded-md border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all"
                                   onClick={() => exportMyReport("pdf")}
                              >
                                   <HugeiconsIcon icon={File01Icon} className="mr-2 h-5 w-5" />
                                   PDF Report
                              </Button>
                              <Button
                                   size="lg"
                                   variant="outline"
                                   className="rounded-md border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all"
                                   onClick={() => exportMyReport("docx")}
                              >
                                   <HugeiconsIcon icon={File01Icon} className="mr-2 h-5 w-5" />
                                   DOCX Report
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
                                        <HugeiconsIcon icon={Medicine01Icon} className="w-6 h-6 text-blue-600" />
                                   </div>
                                   <div>
                                        <p className="text-sm font-semibold text-blue-600/70 uppercase tracking-wider">Total Requests</p>
                                        <p className="text-4xl font-black text-blue-900 dark:text-blue-100">{requests.length}</p>
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
                                        <p className="text-sm font-semibold text-amber-600/70 uppercase tracking-wider">Pending Requests</p>
                                        <p className="text-4xl font-black text-amber-900 dark:text-amber-100">{pendingRequests.length}</p>
                                        <p className="text-xs text-amber-600/60 mt-1 flex items-center gap-1">
                                             <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" /> In Queue
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
                                                  <HugeiconsIcon icon={File01Icon} className="w-6 h-6 text-primary" />
                                                  Recent Lab Requests
                                             </CardTitle>
                                             <CardDescription>Patients waiting for sample collection or test results</CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm" className="rounded-md text-primary font-bold" onClick={() => router.push("/lab-tech-dashboard/requests")}>
                                             View All <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 w-4 h-4" />
                                        </Button>
                                   </div>
                              </CardHeader>
                              <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
                                   {loading && requests.length === 0 ? (
                                        <div className="p-12 text-center flex flex-col items-center gap-3">
                                             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                             <p className="text-muted-foreground font-medium">Refreshing requests...</p>
                                        </div>
                                   ) : pendingRequests.length === 0 ? (
                                        <div className="p-12 text-center flex flex-col items-center gap-4">
                                             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                  <HugeiconsIcon icon={CheckCircle} className="w-8 h-8" />
                                             </div>
                                             <p className="text-muted-foreground font-medium text-lg">All caught up!</p>
                                             <p className="text-sm text-muted-foreground/60 max-w-[200px]">No pending lab requests at the moment.</p>
                                        </div>
                                   ) : (
                                        <div className="divide-y divide-muted/40">
                                             <AnimatePresence mode="popLayout">
                                                  {pendingRequests.slice(0, 5).map((req, idx) => (
                                                       <motion.div 
                                                            key={req.id} 
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
                                                                 </div>
                                                                 <div>
                                                                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{req.patientName}</p>
                                                                      <div className="flex items-center gap-2 mt-0.5">
                                                                           <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold uppercase tracking-wider">
                                                                                {req.items.length > 0 ? req.items[0].testTypeName : "Multiple Tests"}
                                                                           </span>
                                                                           <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                                                                                <HugeiconsIcon icon={Calendar03Icon} className="w-3 h-3" /> {new Date(req.requestedAt).toLocaleDateString()}
                                                                           </span>
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                            <Button 
                                                                 size="sm" 
                                                                 variant="ghost" 
                                                                 className="rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all px-4"
                                                                 onClick={() => router.push(`/lab-tech-dashboard/requests/${req.id}`)}
                                                            >
                                                                 Process <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 w-4 h-4" />
                                                            </Button>
                                                       </motion.div>
                                                  ))}
                                             </AnimatePresence>
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
                                        <p className="text-sm font-semibold text-emerald-600/70 uppercase tracking-wider">Completed Tests</p>
                                        <p className="text-4xl font-black text-emerald-900 dark:text-emerald-100">{completedRequests.length}</p>
                                        <p className="text-xs text-emerald-600/60 mt-1 flex items-center gap-1">
                                             <HugeiconsIcon icon={Calendar03Icon} className="w-3 h-3" /> Successfully Resulted
                                        </p>
                                   </div>
                              </CardContent>
                         </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-1">
                         <Card className="h-full rounded-md border-none bg-rose-50/50 dark:bg-rose-900/10 shadow-sm transition-all hover:shadow-md">
                              <CardContent className="p-6 flex flex-col justify-between h-full">
                                   <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
                                        <HugeiconsIcon icon={File01Icon} className="w-6 h-6 text-rose-600" />
                                   </div>
                                   <div>
                                        <p className="text-sm font-semibold text-rose-600/70 uppercase tracking-wider">Critical Alerts</p>
                                        <p className="text-4xl font-black text-rose-900 dark:text-rose-100">{criticalAlerts}</p>
                                        <p className="text-xs text-rose-600/60 mt-1 flex items-center gap-1">
                                             <span className="w-2 h-2 rounded-full bg-rose-500 block" /> Needs Verification
                                        </p>
                                   </div>
                              </CardContent>
                         </Card>
                    </motion.div>

                    {/* QUICK NAVIGATION (Row 3) */}
                    <div className="lg:col-span-4 grid gap-6 md:grid-cols-2">
                         <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                              <Card className="rounded-md border-none bg-purple-50/50 dark:bg-purple-900/10 shadow-sm transition-all hover:scale-[1.02] cursor-pointer group" onClick={() => router.push("/lab-tech-dashboard/test-types")}>
                                   <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                                             <HugeiconsIcon icon={Medicine01Icon} className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                             <p className="font-bold text-purple-950 dark:text-purple-100">Lab Test Types</p>
                                             <p className="text-[10px] text-purple-900/50 dark:text-purple-100/50 font-medium uppercase tracking-widest">Manage Categories</p>
                                        </div>
                                   </CardContent>
                              </Card>
                              
                              <Card className="rounded-md border-none bg-slate-50/50 dark:bg-slate-800 shadow-sm transition-all hover:scale-[1.02] cursor-pointer group" onClick={() => router.push("/lab-tech-dashboard/profile")}>
                                   <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-500/10 flex items-center justify-center group-hover:bg-slate-500 group-hover:text-white transition-all shadow-sm">
                                             <HugeiconsIcon icon={Settings01Icon} className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                             <p className="font-bold text-slate-950 dark:text-slate-100">Settings</p>
                                             <p className="text-[10px] text-slate-900/50 dark:text-slate-100/50 font-medium uppercase tracking-widest">System Preferences</p>
                                        </div>
                                   </CardContent>
                              </Card>
                         </motion.div>

                         <motion.div variants={itemVariants}>
                              <Card className="h-full rounded-md border-none bg-slate-900 dark:bg-slate-800 text-white shadow-xl overflow-hidden relative group">
                                   <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all" />
                                   <CardContent className="p-6 flex flex-col justify-center h-full">
                                        <div className="flex items-center gap-4 mb-4">
                                             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                                  <HugeiconsIcon icon={Notification01Icon} className="w-6 h-6 text-white" />
                                             </div>
                                             <div>
                                                  <p className="font-bold text-lg">Notifications & Alerts</p>
                                                  <p className="text-white/60 text-xs">Stay updated with priority results</p>
                                             </div>
                                        </div>
                                        <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" onClick={() => router.push("/lab-tech-dashboard/notifications")}>
                                             View All Notifications
                                             <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 w-4 h-4" />
                                        </Button>
                                   </CardContent>
                              </Card>
                         </motion.div>
                    </div>
               </div>
          </motion.div>
     )
}
