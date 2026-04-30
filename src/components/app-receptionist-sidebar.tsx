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
import { LayoutBottomIcon, RoboticIcon, Settings05Icon, DashboardCircleIcon, Doctor01Icon, UserAccountIcon, Loading, CallDoneIcon, CheckCheck, AllahFreeIcons, Bell, StethoscopeIcon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

const navMain = [
     {
          title: "Dashboard",
          url: "/receptionist-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Appointments",
          url: "#",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={RoboticIcon} strokeWidth={2} />
          ),
          items: [

               {
                    title: "Pending",
                    url: "/receptionist-dashboard/appointments/pending",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={Loading} size={"17"} />
                    ),
               },
               {
                    title: "Accepted",
                    url: "/receptionist-dashboard/appointments/accepted",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={CheckCheck} size={"17"} />
                    ),
               },
               {
                    title: "Completed",
                    url: "/receptionist-dashboard/appointments/completed",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} size={"17"} />
                    ),
               },
               {
                    title: "Cancelled",
                    url: "/receptionist-dashboard/appointments/cancelled",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} size={"17"} />
                    ),
               },
               {
                    title: "All",
                    url: "/receptionist-dashboard/appointments/all",
                    icon: (
                         <HugeiconsIcon color="var(--primary)" icon={AllahFreeIcons} size={"17"} />
                    ),
               },
          ],
     },
     {
          title: "Doctors",
          url: "/receptionist-dashboard/doctors",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Doctor01Icon} strokeWidth={2} />
          ),
     },
     {
          title: "Illness Categories",
          url: "/receptionist-dashboard/illness-categories",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={StethoscopeIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Profile",
          url: "/receptionist-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Notifications",
          url: "/receptionist-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          ),
     },
     {
          title: "Settings",
          url: "/receptionist-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          ),
     },
]

export function AppReceptionistSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
