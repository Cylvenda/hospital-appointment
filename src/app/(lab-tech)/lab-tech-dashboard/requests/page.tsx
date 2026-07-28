"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useLaboratoryStore } from "@/store/laboratory/laboratory.store"
import { getDashboardPath } from "@/lib/role-dashboard"
import { useTranslation } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, FilterIcon, RefreshIcon, Medicine01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export default function LabRequestsPage() {
     const { t, language } = useTranslation()
     const locale = language === "sw" ? "sw-TZ" : "en-US"
     const router = useRouter()
     const { checkAuth } = useAuthUserStore()
     const { requests, loading, initialize, initialized } = useLaboratoryStore()
     const [searchQuery, setSearchQuery] = useState("")
     const [statusFilter, setStatusFilter] = useState("all") // all, pending, processing, completed

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

     const filteredRequests = useMemo(() => {
          return requests.filter(req => {
               const matchesSearch = 
                    req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    req.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
               
               const matchesStatus = statusFilter === "all" || req.status === statusFilter

               return matchesSearch && matchesStatus
          })
     }, [requests, searchQuery, statusFilter])

     const handleRefresh = async () => {
          await initialize()
     }

     const getStatusBadge = (status: string) => {
          switch (status.toLowerCase()) {
               case "pending":
                    return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">{t("labTech.pending")}</Badge>
               case "processing":
                    return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900">{t("labTech.inProgress")}</Badge>
               case "completed":
                    return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900">{t("labTech.completed")}</Badge>
               case "cancelled":
                    return <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900">{t("appointments.cancelled")}</Badge>
               default:
                    return <Badge variant="outline" className="capitalize">{status}</Badge>
          }
     }

     return (
          <motion.div 
               className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-8"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
          >
               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                               <HugeiconsIcon icon={Medicine01Icon} className="w-8 h-8 text-primary" />
                               {t("labTech.labRequestsTitle")}
                          </h1>
                          <p className="text-muted-foreground mt-1">
                               {t("labTech.manageProcess")}
                          </p>
                    </div>
                     <div className="flex items-center gap-3">
                          <Button variant="outline" onClick={handleRefresh} disabled={loading} className="gap-2">
                               <HugeiconsIcon icon={RefreshIcon} className={cn("w-4 h-4", loading && "animate-spin")} />
                               {t("labTech.refreshBtn")}
                          </Button>
                     </div>
               </div>

               <Card className="border-muted/40 shadow-xl rounded-md overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-muted/40 pb-4">
                         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                               <CardTitle className="text-lg">{t("labTech.requestQueue")}</CardTitle>
                               <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                    <div className="relative">
                                         <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                         <Input 
                                              placeholder={t("labTech.searchPatientsDoctors")} 
                                              className="pl-9 w-full md:w-64 bg-background"
                                              value={searchQuery}
                                              onChange={(e) => setSearchQuery(e.target.value)}
                                         />
                                    </div>
                                   <div className="flex items-center gap-2 bg-background border border-input rounded-md p-1">
                                         <Button 
                                              variant={statusFilter === "all" ? "default" : "ghost"} 
                                              size="sm" 
                                              onClick={() => setStatusFilter("all")}
                                              className="h-7 text-xs"
                                         >
                                              {t("labTech.all")}
                                         </Button>
                                         <Button 
                                              variant={statusFilter === "pending" ? "default" : "ghost"} 
                                              size="sm" 
                                              onClick={() => setStatusFilter("pending")}
                                              className="h-7 text-xs"
                                         >
                                              {t("labTech.pending")}
                                         </Button>
                                         <Button 
                                              variant={statusFilter === "processing" ? "default" : "ghost"} 
                                              size="sm" 
                                              onClick={() => setStatusFilter("processing")}
                                              className="h-7 text-xs"
                                         >
                                              {t("labTech.inProgress")}
                                         </Button>
                                         <Button 
                                              variant={statusFilter === "completed" ? "default" : "ghost"} 
                                              size="sm" 
                                              onClick={() => setStatusFilter("completed")}
                                              className="h-7 text-xs"
                                         >
                                              {t("labTech.completed")}
                                         </Button>
                                   </div>
                              </div>
                         </div>
                    </CardHeader>
                    <CardContent className="p-0">
                         {loading && requests.length === 0 ? (
                              <div className="p-12 text-center flex flex-col items-center justify-center">
                                   <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-muted-foreground font-medium">{t("labTech.loadingRequests")}</p>
                               </div>
                          ) : filteredRequests.length === 0 ? (
                               <div className="p-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                         <HugeiconsIcon icon={FilterIcon} className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{t("labTech.noRequestsFound")}</h3>
                                    <p className="text-muted-foreground">{t("labTech.adjustFilters")}</p>
                               </div>
                         ) : (
                              <Table>
                              <TableHeader className="bg-muted/10">
                                   <TableRow>
                                        <TableHead className="w-[120px]">{t("labTech.date")}</TableHead>
                                        <TableHead>{t("common.patient")}</TableHead>
                                        <TableHead>{t("labTech.doctorName")}</TableHead>
                                        <TableHead>{t("labTech.testsRequested")}</TableHead>
                                        <TableHead>{t("labTech.status")}</TableHead>
                                        <TableHead className="text-right">{t("labTech.actions")}</TableHead>
                                   </TableRow>
                              </TableHeader>
                                   <TableBody>
                                        {filteredRequests.map((req) => (
                                             <TableRow key={req.id} className="hover:bg-primary/[0.02] transition-colors">
                                                  <TableCell className="font-medium text-muted-foreground text-xs whitespace-nowrap">
                                                       {new Date(req.requestedAt).toLocaleDateString(locale)}<br/>
                                                       {new Date(req.requestedAt).toLocaleTimeString(locale, {hour: '2-digit', minute:'2-digit'})}
                                                  </TableCell>
                                                  <TableCell className="font-bold">{req.patientName}</TableCell>
                                                  <TableCell className="text-muted-foreground">{req.doctorName}</TableCell>
                                                  <TableCell>
                                                       <div className="flex flex-wrap gap-1">
                                                            {req.items.map(item => (
                                                                 <Badge key={item.id} variant="secondary" className="text-[10px] uppercase">
                                                                      {item.testTypeName}
                                                                 </Badge>
                                                            ))}
                                                             {req.items.length === 0 && <span className="text-xs text-muted-foreground">{t("labTech.noTestItems")}</span>}
                                                       </div>
                                                  </TableCell>
                                                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                                                  <TableCell className="text-right">
                                                             <Button 
                                                                  size="sm" 
                                                                  variant="ghost" 
                                                                  className="text-primary hover:text-primary hover:bg-primary/10 rounded-md"
                                                                  onClick={() => router.push(`/lab-tech-dashboard/requests/${req.id}`)}
                                                             >
                                                                  {t("labTech.process")} <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 w-4 h-4" />
                                                             </Button>
                                                  </TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         )}
                    </CardContent>
               </Card>
          </motion.div>
     )
}
