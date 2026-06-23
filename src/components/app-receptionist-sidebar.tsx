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
import { LayoutBottomIcon, RoboticIcon, Settings05Icon, DashboardCircleIcon, Doctor01Icon, UserAccountIcon, CallDoneIcon, CheckCheck, AllahFreeIcons, Bell, StethoscopeIcon, Book01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

const navMain = [
     {
          titleKey: "nav.dashboard",
          url: "/receptionist-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.quickSearch",
          url: "/receptionist-dashboard/search",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.newRequests",
          url: "/receptionist-dashboard/appointments/pending",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={RoboticIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.assignments",
          url: "/receptionist-dashboard/appointments/assignments",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CheckCheck} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.completedQueue",
          url: "/receptionist-dashboard/appointments/completed",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.cancelledQueue",
          url: "/receptionist-dashboard/appointments/cancelled",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.allAppointments",
          url: "/receptionist-dashboard/appointments/all",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={AllahFreeIcons} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.doctors",
          url: "/receptionist-dashboard/doctors",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Doctor01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.illnessCategories",
          url: "/receptionist-dashboard/illness-categories",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={StethoscopeIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.healthEducation",
          url: "/receptionist-dashboard/health-education",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Book01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.profile",
          url: "/receptionist-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.notifications",
          url: "/receptionist-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.settings",
          url: "/receptionist-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          ),
     },
]

export function AppReceptionistSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                              name: t("nav.patientAppointment"),
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
