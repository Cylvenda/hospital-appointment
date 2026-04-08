import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertCircleIcon,
  CalendarCheckIn01Icon,
  Clock03Icon,
  FileAddIcon,
  StethoscopeIcon,
  UserCheck01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const stats = [
  {
    title: "Today’s Appointments",
    value: "128",
    note: "Only today",
    icon: CalendarCheckIn01Icon,
  },
  {
    title: "Checked In",
    value: "84",
    note: "66% of scheduled patients",
    icon: UserCheck01Icon,
  },
  {
    title: "Doctors On Duty",
    value: "19",
    note: "3 specialists available today",
    icon: StethoscopeIcon,
  },
  {
    title: "Pending Confirmations",
    value: "17",
    note: "Needs receptionist follow-up",
    icon: AlertCircleIcon,
  },
]

const upcomingAppointments = [
  {
    time: "08:30 AM",
    patient: "Neema Hassan",
    doctor: "Dr. Mary Njoroge",
    type: "Cardiology Review",
    status: "Checked in",
    tone: "emerald",
  },
  {
    time: "09:00 AM",
    patient: "Daniel Mwangi",
    doctor: "Dr. Peter Wekesa",
    type: "MRI Follow-up",
    status: "Waiting",
    tone: "amber",
  },
  {
    time: "09:30 AM",
    patient: "Aisha Salim",
    doctor: "Dr. Anita Joseph",
    type: "Pediatric Consultation",
    status: "Confirmed",
    tone: "blue",
  },
  {
    time: "10:15 AM",
    patient: "John Mushi",
    doctor: "Dr. Victor Ouma",
    type: "Lab Result Review",
    status: "Needs file",
    tone: "rose",
  },
]

const doctorsOnDuty = [
  {
    name: "Dr. Mary Njoroge",
    specialty: "Cardiology",
    nextSlot: "11:20 AM",
    patients: 12,
  },
  {
    name: "Dr. Anita Joseph",
    specialty: "Pediatrics",
    nextSlot: "10:40 AM",
    patients: 9,
  },
  {
    name: "Dr. Victor Ouma",
    specialty: "General Medicine",
    nextSlot: "01:10 PM",
    patients: 15,
  },
]

const waitingPatients = [
  {
    name: "Grace Anthony",
    reason: "Ultrasound Review",
    wait: "12 min",
    priority: "Normal",
  },
  {
    name: "Emmanuel Jacob",
    reason: "Diabetes Follow-up",
    wait: "27 min",
    priority: "Priority",
  },
  {
    name: "Ruth Kileo",
    reason: "Vaccination",
    wait: "08 min",
    priority: "Normal",
  },
  {
    name: "Michael Otieno",
    reason: "Emergency Walk-in",
    wait: "03 min",
    priority: "Urgent",
  },
]

const recentActivity = [
  "Lab uploaded results for Daniel Mwangi.",
  "Reception approved 6 new bookings from the patient portal.",
  "Dr. Mary Njoroge marked Neema Hassan as ready for consultation.",
  "Billing sent payment reminders for 4 missed appointments.",
]

function toneClasses(tone: string) {
  if (tone === "emerald") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20"
  }

  if (tone === "amber") {
    return "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20"
  }

  if (tone === "rose") {
    return "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20"
  }

  return "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/20"
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr] ">
        <Card className="border-0 bg-primary py-5 text-white shadow-xl ring-0">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-6 md:p-8">
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center rounded-full bg-white/14 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 ring-1 ring-white/15">
                Patient Appointment System
              </span>
              <div className="space-y-2">
                <h1 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
                  Keep appointments moving smoothly from booking to consultation.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                  Monitor today’s Hospital flow, reduce waiting time, and help your
                  team respond quickly to urgent patients, missed confirmations,
                  and doctor availability.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <HugeiconsIcon icon={FileAddIcon} strokeWidth={1.8} />
                New appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/15 dark:border-white/20 dark:bg-white/10"
              >
                <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.8} />
                View patient queue
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader className="border-b">
            <CardTitle>Our Hospital Snapshot</CardTitle>
            <CardDescription>
              What needs attention before the next appointment block.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 py-6">
            <div className="rounded-3xl bg-muted/70 p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Working hours
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-semibold">24 HRS</span>
                <span className="pb-1 text-xs text-emerald-600 dark:text-emerald-400">
                  no down time
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Online Appointments</p>
                <p className="mt-2 text-2xl font-semibold">64</p>
              </div>
              <div className="rounded-3xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">Local Created</p>
                <p className="mt-2 text-2xl font-semibold">7 patients</p>
              </div>
            </div>
            <div className="rounded-3xl border border-dashed p-4">
              <p className="text-sm font-medium">Front desk note</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cardiology and lab desks are at peak load between 09:00 AM and
                11:30 AM. Redirect new same-day requests to General Medicine when
                possible.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          return (
            <Card key={item.title} size="sm" className="gap-0 py-0">
              <CardContent className="flex items-start justify-between p-5">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-3xl font-semibold tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary dark:bg-primary/15">
                  <HugeiconsIcon icon={item.icon} strokeWidth={1.8} className="size-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="py-5">
          <CardHeader className="border-b">
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Next patients expected at the hosptal today.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={`${appointment.time}-${appointment.patient}`}
                  className="flex flex-col gap-4 rounded-3xl border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-muted px-3 py-2 text-center">
                      <p className="text-xs font-medium text-muted-foreground">
                        Time
                      </p>
                      <p className="text-sm font-semibold">{appointment.time}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Assigned to {appointment.doctor}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${toneClasses(appointment.tone)}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader className="border-b">
            <CardTitle>Doctors On Duty</CardTitle>
            <CardDescription>
              Available specialists and their next open slots.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 py-4">
            {doctorsOnDuty.map((doctor) => (
              <div
                key={doctor.name}
                className="rounded-3xl border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialty}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/15">
                    {doctor.patients} patients
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Clock03Icon} strokeWidth={1.8} className="size-4" />
                  Next slot at {doctor.nextSlot}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="py-0">
          <CardHeader className="border-b">
            <CardTitle>Waiting Patients</CardTitle>
            <CardDescription>
              Front desk queue ordered by urgency and wait time.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 py-3 font-medium">Patient</th>
                    <th className="px-2 py-3 font-medium">Reason</th>
                    <th className="px-2 py-3 font-medium">Wait Time</th>
                    <th className="px-2 py-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {waitingPatients.map((patient) => (
                    <tr
                      key={patient.name}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-2 py-4 font-medium">{patient.name}</td>
                      <td className="px-2 py-4 text-muted-foreground">
                        {patient.reason}
                      </td>
                      <td className="px-2 py-4">{patient.wait}</td>
                      <td className="px-2 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                            patient.priority === "Urgent"
                              ? "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20"
                              : patient.priority === "Priority"
                                ? "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20"
                                : "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20"
                          }`}
                        >
                          {patient.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="border-b">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Live updates from booking, reception, and consultation desks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            {recentActivity.map((item, index) => (
              <div key={item} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 size-2.5 rounded-full bg-primary" />
                  {index !== recentActivity.length - 1 && (
                    <span className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <div className="space-y-1 pb-4">
                  <p className="text-sm font-medium">{item}</p>
                  <p className="text-xs text-muted-foreground">
                    {index + 1}0 minutes ago
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm font-medium">Suggested next action</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Confirm the 11:00 AM cardiology block now to avoid overlap with
                incoming lab follow-up appointments.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
