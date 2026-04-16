import { create } from "zustand"
import type { AxiosError } from "axios"
import { appointmentService } from "@/api/services/appointment.service"


import type {
     Appointment,
     AppointmentApi,
     Doctor,
     DoctorApi,
     IllnessCategory,
     IllnessCategoryApi,
} from "./appointment.types"
import { useAuthUserStore } from "../auth/userAuth.store"

type AssignPayload = {
     appointmentId: string
     doctorId: string
     appointmentDate: string
     startTime: string
     endTime: string
}

type AppointmentStore = {
     appointments: Appointment[]
     doctors: Doctor[]
     illnessCategories: IllnessCategory[]
     loading: boolean
     error: string | null
     initialized: boolean
     fetchAppointments: () => Promise<void>
     fetchDoctors: () => Promise<void>
     fetchIllnessCategories: () => Promise<void>
     initialize: () => Promise<void>
     createAppointment: (payload: {
          illnessCategoryId: string
          appointmentPreferredDate: string
          description: string
     }) => Promise<void>
     assignAppointment: (payload: AssignPayload) => Promise<void>
     cancelAppointment: (appointmentId: string) => Promise<void>
     PayingAppointment: (appointmentId: string, phone: string) => Promise<void>
}


function mapAppointment(apiAppointment: AppointmentApi): Appointment {
     return {
          id: apiAppointment.uuid,
          patient: apiAppointment.patient_name,
          email: apiAppointment.patient_email,
          fee: apiAppointment.fee,
          illnessCategory: apiAppointment.illness_category,
          date: apiAppointment.appointment_date,
          preferredDate: apiAppointment.preferred_date,
          startTime: apiAppointment.start_time,
          endTime: apiAppointment.end_time,
          doctor: apiAppointment.doctor_name,
          doctorId: apiAppointment.doctor_uuid,
          paymentStatus: apiAppointment.payment_status,
          note: apiAppointment.description ?? "No appointment note provided.",
          status: apiAppointment.status
     }
}

function mapDoctor(apiDoctor: DoctorApi): Doctor {
     return {
          id: apiDoctor.uuid,
          name: apiDoctor.name,
     }
}

function mapIllnessCategory(apiCategory: IllnessCategoryApi): IllnessCategory {
     return {
          id: apiCategory.uuid,
          name: apiCategory.name,
          description: apiCategory.description,
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
     illnessCategories: [],
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

     fetchIllnessCategories: async () => {
          try {
               const response = await appointmentService.listIllnessCategories()
               set({
                    illnessCategories: response.data.map(mapIllnessCategory),
               })
          } catch (error: unknown) {
               const message = getApiErrorMessage(
                    error,
                    "Failed to fetch illness categories"
               )
               set({ error: message })
          }
     },

     initialize: async () => {
          set({ loading: true, error: null })

          try {
               // get role directly from auth store
               const { user } = useAuthUserStore.getState()
               const role = user?.role

               const appointmentsResponse = await appointmentService.listAppointments()

               // only admin/receptionist fetch doctors 
               if (role === "admin" || role === "receptionist") {
                    const doctorsResponse = await appointmentService.listDoctors()
                    set({ doctors: doctorsResponse.data.map(mapDoctor) })
               } else {
                    set({ doctors: [] })
               }

               set({
                    appointments: appointmentsResponse.data.map(mapAppointment),
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

     createAppointment: async ({ illnessCategoryId, appointmentPreferredDate, description }) => {
          try {
               const response = await appointmentService.createAppointment({
                    illnessCategoryId,
                    appointmentPreferredDate,
                    description,
               })
               const appointment = mapAppointment(response.data)

               set((state) => ({
                    appointments: [appointment, ...state.appointments],
               }))
               
               await useAppointmentStore.getState().initialize()

          } catch (error: unknown) {
               const message = getApiErrorMessage(error, "Failed to create appointment")
               set({ error: message })
               throw error
          }
     },

     assignAppointment: async ({ appointmentId, appointmentDate, doctorId, startTime, endTime }) => {
          try {
               const response = await appointmentService.assignAppointment(appointmentId, {
                    doctorId,
                    startTime,
                    appointmentDate,
                    endTime,
               })

               set((state) => ({
                    appointments: state.appointments.map((appointment) =>
                         appointment.id === appointmentId
                              ? mapAppointment(response.data)
                              : appointment
                    ),
               }))

               await useAppointmentStore.getState().initialize()

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

               await useAppointmentStore.getState().initialize()

          } catch (error: unknown) {
               const message = getApiErrorMessage(error, "Failed to cancel appointment")
               set({ error: message })
               throw error
          }
     },

     PayingAppointment: async (appointmentId, phone) => {
          try {
               set({ loading: true, error: null })

               const response = await appointmentService.payingForAppointment(appointmentId, phone)

               // ✅ handle success
               if (response.status === 200 || response.status === 201) {
                    // refresh data
                    await useAppointmentStore.getState().initialize()

               }

          } catch (error: unknown) {
               const message = getApiErrorMessage(error, "Payment Failed for this appointment")
               set({ error: message })
               throw error
          } finally {
               set({ loading: false })
          }
     },
}))
