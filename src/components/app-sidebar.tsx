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
import { LayoutBottomIcon, Settings05Icon, DashboardCircleIcon, Doctor01Icon, People, Person, UserGroupIcon, UserAccountIcon, Bell, StethoscopeIcon, Book01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import {
  Ban,
  ChartNoAxesCombined,
  CalendarClock,
  CircleCheckBig,
  ClipboardList,
  CreditCard,
  TestTube,
} from "lucide-react"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

const navMain = [
  {
    titleKey: "nav.dashboard",
    sectionKey: "nav.workspace",
    url: "/dashboard",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.quickSearch",
    sectionKey: "nav.workspace",
    url: "/dashboard/search",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.analyticsReports",
    sectionKey: "nav.workspace",
    url: "/analytics",
    icon: <ChartNoAxesCombined className="size-5 text-primary" />,
  },
  {
    titleKey: "nav.appointmentRegister",
    sectionKey: "nav.appointmentFlow",
    url: "/appointments/all",
    icon: <ClipboardList className="size-5 text-primary" />,
  },
  {
    titleKey: "nav.awaitingPayment",
    sectionKey: "nav.appointmentFlow",
    url: "/appointments/pending",
    icon: <CreditCard className="size-5 text-primary" />,
  },
  {
    titleKey: "nav.todaysArrivalsQueue",
    sectionKey: "nav.appointmentFlow",
    url: "/appointments/accepted",
    icon: <CalendarClock className="size-5 text-primary" />,
  },
  {
    titleKey: "nav.completedVisits",
    sectionKey: "nav.appointmentFlow",
    url: "/appointments/completed",
    icon: <CircleCheckBig className="size-5 text-primary" />,
  },
  {
    titleKey: "nav.cancelledMissed",
    sectionKey: "nav.appointmentFlow",
    url: "/appointments/cancelled",
    icon: <Ban className="size-5 text-primary" />,
  },
  {
    titleKey: "nav.doctors",
    sectionKey: "nav.management",
    url: "/doctors",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Doctor01Icon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.receptionist",
    sectionKey: "nav.management",
    url: "/receptionist",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Person} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.patients",
    sectionKey: "nav.management",
    url: "/patients",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={People} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.users",
    sectionKey: "nav.management",
    url: "/users",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={UserGroupIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.labTech",
    sectionKey: "nav.management",
    url: "/lab-tech",
    icon: <TestTube className="size-5 text-primary" />,
  },
  {
    titleKey: "nav.departments",
    sectionKey: "nav.management",
    url: "/illness-categories",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={StethoscopeIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.healthEducation",
    sectionKey: "nav.management",
    url: "/admin-dashboard/health-education",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Book01Icon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.notifications",
    sectionKey: "nav.account",
    url: "/notifications",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.profile",
    sectionKey: "nav.account",
    url: "/profile",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.settings",
    sectionKey: "nav.account",
    url: "/settings",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Settings05Icon} strokeWidth={2} />
    )
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const user = useAuthUserStore((state) => state.user)
  const displayName =
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || t("roleLabels.user")
  const roleLabel = user?.role
    ? user.role === "admin"
      ? t("roleLabels.admin")
      : t(`roleLabels.${user.role}`)
    : t("nav.authenticatedUser")

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={{
            name: t("nav.patientAppointmentSystem"),
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
