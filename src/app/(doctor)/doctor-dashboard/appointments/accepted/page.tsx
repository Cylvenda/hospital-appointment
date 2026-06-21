"use client"

import { useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { DoctorAppointmentCard } from "@/components/customs/doctor-appointment-card"
import { filterAppointmentsForQueue } from "@/lib/appointment-queues"
import { HugeiconsIcon } from "@hugeicons/react"
import { RefreshIcon, CheckCheck, Medicine01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export default function DoctorAcceptedAppointmentsPage() {
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

  const acceptedAppointments = useMemo(
    () => filterAppointmentsForQueue(appointments, "doctor", "waiting-for-consultation"),
    [appointments]
  )

  if (loading && appointments.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-muted-foreground animate-pulse">Syncing assessment queue...</p>
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
               {error || "Failed to load appointment history."}
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
    <div className="w-full space-y-10 max-w-8xl p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight italic">Waiting for Consultation</h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium">
            Appointments assigned to you but not yet inside the live consultation window.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 px-6 py-3 rounded-3xl border border-muted-foreground/10">
             <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Ready Now</p>
                  <p className="text-xl font-black">{acceptedAppointments.length}</p>
             </div>
             <div className="w-px h-8 bg-muted-foreground/10 mx-2" />
             <Button 
               variant="ghost" 
               size="icon" 
               className="rounded-2xl h-12 w-12 hover:bg-background"
               onClick={() => void initialize()}
               disabled={loading}
             >
                  <HugeiconsIcon icon={RefreshIcon} className={cn("w-5 h-5", loading && "animate-spin")} />
             </Button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
           {acceptedAppointments.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="rounded-[3rem] border-2 border-dashed border-muted bg-muted/10 p-24 text-center flex flex-col items-center gap-6"
             >
               <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <HugeiconsIcon icon={CheckCheck} className="w-10 h-10" />
               </div>
               <div className="space-y-1">
                    <p className="text-2xl font-black text-foreground">Nothing to Review</p>
                    <p className="text-muted-foreground max-w-xs mx-auto font-medium">
                      All assigned appointments have been handled for now.
                    </p>
               </div>
             </motion.div>
           ) : (
             <motion.div 
               layout
               className="grid gap-8"
             >
               {acceptedAppointments.map((appointment) => (
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
