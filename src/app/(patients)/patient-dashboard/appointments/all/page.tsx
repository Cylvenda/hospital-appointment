"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import AppointmentDisplay from "@/components/customs/pattient-appointment"

export default function ReceptionistAppointmentsPage() {
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


  if (loading && appointments.length === 0) {
    return (
      <div className="w-full rounded-8xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">Loading appointments...</p>
      </div>
    )
  }

  if (error && appointments.length === 0) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-8xl border border-red-200 bg-red-50/60 p-10 text-center">
        <p className="text-sm text-red-700">
          {error || "We could not load appointments right now."}
        </p>
        <Button onClick={() => void initialize()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 max-w-8xl">
      <div>
        <h1 className="text-2xl font-semibold">All Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Browse every appointment across pending, accepted, completed, and cancelled statuses.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No appointments are available.
          </p>
        </div>
      ) : (

        appointments.map((appointment) => (
          <AppointmentDisplay
            key={appointment.id}
            appointment={appointment}
            onCancel={cancelAppointment}
          />
        ))
      )}
    </div>
  )
}
