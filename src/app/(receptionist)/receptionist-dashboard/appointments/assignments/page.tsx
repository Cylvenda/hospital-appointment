"use client"

import { useEffect, useMemo } from "react"
import AssignAppointment from "@/components/customs/assign-appointment"
import { Button } from "@/components/ui/button"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { filterAppointmentsForQueue } from "@/lib/appointment-queues"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReceptionistAppointmentsPage() {
  const {
    appointments,
    doctors,
    loading,
    error,
    initialized,
    initialize,
    assignAppointment,
    cancelAppointment,
  } = useAppointmentStore()

  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialize, initialized])

  const awaitingAssignment = useMemo(
    () => filterAppointmentsForQueue(appointments, "receptionist", "awaiting-doctor-assignment"),
    [appointments]
  )

  const alreadyAssigned = useMemo(
    () => appointments.filter((a) => a.status === "accepted"),
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
        <h1 className="text-2xl font-semibold">Doctor Assignments</h1>
        <p className="text-sm text-muted-foreground">
          Assign doctors to paid requests or review already scheduled appointments.
        </p>
      </div>

      <Tabs defaultValue="awaiting" className="w-full">
        <TabsList className="mb-4 w-full rounded-md">
          <TabsTrigger value="awaiting">
            Awaiting Assignment ({awaitingAssignment.length})
          </TabsTrigger>
          <TabsTrigger value="assigned">
            Already Assigned ({alreadyAssigned.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="awaiting" className="space-y-4">
          {awaitingAssignment.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No appointments are currently waiting for assignment.
              </p>
            </div>
          ) : (
            awaitingAssignment.map((appointment) => (
              <AssignAppointment
                key={appointment.id}
                appointment={appointment}
                doctors={doctors}
                onAssign={assignAppointment}
                onCancel={cancelAppointment}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {alreadyAssigned.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No appointments have been assigned yet.
              </p>
            </div>
          ) : (
            alreadyAssigned.map((appointment) => (
              <AssignAppointment
                key={appointment.id}
                appointment={appointment}
                doctors={doctors}
                onAssign={assignAppointment}
                onCancel={cancelAppointment}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
