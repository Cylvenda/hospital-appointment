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
import { LayoutBottomIcon, RoboticIcon, Settings05Icon, DashboardCircleIcon, Doctor01Icon, People, Person, UserGroupIcon, UserAccountIcon } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={DashboardCircleIcon} strokeWidth={2} />
    )
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={RoboticIcon} strokeWidth={2} />
    )
  },
  {
    title: "Doctors",
    url: "/doctors",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={Doctor01Icon} strokeWidth={2} />
    )
  },
  {
    title: "Receptionist",
    url: "/receptionist",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={Person} strokeWidth={2} />
    )
  },
  {
    title: "Patients",
    url: "/patients",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={People} strokeWidth={2} />
    )
  },
  {
    title: "Users",
    url: "/users",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={UserGroupIcon} strokeWidth={2} />
    )
  },
  {
    title: "Profile",
    url: "/profile",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={UserAccountIcon} strokeWidth={2} />
    )
  },
  {
    title: "Settings",
    url: "/settings",
    icon: (
      <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={Settings05Icon} strokeWidth={2} />
    )
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
