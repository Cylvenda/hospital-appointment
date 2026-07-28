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
import { Search01Icon, LayoutBottomIcon, Settings05Icon, DashboardCircleIcon, UserAccountIcon, CallDoneIcon, Bell, Cancel01Icon } from "@hugeicons/core-free-icons"
import {
     ChartNoAxesCombined,
     ClipboardList,
} from "lucide-react"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

const navMain = [
     {
          titleKey: "nav.dashboard",
          sectionKey: "nav.workspace",
          url: "/doctor-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.quickSearch",
          sectionKey: "nav.workspace",
          url: "/doctor-dashboard/search",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.analyticsReports",
          sectionKey: "nav.workspace",
          url: "/doctor-dashboard/analytics",
          icon: <ChartNoAxesCombined className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.todaysPatients",
          sectionKey: "nav.clinicalFlow",
          url: "/doctor-dashboard/appointments/pending",
          icon: <ClipboardList className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.completedConsultations",
          sectionKey: "nav.clinicalFlow",
          url: "/doctor-dashboard/appointments/completed",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.cancelledVisits",
          sectionKey: "nav.clinicalFlow",
          url: "/doctor-dashboard/appointments/cancelled",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Cancel01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.profile",
          sectionKey: "nav.account",
          url: "/doctor-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.notifications",
          sectionKey: "nav.account",
          url: "/doctor-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          )
     },
     {
          titleKey: "nav.settings",
          sectionKey: "nav.account",
          url: "/doctor-dashboard/settings",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
          ),
     },
]

export function AppDoctorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const { t } = useTranslation()
     const user = useAuthUserStore((state) => state.user)
     const displayName =
          `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || t("roleLabels.user")
     const roleLabel = user?.role
          ? t(`roleLabels.${user.role}`)
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
