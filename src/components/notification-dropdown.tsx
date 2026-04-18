"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bell } from "@hugeicons/core-free-icons"
import { useNotificationStore } from "@/store/notifications/notification.store"
import { Notification } from "@/store/notifications/notification.types"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { getNotificationsPath } from "@/lib/role-dashboard"
import Link from "next/link"

export function NotificationDropdown() {
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
        useNotificationStore()
    const role = useAuthUserStore((state) => state.user?.role)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open) {
            fetchNotifications()

            const interval = setInterval(() => {
                fetchNotifications()
            }, 10000) // Poll every 10 seconds when dropdown is open

            return () => clearInterval(interval)
        }
    }, [open, fetchNotifications])

    const getNotificationLink = (notification: Notification) => {
        const notificationsPath = getNotificationsPath(role)
        const params = new URLSearchParams({ notificationId: notification.uuid })
        return `${notificationsPath}?${params.toString()}`
    }

    const getNotificationTitle = (notification: Notification) => {
        return notification.title
    }

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

            if (diffInSeconds < 60) return "Just now"
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
            return date.toLocaleDateString()
        } catch {
            return "Just now"
        }
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button size="icon-lg" variant="outline" className="relative rounded-full">
                    <HugeiconsIcon icon={Bell} />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 ">
                <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                    <span className="font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault()
                                markAllAsRead()
                            }}
                            className="text-xs h-7 px-2"
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.uuid}
                                asChild
                                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                onClick={() => {
                                    if (!notification.is_read) {
                                        markAsRead(notification.uuid)
                                    }
                                }}
                            >
                                <Link href={getNotificationLink(notification)}>
                                    <div className="flex items-start gap-2 w-full">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm leading-none mb-1">
                                                {getNotificationTitle(notification)}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {formatTime(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        )}
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={getNotificationsPath(role)} className="w-full cursor-pointer">
                        <span className="w-full text-center text-sm">View all notifications</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
