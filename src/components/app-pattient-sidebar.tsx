"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarHeader,
     SidebarRail,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon, RoboticIcon, Settings05Icon, DashboardCircleIcon, UserAccountIcon, AllahFreeIcons, CallDoneIcon, CheckCheck, Loading, Bell, Book01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

const navMain = [
     {
          titleKey: "nav.dashboard",
          url: "/patient-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          )
     },
     {
          titleKey: "nav.bookAppointment",
          url: "/patient-dashboard/appointments",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={RoboticIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.pending",
          url: "/patient-dashboard/appointments/pending",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Loading} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.upcoming",
          url: "/patient-dashboard/appointments/accepted",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CheckCheck} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.completedVisits",
          url: "/patient-dashboard/appointments/completed",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.cancelledVisits",
          url: "/patient-dashboard/appointments/cancelled",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.allHistory",
          url: "/patient-dashboard/appointments/all",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={AllahFreeIcons} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.healthEducation",
          url: "/patient-dashboard/health-education",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Book01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.profile",
          url: "/patient-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          )
     },
     {
          titleKey: "nav.notifications",
          url: "/patient-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          )
     },
     {
          titleKey: "nav.settings",
          url: "/patient-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          )
     }
]

export function AppPatientSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const { t } = useTranslation()
     const user = useAuthUserStore((state) => state.user)
     const displayName =
          `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User"
     const roleLabel = user?.role
          ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
          : t("nav.authenticatedUser")

     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <TeamSwitcher
                         teams={{
                              name: t("nav.meetingHub"),
                              logo: <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} />,
                              role: roleLabel,
                         }}
                    />
               </SidebarHeader>
               <Separator />
               <SidebarContent>
                    <NavMain items={navMain} />
               </SidebarContent>
               <Separator />
               <SidebarFooter>
                    <NavUser
                         user={{
                              name: displayName,
                              email: user?.email || t("nav.noEmail"),
                         }}
                    />
               </SidebarFooter>
               <SidebarRail />
          </Sidebar>
     )
}
