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
import { LayoutBottomIcon, Settings05Icon, DashboardCircleIcon, Doctor01Icon, UserAccountIcon, Bell, StethoscopeIcon, Book01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import {
     Ban,
     ChartNoAxesCombined,
     CalendarClock,
     CircleCheckBig,
     ClipboardList,
     CreditCard,
} from "lucide-react"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

const navMain = [
     {
          titleKey: "nav.dashboard",
          sectionKey: "nav.workspace",
          url: "/receptionist-dashboard",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.quickSearch",
          sectionKey: "nav.workspace",
          url: "/receptionist-dashboard/search",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.analyticsReports",
          sectionKey: "nav.workspace",
          url: "/receptionist-dashboard/analytics",
          icon: <ChartNoAxesCombined className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.appointmentRegister",
          sectionKey: "nav.appointmentFlow",
          url: "/receptionist-dashboard/appointments/all",
          icon: <ClipboardList className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.awaitingPayment",
          sectionKey: "nav.appointmentFlow",
          url: "/receptionist-dashboard/appointments/pending",
          icon: <CreditCard className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.todaysArrivalsQueue",
          sectionKey: "nav.appointmentFlow",
          url: "/receptionist-dashboard/appointments/assignments",
          icon: <CalendarClock className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.completedVisits",
          sectionKey: "nav.appointmentFlow",
          url: "/receptionist-dashboard/appointments/completed",
          icon: <CircleCheckBig className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.cancelledMissed",
          sectionKey: "nav.appointmentFlow",
          url: "/receptionist-dashboard/appointments/cancelled",
          icon: <Ban className="size-5 text-primary" />,
     },
     {
          titleKey: "nav.doctors",
          sectionKey: "nav.management",
          url: "/receptionist-dashboard/doctors",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Doctor01Icon} strokeWidth={2} />
          ),
     },
     {
           titleKey: "nav.departments",
           sectionKey: "nav.management",
           url: "/receptionist-dashboard/illness-categories",
           icon: (
                <HugeiconsIcon color="var(--primary)" icon={StethoscopeIcon} strokeWidth={2} />
           ),
     },
     {
          titleKey: "nav.healthEducation",
          sectionKey: "nav.management",
          url: "/receptionist-dashboard/health-education",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Book01Icon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.notifications",
          sectionKey: "nav.account",
          url: "/receptionist-dashboard/notifications",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.profile",
          sectionKey: "nav.account",
          url: "/receptionist-dashboard/profile",
          icon: (
               <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
          ),
     },
     {
          titleKey: "nav.settings",
          sectionKey: "nav.account",
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
