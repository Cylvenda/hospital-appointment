import { create } from "zustand"
import { AdminService } from "@/api/services/admin.service"
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
} from "./admin.types"

type AdminStore = {
     overview: AdminOverview | null
     users: AdminUser[]
     doctors: AdminDoctor[]
     illnessCategories: AdminIllnessCategory[]
     settings: AdminSettings | null
     loading: boolean
     error: string | null
     fetchOverview: () => Promise<void>
     fetchUsers: (params?: { role?: string; search?: string }) => Promise<void>
     fetchDoctors: (params?: { search?: string }) => Promise<void>
     fetchIllnessCategories: () => Promise<void>
     fetchSettings: () => Promise<void>
     updateSettings: (payload: AdminSettingsUpdatePayload) => Promise<AdminSettings>
     createUser: (payload: AdminUserWritePayload) => Promise<AdminUser>
     updateUser: (uuid: string, payload: Partial<AdminUserWritePayload>) => Promise<AdminUser>
     deleteUser: (uuid: string) => Promise<void>
     createDoctor: (payload: AdminDoctorWritePayload) => Promise<AdminDoctor>
     createIllnessCategory: (
          payload: AdminIllnessCategoryWritePayload
     ) => Promise<AdminIllnessCategory>
     updateIllnessCategory: (
          uuid: string,
          payload: AdminIllnessCategoryWritePayload
     ) => Promise<AdminIllnessCategory>
     deleteIllnessCategory: (uuid: string) => Promise<void>
}

export const useAdminStore = create<AdminStore>((set) => ({
     overview: null,
     users: [],
     doctors: [],
     illnessCategories: [],
     settings: null,
     loading: false,
     error: null,

     fetchOverview: async () => {
          set({ loading: true, error: null })
          try {
               const response = await AdminService.getOverview()
               set({ overview: response.data, loading: false })
          } catch (error: unknown) {
               set({
                    loading: false,
                    error: error instanceof Error ? error.message : "Failed to load overview",
               })
          }
     },

     fetchUsers: async (params) => {
          set({ loading: true, error: null })
          try {
               const response = await AdminService.getUsers(params)
               set({ users: response.data, loading: false })
          } catch (error: unknown) {
               set({
                    loading: false,
                    error: error instanceof Error ? error.message : "Failed to load users",
               })
          }
     },

     fetchDoctors: async (params) => {
          set({ loading: true, error: null })
          try {
               const response = await AdminService.getDoctors(params)
               set({ doctors: response.data, loading: false })
          } catch (error: unknown) {
               set({
                    loading: false,
                    error: error instanceof Error ? error.message : "Failed to load doctors",
               })
          }
     },

     fetchIllnessCategories: async () => {
          set({ loading: true, error: null })
          try {
               const response = await AdminService.getIllnessCategories()
               set({ illnessCategories: response.data, loading: false })
          } catch (error: unknown) {
               set({
                    loading: false,
                    error:
                         error instanceof Error
                              ? error.message
                              : "Failed to load illness categories",
               })
          }
     },

     fetchSettings: async () => {
          set({ loading: true, error: null })
          try {
               const response = await AdminService.getSettings()
               set({ settings: response.data, loading: false })
          } catch (error: unknown) {
               set({
                    loading: false,
                   error: error instanceof Error ? error.message : "Failed to load settings",
               })
          }
     },

     updateSettings: async (payload) => {
          const response = await AdminService.updateSettings(payload)
          set({ settings: response.data })
          return response.data
     },

     createUser: async (payload) => {
          const response = await AdminService.createUser(payload)
          set((state) => ({ users: [response.data, ...state.users] }))
          return response.data
     },

     updateUser: async (uuid, payload) => {
          const response = await AdminService.updateUser(uuid, payload)
          set((state) => ({
               users: state.users.map((user) =>
                    user.uuid === uuid ? response.data : user
               ),
          }))
          return response.data
     },

     deleteUser: async (uuid) => {
          await AdminService.deleteUser(uuid)
          set((state) => ({
               users: state.users.filter((user) => user.uuid !== uuid),
          }))
     },

     createDoctor: async (payload) => {
          const response = await AdminService.createDoctor(payload)
          set((state) => ({ doctors: [response.data, ...state.doctors] }))
          return response.data
     },

     createIllnessCategory: async (payload) => {
          const response = await AdminService.createIllnessCategory(payload)
          set((state) => ({
               illnessCategories: [response.data, ...state.illnessCategories],
          }))
          return response.data
     },

     updateIllnessCategory: async (uuid, payload) => {
          const response = await AdminService.updateIllnessCategory(uuid, payload)
          set((state) => ({
               illnessCategories: state.illnessCategories.map((category) =>
                    category.uuid === uuid ? response.data : category
               ),
          }))
          return response.data
     },

     deleteIllnessCategory: async (uuid) => {
          await AdminService.deleteIllnessCategory(uuid)
          set((state) => ({
               illnessCategories: state.illnessCategories.filter(
                    (category) => category.uuid !== uuid
               ),
          }))
     },
}))
