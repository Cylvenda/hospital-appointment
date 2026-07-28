"use client"

import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import AppointmentDisplay from "@/components/customs/pattient-appointment"
import { filterAppointmentsForQueue } from "@/lib/appointment-queues"
import { useTranslation } from "@/lib/i18n"

export default function ReceptionistAppointmentsPage() {
  const { t } = useTranslation()
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

  const completedAppointments = useMemo(
    () => filterAppointmentsForQueue(appointments, "patient", "completed"),
    [appointments]
  )

  if (loading && appointments.length === 0) {
    return (
      <div className="w-full rounded-8xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">{t("patientAppointmentLists.loading")}</p>
      </div>
    )
  }

  if (error && appointments.length === 0) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-8xl border border-red-200 bg-red-50/60 p-10 text-center">
        <p className="text-sm text-red-700">
          {t("patientAppointmentLists.loadError")}
        </p>
        <Button onClick={() => void initialize()} variant="outline">
          {t("patientAppointmentLists.tryAgain")}
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 max-w-8xl">
      <div>
        <h1 className="text-2xl font-semibold">{t("patientAppointmentLists.completedTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("patientAppointmentLists.completedDescription")}
        </p>
      </div>

      {completedAppointments.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {t("patientAppointmentLists.noCompleted")}
          </p>
        </div>
      ) : (
        completedAppointments.map((appointment) => (
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
