"use client"

import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { toast } from "react-toastify"

export default function DoctorAcceptedAppointmentsPage() {
  const {
    appointments,
    loading,
    error,
    initialized,
    initialize,
    updateAppointment,
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

  const handleComplete = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { status: "completed" })
      toast.success("Appointment marked as completed")
    } catch {
      toast.error("Failed to complete appointment")
    }
  }

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
          Appointments you have confirmed and scheduled.
        </p>
      </div>

      {acceptedAppointments.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No accepted appointments.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {acceptedAppointments.map((appointment) => (
            <div key={appointment.id} className="rounded-2xl border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{appointment.patient}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.illnessCategory}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} • {appointment.startTime} - {appointment.endTime}
                  </p>
                  {appointment.note && (
                    <p className="text-sm mt-2">{appointment.note}</p>
                  )}
                </div>
                <Button size="sm" onClick={() => handleComplete(appointment.id)}>
                  Complete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}