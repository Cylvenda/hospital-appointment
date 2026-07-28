"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import AssignAppointment from "@/components/customs/assign-appointment"
import { useTranslation } from "@/lib/i18n"

export default function ReceptionistSingleAppointmentPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { appointments, doctors, assignAppointment, cancelAppointment, initialized, initialize } = useAppointmentStore()
  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialize, initialized])

  if (!initialized) {
    return (
      <div className="w-full flex h-64 items-center justify-center rounded-4xl border border-dashed border-border bg-card">
        <p className="text-sm text-muted-foreground animate-pulse">{t("appointmentDetailPage.loading")}</p>
      </div>
    )
  }

  const appointment = appointments.find((a) => a.id === id)

  if (!appointment && appointments.length > 0) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-4xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          {t("appointmentDetailPage.notFound")}
        </p>
        <Button onClick={() => router.push("/receptionist-dashboard/appointments/all")} variant="outline">
          {t("appointmentDetailPage.back")}
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-8xl mx-auto space-y-8">
      <div className="flex items-center gap-4 bg-card p-4 rounded-3xl border shadow-sm">
        <Button 
          variant="ghost" 
          size="icon-lg" 
          onClick={() => router.back()}
          className="rounded-2xl hover:bg-muted shrink-0"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t("appointmentDetailPage.title")}</h1>
          <p className="text-sm text-muted-foreground font-medium">
            {t("appointmentDetailPage.description", { id: id?.slice(0, 8) || id })}
          </p>
        </div>
      </div>

      {appointment && (
        <AssignAppointment
          appointment={appointment}
          doctors={doctors}
          onAssign={assignAppointment}
          onCancel={cancelAppointment}
          hideViewDetails={true}
        />
      )}
    </div>
  )
}
