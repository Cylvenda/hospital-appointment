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
import { LayoutBottomIcon, RoboticIcon, Settings05Icon, DashboardCircleIcon, UserAccountIcon, AllahFreeIcons, CallDoneIcon, CheckCheck, Loading, Bell } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

const navMain = [
     {
          title: "Dashboard",
          url: "/patient-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          )
     },
     {
          title: "Appointments",
          url: "#",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={RoboticIcon} strokeWidth={2} />
          ),
          items: [
               {
                    title: "Create New",
                    url: "/patient-dashboard/appointments",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={Loading} size={"17"} />
                    ),
               },
               {
                    title: "Pending",
                    url: "/patient-dashboard/appointments/pending",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={Loading} size={"17"} />
                    ),
               },
               {
                    title: "Accepted",
                    url: "/patient-dashboard/appointments/accepted",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={CheckCheck} size={"17"} />
                    ),
               },
               {
                    title: "Completed",
                    url: "/patient-dashboard/appointments/completed",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} size={"17"} />
                    ),
               },
               {
                    title: "Cancelled",
                    url: "/patient-dashboard/appointments/cancelled",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} size={"17"} />
                    ),
               },
               {
                    title: "All",
                    url: "/patient-dashboard/appointments/all",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={AllahFreeIcons} size={"17"} />
                    ),
               },
          ],
     },
     {
          title: "Profile",
          url: "/patient-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          )
     },
     {
          title: "Notifications",
          url: "/patient-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          )
     },
     {
          title: "Settings",
          url: "/patient-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          )
     }
]

export function AppPatientSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                              name: "Meeting Hub",
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
