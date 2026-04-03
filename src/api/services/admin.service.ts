import type { UserMeResponse } from "@/store/auth/auth.types"
import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import { ListResponse } from "../types";


export const AdminService = {

     // get all users
     async getAllUsers({ page, pageSize }: { page: number; pageSize: number }) {
          const response = await api.get<ListResponse<UserMeResponse>>(API_ENDPOINTS.USERS, {
               params: {
                    page,
                    page_size: pageSize,
               }
          })
          return {
               status: response.status,
               data: response.data
          }
     },

     async updateUser(id: string | number, data: Partial<UserMeResponse>) {
          const response = await api.patch<UserMeResponse>(`${API_ENDPOINTS.USERS}${id}/`, data)
          return {
               status: response.status,
               data: response.data,
          }
     },

}

