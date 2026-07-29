import axios from "axios"
import { API_ENDPOINTS } from "./endpoints"
import { toast } from "react-toastify"
import { getTranslationValue } from "@/lib/i18n"
import { useLanguageStore } from "@/store/language/language.store"

const api = axios.create({
     baseURL: API_ENDPOINTS.API_ROOT,
     headers: { "Content-Type": "application/json" },
     withCredentials: true,
})

let refreshRequest: Promise<unknown> | null = null

api.interceptors.response.use(
     (response) => response,
     async (error) => {
          const originalRequest = error.config as typeof error.config & { _retry?: boolean }
          const isUnauthorized = error.response?.status === 401
          const isRefreshCall = originalRequest?.url?.includes(API_ENDPOINTS.USER_TOKEN_REFRESH)

          if (isUnauthorized && !originalRequest?._retry && !isRefreshCall) {
               originalRequest._retry = true

               try {
                    if (!refreshRequest) {
                         refreshRequest = api
                              .post(API_ENDPOINTS.USER_TOKEN_REFRESH)
                              .finally(() => {
                                   refreshRequest = null
                              })
                    }
                    await refreshRequest
                    return api(originalRequest)
               } catch (refreshError) {
                    return Promise.reject(refreshError)
               }
          }

          // Handle incomplete profile backend blocks
          if (error.response?.status === 403 && error.response?.data?.profile_incomplete) {
               if (typeof window !== "undefined" && window.location.pathname !== "/patient-dashboard/profile") {
                    toast.warning(
                         getTranslationValue(
                              "profile.accessRestrictedIncomplete",
                              useLanguageStore.getState().language
                         )
                    )
                    window.location.href = "/patient-dashboard/profile"
               }
          }

          return Promise.reject(error)
     }
)

export default api
