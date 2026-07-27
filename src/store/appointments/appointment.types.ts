export type AppointmentStatus =
     | "pending"
     | "confirmed"
     | "checked_in"
     | "waiting_in_queue"
     | "in_consultation"
     | "waiting_for_laboratory"
     | "laboratory_in_progress"
     | "laboratory_results_ready"
     | "back_to_doctor"
     | "cancelled"
     | "no_show"
     | "rescheduled"
     | "completed"

export type Appointment = {
     id: string
     appointmentId: string | null
     patient: string
     email: string
     fee: string
     illnessCategory: string
     date: string
     startTime: string | null
     endTime: string | null
     doctor: string | null
     doctorId: string | null
     paymentStatus: "pending" | "success" | "failed" | "cancelled" | "expired" | null
     note: string
     diagnosis: string | null
     notes: string | null
     status: AppointmentStatus
     queueNumber: number | null
     checkedInAt: string | null
     createdAt: string
}

export type Doctor = {
     id: string
     name: string
}

export type IllnessCategory = {
     id: string
     name: string
     description: string | null
}


export type AppointmentApi = {
     uuid: string
     appointment_id: string | null
     patient_name: string
     patient_email: string
     fee: string
     doctor_name: string | null
     doctor_uuid: string | null
     payment_status: "pending" | "success" | "failed" | "cancelled" | "expired" | null
     illness_category: string
     illness_category_uuid: string
     description: string | null
     appointment_date: string
     start_time: string | null
     end_time: string | null
     status: AppointmentStatus
     diagnosis: string | null
     notes: string | null
     queue_number: number | null
     checked_in_at: string | null
     created_at: string
}

export type DoctorApi = {
     uuid: string
     name: string
     is_available: boolean
     consultation_duration: number
     max_appointments_per_day: number | null
     department_uuids: string[]
}

export type AvailableAppointmentDay = {
     date: string
     slot_count: number
}

export type AvailableAppointmentSlot = {
     start_time: string
     end_time: string
}

export type IllnessCategoryApi = {
     uuid: string
     name: string
     description: string | null
}

export type PaymentResponse = {
     message: string
     payment_uuid: string
}
