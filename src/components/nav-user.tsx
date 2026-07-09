"use client"

import { useRouter } from "next/navigation"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { HugeiconsIcon } from "@hugeicons/react"
import { LogoutIcon } from "@hugeicons/core-free-icons"
import { toast } from "react-toastify"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  }
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const { state } = useSidebar()
  const logout = useAuthUserStore((state) => state.logout)
  const isCollapsed = state === "collapsed"
  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"

  async function handleLogout() {
    try {
      await logout()
      router.replace("/login")
      router.refresh()
    } catch {
      toast.error(t("nav.logoutError"))
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={cn(
            "rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/40 p-3 space-y-3",
            isCollapsed && "flex justify-center p-2"
          )}
        >
          {isCollapsed ? (
            <Avatar className="h-9 w-9 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start rounded-xl px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => void handleLogout()}
              >
                <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} className="mr-2 size-4" />
                {t("nav.logOut")}
              </Button>
            </>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
