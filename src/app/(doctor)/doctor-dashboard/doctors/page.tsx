"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppointmentStore } from "@/store/appointments/appointment.store"

export default function DoctorDoctorsPage() {
  const { doctors, fetchDoctors, error } = useAppointmentStore()

  useEffect(() => {
    void fetchDoctors()
  }, [fetchDoctors])

  return (
    <div className="w-full max-w-8xl">
      <Card>
        <CardHeader>
          <CardTitle>Our Doctors</CardTitle>
          <CardDescription>Other doctors in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && doctors.length === 0 ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : doctors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No doctors found.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="rounded-2xl border p-4">
                  <p className="font-medium">{doctor.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}