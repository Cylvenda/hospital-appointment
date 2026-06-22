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
import { LayoutBottomIcon, DashboardCircleIcon, UserAccountIcon, Bell, Settings05Icon, Medicine01Icon, File01Icon, TaskDone01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

const navMain = [
     {
          title: "Dashboard",
          url: "/lab-tech-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Quick Search",
          url: "/lab-tech-dashboard/search",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
          ),
     },
     {
          title: "Lab Requests",
          url: "/lab-tech-dashboard/requests",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Medicine01Icon} strokeWidth={2} />
          ),
     },
     {
          title: "Lab Results",
          url: "/lab-tech-dashboard/results",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={File01Icon} strokeWidth={2} />
          ),
     },
     {
          title: "Test Types",
          url: "/lab-tech-dashboard/test-types",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={TaskDone01Icon} strokeWidth={2} />
          ),
     },
     {
          title: "Profile",
          url: "/lab-tech-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          ),
     },
     {
          title: "Notifications",
          url: "/lab-tech-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          ),
     },
     {
          title: "Settings",
          url: "/lab-tech-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          ),
     },
]

export function AppLabTechSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const user = useAuthUserStore((state) => state.user)
     const displayName =
          `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User"
     const roleLabel = user?.role
          ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace("_", " ")
          : "Authenticated User"

     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <TeamSwitcher
                         teams={{
                              name: "Laboratory",
                              logo: <HugeiconsIcon icon={Medicine01Icon} strokeWidth={2} />,
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
