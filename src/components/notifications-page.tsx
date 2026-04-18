"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
     Bell,
     BuildingIcon,
     Calendar,
     CheckCircle,
     Circle,
     Eye,
     EyeOff,
     User,
} from "@hugeicons/core-free-icons"
import { RoleAccessGuard } from "@/components/role-access-guard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useNotificationStore } from "@/store/notifications/notification.store"
import type { Notification } from "@/store/notifications/notification.types"
import { getAppointmentsPath } from "@/lib/role-dashboard"

const allowedRoles = ["admin", "doctor", "receptionist", "patient"]

const notificationColors: Record<string, string> = {
     appointment_booked: "bg-blue-500",
     appointment_approved: "bg-green-500",
     appointment_rejected: "bg-red-500",
     appointment_rescheduled: "bg-orange-500",
     appointment_cancelled: "bg-gray-500",
     appointment_reminder: "bg-yellow-500",
     payment_success: "bg-emerald-500",
     general: "bg-purple-500",
}

function getNotificationTypeLabel(type: string) {
     return type.replace("_", " ").toUpperCase()
}

function getNotificationColor(type: string) {
     return notificationColors[type] || "bg-gray-500"
}

function formatTimeAgo(dateString: string) {
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

export function NotificationsPage() {
     const searchParams = useSearchParams()
     const { notifications, markAsRead, markAllAsRead, fetchNotifications } =
          useNotificationStore()
     const role = useAuthUserStore((state) => state.user?.role)
     const [selectedNotification, setSelectedNotification] =
          useState<Notification | null>(null)

     useEffect(() => {
          void fetchNotifications()
     }, [fetchNotifications])

     useEffect(() => {
          const interval = setInterval(() => {
               void fetchNotifications()
          }, 30000)

          return () => clearInterval(interval)
     }, [fetchNotifications])

     useEffect(() => {
          const notificationId = searchParams.get("notificationId")

          if (notificationId) {
               const matchingNotification = notifications.find(
                    (notification) => notification.uuid === notificationId
               )

               if (matchingNotification) {
                    setSelectedNotification(matchingNotification)
                    return
               }
          }

          if (selectedNotification) {
               const updatedSelection = notifications.find(
                    (notification) => notification.uuid === selectedNotification.uuid
               )

               setSelectedNotification(updatedSelection ?? null)
               return
          }

          setSelectedNotification(notifications[0] ?? null)
     }, [notifications, searchParams, selectedNotification])

     const unreadCount = useMemo(
          () => notifications.filter((notification) => !notification.is_read).length,
          [notifications]
     )

     const handleNotificationClick = (notification: Notification) => {
          setSelectedNotification(notification)

          if (!notification.is_read) {
               void markAsRead(notification.uuid)
          }
     }

     return (
          <RoleAccessGuard allowedRoles={allowedRoles}>
               <div className="w-full px-0 sm:px-1">
                    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 sm:gap-6">
                         <div className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                              <div className="space-y-1">
                                   <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        Notifications
                                   </h1>
                                   <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                        Stay updated with appointments, payment activity, and
                                        system alerts in a layout that fits comfortably on every
                                        screen.
                                   </p>
                              </div>

                              {unreadCount > 0 && (
                                   <Button
                                        onClick={() => void markAllAsRead()}
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                   >
                                        <HugeiconsIcon icon={CheckCircle} className="mr-2 h-4 w-4" />
                                        Mark all as read ({unreadCount})
                                   </Button>
                              )}
                         </div>

                         <div className="grid w-full gap-4 xl:grid-cols-12 xl:gap-6">
                              <Card className="overflow-hidden xl:col-span-5">
                                   <CardHeader className="space-y-1 border-b bg-muted/20 px-4 py-4 sm:px-6">
                                        <CardTitle>All Notifications</CardTitle>
                                        <CardDescription>
                                             {notifications.length} total, {unreadCount} unread
                                        </CardDescription>
                                   </CardHeader>

                                   <CardContent className="p-0">
                                        <ScrollArea className="h-[50vh] sm:h-[58vh] xl:h-[68vh]">
                                             {notifications.length === 0 ? (
                                                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 text-center text-muted-foreground">
                                                       <HugeiconsIcon icon={Bell} className="mb-3 h-12 w-12 opacity-50" />
                                                       <p className="text-base font-medium">
                                                            No notifications yet
                                                       </p>
                                                       <p className="mt-1 text-sm">
                                                            New activity will show up here as soon as it
                                                            happens.
                                                       </p>
                                                  </div>
                                             ) : (
                                                  notifications.map((notification, index) => {
                                                       const isSelected =
                                                            selectedNotification?.uuid ===
                                                            notification.uuid

                                                       return (
                                                            <div key={notification.uuid}>
                                                                 <button
                                                                      type="button"
                                                                      className={`flex w-full items-start gap-3 px-4 py-4 text-left transition-colors sm:px-5 ${isSelected ? "bg-primary/8" : ""} ${!notification.is_read ? "bg-muted/30" : ""} hover:bg-muted/50`}
                                                                      onClick={() =>
                                                                           handleNotificationClick(notification)
                                                                      }
                                                                 >
                                                                      <div className="mt-1 shrink-0">
                                                                           <div
                                                                                className={`h-3 w-3 rounded-full ${notification.is_read ? "bg-gray-300" : getNotificationColor(notification.notification_type)}`}
                                                                           />
                                                                      </div>

                                                                      <div className="min-w-0 flex-1 space-y-2">
                                                                           <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                                <p className="pr-2 text-sm font-semibold leading-5 sm:text-base">
                                                                                     {notification.title}
                                                                                </p>
                                                                                <Badge
                                                                                     variant="secondary"
                                                                                     className="w-fit shrink-0 text-[10px] sm:text-xs"
                                                                                >
                                                                                     {getNotificationTypeLabel(
                                                                                          notification.notification_type
                                                                                     )}
                                                                                </Badge>
                                                                           </div>

                                                                           <p className="line-clamp-2 text-sm text-muted-foreground">
                                                                                {notification.message}
                                                                           </p>

                                                                           <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                                <HugeiconsIcon
                                                                                     icon={Calendar}
                                                                                     className="h-3 w-3"
                                                                                />
                                                                                {formatTimeAgo(
                                                                                     notification.created_at
                                                                                )}
                                                                           </span>
                                                                      </div>
                                                                 </button>

                                                                 {index < notifications.length - 1 && (
                                                                      <Separator />
                                                                 )}
                                                            </div>
                                                       )
                                                  })
                                             )}
                                        </ScrollArea>
                                   </CardContent>
                              </Card>

                              <Card className="overflow-hidden xl:col-span-7 xl:sticky xl:top-24 xl:self-start">
                                   <CardHeader className="space-y-1 border-b bg-muted/20 px-4 py-4 sm:px-6">
                                        <CardTitle>Notification Details</CardTitle>
                                        <CardDescription>
                                             {selectedNotification
                                                  ? "Review the full message and any related action."
                                                  : "Choose a notification from the list to view it here."}
                                        </CardDescription>
                                   </CardHeader>

                                   <CardContent className="p-4 sm:p-6">
                                        {selectedNotification ? (
                                             <div className="space-y-6">
                                                  <div className="space-y-3">
                                                       <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                            <h2 className="text-xl font-semibold sm:text-2xl">
                                                                 {selectedNotification.title}
                                                            </h2>
                                                            <Badge variant="outline" className="w-fit">
                                                                 {getNotificationTypeLabel(
                                                                      selectedNotification.notification_type
                                                                 )}
                                                            </Badge>
                                                       </div>

                                                       <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                                                            {selectedNotification.message}
                                                       </p>
                                                  </div>

                                                  <Separator />

                                                  <div className="grid gap-3 sm:grid-cols-2">
                                                       <div className="rounded-2xl border bg-muted/20 p-4">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                 <HugeiconsIcon
                                                                      icon={Calendar}
                                                                      className="h-4 w-4"
                                                                 />
                                                                 <span className="text-xs font-medium uppercase tracking-wide">
                                                                      Received
                                                                 </span>
                                                            </div>
                                                            <p className="mt-2 text-sm sm:text-base">
                                                                 {new Date(
                                                                      selectedNotification.created_at
                                                                 ).toLocaleString()}
                                                            </p>
                                                       </div>

                                                       <div className="rounded-2xl border bg-muted/20 p-4">
                                                            <div className="flex items-center gap-2">
                                                                 {selectedNotification.is_read ? (
                                                                      <>
                                                                           <HugeiconsIcon
                                                                                icon={Eye}
                                                                                className="h-4 w-4 text-green-500"
                                                                           />
                                                                           <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                                                Status
                                                                           </span>
                                                                      </>
                                                                 ) : (
                                                                      <>
                                                                           <HugeiconsIcon
                                                                                icon={EyeOff}
                                                                                className="h-4 w-4 text-orange-500"
                                                                           />
                                                                           <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                                                Status
                                                                           </span>
                                                                      </>
                                                                 )}
                                                            </div>
                                                            <p
                                                                 className={`mt-2 text-sm font-medium sm:text-base ${selectedNotification.is_read ? "text-green-600" : "text-orange-600"}`}
                                                            >
                                                                 {selectedNotification.is_read ? "Read" : "Unread"}
                                                            </p>
                                                       </div>
                                                  </div>

                                                  {selectedNotification.triggered_by && (
                                                       <div className="rounded-2xl border bg-muted/20 p-4">
                                                            <div className="flex items-start gap-3">
                                                                 <HugeiconsIcon
                                                                      icon={User}
                                                                      className="mt-1 h-4 w-4 text-muted-foreground"
                                                                 />
                                                                 <div className="min-w-0">
                                                                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                                           Triggered By
                                                                      </p>
                                                                      <p className="mt-2 text-sm font-medium sm:text-base">
                                                                           {
                                                                                selectedNotification.triggered_by
                                                                                     .first_name
                                                                           }{" "}
                                                                           {
                                                                                selectedNotification.triggered_by
                                                                                     .last_name
                                                                           }
                                                                      </p>
                                                                      <p className="break-all text-sm text-muted-foreground">
                                                                           {
                                                                                selectedNotification.triggered_by
                                                                                     .email
                                                                           }
                                                                      </p>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  )}

                                                  {selectedNotification.appointment_uuid && (
                                                       <div className="rounded-2xl border bg-muted/20 p-4">
                                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                 <div className="flex items-start gap-3">
                                                                      <HugeiconsIcon
                                                                           icon={BuildingIcon}
                                                                           className="mt-1 h-4 w-4 text-muted-foreground"
                                                                      />
                                                                      <div>
                                                                           <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                                                Related Appointment
                                                                           </p>
                                                                           <p className="mt-2 text-sm text-muted-foreground">
                                                                                Open your appointment workspace to
                                                                                continue from this notification.
                                                                           </p>
                                                                      </div>
                                                                 </div>

                                                                 <Button asChild className="w-full sm:w-auto">
                                                                      <Link href={getAppointmentsPath(role)}>
                                                                           Go to appointments
                                                                      </Link>
                                                                 </Button>
                                                            </div>
                                                       </div>
                                                  )}
                                             </div>
                                        ) : (
                                             <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center text-muted-foreground">
                                                  <HugeiconsIcon icon={Circle} className="mb-3 h-12 w-12 opacity-50" />
                                                  <p className="text-base font-medium">
                                                       Select a notification to view details
                                                  </p>
                                                  <p className="mt-1 max-w-md text-sm">
                                                       On smaller screens, tap any notification card above.
                                                       On larger screens, the detail panel stays visible here.
                                                  </p>
                                             </div>
                                        )}
                                   </CardContent>
                              </Card>
                         </div>
                    </div>
               </div>
          </RoleAccessGuard>
     )
}
