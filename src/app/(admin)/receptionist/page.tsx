"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Appointment01Icon,
  CalendarCheckIn01Icon,
  CallIcon,
  CheckmarkCircle02Icon,
  Clock03Icon,
  Mail01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "react-toastify"
import { useAdminStore } from "@/store/admin/admin.store"
import { useAppointmentStore } from "@/store/appointments/appointment.store"

const deskTasks = [
  "Confirm walk-in patients and issue queue numbers",
  "Update doctor room assignments before noon clinic begins",
  "Validate patient contact details before billing handoff",
  "Escalate missed appointments for follow-up messaging",
]

const emptyReceptionistForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
}

export default function ReceptionistPage() {
  const { overview, users, fetchOverview, fetchUsers, createUser } = useAdminStore()
  const { appointments, initialize } = useAppointmentStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [form, setForm] = useState(emptyReceptionistForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    void fetchOverview()
    void fetchUsers({ role: "receptionist" })
    void initialize()
  }, [fetchOverview, fetchUsers, initialize])

  const receptionists = useMemo(
    () =>
      users.map((user, index) => ({
        name: user.full_name || user.email,
        email: user.email,
        phone: user.phone,
        desk: `Front Desk ${String.fromCharCode(65 + index)}`,
        shift: "Active shift",
        handled: appointments.filter((appointment) => appointment.status === "accepted").length,
      })),
    [appointments, users]
  )

  const isFormValid =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.password.trim()

  async function handleCreateReceptionist() {
    if (!isFormValid || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await createUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: "receptionist",
        is_active: true,
      })
      toast.success("Receptionist added successfully.")
      setForm(emptyReceptionistForm)
      setSheetOpen(false)
    } catch {
      toast.error("Failed to add receptionist.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">Receptionist Desk</h1>
        <p className="text-sm text-muted-foreground">
          Track front-desk workload, check-ins, and operational handoffs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Today’s Check-ins</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.approved_appointments ?? 0}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending Confirmations</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.pending_appointments ?? 0}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Walk-ins Today</p>
          <p className="mt-2 text-3xl font-semibold">{appointments.filter((appointment) => appointment.status === "pending").length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Open Desks</p>
          <p className="mt-2 text-3xl font-semibold">{receptionists.length}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Desk Team</h2>
              <p className="text-sm text-muted-foreground">
                Staff currently handling clinic intake.
              </p>
            </div>
            <Button className="rounded-2xl" onClick={() => setSheetOpen(true)}>Add Receptionist</Button>
          </div>

          <div className="mt-5 space-y-4">
            {receptionists.map((staff) => (
              <div
                key={staff.email}
                className="rounded-3xl border border-sidebar-border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{staff.name}</p>
                    <p className="text-sm text-muted-foreground">{staff.desk}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={1.8} className="size-3.5" />
                    Active
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                    {staff.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
                    {staff.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <HugeiconsIcon icon={Clock03Icon} strokeWidth={1.8} className="size-4" />
                    Shift {staff.shift}
                  </p>
                  <p className="flex items-center gap-2">
                    <HugeiconsIcon icon={Appointment01Icon} strokeWidth={1.8} className="size-4" />
                    {staff.handled} patients handled
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Today’s Desk Checklist</h2>
            <div className="mt-4 space-y-3">
              {deskTasks.map((task) => (
                <div key={task} className="flex items-start gap-3 rounded-3xl bg-muted/60 p-3">
                  <HugeiconsIcon icon={CalendarCheckIn01Icon} strokeWidth={1.8} className="mt-0.5 size-4 text-primary" />
                  <p className="text-sm text-muted-foreground">{task}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Queue Summary</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-3xl bg-muted/60 p-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.8} className="size-4" />
                  Waiting Patients
                </p>
                <p className="mt-2 text-2xl font-semibold">{appointments.filter((appointment) => appointment.status === "pending").length}</p>
              </div>
              <div className="rounded-3xl bg-muted/60 p-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Appointment01Icon} strokeWidth={1.8} className="size-4" />
                  Appointments Confirmed
                </p>
                <p className="mt-2 text-2xl font-semibold">{overview?.approved_appointments ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>Add Receptionist</SheetTitle>
            <SheetDescription>Create a receptionist account in the database.</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={form.first_name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, first_name: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={form.last_name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, last_name: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </div>
          </div>

          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateReceptionist}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Receptionist"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
