"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
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
      .catch(() => toast.error("Unable to load available days."))
  }, [appointment.doctorId, open])

  useEffect(() => {
    setSlots([])
    setStartTime("")
    if (!appointment.doctorId || !date) return
    void appointmentService
      .listAvailableSlots(appointment.doctorId, date)
      .then((response) => setSlots(response.data))
      .catch(() => toast.error("Unable to load available slots."))
  }, [appointment.doctorId, date])

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
      toast.success("Appointment rescheduled.")
    } catch {
      toast.error("Appointment could not be rescheduled.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Reschedule
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule appointment</DialogTitle>
          </DialogHeader>
          <Select value={date} onValueChange={setDate}>
            <SelectTrigger>
              <SelectValue placeholder="Select available day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day.date} value={day.date}>
                  {day.date} · {day.slot_count} slots
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={startTime} onValueChange={setStartTime} disabled={!date}>
            <SelectTrigger>
              <SelectValue placeholder="Select available time" />
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
            {saving ? "Saving..." : "Confirm Reschedule"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
