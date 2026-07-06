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
import { DashboardCircleIcon, UserAccountIcon, Bell, Settings05Icon, Medicine01Icon, File01Icon, TaskDone01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

const navMain = [
     {
          titleKey: "nav.dashboard",
          url: "/lab-tech-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.quickSearch",
          url: "/lab-tech-dashboard/search",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.labRequests",
          url: "/lab-tech-dashboard/requests",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Medicine01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.labResults",
          url: "/lab-tech-dashboard/results",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={File01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.testTypes",
          url: "/lab-tech-dashboard/test-types",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={TaskDone01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.profile",
          url: "/lab-tech-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.notifications",
          url: "/lab-tech-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.settings",
          url: "/lab-tech-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          ),
     },
]

export function AppLabTechSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const { t } = useTranslation()
     const user = useAuthUserStore((state) => state.user)
     const displayName =
          `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User"
     const roleLabel = user?.role
          ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace("_", " ")
          : t("nav.authenticatedUser")

     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <TeamSwitcher
                         teams={{
                              name: t("nav.laboratoryHub"),
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
                              email: user?.email || t("nav.noEmail"),
                         }}
                    />
               </SidebarFooter>
               <SidebarRail />
          </Sidebar>
     )
}
