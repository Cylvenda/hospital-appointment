"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
    sectionKey?: string
  }[]
}) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const sections = Array.from(
    items.reduce((groups, item) => {
      const sectionKey = item.sectionKey ?? "nav.platform"
      const entries = groups.get(sectionKey) ?? []
      entries.push(item)
      groups.set(sectionKey, entries)
      return groups
    }, new Map<string, typeof items>())
  )

  return (
    <>
      {sections.map(([sectionKey, sectionItems]) => (
        <SidebarGroup key={sectionKey}>
          <SidebarGroupLabel>{t(sectionKey)}</SidebarGroupLabel>
          <SidebarMenu>
            {sectionItems.map((item) => {
              const title = item.titleKey ? t(item.titleKey) : item.title || ""
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    tooltip={title}
                    isActive={item.isActive ?? pathname === item.url}
                    asChild
                  >
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
      ))}
    </>
  )
}
