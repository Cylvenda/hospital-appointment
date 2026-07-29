"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTranslation } from "@/lib/i18n"
import { appointmentService } from "@/api/services/appointment.service"
import type {
  Appointment,
  AvailableAppointmentDay,
  AvailableAppointmentSlot,
} from "@/store/appointments/appointment.types"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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

export function RescheduleAppointment({ appointment }: { appointment: Appointment }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [days, setDays] = useState<AvailableAppointmentDay[]>([])
  const [slots, setSlots] = useState<AvailableAppointmentSlot[]>([])
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [saving, setSaving] = useState(false)
  const fetchAppointments = useAppointmentStore((state) => state.fetchAppointments)

  useEffect(() => {
    if (!open || !appointment.doctorId) return
    void appointmentService
      .listAvailableDays(appointment.doctorId)
      .then((response) => setDays(response.data))
      .catch(() => toast.error(t("sharedAudit.availableDaysError")))
  }, [appointment.doctorId, open, t])

  useEffect(() => {
    setSlots([])
    setStartTime("")
    if (!appointment.doctorId || !date) return
    void appointmentService
      .listAvailableSlots(appointment.doctorId, date)
      .then((response) => setSlots(response.data))
      .catch(() => toast.error(t("sharedAudit.availableSlotsError")))
  }, [appointment.doctorId, date, t])

  const save = async () => {
    if (!date || !startTime) return
    setSaving(true)
    try {
      await appointmentService.rescheduleAppointment(
        appointment.id,
        date,
        startTime
      )
      await fetchAppointments()
      setOpen(false)
      toast.success(t("sharedAudit.appointmentRescheduled"))
    } catch {
      toast.error(t("sharedAudit.appointmentRescheduleError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {t("sharedAudit.reschedule")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sharedAudit.rescheduleAppointment")}</DialogTitle>
          </DialogHeader>
          <Select value={date} onValueChange={setDate}>
            <SelectTrigger>
              <SelectValue placeholder={t("sharedAudit.selectAvailableDay")} />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day.date} value={day.date}>
                  {day.date} ·{" "}
                  {t("sharedAudit.availableSlotsCount", {
                    count: day.slot_count,
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={startTime} onValueChange={setStartTime} disabled={!date}>
            <SelectTrigger>
              <SelectValue placeholder={t("sharedAudit.selectAvailableTime")} />
            </SelectTrigger>
            <SelectContent>
              {slots.map((slot) => (
                <SelectItem key={slot.start_time} value={slot.start_time}>
                  {slot.start_time}–{slot.end_time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={save} disabled={!date || !startTime || saving}>
            {saving
              ? t("sharedAudit.saving")
              : t("sharedAudit.confirmReschedule")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
