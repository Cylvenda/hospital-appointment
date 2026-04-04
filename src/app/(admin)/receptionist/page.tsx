import { Button } from "@/components/ui/button"
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

const receptionists = [
  {
    name: "Janeth Paul",
    email: "janeth.paul@pams.com",
    phone: "+255 784 550 098",
    desk: "Front Desk A",
    shift: "07:30 - 15:30",
    handled: 34,
  },
  {
    name: "Kelvin Nyangasa",
    email: "kelvin.nyangasa@pams.com",
    phone: "+255 771 611 808",
    desk: "Front Desk B",
    shift: "08:00 - 16:00",
    handled: 29,
  },
]

const deskTasks = [
  "Confirm walk-in patients and issue queue numbers",
  "Update doctor room assignments before noon clinic begins",
  "Validate patient contact details before billing handoff",
  "Escalate missed appointments for follow-up messaging",
]

export default function ReceptionistPage() {
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
          <p className="mt-2 text-3xl font-semibold">84</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending Confirmations</p>
          <p className="mt-2 text-3xl font-semibold">17</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Walk-ins Today</p>
          <p className="mt-2 text-3xl font-semibold">11</p>
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
            <Button className="rounded-2xl">Assign Desk</Button>
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
                <p className="mt-2 text-2xl font-semibold">23</p>
              </div>
              <div className="rounded-3xl bg-muted/60 p-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Appointment01Icon} strokeWidth={1.8} className="size-4" />
                  Appointments Confirmed
                </p>
                <p className="mt-2 text-2xl font-semibold">58</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
