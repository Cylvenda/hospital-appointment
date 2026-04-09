import { create } from "zustand"
import type { AxiosError } from "axios"
import { appointmentService } from "@/api/services/appointment.service"
import type {
     Appointment,
     AppointmentApi,
     AppointmentStatus,
     Doctor,
     DoctorApi,
} from "./appointment.types"

type AssignPayload = {
     appointmentId: string
     doctorId: string
     startTime: string
     endTime: string
}

type AppointmentStore = {
     appointments: Appointment[]
     doctors: Doctor[]
     loading: boolean
     error: string | null
     initialized: boolean
     fetchAppointments: () => Promise<void>
     fetchDoctors: () => Promise<void>
     initialize: () => Promise<void>
     assignAppointment: (payload: AssignPayload) => Promise<void>
     cancelAppointment: (appointmentId: string) => Promise<void>
}

function mapBackendStatus(status: AppointmentApi["status"]): AppointmentStatus {
     if (status === "accepted") return "approved"
     if (status === "pending") return "pending"
     return "cancelled"
}

function mapAppointment(apiAppointment: AppointmentApi): Appointment {
     return {
          id: apiAppointment.uuid,
          patient: apiAppointment.patient_name,
          email: apiAppointment.patient_email,
          illnessCategory: apiAppointment.illness_category,
          date: apiAppointment.appointment_date,
          startTime: apiAppointment.start_time,
          endTime: apiAppointment.end_time,
          doctor: apiAppointment.doctor_name,
          doctorId: apiAppointment.doctor_uuid,
          paymentStatus: apiAppointment.payment_status,
          note: apiAppointment.description ?? "No appointment note provided.",
          status: mapBackendStatus(apiAppointment.status),
     }
}

function mapDoctor(apiDoctor: DoctorApi): Doctor {
     return {
          id: apiDoctor.uuid,
          name: apiDoctor.name,
     }
}

function getApiErrorMessage(error: unknown, fallback: string) {
     const axiosError = error as AxiosError<{ detail?: string; non_field_errors?: string[] }>
     const detail = axiosError.response?.data?.detail
     if (typeof detail === "string" && detail.trim()) {
          return detail
     }

     const nonFieldErrors = axiosError.response?.data?.non_field_errors
     if (Array.isArray(nonFieldErrors) && nonFieldErrors[0]) {
          return nonFieldErrors[0]
     }

     return error instanceof Error ? error.message : fallback
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
     appointments: [],
     doctors: [],
     loading: false,
     error: null,
     initialized: false,

     fetchAppointments: async () => {
          set({ loading: true, error: null })

          try {
               const response = await appointmentService.listAppointments()
               set({
                    appointments: response.data.map(mapAppointment),
                    loading: false,
               })
          } catch (error: unknown) {
               const message = getApiErrorMessage(error, "Failed to fetch appointments")
               set({ error: message, loading: false })
          }
     },

     fetchDoctors: async () => {
          try {
               const response = await appointmentService.listDoctors()
               set({
                    doctors: response.data.map(mapDoctor),
               })
          } catch (error: unknown) {
               const message = getApiErrorMessage(error, "Failed to fetch doctors")
               set({ error: message })
          }
     },

     initialize: async () => {
          set({ loading: true, error: null })

          try {
               const [appointmentsResponse, doctorsResponse] = await Promise.all([
                    appointmentService.listAppointments(),
                    appointmentService.listDoctors(),
               ])

               set({
                    appointments: appointmentsResponse.data.map(mapAppointment),
                    doctors: doctorsResponse.data.map(mapDoctor),
                    loading: false,
                    initialized: true,
               })
          } catch (error: unknown) {
               const message = getApiErrorMessage(
                    error,
                    "Failed to initialize appointments data"
               )
               set({
                    error: message,
                    loading: false,
                    initialized: true,
               })
          }
     },

     assignAppointment: async ({ appointmentId, doctorId, startTime, endTime }) => {
          try {
               const response = await appointmentService.assignAppointment(appointmentId, {
                    doctorId,
                    startTime,
                    endTime,
               })

               set((state) => ({
                    appointments: state.appointments.map((appointment) =>
                         appointment.id === appointmentId
                              ? mapAppointment(response.data)
                              : appointment
                    ),
               }))
          } catch (error: unknown) {
               const message = getApiErrorMessage(error, "Failed to assign appointment")
               set({ error: message })
               throw error
          }
     },

     cancelAppointment: async (appointmentId: string) => {
          try {
               const response = await appointmentService.cancelAppointment(appointmentId)

               set((state) => ({
                    appointments: state.appointments.map((appointment) =>
                         appointment.id === appointmentId
                              ? mapAppointment(response.data)
                              : appointment
                    ),
               }))
          } catch (error: unknown) {
               const message = getApiErrorMessage(error, "Failed to cancel appointment")
               set({ error: message })
               throw error
          }
     },
}))
