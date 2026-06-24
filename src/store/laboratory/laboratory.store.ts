import { create } from "zustand"
import type { AxiosError } from "axios"
import { laboratoryService } from "@/api/services/laboratory.service"
import type {
    LabRequest,
    LabRequestApi,
    LabRequestItem,
    LabRequestItemApi,
    LabResult,
    LabResultApi,
    LabTestType,
    LabTestTypeApi,
    LabRequestStatus,
} from "./laboratory.types"

type LaboratoryStore = {
    requests: LabRequest[]
    results: LabResult[]
    testTypes: LabTestType[]
    loading: boolean
    error: string | null
    initialized: boolean
    fetchRequests: () => Promise<void>
    fetchResults: () => Promise<void>
    fetchTestTypes: () => Promise<void>
    initialize: () => Promise<void>
    updateRequestStatus: (uuid: string, status: LabRequestStatus) => Promise<void>
    createResult: (payload: { request_item_uuid: string; result: string; remarks: string; }) => Promise<void>
    exportReport: (uuid: string, format: "pdf" | "docx") => Promise<void>
    createTestType: (payload: Partial<LabTestTypeApi>) => Promise<void>
    updateTestType: (uuid: string, payload: Partial<LabTestTypeApi>) => Promise<void>
    deleteTestType: (uuid: string) => Promise<void>
}

function mapLabTestType(apiType: LabTestTypeApi): LabTestType {
    return {
        id: apiType.uuid,
        name: apiType.name,
        description: apiType.description,
        isActive: apiType.is_active,
        createdAt: apiType.created_at,
        updatedAt: apiType.updated_at,
    }
}

function mapLabRequestItem(apiItem: LabRequestItemApi): LabRequestItem {
    return {
        id: apiItem.uuid,
        testTypeId: apiItem.test_type_uuid,
        testTypeName: apiItem.test_type_name,
        createdAt: apiItem.created_at,
        updatedAt: apiItem.updated_at,
    }
}

function mapLabRequest(apiReq: LabRequestApi): LabRequest {
    return {
        id: apiReq.uuid,
        appointmentId: apiReq.appointment_uuid,
        consultationId: apiReq.consultation_uuid,
        doctorId: apiReq.doctor_uuid,
        doctorName: apiReq.doctor_name,
        patientId: apiReq.patient_uuid,
        patientName: apiReq.patient_name,
        status: apiReq.status,
        requestedAt: apiReq.requested_at,
        updatedAt: apiReq.updated_at,
        items: apiReq.items ? apiReq.items.map(mapLabRequestItem) : [],
    }
}

function mapLabResult(apiRes: LabResultApi): LabResult {
    return {
        id: apiRes.uuid,
        requestItemId: apiRes.request_item_uuid,
        testName: apiRes.test_name,
        result: apiRes.result,
        remarks: apiRes.remarks,
        verifiedById: apiRes.verified_by_uuid,
        verifiedByName: apiRes.verified_by_name,
        verifiedAt: apiRes.verified_at,
        createdAt: apiRes.created_at,
        updatedAt: apiRes.updated_at,
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

export const useLaboratoryStore = create<LaboratoryStore>((set) => ({
    requests: [],
    results: [],
    testTypes: [],
    loading: false,
    error: null,
    initialized: false,

    fetchRequests: async () => {
        set({ loading: true, error: null })
        try {
            const response = await laboratoryService.listLabRequests()
            set({
                requests: response.data.map(mapLabRequest),
                loading: false,
            })
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to fetch lab requests"), loading: false })
        }
    },

    fetchResults: async () => {
        set({ loading: true, error: null })
        try {
            const response = await laboratoryService.listLabResults()
            set({
                results: response.data.map(mapLabResult),
                loading: false,
            })
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to fetch lab results"), loading: false })
        }
    },

    fetchTestTypes: async () => {
        set({ loading: true, error: null })
        try {
            const response = await laboratoryService.listLabTestTypes()
            set({
                testTypes: response.data.map(mapLabTestType),
                loading: false,
            })
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to fetch test types"), loading: false })
        }
    },

    initialize: async () => {
        set({ loading: true, error: null })
        try {
            const [reqRes, resultsRes, testTypesRes] = await Promise.all([
                laboratoryService.listLabRequests(),
                laboratoryService.listLabResults(),
                laboratoryService.listLabTestTypes()
            ])

            set({
                requests: reqRes.data.map(mapLabRequest),
                results: resultsRes.data.map(mapLabResult),
                testTypes: testTypesRes.data.map(mapLabTestType),
                loading: false,
                initialized: true,
            })
        } catch (error: unknown) {
            set({
                error: getApiErrorMessage(error, "Failed to initialize laboratory data"),
                loading: false,
                initialized: true,
            })
        }
    },

    updateRequestStatus: async (uuid, status) => {
        set({ loading: true, error: null })
        try {
            await laboratoryService.updateLabRequestStatus(uuid, status)
            await useLaboratoryStore.getState().fetchRequests()
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to update request status"), loading: false })
            throw error
        }
    },

    createResult: async (payload) => {
        set({ loading: true, error: null })
        try {
            await laboratoryService.createLabResult(payload)
            await useLaboratoryStore.getState().initialize()
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to create lab result"), loading: false })
            throw error
        }
    },

    exportReport: async (uuid, format) => {
        set({ loading: true, error: null })
        try {
            const response = await laboratoryService.exportLabReport(uuid, format)
            
            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { 
                type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `lab_report_${uuid}.${format}`)
            document.body.appendChild(link)
            link.click()
            
            // Cleanup
            link.parentNode?.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            set({ loading: false })
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to export report"), loading: false })
            throw error
        }
    },

    createTestType: async (payload) => {
        set({ loading: true, error: null })
        try {
            await laboratoryService.createLabTestType(payload)
            await useLaboratoryStore.getState().fetchTestTypes()
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to create test type"), loading: false })
            throw error
        }
    },

    updateTestType: async (uuid, payload) => {
        set({ loading: true, error: null })
        try {
            await laboratoryService.updateLabTestType(uuid, payload)
            await useLaboratoryStore.getState().fetchTestTypes()
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to update test type"), loading: false })
            throw error
        }
    },

    deleteTestType: async (uuid) => {
        set({ loading: true, error: null })
        try {
            await laboratoryService.deleteLabTestType(uuid)
            await useLaboratoryStore.getState().fetchTestTypes()
        } catch (error: unknown) {
            set({ error: getApiErrorMessage(error, "Failed to delete test type"), loading: false })
            throw error
        }
    },
}))
