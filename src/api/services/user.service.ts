import type { AccountActivation, User } from "@/store/auth/auth.types"
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

     async updateUserMe(payload: Partial<User>) {
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

}
