"use client"

import { usePathname } from "next/navigation"
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useTranslation } from "@/lib/i18n"

function formatSegment(segment: string) {
     return segment
          .split("-")
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
}

export function CurrentPageBreadcrumb() {
     const { t } = useTranslation()
     const pathname = usePathname()
     const segments = pathname.split("/").filter(Boolean)
     const currentSegment = segments.at(-1) ?? "dashboard"
     const currentPage = formatSegment(currentSegment)
     const translatedSegments: Record<string, string> = {
          dashboard: t("nav.dashboard"),
          appointments: t("nav.appointments"),
          patients: t("nav.patients"),
          doctors: t("nav.doctors"),
          analytics: t("nav.analyticsReports"),
          notifications: t("nav.notifications"),
          profile: t("nav.profile"),
          settings: t("nav.settings"),
          pending: t("nav.pending"),
          accepted: t("nav.upcoming"),
          completed: t("nav.completed"),
          cancelled: t("nav.cancelled"),
          all: t("common.all"),
          users: t("nav.users"),
          "lab-tech": t("nav.labTech"),
          "health-education": t("nav.healthEducation"),
          "illness-categories": t("nav.illnessCategories"),
     }
     const currentLabel = translatedSegments[currentSegment] ?? currentPage
     const isDashboard = currentSegment === "dashboard"
     const dashboardLink = pathname.startsWith("/patient-dashboard")
          ? "/patient-dashboard"
          : pathname.startsWith("/receptionist-dashboard")
               ? "/receptionist-dashboard"
               : pathname.startsWith("/doctor-dashboard")
                    ? "/doctor-dashboard"
                    : pathname.startsWith("/lab-tech-dashboard")
                         ? "/lab-tech-dashboard"
                         : "/dashboard"

     return (
          <Breadcrumb className="min-w-0 overflow-hidden">
               <BreadcrumbList className="min-w-0 flex-nowrap">
                    {!isDashboard && (
                         <>
                              <BreadcrumbItem className="hidden md:block">
                                   <BreadcrumbLink href={dashboardLink}>
                                        {t("nav.dashboard")}
                                   </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator className="hidden md:block" />
                         </>
                    )}

                    <BreadcrumbItem className="min-w-0">
                         <BreadcrumbPage className="block truncate">{currentLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
               </BreadcrumbList>
          </Breadcrumb>
     )
}
