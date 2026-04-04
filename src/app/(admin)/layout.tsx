import { AppSidebar } from "@/components/app-sidebar"
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
     SidebarInset,
     SidebarProvider,
     SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bell } from "@hugeicons/core-free-icons"

export default function Layout({ children }: { children: React.ReactNode }) {
     return (
          <SidebarProvider>
               <AppSidebar />
               <SidebarInset>
                    <header className="flex h-18 shrink-0 sticky top-1 z-50 bg-sidebar items-center justify-between gap-2 border-b border-b-sidebar-border  px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                         <div className="flex min-w-0 items-center gap-2">
                              <SidebarTrigger className="-ml-1" />
                              <Separator
                                   orientation="vertical"
                                   className="mr-2 data-[orientation=vertical]:h-6"
                              />
                              <Breadcrumb>
                                   <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                             <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                             <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                        </BreadcrumbItem>
                                   </BreadcrumbList>
                              </Breadcrumb>
                         </div>
                         <div className="flex items-center gap-2">
                              <ThemeToggle />
                              <Button size="icon-lg" variant="outline" className="rounded-full">
                                   <HugeiconsIcon icon={Bell} />
                              </Button>
                         </div>
                    </header>
                    <div className="bg-sidebar min-h-screen flex justify-center p-4 md:p-6">{children}</div>
               </SidebarInset>
          </SidebarProvider>
     )
}
