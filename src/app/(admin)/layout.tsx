import { AppSidebar } from "@/components/app-sidebar"
import { CurrentPageBreadcrumb } from "@/components/current-page-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { RoleAccessGuard } from "@/components/role-access-guard"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { ProfileCompletionDialog } from "@/components/profile-completion-dialog"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <RoleAccessGuard allowedRoles={["admin"]}>
                <ProfileCompletionDialog />
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-18 shrink-0 sticky top-0 z-50 bg-sidebar items-center justify-between gap-2 border-b border-b-sidebar-border  px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex min-w-0 items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-6"
                            />
                            <CurrentPageBreadcrumb />
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <NotificationDropdown />
                        </div>
                    </header>
                    <div className="bg-sidebar min-h-screen flex justify-center p-4 md:p-6">{children}</div>
                </SidebarInset>
            </RoleAccessGuard>
        </SidebarProvider>
    )
}
