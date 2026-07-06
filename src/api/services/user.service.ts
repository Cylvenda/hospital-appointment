import type { AccountActivation, User, UserUpdatePayload } from "@/store/auth/auth.types"
import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"


export const userServices = {

     async getUserMe() {
          const response = await api.get<User>(API_ENDPOINTS.CURRENT_USER_PROFILE)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async updateUserMe(payload: UserUpdatePayload) {
          const response = await api.patch<User>(API_ENDPOINTS.CURRENT_USER_PROFILE, payload)
          return {
               status: response.status,
               data: response.data,
          }
     },

     async emailActivation(payload: string) {
          const response = await api.post(API_ENDPOINTS.USER_RESEND_ACTIVATION_EMAIL, { email: payload })
          return {
               status: response.status,
               data: response.data
          }
     },

     async accountActivation(payload: AccountActivation) {
          const response = await api.post(API_ENDPOINTS.USER_ACCOUNT_ACTIVATION, payload)
          return {
               status: response.status,
               data: response.data
          }
     },

     async exportMyReport(format: "pdf" | "docx") {
          return api.get(`/me/report/export/?format=${format}`, {
               responseType: 'blob'
          })
     },
}
