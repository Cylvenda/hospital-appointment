import { create } from "zustand"
import { AdminService } from "@/api/services/admin.service"
import type {
     AdminDoctor,
     AdminDoctorWritePayload,
     AdminOverview,
     AdminSettings,
     AdminUser,
     AdminUserWritePayload,
} from "./admin.types"

type AdminStore = {
     overview: AdminOverview | null
     users: AdminUser[]
     doctors: AdminDoctor[]
     settings: AdminSettings | null
     loading: boolean
     error: string | null
     fetchOverview: () => Promise<void>
     fetchUsers: (params?: { role?: string; search?: string }) => Promise<void>
     fetchDoctors: (params?: { search?: string }) => Promise<void>
     fetchSettings: () => Promise<void>
     createUser: (payload: AdminUserWritePayload) => Promise<AdminUser>
     updateUser: (uuid: string, payload: Partial<AdminUserWritePayload>) => Promise<AdminUser>
     deleteUser: (uuid: string) => Promise<void>
     createDoctor: (payload: AdminDoctorWritePayload) => Promise<AdminDoctor>
}

export const useAdminStore = create<AdminStore>((set) => ({
     overview: null,
     users: [],
     doctors: [],
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
}))
