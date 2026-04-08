import AssignAppointment from '@/components/customs/assign-appointment'

type AppointmentStatus = "pending" | "approved" | "cancelled"

type Appointment = {
  id: string
  patient: string
  email: string
  illnessCategory: string
  date: string
  time: string | null
  startTime: string | null
  endTime: string | null
  doctor: string | null
  note: string
  status: AppointmentStatus
}

const page = () => {
  const doctors = [
    {
      id: "doc-1",
      name: "Dr. Michael Johnson",
      specialization: "Cardiology",
    },
    {
      id: "doc-2",
      name: "Dr. Sarah Williams",
      specialization: "Orthopedics",
    },
    {
      id: "doc-3",
      name: "Dr. David Kim",
      specialization: "Dermatology",
    },
    {
      id: "doc-4",
      name: "Dr. Amina Hassan",
      specialization: "Gynecology",
    },
    {
      id: "doc-5",
      name: "Dr. James Mwangi",
      specialization: "Neurology",
    },
  ]

  const appointments: Appointment[] = [
    {
      id: "apt-1",
      patient: "John Doe",
      email: "john@example.com",
      illnessCategory: "Cardiology",
      date: "2026-04-10",
      time: null,
      startTime: null,
      endTime: null,
      doctor: null,
      note: "Chest pain and rdf tsgfdbfrgtsdr rstdgrstdf rtcegsrtd regewr thew thb trbs thrb htsbd thweg yhrb wrsdgne tgwe rd shortness of breath.",
      status: "cancelled",
    },
    {
      id: "apt-2",
      patient: "Jane Smith",
      email: "jane@example.com",
      illnessCategory: "Orthopedics",
      date: "2026-04-11",
      time: "01:30 PM",
      startTime: "13:30",
      endTime: "14:00",
      doctor: "Dr. Sarah Williams",
      note: "Knee injury after sports activity.",
      status: "approved",
    },
    {
      id: "apt-3",
      patient: "Ali Mohamed",
      email: "ali@gmail.com",
      illnessCategory: "Dermatology",
      date: "2026-04-12",
      time: null,
      startTime: null,
      endTime: null,
      doctor: null,
      note: "Skin rash and itching for a week.",
      status: "pending",
    },
    {
      id: "apt-4",
      patient: "Grace Wanjiku",
      email: "grace@gmail.com",
      illnessCategory: "Gynecology",
      date: "2026-04-13",
      time: "09:00 AM",
      startTime: "09:00",
      endTime: "09:30",
      doctor: "Dr. Amina Hassan",
      note: "Routine check-up.",
      status: "approved",
    },
    {
      id: "apt-5",
      patient: "Peter Otieno",
      email: "peter@gmail.com",
      illnessCategory: "Neurology",
      date: "2026-04-14",
      time: null,
      startTime: null,
      endTime: null,
      doctor: null,
      note: "Frequent headaches and dizziness.",
      status: "pending",
    },
    {
      id: "apt-6",
      patient: "Mary Njeri",
      email: "mary@gmail.com",
      illnessCategory: "Cardiology",
      date: "2026-04-15",
      time: "11:00 AM",
      startTime: "11:00",
      endTime: "11:30",
      doctor: "Dr. Michael Johnson",
      note: "Follow-up for blood pressure treatment.",
      status: "approved",
    },
    {
      id: "apt-7",
      patient: "David Ochieng",
      email: "david@gmail.com",
      illnessCategory: "Orthopedics",
      date: "2026-04-16",
      time: null,
      startTime: null,
      endTime: null,
      doctor: null,
      note: "Back pain after lifting heavy objects.",
      status: "pending",
    },
    {
      id: "apt-8",
      patient: "Fatima Said",
      email: "fatima@gmail.com",
      illnessCategory: "Dermatology",
      date: "2026-04-17",
      time: "03:00 PM",
      startTime: "15:00",
      endTime: "15:30",
      doctor: "Dr. David Kim",
      note: "Acne treatment consultation.",
      status: "approved",
    },
    {
      id: "apt-9",
      patient: "Hassan Suleiman",
      email: "hassan@gmail.com",
      illnessCategory: "Neurology",
      date: "2026-04-18",
      time: null,
      startTime: null,
      endTime: null,
      doctor: null,
      note: "Severe migraines.",
      status: "pending",
    },
    {
      id: "apt-10",
      patient: "Neema Joseph",
      email: "neema@gmail.com",
      illnessCategory: "Gynecology",
      date: "2026-04-19",
      time: null,
      startTime: null,
      endTime: null,
      doctor: null,
      note: "Menstrual irregularities.",
      status: "pending",
    },
  ]

  return (
    <div className="space-y-4 w-full">
      {appointments.map((appointment) => (
        <AssignAppointment
          key={appointment.id}
          appointment={appointment}
          doctors={doctors}
        />
      ))}
    </div>
  )
}

export default page
