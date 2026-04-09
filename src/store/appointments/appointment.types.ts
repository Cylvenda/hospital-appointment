export type AppointmentStatus = "pending" | "approved" | "cancelled"

export type Appointment = {
     id: string
     patient: string
     email: string
     illnessCategory: string
     date: string
     startTime: string | null
     endTime: string | null
     doctor: string | null
     doctorId: string | null
     paymentStatus: "pending" | "failed" | "completed" | null
     note: string
     status: AppointmentStatus
}

export type Doctor = {
     id: string
     name: string
}

export type BackendAppointmentStatus =
     | "pending"
     | "accepted"
     | "declined"
     | "cancelled"
     | "expired"

export type AppointmentApi = {
     uuid: string
     patient_name: string
     patient_email: string
     doctor_name: string | null
     doctor_uuid: string | null
     payment_status: "pending" | "failed" | "completed" | null
     illness_category: string
     illness_category_uuid: string
     description: string | null
     appointment_date: string
     start_time: string | null
     end_time: string | null
     status: BackendAppointmentStatus
     created_at: string
}

export type DoctorApi = {
     uuid: string
     name: string
     is_available: boolean
}
