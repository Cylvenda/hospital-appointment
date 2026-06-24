"use client"

import { useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { DoctorAppointmentCard } from "@/components/customs/doctor-appointment-card"
import { filterAppointmentsForQueue } from "@/lib/appointment-queues"
import { HugeiconsIcon } from "@hugeicons/react"
import { RefreshIcon, Loading, Medicine01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export default function DoctorPendingAppointmentsPage() {
  const {
    appointments,
    loading,
    error,
    initialized,
    initialize,
  } = useAppointmentStore()

  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialize, initialized])

  // For doctors, the actionable queue is appointments already assigned and ready for assessment.
  const pendingAppointments = useMemo(
    () => filterAppointmentsForQueue(appointments, "doctor", "assigned"),
    [appointments]
  )

  if (loading && appointments.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-muted-foreground animate-pulse">Syncing your queue...</p>
         </div>
      </div>
    )
  }

  if (error && appointments.length === 0) {
    return (
      <div className="flex w-full flex-col items-center gap-6 rounded-[2.5rem] border-2 border-rose-100 bg-rose-50/30 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
             <HugeiconsIcon icon={Medicine01Icon} className="w-8 h-8" />
        </div>
        <div className="space-y-1">
             <p className="text-lg font-bold text-rose-900">
               {error || "Failed to load your schedule."}
             </p>
             <p className="text-sm text-rose-700/60">Please try again later.</p>
        </div>
        <Button onClick={() => void initialize()} variant="outline" className="rounded-2xl border-rose-200 text-rose-700 hover:bg-rose-100">
          <HugeiconsIcon icon={RefreshIcon} className="mr-2 w-4 h-4" />
          Retry Sync
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-8xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight italic sm:text-3xl">Assigned Patients</h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-muted-foreground sm:text-base">
            Appointments assigned to you and waiting for clinical review.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-muted-foreground/10 bg-muted/30 px-4 py-2.5">
             <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Ready Now</p>
                  <p className="text-lg font-black">{pendingAppointments.length}</p>
             </div>
             <div className="mx-1 h-7 w-px bg-muted-foreground/10" />
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-10 w-10 rounded-2xl hover:bg-background"
               onClick={() => void initialize()}
               disabled={loading}
             >
                  <HugeiconsIcon icon={RefreshIcon} className={cn("h-4 w-4", loading && "animate-spin")} />
             </Button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
           {pendingAppointments.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center gap-5 rounded-[2rem] border-2 border-dashed border-muted bg-muted/10 p-10 text-center"
             >
               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <HugeiconsIcon icon={Loading} className="h-7 w-7" />
               </div>
               <div className="space-y-1">
                    <p className="text-xl font-black text-foreground">Queue is Clear</p>
                    <p className="mx-auto max-w-xs text-sm font-medium text-muted-foreground">
                      No assigned appointments are ready for assessment right now.
                    </p>
               </div>
             </motion.div>
           ) : (
             <motion.div 
               layout
               className="grid gap-4"
             >
               {pendingAppointments.map((appointment) => (
                 <DoctorAppointmentCard
                   key={appointment.id}
                   appointment={appointment}
                 />
               ))}
             </motion.div>
           )}
      </AnimatePresence>
    </div>
  )
}
