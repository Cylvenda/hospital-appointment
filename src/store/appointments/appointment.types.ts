export type AppointmentStatus = "pending" | "accepted" | "cancelled" | "completed"

export type Appointment = {
     id: string
     patient: string
     email: string
     fee: string
     illnessCategory: string
     preferredDate: string | null
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

export type IllnessCategory = {
     id: string
     name: string
     description: string | null
}


export type AppointmentApi = {
     uuid: string
     patient_name: string
     patient_email: string
     fee: string
     doctor_name: string | null
     doctor_uuid: string | null
     payment_status: "pending" | "failed" | "completed" | null
     illness_category: string
     illness_category_uuid: string
     description: string | null
     preferred_date: string | null
     appointment_date: string
     start_time: string | null
     end_time: string | null
     status: AppointmentStatus
     created_at: string
}

export type DoctorApi = {
     uuid: string
     name: string
     is_available: boolean
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
