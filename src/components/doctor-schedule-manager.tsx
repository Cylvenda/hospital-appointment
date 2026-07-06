"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import api from "@/api/axios"
import { API_ENDPOINTS } from "@/api/endpoints"
import type { AdminDoctor } from "@/store/admin/admin.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Schedule = {
  uuid: string
  day_of_week: number
  start_time: string
  end_time: string
  break_start_time: string | null
  break_end_time: string | null
  is_active: boolean
}

type UnavailableDate = {
  uuid: string
  date: string
  reason: string
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

function timeValue(value: string | null) {
  return value?.slice(0, 5) ?? ""
}

export function DoctorScheduleManager({ doctor }: { doctor: AdminDoctor }) {
  const [open, setOpen] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([])
  const [duration, setDuration] = useState(doctor.consultation_duration || 30)
  const [maximum, setMaximum] = useState(
    doctor.max_appointments_per_day?.toString() ?? ""
  )
  const [blockedDate, setBlockedDate] = useState("")
  const [blockedReason, setBlockedReason] = useState("")
  const [saving, setSaving] = useState(false)

  const scheduleByDay = useMemo(
    () => new Map(schedules.map((schedule) => [schedule.day_of_week, schedule])),
    [schedules]
  )

  const load = useCallback(async () => {
    const [scheduleResponse, unavailableResponse] = await Promise.all([
      api.get<Schedule[]>(API_ENDPOINTS.DOCTOR_SCHEDULES, {
        params: { doctor_uuid: doctor.uuid },
      }),
      api.get<UnavailableDate[]>(API_ENDPOINTS.DOCTOR_UNAVAILABLE_DATES, {
        params: { doctor_uuid: doctor.uuid },
      }),
    ])
    setSchedules(scheduleResponse.data)
    setUnavailableDates(unavailableResponse.data)
  }, [doctor.uuid])

  useEffect(() => {
    if (!open) return
    void load().catch(() => toast.error("Unable to load doctor schedule."))
  }, [load, open])

  const updateLocalSchedule = (
    day: number,
    changes: Partial<Schedule>
  ) => {
    const existing = scheduleByDay.get(day)
    const base: Schedule =
      existing ?? {
        uuid: "",
        day_of_week: day,
        start_time: "08:00",
        end_time: "17:00",
        break_start_time: null,
        break_end_time: null,
        is_active: true,
      }
    setSchedules((current) => [
      ...current.filter((schedule) => schedule.day_of_week !== day),
      { ...base, ...changes },
    ])
  }

  const save = async () => {
    setSaving(true)
    try {
      await api.patch(`${API_ENDPOINTS.ADMIN_DOCTORS}${doctor.uuid}/`, {
        consultation_duration: duration,
        max_appointments_per_day: maximum ? Number(maximum) : null,
      })
      await Promise.all(
        schedules.map((schedule) => {
          const payload = {
            doctor_uuid: doctor.uuid,
            day_of_week: schedule.day_of_week,
            start_time: timeValue(schedule.start_time),
            end_time: timeValue(schedule.end_time),
            break_start_time: timeValue(schedule.break_start_time) || null,
            break_end_time: timeValue(schedule.break_end_time) || null,
            is_active: schedule.is_active,
          }
          return schedule.uuid
            ? api.patch(
                `${API_ENDPOINTS.DOCTOR_SCHEDULES}${schedule.uuid}/`,
                payload
              )
            : api.post(API_ENDPOINTS.DOCTOR_SCHEDULES, payload)
        })
      )
      await load()
      toast.success("Doctor schedule saved.")
    } catch {
      toast.error("Doctor schedule could not be saved.")
    } finally {
      setSaving(false)
    }
  }

  const blockDate = async () => {
    if (!blockedDate) return
    try {
      await api.post(API_ENDPOINTS.DOCTOR_UNAVAILABLE_DATES, {
        doctor_uuid: doctor.uuid,
        date: blockedDate,
        reason: blockedReason,
      })
      setBlockedDate("")
      setBlockedReason("")
      await load()
    } catch {
      toast.error("Date could not be blocked.")
    }
  }

  return (
    <>
      <Button variant="outline" className="rounded-md" onClick={() => setOpen(true)}>
        Update Schedule
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{doctor.name} · Weekly Schedule</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Consultation duration (minutes)</Label>
              <Input
                type="number"
                min={5}
                max={240}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum appointments per day</Label>
              <Input
                type="number"
                min={1}
                value={maximum}
                placeholder="No limit"
                onChange={(event) => setMaximum(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {DAYS.map((label, day) => {
              const schedule = scheduleByDay.get(day)
              return (
                <div
                  key={label}
                  className="grid items-end gap-3 rounded-xl border p-3 md:grid-cols-[8rem_repeat(4,1fr)]"
                >
                  <div className="flex items-center gap-2 pb-2">
                    <Switch
                      checked={schedule?.is_active ?? false}
                      onCheckedChange={(checked) =>
                        updateLocalSchedule(day, { is_active: checked })
                      }
                    />
                    <span className="font-semibold">{label}</span>
                  </div>
                  {[
                    ["Start", "start_time"],
                    ["End", "end_time"],
                    ["Break start", "break_start_time"],
                    ["Break end", "break_end_time"],
                  ].map(([fieldLabel, field]) => (
                    <div className="space-y-1" key={field}>
                      <Label className="text-xs">{fieldLabel}</Label>
                      <Input
                        type="time"
                        disabled={!schedule?.is_active}
                        value={timeValue(
                          schedule?.[field as keyof Schedule] as string | null
                        )}
                        onChange={(event) =>
                          updateLocalSchedule(day, {
                            [field]: event.target.value || null,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="space-y-3 rounded-xl border p-4">
            <Label>Unavailable date or leave</Label>
            <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
              <Input
                type="date"
                value={blockedDate}
                onChange={(event) => setBlockedDate(event.target.value)}
              />
              <Input
                value={blockedReason}
                placeholder="Reason (optional)"
                onChange={(event) => setBlockedReason(event.target.value)}
              />
              <Button type="button" onClick={blockDate}>Block Date</Button>
            </div>
            {unavailableDates.map((item) => (
              <div key={item.uuid} className="flex items-center justify-between text-sm">
                <span>{item.date} {item.reason ? `· ${item.reason}` : ""}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await api.delete(
                      `${API_ENDPOINTS.DOCTOR_UNAVAILABLE_DATES}${item.uuid}/`
                    )
                    await load()
                  }}
                >
                  Unblock
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Schedule"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
