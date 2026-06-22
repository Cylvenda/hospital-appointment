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
import { Search01Icon, LayoutBottomIcon, RoboticIcon, Settings05Icon, DashboardCircleIcon, UserAccountIcon, CallDoneIcon, Bell, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

const navMain = [
     {
          title: "Dashboard",
          url: "/doctor-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Quick Search",
          url: "/doctor-dashboard/search",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
          ),
     },
     {
          title: "Assigned Patients",
          url: "/doctor-dashboard/appointments/pending",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={RoboticIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Completed Consultations",
          url: "/doctor-dashboard/appointments/completed",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Cancelled Visits",
          url: "/doctor-dashboard/appointments/cancelled",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Cancel01Icon} strokeWidth={2} />
          ),
     },
     {
          title: "Profile",
          url: "/doctor-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Notifications",
          url: "/doctor-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          )
     },
     {
          title: "Settings",
          url: "/doctor-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          ),
     },
]

export function AppDoctorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const user = useAuthUserStore((state) => state.user)
     const displayName =
          `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User"
     const roleLabel = user?.role
          ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
          : "Authenticated User"

     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <TeamSwitcher
                         teams={{
                              name: "Patient Appointment",
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
                              email: user?.email || "No email",
                         }}
                    />
               </SidebarFooter>
               <SidebarRail />
          </Sidebar>
     )
}
