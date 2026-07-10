import type { AccountActivation, User, UserUpdatePayload } from "@/store/auth/auth.types"
import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { AxiosError } from "axios"


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

     async exportMyReport(format: "pdf" | "docx", startDate?: string, endDate?: string) {
          const params: Record<string, string> = { format }
          if (startDate) params.start_date = startDate
          if (endDate) params.end_date = endDate
          
          try {
               return await api.get(`/me/report/export/`, {
                    params,
                    responseType: 'blob'
               })
          } catch (err: unknown) {
               const axiosError = err as AxiosError<Blob>
               const data = axiosError.response?.data
               
               if (data instanceof Blob) {
                    try {
                         const text = await data.text()
                         const json = JSON.parse(text)
                         if (json.detail) {
                              throw new Error(json.detail)
                         }
                    } catch {
                         if (err instanceof Error) throw err
                         throw new Error("Report export failed")
                    }
               }
               
               if (err instanceof Error) throw err
               throw new Error("Report export failed")
          }
     },
}
