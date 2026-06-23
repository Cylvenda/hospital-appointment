"use client"

import * as React from "react"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslation } from "@/lib/i18n"

export function NavMain({
  items,
}: {
  items: {
    titleKey?: string
    title?: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
  }[]
}) {
  const { t } = useTranslation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const title = item.titleKey ? t(item.titleKey) : item.title || ""
          return (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton tooltip={title} asChild>
                <Link className="flex flex-row items-center gap-2" href={item.url}>
                  {item.icon}
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
