"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import AppointmentDisplay from "@/components/customs/pattient-appointment"

export default function SingleAppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const appointmentId = params.id as string

  const {
    appointments,
    loading,
    error,
    initialized,
    initialize,
    cancelAppointment,
  } = useAppointmentStore()

  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialize, initialized])

  const appointment = appointments.find((a) => a.id === appointmentId)

  if (loading && !appointment) {
    return (
      <div className="w-full rounded-3xl border border-dashed border-border bg-card p-10 text-center mt-6">
        <p className="text-sm text-muted-foreground font-medium">Loading appointment details...</p>
      </div>
    )
  }

  if (error && !appointment) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center mt-6">
        <p className="text-sm font-bold text-rose-700">
          {error || "We could not load this appointment right now."}
        </p>
        <Button onClick={() => void initialize()} variant="outline" className="rounded-xl border-rose-200 hover:bg-rose-100">
          Try Again
        </Button>
      </div>
    )
  }

  if (!appointment && initialized) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card p-10 text-center mt-6">
        <p className="text-sm text-muted-foreground font-medium">
          Appointment not found or you don't have access to it.
        </p>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-8xl mx-auto space-y-6 animate-in fade-in duration-500 p-2 sm:p-4">
      <div className="flex items-center gap-4 mb-6 bg-gradient-to-r from-primary/5 via-transparent to-transparent p-4 sm:p-6 rounded-3xl border border-primary/10">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="rounded-xl font-bold shadow-sm"
        >
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Appointment Details</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Review the complete details of your appointment.
          </p>
        </div>
      </div>

      {appointment && (
        <AppointmentDisplay
          appointment={appointment}
          onCancel={cancelAppointment}
          hideViewDetails={true}
        />
      )}
    </div>
  )
}
