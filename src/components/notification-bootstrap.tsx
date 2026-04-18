"use client"

import { useEffect } from "react"
import { useNotificationStore } from "@/store/notifications/notification.store"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

export function NotificationBootstrap() {
    const fetchNotifications = useNotificationStore((state) => state.fetchNotifications)
    const isAuthenticated = useAuthUserStore((state) => state.isAuthenticated)

    useEffect(() => {
        if (isAuthenticated) {
            void fetchNotifications()
        }
    }, [isAuthenticated, fetchNotifications])

    return null
}
