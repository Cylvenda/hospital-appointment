"use client"

import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"

export default function DoctorAllAppointmentsPage() {
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

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [appointments]
  )

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
          Complete history of your appointments.
        </p>
      </div>

      {sortedAppointments.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No appointments found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAppointments.map((appointment) => (
            <div key={appointment.id} className="rounded-2xl border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{appointment.patient}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.illnessCategory}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} • {appointment.startTime || "--:--"} - {appointment.endTime || "--:--"}
                  </p>
                  {appointment.note && (
                    <p className="text-sm mt-2">{appointment.note}</p>
                  )}
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                  appointment.status === "accepted" ? "bg-green-100 text-green-700" :
                  appointment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  appointment.status === "completed" ? "bg-blue-100 text-blue-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}