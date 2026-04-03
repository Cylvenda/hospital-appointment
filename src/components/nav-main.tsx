"use client"

import {
  Collapsible,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <div
            key={item.title}
            className="group/collapsible"
          >
            <SidebarMenuItem className="p-1">
              <SidebarMenuButton tooltip={item.title}>
                {item.icon}
                <Link href={item.url}>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
