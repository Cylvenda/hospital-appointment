
export type Notification<T = unknown> = {
    uuid: string
    title: string
    message: string
    notification_type: string
    is_read: boolean
    read_at: string | null
    appointment_uuid: string | null
    triggered_by: {
        uuid: string
        email: string
        first_name: string
        last_name: string
    } | null
    created_at: string
}

export type NotificationType =
    | "appointment_booked"
    | "appointment_approved"
    | "appointment_rejected"
    | "appointment_rescheduled"
    | "appointment_cancelled"
    | "appointment_reminder"
    | "payment_success"
    | "general"

