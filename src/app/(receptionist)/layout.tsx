import { AppReceptionistSidebar } from "@/components/app-receptionist-sidebar"
import { CurrentPageBreadcrumb } from "@/components/current-page-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { RoleAccessGuard } from "@/components/role-access-guard"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { ProfileCompletionDialog } from "@/components/profile-completion-dialog"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <RoleAccessGuard allowedRoles={["receptionist"]}>
                <ProfileCompletionDialog />
                <AppReceptionistSidebar />
                <SidebarInset>
                    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-1 border-b border-b-sidebar-border bg-sidebar px-2 transition-[width,height] ease-linear sm:gap-2 sm:px-4 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-1 hidden data-[orientation=vertical]:h-6 sm:block md:mr-2"
                            />
                            <CurrentPageBreadcrumb />
                        </div>
                        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                            <LanguageToggle />
                            <ThemeToggle />
                            <NotificationDropdown />
                        </div>
                    </header>
                    <main className="flex min-h-[calc(100dvh-4rem)] w-full min-w-0 justify-center overflow-x-clip bg-sidebar p-2 sm:p-4 md:p-6">{children}</main>
                </SidebarInset>
            </RoleAccessGuard>
        </SidebarProvider>
    )
}
