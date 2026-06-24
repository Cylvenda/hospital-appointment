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
import { LayoutBottomIcon, Settings05Icon, DashboardCircleIcon, Doctor01Icon, People, Person, UserGroupIcon, UserAccountIcon, AllahFreeIcons, CallDoneIcon, CheckCheck, Loading, Bell, StethoscopeIcon, Book01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"
import { formatRoleLabel } from "@/lib/format-role"

const navMain = [
  {
    titleKey: "nav.dashboard",
    url: "/dashboard",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={DashboardCircleIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.quickSearch",
    url: "/dashboard/search",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Search01Icon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.illnessCategories",
    url: "/illness-categories",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={StethoscopeIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.healthEducation",
    url: "/health-education",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Book01Icon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.newAppointments",
    url: "/appointments/pending",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Loading} strokeWidth={2} />
    ),
  },
  {
    titleKey: "nav.assignments",
    url: "/appointments/assignments",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={CheckCheck} strokeWidth={2} />
    ),
  },
  {
    titleKey: "nav.completed",
    url: "/appointments/completed",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
    ),
  },
  {
    titleKey: "nav.cancelled",
    url: "/appointments/cancelled",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={CallDoneIcon} strokeWidth={2} />
    ),
  },
  {
    titleKey: "nav.allAppointments",
    url: "/appointments/all",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={AllahFreeIcons} strokeWidth={2} />
    ),
  },
  {
    titleKey: "nav.doctors",
    url: "/doctors",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Doctor01Icon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.receptionist",
    url: "/receptionist",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Person} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.patients",
    url: "/patients",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={People} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.users",
    url: "/users",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={UserGroupIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.profile",
    url: "/profile",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={UserAccountIcon} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.notifications",
    url: "/notifications",
    icon: (
      <HugeiconsIcon color="var(--primary)" icon={Bell} strokeWidth={2} />
    )
  },
  {
    titleKey: "nav.settings",
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
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User"
  const roleLabel = user?.role
    ? user.role === "admin"
      ? "ICT Officer"
      : formatRoleLabel(user.role)
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
