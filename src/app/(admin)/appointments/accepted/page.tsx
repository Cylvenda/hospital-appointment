"use client"

import { useEffect, useMemo } from "react"
import AssignAppointment from "@/components/customs/assign-appointment"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"

export default function ReceptionistAppointmentsPage() {
  const {
    appointments,
    doctors,
    loading,
    error,
    initialized,
    initialize,
    assignAppointment,
    cancelAppointment,
  } = useAppointmentStore()

  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialize, initialized])

  const acceptedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "accepted"),
    [appointments]
  )

  console.log("Accepted one are: ", appointments)

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
        <h1 className="text-2xl font-semibold">Accepted Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Review accepted appointments that are ready for scheduling or follow-up.
        </p>
      </div>

      {acceptedAppointments.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No accepted appointments are available.
          </p>
        </div>
      ) : (
        acceptedAppointments.map((appointment) => (
          <AssignAppointment
            key={appointment.id}
            appointment={appointment}
            doctors={doctors}
            onAssign={assignAppointment}
            onCancel={cancelAppointment}
          />
        ))
      )}
    </div>
  )
}
