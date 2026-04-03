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
import { LayoutBottomIcon, RoboticIcon, BookOpen02Icon, Settings05Icon, DashboardCircleIcon, Doctor01Icon, WorkIcon, People, Person } from "@hugeicons/core-free-icons"
import { Separator } from "./ui/separator"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams:
  {
    name: "Acme Inc",
    logo: (
      <HugeiconsIcon  icon={LayoutBottomIcon} strokeWidth={2} />
    ),
    role: "Patient",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: (
        <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={DashboardCircleIcon} strokeWidth={2} />
      )
    },
    {
      title: "Appointments",
      url: "#",
      icon: (
        <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={RoboticIcon} strokeWidth={2} />
      )
    },
    {
      title: "Doctors",
      url: "#",
      icon: (
        <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={Doctor01Icon} strokeWidth={2} />
      )
    },
    {
      title: "Receptionist",
      url: "#",
      icon: (
        <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={Person} strokeWidth={2} />
      )
    },
    {
      title: "Patients",
      url: "#",
      icon: (
        <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={People} strokeWidth={2} />
      )
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <HugeiconsIcon color="oklch(0.546 0.245 262.881)" icon={Settings05Icon} strokeWidth={2} />
      )
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
