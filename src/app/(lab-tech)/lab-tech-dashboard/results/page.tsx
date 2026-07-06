"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useLaboratoryStore } from "@/store/laboratory/laboratory.store"
import { getDashboardPath } from "@/lib/role-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, FilterIcon, RefreshIcon, File01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export default function LabResultsPage() {
     const { t } = useTranslation()
     const router = useRouter()
     const { checkAuth } = useAuthUserStore()
     const { results, loading, initialize, initialized } = useLaboratoryStore()
     const [searchQuery, setSearchQuery] = useState("")

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

     const filteredResults = useMemo(() => {
          return results.filter(res => {
               const searchLower = searchQuery.toLowerCase()
               return (
                    res.testName.toLowerCase().includes(searchLower) ||
                    (res.remarks && res.remarks.toLowerCase().includes(searchLower)) ||
                    res.verifiedByName.toLowerCase().includes(searchLower)
               )
          })
     }, [results, searchQuery])

     const handleRefresh = async () => {
          await initialize()
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
                               <HugeiconsIcon icon={File01Icon} className="w-8 h-8 text-primary" />
                               {t("labTech.labResults")}
                          </h1>
                          <p className="text-muted-foreground mt-1">
                               {t("labTech.viewVerifyCompleted")}
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
                               <CardTitle className="text-lg">{t("labTech.completedResults")}</CardTitle>
                               <div className="relative">
                                    <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input 
                                         placeholder={t("labTech.searchTestsRemarks")} 
                                        className="pl-9 w-full md:w-64 bg-background"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                   />
                              </div>
                         </div>
                    </CardHeader>
                    <CardContent className="p-0">
                         {loading && results.length === 0 ? (
                              <div className="p-12 text-center flex flex-col items-center justify-center">
                                   <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-muted-foreground font-medium">{t("labTech.loadingResults")}</p>
                               </div>
                          ) : filteredResults.length === 0 ? (
                               <div className="p-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                         <HugeiconsIcon icon={FilterIcon} className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{t("labTech.noResultsFound")}</h3>
                                    <p className="text-muted-foreground">{t("labTech.adjustSearch")}</p>
                               </div>
                         ) : (
                              <Table>
                              <TableHeader className="bg-muted/10">
                                   <TableRow>
                                        <TableHead className="w-[120px]">{t("labTech.date")}</TableHead>
                                        <TableHead>{t("labTech.testNameCol")}</TableHead>
                                        <TableHead>{t("labTech.resultValue")}</TableHead>
                                        <TableHead>{t("labTech.remarks")}</TableHead>
                                        <TableHead>{t("labTech.verifiedBy")}</TableHead>
                                        <TableHead className="text-right">{t("labTech.actions")}</TableHead>
                                   </TableRow>
                              </TableHeader>
                                   <TableBody>
                                        {filteredResults.map((res) => (
                                             <TableRow key={res.id} className="hover:bg-primary/[0.02] transition-colors">
                                                  <TableCell className="font-medium text-muted-foreground text-xs whitespace-nowrap">
                                                       {new Date(res.createdAt).toLocaleDateString()}<br/>
                                                       {new Date(res.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                  </TableCell>
                                                  <TableCell className="font-bold">{res.testName}</TableCell>
                                                  <TableCell>
                                                       <span className="font-mono bg-muted px-2 py-1 rounded-md text-sm">
                                                            {res.result}
                                                       </span>
                                                  </TableCell>
                                                  <TableCell className="max-w-[200px] truncate">
                                                             {res.remarks || <span className="text-muted-foreground italic text-xs">{t("labTech.noRemarks")}</span>}
                                                             {res.remarks?.toLowerCase().includes("critical") && (
                                                                  <Badge variant="destructive" className="ml-2 text-[10px] uppercase">{t("labTech.critical")}</Badge>
                                                             )}
                                                  </TableCell>
                                                  <TableCell className="text-muted-foreground text-sm">{res.verifiedByName}</TableCell>
                                                  <TableCell className="text-right">
                                                       <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="text-primary hover:text-primary hover:bg-primary/10 rounded-md"
                                                            onClick={() => router.push(`/lab-tech-dashboard/results/${res.id}`)}
                                                       >
                                                             {t("labTech.viewDetails")} <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 w-4 h-4" />
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
