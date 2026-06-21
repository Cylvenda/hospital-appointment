import type { Appointment } from "@/store/appointments/appointment.types"

export type AppointmentRole = "admin" | "receptionist" | "doctor" | "patient"

export type AppointmentQueue =
  | "all"
  | "pending"
  | "accepted"
  | "new"
  | "awaiting-payment"
  | "awaiting-doctor-assignment"
  | "today"
  | "checked-in"
  | "assigned"
  | "waiting-for-consultation"
  | "in-consultation"
  | "upcoming"
  | "completed"
  | "cancelled"
  | "payment-history"
  | "daily-schedule"

type QueueDefinition = {
  label: string
  summary: string
}

type RoleQueueMap = Record<AppointmentQueue, QueueDefinition>

const ROLE_QUEUE_DEFINITIONS: Record<AppointmentRole, Partial<RoleQueueMap>> = {
  admin: {
    all: {
      label: "All Appointments",
      summary: "The full appointment register across every workflow stage.",
    },
    pending: {
      label: "Pending Review",
      summary: "Requests that have not yet been assigned or completed.",
    },
    accepted: {
      label: "Accepted",
      summary: "Appointments that have been assigned to a clinician.",
    },
    "daily-schedule": {
      label: "Daily Schedule",
      summary: "Appointments scheduled for today across the hospital.",
    },
    completed: {
      label: "Completed",
      summary: "Appointments that have already been closed out.",
    },
    cancelled: {
      label: "Cancelled",
      summary: "Appointments that ended through cancellation or decline.",
    },
  },
  receptionist: {
    new: {
      label: "New Appointments",
      summary: "Fresh requests created today and waiting for initial handling.",
    },
    "awaiting-payment": {
      label: "Awaiting Payment",
      summary: "Requests that are still waiting for payment confirmation.",
    },
    "awaiting-doctor-assignment": {
      label: "Awaiting Doctor Assignment",
      summary: "Paid requests ready to be scheduled with a clinician.",
    },
    today: {
      label: "Today’s Schedule",
      summary: "Patients booked for today and ready for front-desk coordination.",
    },
    "checked-in": {
      label: "Checked-In Patients",
      summary: "Patients who have arrived and are moving through the visit flow.",
    },
    completed: {
      label: "Completed",
      summary: "Visits that have already been completed.",
    },
    cancelled: {
      label: "Cancelled",
      summary: "Requests removed from the active front-desk queue.",
    },
  },
  doctor: {
    assigned: {
      label: "Assigned Patients",
      summary: "Appointments allocated to a clinician and ready for review.",
    },
    "waiting-for-consultation": {
      label: "Waiting for Consultation",
      summary: "Assigned patients who are still waiting for their clinical slot.",
    },
    "in-consultation": {
      label: "In Consultation",
      summary: "Patients currently being seen or actively in the visit window.",
    },
    completed: {
      label: "Completed Consultations",
      summary: "Visits that have been assessed and closed.",
    },
  },
  patient: {
    upcoming: {
      label: "Upcoming",
      summary: "Your next scheduled visits and active requests.",
    },
    completed: {
      label: "Completed",
      summary: "Visits that have already been finished.",
    },
    cancelled: {
      label: "Cancelled",
      summary: "Requests that were cancelled or declined.",
    },
    "payment-history": {
      label: "Payment History",
      summary: "Requests with successful or failed payment activity.",
    },
  },
}

function isSameLocalDate(value: string | null | undefined, today = new Date()): boolean {
  if (!value) return false
  return value === today.toISOString().slice(0, 10)
}

function hasPaymentCompleted(appointment: Appointment): boolean {
  return appointment.paymentStatus === "completed"
}

export function hasAppointmentStatus(
  appointment: Appointment,
  ...statuses: Array<Appointment["status"]>
): boolean {
  return statuses.includes(appointment.status)
}

export function getAppointmentQueueForRole(
  appointment: Appointment,
  role: AppointmentRole
): AppointmentQueue {
  const today = new Date()

  if (appointment.status === "cancelled" || appointment.status === "declined") {
    return "cancelled"
  }

  if (appointment.status === "completed") {
    return "completed"
  }

  if (role === "patient") {
    if (appointment.paymentStatus && appointment.paymentStatus !== "pending") {
      return "payment-history"
    }

    return "upcoming"
  }

  if (role === "doctor") {
    if (appointment.status !== "accepted") {
      return "waiting-for-consultation"
    }

    if (isSameLocalDate(appointment.date, today) && appointment.startTime) {
      const currentTime = today.toTimeString().slice(0, 5)
      if (appointment.startTime <= currentTime) {
        return "in-consultation"
      }
      return "assigned"
    }

    if (appointment.date && !isSameLocalDate(appointment.date, today)) {
      return "waiting-for-consultation"
    }

    return "assigned"
  }

  if (role === "receptionist") {
    if (appointment.status === "pending" && !hasPaymentCompleted(appointment) && isSameLocalDate(appointment.createdAt?.slice(0, 10), today)) {
      return "new"
    }

    if (appointment.status === "pending" && !hasPaymentCompleted(appointment)) {
      return "awaiting-payment"
    }

    if (appointment.status === "pending" && hasPaymentCompleted(appointment)) {
      return "awaiting-doctor-assignment"
    }

    if (isSameLocalDate(appointment.date, today) && appointment.status === "accepted") {
      const currentTime = today.toTimeString().slice(0, 5)
      if (appointment.startTime && appointment.startTime <= currentTime) {
        return "checked-in"
      }
      return "today"
    }

    return "awaiting-doctor-assignment"
  }

  if (appointment.date && isSameLocalDate(appointment.date, today)) {
    return "daily-schedule"
  }

  return "all"
}

export function getAppointmentQueueLabel(role: AppointmentRole, queue: AppointmentQueue): string {
  return ROLE_QUEUE_DEFINITIONS[role]?.[queue]?.label ?? queue
}

export function getAppointmentQueueSummary(role: AppointmentRole, queue: AppointmentQueue): string {
  return ROLE_QUEUE_DEFINITIONS[role]?.[queue]?.summary ?? ""
}

export function getRoleQueueEntries(role: AppointmentRole): Array<{ queue: AppointmentQueue; label: string; summary: string }> {
  return Object.entries(ROLE_QUEUE_DEFINITIONS[role] ?? {}).map(([queue, meta]) => ({
    queue: queue as AppointmentQueue,
    label: meta.label,
    summary: meta.summary,
  }))
}

export function filterAppointmentsForQueue(
  appointments: Appointment[],
  role: AppointmentRole,
  queue: AppointmentQueue
): Appointment[] {
  return appointments.filter((appointment) => {
    const derivedQueue = getAppointmentQueueForRole(appointment, role)

    if (queue === "all") {
      return true
    }

    if (role === "receptionist") {
      if (queue === "today") {
        return derivedQueue === "today" || derivedQueue === "checked-in"
      }
      if (queue === "checked-in") {
        return derivedQueue === "checked-in"
      }
      return derivedQueue === queue
    }

    if (role === "doctor") {
      if (queue === "assigned") {
        return derivedQueue === "assigned" || derivedQueue === "in-consultation"
      }
      return derivedQueue === queue
    }

    if (role === "patient") {
      return derivedQueue === queue
    }

    if (role === "admin") {
      if (queue === "daily-schedule") {
        return derivedQueue === "daily-schedule"
      }

      if (queue === "pending") {
        return appointment.status === "pending"
      }

      if (queue === "accepted") {
        return appointment.status === "accepted"
      }

      return appointment.status === queue
    }

    if (queue === "pending") {
      return appointment.status === "pending"
    }

    if (queue === "accepted") {
      return appointment.status === "accepted"
    }

    return appointment.status === queue
  })
}
