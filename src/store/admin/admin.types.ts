export type AdminOverview = {
     total_users: number
     total_patients: number
     total_doctors: number
     total_receptionists: number
     active_users: number
     today_appointments: number
     pending_appointments: number
     approved_appointments: number
     cancelled_appointments: number
     unread_notifications: number
}

export type AdminUser = {
     uuid: string
     first_name: string
     last_name: string
     full_name: string
     email: string
     phone: string
     username: string
     role: string
     is_active: boolean
     is_staff: boolean
     is_admin: boolean
}

export type AdminDoctor = {
     uuid: string
     user_uuid: string
     name: string
     email: string
     phone: string
     license_number: string
     is_available: boolean
     categories: string[]
}

export type AdminIllnessCategory = {
     uuid: string
     name: string
     description: string | null
}

export type AdminSettings = {
     clinic_name: string
     support_email: string
     clinic_hours: string
     default_time_slot: string
     appointment_fee: string
     secure_sessions: boolean
     patient_confirmation_emails: boolean
}

export type AdminSettingsUpdatePayload = {
     appointment_fee: string
}

export type AdminUserWritePayload = {
     first_name: string
     last_name: string
     email: string
     phone: string
     password?: string
     role: string
     is_active: boolean
}

export type AdminDoctorWritePayload = {
     first_name: string
     last_name: string
     email: string
     phone: string
     password: string
     license_number: string
     is_available: boolean
     category_uuids?: string[]
}

export type AdminIllnessCategoryWritePayload = {
     name: string
     description?: string
}
