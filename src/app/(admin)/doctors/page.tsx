import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const doctors = [
  {
    id: "DOC-001",
    name: "Dr. Mary Njoroge",
    specialty: "Cardiology",
    email: "mary.njoroge@pams.com",
    phone: "+255 754 112 301",
    shift: "08:00 - 14:00",
    nextClinic: "21/05/2026",
    status: "Available",
  },
  {
    id: "DOC-002",
    name: "Dr. Anita Joseph",
    specialty: "Pediatrics",
    email: "anita.joseph@pams.com",
    phone: "+255 717 300 812",
    shift: "09:00 - 16:00",
    nextClinic: "21/05/2026",
    status: "In Session",
  },
  {
    id: "DOC-003",
    name: "Dr. Victor Ouma",
    specialty: "General Medicine",
    email: "victor.ouma@pams.com",
    phone: "+255 742 611 220",
    shift: "10:00 - 18:00",
    nextClinic: "22/05/2026",
    status: "Available",
  },
  {
    id: "DOC-004",
    name: "Dr. Rehema Ally",
    specialty: "Dermatology",
    email: "rehema.ally@pams.com",
    phone: "+255 763 890 110",
    shift: "07:30 - 13:30",
    nextClinic: "22/05/2026",
    status: "Off Duty",
  },
]

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
              className="h-11 rounded-2xl border-2 border-sidebar-border pl-11"
              placeholder="Search doctor or specialty..."
            />
          </div>
          <Button variant="outline" size="lg" className="rounded-2xl">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
            Filter
          </Button>
          <Button size="lg" className="rounded-2xl">
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
              <Button variant="outline" className="rounded-2xl">
                Update Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
