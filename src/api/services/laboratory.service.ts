import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"
import type {
    LabRequestApi,
    LabResultApi,
    LabTestTypeApi,
    LabRequestStatus,
} from "@/store/laboratory/laboratory.types"

export const laboratoryService = {
    async listLabRequests(): Promise<ApiResponse<LabRequestApi[]>> {
        const response = await api.get<LabRequestApi[]>(API_ENDPOINTS.LAB_REQUESTS)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async listLabTestTypes(): Promise<ApiResponse<LabTestTypeApi[]>> {
        const response = await api.get<LabTestTypeApi[]>(API_ENDPOINTS.LAB_TESTS)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async createLabTestType(payload: Partial<LabTestTypeApi>): Promise<ApiResponse<LabTestTypeApi>> {
        const response = await api.post<LabTestTypeApi>(API_ENDPOINTS.LAB_TESTS, payload)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async updateLabTestType(uuid: string, payload: Partial<LabTestTypeApi>): Promise<ApiResponse<LabTestTypeApi>> {
        const response = await api.patch<LabTestTypeApi>(`${API_ENDPOINTS.LAB_TESTS}${uuid}/`, payload)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async deleteLabTestType(uuid: string): Promise<ApiResponse<void>> {
        const response = await api.delete(`${API_ENDPOINTS.LAB_TESTS}${uuid}/`)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async listLabResults(): Promise<ApiResponse<LabResultApi[]>> {
        const response = await api.get<LabResultApi[]>(API_ENDPOINTS.LAB_RESULTS)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async updateLabRequestStatus(
        uuid: string,
        status: LabRequestStatus
    ): Promise<ApiResponse<LabRequestApi>> {
        const response = await api.patch<LabRequestApi>(
            `${API_ENDPOINTS.LAB_REQUESTS}${uuid}/`,
            { status }
        )
        return {
            status: response.status,
            data: response.data,
        }
    },

    async createLabResult(payload: {
        request_item_uuid: string;
        result: string;
        remarks: string;
    }): Promise<ApiResponse<LabResultApi>> {
        const response = await api.post<LabResultApi>(API_ENDPOINTS.LAB_RESULTS, payload)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async exportLabReport(uuid: string, format: "pdf" | "docx") {
        return api.get(`${API_ENDPOINTS.LAB_REQUESTS}${uuid}/export/?format=${format}`, {
            responseType: 'blob'
        })
    }
}
