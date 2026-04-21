import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"
import type {
     AdminDoctor,
     AdminIllnessCategory,
     AdminIllnessCategoryWritePayload,
     AdminDoctorWritePayload,
     AdminOverview,
     AdminSettings,
     AdminSettingsUpdatePayload,
     AdminUser,
     AdminUserWritePayload,
} from "@/store/admin/admin.types"

export const AdminService = {
     async getOverview(): Promise<ApiResponse<AdminOverview>> {
          const response = await api.get<AdminOverview>(API_ENDPOINTS.ADMIN_OVERVIEW)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async getUsers(params?: { role?: string; search?: string }): Promise<ApiResponse<AdminUser[]>> {
          const response = await api.get<AdminUser[]>(API_ENDPOINTS.ADMIN_USERS, {
               params,
          })
          return {
               status: response.status,
               data: response.data,
          }
     },

     async getDoctors(params?: { search?: string }): Promise<ApiResponse<AdminDoctor[]>> {
          const response = await api.get<AdminDoctor[]>(API_ENDPOINTS.ADMIN_DOCTORS, {
               params,
          })
          return {
               status: response.status,
               data: response.data,
          }
     },

     async getSettings(): Promise<ApiResponse<AdminSettings>> {
          const response = await api.get<AdminSettings>(API_ENDPOINTS.ADMIN_SETTINGS)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async updateSettings(payload: AdminSettingsUpdatePayload): Promise<ApiResponse<AdminSettings>> {
          const response = await api.patch<AdminSettings>(API_ENDPOINTS.ADMIN_SETTINGS, payload)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async createUser(payload: AdminUserWritePayload): Promise<ApiResponse<AdminUser>> {
          const response = await api.post<AdminUser>(API_ENDPOINTS.ADMIN_USERS, payload)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async updateUser(uuid: string, payload: Partial<AdminUserWritePayload>): Promise<ApiResponse<AdminUser>> {
          const response = await api.patch<AdminUser>(`${API_ENDPOINTS.ADMIN_USERS}${uuid}/`, payload)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async deleteUser(uuid: string): Promise<ApiResponse<null>> {
          const response = await api.delete(`${API_ENDPOINTS.ADMIN_USERS}${uuid}/`)
          return {
               status: response.status,
               data: null,
          }
     },

     async createDoctor(payload: AdminDoctorWritePayload): Promise<ApiResponse<AdminDoctor>> {
          const response = await api.post<AdminDoctor>(API_ENDPOINTS.ADMIN_DOCTORS, payload)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async getIllnessCategories(): Promise<ApiResponse<AdminIllnessCategory[]>> {
          const response = await api.get<AdminIllnessCategory[]>(API_ENDPOINTS.ILLNESS_CATEGORIES)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async createIllnessCategory(
          payload: AdminIllnessCategoryWritePayload
     ): Promise<ApiResponse<AdminIllnessCategory>> {
          const response = await api.post<AdminIllnessCategory>(API_ENDPOINTS.ILLNESS_CATEGORIES, payload)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async updateIllnessCategory(
          uuid: string,
          payload: AdminIllnessCategoryWritePayload
     ): Promise<ApiResponse<AdminIllnessCategory>> {
          const response = await api.patch<AdminIllnessCategory>(
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
}
