import { create } from "zustand"
import type { Notification } from "../notifications/notification.types"
import { notificationService } from "@/api/services/notification.service"

export type NotificationStore = {
    notifications: Notification[]
    loading: boolean
    error: string | null
    unreadCount: number

    fetchNotifications: () => Promise<void>
    addNotification: (notification: Notification) => void
    markAsRead: (id: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,

    fetchNotifications: async () => {
        set({ loading: true, error: null })
        try {
            const response = await notificationService.listNotifications()
            if (response.status === 200) {
                const notifications = response.data as Notification[]
                const unreadCount = notifications.filter((n) => !n.is_read).length
                set({ notifications, unreadCount, loading: false })
            }
        } catch (error) {
            set({ error: "Failed to fetch notifications", loading: false })
        }
    },

    addNotification: (notification) =>
        set((state) => {
            const newNotifications = [notification, ...state.notifications]
            const unreadCount = notification.is_read
                ? state.unreadCount
                : state.unreadCount + 1
            return { notifications: newNotifications, unreadCount }
        }),

    markAsRead: async (id) => {
        try {
            await notificationService.markAsRead(id)
            set((state) => {
                const notifications = state.notifications.map((n) =>
                    n.uuid === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
                )
                const unreadCount = Math.max(0, state.unreadCount - 1)
                return { notifications, unreadCount }
            })
        } catch (error) {
            console.error("Failed to mark notification as read:", error)
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead()
            set((state) => {
                const notifications = state.notifications.map((n) => ({
                    ...n,
                    is_read: true,
                    read_at: new Date().toISOString(),
                }))
                return { notifications, unreadCount: 0 }
            })
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error)
        }
    },

    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}))

