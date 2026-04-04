import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getInitials } from "@/hooks/get-initials"
import {
  Calendar01Icon,
  Doctor01Icon,
  FilterIcon,
  PlusSignIcon,
  RightAngleIcon,
  Watch01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const appointments = [
  {
    id: 1,
    patient: "Brayan Mlawa",
    email: "brayanmlawa@gmail.com",
    specialty: "Heart Specialist",
    time: "20:30 - 21:30",
    date: "20/05/2026",
    note:
      "The booking process was very smooth and easy to follow. I was able to schedule my appointment within minutes, and the doctor was very professional and attentive.",
  },
  {
    id: 2,
    patient: "Amina Kassim",
    email: "aminakassim@gmail.com",
    specialty: "Dermatology",
    time: "09:00 - 09:45",
    date: "21/05/2026",
    note:
      "Patient requested an early review after treatment update. Front desk confirmed insurance and appointment reminder was sent successfully.",
  },
  {
    id: 3,
    patient: "Victor Mrema",
    email: "victormrema@gmail.com",
    specialty: "General Consultation",
    time: "11:15 - 12:00",
    date: "21/05/2026",
    note:
      "Follow-up visit for blood pressure monitoring. Reception marked the patient as priority because of repeat medication refill.",
  },
  {
    id: 4,
    patient: "Janeth Paul",
    email: "janethpaul@gmail.com",
    specialty: "Pediatrics",
    time: "13:00 - 13:30",
    date: "22/05/2026",
    note:
      "Mother requested a pediatric review with vaccination card verification. Clinical notes are attached to the patient file.",
  },
  {
    id: 5,
    patient: "Daniel Kimaro",
    email: "danielkimaro@gmail.com",
    specialty: "Orthopedics",
    time: "15:00 - 15:40",
    date: "22/05/2026",
    note:
      "Patient is returning for post-injury assessment. Imaging summary is available and the doctor requested updated pain notes.",
  },
]

function Page() {
  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between px-5 gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Appointment List</h1>
          <p className="text-sm text-muted-foreground">
            All appointments that have been created in the patient appointment
            system.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            className="h-11 rounded-2xl border-2 border-sidebar-border px-4"
            placeholder="search@something.com"
          />
          <Button variant="outline" size="lg" className="rounded-2xl">
            Filter
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
          </Button>
          <Button size="lg" >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.8} />
            Create Appointment
          </Button>
        </div>
      </div>

      <div className="space-y-3 py-2">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex flex-col justify-between gap-5 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm lg:flex-row lg:items-center"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                { getInitials(appointment.patient) }
              </div>

              <div className="space-y-2">
                <div>
                  <h2 className="font-semibold">{appointment.patient}</h2>
                  <p className="text-sm text-muted-foreground">
                    {appointment.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <p className="flex flex-row items-center gap-1.5">
                    <HugeiconsIcon icon={Doctor01Icon} size={15} strokeWidth={1.8} />
                    {appointment.specialty}
                  </p>
                  <p className="flex flex-row items-center gap-1.5">
                    <HugeiconsIcon icon={Watch01Icon} size={15} strokeWidth={1.8} />
                    {appointment.time}
                  </p>
                  <p className="flex flex-row items-center gap-1.5">
                    <HugeiconsIcon icon={Calendar01Icon} size={15} strokeWidth={1.8} />
                    {appointment.date}
                  </p>
                </div>

              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button className="">
                View Appointment
                <HugeiconsIcon icon={RightAngleIcon} strokeWidth={1.8} />
              </Button>
              <Button variant="outline" className="">
                View Doctor Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
