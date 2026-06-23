"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bell } from "@hugeicons/core-free-icons"
import { useNotificationStore } from "@/store/notifications/notification.store"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { getNotificationsPath } from "@/lib/role-dashboard"
import { useTranslation } from "@/lib/i18n"

export function NotificationDropdown() {
    const { t } = useTranslation()
    const { unreadCount, fetchNotifications } = useNotificationStore()
    const role = useAuthUserStore((state) => state.user?.role)
    const notificationsPath = getNotificationsPath(role)

    useEffect(() => {
        void fetchNotifications()

        const interval = setInterval(() => {
            void fetchNotifications()
        }, 30000)

        return () => clearInterval(interval)
    }, [fetchNotifications])

    return (
        <Button asChild size="icon-lg" variant="outline" className="relative rounded-full">
            <Link href={notificationsPath} aria-label={t("nav.notificationsLabel")}>
                <HugeiconsIcon icon={Bell} />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                )}
            </Link>
        </Button>
    )
}
