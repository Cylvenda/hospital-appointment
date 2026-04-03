import { AppSidebar } from "@/components/app-sidebar"
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import {
     SidebarInset,
     SidebarProvider,
     SidebarTrigger,
} from "@/components/ui/sidebar"

export default function layout({ children }: { children: React.ReactNode; }) {
     return (
          <SidebarProvider>
               <AppSidebar />
               <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 bg-muted transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                         <div className="flex items-center gap-2 px-4">
                              <SidebarTrigger className="-ml-1" />
                              <Separator
                                   orientation="vertical"
                                   className="mr-2 data-[orientation=vertical]:h-6"
                              />
                              <Breadcrumb>
                                   <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                             <BreadcrumbLink href="#">
                                                  Dashboard
                                             </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                             <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                        </BreadcrumbItem>
                                   </BreadcrumbList>
                              </Breadcrumb>
                         </div>
                         <div>
                              <Button></Button>
                         </div>
                    </header>
                    <div>
                         {children}
                    </div>
               </SidebarInset>
          </SidebarProvider>
     )
}
