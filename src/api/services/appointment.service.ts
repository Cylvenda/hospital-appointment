import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"
import type {
     AppointmentApi,
     DoctorApi,
     IllnessCategoryApi,
} from "@/store/appointments/appointment.types"

type AssignAppointmentPayload = {
     doctorId: string
     startTime: string
     appointmentDate: string
     endTime: string
}

type CreateAppointmentPayload = {
     illnessCategoryId: string
     appointmentPreferredDate: string
     description: string
}

export const appointmentService = {
     async listAppointments(): Promise<ApiResponse<AppointmentApi[]>> {
          const response = await api.get<AppointmentApi[]>(API_ENDPOINTS.APPOINTMENTS)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async listDoctors(): Promise<ApiResponse<DoctorApi[]>> {
          const response = await api.get<DoctorApi[]>(API_ENDPOINTS.APPOINTMENT_DOCTORS)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async listIllnessCategories(): Promise<ApiResponse<IllnessCategoryApi[]>> {
          const response = await api.get<IllnessCategoryApi[]>(API_ENDPOINTS.ILLNESS_CATEGORIES)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async createAppointment(
          payload: CreateAppointmentPayload
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(API_ENDPOINTS.APPOINTMENTS, {
               illness_category_uuid: payload.illnessCategoryId,
               preferred_date: payload.appointmentPreferredDate,
               description: payload.description,
          })

          return {
               status: response.status,
               data: response.data,
          }
     },

     async assignAppointment(
          appointmentId: string,
          payload: AssignAppointmentPayload
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.patch<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/`,
               {
                    doctor_uuid: payload.doctorId,
                    appointment_date: payload.appointmentDate,
                    start_time: payload.startTime,
                    end_time: payload.endTime,
                    status: "accepted",
               }
          )

          return {
               status: response.status,
               data: response.data,
          }
     },

     async cancelAppointment(appointmentId: string): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.patch<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/`,
               {
                    status: "cancelled",
               }
          )

          return {
               status: response.status,
               data: response.data,
          }
     },

     async payingForAppointment(appointmentId: string, phone: string): Promise<ApiResponse<PaymentResponse>> {
          const response = await api.post<PaymentResponse>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/pay/`,
               {
                    phone: phone,
               }
          )

          return {
               status: response.status,
               data: response.data,
          }
     }
}
