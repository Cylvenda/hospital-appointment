export type AppointmentStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "completed"
  | "expired"

export type AppointmentPaymentStatus = "pending" | "failed" | "completed" | null
export type AppointmentAudience = "patient" | "doctor" | "receptionist" | "admin" | "default"

export type AppointmentStatusMeta = {
  label: string
  summary: string
  tone: "amber" | "emerald" | "blue" | "rose" | "slate"
}

export const appointmentWorkflowSteps = [
  {
    title: "Request submitted",
    summary: "The patient creates an appointment and the system places it in the intake queue.",
  },
  {
    title: "Payment verified",
    summary: "Once payment is confirmed, the request becomes eligible for scheduling and handoff.",
  },
  {
    title: "Assigned to clinician",
    summary: "Reception or admin schedules the visit and places it in a clinical queue.",
  },
  {
    title: "Clinical outcome recorded",
    summary: "The doctor completes the visit, adds notes, and closes the clinical record.",
  },
] as const

export const doctorAppointmentWorkflowSteps = [
  {
    title: "Request submitted",
    summary: "The patient creates an appointment and the system places it in the intake queue.",
  },
  {
    title: "Request cleared",
    summary: "The request is ready for clinical review and can move into the doctor's queue.",
  },
  {
    title: "Assigned to clinician",
    summary: "Reception or admin schedules the visit and places it in a clinical queue.",
  },
  {
    title: "Clinical outcome recorded",
    summary: "The doctor completes the visit, adds notes, and closes the clinical record.",
  },
] as const

export function getAppointmentWorkflowSteps(audience: AppointmentAudience = "default") {
  return audience === "doctor" ? doctorAppointmentWorkflowSteps : appointmentWorkflowSteps
}

export function getAppointmentStatusMeta(
  status: AppointmentStatus,
  paymentStatus: AppointmentPaymentStatus = null,
  audience: AppointmentAudience = "default"
): AppointmentStatusMeta {
  if (status === "pending") {
    if (audience === "doctor") {
      return {
        label: "Pending review",
        summary: "This request is waiting to be assigned to a clinician.",
        tone: "slate",
      }
    }

    if (paymentStatus === "completed") {
      if (audience === "patient") {
        return {
          label: "Awaiting assignment",
          summary: "Your payment is confirmed and the care team is placing the request on the schedule.",
          tone: "blue",
        }
      }

      return {
        label: "Ready to assign",
        summary: "The appointment is paid and can now be scheduled into a work queue.",
        tone: "blue",
      }
    }

    if (audience === "receptionist" || audience === "admin") {
      return {
        label: "Awaiting payment",
        summary: "The patient has requested a visit but payment has not yet cleared.",
        tone: "amber",
      }
    }

    return {
      label: "Waiting for payment",
      summary: "The appointment request is still waiting for payment confirmation.",
      tone: "amber",
    }
  }

  if (status === "accepted") {
    if (audience === "doctor") {
      return {
        label: "Ready for review",
        summary: "This visit is assigned to you and ready for clinical assessment.",
        tone: "emerald",
      }
    }

    if (audience === "patient") {
      return {
        label: "Scheduled",
        summary: "A clinician has been assigned and the visit is on the calendar.",
        tone: "emerald",
      }
    }

    return {
      label: "Assigned",
      summary: "The visit has been scheduled with a doctor and is ready for the next step.",
      tone: "emerald",
    }
  }

  if (status === "completed") {
    return {
      label: "Completed",
      summary: "The appointment is finished and the clinical record is closed.",
      tone: "blue",
    }
  }

  if (status === "cancelled") {
    return {
      label: "Cancelled",
      summary: "The appointment was cancelled and removed from the active queue.",
      tone: "rose",
    }
  }

  if (status === "declined") {
    return {
      label: "Declined",
      summary: "The appointment was declined and needs a new booking if care is still needed.",
      tone: "rose",
    }
  }

  if (status === "expired") {
    return {
      label: "Expired",
      summary: "The appointment expired before it could be processed.",
      tone: "slate",
    }
  }

  return {
    label: status,
    summary: "Appointment status",
    tone: "slate",
  }
}
