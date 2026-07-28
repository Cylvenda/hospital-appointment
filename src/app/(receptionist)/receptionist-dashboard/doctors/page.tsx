"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/store/admin/admin.store"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
     Cancel01Icon, 
     RefreshIcon,
     UserCircleIcon,
     UserAccountIcon
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { DoctorScheduleManager } from "@/components/doctor-schedule-manager"
import { DoctorProfileManager } from "@/components/doctor-profile-manager"
import { useTranslation } from "@/lib/i18n"

export default function ReceptionistDoctorsPage() {
  const { t } = useTranslation()
  const { doctors, fetchDoctors, loading, error } = useAdminStore()

  useEffect(() => {
    void fetchDoctors()
  }, [fetchDoctors])

  const containerVariants = {
       hidden: { opacity: 0 },
       visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
       }
  }

  const itemVariants = {
       hidden: { y: 20, opacity: 0 },
       visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="w-full max-w-8xl space-y-8 p-4 md:p-8">
       {/* HEADER */}
       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">{t("medicalStaff.title")}</h1>
                 <p className="text-muted-foreground mt-1">
                      {t("medicalStaff.description")}
                 </p>
            </div>
            <Button
                 className="rounded-2xl"
                 variant="outline"
                 onClick={() => void fetchDoctors()}
                 disabled={loading}
            >
                 <HugeiconsIcon icon={RefreshIcon} className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                 {t("medicalStaff.refresh")}
            </Button>
       </div>

       {error && doctors.length === 0 ? (
            <Card className="border-rose-200 bg-rose-50/50 rounded-[2rem]">
                 <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                           <HugeiconsIcon icon={Cancel01Icon} className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                           <p className="text-lg font-bold text-rose-900">{t("medicalStaff.loadError")}</p>
                           <p className="text-sm text-rose-700/70">{error}</p>
                      </div>
                      <Button onClick={() => void fetchDoctors()} variant="outline" className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-100">
                           {t("medicalStaff.tryAgain")}
                      </Button>
                 </CardContent>
            </Card>
       ) : doctors.length === 0 && !loading ? (
            <Card className="border-dashed rounded-[2rem]">
                 <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                           <HugeiconsIcon icon={UserCircleIcon} className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium text-muted-foreground">{t("medicalStaff.none")}</p>
                 </CardContent>
            </Card>
       ) : (
            <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                 {doctors.map((doctor) => (
                      <motion.div key={doctor.uuid} variants={itemVariants}>
                           <Card className="rounded-[2.5rem] overflow-hidden border-2 transition-all hover:shadow-xl group">
                                <CardHeader className="pb-4">
                                     <div className="flex items-center gap-4">
                                          <div className="relative">
                                               <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner group-hover:bg-primary/20 transition-colors">
                                                    {doctor.name.split(' ').map(n => n[0]).join('')}
                                               </div>
                                               <div className={cn(
                                                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 shadow-sm transition-transform group-hover:scale-110",
                                                    doctor.is_available ? "bg-emerald-500" : "bg-rose-500"
                                               )} />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                               <CardTitle className="text-xl font-bold truncate group-hover:text-primary transition-colors">{doctor.name}</CardTitle>
                                               <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest mt-0.5",
                                                    doctor.is_available ? "text-emerald-600" : "text-rose-600"
                                               )}>
                                                    {doctor.is_available ? t("medicalStaff.available") : t("medicalStaff.unavailable")}
                                               </p>
                                          </div>
                                     </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/50">
                                          <div className="flex items-center gap-3">
                                               <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground shadow-sm">
                                                    <HugeiconsIcon icon={UserAccountIcon} className="w-4 h-4" />
                                               </div>
                                               <div>
                                                    <p className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">{t("medicalStaff.license")}</p>
                                                    <p className="text-sm font-bold font-mono">{doctor.license_number}</p>
                                               </div>
                                          </div>
                                          <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                                          <div className="text-right">
                                               <p className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">{t("medicalStaff.systemId")}</p>
                                               <p className="text-xs font-bold text-muted-foreground">#{doctor.uuid.slice(0, 6)}</p>
                                          </div>
                                     </div>

                                     <div className="flex gap-2">
                                          <DoctorProfileManager doctor={doctor} />
                                          <DoctorScheduleManager doctor={doctor} />
                                     </div>
                                </CardContent>
                           </Card>
                      </motion.div>
                 ))}
            </motion.div>
       )}
    </div>
  )
}
