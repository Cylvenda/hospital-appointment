"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "react-toastify"
import type { AxiosError } from "axios"
import type { Appointment, Doctor } from "@/store/appointments/appointment.types"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
   Calendar03Icon,
   Clock01Icon,
   InformationCircleIcon,
   UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { RescheduleAppointment } from "./reschedule-appointment"
import { useTranslation } from "@/lib/i18n"

type Props = {
  appointment: Appointment
  doctors: Doctor[]
  onAssign?: (data: {
    appointmentId: string
    doctorId: string
    appointmentDate: string
    startTime: string
    endTime: string
  }) => void | Promise<void>
  onCancel?: (appointmentId: string) => void | Promise<void>
  hideViewDetails?: boolean
  audience?: "admin" | "receptionist"
}

export default function AssignAppointment({
  appointment,
  onCancel,
  hideViewDetails = false,
  audience = "receptionist",
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const checkInAppointment = useAppointmentStore(
    (state) => state.checkInAppointment
  )
  const markAppointmentPaid = useAppointmentStore(
    (state) => state.markAppointmentPaid
  )
  const [loading, setLoading] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const status = getAppointmentStatusMeta(
    appointment.status,
    appointment.paymentStatus,
    audience
  )
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`
  const isToday = appointment.date === today
  const canCheckIn = appointment.status === "confirmed" && isToday
  const canMarkPaid =
    appointment.status === "pending" &&
    appointment.paymentStatus !== "completed"
  const canReschedule =
    appointment.status === "confirmed" && Boolean(appointment.doctorId)
  const canCancel = ["pending", "confirmed"].includes(appointment.status)
  const detailsBase = pathname.includes("receptionist-dashboard")
    ? "/receptionist-dashboard/appointments"
    : "/appointments"

  const checkIn = async () => {
    setLoading(true)
    try {
      await checkInAppointment(appointment.id)
      toast.success(t("staffAppointmentCard.checkInSuccess"))
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string | string[] }>
      const detail = axiosError.response?.data?.detail
      const message = typeof detail === "string" 
        ? detail 
        : Array.isArray(detail) && detail[0] 
          ? detail[0] 
          : error instanceof Error && error.message 
            ? error.message 
            : t("staffAppointmentCard.checkInError")
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const cancel = async () => {
    setLoading(true)
    try {
      await onCancel?.(appointment.id)
      toast.success(t("staffAppointmentCard.cancelSuccess"))
    } catch {
      toast.error(t("staffAppointmentCard.cancelError"))
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async () => {
    setLoading(true)
    try {
      await markAppointmentPaid(appointment.id, paymentMethod)
      setPaymentDialogOpen(false)
      toast.success(
        isToday
          ? t("staffAppointmentCard.paymentSuccessToday")
          : t("staffAppointmentCard.paymentSuccessFuture")
      )
    } catch {
      toast.error(t("staffAppointmentCard.paymentError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
      <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-emerald-500" />
      <CardHeader className="border-b bg-muted/15">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={UserCircleIcon} className="size-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{appointment.patient}</CardTitle>
                <Badge variant="outline">{status.label}</Badge>
                <Badge
                  className={
                    appointment.paymentStatus === "completed"
                      ? "bg-emerald-600"
                      : "bg-amber-500"
                  }
                >
                  {appointment.paymentStatus === "completed"
                    ? t("staffAppointmentCard.paid")
                    : t("staffAppointmentCard.paymentPending")}
                </Badge>
                {appointment.queueNumber && (
                  <Badge className="bg-blue-600">
                    {t("staffAppointmentCard.queueNumber", { number: appointment.queueNumber })}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {appointment.email} · {appointment.illnessCategory}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            {t("staffAppointmentCard.appointmentBadge", {
              id: appointment.appointmentId ?? t("appointments.pending"),
            })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Doctor
            </p>
            <p className="mt-2 font-semibold">
              {appointment.doctor || t("staffAppointmentCard.notAssigned")}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
              {t("staffAppointmentCard.scheduledDay")}
            </p>
            <p className="mt-2 font-semibold">
              {appointment.date || t("staffAppointmentCard.notScheduled")}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} className="size-4" />
              {t("staffAppointmentCard.generatedSlot")}
            </p>
            <p className="mt-2 font-semibold">
              {appointment.startTime || "--:--"}–{appointment.endTime || "--:--"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <HugeiconsIcon icon={InformationCircleIcon} className="mt-0.5 size-5 text-blue-600" />
          <div>
            <p className="font-semibold">{status.label}</p>
            <p className="text-sm text-muted-foreground">{status.summary}</p>
            {appointment.note && (
              <p className="mt-2 text-sm">{t("staffAppointmentCard.patientNote")}: {appointment.note}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
          {canMarkPaid && (
              <Button onClick={() => setPaymentDialogOpen(true)}>
                {t("staffAppointmentCard.markAsPaid")}
              </Button>
          )}
          {canCheckIn && (
            <Button onClick={checkIn} disabled={loading}>
              {t("staffAppointmentCard.checkInPatient")}
            </Button>
          )}
          {canReschedule && (
            <RescheduleAppointment appointment={appointment} />
          )}
          {canCancel && (
            <Button variant="destructive" onClick={cancel} disabled={loading}>
              {t("staffAppointmentCard.cancelAppointment")}
            </Button>
          )}
          {!hideViewDetails && (
            <Button
              variant="outline"
              onClick={() => router.push(`${detailsBase}/${appointment.id}`)}
            >
              {t("staffAppointmentCard.viewDetails")}
            </Button>
          )}
        </div>
      </CardContent>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("staffAppointmentCard.confirmPaymentTitle")}</DialogTitle>
            <DialogDescription>
              {t("staffAppointmentCard.confirmPaymentDescription", {
                patient: appointment.patient,
                fee: appointment.fee,
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-sm font-medium">{t("staffAppointmentCard.paymentMethod")}</p>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">{t("staffAppointmentCard.cash")}</SelectItem>
                <SelectItem value="mobile_money">{t("staffAppointmentCard.mobileMoney")}</SelectItem>
                <SelectItem value="bank_transfer">{t("staffAppointmentCard.bankTransfer")}</SelectItem>
                <SelectItem value="insurance">{t("staffAppointmentCard.insurance")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
              disabled={loading}
            >
              {t("staffAppointmentCard.goBack")}
            </Button>
            <Button onClick={confirmPayment} disabled={loading}>
              {loading ? t("staffAppointmentCard.confirming") : t("staffAppointmentCard.confirmPayment")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}