import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"

export type ConsultationApi = {
     uuid: string
     appointment_uuid: string
     doctor_uuid: string | null
     doctor_name: string | null
     patient_uuid: string | null
     patient_name: string | null
     chief_complaint: string
     history_of_present_illness: string
     physical_examination: string
     provisional_diagnosis: string
     status: "in_progress" | "completed"
     started_at: string
     completed_at: string | null
     created_at: string
     updated_at: string
}

export type DiagnosisApi = {
     uuid: string
     consultation_uuid: string
     consultation_appointment_uuid: string
     disease_name: string
     icd10_code: string
     description: string
     type: "provisional" | "final"
     diagnosed_at: string
     created_at: string
     updated_at: string
}

export type PrescriptionApi = {
     uuid: string
     consultation_uuid: string
     doctor_uuid: string | null
     doctor_name: string | null
     patient_uuid: string | null
     patient_name: string | null
     notes: string
     items: Array<{
          uuid: string
          medicine_name: string
          dosage: string
          frequency: string
          duration: string
          instructions: string
          created_at: string
          updated_at: string
     }>
     created_at: string
     updated_at: string
}

export type LabTestApi = {
     uuid: string
     name: string
     description: string
     created_at: string
     updated_at: string
}

export type LabRequestApi = {
     uuid: string
     consultation_uuid: string
     doctor_uuid: string | null
     doctor_name: string | null
     patient_uuid: string | null
     patient_name: string | null
     status: "pending" | "sample_collected" | "processing" | "completed"
     requested_at: string
     updated_at: string
     items: Array<{
          uuid: string
          test_type_uuid: string
          test_type_name: string
          created_at: string
          updated_at: string
     }>
}

export type InvoiceApi = {
     uuid: string
     invoice_number: string
     patient_uuid: string
     patient_name: string
     consultation_uuid: string | null
     total_amount: string
     status: "unpaid" | "partial" | "paid"
     issued_at: string
     paid_at: string | null
     created_at: string
     updated_at: string
     items: Array<{
          uuid: string
          item_type: "consultation" | "laboratory" | "medicine" | "procedure" | "other"
          description: string
          quantity: string
          unit_price: string
          amount: string
          created_at: string
          updated_at: string
     }>
}

export const clinicalService = {
     async listConsultations(): Promise<ApiResponse<ConsultationApi[]>> {
          const response = await api.get<ConsultationApi[]>(API_ENDPOINTS.CONSULTATIONS)
          return { status: response.status, data: response.data }
     },

     async createConsultation(payload: {
          appointment_uuid: string
          doctor_uuid?: string | null
          patient_uuid?: string | null
          chief_complaint?: string
          history_of_present_illness?: string
          physical_examination?: string
          provisional_diagnosis?: string
          status?: "in_progress" | "completed"
          completed_at?: string | null
     }): Promise<ApiResponse<ConsultationApi>> {
          const response = await api.post<ConsultationApi>(API_ENDPOINTS.CONSULTATIONS, payload)
          return { status: response.status, data: response.data }
     },

     async updateConsultation(
          uuid: string,
          payload: {
               appointment_uuid?: string
               doctor_uuid?: string | null
               patient_uuid?: string | null
               chief_complaint?: string
               history_of_present_illness?: string
               physical_examination?: string
               provisional_diagnosis?: string
               status?: "in_progress" | "completed"
               completed_at?: string | null
          }
     ): Promise<ApiResponse<ConsultationApi>> {
          const response = await api.patch<ConsultationApi>(`${API_ENDPOINTS.CONSULTATIONS}${uuid}/`, payload)
          return { status: response.status, data: response.data }
     },

     async startConsultation(uuid: string): Promise<ApiResponse<{ detail: string }>> {
          const response = await api.post<{ detail: string }>(`${API_ENDPOINTS.CONSULTATIONS}${uuid}/start/`)
          return { status: response.status, data: response.data }
     },

     async completeConsultation(uuid: string): Promise<ApiResponse<{ detail: string }>> {
          const response = await api.post<{ detail: string }>(`${API_ENDPOINTS.CONSULTATIONS}${uuid}/complete/`)
          return { status: response.status, data: response.data }
     },

     async addDiagnosis(
          consultationUuid: string,
          payload: { disease_name: string; icd10_code?: string; description?: string; type?: "provisional" | "final" }
     ): Promise<ApiResponse<{ detail: string; diagnosis_uuid: string }>> {
          const response = await api.post<{ detail: string; diagnosis_uuid: string }>(
               `${API_ENDPOINTS.CONSULTATIONS}${consultationUuid}/diagnoses/`,
               payload
          )
          return { status: response.status, data: response.data }
     },

     async createPrescription(
          consultationUuid: string,
          payload: {
               notes?: string
               items?: Array<{
                    medicine_name: string
                    dosage: string
                    frequency: string
                    duration: string
                    instructions?: string
               }>
          }
     ): Promise<ApiResponse<{ detail: string; prescription_uuid: string }>> {
          const response = await api.post<{ detail: string; prescription_uuid: string }>(
               `${API_ENDPOINTS.CONSULTATIONS}${consultationUuid}/prescriptions/`,
               payload
          )
          return { status: response.status, data: response.data }
     },

     async listLabTests(): Promise<ApiResponse<LabTestApi[]>> {
          const response = await api.get<LabTestApi[]>(API_ENDPOINTS.LAB_TESTS)
          return { status: response.status, data: response.data }
     },

     async createLabRequest(
          consultationUuid: string,
          payload: {
               status?: "pending" | "sample_collected" | "processing" | "completed"
               items: Array<{ test_type_uuid: string }>
          }
     ): Promise<ApiResponse<{ detail: string; lab_request_uuid: string }>> {
          const response = await api.post<{ detail: string; lab_request_uuid: string }>(
               `${API_ENDPOINTS.CONSULTATIONS}${consultationUuid}/lab-requests/`,
               payload
          )
          return { status: response.status, data: response.data }
     },

     async createInvoice(
          consultationUuid: string,
          payload: {
               status?: "unpaid" | "partial" | "paid"
               items?: Array<{
                    item_type: "consultation" | "laboratory" | "medicine" | "procedure" | "other"
                    description: string
                    quantity?: string | number
                    unit_price?: string | number
               }>
          }
     ): Promise<ApiResponse<{ detail: string; invoice_uuid: string }>> {
          const response = await api.post<{ detail: string; invoice_uuid: string }>(
               `${API_ENDPOINTS.CONSULTATIONS}${consultationUuid}/invoices/`,
               payload
          )
          return { status: response.status, data: response.data }
     },

     async listDiagnoses(): Promise<ApiResponse<DiagnosisApi[]>> {
          const response = await api.get<DiagnosisApi[]>(API_ENDPOINTS.DIAGNOSES)
          return { status: response.status, data: response.data }
     },

     async listPrescriptions(): Promise<ApiResponse<PrescriptionApi[]>> {
          const response = await api.get<PrescriptionApi[]>(API_ENDPOINTS.PRESCRIPTIONS)
          return { status: response.status, data: response.data }
     },

     async listLabRequests(): Promise<ApiResponse<LabRequestApi[]>> {
          const response = await api.get<LabRequestApi[]>(API_ENDPOINTS.LAB_REQUESTS)
          return { status: response.status, data: response.data }
     },

     async listInvoices(): Promise<ApiResponse<InvoiceApi[]>> {
          const response = await api.get<InvoiceApi[]>(API_ENDPOINTS.INVOICES)
          return { status: response.status, data: response.data }
     },
}
