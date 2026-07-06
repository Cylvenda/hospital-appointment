import type { AppointmentStatus } from "@/store/appointments/appointment.types"
import { getTranslationValue } from "@/lib/i18n"
import { useLanguageStore } from "@/store/language/language.store"

export type AppointmentPaymentStatus = "pending" | "failed" | "completed" | null
export type AppointmentAudience =
  | "patient"
  | "doctor"
  | "receptionist"
  | "admin"
  | "default"

export type AppointmentStatusMeta = {
  label: string
  summary: string
  tone: "amber" | "emerald" | "blue" | "rose" | "slate"
}

function translate(key: string, params?: Record<string, string | number>) {
  return getTranslationValue(key, useLanguageStore.getState().language, params)
}

export const appointmentWorkflowSteps = [
  {
    titleKey: "appointmentStatus.workflowStep1Title",
    summaryKey: "appointmentStatus.workflowStep1Summary",
  },
  {
    titleKey: "appointmentStatus.workflowStep2Title",
    summaryKey: "appointmentStatus.workflowStep2Summary",
  },
  {
    titleKey: "appointmentStatus.workflowStep3Title",
    summaryKey: "appointmentStatus.workflowStep3Summary",
  },
  {
    titleKey: "appointmentStatus.workflowStep4Title",
    summaryKey: "appointmentStatus.workflowStep4Summary",
  },
] as const

export const doctorAppointmentWorkflowSteps = appointmentWorkflowSteps

export function getAppointmentWorkflowSteps(
  audience: AppointmentAudience = "default"
) {
  void audience
  return appointmentWorkflowSteps.map((step) => ({
    title: translate(step.titleKey),
    summary: translate(step.summaryKey),
  }))
}

const STATUS_META: Record<AppointmentStatus, AppointmentStatusMeta> = {
  pending: {
    label: "appointmentStatus.pendingLabel",
    summary: "appointmentStatus.pendingSummary",
    tone: "amber",
  },
  confirmed: {
    label: "appointmentStatus.confirmedLabel",
    summary: "appointmentStatus.confirmedSummary",
    tone: "emerald",
  },
  checked_in: {
    label: "appointmentStatus.checkedInLabel",
    summary: "appointmentStatus.checkedInSummary",
    tone: "blue",
  },
  waiting_in_queue: {
    label: "appointmentStatus.waitingInQueueLabel",
    summary: "appointmentStatus.waitingInQueueSummary",
    tone: "amber",
  },
  in_consultation: {
    label: "appointmentStatus.inConsultationLabel",
    summary: "appointmentStatus.inConsultationSummary",
    tone: "blue",
  },
  waiting_for_laboratory: {
    label: "appointmentStatus.waitingForLaboratoryLabel",
    summary: "appointmentStatus.waitingForLaboratorySummary",
    tone: "amber",
  },
  laboratory_in_progress: {
    label: "appointmentStatus.laboratoryInProgressLabel",
    summary: "appointmentStatus.laboratoryInProgressSummary",
    tone: "blue",
  },
  laboratory_results_ready: {
    label: "appointmentStatus.resultsReadyLabel",
    summary: "appointmentStatus.resultsReadySummary",
    tone: "emerald",
  },
  back_to_doctor: {
    label: "appointmentStatus.backToDoctorLabel",
    summary: "appointmentStatus.backToDoctorSummary",
    tone: "emerald",
  },
  completed: {
    label: "appointmentStatus.completedLabel",
    summary: "appointmentStatus.completedSummary",
    tone: "blue",
  },
  cancelled: {
    label: "appointmentStatus.cancelledLabel",
    summary: "appointmentStatus.cancelledSummary",
    tone: "rose",
  },
  no_show: {
    label: "appointmentStatus.noShowLabel",
    summary: "appointmentStatus.noShowSummary",
    tone: "slate",
  },
  rescheduled: {
    label: "appointmentStatus.rescheduledLabel",
    summary: "appointmentStatus.rescheduledSummary",
    tone: "slate",
  },
}

export function getAppointmentStatusMeta(
  status: AppointmentStatus,
  paymentStatus: AppointmentPaymentStatus = null,
  audience: AppointmentAudience = "default"
): AppointmentStatusMeta {
  if (status === "pending" && paymentStatus === "completed") {
    return {
      label: translate("appointmentStatus.confirmingBookingLabel"),
      summary: translate(
        audience === "patient"
          ? "appointmentStatus.confirmingBookingPatientSummary"
          : "appointmentStatus.confirmingBookingStaffSummary"
      ),
      tone: "blue",
    }
  }
  return {
    label: translate(STATUS_META[status].label),
    summary: translate(STATUS_META[status].summary),
    tone: STATUS_META[status].tone,
  }
}
