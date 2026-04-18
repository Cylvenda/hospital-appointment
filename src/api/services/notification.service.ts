import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"
import type { Notification } from "@/store/notifications/notification.types"

export const notificationService = {
    async listNotifications(): Promise<ApiResponse<Notification[]>> {
        const response = await api.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
        const response = await api.patch<void>(
            `${API_ENDPOINTS.NOTIFICATIONS}${notificationId}/mark-read/`
        )
        return {
            status: response.status,
            data: response.data,
        }
    },

    async markAllAsRead(): Promise<ApiResponse<{ detail: string }>> {
        const response = await api.post<{ detail: string }>(
            API_ENDPOINTS.NOTIFICATIONS + "mark-all-read/"
        )
        return {
            status: response.status,
            data: response.data,
        }
    },
}
