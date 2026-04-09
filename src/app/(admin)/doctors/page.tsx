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
  Calendar01Icon,
  CallIcon,
  Doctor01Icon,
  FilterIcon,
  Mail01Icon,
  PlusSignIcon,
  Search01Icon,
  Watch01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "react-toastify"
import { useAdminStore } from "@/store/admin/admin.store"

const emptyDoctorForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  license_number: "",
}

function statusClasses(status: string) {
  if (status === "Available") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20"
  }

  if (status === "In Session") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20"
  }

  return "bg-muted text-muted-foreground ring-1 ring-border"
}

export default function DoctorsPage() {
  const { doctors: doctorDirectory, fetchDoctors, createDoctor } = useAdminStore()
  const [search, setSearch] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [form, setForm] = useState(emptyDoctorForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    void fetchDoctors()
  }, [fetchDoctors])

  const doctors = useMemo(
    () =>
      doctorDirectory
        .filter((doctor) =>
          [doctor.name, doctor.email, doctor.phone, doctor.categories.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
        .map((doctor) => ({
          id: doctor.uuid.slice(0, 8).toUpperCase(),
          name: doctor.name,
          specialty: doctor.categories[0] || "General",
          email: doctor.email,
          phone: doctor.phone,
          shift: doctor.is_available ? "Available today" : "Unavailable",
          nextClinic: "See schedule",
          status: doctor.is_available ? "Available" : "Off Duty",
        })),
    [doctorDirectory, search]
  )

  const isFormValid =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.password.trim() &&
    form.license_number.trim()

  async function handleCreateDoctor() {
    if (!isFormValid || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await createDoctor({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        license_number: form.license_number.trim(),
        is_available: true,
      })
      toast.success("Doctor added successfully.")
      setForm(emptyDoctorForm)
      setSheetOpen(false)
    } catch {
      toast.error("Failed to add doctor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Doctors</h1>
          <p className="text-sm text-muted-foreground">
            Manage specialist availability, schedules, and contact information.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-80">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={1.8}
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 rounded-2xl border-2 border-sidebar-border pl-11"
              placeholder="Search doctor or specialty..."
            />
          </div>
          <Button variant="outline" size="lg" className="rounded-2xl">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
            Filter
          </Button>
          <Button size="lg" className="rounded-2xl" onClick={() => setSheetOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.8} />
            Add Doctor
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Doctors</p>
          <p className="mt-2 text-3xl font-semibold">{doctors.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Available Now</p>
          <p className="mt-2 text-3xl font-semibold">
            {doctors.filter((doctor) => doctor.status === "Available").length}
          </p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">In Session</p>
          <p className="mt-2 text-3xl font-semibold">
            {doctors.filter((doctor) => doctor.status === "In Session").length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Doctor01Icon} strokeWidth={1.8} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  <p className="font-mono text-xs text-muted-foreground">{doctor.id}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses(doctor.status)}`}>
                {doctor.status}
              </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                {doctor.email}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
                {doctor.phone}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Watch01Icon} strokeWidth={1.8} className="size-4" />
                Shift {doctor.shift}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar01Icon} strokeWidth={1.8} className="size-4" />
                Next clinic {doctor.nextClinic}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="rounded-2xl">View Profile</Button>
              <Button variant="outline" className="rounded-2xl" disabled>
                Update Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>Add Doctor</SheetTitle>
            <SheetDescription>Create a doctor record in the database.</SheetDescription>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">License Number</label>
              <Input
                value={form.license_number}
                onChange={(event) =>
                  setForm((current) => ({ ...current, license_number: event.target.value }))
                }
              />
            </div>
          </div>

          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDoctor} disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Doctor"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
