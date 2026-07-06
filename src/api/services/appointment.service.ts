import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"
import type {
     AppointmentApi,
     DoctorApi,
     IllnessCategoryApi,
     PaymentResponse,
     AvailableAppointmentDay,
     AvailableAppointmentSlot,
} from "@/store/appointments/appointment.types"

type AssignAppointmentPayload = {
     doctorId: string
     startTime: string
     appointmentDate: string
     endTime: string
}

type CreateAppointmentPayload = {
     illnessCategoryId: string
     doctorId: string
     appointmentDate: string
     startTime: string
     description: string
}

export const appointmentService = {
     async listAppointments(queue?: string): Promise<ApiResponse<AppointmentApi[]>> {
          const response = await api.get<AppointmentApi[]>(API_ENDPOINTS.APPOINTMENTS, {
               params: queue ? { queue } : undefined,
          })
          return {
               status: response.status,
               data: response.data,
          }
     },

     async listAppointmentQueues(): Promise<ApiResponse<{ name: string; label: string; count: number }[]>> {
          const response = await api.get<{ name: string; label: string; count: number }[]>(
               `${API_ENDPOINTS.APPOINTMENTS}queues/`
          )
          return {
               status: response.status,
               data: response.data,
          }
     },

     async listDoctors(categoryUuid?: string): Promise<ApiResponse<DoctorApi[]>> {
          const response = await api.get<DoctorApi[]>(API_ENDPOINTS.APPOINTMENT_DOCTORS, {
               params: categoryUuid ? { category_uuid: categoryUuid } : undefined,
          })
          return {
               status: response.status,
               data: response.data,
          }
     },

     async listAvailableDays(
          doctorUuid: string
     ): Promise<ApiResponse<AvailableAppointmentDay[]>> {
          const response = await api.get<AvailableAppointmentDay[]>(
               `${API_ENDPOINTS.APPOINTMENTS}available-days/`,
               { params: { doctor_uuid: doctorUuid, days: 60 } }
          )
          return { status: response.status, data: response.data }
     },

     async listAvailableSlots(
          doctorUuid: string,
          date: string
     ): Promise<ApiResponse<AvailableAppointmentSlot[]>> {
          const response = await api.get<AvailableAppointmentSlot[]>(
               `${API_ENDPOINTS.APPOINTMENTS}available-slots/`,
               { params: { doctor_uuid: doctorUuid, date } }
          )
          return { status: response.status, data: response.data }
     },

     async listIllnessCategories(): Promise<ApiResponse<IllnessCategoryApi[]>> {
          const response = await api.get<IllnessCategoryApi[]>(API_ENDPOINTS.ILLNESS_CATEGORIES)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async createIllnessCategory(
          payload: { name: string; description: string }
     ): Promise<ApiResponse<IllnessCategoryApi>> {
          const response = await api.post<IllnessCategoryApi>(API_ENDPOINTS.ILLNESS_CATEGORIES, payload)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async updateIllnessCategory(
          uuid: string,
          payload: { name: string; description: string }
     ): Promise<ApiResponse<IllnessCategoryApi>> {
          const response = await api.patch<IllnessCategoryApi>(
               `${API_ENDPOINTS.ILLNESS_CATEGORIES}${uuid}/`,
               payload
          )
          return {
               status: response.status,
               data: response.data,
          }
     },

     async deleteIllnessCategory(uuid: string): Promise<ApiResponse<null>> {
          await api.delete(`${API_ENDPOINTS.ILLNESS_CATEGORIES}${uuid}/`)
          return {
               status: 204,
               data: null,
          }
     },

     async createAppointment(
          payload: CreateAppointmentPayload
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(API_ENDPOINTS.APPOINTMENTS, {
               illness_category_uuid: payload.illnessCategoryId,
               doctor_uuid: payload.doctorId,
               appointment_date: payload.appointmentDate,
               start_time: payload.startTime,
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
                    status: "confirmed",
               }
          )

          return {
               status: response.status,
               data: response.data,
          }
     },

     async cancelAppointment(
          appointmentId: string,
          reason?: string
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/cancel/`,
               reason ? { reason } : undefined
          )

          return {
               status: response.status,
               data: response.data,
          }
     },

     async checkInAppointment(
          appointmentId: string
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/check-in/`
          )
          return { status: response.status, data: response.data }
     },

     async markAppointmentPaid(
          appointmentId: string,
          paymentMethod: string
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/mark-paid/`,
               { payment_method: paymentMethod }
          )
          return { status: response.status, data: response.data }
     },

     async startConsultation(
          appointmentId: string
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/start-consultation/`
          )
          return { status: response.status, data: response.data }
     },

     async rescheduleAppointment(
          appointmentId: string,
          date: string,
          startTime: string
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/reschedule/`,
               { date, start_time: startTime }
          )
          return { status: response.status, data: response.data }
     },

     async callNextPatient(): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.post<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}call-next/`
          )
          return { status: response.status, data: response.data }
     },

     async updateAppointment(
          appointmentId: string,
          payload: { status?: string;[key: string]: unknown }
     ): Promise<ApiResponse<AppointmentApi>> {
          const response = await api.patch<AppointmentApi>(
               `${API_ENDPOINTS.APPOINTMENTS}${appointmentId}/`,
               payload
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
