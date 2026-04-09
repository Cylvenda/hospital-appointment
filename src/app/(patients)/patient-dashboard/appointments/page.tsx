"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppointmentStore } from "@/store/appointments/appointment.store"

export default function PatientAppointmentsPage() {
  const {
    appointments,
    illnessCategories,
    loading,
    error,
    fetchAppointments,
    fetchIllnessCategories,
    createAppointment,
  } = useAppointmentStore()

  const [illnessCategoryId, setIllnessCategoryId] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    void fetchAppointments()
    void fetchIllnessCategories()
  }, [fetchAppointments, fetchIllnessCategories])

  const history = useMemo(
    () => [...appointments].sort((a, b) => b.date.localeCompare(a.date)),
    [appointments]
  )

  const canSubmit = Boolean(illnessCategoryId && appointmentDate && description.trim())

  const handleCreateAppointment = async () => {
    if (!canSubmit || submitting) return

    setSubmitting(true)
    try {
      await createAppointment({
        illnessCategoryId,
        appointmentDate,
        description: description.trim(),
      })

      setIllnessCategoryId("")
      setAppointmentDate("")
      setDescription("")
      toast.success("Appointment created successfully.")
    } catch {
      toast.error("Failed to create appointment.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Create a new appointment request and review your appointment history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Appointment</CardTitle>
          <CardDescription>Select category, date, and describe your concern.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Illness Category</label>
              <Select value={illnessCategoryId} onValueChange={setIllnessCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {illnessCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Date</label>
              <Input
                type="date"
                value={appointmentDate}
                onChange={(event) => setAppointmentDate(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Briefly describe your condition"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => void handleCreateAppointment()} disabled={!canSubmit || submitting}>
              {submitting ? "Creating..." : "Create Appointment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
          <CardDescription>
            {loading ? "Loading your history..." : "Your previous and upcoming appointments."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && history.length === 0 ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments found yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl border p-4">
                  <p className="font-medium">{appointment.illnessCategory}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {appointment.date} | Status: {appointment.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Doctor: {appointment.doctor || "Not assigned yet"}
                  </p>
                  <p className="text-sm text-muted-foreground">Description: {appointment.note}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
